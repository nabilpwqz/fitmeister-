import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Icon } from '../ui/Icon';

export const TrainerLogin: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('marcus@fitmeister.com');
  const [password, setPassword] = useState('Password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as TRAINER or ADMIN, redirect to /trainer
  React.useEffect(() => {
    if (user?.role === 'TRAINER' || user?.role === 'ADMIN') {
      navigate('/trainer');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast.success('Instructor session verified. Welcome to Trainer Studio.');
      navigate('/trainer');
    } else {
      setError(result.error || 'Invalid instructor credentials.');
      toast.error(result.error || 'Authentication rejected.');
    }
  };

  const handleFillCredentials = () => {
    setEmail('marcus@fitmeister.com');
    setPassword('Password123');
    toast.info('Dedicated Certified Trainer credentials filled.');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-surface-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-all relative overflow-hidden">
        {/* Decorative corner tag */}
        <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[9px] font-extrabold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
          Trainer Studio
        </div>

        <div className="text-center space-y-2 pt-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-500 shadow-md shadow-emerald-500/10">
            <Icon name="dumbbell" className="w-7 h-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Instructor Studio Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Access your curriculum publishing studio, live athlete rosters & private schedules
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-500">
            {error}
          </div>
        )}

        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-emerald-500">Dedicated Trainer Account</p>
            <p className="text-[11px] text-slate-400">marcus@fitmeister.com • Pass: Password123</p>
          </div>
          <button
            type="button"
            onClick={handleFillCredentials}
            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-[10px] rounded-lg transition-colors whitespace-nowrap"
          >
            Auto-Fill
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              <label>Trainer Username / Email</label>
              <span className="text-emerald-500 font-mono lowercase">watermark: marcus@fitmeister.com</span>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="marcus@fitmeister.com"
              required
              className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500/60 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              <label>Instructor Password</label>
              <span className="text-emerald-500 font-mono lowercase">watermark: Password123</span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password123"
              required
              className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-500/60 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-98"
          >
            {loading ? 'Authenticating Instructor...' : 'Enter Trainer Studio Portal'}
          </button>
        </form>

        <div className="border-t border-surface-border pt-4 flex justify-between items-center text-xs">
          <Link to="/" className="text-slate-400 hover:text-white transition-colors">
            ← Main Homepage
          </Link>
          <Link to="/admin/login" className="text-amber-500 font-bold hover:underline">
            Admin Console Portal →
          </Link>
        </div>
      </div>
    </div>
  );
};
export default TrainerLogin;
