import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Briefcase,
  ShieldCheck,
  Star,
  CheckCircle2,
  Server,
  Database,
  ArrowRight,
  Zap,
  Users,
  Clock,
  Check,
  PhoneCall,
  Award,
} from 'lucide-react';
import { getBackendHealth } from '../services/api';
import { fetchCategories } from '../services/categoryService';

const defaultCategories = [
  { slug: 'plumber', name: 'Plumber', icon: '🔧', description: 'Pipe fittings, sanitary repair & water motors' },
  { slug: 'electrician', name: 'Electrician', icon: '⚡', description: 'UPS wiring, breakers & short-circuits' },
  { slug: 'ac-technician', name: 'AC Technician', icon: '❄️', description: 'Inverter AC jet wash, gas refill & PCB' },
  { slug: 'carpenter', name: 'Carpenter', icon: '🪚', description: 'Locks, wardrobes, furniture & kitchens' },
  { slug: 'solar-technician', name: 'Solar Technician', icon: '☀️', description: 'Solar panels, hybrid inverters & net metering' },
  { slug: 'painter', name: 'Painter', icon: '🎨', description: 'Weather sheet, plastic emulsion & polish' },
  { slug: 'mechanic', name: 'Mechanic', icon: '🔩', description: 'Car EFI scanning, bike tuning & repair' },
  { slug: 'appliance-repair', name: 'Appliance Repair', icon: '📱', description: 'Washing machines, fridges & microwaves' },
  { slug: 'mason-construction', name: 'Mason & Construction', icon: '🏗️', description: 'Tiles, marble polishing & brick plaster' },
  { slug: 'cleaner', name: 'Cleaner', icon: '🧹', description: 'Deep home scrubbing, sofas & water tanks' },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('plumber');
  const [selectedCity, setSelectedCity] = useState('Karachi');
  const [categories, setCategories] = useState(defaultCategories);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch live system health
    getBackendHealth()
      .then((data) => setHealthData(data))
      .catch(() => setHealthData(null))
      .finally(() => setHealthLoading(false));

    // 2. Fetch categories from backend API
    fetchCategories()
      .then((res) => {
        if (res?.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
      })
      .catch(() => {
        // Keep default categories
      })
      .finally(() => setLoadingCategories(false));
  }, []);

  const cities = [
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/workers?category=${encodeURIComponent(selectedService)}&city=${encodeURIComponent(selectedCity)}`);
  };

  const testimonials = [
    {
      name: 'Dr. Tariq Mahmood',
      city: 'Islamabad (F-10)',
      role: 'Customer',
      comment: 'AC inverter ka masla tha jo doosre mechanics hal nahi kar pa rahe thay. Hunarmand Pakistan se certified technician bulwaya, 1 ghantay mein masla hal ho gaya!',
      rating: 5,
    },
    {
      name: 'Muhammad Imran',
      city: 'Karachi (Gulshan)',
      role: 'Skilled Electrician',
      comment: 'Pehle dukaan par intezar karna parta tha. Is platform par register hone ke baad direct customers ke orders aatay hain aur direct payment milti hai.',
      rating: 5,
    },
    {
      name: 'Fatima Zahra',
      city: 'Lahore (DHA Phase 5)',
      role: 'Customer',
      comment: 'Kitchen pipeline leakage thi. Plumber time par pohanchay, fixed rate charge kiya aur safai se kaam kiya. Bohot shukriya!',
      rating: 5,
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-4 py-1.5 rounded-full text-emerald-200 text-xs sm:text-sm font-semibold backdrop-blur-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            🇵🇰 Pakistan’s Verified Skilled Marketplace
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Pakistan ke Hunarmand Log, <br />
            <span className="text-amber-300">Aap Ke Qareeb.</span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto leading-relaxed">
            Plumber, Electrician, AC Technician, Carpenter aur doosre trusted skilled workers ko asaani se find karein.
          </p>

          {/* SEARCH BAR CONTAINER */}
          <div className="pt-4 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-3 rounded-2xl shadow-2xl text-slate-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
            >
              {/* Service Selection */}
              <div className="sm:col-span-5 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-600">
                <Briefcase className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase">Service</label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full bg-transparent font-medium text-slate-800 text-sm focus:outline-none cursor-pointer"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.icon} {c.name}
                        </option>
                      ))
                    ) : (
                      <option value="plumber">🔧 Plumber</option>
                    )}
                  </select>
                </div>
              </div>

              {/* City Selection */}
              <div className="sm:col-span-4 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-600">
                <MapPin className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[11px] font-semibold text-slate-400 uppercase">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent font-medium text-slate-800 text-sm focus:outline-none cursor-pointer"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full h-12 flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl shadow-lg shadow-emerald-700/30 transition cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Worker</span>
                </button>
              </div>
            </form>
          </div>

          {/* Key Trust Signals */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-emerald-100">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              CNIC & Skill Verified
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-300" />
              Verified Reviews & Ratings
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-300" />
              Direct Call & Fast Booking
            </span>
          </div>
        </div>
      </section>

      {/* 2. LIVE ARCHITECTURE HEALTH MONITOR */}
      <section className="max-w-5xl mx-auto px-4 -mt-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  Phase 4 Live System
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  Platform Status & Services API
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Real-time connection between React client, Express REST endpoints, and Mongo models.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${healthLoading ? 'bg-amber-400 animate-ping' : healthData ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-xs font-semibold text-slate-700">
                {healthLoading ? 'Connecting...' : healthData ? 'All Systems Online' : 'API Pending'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1">
                <Server className="w-4 h-4 text-emerald-600" />
                <span>REST API Server</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {healthData ? `${healthData.project.name}` : 'Port 5000'}
              </p>
              <span className="text-[11px] text-slate-500">
                Uptime: {healthData?.system?.uptime || 'Active'}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1">
                <Database className="w-4 h-4 text-emerald-600" />
                <span>Categories Catalog</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {categories.length} Service Categories
              </p>
              <span className="text-[11px] text-slate-500">
                Loaded via /api/categories
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-600 text-xs font-medium mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Security & Auth</span>
              </div>
              <p className="text-sm font-bold text-emerald-700">
                JWT & RBAC Active
              </p>
              <span className="text-[11px] text-slate-500">
                Protected Customer & Worker roles
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Skilled Categories
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Select any trade to view qualified, verified technicians in your city.
            </p>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-800 mt-3 sm:mt-0"
          >
            Tamam Services Dekhein <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((item) => (
            <div
              key={item.slug || item.name}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4 p-3 bg-slate-50 group-hover:bg-emerald-50 rounded-2xl w-fit transition">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {item.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-semibold">Available Across Pakistan</span>
                <Link
                  to={`/workers?category=${item.slug}`}
                  className="font-medium text-slate-700 hover:text-emerald-700 group-hover:translate-x-0.5 transition"
                >
                  Dhoondein →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. WHY CHOOSE US / TRUST PILLARS */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              Why Hunarmand.pk
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Kyun Hunarmand Pakistan Par Aitimad Karein?
            </h2>
            <p className="text-sm text-slate-600">
              Hum aam classifieds nahi hain. Har worker ki tasdeeq aur customer ka aitimad hamari tarjeeh hai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">CNIC & Background Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Platform par shamil technicians ki CNIC aur skill verification hoti hai taake aap be-khauf ho kar apne ghar ya office mein unhein bula sakein.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Wazeh Starting Rates (No Hidden Charges)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Har worker apni starting price PKR mein profile par wazeh karta hai. Kisi qisam ke ghair-zaroori charges nahi.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Asli Customer Reviews & Ratings</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Sirf wohi customer review de sakta hai jiska kaam mukammal hua ho. Fake reviews ka koi imkan nahi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS 3 STEPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Aasan Tareeqa (How It Works)
          </h2>
          <p className="text-sm text-slate-600">
            3 aasan marhalon mein apne ghar ke masail ka fori hal talash karein.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-emerald-700/20">
              1
            </div>
            <h3 className="font-bold text-lg text-slate-900">Worker Talash Karein</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apne shehar, area aur required trade (Plumber, Electrician, AC, Carpenter) ke mutabiq certified worker select karein.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-emerald-700/20">
              2
            </div>
            <h3 className="font-bold text-lg text-slate-900">Request Bhejein ya Rabta Karein</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Apna masla, munasib tareekh aur waqt darj karein. Worker request accept kar ke aap se rabta karega.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-black text-xl mx-auto shadow-md shadow-emerald-700/20">
              3
            </div>
            <h3 className="font-bold text-lg text-slate-900">Kaam Mukammal & Tasdeeq</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Kaam ki tasalli ke baad worker ko payment dein aur apna 1-5 star review aur feedback darj karein.
            </p>
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="bg-slate-100/70 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Log Hamare Baare Mein Kya Kehte Hain?
            </h2>
            <p className="text-sm text-slate-600">
              Pakistani sarfeen aur technicians ka aitmaad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{t.comment}"
                </p>
                <div className="pt-2 border-t border-slate-100">
                  <h4 className="font-bold text-sm text-slate-900">{t.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{t.city}</span>
                    <span className="text-emerald-700 font-semibold">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WORKER CALL TO ACTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300 bg-emerald-950/60 px-3 py-1 rounded-full">
              Hunar Baniye
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Kya Aap Ek Mahir Electrician, Plumber ya Technician Hain?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100 leading-relaxed">
              Hunarmand Pakistan par muft register hon, apne shehar mein rozana naye customers hasil karein aur apni kamai mein izafa karein.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-2xl shadow-xl transition text-base"
            >
              <Briefcase className="w-5 h-5" />
              <span>Worker Baniye (Register Free)</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
