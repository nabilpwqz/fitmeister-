import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Icon } from '../ui/Icon';

type RoleCategory = 'MEMBER' | 'TRAINER' | 'ADMIN';

export const GetStarted: React.FC = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [selectedRole, setSelectedRole] = useState<RoleCategory>('MEMBER');

  // Member credentials
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [memberLoading, setMemberLoading] = useState(false);

  // Trainer credentials
  const [trainerEmail, setTrainerEmail] = useState('');
  const [trainerPassword, setTrainerPassword] = useState('');
  const [trainerLoading, setTrainerLoading] = useState(false);

  // Admin credentials
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);

  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = memberEmail.trim() || 'ethan@fitmeister.com';
    const passwordToUse = memberPassword || 'Password123';

    setMemberLoading(true);
    const result = await login(emailToUse, passwordToUse);
    setMemberLoading(false);

    if (result.success) {
      toast.success('Welcome back, Athlete!');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Authentication failed.');
    }
  };

  const handleTrainerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = trainerEmail.trim() || 'marcus@fitmeister.com';
    const passwordToUse = trainerPassword || 'Password123';

    setTrainerLoading(true);
    const result = await login(emailToUse, passwordToUse);
    setTrainerLoading(false);

    if (result.success) {
      toast.success('Instructor session verified. Welcome to Trainer Studio!');
      navigate('/trainer');
    } else {
      toast.error(result.error || 'Instructor credentials invalid.');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailToUse = adminEmail.trim() || 'admin@fitmeister.com';
    const passwordToUse = adminPassword || 'Password123';

    setAdminLoading(true);
    const result = await login(emailToUse, passwordToUse);
    setAdminLoading(false);

    if (result.success) {
      toast.success('Administrator session verified. Welcome to Executive Console!');
      navigate('/admin');
    } else {
      toast.error(result.error || 'Admin credentials invalid.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Header Guidance */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-[10px] font-extrabold uppercase tracking-widest">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Role Selection & Onboarding
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Welcome to FitMeister. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
            How are you joining us today?
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          Select your intended platform role below. Each portal provides role-governed workflows, dedicated permissions, and tailored studio dashboards.
        </p>
      </div>

      {/* Role Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. MEMBER CARD */}
        <div
          onClick={() => setSelectedRole('MEMBER')}
          className={`cursor-pointer rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between space-y-6 ${
            selectedRole === 'MEMBER'
              ? 'bg-surface-card border-brand-500 shadow-2xl scale-[1.02] ring-2 ring-brand-500/20'
              : 'bg-surface-card/60 border-surface-border hover:border-slate-500/50 hover:bg-surface-card'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center text-brand-500">
                <Icon name="dumbbell" className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-500 border border-brand-500/20 text-[10px] font-extrabold uppercase">
                Member Tier
              </span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                I am an Athlete / Member
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Explore verified studio classes, reserve guaranteed capacity spots, join discussions, and track training.
              </p>
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-brand-500" />
                Guaranteed Spot Reservations
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-brand-500" />
                12-Hour Free Cancellation
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-brand-500" />
                Community Forum & Bulletins
              </li>
            </ul>
          </div>

          <button
            type="button"
            className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              selectedRole === 'MEMBER'
                ? 'bg-brand-500 text-black shadow-md shadow-brand-500/20'
                : 'bg-surface-dark border border-surface-border text-slate-300'
            }`}
          >
            {selectedRole === 'MEMBER' ? 'Selected Portal' : 'Select Member Portal'}
          </button>
        </div>

        {/* 2. TRAINER CARD */}
        <div
          onClick={() => setSelectedRole('TRAINER')}
          className={`cursor-pointer rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between space-y-6 ${
            selectedRole === 'TRAINER'
              ? 'bg-surface-card border-emerald-500 shadow-2xl scale-[1.02] ring-2 ring-emerald-500/20'
              : 'bg-surface-card/60 border-surface-border hover:border-slate-500/50 hover:bg-surface-card'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Icon name="users" className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-extrabold uppercase">
                Trainer Studio
              </span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                I am a Certified Trainer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Publish custom curriculums, enforce participant capacity limits, and monitor live athlete rosters.
              </p>
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-emerald-500" />
                Curriculum Publishing Studio
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-emerald-500" />
                Live Athlete Check-In Rosters
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-emerald-500" />
                Accreditation & Profile Badge
              </li>
            </ul>
          </div>

          <button
            type="button"
            className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              selectedRole === 'TRAINER'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
                : 'bg-surface-dark border border-surface-border text-slate-300'
            }`}
          >
            {selectedRole === 'TRAINER' ? 'Selected Portal' : 'Select Trainer Portal'}
          </button>
        </div>

        {/* 3. ADMIN CARD */}
        <div
          onClick={() => setSelectedRole('ADMIN')}
          className={`cursor-pointer rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 flex flex-col justify-between space-y-6 ${
            selectedRole === 'ADMIN'
              ? 'bg-surface-card border-amber-500 shadow-2xl scale-[1.02] ring-2 ring-amber-500/20'
              : 'bg-surface-card/60 border-surface-border hover:border-slate-500/50 hover:bg-surface-card'
          }`}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Icon name="shield" className="w-6 h-6" />
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-extrabold uppercase">
                Admin Console
              </span>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                I am a Platform Admin
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Review trainer accreditations, moderate platform users, oversee facility capacity, and audit transactions.
              </p>
            </div>

            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-amber-500" />
                Trainer Application Review Queue
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-amber-500" />
                User Moderation (Soft-Block/Restore)
              </li>
              <li className="flex items-center gap-1.5">
                <Icon name="check" className="w-3.5 h-3.5 text-amber-500" />
                Class Unpublishing & Financial Audit
              </li>
            </ul>
          </div>

          <button
            type="button"
            className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all ${
              selectedRole === 'ADMIN'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-surface-dark border border-surface-border text-slate-300'
            }`}
          >
            {selectedRole === 'ADMIN' ? 'Selected Portal' : 'Select Admin Portal'}
          </button>
        </div>
      </div>

      {/* DEDICATED LOGIN SECTION WITH WATERMARKED INPUTS */}
      <div className="max-w-xl mx-auto bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Dynamic portal indicator bar */}
        <div
          className={`h-1.5 w-full absolute top-0 left-0 ${
            selectedRole === 'MEMBER'
              ? 'bg-brand-500'
              : selectedRole === 'TRAINER'
              ? 'bg-emerald-500'
              : 'bg-amber-500'
          }`}
        />

        <div className="text-center space-y-1">
          <span
            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
              selectedRole === 'MEMBER'
                ? 'bg-brand-500/10 text-brand-500'
                : selectedRole === 'TRAINER'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-amber-500/10 text-amber-500'
            }`}
          >
            {selectedRole} Portal Login
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
            Sign In with Dedicated Credentials
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Username and password are watermarked for immediate access
          </p>
        </div>

        {/* 1. MEMBER FORM */}
        {selectedRole === 'MEMBER' && (
          <form onSubmit={handleMemberLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex justify-between">
                <span>Member Email Address</span>
                <span className="text-brand-500/70 lowercase font-mono">watermark: ethan@fitmeister.com</span>
              </label>
              <input
                type="email"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                placeholder="ethan@fitmeister.com"
                className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500/60 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex justify-between">
                <span>Password</span>
                <span className="text-brand-500/70 lowercase font-mono">watermark: Password123</span>
              </label>
              <input
                type="password"
                value={memberPassword}
                onChange={(e) => setMemberPassword(e.target.value)}
                placeholder="Password123"
                className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500/60 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={memberLoading}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-98"
            >
              {memberLoading ? 'Authenticating Member...' : 'Sign In as Athlete'}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                New athlete?{' '}
                <Link to="/register" className="text-brand-500 font-bold hover:underline">
                  Register member account here
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* 2. TRAINER FORM */}
        {selectedRole === 'TRAINER' && (
          <form onSubmit={handleTrainerLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex justify-between">
                <span>Instructor Username / Email</span>
                <span className="text-emerald-500/70 lowercase font-mono">watermark: marcus@fitmeister.com</span>
              </label>
              <input
                type="email"
                value={trainerEmail}
                onChange={(e) => setTrainerEmail(e.target.value)}
                placeholder="marcus@fitmeister.com"
                className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500/60 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex justify-between">
                <span>Instructor Password</span>
                <span className="text-emerald-500/70 lowercase font-mono">watermark: Password123</span>
              </label>
              <input
                type="password"
                value={trainerPassword}
                onChange={(e) => setTrainerPassword(e.target.value)}
                placeholder="Password123"
                className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500/60 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={trainerLoading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-98"
            >
              {trainerLoading ? 'Authenticating Instructor...' : 'Enter Trainer Studio Portal'}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Direct URL:{' '}
                <Link to="/trainer/login" className="text-emerald-400 font-bold hover:underline">
                  Dedicated Trainer Portal Page
                </Link>
              </p>
            </div>
          </form>
        )}

        {/* 3. ADMIN FORM */}
        {selectedRole === 'ADMIN' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex justify-between">
                <span>Admin Username / Email</span>
                <span className="text-amber-500/70 lowercase font-mono">watermark: admin@fitmeister.com</span>
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@fitmeister.com"
                className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500/60 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex justify-between">
                <span>Admin Password</span>
                <span className="text-amber-500/70 lowercase font-mono">watermark: Password123</span>
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Password123"
                className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-white placeholder-slate-500/60 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={adminLoading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-98"
            >
              {adminLoading ? 'Authenticating Executive...' : 'Access Admin Control Center'}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-slate-500">
                Direct URL:{' '}
                <Link to="/admin/login" className="text-amber-500 font-bold hover:underline">
                  Dedicated Admin Console Page
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GetStarted;
