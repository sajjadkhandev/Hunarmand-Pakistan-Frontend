import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  Star,
  MapPin,
  Clock,
  Briefcase,
  Phone,
  MessageSquare,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowLeft,
  Loader2,
  Image as ImageIcon,
  X,
  Send,
  AlertCircle,
} from 'lucide-react';
import { fetchWorkerById } from '../services/workerService';
import { createServiceRequest } from '../services/requestService';
import { getOrCreateConversation } from '../services/chatService';
import { useAuth } from '../context/AuthContext';
import { fallbackWorkers } from '../data/fallbackWorkers';

const WorkerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isCustomer } = useAuth();

  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Booking Modal State
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const [bookingForm, setBookingForm] = useState({
    serviceType: '',
    description: '',
    address: '',
    city: user?.city || 'Karachi',
    area: user?.area || '',
    preferredDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    preferredTime: 'Morning (9:00 AM - 12:00 PM)',
  });

  useEffect(() => {
    setLoading(true);
    fetchWorkerById(id)
      .then((res) => {
        if (res?.worker) {
          setWorker(res.worker);
          setReviews(res.reviews || []);
          setBookingForm((prev) => ({
            ...prev,
            serviceType: res.worker.skillTitle || res.worker.category?.name || 'General Service',
            city: user?.city || res.worker.city,
            area: user?.area || res.worker.area,
          }));
        } else {
          const fallbackWorker = fallbackWorkers.find((w) => w._id === id || w.userId?._id === id) || fallbackWorkers[0];
          setWorker(fallbackWorker);
          setBookingForm((prev) => ({
            ...prev,
            serviceType: fallbackWorker.skillTitle || fallbackWorker.category?.name || 'General Service',
            city: user?.city || fallbackWorker.city,
            area: user?.area || fallbackWorker.area,
          }));
        }
      })
      .catch(() => {
        const fallbackWorker = fallbackWorkers.find((w) => w._id === id || w.userId?._id === id) || fallbackWorkers[0];
        setWorker(fallbackWorker);
        setBookingForm((prev) => ({
          ...prev,
          serviceType: fallbackWorker.skillTitle || fallbackWorker.category?.name || 'General Service',
          city: user?.city || fallbackWorker.city,
          area: user?.area || fallbackWorker.area,
        }));
      })
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleOpenBooking = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    setShowBookingModal(true);
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    const targetWorkerData = {
      _id: worker.userId?._id || worker._id,
      name: worker.userId?.name || worker.name || worker.skillTitle,
      role: 'worker',
      phone: worker.userId?.phone || worker.phone || '0300-1234567',
      city: worker.city,
      profileImage: worker.userId?.profileImage || worker.profileImage,
      skillTitle: worker.skillTitle || worker.category?.name,
      startingPrice: worker.startingPrice,
    };
    try {
      const recipientId = worker.userId?._id || worker.userId;
      const res = await getOrCreateConversation(recipientId);
      if (res?.conversation?._id) {
        navigate(`/messages?conversationId=${res.conversation._id}`, {
          state: { targetWorker: targetWorkerData },
        });
      } else {
        navigate('/messages', { state: { targetWorker: targetWorkerData } });
      }
    } catch (err) {
      navigate('/messages', { state: { targetWorker: targetWorkerData } });
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingError('');

    try {
      const payload = {
        workerId: worker.userId?._id || worker.userId,
        categoryId: worker.category?._id || worker.category,
        serviceType: bookingForm.serviceType,
        description: bookingForm.description,
        location: {
          address: bookingForm.address,
          city: bookingForm.city,
          area: bookingForm.area,
        },
        preferredDate: bookingForm.preferredDate,
        preferredTime: bookingForm.preferredTime,
        estimatedPrice: worker.startingPrice,
      };

      const res = await createServiceRequest(payload);
      if (res?.success) {
        setBookingSuccess(true);
      }
    } catch (err) {
      setBookingError(err.message || 'Could not submit service request.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
        <span className="text-sm font-medium text-slate-500">Worker profile load ho rahi hai...</span>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Worker Not Found</h2>
        <p className="text-xs text-slate-500">Yeh profile mojood nahi hai.</p>
        <Link to="/workers" className="inline-block px-4 py-2 bg-emerald-700 text-white rounded-xl text-sm font-semibold">
          Workers Directory Par Jaein
        </Link>
      </div>
    );
  }

  const isVerified = worker.verificationStatus === 'verified';
  const availabilityColors = {
    available: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    busy: 'bg-amber-100 text-amber-800 border-amber-300',
    offline: 'bg-slate-100 text-slate-600 border-slate-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Wapis (Back)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Worker Bio & Details */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6 items-start">
            <img
              src={worker.userId?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
              alt={worker.userId?.name}
              className="w-28 h-28 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
            />

            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {worker.userId?.name}
                </h1>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Worker
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                    Not Verified
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-emerald-800 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>{worker.category?.icon} {worker.skillTitle || worker.category?.name}</span>
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{worker.averageRating || '5.0'}</span>
                  <span className="text-slate-400 font-normal">({worker.totalReviews || 0} reviews)</span>
                </div>

                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{worker.area}, {worker.city}</span>
                </div>

                <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{worker.completedJobsCount || 0} Jobs Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* About / Bio Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Worker Ke Baare Mein (About)</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {worker.bio}
            </p>
          </div>

          {/* Sub-services Offered */}
          {worker.services && worker.services.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Services & Rates (Tareeqay)</h3>
              <div className="divide-y divide-slate-100">
                {worker.services.map((svc, i) => (
                  <div key={i} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-bold text-slate-900">{svc.name}</p>
                      {svc.description && <p className="text-xs text-slate-500">{svc.description}</p>}
                    </div>
                    {svc.price && (
                      <span className="font-extrabold text-emerald-700">
                        Rs. {svc.price}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio Images Gallery */}
          {worker.portfolioImages && worker.portfolioImages.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-700" />
                <span>Pichla Kaam (Portfolio Gallery)</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {worker.portfolioImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Portfolio work ${idx + 1}`}
                    className="w-full h-36 object-cover rounded-2xl border border-slate-200 shadow-sm hover:scale-105 transition duration-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                Customer Reviews ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{worker.averageRating || '5.0'} / 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500">Is worker ke liye abhi koi review nahi likha gaya.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center uppercase">
                          {rev.customerId?.name?.charAt(0) || 'C'}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{rev.customerId?.name}</span>
                        <span className="text-[11px] text-slate-400">• {rev.customerId?.city}</span>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing & Booking Action Card */}
        <div className="lg:col-span-4 sticky top-24 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase text-slate-400 block">Starting Service Rate</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-extrabold text-emerald-800">
                  Rs. {worker.startingPrice}
                </span>
                <span className="text-xs text-slate-500">/ starting charge</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border flex items-center justify-between text-xs font-bold capitalize">
              <span className="text-slate-600">Availability:</span>
              <span className={`px-2.5 py-0.5 rounded-full border ${availabilityColors[worker.availability] || availabilityColors.available}`}>
                ● {worker.availability || 'Available'}
              </span>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> Working Hours:</span>
                <span className="font-semibold text-slate-800">{worker.workingHours || '9am - 7pm'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> Experience:</span>
                <span className="font-semibold text-slate-800">{worker.experience} Saal (Years)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> Service Area:</span>
                <span className="font-semibold text-slate-800">{worker.area}, {worker.city}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <button
                onClick={handleOpenBooking}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Request Service (Hiring)</span>
              </button>

              <a
                href={`tel:${worker.userId?.phone}`}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold rounded-2xl transition flex items-center justify-center gap-2 text-xs"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Directly: {worker.userId?.phone}</span>
              </a>

              <button
                type="button"
                onClick={handleStartChat}
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold rounded-2xl transition flex items-center justify-center gap-2 text-xs cursor-pointer shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Chat with Worker (4-Min Live Consultation)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE REQUEST / HIRING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowBookingModal(false);
                setBookingSuccess(false);
              }}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Request Sent Successfully!</h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Aapki request <strong className="text-slate-900">{worker.userId?.name}</strong> ko mosool ho chuki hai. Worker status update karega.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/customer/dashboard"
                    className="flex-1 py-3 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800 transition text-center"
                  >
                    Track in Customer Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setShowBookingModal(false);
                      setBookingSuccess(false);
                    }}
                    className="py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-200 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Direct Booking
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Request Service from {worker.userId?.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Apne masle ki tafseel aur munasib waqt darj karein.
                  </p>
                </div>

                {bookingError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Service Type</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.serviceType}
                    onChange={(e) => setBookingForm({ ...bookingForm, serviceType: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                    Problem Description (Masla Kya Hai?)
                  </label>
                  <textarea
                    rows="3"
                    required
                    minLength={10}
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                    placeholder="Maslay ki tafseel likhein (e.g. Bathroom pipe leak kar raha hai aur pressure kam hai)..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      required
                      value={bookingForm.preferredDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Preferred Time Slot</label>
                    <select
                      value={bookingForm.preferredTime}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600 font-medium"
                    >
                      <option>Morning (9:00 AM - 12:00 PM)</option>
                      <option>Afternoon (12:00 PM - 4:00 PM)</option>
                      <option>Evening (4:00 PM - 8:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.city}
                      onChange={(e) => setBookingForm({ ...bookingForm, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Area / Town</label>
                    <input
                      type="text"
                      required
                      value={bookingForm.area}
                      onChange={(e) => setBookingForm({ ...bookingForm, area: e.target.value })}
                      placeholder="e.g. Gulshan Block 13-D"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">Detailed Street Address</label>
                  <input
                    type="text"
                    required
                    value={bookingForm.address}
                    onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                    placeholder="House # / Flat #, Street #, Landmark"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="font-semibold text-emerald-900">Estimated Starting Charge:</span>
                  <span className="font-extrabold text-emerald-800 text-sm">Rs. {worker.startingPrice}</span>
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Send Service Request</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerDetailsPage;
