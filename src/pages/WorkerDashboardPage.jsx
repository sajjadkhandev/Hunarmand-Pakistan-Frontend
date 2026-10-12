import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  ShieldCheck,
  ShieldAlert,
  Clock,
  DollarSign,
  MapPin,
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  Loader2,
  AlertCircle,
  Eye,
  Calendar,
  Check,
  XCircle,
  Phone,
  Play,
  Star,
  MessageSquare,
  Camera,
  Upload,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyWorkerProfile, updateWorkerProfile, updateWorkerAvailability } from '../services/workerService';
import { fetchCategories } from '../services/categoryService';
import { getMyRequests, updateRequestStatus } from '../services/requestService';
import { fetchMyReviews } from '../services/reviewService';
import { Link } from 'react-router-dom';

const WorkerDashboardPage = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Worker Job Requests State
  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestTab, setRequestTab] = useState('pending');

  // Reviews State
  const [workerReviews, setWorkerReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(5.0);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);

  // Form State
  const [availability, setAvailability] = useState('available');
  const [verificationStatus, setVerificationStatus] = useState('not_verified');
  const [cnicNumber, setCnicNumber] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [skillTitle, setSkillTitle] = useState('');
  const [experience, setExperience] = useState(2);
  const [startingPrice, setStartingPrice] = useState(500);
  const [workingHours, setWorkingHours] = useState('9:00 AM - 7:00 PM');
  const [city, setCity] = useState(user?.city || 'Karachi');
  const [area, setArea] = useState(user?.area || '');
  const [bio, setBio] = useState('');
  const [services, setServices] = useState([
    { name: 'Standard Inspection & Diagnosis', price: 500, description: 'Inspection fee' },
  ]);
  const [portfolioImages, setPortfolioImages] = useState([
    'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
  ]);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  // File input refs for opening device Pictures folder directly
  const profileFileInputRef = useRef(null);
  const portfolioFileInputRef = useRef(null);

  // Temporary inputs
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Image compressor helper using HTML5 Canvas
  const compressImageFile = (file, maxDim = 850, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Selected file is not an image'));
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Direct Profile Photo File Selection
  const handleProfileImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImageFile(file, 800, 0.85);
      setProfileImage(compressedDataUrl);
      setStatusMessage({ type: 'success', text: 'Profile picture select ho gayi hai. Save karne ke liye "Save Profile Changes" par click karein.' });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Image load karne mein masla hua: ' + err.message });
    }
  };

  // Direct Portfolio Photos Multiple Selection from Folder
  const handlePortfolioFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const compressedList = await Promise.all(
        files.map((file) => compressImageFile(file, 900, 0.82))
      );
      setPortfolioImages((prev) => [...prev, ...compressedList]);
      setStatusMessage({
        type: 'success',
        text: `${compressedList.length} nayi work photos portfolio mein shamil kar di gayi hain!`,
      });
      // Clear file input so same files can be re-selected if desired
      if (portfolioFileInputRef.current) portfolioFileInputRef.current.value = '';
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Photos load karne mein masla hua: ' + err.message });
    }
  };

  const loadWorkerRequests = async () => {
    setRequestsLoading(true);
    try {
      const res = await getMyRequests();
      if (res?.requests) {
        setRequests(res.requests);
      }
    } catch (err) {
      // Demo incoming requests for prototype testing
      setRequests([
        {
          _id: 'req-worker-demo-1',
          serviceType: 'Sanitary Leakage Repair',
          description: 'Main bathroom floor pipe leaking water through slab to ground floor.',
          location: { address: 'Plot 55, Block 13-D', city: 'Karachi', area: 'Gulshan-e-Iqbal' },
          preferredDate: new Date().toISOString(),
          preferredTime: 'Morning (9:00 AM - 12:00 PM)',
          status: 'pending',
          estimatedPrice: 600,
          createdAt: new Date().toISOString(),
          customerId: {
            _id: 'cust-1',
            name: 'Ali Raza',
            phone: '0300-9876543',
            city: 'Karachi',
          },
        },
      ]);
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    // 1. Fetch categories
    fetchCategories().then((res) => {
      if (res?.categories) {
        setCategories(res.categories);
        if (!categoryId && res.categories.length > 0) {
          setCategoryId(res.categories[0]._id);
        }
      }
    });

    // 2. Fetch worker profile
    getMyWorkerProfile()
      .then((res) => {
        if (res?.profile) {
          const p = res.profile;
          setAvailability(p.availability || 'available');
          setVerificationStatus(p.verificationStatus || 'not_verified');
          if (p.category?._id) setCategoryId(p.category._id);
          if (p.skillTitle) setSkillTitle(p.skillTitle);
          if (p.experience !== undefined) setExperience(p.experience);
          if (p.startingPrice !== undefined) setStartingPrice(p.startingPrice);
          if (p.workingHours) setWorkingHours(p.workingHours);
          if (p.city) setCity(p.city);
          if (p.area) setArea(p.area);
          if (p.bio) setBio(p.bio);
          if (p.services?.length) setServices(p.services);
          if (p.portfolioImages?.length) setPortfolioImages(p.portfolioImages);
          if (p.averageRating !== undefined) setAverageRating(p.averageRating);
          if (p.totalReviews !== undefined) setTotalReviewsCount(p.totalReviews);
        }
      })
      .catch((err) => {
        console.warn('Profile fetch note:', err.message);
      })
      .finally(() => setLoading(false));

    // 3. Load requests
    loadWorkerRequests();

    // 4. Load reviews
    fetchMyReviews()
      .then((res) => {
        if (res?.reviews) {
          setWorkerReviews(res.reviews);
        }
      })
      .catch((err) => {
        console.warn('Reviews fetch note:', err.message);
      });
  }, []);

  const handleAvailabilityChange = async (newStatus) => {
    setAvailability(newStatus);
    try {
      await updateWorkerAvailability(newStatus);
      setStatusMessage({ type: 'success', text: `Availability status updated to: ${newStatus}` });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Could not update availability' });
    }
  };

  const handleStatusTransition = async (requestId, nextStatus) => {
    let finalPrice;
    if (nextStatus === 'completed') {
      const priceInput = window.prompt('Kaam mukammal hone par final amount (PKR) darj karein:', '1000');
      if (priceInput === null) return; // User cancelled
      finalPrice = Number(priceInput) || startingPrice;
    }

    try {
      await updateRequestStatus(requestId, {
        status: nextStatus,
        finalPrice,
        note: `Updated to ${nextStatus} by worker`,
      });
      setStatusMessage({ type: 'success', text: `Request status updated to '${nextStatus}'.` });
      loadWorkerRequests();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Status update failed.' });
    }
  };

  const handleAddService = () => {
    if (!newServiceName) return;
    setServices([
      ...services,
      { name: newServiceName, price: Number(newServicePrice) || startingPrice, description: '' },
    ]);
    setNewServiceName('');
    setNewServicePrice('');
  };

  const handleRemoveService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (!newImageUrl) return;
    setPortfolioImages([...portfolioImages, newImageUrl]);
    setNewImageUrl('');
  };

  const handleRemoveImage = (index) => {
    setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const payload = {
        categoryId,
        skillTitle,
        experience,
        startingPrice,
        workingHours,
        city,
        area,
        bio,
        services,
        portfolioImages,
        ...(profileImage && { profileImage }),
        ...(cnicNumber && { cnicNumber }),
      };

      const res = await updateWorkerProfile(payload);
      if (res?.success) {
        setStatusMessage({ type: 'success', text: 'Shandar! Aapka worker profile kamiyabi se update ho gaya.' });
        if (res.profile?.verificationStatus) {
          setVerificationStatus(res.profile.verificationStatus);
        }
        if (profileImage && user) {
          const updatedUser = { ...user, profileImage };
          localStorage.setItem('hunarmand_user', JSON.stringify(updatedUser));
        }
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message || 'Error updating profile' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
        <span className="text-sm font-medium text-slate-500">Worker Dashboard load ho raha hai...</span>
      </div>
    );
  }

  const filteredRequests = requests.filter((r) => {
    if (requestTab === 'pending') return r.status === 'pending';
    if (requestTab === 'active') return ['accepted', 'in_progress'].includes(r.status);
    if (requestTab === 'completed') return r.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Dashboard Top Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full">
              Hunarmand Portal
            </span>
            <span className="text-xs text-slate-500">Worker Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Khush-Amdeed, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Incoming jobs accept karein, availability badlein aur rates update karein.
          </p>
        </div>

        {/* Quick Availability Toggler */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-slate-500 uppercase">Status Toggle</label>
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleAvailabilityChange('available')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                availability === 'available'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ● Available
            </button>
            <button
              type="button"
              onClick={() => handleAvailabilityChange('busy')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                availability === 'busy'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ● Busy
            </button>
            <button
              type="button"
              onClick={() => handleAvailabilityChange('offline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                availability === 'offline'
                  ? 'bg-slate-700 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ● Offline
            </button>
          </div>
        </div>
      </div>

      {/* Verification Status Card */}
      <div className={`p-6 rounded-3xl border ${
        verificationStatus === 'verified'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
          : verificationStatus === 'pending'
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-slate-50 border-slate-200 text-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {verificationStatus === 'verified' ? (
              <ShieldCheck className="w-7 h-7 text-emerald-600 flex-shrink-0" />
            ) : (
              <ShieldAlert className="w-7 h-7 text-amber-600 flex-shrink-0" />
            )}
            <div>
              <h3 className="font-bold text-base">
                {verificationStatus === 'verified'
                  ? 'Verified Worker (CNIC Tasdeeq Shuda)'
                  : verificationStatus === 'pending'
                  ? 'Verification Pending (Under Review by Admin)'
                  : 'Profile Not Yet Verified'}
              </h3>
              <p className="text-xs opacity-90 mt-0.5 max-w-xl">
                {verificationStatus === 'verified'
                  ? 'Mubarak! Aapke profile par green "Verified" badge mojood hai. Customers aap par ziada aitimad karenge.'
                  : verificationStatus === 'pending'
                  ? 'Aapka CNIC number admin verification ke liye queue mein hai. Jald hi tasdeeq mukammal ho jayegi.'
                  : 'Apna Pakistani CNIC darj kar ke "Verified Worker" ka badge hasil karein taake aapko 3x ziada orders milein.'}
              </p>
            </div>
          </div>

          {verificationStatus === 'not_verified' && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="42101-1234567-1"
                value={cnicNumber}
                onChange={(e) => setCnicNumber(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 font-medium">Save to submit</span>
            </div>
          )}
        </div>
      </div>

      {/* Status Feedback Notification */}
      {statusMessage.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
          statusMessage.type === 'success'
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : 'bg-rose-100 text-rose-800 border border-rose-200'
        }`}>
          {statusMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* SERVICE REQUESTS & JOBS MANAGEMENT PANEL */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Service Requests & Orders</h2>
            <p className="text-xs text-slate-500">Customer requests accept ya reject karein aur status update karein.</p>
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setRequestTab('pending')}
              className={`px-3 py-1.5 rounded-lg transition ${
                requestTab === 'pending' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              Incoming ({requests.filter((r) => r.status === 'pending').length})
            </button>
            <button
              onClick={() => setRequestTab('active')}
              className={`px-3 py-1.5 rounded-lg transition ${
                requestTab === 'active' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              Active ({requests.filter((r) => ['accepted', 'in_progress'].includes(r.status)).length})
            </button>
            <button
              onClick={() => setRequestTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition ${
                requestTab === 'completed' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600'
              }`}
            >
              Completed ({requests.filter((r) => r.status === 'completed').length})
            </button>
          </div>
        </div>

        {requestsLoading ? (
          <div className="py-8 text-center text-xs text-slate-500">Orders load ho rahe hain...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">Is tab mein filhal koi service request mojood nahi hai.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">{req.customerId?.name}</span>
                    <span className="text-xs text-slate-500">• {req.location?.area}, {req.location?.city}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      req.status === 'pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      req.status === 'accepted' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                      req.status === 'in_progress' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 italic">
                    "{req.description}"
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {new Date(req.preferredDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {req.preferredTime}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-emerald-800">
                      Est. Rate: Rs. {req.estimatedPrice || startingPrice}
                    </span>
                  </div>
                </div>

                {/* Worker Decision Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`tel:${req.customerId?.phone}`}
                    className="p-2 bg-white border border-slate-200 hover:bg-emerald-50 text-slate-700 rounded-xl"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusTransition(req._id, 'accepted')}
                        className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Job</span>
                      </button>
                      <button
                        onClick={() => handleStatusTransition(req._id, 'rejected')}
                        className="px-3.5 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {req.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusTransition(req._id, 'in_progress')}
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Start Work (In Progress)</span>
                    </button>
                  )}

                  {req.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusTransition(req._id, 'completed')}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Job Completed</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CUSTOMER REVIEWS & REPUTATION SECTION */}
      <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span>Customer Ratings & Reviews</span>
            </h2>
            <p className="text-xs text-slate-500">
              Aapke mukammal shuda kaamo par customers ki aaraa aur sitarey.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
              <span className="text-lg font-extrabold text-amber-900">
                {averageRating || '5.0'}
              </span>
              <span className="text-xs text-amber-700">/ 5.0 Rating</span>
            </div>
            <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-xs text-slate-500 font-semibold block uppercase">Total Reviews</span>
              <span className="text-sm font-extrabold text-slate-900">
                {workerReviews.length || totalReviewsCount} Reviews
              </span>
            </div>
          </div>
        </div>

        {workerReviews.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">Koi review abhi tak darj nahi hua</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Jab aap customer ke service requests complete karenge to customers aapke kaam ko rate aur review kar sakein ge.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workerReviews.map((rev) => (
              <div key={rev._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center uppercase">
                      {rev.customerId?.name?.charAt(0) || 'C'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{rev.customerId?.name || 'Customer'}</h4>
                      <p className="text-[11px] text-slate-400">{rev.customerId?.city || 'Pakistan'}</p>
                    </div>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic bg-white p-3 rounded-xl border border-slate-100">
                  "{rev.comment}"
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>{rev.serviceRequestId?.serviceType || 'Completed Job'}</span>
                  <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Main Profile Settings Form */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Worker Profile Settings</h2>
          <p className="text-xs text-slate-500">Yeh maloomat customers ko aapke public profile par nazar ayegi.</p>
        </div>

        {/* Worker Profile Display Photo (DP) Direct Folder Picker */}
        <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
          <div className="relative flex-shrink-0">
            <img
              src={profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
              alt="Worker Display Picture"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
            />
            <button
              type="button"
              onClick={() => profileFileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow cursor-pointer transition"
              title="Tasweer Badlein"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Worker Profile Picture (Display Photo)</h4>
              <p className="text-xs text-slate-500">
                Apne computer ya mobile ke <strong>Pictures folder</strong> se direct apni asil tasweer lagayein. Customers verified aur tasweer walay workers ko tarjeeh detay hain.
              </p>
            </div>

            <input
              type="file"
              ref={profileFileInputRef}
              onChange={handleProfileImageFileChange}
              accept="image/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => profileFileInputRef.current?.click()}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>📁 Profile Picture Badlein (Device Folder Se)</span>
            </button>
          </div>
        </div>

        {/* Row 1: Category & Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Primary Skill Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
            >
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Professional Skill Title
            </label>
            <input
              type="text"
              value={skillTitle}
              onChange={(e) => setSkillTitle(e.target.value)}
              placeholder="e.g. Master Sanitary & Water Pump Specialist"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Row 2: Experience, Starting Price, Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Experience (Years)
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Starting Price (PKR)
            </label>
            <input
              type="number"
              min="100"
              value={startingPrice}
              onChange={(e) => setStartingPrice(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-bold text-emerald-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Working Hours
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder="9:00 AM - 7:00 PM"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Row 3: City and Area */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              City
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
            >
              <option>Karachi</option>
              <option>Lahore</option>
              <option>Islamabad</option>
              <option>Rawalpindi</option>
              <option>Peshawar</option>
              <option>D.I. Khan</option>
              <option>Faisalabad</option>
              <option>Multan</option>
              <option>Quetta</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
              Area / Neighborhood
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Gulshan Block 13-D / Cantt"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
            />
          </div>
        </div>

        {/* Row 4: Bio */}
        <div>
          <label className="block text-xs font-semibold uppercase text-slate-600 mb-1.5">
            About Yourself & Work Experience (Bio)
          </label>
          <textarea
            rows="4"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Apne kaam, tajurbay aur khusoosi salahiyat ke baare mein likhein..."
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>

        {/* Services List Manager */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Services & Rates (Sub-Services)</h3>
            <span className="text-xs text-slate-500">Individual jobs you offer with rates</span>
          </div>

          <div className="space-y-2">
            {services.map((svc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                <div>
                  <span className="font-bold text-slate-900">{svc.name}</span>
                  <span className="ml-3 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Rs. {svc.price}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveService(idx)}
                  className="text-slate-400 hover:text-rose-600 transition p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="text"
              placeholder="New service name (e.g. Gas Leakage Test)"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
            />
            <input
              type="number"
              placeholder="Price (PKR)"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              className="w-full sm:w-36 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddService}
              className="px-4 py-2 bg-slate-800 text-white font-semibold rounded-xl text-xs hover:bg-slate-900 transition flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Portfolio Images Manager */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">Work Portfolio Photos (Pichlay Kaam Ki Photos)</h3>
              <span className="text-xs text-slate-500">Apne kiye huay kaam ki tasweerain shamil karein</span>
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full self-start sm:self-auto">
              {portfolioImages.length} Photos Added
            </span>
          </div>

          {/* Upload Actions: Direct Device Folder Picker */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Device Se Direct Photos Upload Karein</h4>
                <p className="text-[11px] text-slate-500">
                  Computer ya mobile ke Pictures folder se aik ya ziada photos select karein
                </p>
              </div>
            </div>

            <input
              type="file"
              ref={portfolioFileInputRef}
              onChange={handlePortfolioFilesChange}
              accept="image/*"
              multiple
              className="hidden"
            />

            <button
              type="button"
              onClick={() => portfolioFileInputRef.current?.click()}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>📁 Add Pictures (Open Folder)</span>
            </button>
          </div>

          {/* Grid of Portfolio Images */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pt-2">
            {portfolioImages.map((img, idx) => (
              <div key={idx} className="relative group rounded-2xl overflow-hidden border border-slate-200 h-32 bg-slate-100 shadow-xs">
                <img src={img} alt={`Work Portfolio ${idx + 1}`} className="w-full h-full object-cover transition group-hover:scale-105 duration-200" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition shadow cursor-pointer opacity-90 group-hover:opacity-100"
                  title="Tasweer Delete Karein"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Optional Image URL Fallback */}
          <div className="pt-2">
            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer hover:text-emerald-700 font-semibold mb-2">
                + Ya Image URL se photo add karein (Optional)
              </summary>
              <div className="flex gap-2 pt-1">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-example.jpg"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  URL Add Karein
                </button>
              </div>
            </details>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to={`/workers/${user?._id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            <Eye className="w-4 h-4" />
            <span>Public Profile Preview Dekhein</span>
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Save Ho Raha Hai...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkerDashboardPage;
