import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Icon } from '../ui/Icon';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#0c1015]/90 backdrop-blur-md border-b border-surface-border transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center text-black font-extrabold shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Icon name="dumbbell" className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-base sm:text-xl font-extrabold tracking-wider text-slate-100">
              FITMEISTER
            </span>
            <p className="text-[9px] uppercase tracking-widest text-brand-500 font-bold hidden sm:block">
              Gym Operations Platform
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs font-semibold">
          <Link to="/" className="text-slate-300 hover:text-brand-500 transition-colors py-2">
            Home
          </Link>
          <Link to="/classes" className="text-slate-300 hover:text-brand-500 transition-colors py-2">
            All Classes
          </Link>
          <Link to="/forum" className="text-slate-300 hover:text-brand-500 transition-colors py-2">
            Community Forum
          </Link>
          
          {user?.role === 'ADMIN' ? (
            <Link
              to="/admin"
              className="px-3 py-1 bg-amber-500/15 hover:bg-amber-500 text-amber-500 hover:text-black border border-amber-500/40 rounded-xl font-extrabold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Icon name="shield" className="w-3.5 h-3.5" />
              Admin Console
            </Link>
          ) : user?.role === 'TRAINER' ? (
            <Link
              to="/trainer"
              className="px-3 py-1 bg-emerald-500/15 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/40 rounded-xl font-extrabold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Icon name="dumbbell" className="w-3.5 h-3.5" />
              Trainer Studio
            </Link>
          ) : (
            <>
              <Link to="/trainer/login" className="text-slate-400 hover:text-emerald-400 transition-colors py-2">
                Trainer Portal
              </Link>
              <Link to="/admin/login" className="text-slate-400 hover:text-amber-400 transition-colors py-2">
                Admin Portal
              </Link>
            </>
          )}

          {user && (
            <Link
              to="/dashboard"
              className="text-slate-300 hover:text-brand-500 transition-colors py-2 flex items-center gap-1.5"
            >
              <Icon name="dashboard" className="w-4 h-4 text-brand-500" />
              Dashboard
            </Link>
          )}
        </nav>

        {/* Control Cluster */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-surface-card border border-surface-border text-slate-300 hover:text-brand-500 transition-all hover:scale-105 active:scale-95 shadow-sm"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Night Mode'}
            aria-label="Toggle theme"
          >
            <Icon
              name={isDark ? 'sun' : 'moon'}
              className="w-4 h-4 text-brand-500 transition-transform duration-300 rotate-0 hover:rotate-45"
            />
          </button>

          {/* Auth Button or User Badge */}
          {user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to={user.role === 'ADMIN' ? '/admin' : user.role === 'TRAINER' ? '/trainer' : '/dashboard'}
                className="flex items-center gap-2.5 px-3 py-1.5 bg-surface-card border border-surface-border rounded-xl hover:border-brand-500/50 transition-colors shadow-sm"
              >
                <div className="w-7 h-7 rounded-lg bg-surface-border flex items-center justify-center font-bold text-xs text-brand-500">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold leading-none text-slate-100">{user.name}</p>
                  <span className={`text-[9px] uppercase tracking-wider font-extrabold ${
                    user.role === 'ADMIN' ? 'text-amber-500' : user.role === 'TRAINER' ? 'text-emerald-400' : 'text-brand-500'
                  }`}>
                    {user.role}
                  </span>
                </div>
              </Link>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 transition-colors"
                title="Sign Out"
              >
                <Icon name="logout" className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/get-started"
                className="px-4 py-2 text-xs font-bold bg-brand-500 hover:bg-brand-600 text-black rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-surface-card border border-surface-border text-slate-400 hover:text-brand-500 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-surface-border bg-surface-dark px-4 py-6 space-y-4">
          <nav className="flex flex-col space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-300 hover:text-brand-500 py-1"
            >
              Home
            </Link>
            <Link
              to="/classes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-300 hover:text-brand-500 py-1"
            >
              All Classes
            </Link>
            <Link
              to="/forum"
              onClick={() => setMobileMenuOpen(false)}
              className="text-sm font-semibold text-slate-300 hover:text-brand-500 py-1"
            >
              Community Forum
            </Link>

            {user?.role === 'ADMIN' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-extrabold text-amber-500 py-1 flex items-center gap-2"
              >
                <Icon name="shield" className="w-4 h-4 text-amber-500" />
                Admin Console
              </Link>
            )}

            {user?.role === 'TRAINER' && (
              <Link
                to="/trainer"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-extrabold text-emerald-400 py-1 flex items-center gap-2"
              >
                <Icon name="dumbbell" className="w-4 h-4 text-emerald-400" />
                Trainer Studio
              </Link>
            )}

            <div className="pt-2 border-t border-surface-border/50 flex flex-col space-y-2">
              <Link
                to="/trainer/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-emerald-400 py-1"
              >
                Trainer Portal Login
              </Link>
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs font-semibold text-amber-400 py-1"
              >
                Admin Console Login
              </Link>
            </div>

            {user && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-brand-500 py-1 flex items-center gap-2"
              >
                <Icon name="dashboard" className="w-4 h-4" />
                Member Workspace
              </Link>
            )}
          </nav>

          <div className="pt-4 border-t border-surface-border flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full py-2.5 rounded-xl bg-surface-card border border-surface-border text-xs font-bold text-slate-300 hover:text-rose-500"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-surface-card border border-surface-border text-xs font-bold text-slate-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/get-started"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-brand-500 text-black text-xs font-bold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
