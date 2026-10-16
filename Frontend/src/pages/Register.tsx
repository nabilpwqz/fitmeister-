import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../ui/Icon';

export const Register: React.FC = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (!/[0-9]/.test(password) || !/[a-zA-Z]/.test(password)) {
      setError('Password must contain both letters and numbers.');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Google registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl transition-all">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center mx-auto text-brand-500 shadow-md shadow-brand-500/10">
            <Icon name="user" className="w-6 h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Create Member Account</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Join FitMeister to reserve classes, join forums, and track training</p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-500 space-y-1">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Mercer"
              required
              className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@fitmeister.com"
              required
              className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters (letters + numbers)"
              required
              className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-brand-500 transition-colors"
            />
            <p className="text-[10px] text-slate-500">Must be at least 8 characters and include numbers</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-98"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-surface-border"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-surface-card px-2 text-slate-500 font-bold">Or continue with</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-surface-dark hover:bg-slate-100 dark:hover:bg-surface-border border border-slate-300 dark:border-surface-border rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.27 21.36 7.35 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.35 0 3.27 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            Sign Up with Google
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="text-brand-500 font-bold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Register;
