import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Heart, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Wrench className="w-4 h-4 text-amber-300" />
              </div>
              <span className="font-extrabold text-xl text-white">
                Hunarmand<span className="text-emerald-400">.pk</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              <strong>"Har Hunar, Har Shehar, Aap Ke Qareeb."</strong>
              <br />
              Connecting skilled Pakistani technicians, electricians, plumbers, and craftsmen with customers in every city.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <span>🇵🇰 Made with pride for Pakistan</span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Popular Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/workers?category=electrician" className="hover:text-emerald-400 transition">⚡ Electrician</Link></li>
              <li><Link to="/workers?category=plumber" className="hover:text-emerald-400 transition">🔧 Plumber</Link></li>
              <li><Link to="/workers?category=ac-technician" className="hover:text-emerald-400 transition">❄️ AC Technician</Link></li>
              <li><Link to="/workers?category=carpenter" className="hover:text-emerald-400 transition">🪚 Carpenter</Link></li>
              <li><Link to="/workers?category=solar-technician" className="hover:text-emerald-400 transition">☀️ Solar Technician</Link></li>
              <li><Link to="/workers?category=painter" className="hover:text-emerald-400 transition">🎨 Painter</Link></li>
            </ul>
          </div>

          {/* Major Cities */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Cities Covered
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm text-slate-400">
              <Link to="/workers?city=Karachi" className="hover:text-emerald-400 transition">Karachi</Link>
              <Link to="/workers?city=Lahore" className="hover:text-emerald-400 transition">Lahore</Link>
              <Link to="/workers?city=Islamabad" className="hover:text-emerald-400 transition">Islamabad</Link>
              <Link to="/workers?city=Rawalpindi" className="hover:text-emerald-400 transition">Rawalpindi</Link>
              <Link to="/workers?city=Faisalabad" className="hover:text-emerald-400 transition">Faisalabad</Link>
              <Link to="/workers?city=Multan" className="hover:text-emerald-400 transition">Multan</Link>
              <Link to="/workers?city=Peshawar" className="hover:text-emerald-400 transition">Peshawar</Link>
              <Link to="/workers?city=D.I.+Khan" className="hover:text-emerald-400 transition">D.I. Khan</Link>
            </div>
          </div>

          {/* Quick Links & Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition">Contact & Support</Link></li>
              <li><Link to="/workers" className="hover:text-emerald-400 transition">Find Skilled Workers</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition">Worker Registration</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition">Customer Login</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© {new Date().getFullYear()} Hunarmand Pakistan. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with MERN Stack • Safe & Verified Services
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
