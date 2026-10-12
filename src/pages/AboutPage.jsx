import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Target,
  Award,
  Users,
  MapPin,
  CheckCircle,
  Briefcase,
  ArrowRight,
} from 'lucide-react';

const AboutPage = () => {
  const cities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar',
    'D.I. Khan', 'Faisalabad', 'Multan', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad'
  ];

  return (
    <div className="space-y-20 py-16">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          Our Story & Vision
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight">
          Pakistan ke Hunar ko Digital Pehchan Dena
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          "Har Hunar, Har Shehar, Aap Ke Qareeb."
          Hunarmand Pakistan is born out of a simple reality: Pakistan is home to millions of extraordinary plumbers, electricians, carpenters, and technicians, yet homeowners struggle to find reliable assistance when a pipe bursts or power trips.
        </p>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Aitimad & Transparent Trust</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We verify worker identities, authenticate CNICs, and present genuine customer reviews so families can invite technicians into their homes with peace of mind.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Dignity of Labor (Izzat-e-Nafs)</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Skilled workers set their own starting rates, choose their preferred service radius, and retain 100% of their hard-earned labor without exploitative commissions.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Hyper-Local Community Focus</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              From Gulshan-e-Iqbal in Karachi to Gulberg in Lahore and Cantt in D.I. Khan, we connect you with professionals living and working in your specific neighborhood.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Standard */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
              Safety First
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Hamari Verification Policy
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              How we protect both customers and skilled workers on the platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 flex gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-base text-white">NADRA CNIC Verification</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Technicians submit their national identity cards which are verified by administrators prior to awarding the "Verified Badge".
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 flex gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-base text-white">Verified Customer Feedback</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Only customers with completed service requests can post reviews. Reviews cannot be falsified or purchased.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 flex gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-base text-white">Direct Accountability</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  A built-in reporting system allows users to flag overcharging, bad behavior, or safety concerns for immediate admin review.
                </p>
              </div>
            </div>

            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 flex gap-4">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-base text-white">Fair Price Transparency</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Technicians declare benchmark pricing up-front to eliminate surprise costs after arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cities Coverage Section */}
      <section className="max-w-5xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Shehar Jahan Hum Dastiyab Hain (Cities Covered)
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          We are expanding across Pakistan to bring skilled hands closer to every citizen.
        </p>

        <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto pt-2">
          {cities.map((city) => (
            <span
              key={city}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 hover:border-emerald-600 hover:text-emerald-700 transition shadow-sm"
            >
              📍 {city}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
