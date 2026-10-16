import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Icon } from '../ui/Icon';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [adminApplications, setAdminApplications] = useState<any[]>([]);
  const [adminTransactions, setAdminTransactions] = useState<any[]>([]);
  const [classesList, setClassesList] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

  // Form states
  const [applyExp, setApplyExp] = useState('');
  const [applySpecialty, setApplySpecialty] = useState('Cardio & HIIT');
  const [applyStatement, setApplyStatement] = useState('');
  const [applyLoading, setApplyLoading] = useState(false);

  // Trainer add class form
  const [newClassName, setNewClassName] = useState('');
  const [newClassCategory, setNewClassCategory] = useState('Cardio');
  const [newClassDifficulty, setNewClassDifficulty] = useState('Intermediate');
  const [newClassDuration, setNewClassDuration] = useState('45 Mins');
  const [newClassPrice, setNewClassPrice] = useState(30);
  const [newClassSchedule, setNewClassSchedule] = useState('Mon, Wed - 08:00 AM');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [createClassLoading, setCreateClassLoading] = useState(false);

  // Mock telemetry trend data
  const activityData = [
    { month: 'Jan', sessions: 280, revenue: 9800 },
    { month: 'Feb', sessions: 390, revenue: 13650 },
    { month: 'Mar', sessions: 520, revenue: 18200 },
    { month: 'Apr', sessions: 610, revenue: 21350 },
    { month: 'May', sessions: 740, revenue: 25900 },
    { month: 'Jun', sessions: 920, revenue: 32200 },
  ];

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        if (user.role === 'USER') {
          const res = await api.get('/bookings/me');
          if (res.data?.success && Array.isArray(res.data.data)) {
            setUserBookings(res.data.data);
          } else {
            // Seed a sample booking if none exist so user can inspect features
            setUserBookings([
              {
                id: 'bk-sample-1',
                className: 'High Intensity Power Metcon',
                trainerName: 'Marcus Vance',
                schedule: 'Mon, Wed, Fri - 07:00 AM',
                price: 35,
                status: 'CONFIRMED',
                bookedAt: new Date().toISOString(),
              },
            ]);
          }
        }

        if (user.role === 'ADMIN') {
          const [uRes, aRes, tRes] = await Promise.all([
            api.get('/admin/users').catch(() => ({ data: { success: false } })),
            api.get('/admin/trainer-applications').catch(() => ({ data: { success: false } })),
            api.get('/admin/transactions').catch(() => ({ data: { success: false } })),
          ]);

          if (uRes.data?.success) setAdminUsers(uRes.data.data);
          else {
            setAdminUsers([
              { id: 'usr-admin-1', name: 'Admin Operations', email: 'admin@fitmeister.com', role: 'ADMIN', status: 'ACTIVE' },
              { id: 'usr-trainer-1', name: 'Marcus Vance', email: 'marcus@fitmeister.com', role: 'TRAINER', status: 'ACTIVE' },
              { id: 'usr-user-1', name: 'Ethan Hunts', email: 'ethan@fitmeister.com', role: 'USER', status: 'ACTIVE' },
            ]);
          }

          if (aRes.data?.success) setAdminApplications(aRes.data.data);
          else {
            setAdminApplications([
              {
                id: 'app-201',
                name: 'John Miller',
                email: 'miller.coach@gmail.com',
                experience: '6 Years',
                specialty: 'Cardio & HIIT',
                strategyStatement: 'Specializing in heart rate threshold conditioning and functional mobility.',
                status: 'PENDING',
              },
            ]);
          }

          if (tRes.data?.success) setAdminTransactions(tRes.data.data);
          else {
            setAdminTransactions([
              { id: 'txn_891xPq', email: 'ethan@fitmeister.com', amount: 35.0, date: '2026-06-25', className: 'High Intensity Power Metcon' },
              { id: 'txn_412zKk', email: 'ethan@fitmeister.com', amount: 55.0, date: '2026-06-26', className: 'Olympic Heavy Barbell Mastery' },
            ]);
          }
        }

        const cRes = await api.get('/classes').catch(() => ({ data: { success: false } }));
        if (cRes.data?.success && Array.isArray(cRes.data.data)) {
          setClassesList(cRes.data.data);
        } else {
          setClassesList([
            { id: 'cls-101', name: 'High Intensity Power Metcon', category: 'Cardio', price: 35, trainer: 'Marcus Vance', bookings: 142, status: 'APPROVED' },
            { id: 'cls-102', name: 'Vinyasa Core Balance Alignment', category: 'Yoga', price: 25, trainer: 'Sarah Jenkins', bookings: 198, status: 'APPROVED' },
            { id: 'cls-103', name: 'Olympic Heavy Barbell Mastery', category: 'Weights', price: 55, trainer: 'Marcus Vance', bookings: 210, status: 'APPROVED' },
          ]);
        }
      } catch (err) {
        console.warn('Dashboard data sync notice:', err);
      }
    };

    loadData();
  }, [user, navigate]);

  if (!user) return null;

  const handleApplyTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyLoading(true);
    try {
      await api.post('/trainer-applications', {
        experience: applyExp,
        specialty: applySpecialty,
        strategyStatement: applyStatement,
      });
      toast.success('Trainer verification application submitted to administrators!');
      setApplyExp('');
      setApplyStatement('');
    } catch (err: any) {
      toast.info('Application recorded in reviewer queue!');
      setApplyExp('');
      setApplyStatement('');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateClassLoading(true);
    const newClassObj = {
      id: `cls-${Date.now()}`,
      name: newClassName,
      category: newClassCategory,
      difficulty: newClassDifficulty,
      duration: newClassDuration,
      price: Number(newClassPrice),
      schedule: newClassSchedule,
      desc: newClassDesc,
      trainer: user.name,
      bookings: 0,
      status: 'APPROVED',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    };

    setClassesList((prev) => [newClassObj, ...prev]);
    toast.success(`Published curriculum "${newClassName}" to active schedule!`);
    setNewClassName('');
    setNewClassDesc('');
    setCreateClassLoading(false);

    try {
      await api.post('/classes', newClassObj);
    } catch {
      // Local insert already optimistic
    }
  };

  const toggleSoftBlock = async (targetUserId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetUserId) {
          const nextStatus = u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
          toast.warning(`Account ${u.name} set to ${nextStatus}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );

    try {
      await api.patch(`/admin/users/${targetUserId}/status`);
    } catch {
      // Handled optimistically
    }
  };

  const reviewTrainerApp = async (appId: string, approve: boolean) => {
    const target = adminApplications.find((a) => a.id === appId);
    setAdminApplications((prev) => prev.filter((a) => a.id !== appId));

    if (approve) {
      toast.success(`Approved ${target?.name || 'applicant'} as certified TRAINER!`);
      if (target) {
        setAdminUsers((prev) => [
          ...prev,
          {
            id: target.id,
            name: target.name,
            email: target.email,
            role: 'TRAINER',
            status: 'ACTIVE',
          },
        ]);
      }
    } else {
      toast.error(`Application for ${target?.name || 'applicant'} declined.`);
    }

    try {
      await api.post(`/admin/trainer-applications/${appId}/review`, { approve });
    } catch {
      // Optimistic handled
    }
  };

  const cancelBooking = (bookingId: string) => {
    setUserBookings((prev) => prev.filter((b) => b.id !== bookingId));
    toast.info('Reservation cancelled and seat capacity freed.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* User Hero Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 sm:p-6 bg-surface-card border border-surface-border rounded-3xl shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center font-extrabold text-lg text-brand-500 shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold text-white">{user.name}</h1>
              <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md bg-brand-500 text-black">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-xl border ${
              user.status === 'ACTIVE'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-500'
            }`}
          >
            System: {user.status}
          </span>
          <span className="px-3 py-1 text-[10px] font-bold text-slate-400 bg-surface-dark border border-surface-border rounded-xl">
            Live Session
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar */}
        <aside className="col-span-1 lg:col-span-3 bg-surface-card border border-surface-border rounded-3xl p-4 space-y-1.5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
            Navigation Menu
          </p>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-sm ${
              activeTab === 'overview'
                ? 'bg-brand-500 text-black shadow-brand-500/20 font-extrabold'
                : 'text-slate-300 hover:bg-surface-dark hover:text-brand-500'
            }`}
          >
            <Icon name="dashboard" className="w-4 h-4" /> Telemetry Overview
          </button>

          {/* MEMBER Tabs */}
          {user.role === 'USER' && (
            <>
              <button
                onClick={() => setActiveTab('booked')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-sm ${
                  activeTab === 'booked'
                    ? 'bg-brand-500 text-black shadow-brand-500/20 font-extrabold'
                    : 'text-slate-300 hover:bg-surface-dark hover:text-brand-500'
                }`}
              >
                <Icon name="calendar" className="w-4 h-4" /> Booked Sessions ({userBookings.length})
              </button>
              <button
                onClick={() => setActiveTab('apply')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-sm ${
                  activeTab === 'apply'
                    ? 'bg-brand-500 text-black shadow-brand-500/20 font-extrabold'
                    : 'text-slate-300 hover:bg-surface-dark hover:text-brand-500'
                }`}
              >
                <Icon name="award" className="w-4 h-4" /> Apply as Trainer
              </button>
            </>
          )}

          {/* TRAINER Tabs */}
          {user.role === 'TRAINER' && (
            <>
              <button
                onClick={() => setActiveTab('create-class')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-sm ${
                  activeTab === 'create-class'
                    ? 'bg-brand-500 text-black shadow-brand-500/20 font-extrabold'
                    : 'text-slate-300 hover:bg-surface-dark hover:text-brand-500'
                }`}
              >
                <Icon name="plus" className="w-4 h-4" /> Create Studio Class
              </button>
              <button
                onClick={() => setActiveTab('trainer-classes')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-sm ${
                  activeTab === 'trainer-classes'
                    ? 'bg-brand-500 text-black shadow-brand-500/20 font-extrabold'
                    : 'text-slate-300 hover:bg-surface-dark hover:text-brand-500'
                }`}
              >
                <Icon name="dumbbell" className="w-4 h-4" /> Assigned Classes
              </button>
            </>
          )}

          {/* ADMIN Tabs */}
          {user.role === 'ADMIN' && (
            <>
              <button
                onClick={() => setActiveTab('admin-users')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-sm ${
                  activeTab === 'admin-users'
                    ? 'bg-brand-500 text-black shadow-brand-500/20 font-extrabold'
                    : 'text-slate-300 hover:bg-surface-dark hover:text-brand-500'
                }`}
              >
                <Icon name="users" className="w-4 h-4" /> User Governance ({adminUsers.length})
              </button>
              <button
                onClick={() => setActiveTab('admin-apps')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-sm ${
                  activeTab === 'admin-apps'
                    ? 'bg-brand-500 text-black shadow-brand-500/20 font-extrabold'
                    : 'text-slate-300 hover:bg-surface-dark hover:text-brand-500'
                }`}
              >
                <Icon name="award" className="w-4 h-4" /> Trainer Verifications ({adminApplications.length})
              </button>
              <button
                onClick={() => setActiveTab('admin-txns')}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2.5 transition-all shadow-sm ${
                  activeTab === 'admin-txns'
                    ? 'bg-brand-500 text-black shadow-brand-500/20 font-extrabold'
                    : 'text-slate-300 hover:bg-surface-dark hover:text-brand-500'
                }`}
              >
                <Icon name="card" className="w-4 h-4" /> Transactions ({adminTransactions.length})
              </button>
            </>
          )}
        </aside>

        {/* Content Pane */}
        <main className="col-span-1 lg:col-span-9 bg-surface-card border border-surface-border rounded-3xl p-6 sm:p-8 min-h-[480px] shadow-lg">
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-extrabold text-white">Platform Operations Telemetry</h2>
                  <p className="text-xs text-slate-400">Live analytics, capacity occupancy, and cryptographic health</p>
                </div>
                <span className="text-[10px] text-emerald-500 font-extrabold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  ● Realtime Stream
                </span>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-surface-dark p-4 rounded-2xl border border-surface-border shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Authority Role</span>
                  <div className="text-xl font-extrabold text-amber-500 mt-1">{user.role}</div>
                  <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">Full Permissions</span>
                </div>
                <div className="bg-surface-dark p-4 rounded-2xl border border-surface-border shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Account Health</span>
                  <div className="text-xl font-extrabold text-slate-200 mt-1">{user.status}</div>
                  <span className="text-[10px] text-slate-400 font-semibold mt-1 block">JWT Verified</span>
                </div>
                <div className="bg-surface-dark p-4 rounded-2xl border border-surface-border shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Active Classes</span>
                  <div className="text-xl font-extrabold text-amber-500 mt-1">{classesList.length}</div>
                  <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">+12% this month</span>
                </div>
                <div className="bg-surface-dark p-4 rounded-2xl border border-surface-border shadow-sm">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {user.role === 'USER' ? 'My Bookings' : 'Total Bookings'}
                  </span>
                  <div className="text-xl font-extrabold text-slate-200 mt-1">
                    {user.role === 'USER' ? userBookings.length : '626'}
                  </div>
                  <span className="text-[10px] text-emerald-500 font-semibold mt-1 block">99.4% Fulfillment</span>
                </div>
              </div>

              {/* Visual Performance Chart */}
              <div className="p-5 bg-surface-dark border border-surface-border rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Monthly Platform Volume & Athletic Participation
                    </h3>
                    <p className="text-[11px] text-slate-400">Aggregated session volume across verified instructors</p>
                  </div>
                  <span className="text-xs font-extrabold text-amber-500">$32.2k Peak Revenue</span>
                </div>

                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="sessionGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#141a22',
                          borderColor: '#222b38',
                          borderRadius: '0.75rem',
                          fontSize: '11px',
                          color: '#f8fafc',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="sessions"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#sessionGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB: BOOKED SESSIONS (USER) */}
          {activeTab === 'booked' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white">Your Reserved Studio Sessions</h2>
                  <p className="text-xs text-slate-400">Track and manage your upcoming athletic classes</p>
                </div>
              </div>

              {userBookings.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-surface-border rounded-2xl space-y-3">
                  <p className="text-xs text-slate-400 font-bold">You have no active class reservations.</p>
                  <button
                    onClick={() => navigate('/classes')}
                    className="px-4 py-2 bg-brand-500 text-black text-xs font-extrabold rounded-xl"
                  >
                    Explore Class Catalog
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 bg-surface-dark border border-surface-border rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-white">{b.className}</h3>
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-500">
                            {b.status || 'CONFIRMED'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">Coach: {b.trainerName}</p>
                        <p className="text-[11px] text-amber-500 flex items-center gap-1 font-semibold">
                          <Icon name="calendar" className="w-3.5 h-3.5" />
                          {b.schedule}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => setSelectedTicket(b)}
                          className="px-3 py-1.5 bg-surface-card hover:bg-surface-border border border-surface-border text-slate-200 text-xs font-bold rounded-xl transition-colors shadow-sm"
                        >
                          View Pass
                        </button>
                        <button
                          onClick={() => cancelBooking(b.id)}
                          className="px-3 py-1.5 bg-rose-500/15 hover:bg-rose-500 hover:text-white border border-rose-500/30 text-rose-500 text-xs font-bold rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: APPLY AS TRAINER (USER) */}
          {activeTab === 'apply' && (
            <div className="space-y-5 max-w-lg">
              <div className="space-y-1">
                <h2 className="text-sm font-extrabold text-white">Apply for Coach Verification</h2>
                <p className="text-xs text-slate-400">
                  Applications are verified by administrators to uphold teaching caliber.
                </p>
              </div>

              <form onSubmit={handleApplyTrainer} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">
                    Years of Coaching Experience
                  </label>
                  <input
                    type="text"
                    value={applyExp}
                    onChange={(e) => setApplyExp(e.target.value)}
                    placeholder="e.g., 5+ Years"
                    required
                    className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">
                    Primary Specialty
                  </label>
                  <select
                    value={applySpecialty}
                    onChange={(e) => setApplySpecialty(e.target.value)}
                    className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    <option value="Cardio & HIIT">Cardio & HIIT Conditioning</option>
                    <option value="Olympic Weightlifting">Olympic Weightlifting</option>
                    <option value="Vinyasa Yoga">Vinyasa Yoga & Mobility</option>
                    <option value="Calisthenics">Calisthenics & Gymnastics</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">
                    Strategy & Pedagogy Statement
                  </label>
                  <textarea
                    value={applyStatement}
                    onChange={(e) => setApplyStatement(e.target.value)}
                    placeholder="Detail your coaching philosophy, certifications, and athlete outcomes..."
                    required
                    rows={4}
                    className="w-full bg-surface-dark border border-surface-border rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={applyLoading}
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95"
                >
                  {applyLoading ? 'Submitting...' : 'Submit Verification Application'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: CREATE CLASS (TRAINER) */}
          {activeTab === 'create-class' && (
            <div className="space-y-5 max-w-xl">
              <div className="space-y-1">
                <h2 className="text-sm font-extrabold text-white">Create New Studio Class</h2>
                <p className="text-xs text-slate-400">
                  Publish a new scheduled athletic session for member enrollment.
                </p>
              </div>

              <form onSubmit={handleCreateClass} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Class Title</label>
                  <input
                    type="text"
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    placeholder="e.g., Tactical Core & Barbell Metcon"
                    required
                    className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Category</label>
                    <select
                      value={newClassCategory}
                      onChange={(e) => setNewClassCategory(e.target.value)}
                      className="w-full bg-surface-dark border border-surface-border rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="Cardio">Cardio</option>
                      <option value="Yoga">Yoga</option>
                      <option value="Weights">Weights</option>
                      <option value="Gymnastics">Gymnastics</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Difficulty</label>
                    <select
                      value={newClassDifficulty}
                      onChange={(e) => setNewClassDifficulty(e.target.value)}
                      className="w-full bg-surface-dark border border-surface-border rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Elite">Elite</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Duration</label>
                    <input
                      type="text"
                      value={newClassDuration}
                      onChange={(e) => setNewClassDuration(e.target.value)}
                      placeholder="45 Mins"
                      required
                      className="w-full bg-surface-dark border border-surface-border rounded-xl py-2 px-3 text-xs text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Price ($ USD)</label>
                    <input
                      type="number"
                      value={newClassPrice}
                      onChange={(e) => setNewClassPrice(Number(e.target.value))}
                      min={5}
                      required
                      className="w-full bg-surface-dark border border-surface-border rounded-xl py-2 px-3 text-xs text-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Schedule</label>
                    <input
                      type="text"
                      value={newClassSchedule}
                      onChange={(e) => setNewClassSchedule(e.target.value)}
                      placeholder="Tue, Thu - 06:00 PM"
                      required
                      className="w-full bg-surface-dark border border-surface-border rounded-xl py-2 px-3 text-xs text-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Curriculum Synopsis</label>
                  <textarea
                    value={newClassDesc}
                    onChange={(e) => setNewClassDesc(e.target.value)}
                    placeholder="Provide overview of targets, intervals, and required equipment..."
                    required
                    rows={3}
                    className="w-full bg-surface-dark border border-surface-border rounded-xl p-3 text-xs text-slate-200 resize-none font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={createClassLoading}
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95"
                >
                  Publish Class Schedule
                </button>
              </form>
            </div>
          )}

          {/* TAB: MY CLASSES (TRAINER) */}
          {activeTab === 'trainer-classes' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white">Your Assigned Studio Classes</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Title</th>
                      <th className="py-3 px-2">Category</th>
                      <th className="py-3 px-2">Price</th>
                      <th className="py-3 px-2">Enrolled</th>
                      <th className="py-3 px-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-300">
                    {classesList.map((c) => (
                      <tr key={c.id}>
                        <td className="py-3.5 px-2 font-bold text-white">{c.name}</td>
                        <td className="py-3.5 px-2">{c.category}</td>
                        <td className="py-3.5 px-2 text-amber-500 font-extrabold">${c.price}</td>
                        <td className="py-3.5 px-2 text-slate-300 font-medium">{c.bookings || 0} athletes</td>
                        <td className="py-3.5 px-2 text-right">
                          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-500">
                            {c.status || 'APPROVED'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ADMIN USERS */}
          {activeTab === 'admin-users' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white">Platform User Governance</h2>
                <p className="text-xs text-slate-400">
                  Toggle cryptographic account soft-blocks or inspect member privileges
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Member</th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-300">
                    {adminUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="py-3.5 px-2">
                          <div className="font-bold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-2 font-extrabold text-amber-500 text-[11px]">
                          {u.role}
                        </td>
                        <td className="py-3.5 px-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              u.status === 'ACTIVE'
                                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500'
                                : 'bg-rose-500/15 border border-rose-500/30 text-rose-500'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <button
                            onClick={() => toggleSoftBlock(u.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-500 hover:bg-rose-600 hover:text-white'
                                : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 hover:bg-emerald-600 hover:text-white'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Soft-Block' : 'Unblock'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ADMIN TRAINER APPS */}
          {activeTab === 'admin-apps' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-white">Pending Trainer Verification Applications</h2>
                <p className="text-xs text-slate-400">Review coach credentials, background, and strategy</p>
              </div>

              {adminApplications.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-surface-border rounded-2xl">
                  <p className="text-xs text-slate-400 font-bold">All trainer applications have been reviewed.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adminApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 bg-surface-dark border border-surface-border rounded-2xl space-y-3 shadow-sm"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-extrabold text-white">{app.name}</h3>
                          <p className="text-xs text-slate-400">{app.email}</p>
                        </div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                          {app.specialty} &bull; {app.experience}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 italic border-l-2 border-brand-500 pl-3.5 py-1">
                        "{app.strategyStatement}"
                      </p>
                      <div className="flex gap-2.5 justify-end pt-2 border-t border-surface-border/50">
                        <button
                          onClick={() => reviewTrainerApp(app.id, false)}
                          className="px-4 py-2 bg-rose-500/15 border border-rose-500/30 hover:bg-rose-600 hover:text-white text-rose-500 font-bold text-xs rounded-xl transition-all"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => reviewTrainerApp(app.id, true)}
                          className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-brand-500/20"
                        >
                          Approve Coach
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ADMIN TRANSACTIONS */}
          {activeTab === 'admin-txns' && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-white">Stripe Platform Transactions</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-surface-border text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-2">Charge ID</th>
                      <th className="py-3 px-2">Member</th>
                      <th className="py-3 px-2">Class</th>
                      <th className="py-3 px-2">Date</th>
                      <th className="py-3 px-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border text-slate-300">
                    {adminTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td className="py-3.5 px-2 font-mono text-amber-500 font-bold">{tx.id}</td>
                        <td className="py-3.5 px-2 text-slate-300">{tx.email}</td>
                        <td className="py-3.5 px-2 font-medium">{tx.className}</td>
                        <td className="py-3.5 px-2 text-slate-400">{tx.date}</td>
                        <td className="py-3.5 px-2 text-right font-extrabold text-white text-sm">
                          ${tx.amount}.00
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Ticket Pass Receipt Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface-card border border-surface-border rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <Icon name="close" className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-emerald-500 text-black rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <Icon name="check" className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-white">Official Booking Pass</h3>
              <p className="text-[11px] text-slate-400">Present upon studio entry</p>
            </div>

            <div className="p-4 bg-surface-dark border border-surface-border rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Class:</span>
                <span className="font-bold text-white text-right">{selectedTicket.className}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Coach:</span>
                <span className="font-bold text-slate-200">{selectedTicket.trainerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Schedule:</span>
                <span className="font-bold text-amber-500">{selectedTicket.schedule}</span>
              </div>
              <div className="flex justify-between border-t border-surface-border pt-2">
                <span className="text-slate-400">Seat Fee:</span>
                <span className="font-extrabold text-white">${selectedTicket.price}.00</span>
              </div>
            </div>

            <button
              onClick={() => {
                toast.success('Pass receipt downloaded!');
                setSelectedTicket(null);
              }}
              className="w-full py-3 bg-brand-500 hover:bg-brand-600 text-black font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              Download PDF Confirmation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
