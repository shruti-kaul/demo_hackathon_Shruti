import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '◈' },
    { to: '/bookings', label: 'My Bookings', icon: '◉' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="glass sticky top-0 z-50 border-b border-primary-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary-500/20 group-hover:shadow-primary-500/40 transition-shadow">
              DD
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="gradient-text">Desk</span>
              <span className="text-surface-300">Drop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'bg-primary-500/15 text-primary-300 shadow-inner'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                }`}
              >
                <span className="mr-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu + Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="theme-toggle-knob">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>

            <div className="w-px h-6 bg-surface-700/50" />

            <div className="text-right">
              <p className="text-sm font-medium text-surface-200 flex items-center gap-1.5 justify-end">
                {user?.name}
                {user?.isAdmin && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ADMIN
                  </span>
                )}
              </p>
              <p className="text-xs text-surface-500">{user?.email}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <button
              onClick={handleLogout}
              className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium text-surface-400 hover:text-danger hover:bg-danger/10 border border-surface-700 hover:border-danger/30 transition-all"
            >
              Sign Out
            </button>
          </div>

          {/* Mobile: Theme Toggle + Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="theme-toggle-knob">
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800/50"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-primary-500/10 bg-surface-900/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? 'bg-primary-500/15 text-primary-300'
                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                }`}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-surface-800">
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-surface-200">{user?.name}</p>
                  <p className="text-xs text-surface-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full mt-2 px-4 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 text-left transition-all"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
