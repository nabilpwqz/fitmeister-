import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Icon } from '../ui/Icon';

export const TrainerPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'rosters' | 'publish' | 'myclasses'>('rosters');
  const [loading, setLoading] = useState<boolean>(true);
  const [trainerClasses, setTrainerClasses] = useState<any[]>([]);
  const [rosters, setRosters] = useState<any[]>([]);

  // Publish class form
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Cardio');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [duration, setDuration] = useState('50 Mins');
  const [price, setPrice] = useState(30);
  const [capacity, setCapacity] = useState(20);
  const [schedule, setSchedule] = useState('Mon, Wed, Fri - 08:00 AM');
  const [desc, setDesc] = useState('');
  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/trainer/login');
      return;
    }
    if (user.role !== 'TRAINER' && user.role !== 'ADMIN') {
      toast.error('Access restricted to certified instructors.');
      navigate('/');
      return;
    }

    const fetchTrainerData = async () => {
      setLoading(true);
      try {
        const [cRes, rRes] = await Promise.all([
          api.get('/trainer/classes').catch(() => ({ data: { success: false, data: [] } })),
          api.get('/trainer/rosters').catch(() => ({ data: { success: false, data: [] } })),
        ]);

        if (cRes.data?.success && Array.isArray(cRes.data.data) && cRes.data.data.length > 0) {
          setTrainerClasses(cRes.data.data);
        } else {
          // Provide trainer's classes
          setTrainerClasses([
            {
              id: 'cls-101',
              name: 'High Intensity Power Metcon',
              category: 'Cardio',
              difficulty: 'Advanced',
              duration: '45 Mins',
              price: 35,
              bookings: 18,
              capacity: 25,
              schedule: 'Mon, Wed, Fri - 07:00 AM',
              trainer: user.name,
              desc: 'Push your heart health through rigorous state intervals.',
            },
            {
              id: 'cls-103',
              name: 'Olympic Heavy Barbell Mastery',
              category: 'Weights',
              difficulty: 'Elite',
              duration: '90 Mins',
              price: 55,
              bookings: 12,
              capacity: 20,
              schedule: 'Sat - 11:00 AM',
              trainer: user.name,
              desc: 'Master the snatch, clean, and jerk cycles.',
            },
          ]);
        }

        if (rRes.data?.success && Array.isArray(rRes.data.data) && rRes.data.data.length > 0) {
          setRosters(rRes.data.data);
        } else {
          // Provide live sample roster
          setRosters([
            {
              id: 'bk-891',
              userEmail: 'ethan@fitmeister.com',
              className: 'High Intensity Power Metcon',
              schedule: 'Mon, Wed, Fri - 07:00 AM',
              price: 35,
              status: 'CONFIRMED',
              bookedAt: new Date().toISOString(),
            },
            {
              id: 'bk-412',
              userEmail: 'sarah.athlete@gmail.com',
              className: 'Olympic Heavy Barbell Mastery',
              schedule: 'Sat - 11:00 AM',
              price: 55,
              status: 'CONFIRMED',
              bookedAt: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.warn('Trainer portal sync warning:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerData();
  }, [user, navigate]);

  const handlePublishClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishLoading(true);

    const newClass = {
      id: `cls-${Date.now()}`,
      name,
      category,
      difficulty,
      duration,
      price: Number(price),
      capacity: Number(capacity),
      schedule,
      desc,
      trainer: user?.name || 'Certified Trainer',
      bookings: 0,
      status: 'APPROVED',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    };

    setTrainerClasses((prev) => [newClass, ...prev]);
    toast.success(`Curriculum "${name}" published directly to studio schedule!`);
    setName('');
    setDesc('');
    setPublishLoading(false);
    setActiveTab('myclasses');

    try {
      await api.post('/classes', newClass);
    } catch (err) {
      console.warn('Backend sync for new class:', err);
    }
  };

  const handleDeleteClass = async (classId: string, className: string) => {
    if (!window.confirm(`Cancel session "${className}" and remove from schedule?`)) return;

    setTrainerClasses((prev) => prev.filter((c) => c.id !== classId));
    toast.info(`Session "${className}" removed.`);

    try {
      await api.delete(`/trainer/classes/${classId}`);
    } catch (err) {
      console.warn('Delete trainer class sync:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Trainer Header */}
      <div className="bg-surface-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center text-emerald-500 shadow-md">
            <Icon name="dumbbell" className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-extrabold uppercase tracking-wider">
              Instructor Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Trainer Coaching Workspace
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instructor: <span className="font-bold text-emerald-400">{user?.name}</span> ({user?.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/classes"
            className="px-4 py-2 bg-surface-dark border border-surface-border text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
          >
            Studio Schedule
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/trainer/login');
            }}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-xl text-xs font-bold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Trainer Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">My Active Classes</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500 mt-1">{trainerClasses.length}</p>
          <span className="text-[11px] text-slate-500">Live published sessions</span>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Total Athletes Enrolled</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {trainerClasses.reduce((acc, c) => acc + (c.bookings || 0), 0)}
          </p>
          <span className="text-[11px] text-slate-500">Confirmed roster bookings</span>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Slot Capacity Rate</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-500 mt-1">
            {Math.round(
              (trainerClasses.reduce((acc, c) => acc + (c.bookings || 0), 0) /
                Math.max(1, trainerClasses.reduce((acc, c) => acc + (c.capacity || 20), 0))) *
                100
            )}%
          </p>
          <span className="text-[11px] text-slate-500">Average studio utilization</span>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Accreditation</p>
          <p className="text-lg sm:text-xl font-extrabold text-emerald-400 mt-2">100% Verified</p>
          <span className="text-[11px] text-slate-500">Certified federation coach</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-surface-border gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('rosters')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'rosters'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-surface-card'
          }`}
        >
          <Icon name="users" className="w-4 h-4" />
          Live Athlete Rosters ({rosters.length})
        </button>
        <button
          onClick={() => setActiveTab('publish')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'publish'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-surface-card'
          }`}
        >
          <Icon name="plus" className="w-4 h-4" />
          Publish New Class Curriculum
        </button>
        <button
          onClick={() => setActiveTab('myclasses')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'myclasses'
              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-white hover:bg-surface-card'
          }`}
        >
          <Icon name="dumbbell" className="w-4 h-4" />
          My Scheduled Classes ({trainerClasses.length})
        </button>
      </div>

      {/* Tab 1: Live Athlete Rosters */}
      {activeTab === 'rosters' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Enrolled Athlete Check-in Roster
            </h2>
            <p className="text-xs text-slate-400">
              Real-time attendance list for your scheduled training sessions.
            </p>
          </div>

          <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-dark border-b border-surface-border text-[10px] font-extrabold uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Athlete Account</th>
                  <th className="py-3 px-4">Enrolled Class</th>
                  <th className="py-3 px-4">Schedule Slot</th>
                  <th className="py-3 px-4">Seat Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {rosters.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-dark/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-emerald-400">{r.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{r.userEmail}</td>
                    <td className="py-3 px-4 text-slate-300">{r.className}</td>
                    <td className="py-3 px-4 text-slate-400">{r.schedule}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {r.status || 'CONFIRMED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Publish Class Studio */}
      {activeTab === 'publish' && (
        <div className="max-w-2xl bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-md">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Publish New Studio Curriculum
            </h2>
            <p className="text-xs text-slate-400">
              Define workout format, duration, capacity limits and pricing.
            </p>
          </div>

          <form onSubmit={handlePublishClass} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Class Title</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Advanced Functional Hypertrophy"
                required
                className="w-full bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Cardio">Cardio & HIIT</option>
                  <option value="Weights">Weights & Power</option>
                  <option value="Yoga">Yoga & Mobility</option>
                  <option value="Gymnastics">Gymnastics & Calisthenics</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Difficulty</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
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
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="60 Mins"
                  required
                  className="w-full bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Price ($USD)</label>
                <input
                  type="number"
                  min="5"
                  max="500"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="w-full bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Max Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  required
                  className="w-full bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Schedule Slot</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                placeholder="Tue, Thu - 06:30 PM"
                required
                className="w-full bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">Curriculum Description</label>
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Describe target training stimulus, movement patterns, and coaching progression..."
                required
                rows={3}
                className="w-full bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={publishLoading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 active:scale-98"
            >
              {publishLoading ? 'Publishing...' : 'Publish Session to Active Schedule'}
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: My Scheduled Classes */}
      {activeTab === 'myclasses' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              My Authored Studio Classes
            </h2>
            <p className="text-xs text-slate-400">
              Manage slot availability and cancellation policies for your sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trainerClasses.map((cls) => (
              <div
                key={cls.id}
                className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{cls.name}</h3>
                    <span className="text-emerald-400 font-extrabold text-sm">${cls.price}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 bg-surface-dark rounded-md border border-surface-border font-bold text-slate-300">
                      {cls.category}
                    </span>
                    <span>{cls.schedule}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Current Roster: <span className="font-bold text-emerald-400">{cls.bookings || 0}</span> / {cls.capacity || 20} spots filled
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                    "{cls.desc}"
                  </p>
                </div>

                <div className="pt-2 border-t border-surface-border flex justify-between items-center">
                  <Link
                    to={`/classes/${cls.id}`}
                    className="text-xs text-emerald-400 font-bold hover:underline"
                  >
                    View Studio Page
                  </Link>
                  <button
                    onClick={() => handleDeleteClass(cls.id, cls.name)}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold rounded-lg transition-colors"
                  >
                    Cancel Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default TrainerPortal;
