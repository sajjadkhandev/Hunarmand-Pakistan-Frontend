import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  Star,
  MapPin,
  Briefcase,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  Phone,
  CheckCircle2,
  X,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { fetchWorkers } from '../services/workerService';
import { fetchCategories } from '../services/categoryService';
import { fallbackWorkers } from '../data/fallbackWorkers';

const defaultCategoriesList = [
  { slug: 'plumber', name: 'Plumber', icon: '🔧' },
  { slug: 'electrician', name: 'Electrician', icon: '⚡' },
  { slug: 'ac-technician', name: 'AC Technician', icon: '❄️' },
  { slug: 'carpenter', name: 'Carpenter', icon: '🪚' },
  { slug: 'solar-technician', name: 'Solar Technician', icon: '☀️' },
  { slug: 'painter', name: 'Painter', icon: '🎨' },
  { slug: 'mechanic', name: 'Mechanic', icon: '🔩' },
  { slug: 'appliance-repair', name: 'Appliance Repair', icon: '📱' },
  { slug: 'mason-construction', name: 'Mason & Construction', icon: '🏗️' },
  { slug: 'cleaner', name: 'Cleaner', icon: '🧹' },
];

const WorkersPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All Cities');
  const [area, setArea] = useState('');
  const [availabilityOnly, setAvailabilityOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState('');
  const [minExp, setMinExp] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('rating_desc');

  // Mobile Filter Drawer State
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Data State
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter fallback workers in memory
  const filterFallback = (params) => {
    let result = [...fallbackWorkers];
    if (params.category && params.category !== 'all' && params.category !== 'All Skills') {
      const term = params.category.toLowerCase();
      result = result.filter(
        (w) => w.category?.slug?.toLowerCase() === term || w.category?.name?.toLowerCase() === term
      );
    }
    if (params.city && params.city !== 'All Cities' && params.city !== 'all') {
      result = result.filter((w) => w.city?.toLowerCase() === params.city.toLowerCase());
    }
    if (params.area) {
      result = result.filter((w) => w.area?.toLowerCase().includes(params.area.toLowerCase()));
    }
    if (params.availability) {
      result = result.filter((w) => w.availability === params.availability);
    }
    if (params.verified === 'true') {
      result = result.filter((w) => w.verificationStatus === 'verified');
    }
    if (params.minRating) {
      result = result.filter((w) => w.averageRating >= Number(params.minRating));
    }
    if (params.minExp) {
      result = result.filter((w) => w.experience >= Number(params.minExp));
    }
    if (params.maxPrice) {
      result = result.filter((w) => w.startingPrice <= Number(params.maxPrice));
    }
    if (params.keyword) {
      const kw = params.keyword.toLowerCase();
      result = result.filter((w) => {
        const name = w.userId?.name?.toLowerCase() || '';
        const skill = w.skillTitle?.toLowerCase() || '';
        const bio = w.bio?.toLowerCase() || '';
        const cityStr = w.city?.toLowerCase() || '';
        return name.includes(kw) || skill.includes(kw) || bio.includes(kw) || cityStr.includes(kw);
      });
    }
    if (params.sort === 'price_asc') {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (params.sort === 'price_desc') {
      result.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (params.sort === 'exp_desc') {
      result.sort((a, b) => b.experience - a.experience);
    } else {
      result.sort((a, b) => b.averageRating - a.averageRating);
    }
    return result;
  };

  // Sync state if URL query params change
  useEffect(() => {
    const urlCat = searchParams.get('category');
    const urlCity = searchParams.get('city');
    if (urlCat) setSelectedCategory(urlCat);
    if (urlCity) setSelectedCity(urlCity);
  }, [searchParams]);

  // Load Categories
  useEffect(() => {
    fetchCategories()
      .then((res) => {
        if (res?.categories && res.categories.length > 0) {
          setCategories(res.categories);
        } else {
          setCategories(defaultCategoriesList);
        }
      })
      .catch(() => {
        setCategories(defaultCategoriesList);
      });
  }, []);

  // Fetch Workers whenever filters change
  useEffect(() => {
    const loadWorkers = async () => {
      setLoading(true);
      const params = {
        keyword: keyword || undefined,
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        city: selectedCity !== 'All Cities' ? selectedCity : undefined,
        area: area || undefined,
        availability: availabilityOnly ? 'available' : undefined,
        verified: verifiedOnly ? 'true' : undefined,
        minRating: minRating || undefined,
        minExp: minExp || undefined,
        maxPrice: maxPrice || undefined,
        sort: sortBy,
      };

      try {
        const res = await fetchWorkers(params);
        if (res?.workers && res.workers.length > 0) {
          setWorkers(res.workers);
        } else {
          setWorkers(filterFallback(params));
        }
      } catch (err) {
        setWorkers(filterFallback(params));
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadWorkers, 150); // Responsive debounce
    return () => clearTimeout(timer);
  }, [
    keyword,
    selectedCategory,
    selectedCity,
    area,
    availabilityOnly,
    verifiedOnly,
    minRating,
    minExp,
    maxPrice,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setKeyword('');
    setSelectedCategory('all');
    setSelectedCity('All Cities');
    setArea('');
    setAvailabilityOnly(false);
    setVerifiedOnly(false);
    setMinRating('');
    setMinExp('');
    setMaxPrice('');
    setSortBy('rating_desc');
    setSearchParams({});
  };

  const citiesList = [
    'All Cities',
    'Karachi',
    'Lahore',
    'Islamabad',
    'Rawalpindi',
    'Peshawar',
    'D.I. Khan',
    'Faisalabad',
    'Multan',
    'Quetta',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Find Skilled Workers in Pakistan
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Verified plumbers, electricians, AC mechanics & technicians across your city.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 py-2.5 px-4 bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({[selectedCategory !== 'all', selectedCity !== 'All Cities', verifiedOnly, availabilityOnly].filter(Boolean).length})</span>
          </button>
          <button
            onClick={handleResetFilters}
            className="p-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Search Bar & Sort Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by worker name, skill, or keyword (e.g. 'Tariq', 'UPS', 'leakage')..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Sorting Dropdown */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none cursor-pointer"
          >
            <option value="rating_desc">Highest Rated ★</option>
            <option value="price_asc">Lowest Starting Price</option>
            <option value="price_desc">Highest Starting Price</option>
            <option value="exp_desc">Most Experienced</option>
          </select>
        </div>
      </div>

      {/* Layout Grid: Sidebar Filters + Worker Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filters</span>
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Skill Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">Tamam Categories (All)</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none cursor-pointer"
            >
              {citiesList.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Area Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Area / Town
            </label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Gulshan, Cantt, DHA..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>

          {/* Checkboxes: Verified & Availability */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Workers Only
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={availabilityOnly}
                onChange={(e) => setAvailabilityOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
              />
              <span>Available Right Now</span>
            </label>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="">Any Rating</option>
              <option value="4.8">4.8+ Stars ★</option>
              <option value="4.5">4.5+ Stars ★</option>
              <option value="4.0">4.0+ Stars ★</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Experience (Years)
            </label>
            <select
              value={minExp}
              onChange={(e) => setMinExp(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="">Any Experience</option>
              <option value="3">3+ Saal</option>
              <option value="5">5+ Saal</option>
              <option value="8">8+ Saal</option>
            </select>
          </div>

          {/* Max Price Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
              Max Starting Price (PKR)
            </label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
            >
              <option value="">Any Budget</option>
              <option value="700">Under Rs. 700</option>
              <option value="1200">Under Rs. 1,200</option>
              <option value="2000">Under Rs. 2,000</option>
            </select>
          </div>
        </aside>

        {/* Results Column */}
        <main className="lg:col-span-9 space-y-6">
          {/* Results count header */}
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2">
            <span>
              Showing <strong className="text-slate-800">{workers.length}</strong> matching skilled workers
              {selectedCity !== 'All Cities' && ` in ${selectedCity}`}
            </span>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3">
              <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" />
              <span className="text-sm font-medium text-slate-500">Searching verified workers...</span>
            </div>
          ) : workers.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Koi Worker Nahi Mila</h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Aapke mutabiqa filters (Trade, City, Price ya Rating) par koi technician dastyab nahi hai. Barah-e-karam filters ko aasan karein.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition cursor-pointer"
              >
                Tamam Filters Reset Karein
              </button>
            </div>
          ) : (
            /* Worker Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workers.map((w) => {
                const isVerified = w.verificationStatus === 'verified';
                const isAvailable = w.availability === 'available';

                return (
                  <div
                    key={w._id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl hover:border-emerald-500 transition duration-200 group"
                  >
                    <div>
                      {/* Top Row: Avatar + Badges */}
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={w.userId?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                            alt={w.userId?.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                          />
                          <div>
                            <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-700 transition">
                              {w.userId?.name}
                            </h3>
                            <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                              <span>{w.category?.icon || '🔧'}</span>
                              <span>{w.skillTitle || w.category?.name}</span>
                            </p>
                          </div>
                        </div>

                        {/* Availability Pill */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                            isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          ● {w.availability || 'Available'}
                        </span>
                      </div>

                      {/* Trust Signals: Verification & Rating */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">
                            Not Verified
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{w.averageRating || '5.0'}</span>
                          <span className="text-slate-400 font-normal">({w.totalReviews || 0})</span>
                        </span>

                        <span className="text-xs text-slate-500">
                          • {w.experience} Saal Tajurba
                        </span>
                      </div>

                      {/* Location & Bio */}
                      <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                        <p className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{w.area ? `${w.area}, ` : ''}{w.city}</span>
                        </p>
                        {w.bio && (
                          <p className="text-slate-500 line-clamp-2 leading-relaxed">
                            {w.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bottom Row: Starting Price & CTA */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-semibold">Starting Rate</span>
                        <span className="text-base font-extrabold text-emerald-800">
                          Rs. {w.startingPrice}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/workers/${w._id}`}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                        >
                          Profile
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            navigate('/messages', {
                              state: {
                                targetWorker: {
                                  _id: w.userId?._id || w._id,
                                  name: w.userId?.name || w.name,
                                  role: 'worker',
                                  phone: w.userId?.phone || w.phone || '0300-1234567',
                                  city: w.city,
                                  profileImage: w.userId?.profileImage || w.profileImage,
                                  skillTitle: w.skillTitle || w.category?.name,
                                  startingPrice: w.startingPrice,
                                },
                              },
                            });
                          }}
                          className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-700/20 flex items-center gap-1.5 cursor-pointer"
                          title="Worker se 4-minute live chat shuru karein"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat (4 Min)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.icon} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
                >
                  {citiesList.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-600 block mb-1">Area</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Gulshan"
                  className="w-full p-2 bg-slate-50 border rounded-xl text-xs"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                  />
                  <span>Verified Workers Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={availabilityOnly}
                    onChange={(e) => setAvailabilityOnly(e.target.checked)}
                  />
                  <span>Available Right Now</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkersPage;
