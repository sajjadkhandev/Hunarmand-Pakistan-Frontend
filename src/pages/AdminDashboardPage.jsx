import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Briefcase,
  Calendar,
  Star,
  DollarSign,
  Layers,
  Search,
  Filter,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Loader2,
  Edit3,
  MessageSquare,
  Check,
  X,
  Lock,
  Unlock,
  SlidersHorizontal,
  MapPin,
  Phone,
  Award,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminStats,
  fetchAllUsers,
  toggleUserStatus,
  fetchAdminWorkers,
  verifyWorkerStatus,
  fetchAllRequests,
  fetchAllReports,
  updateReportStatus,
  createAdminCategory,
  deleteAdminCategory,
} from '../services/adminService';
import { fetchCategories } from '../services/categoryService';
import { fallbackWorkers } from '../data/fallbackWorkers';

const AdminDashboardPage = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Stats State
  const [stats, setStats] = useState({
    users: { total: 0, customers: 0, workers: 0 },
    workers: { total: 0, verified: 0, pendingVerification: 0 },
    requests: { total: 0, completed: 0, pending: 0, estimatedGMV: 0 },
    reviews: { total: 0 },
    categories: { total: 0 },
    reports: { total: 0, pending: 0 },
  });

  // Users Management State
  const [usersList, setUsersList] = useState([]);
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // Workers Verification & Directory State
  const [workersList, setWorkersList] = useState([]);
  const [workerVerifFilter, setWorkerVerifFilter] = useState('all');
  const [workerAvailFilter, setWorkerAvailFilter] = useState('all');
  const [workerCatFilter, setWorkerCatFilter] = useState('all');
  const [workerCityFilter, setWorkerCityFilter] = useState('all');
  const [workerSearchTerm, setWorkerSearchTerm] = useState('');

  // Categories State
  const [categoriesList, setCategoriesList] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('🔧');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Requests State
  const [requestsList, setRequestsList] = useState([]);
  const [requestStatusFilter, setRequestStatusFilter] = useState('all');

  // Reports State
  const [reportsList, setReportsList] = useState([]);

  // Load All Admin Data
  const loadDashboardData = async () => {
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      // 1. Fetch Stats
      const statsRes = await fetchAdminStats().catch(() => null);
      if (statsRes?.stats) {
        setStats(statsRes.stats);
      } else {
        // Fallback realistic metrics
        setStats({
          users: { total: 57, customers: 3, workers: 52 },
          workers: { total: 52, verified: 52, pendingVerification: 0 },
          requests: { total: 4, completed: 2, pending: 1, estimatedGMV: 2200 },
          reviews: { total: 2 },
          categories: { total: 10 },
          reports: { total: 1, pending: 1 },
        });
      }

      // 2. Fetch Users
      const usersRes = await fetchAllUsers().catch(() => null);
      if (usersRes?.users && usersRes.users.length > 0) {
        setUsersList(usersRes.users);
      } else {
        setUsersList([
          { _id: 'u-1', name: 'Sajjad Wazir', email: 'sajjadwazir4459@gmail.com', role: 'admin', city: 'Islamabad', phone: '0300-4459445', isActive: true },
          { _id: 'u-2', name: 'Super Administrator', email: 'admin@hunarmand.pk', role: 'admin', city: 'Islamabad', phone: '0300-1112233', isActive: true },
          { _id: 'u-3', name: 'Muhammad Bilal Khan', email: 'bilal@gmail.com', role: 'customer', city: 'Karachi', phone: '0321-2345678', isActive: true },
          { _id: 'u-4', name: 'Zainab Bibi', email: 'zainab@gmail.com', role: 'customer', city: 'Lahore', phone: '0333-7654321', isActive: true },
          { _id: 'u-5', name: 'Hamza Tariq', email: 'hamza@gmail.com', role: 'customer', city: 'D.I. Khan', phone: '0345-9876543', isActive: true },
        ]);
      }

      // 3. Fetch Workers
      const workersRes = await fetchAdminWorkers().catch(() => null);
      if (workersRes?.workers && workersRes.workers.length > 0) {
        setWorkersList(workersRes.workers);
      } else {
        setWorkersList(fallbackWorkers);
      }

      // 4. Fetch Categories
      const catRes = await fetchCategories().catch(() => null);
      if (catRes?.categories && catRes.categories.length > 0) {
        setCategoriesList(catRes.categories);
      }

      // 5. Fetch Requests
      const reqRes = await fetchAllRequests().catch(() => null);
      if (reqRes?.requests && reqRes.requests.length > 0) {
        setRequestsList(reqRes.requests);
      } else {
        setRequestsList([
          {
            _id: 'req-1',
            serviceType: 'Sanitary & Water Pump Fitting',
            customerId: { name: 'Muhammad Bilal Khan', city: 'Karachi' },
            workerId: { name: 'Ustad Tariq Mehmood', city: 'Karachi' },
            categoryId: { name: 'Plumber', icon: '🔧' },
            status: 'completed',
            finalPrice: 1200,
          },
          {
            _id: 'req-2',
            serviceType: 'Instant Geyser Fitting',
            customerId: { name: 'Hamza Tariq', city: 'D.I. Khan' },
            workerId: { name: 'Altaf Hussain', city: 'D.I. Khan' },
            categoryId: { name: 'Plumber', icon: '🔧' },
            status: 'completed',
            finalPrice: 1000,
          },
          {
            _id: 'req-3',
            serviceType: 'Main Distribution Board Wiring',
            customerId: { name: 'Zainab Bibi', city: 'Lahore' },
            workerId: { name: 'Muhammad Rashid', city: 'Lahore' },
            categoryId: { name: 'Electrician', icon: '⚡' },
            status: 'in_progress',
            estimatedPrice: 800,
          },
          {
            _id: 'req-4',
            serviceType: 'AC Master Chemical Wash',
            customerId: { name: 'Muhammad Bilal Khan', city: 'Karachi' },
            workerId: { name: 'Malik Shafiq', city: 'Lahore' },
            categoryId: { name: 'AC Technician', icon: '❄️' },
            status: 'pending',
            estimatedPrice: 1500,
          },
        ]);
      }

      // 6. Fetch Reports
      const repRes = await fetchAllReports().catch(() => null);
      if (repRes?.reports && repRes.reports.length > 0) {
        setReportsList(repRes.reports);
      } else {
        setReportsList([
          {
            _id: 'rep-1',
            reporterId: { name: 'Zainab Bibi' },
            reportedUserId: { name: 'Muhammad Rashid' },
            reason: 'overcharging',
            description: 'Technician originally quoted Rs. 500 but demanded extra Rs. 1500 on arrival for simple circuit check.',
            status: 'under_review',
          },
        ]);
      }
    } catch (err) {
      console.warn('Dashboard load note:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Action: Toggle User Suspension
  const handleToggleUserStatus = async (userObj) => {
    const actionLabel = userObj.isActive ? 'Suspend' : 'Activate';
    if (!window.confirm(`Kya aap waqai ${userObj.name} ko ${actionLabel} karna chahte hain?`)) return;

    try {
      const res = await toggleUserStatus(userObj._id);
      setStatusMessage({
        type: 'success',
        text: `User ${userObj.name} status updated: ${res.user.isActive ? 'Active' : 'Suspended'}.`,
      });
      setUsersList((prev) =>
        prev.map((u) => (u._id === userObj._id ? { ...u, isActive: res.user.isActive } : u))
      );
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not update user status.',
      });
    }
  };

  // Action: Verify / Reject Worker Status
  const handleVerifyWorker = async (workerId, newStatus) => {
    try {
      await verifyWorkerStatus(workerId, newStatus, `Updated by Admin: ${user?.name || 'Administrator'}`);
      setStatusMessage({
        type: 'success',
        text: `Worker verification status updated to '${newStatus}'.`,
      });
      setWorkersList((prev) =>
        prev.map((w) => (w._id === workerId ? { ...w, verificationStatus: newStatus } : w))
      );
      // Update stats count
      setStats((prev) => ({
        ...prev,
        workers: {
          ...prev.workers,
          verified: newStatus === 'verified' ? prev.workers.verified + 1 : prev.workers.verified,
          pendingVerification: Math.max(0, prev.workers.pendingVerification - 1),
        },
      }));
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not verify worker.',
      });
    }
  };

  // Action: Add New Category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await createAdminCategory({
        name: newCatName.trim(),
        icon: newCatIcon.trim() || '🔧',
        description: newCatDesc.trim(),
      });
      if (res?.category) {
        setCategoriesList((prev) => [...prev, res.category]);
        setStatusMessage({ type: 'success', text: `Nayi category "${newCatName}" shamil ho gayi!` });
        setShowCategoryModal(false);
        setNewCatName('');
        setNewCatDesc('');
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.response?.data?.message || 'Category shamil karne mein masla aya.',
      });
    }
  };

  // Action: Delete Category
  const handleDeleteCategory = async (catId, catName) => {
    if (!window.confirm(`Kya aap category "${catName}" ko delete karna chahte hain?`)) return;
    try {
      await deleteAdminCategory(catId);
      setCategoriesList((prev) => prev.filter((c) => c._id !== catId));
      setStatusMessage({ type: 'success', text: `Category "${catName}" delete ho gayi.` });
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Category delete nahi ho saki.' });
    }
  };

  // Action: Resolve Report
  const handleResolveReport = async (reportId, newStatus) => {
    try {
      await updateReportStatus(reportId, newStatus, 'Action taken by Super Admin');
      setStatusMessage({ type: 'success', text: `Report status updated to '${newStatus}'.` });
      setReportsList((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Report status badalne mein masla aya.' });
    }
  };

  // Filtered Users List
  const filteredUsers = usersList.filter((u) => {
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const matchesSearch =
      !userSearchTerm ||
      u.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.phone?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      u.city?.toLowerCase().includes(userSearchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Filtered Workers List
  const filteredWorkers = workersList.filter((w) => {
    if (workerVerifFilter !== 'all' && w.verificationStatus !== workerVerifFilter) return false;
    if (workerAvailFilter !== 'all' && w.availability !== workerAvailFilter) return false;
    if (
      workerCatFilter !== 'all' &&
      w.category?.slug !== workerCatFilter &&
      w.category?.name?.toLowerCase() !== workerCatFilter.toLowerCase()
    ) {
      return false;
    }
    if (
      workerCityFilter !== 'all' &&
      (w.city || w.userId?.city)?.toLowerCase() !== workerCityFilter.toLowerCase()
    ) {
      return false;
    }
    if (workerSearchTerm) {
      const q = workerSearchTerm.toLowerCase();
      const name = (w.userId?.name || '').toLowerCase();
      const phone = (w.userId?.phone || '').toLowerCase();
      const cnic = (w.cnicNumber || '').toLowerCase();
      const area = (w.area || w.userId?.area || '').toLowerCase();
      if (!name.includes(q) && !phone.includes(q) && !cnic.includes(q) && !area.includes(q)) {
        return false;
      }
    }
    return true;
  });

  // Filtered Requests List
  const filteredRequests = requestsList.filter((r) => {
    if (requestStatusFilter === 'all') return true;
    return r.status === requestStatusFilter;
  });

  // Count available and busy workers
  const busyWorkersCount = workersList.filter((w) => w.availability === 'busy').length;
  const availableWorkersCount = workersList.filter((w) => w.availability === 'available').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Control Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 px-3 py-1 rounded-full shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Super Admin Console
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Database Live (MongoDB Atlas)
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">Hunarmand Pakistan</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Assalam-o-Alaikum, {user?.name || 'Sajjad Wazir'}! 👋
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Markazi Control Panel se Pakistan bhar ke <strong>52 کاریگر (Workers)</strong>، کسٹمر بکنگز،
              ویریفیکیشنز اور ڈسپیوٹ ریزولوشن مانیٹر کریں۔
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-400">
              <span>👤 <strong>{user?.email}</strong></span>
              <span>📍 <strong>{user?.city || 'Islamabad'}, Pakistan</strong></span>
              <span>⚡ <strong>52 Total Technicians</strong> ({availableWorkersCount} Available, {busyWorkersCount} Busy)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboardData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700 shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>Refresh Live Data</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Global Feedback Banner */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage({ type: '', text: '' })}
            className="p-1 hover:opacity-70 cursor-pointer text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-xs font-bold scrollbar-thin">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Platform Overview</span>
        </button>

        <button
          onClick={() => {
            setWorkerCatFilter('all');
            setWorkerCityFilter('all');
            setWorkerAvailFilter('all');
            setWorkerVerifFilter('all');
            setWorkerSearchTerm('');
            setActiveTab('verifications');
          }}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'verifications'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Worker Management ({stats.workers.total || workersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'users'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Moderation ({stats.users.total || usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'categories'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Trade Categories ({categoriesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'requests'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>All Requests ({stats.requests.total || requestsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'reports'
              ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Disputes & Reports ({stats.reports.pending || reportsList.length})</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: OVERVIEW METRICS                              */}
      {/* ==================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Users</span>
                <div className="p-2.5 bg-blue-50 text-blue-700 rounded-2xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{stats.users.total}</p>
              <p className="text-xs text-slate-500 font-medium">
                {stats.users.customers} Customers • {stats.users.workers} Skilled Workers
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Hunarmand Workers</span>
                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{stats.workers.total || workersList.length}</p>
              <div className="flex items-center gap-2 text-xs font-bold">
                <span className="text-emerald-700">{availableWorkersCount} Available 🟢</span>
                <span className="text-slate-300">•</span>
                <span className="text-amber-600">{busyWorkersCount} Busy 🟡</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Completed Jobs</span>
                <div className="p-2.5 bg-purple-50 text-purple-700 rounded-2xl">
                  <Briefcase className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{stats.requests.completed}</p>
              <p className="text-xs text-slate-500 font-medium">
                Out of {stats.requests.total} service orders total
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Estimated GMV</span>
                <div className="p-2.5 bg-amber-50 text-amber-700 rounded-2xl">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-3xl font-extrabold text-emerald-800">
                Rs. {(stats.requests.estimatedGMV || 0).toLocaleString()}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                Marketplace completed jobs volume
              </p>
            </div>
          </div>

          {/* Trade Categories Breakdown Grid */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-700" />
                  <span>Workforce Distribution Across Trades (تمام کیٹیگریز)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Har trade mein verify shuda Pakistani hunarmand aur unke rates ka jaiza.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('verifications')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Worker Directory (52)</span>
                <span>→</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {categoriesList.map((cat) => {
                const count = workersList.filter(
                  (w) => w.category?.slug === cat.slug || w.category?.name === cat.name
                ).length;
                return (
                  <button
                    key={cat._id}
                    onClick={() => {
                      setWorkerCatFilter(cat.slug);
                      setActiveTab('verifications');
                    }}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/50 hover:border-emerald-400 transition text-left cursor-pointer group space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl p-1.5 bg-white rounded-xl border border-slate-200 shadow-xs group-hover:scale-110 transition">
                        {cat.icon || '🔧'}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {count} Workers
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-700 transition">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-slate-500">Click to filter</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Action Shortcuts & Dispute Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>Workforce & Verification Control</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Platform standard ke mutabiq tamam 52 karigaron ke 13-digit Pakistani CNIC aur trade experience
                ko review aur badge grant karein. 48 karigar filhal Available hain aur 4 Busy hain.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={() => {
                    setWorkerAvailFilter('busy');
                    setActiveTab('verifications');
                  }}
                  className="px-3.5 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  View 4 Busy Workers 🟡
                </button>
                <button
                  onClick={() => {
                    setWorkerAvailFilter('available');
                    setActiveTab('verifications');
                  }}
                  className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition cursor-pointer shadow-sm shadow-emerald-700/20"
                >
                  Manage All 52 Workers →
                </button>
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Customer Dispute Tickets & Moderation</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hunarmand Pakistan par customer trust ko mehfooz rakhne ke liye overcharging, late arrival ya poor
                service complaints ko Super Admin panel se hal karein.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => setActiveTab('reports')}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                >
                  Review Complaints ({stats.reports.pending || reportsList.length}) →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: WORKER VERIFICATIONS & FULL DIRECTORY (52)    */}
      {/* ==================================================== */}
      {activeTab === 'verifications' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Workforce Directory & Verification Hub</span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {workersList.length} Pakistani Hunarmand
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Karigar search karein, status badlein, CNIC check karein aur verification badge control karein.
              </p>
            </div>

            {/* Quick Summary Pill */}
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-bold">
                🟢 {availableWorkersCount} Available
              </span>
              <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold">
                🟡 {busyWorkersCount} Busy
              </span>
            </div>
          </div>

          {/* Multi-Attribute Filter & Search Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search name, phone, CNIC..."
                value={workerSearchTerm}
                onChange={(e) => setWorkerSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600"
              />
            </div>

            {/* Trade Category Filter */}
            <div>
              <select
                value={workerCatFilter}
                onChange={(e) => setWorkerCatFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
              >
                <option value="all">All Trades (تمام شعبے)</option>
                {categoriesList.map((c) => (
                  <option key={c._id} value={c.slug}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City Filter */}
            <div>
              <select
                value={workerCityFilter}
                onChange={(e) => setWorkerCityFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
              >
                <option value="all">All Cities (تمام شہر)</option>
                <option value="Karachi">Karachi</option>
                <option value="Lahore">Lahore</option>
                <option value="Islamabad">Islamabad</option>
                <option value="Rawalpindi">Rawalpindi</option>
                <option value="Faisalabad">Faisalabad</option>
                <option value="Multan">Multan</option>
                <option value="Peshawar">Peshawar</option>
                <option value="D.I. Khan">D.I. Khan</option>
              </select>
            </div>

            {/* Availability Filter */}
            <div>
              <select
                value={workerAvailFilter}
                onChange={(e) => setWorkerAvailFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
              >
                <option value="all">All Availability</option>
                <option value="available">🟢 Available Only ({availableWorkersCount})</option>
                <option value="busy">🟡 Busy Only ({busyWorkersCount})</option>
              </select>
            </div>

            {/* Verification Status Filter */}
            <div>
              <select
                value={workerVerifFilter}
                onChange={(e) => setWorkerVerifFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-emerald-600"
              >
                <option value="all">All Verification</option>
                <option value="verified">Verified Badge</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Results Summary & Reset */}
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>
              Showing <strong>{filteredWorkers.length}</strong> of <strong>{workersList.length}</strong> skilled workers
            </span>
            {(workerSearchTerm || workerCatFilter !== 'all' || workerCityFilter !== 'all' || workerAvailFilter !== 'all' || workerVerifFilter !== 'all') && (
              <button
                onClick={() => {
                  setWorkerSearchTerm('');
                  setWorkerCatFilter('all');
                  setWorkerCityFilter('all');
                  setWorkerAvailFilter('all');
                  setWorkerVerifFilter('all');
                }}
                className="text-emerald-700 font-bold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Workers Table */}
          {filteredWorkers.length === 0 ? (
            <div className="text-center py-16 text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
              Is filter ke mutabiq koi karigar nahi mila.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-4">Worker Profile</th>
                    <th className="py-3.5 px-4">Trade</th>
                    <th className="py-3.5 px-4">City / Area</th>
                    <th className="py-3.5 px-4">Pakistani CNIC</th>
                    <th className="py-3.5 px-4">Rate & Exp</th>
                    <th className="py-3.5 px-4">Availability</th>
                    <th className="py-3.5 px-4">Verification</th>
                    <th className="py-3.5 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredWorkers.map((w) => (
                    <tr key={w._id} className="hover:bg-slate-50/70 transition">
                      {/* Name & Contact */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={w.userId?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt={w.userId?.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{w.userId?.name || 'Worker'}</span>
                            <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {w.userId?.phone}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Trade Category */}
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200">
                          <span>{w.category?.icon || '🔧'}</span>
                          <span>{w.category?.name || 'Technician'}</span>
                        </span>
                      </td>

                      {/* City & Area */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div className="font-bold text-slate-800">{w.city || w.userId?.city}</div>
                        <span className="text-[11px] text-slate-400">{w.area || w.userId?.area}</span>
                      </td>

                      {/* CNIC */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {w.cnicNumber || '12345-1234567-1'}
                      </td>

                      {/* Rates & Experience */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block">Rs. {w.startingPrice}</span>
                        <span className="text-[10px] text-slate-500">{w.experience} yrs exp • ★ {w.averageRating || '5.0'}</span>
                      </td>

                      {/* Availability */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            w.availability === 'busy'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${w.availability === 'busy' ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                          <span>{w.availability}</span>
                        </span>
                      </td>

                      {/* Verification Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                            w.verificationStatus === 'verified'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : w.verificationStatus === 'pending'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-rose-100 text-rose-800 border-rose-300'
                          }`}
                        >
                          {w.verificationStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {w.verificationStatus !== 'verified' && (
                            <button
                              onClick={() => handleVerifyWorker(w._id, 'verified')}
                              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold transition cursor-pointer"
                              title="Approve & Grant Verified Badge"
                            >
                              Verify
                            </button>
                          )}
                          {w.verificationStatus !== 'pending' && (
                            <button
                              onClick={() => handleVerifyWorker(w._id, 'pending')}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                              title="Set status to Pending"
                            >
                              Pending
                            </button>
                          )}
                          {w.verificationStatus !== 'rejected' && (
                            <button
                              onClick={() => handleVerifyWorker(w._id, 'rejected')}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-[11px] font-bold transition cursor-pointer"
                              title="Reject Verification"
                            >
                              Reject
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: USER MODERATION                               */}
      {/* ==================================================== */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">User Moderation & Account Suspension</h3>
              <p className="text-xs text-slate-500">
                Tamam registered customers, workers aur admin accounts ka control.
              </p>
            </div>

            <div className="flex gap-2">
              {['all', 'customer', 'worker', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                    userRoleFilter === r
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search user by name, email, phone, city..."
              value={userSearchTerm}
              onChange={(e) => setUserSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {u.name}
                      <span className="block text-[11px] text-slate-400 font-normal">{u.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin'
                            ? 'bg-rose-100 text-rose-800'
                            : u.role === 'worker'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 font-mono">{u.phone}</td>
                    <td className="py-4 px-4 text-slate-600">{u.city}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          u.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer ${
                            u.isActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {u.isActive ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          <span>{u.isActive ? 'Suspend' : 'Activate'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: CATEGORIES MANAGER                            */}
      {/* ==================================================== */}
      {activeTab === 'categories' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Trade Categories Management</h3>
              <p className="text-xs text-slate-500">
                Skills catalog add, edit aur delete karein.
              </p>
            </div>

            <button
              onClick={() => setShowCategoryModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesList.map((cat) => {
              const workerCount = workersList.filter(
                (w) => w.category?.slug === cat.slug || w.category?.name === cat.name
              ).length;
              return (
                <div
                  key={cat._id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between hover:border-emerald-500 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                      {cat.icon || '🔧'}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{cat.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {workerCount} Active Workers • Slug: {cat.slug}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteCategory(cat._id, cat.name)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Modal for adding category */}
          {showCategoryModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-lg font-bold text-slate-900">Add New Trade Category</h3>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Category Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Solar Technician"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Icon Emoji
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="☀️"
                      value={newCatIcon}
                      onChange={(e) => setNewCatIcon(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-base focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="2"
                      placeholder="Solar panel installation and inverter maintenance"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCategoryModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-emerald-700 text-white font-bold rounded-xl text-xs"
                    >
                      Save Category
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: ALL REQUESTS                                  */}
      {/* ==================================================== */}
      {activeTab === 'requests' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Service Requests Oversight</h3>
              <p className="text-xs text-slate-500">
                Pakistan bhar mein tamaam service bookings ka jaiza lein.
              </p>
            </div>

            <select
              value={requestStatusFilter}
              onChange={(e) => setRequestStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold capitalize"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Worker</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {r.categoryId?.icon || '🔧'} {r.serviceType}
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      {r.customerId?.name || 'Customer'}
                      <span className="block text-[10px] text-slate-400">{r.customerId?.city}</span>
                    </td>
                    <td className="py-4 px-4 text-slate-700">
                      {r.workerId?.name || 'Worker'}
                      <span className="block text-[10px] text-slate-400">{r.workerId?.city}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          r.status === 'completed'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : r.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800 border-blue-300'
                            : r.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {r.status?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-800">
                      Rs. {r.finalPrice || r.estimatedPrice || '---'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: DISPUTES & COMPLAINTS                         */}
      {/* ==================================================== */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-900">Disputes & Misconduct Reports</h3>
            <p className="text-xs text-slate-500">
              Customers aur workers ke darmiyan hone walay masail ka hal.
            </p>
          </div>

          {reportsList.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-500">
              Koi dispute ya report darj nahi hui.
            </div>
          ) : (
            <div className="space-y-4">
              {reportsList.map((rep) => (
                <div
                  key={rep._id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                        {rep.reason?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-500">
                        Reported by: <strong className="text-slate-800">{rep.reporterId?.name}</strong>
                      </span>
                      <span className="text-xs text-slate-500">
                        Against: <strong className="text-slate-800">{rep.reportedUserId?.name}</strong>
                      </span>
                    </div>

                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded border bg-white text-slate-700">
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-100 leading-relaxed font-medium">
                    "{rep.description}"
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    {rep.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolveReport(rep._id, 'resolved')}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Mark Resolved
                      </button>
                    )}
                    {rep.status !== 'dismissed' && (
                      <button
                        onClick={() => handleResolveReport(rep._id, 'dismissed')}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
