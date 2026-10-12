import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Wrench, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const defaultDest =
        result.user?.role === 'admin'
          ? '/admin/dashboard'
          : result.user?.role === 'worker'
          ? '/worker/dashboard'
          : '/customer/dashboard';
      const dest = location.state?.from?.pathname && location.state.from.pathname !== '/'
        ? location.state.from.pathname
        : defaultDest;
      navigate(dest, { replace: true });
    } else {
      setLocalError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-700 text-white rounded-xl flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20">
            <Wrench className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-xs text-slate-500">
            Apne Hunarmand Pakistan account mein login karein.
          </p>
        </div>

        {localError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aapka.email@example.com"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-semibold rounded-xl shadow-md shadow-emerald-700/20 transition text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In (Login)</span>
            )}
          </button>
        </form>

        {/* Quick Demo Test Accounts Box */}
        <div className="pt-2 border-t border-slate-100">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">
            Demo Test Accounts (ایک کلک سے بھریں)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('sajjadwazir4459@gmail.com');
                setPassword('khan4459');
                setLocalError('');
              }}
              className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-semibold transition text-center cursor-pointer shadow-xs"
            >
              👑 Sajjad Wazir (Admin)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('tariq@hunarmand.pk');
                setPassword('Password123!');
                setLocalError('');
              }}
              className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition text-center cursor-pointer"
            >
              🔧 Worker (Ustad Tariq)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('bilal@gmail.com');
                setPassword('Password123!');
                setLocalError('');
              }}
              className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition text-center cursor-pointer"
            >
              👤 Customer (Bilal Khan)
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@hunarmand.pk');
                setPassword('Admin1234!');
                setLocalError('');
              }}
              className="py-1.5 px-2 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition text-center cursor-pointer"
            >
              ⚙️ System Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Account nahi hai?{' '}
          <Link to="/register" className="font-semibold text-emerald-700 hover:underline">
            Register karein
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
