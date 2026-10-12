import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  UserCheck,
  Send,
  Star,
  DollarSign,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const HowItWorksPage = () => {
  const [tab, setTab] = useState('customer');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      {/* Page Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Step-by-Step Guide
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Hunarmand Pakistan Kaise Kaam Karta Hai?
        </h1>
        <p className="text-sm text-slate-600">
          Chaahe aap worker dhoond rahe hon ya apna hunar bechna chahein, process nihayat aasan hai.
        </p>

        {/* Tab Toggle */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1 bg-slate-200 rounded-2xl">
            <button
              onClick={() => setTab('customer')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tab === 'customer'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Sarfeen Ke Liye (For Customers)
            </button>
            <button
              onClick={() => setTab('worker')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                tab === 'worker'
                  ? 'bg-emerald-700 text-white shadow-md'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Hunarmand Ke Liye (For Workers)
            </button>
          </div>
        </div>
      </div>

      {/* Customer Journey Steps */}
      {tab === 'customer' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Search & Filter</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apna shehar (e.g. Karachi, Lahore, DI Khan) aur service (Plumber, Electrician) select karein.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Profile & Reviews Check</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Worker ka tajurba, verified status, starting rate aur doosre sarfeen ke reviews dekhein.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Request Bhejein</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apna masla, munasib tareekh aur time slot darj kar ke booking request bhejein.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900">Payment & Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kaam mukammal hone par worker ko direct payment dein aur 1-5 star review darj karein.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/workers"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition shadow-lg shadow-emerald-700/20"
            >
              <span>Abhi Skilled Worker Talash Karein</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Worker Journey Steps */}
      {tab === 'worker' && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Muft Registration</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apna naam, mobile number, shehar aur area darj kar ke worker account banayein.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Profile & Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apna skill (e.g. Electrician), tajurba, starting rate darj karein aur CNIC verification hasil karein.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Jobs Accept Karein</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apne qareeb ke ilaqon se aane wali service requests ko apni sahulat ke mutabiq accept karein.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-center">
              <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center font-bold text-lg mx-auto">
                4
              </div>
              <h3 className="font-bold text-base text-slate-900">100% Kamai Aapki</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Customer se direct payment hasil karein. Hum koi commission nahi kaatte.
              </p>
            </div>
          </div>

          <div className="text-center pt-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 text-slate-950 font-bold rounded-xl hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              <Briefcase className="w-4 h-4" />
              <span>Worker Account Banayein (Register Now)</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HowItWorksPage;
