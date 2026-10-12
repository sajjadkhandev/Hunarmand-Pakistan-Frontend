import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16 text-center">
      <div className="space-y-4 max-w-md">
        <div className="text-6xl font-black text-emerald-700">404</div>
        <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
        <p className="text-sm text-slate-600">
          Yeh safha dastiyab nahi hai ya hata diya gaya hai.
        </p>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-xl hover:bg-emerald-800 transition"
          >
            <Home className="w-4 h-4" />
            Home Page Par Wapis Jaein
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
