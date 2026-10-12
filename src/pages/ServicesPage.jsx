import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ShieldCheck, Check, Sparkles, Filter } from 'lucide-react';
import { fetchCategories } from '../services/categoryService';

const defaultCategoriesList = [
  { slug: 'plumber', name: 'Plumber', icon: '🔧', description: 'Pipe fittings, sanitary installation, water tank cleaning, leakage solutions, water motor repairs.' },
  { slug: 'electrician', name: 'Electrician', icon: '⚡', description: 'UPS wiring, circuit breaker fixing, generator hookups, household wiring, fan and light installations.' },
  { slug: 'ac-technician', name: 'AC Technician', icon: '❄️', description: 'Inverter AC installation, copper piping, gas charging, jet wash master servicing, PCB repair.' },
  { slug: 'carpenter', name: 'Carpenter', icon: '🪚', description: 'Door repairs, lock replacement, custom wardrobes, wooden kitchen cabinets, furniture restoration.' },
  { slug: 'solar-technician', name: 'Solar Technician', icon: '☀️', description: 'Solar panel structure mounting, hybrid on-grid inverter configuration, net metering wiring.' },
  { slug: 'painter', name: 'Painter', icon: '🎨', description: 'Interior and exterior paint, wall putty, weather-sheet coating, polish, damp and moisture protection.' },
  { slug: 'mechanic', name: 'Mechanic', icon: '🔩', description: 'Motorcycle and automobile tuning, oil changes, brake overhaul, electrical engine diagnosis.' },
  { slug: 'appliance-repair', name: 'Appliance Repair', icon: '📱', description: 'Automatic washing machines, microwave ovens, refrigerators, deep freezers, water dispensers.' },
  { slug: 'mason-construction', name: 'Mason & Construction', icon: '🏗️', description: 'Tile and marble installation, brick plastering, boundary wall construction, concrete touchups.' },
  { slug: 'cleaner', name: 'Cleaner', icon: '🧹', description: 'Deep house cleaning, sofa shampooing, carpet wash, post-construction site cleaning.' },
];

const ServicesPage = () => {
  const [categories, setCategories] = useState(defaultCategoriesList);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        if (res?.categories && res.categories.length > 0) {
          setCategories(res.categories);
        }
      })
      .catch(() => {
        // Keep default categories list
      })
      .finally(() => setLoading(false));
  }, []);

  const serviceCatalogDetails = {
    'plumber': {
      startingPrice: 'Rs. 500',
      popularTasks: ['Sanitary fitting & repair', 'Water motor installation', 'Pipe leakage & blockage', 'Water tank wash'],
    },
    'electrician': {
      startingPrice: 'Rs. 600',
      popularTasks: ['UPS & Generator connection', 'Circuit breaker fixing', 'Short-circuit detection', 'Room wiring & lighting'],
    },
    'ac-technician': {
      startingPrice: 'Rs. 1,200',
      popularTasks: ['Master jet-wash service', 'Inverter gas charging', 'AC installation & shifting', 'PCB circuit card repair'],
    },
    'carpenter': {
      startingPrice: 'Rs. 700',
      popularTasks: ['Door lock & handle repair', 'Wardrobe & drawer fixing', 'Modular kitchen cabinets', 'Wood polishing & restoration'],
    },
    'solar-technician': {
      startingPrice: 'Rs. 2,000',
      popularTasks: ['Solar panel roof mounting', 'Inverter net-metering settings', 'Battery bank wiring', 'System efficiency audit'],
    },
    'painter': {
      startingPrice: 'Rs. 800',
      popularTasks: ['Interior wall emulsion', 'Weather-sheet exterior coating', 'Wall putty & sanding', 'Water seepage treatment'],
    },
    'mechanic': {
      startingPrice: 'Rs. 500',
      popularTasks: ['Bike oil change & tuning', 'Car brake pad inspection', 'Battery diagnosis & jumpstart', 'Emergency road assistance'],
    },
    'appliance-repair': {
      startingPrice: 'Rs. 800',
      popularTasks: ['Automatic washing machine fix', 'Microwave oven heating repair', 'Refrigerator cooling gas', 'Water dispenser servicing'],
    },
    'mason-construction': {
      startingPrice: 'Rs. 1,000',
      popularTasks: ['Floor & wall tile fixing', 'Brick plastering touchups', 'Bathroom renovation', 'Crack repair & waterproofing'],
    },
    'cleaner': {
      startingPrice: 'Rs. 1,000',
      popularTasks: ['Deep home scrubbing', 'Sofa & carpet shampooing', 'Post-construction cleaning', 'Water tank sterilization'],
    },
  };

  const filtered = categories.filter((cat) => {
    const term = searchTerm.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(term) ||
      cat.description?.toLowerCase().includes(term) ||
      cat.slug?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Comprehensive Service Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Professional Services Across Pakistan
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From plumbing leakages to solar installations, explore vetted craftsmen offering upfront starting rates and certified skills.
        </p>

        {/* Search input */}
        <div className="pt-2 max-w-md mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search service, e.g. 'leakage', 'solar', 'ac'..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 shadow-sm"
          />
        </div>
      </div>

      {/* Grid of services */}
      {loading ? (
        <div className="text-center py-20 text-slate-500">Services catalog load ho rahi hai...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-slate-600">Koi service nahi mili matching "{searchTerm}".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((cat) => {
            const extra = serviceCatalogDetails[cat.slug] || {
              startingPrice: 'Rs. 500',
              popularTasks: ['General maintenance', 'Diagnosis & repair', 'Home consultation'],
            };

            return (
              <div
                key={cat.slug || cat._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-xl hover:border-emerald-500 transition duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl p-3 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 transition">
                      {cat.icon || '🔧'}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      Starting {extra.startingPrice}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition mb-2">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  {/* Tasks checklist */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-1">
                      Common Jobs
                    </span>
                    {extra.popularTasks.map((task, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                        <span>{task}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={`/workers?category=${cat.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-emerald-700 text-slate-800 hover:text-white font-semibold text-xs rounded-xl transition group-hover:bg-emerald-700 group-hover:text-white"
                  >
                    <span>{cat.name} Specialists Dekhein</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
