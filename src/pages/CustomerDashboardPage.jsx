import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  Phone,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Star,
  Search,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyRequests, updateRequestStatus } from '../services/requestService';
import { createReview } from '../services/reviewService';

const CustomerDashboardPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Review modal state
  const [selectedRequestForReview, setSelectedRequestForReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getMyRequests();
      if (res?.requests) {
        setRequests(res.requests);
      }
    } catch (err) {
      console.warn('Could not fetch requests, using demo state');
      // Fallback demo requests for development preview
      setRequests([
        {
          _id: 'req-demo-1',
          serviceType: 'Sanitary & Water Pump Fitting',
          description: 'Bathroom wash basin pipe is leaking constantly and water pressure is very low.',
          location: { address: 'Flat 402, Al-Razi Heights', city: 'Karachi', area: 'Gulshan Block 13-D' },
          preferredDate: new Date().toISOString(),
          preferredTime: 'Morning (9:00 AM - 12:00 PM)',
          status: 'pending',
          estimatedPrice: 600,
          createdAt: new Date().toISOString(),
          workerId: {
            _id: 'w-1',
            name: 'Ustad Tariq Mehmood',
            phone: '0300-2345678',
            profileImage: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
          },
          categoryId: { name: 'Plumber', icon: '🔧' },
        },
        {
          _id: 'req-demo-2',
          serviceType: 'UPS Wiring & Battery Inspection',
          description: 'Installed new dry battery, need main distribution board changeover switch.',
          location: { address: 'House 12, Street 4', city: 'Karachi', area: 'Gulshan' },
          preferredDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          preferredTime: 'Afternoon (12:00 PM - 4:00 PM)',
          status: 'completed',
          finalPrice: 1500,
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
          workerId: {
            _id: 'w-2',
            name: 'Muhammad Rashid',
            phone: '0321-4567890',
            profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          },
          categoryId: { name: 'Electrician', icon: '⚡' },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancelRequest = async (id) => {
    if (!window.confirm('Kya aap waqai yeh service request cancel karna chahte hain?')) return;
    try {
      await updateRequestStatus(id, { status: 'cancelled', note: 'Cancelled by customer' });
      setStatusMessage({ type: 'success', text: 'Service request cancel ho gayi.' });
      fetchRequests();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Could not cancel request.' });
    }
  };

  const handleOpenReviewModal = (req) => {
    setSelectedRequestForReview(req);
    setReviewRating(5);
    setReviewHoverRating(0);
    setReviewComment('');
    setReviewError('');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedRequestForReview) return;
    if (!reviewComment.trim() || reviewComment.trim().length < 5) {
      setReviewError('Feedback comment must be at least 5 characters long.');
      return;
    }

    setReviewSubmitting(true);
    setReviewError('');
    try {
      await createReview({
        serviceRequestId: selectedRequestForReview._id,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });

      setStatusMessage({
        type: 'success',
        text: `Shukriya! ${selectedRequestForReview.workerId?.name} ke liye aapka review darj ho gaya.`,
      });

      // Mark locally as reviewed
      setRequests((prev) =>
        prev.map((r) =>
          r._id === selectedRequestForReview._id ? { ...r, isReviewed: true } : r
        )
      );

      setSelectedRequestForReview(null);
    } catch (err) {
      setReviewError(
        err.response?.data?.message || 'Review darj karne mein masla pesh aya. Dobara koshish karein.'
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'rejected':
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const filtered = requests.filter((r) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return r.status === 'pending';
    if (activeTab === 'active') return ['accepted', 'in_progress'].includes(r.status);
    if (activeTab === 'completed') return r.status === 'completed';
    if (activeTab === 'cancelled') return ['cancelled', 'rejected'].includes(r.status);
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Meri Service Requests ({requests.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track status, chat/call with hired workers, and rate completed services.
          </p>
        </div>

        <Link
          to="/workers"
          className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-700 text-white rounded-2xl text-xs sm:text-sm font-bold hover:bg-emerald-800 transition shadow-md shadow-emerald-700/20"
        >
          <Search className="w-4 h-4" />
          <span>Naya Worker Talash Karein</span>
        </Link>
      </div>

      {statusMessage.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-medium ${
          statusMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-rose-100 text-rose-800 border border-rose-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        {[
          { key: 'all', label: `All Requests (${requests.length})` },
          { key: 'pending', label: `Pending (${requests.filter((r) => r.status === 'pending').length})` },
          { key: 'active', label: `Active Jobs (${requests.filter((r) => ['accepted', 'in_progress'].includes(r.status)).length})` },
          { key: 'completed', label: `Completed (${requests.filter((r) => r.status === 'completed').length})` },
          { key: 'cancelled', label: `Cancelled` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 rounded-t-xl transition whitespace-nowrap cursor-pointer ${
              activeTab === tab.key
                ? 'border-b-2 border-emerald-700 text-emerald-800 bg-emerald-50/50'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
          <span className="text-sm font-medium text-slate-500">Service requests load ho rahi hain...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Koi Service Request Mojood Nahi</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Is category mein koi booking nahi hai. Aap kisi bhi verified worker ke profile par ja kar service request bhej sakte hain.
          </p>
          <Link
            to="/workers"
            className="inline-block px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800"
          >
            Find Worker Now
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-emerald-500 transition"
            >
              {/* Left Info */}
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border uppercase ${getStatusBadge(req.status)}`}>
                    ● {req.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <span>{req.categoryId?.icon || '🔧'}</span>
                    <span>{req.serviceType}</span>
                  </span>
                  <span className="text-xs text-slate-400">
                    ID: #{req._id.substring(req._id.length - 6)}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  "{req.description}"
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(req.preferredDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {req.preferredTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {req.location?.area}, {req.location?.city}
                  </span>
                </div>
              </div>

              {/* Middle Worker Identity */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 min-w-[200px]">
                <img
                  src={req.workerId?.profileImage || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80'}
                  alt={req.workerId?.name}
                  className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{req.workerId?.name}</h4>
                  <p className="text-[11px] text-slate-500">{req.workerId?.phone}</p>
                </div>
              </div>

              {/* Right Price & Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Charges</span>
                  <p className="text-base font-extrabold text-emerald-800">
                    Rs. {req.finalPrice || req.estimatedPrice || '---'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {['pending', 'accepted'].includes(req.status) && (
                    <button
                      onClick={() => handleCancelRequest(req._id)}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}

                  {req.status === 'completed' && (
                    req.isReviewed ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold rounded-xl text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Reviewed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenReviewModal(req)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition shadow-sm cursor-pointer"
                      >
                        <Star className="w-3.5 h-3.5 fill-slate-950" />
                        <span>Rate & Review</span>
                      </button>
                    )
                  )}

                  <a
                    href={`tel:${req.workerId?.phone}`}
                    className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-xl transition"
                    title="Call Worker"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* REVIEW & RATING MODAL */}
      {selectedRequestForReview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedRequestForReview(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full">
                  Feedback & Rating
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                Rate Your Experience
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Aapka review doosre logon ko behtareen hunarmand talash karne mein madad dega.
              </p>
            </div>

            {/* Worker Summary Mini Banner */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
              <img
                src={selectedRequestForReview.workerId?.profileImage || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80'}
                alt={selectedRequestForReview.workerId?.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {selectedRequestForReview.workerId?.name}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {selectedRequestForReview.serviceType}
                </p>
              </div>
            </div>

            {reviewError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{reviewError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                  Rating: {reviewHoverRating || reviewRating} / 5 Stars
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHoverRating(star)}
                      onMouseLeave={() => setReviewHoverRating(0)}
                      className="p-1 text-slate-300 hover:scale-125 transition duration-150 cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          (reviewHoverRating || reviewRating) >= star
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {reviewRating === 5 && 'Outstanding ⭐⭐⭐⭐⭐'}
                    {reviewRating === 4 && 'Very Good ⭐⭐⭐⭐'}
                    {reviewRating === 3 && 'Average ⭐⭐⭐'}
                    {reviewRating === 2 && 'Needs Improvement ⭐⭐'}
                    {reviewRating === 1 && 'Unsatisfied ⭐'}
                  </span>
                </div>
              </div>

              {/* Feedback Comment */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-2">
                  Aapki Rayee (Customer Feedback)
                </label>
                <textarea
                  rows="4"
                  required
                  minLength={5}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Kaam kaisa laga? Worker waqt par aya? Kaam ki safai aur quality kaisi thi? (Kam az kam 5 alfaz likhein)..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-500 font-medium"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRequestForReview(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {reviewSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Darj Ho Raha Hai...</span>
                    </>
                  ) : (
                    <span>Submit Review (Rayee Dein)</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboardPage;
