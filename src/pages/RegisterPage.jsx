import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Mail,
  Lock,
  Phone,
  MapPin,
  Wrench,
  AlertCircle,
  Loader2,
  Camera,
  Upload,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [role, setRole] = useState('worker'); // Default to worker as requested
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Karachi');
  const [area, setArea] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const fileInputRef = useRef(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Handle direct file selection from device's Pictures folder
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setLocalError('Barah-e-karam image file (JPG, PNG, WebP) select karein.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

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
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setProfileImage(dataUrl);
        setLocalError('');
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!name || !email || !phone || !city || !area || !password) {
      setLocalError('Please fill out all required fields.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    const result = await register({
      name,
      email,
      phone,
      role,
      city,
      area,
      password,
      profileImage: profileImage || undefined,
    });
    setLoading(false);

    if (result.success) {
      if (role === 'worker') {
        navigate('/worker/dashboard', { replace: true });
      } else {
        navigate('/customer/dashboard', { replace: true });
      }
    } else {
      setLocalError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20">
            <Wrench className="w-6 h-6 text-amber-300" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create an Account</h2>
          <p className="text-xs text-slate-500">
            Join Hunarmand Pakistan as a Skilled Professional or Customer.
          </p>
        </div>

        {localError && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              role === 'worker'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Skilled Worker (Hunarmand)</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-emerald-800 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer (Ghar/Daftar)</span>
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* PROFILE PHOTO UPLOADER (DIRECT DEVICE FOLDER PICKER) */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {role === 'worker' ? '📸 Worker Profile Photo (Tasweer)' : '📸 Profile Photo (Optional)'}
              </label>
              {profileImage && (
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Photo Selected</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Selected Profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-600 shadow-md"
                  />
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-emerald-500 flex flex-col items-center justify-center text-slate-400 hover:text-emerald-700 transition cursor-pointer shadow-xs"
                    title="Click karein aur picture folder se tasweer select karein"
                  >
                    <Camera className="w-6 h-6 sm:w-7 sm:h-7" />
                    <span className="text-[9px] font-semibold mt-1">Photo</span>
                  </div>
                )}

                {profileImage && (
                  <button
                    type="button"
                    onClick={() => setProfileImage('')}
                    className="absolute -top-1.5 -right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow cursor-pointer transition"
                    title="Tasweer remove karein"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Apne computer ya mobile ke <strong>Pictures folder</strong> se direct apni tasweer upload karein.
                </p>

                {/* Hidden native file input directly opening system file dialog */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{profileImage ? 'Tasweer Tabdeel Karein' : '📁 Add Picture (Select from Folder)'}</span>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Muhammad Ali"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03001234567"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
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
              <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
                Area / Town
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Gulshan / Cantt / Saddar"
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          {role === 'worker' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
              ℹ️ <strong>Hunarmand Note:</strong> Registration ke baad aap apne Dashboard se skill category, experience, hourly rate aur kaam ki photos (portfolio) bhi add kar sakeinge.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold rounded-2xl shadow-lg shadow-emerald-700/20 transition text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Registering...</span>
              </>
            ) : (
              <span>Register as {role === 'customer' ? 'Customer' : 'Skilled Worker'}</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-600 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-emerald-700 hover:underline">
            Login karein
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
