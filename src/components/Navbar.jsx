import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Wrench, Menu, X, User, Briefcase, LogOut, ShieldCheck, CalendarCheck, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Workers', path: '/workers' },
    { name: 'Services', path: '/services' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  const getRoleBadge = (role) => {
    switch (role) {
      case 'worker':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'admin':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 transition">
              <Wrench className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Hunarmand<span className="text-emerald-700">.pk</span>
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                  🇵🇰
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Har Hunar, Har Shehar
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {user?.role === 'customer' && (
                  <Link
                    to="/customer/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 px-3 py-1.5 rounded-xl transition"
                  >
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-700" />
                    <span>My Bookings</span>
                  </Link>
                )}
                {user?.role === 'worker' && (
                  <Link
                    to="/worker/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 px-3 py-1.5 rounded-xl transition"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-amber-700" />
                    <span>My Dashboard</span>
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-900 bg-rose-100 hover:bg-rose-200 border border-rose-300 px-3 py-1.5 rounded-xl transition"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-rose-700" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                <Link
                  to="/messages"
                  className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition"
                  title="Messages"
                >
                  <MessageSquare className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {user?.name?.split(' ')[0]}
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold uppercase ${getRoleBadge(user?.role)}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-100 px-3 py-2 rounded-lg transition"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Worker Baniye</span>
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-emerald-700 px-3 py-2 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-2 rounded-lg shadow-sm shadow-emerald-700/30 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-bold flex items-center justify-center">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold uppercase ${getRoleBadge(user?.role)}`}>
                      {user?.role}
                    </span>
                  </div>
                </div>

                {user?.role === 'customer' && (
                  <Link
                    to="/customer/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold bg-emerald-100 text-emerald-900"
                  >
                    <CalendarCheck className="w-4 h-4 text-emerald-700" />
                    <span>My Bookings</span>
                  </Link>
                )}

                {user?.role === 'worker' && (
                  <Link
                    to="/worker/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold bg-amber-100 text-amber-900"
                  >
                    <Briefcase className="w-4 h-4 text-amber-700" />
                    <span>Worker Dashboard</span>
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold bg-rose-100 text-rose-900"
                  >
                    <ShieldCheck className="w-4 h-4 text-rose-700" />
                    <span>Admin Portal</span>
                  </Link>
                )}

                <Link
                  to="/messages"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg text-sm font-semibold bg-slate-100 text-slate-800"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Messages & Chat</span>
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Worker Registration (Hunar Baniye)</span>
                </Link>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold border border-slate-300 text-slate-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-lg text-sm font-semibold bg-emerald-700 text-white"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
