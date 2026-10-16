import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Icon } from '../ui/Icon';

export const AdminLogin: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('admin@fitmeister.com');
  const [password, setPassword] = useState('Password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as ADMIN, redirect to /admin
  React.useEffect(() => {
    if (user?.role === 'ADMIN') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Administrator session verified. Welcome to Executive Operations.');
      navigate('/admin');
    } else {
      setError(result.error || 'Invalid administrator credentials.');
      toast.error(result.error || 'Authentication rejected.');
    }
  };

  const handleFillCredentials = () => {
    setEmail('admin@fitmeister.com');
    setPassword('Password123');
    toast.info('Dedicated Administrator credentials filled.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-surface-card border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-all relative overflow-hidden">
        {/* Decorative corner tag */}
        <div className="absolute top-0 right-0 bg-amber-500 text-black text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
          Admin Portal
        </div>

        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-500 shadow-md shadow-amber-500/10">
            <Icon name="shield" className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Executive Admin Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Authorized access for platform governance, trainer accreditations & moderation
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-500">
            {error}
          </div>
        )}

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-amber-500">Dedicated Admin Account</p>
            <p className="text-[11px] text-slate-400">admin@fitmeister.com • Pass: Password123</p>
          </div>
          <button
            type="button"
            onClick={handleFillCredentials}
            className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-[10px] rounded-lg transition-colors whitespace-nowrap"
          >
            Auto-Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              <label>Admin Username / Email</label>
              <span className="text-amber-500 font-mono lowercase">watermark: admin@fitmeister.com</span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@fitmeister.com"
              required
              className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500/60 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              <label>Admin Secure Password</label>
              <span className="text-amber-500 font-mono lowercase">watermark: Password123</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password123"
              required
              className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500/60 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-98"
          >
            {loading ? 'Verifying Admin Security...' : 'Access Admin Control Center'}
          </button>
        </form>

        <div className="border-t border-surface-border pt-4 flex justify-between items-center text-xs">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Main Homepage
          </Link>
          <Link to="/trainer/login" className="text-brand-500 font-bold hover:underline">
            Trainer Studio Portal →
          </Link>
        </div>
      </div>
    </div>
  );
};
export default AdminLogin;
