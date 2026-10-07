import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    setApiError('');
    if (Object.keys(v).length > 0) return;

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setApiError(result.message || 'Invalid email or password');
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4 py-12">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/8 rounded-full blur-[128px] animate-float" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary-700/8 rounded-full blur-[128px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-xl shadow-primary-500/20 animate-pulse-glow">
            DD
          </div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text">Desk</span>
            <span className="text-surface-300">Drop</span>
          </h1>
          <p className="text-surface-500 text-sm mt-2">Office Resource & Asset Booking</p>
        </div>

        {/* Form Card */}
        <div className="glass rounded-2xl p-8">
          <h2 className="text-xl font-bold text-surface-100 mb-1">Welcome back</h2>
          <p className="text-sm text-surface-500 mb-6">Sign in to manage your bookings</p>

          {apiError && (
            <div className="mb-5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-300 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@company.com"
                className={`w-full px-4 py-3 rounded-xl bg-surface-800/50 border text-surface-100 placeholder-surface-600 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                  errors.email ? 'border-red-500/40' : 'border-surface-700/50 focus:border-primary-500/50'
                }`}
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-300 mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange('password')}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl bg-surface-800/50 border text-surface-100 placeholder-surface-600 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary-500/30 ${
                  errors.password ? 'border-red-500/40' : 'border-surface-700/50 focus:border-primary-500/50'
                }`}
              />
              {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-500 hover:to-primary-400 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

