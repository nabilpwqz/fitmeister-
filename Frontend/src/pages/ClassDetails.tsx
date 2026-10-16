import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Icon } from '../ui/Icon';

const FALLBACK_CLASSES_MAP: Record<string, any> = {
  'cls-101': {
    id: 'cls-101',
    name: 'High Intensity Power Metcon',
    trainer: 'Marcus Vance',
    category: 'Cardio',
    difficulty: 'Advanced',
    duration: '45 Mins',
    price: 35,
    bookings: 142,
    schedule: 'Mon, Wed, Fri - 07:00 AM',
    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    desc: 'Push your heart health through rigorous state intervals engineered to spark long lasting physical adaptations and structural core resilience. Features metabolic intervals, kettlebell complexes, and aerobic threshold training.',
  },
  'cls-102': {
    id: 'cls-102',
    name: 'Vinyasa Core Balance Alignment',
    trainer: 'Sarah Jenkins',
    category: 'Yoga',
    difficulty: 'Intermediate',
    duration: '60 Mins',
    price: 25,
    bookings: 198,
    schedule: 'Tue, Thu - 09:00 AM',
    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    desc: 'A precision micro-toning system based on historic flow breathing techniques designed to foster mental alignment and stability metrics. Great for joint mobility and active recovery.',
  },
  'cls-103': {
    id: 'cls-103',
    name: 'Olympic Heavy Barbell Mastery',
    trainer: 'Marcus Vance',
    category: 'Weights',
    difficulty: 'Elite',
    duration: '90 Mins',
    price: 55,
    bookings: 210,
    schedule: 'Sat - 11:00 AM',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    desc: 'Master the snatch, clean, and jerk cycles with optimal kinetics feedback from professional federation instructors. Full platform access with video bar-path analysis.',
  },
  'cls-104': {
    id: 'cls-104',
    name: 'Calisthenic Fluid Mechanics',
    trainer: 'David Cho',
    category: 'Gymnastics',
    difficulty: 'Intermediate',
    duration: '50 Mins',
    price: 30,
    bookings: 76,
    schedule: 'Mon, Thu - 04:00 PM',
    img: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
    desc: 'Advanced bodyweight control mechanisms built to map strong mind-to-muscle connections without secondary standard weights. Master levers, handstands, and muscle-ups safely.',
  },
};

export const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [classData, setClassData] = useState<any>(() => (id ? FALLBACK_CLASSES_MAP[id] || null : null));
  const [loading, setLoading] = useState<boolean>(!classData);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [savedFavorite, setSavedFavorite] = useState<boolean>(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/classes/${id}`);
        if (res.data?.success && res.data.data) {
          setClassData(res.data.data);
        }
      } catch (err) {
        console.warn('API /classes/:id fallback used:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      toast.info('Please sign in to book your session reservation.');
      navigate('/login');
      return;
    }

    if (user.status === 'BLOCKED' || user.status === 'SUSPENDED') {
      toast.error('Your account is currently restricted. Contact support.');
      return;
    }

    setBookingLoading(true);

    try {
      const res = await api.post('/bookings', { classId: id });
      if (res.data?.success) {
        setIsBooked(true);
        toast.success(`Reserved! You are enrolled in ${classData.name}.`);
      }
    } catch (err: any) {
      const errMsg = err.response?.data?.error?.message;
      if (errMsg && errMsg.includes('already booked')) {
        setIsBooked(true);
        toast.info('You have already reserved this session.');
      } else if (errMsg) {
        toast.error(errMsg);
      } else {
        toast.error('Failed to complete session reservation. Please try again.');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Session link copied to clipboard!');
    }
  };

  const toggleFavorite = () => {
    setSavedFavorite(!savedFavorite);
    toast.info(!savedFavorite ? 'Added to your favorites!' : 'Removed from favorites.');
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading session specs...</span>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Class Not Found</h2>
        <p className="text-xs text-slate-400">The requested session ID is not active or has expired.</p>
        <Link to="/classes" className="inline-block px-5 py-2.5 bg-brand-500 text-black font-extrabold rounded-xl text-xs">
          Return to All Classes
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Navigation breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/classes"
          className="text-xs text-slate-400 hover:text-brand-500 font-bold flex items-center gap-1.5 transition-colors"
        >
          <Icon name="arrow-left" className="w-3.5 h-3.5" /> Back to All Classes
        </Link>
        <button
          onClick={handleShare}
          className="text-xs text-slate-400 hover:text-amber-500 flex items-center gap-1 font-semibold transition-colors"
          title="Share class"
        >
          <Icon name="card" className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      {/* Main Detail Card */}
      <div className="bg-surface-card border border-surface-border rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-64 sm:h-96 overflow-hidden relative">
          <img src={classData.img} alt={classData.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1015] via-[#0c1015]/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-black bg-brand-500 rounded-lg shadow-sm">
                {classData.category}
              </span>
              <span className="px-3 py-1 text-[10px] font-bold text-slate-200 bg-black/60 rounded-lg backdrop-blur-sm">
                Difficulty: {classData.difficulty}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {classData.name}
            </h1>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Fast Spec Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-surface-dark border border-surface-border rounded-2xl text-center shadow-inner">
            <div className="p-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Instructor
              </span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 block">{classData.trainer}</span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Schedule
              </span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 block">{classData.schedule}</span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Session Length
              </span>
              <span className="text-xs font-bold text-slate-200 mt-0.5 block">{classData.duration}</span>
            </div>
            <div className="p-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Price Per Seat
              </span>
              <span className="text-base font-extrabold text-brand-500 mt-0.5 block">
                ${classData.price}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Curriculum Overview & Training Plan
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              {classData.desc || 'Comprehensive athletic training with structured coaching feedback, heart-rate pacing, and progressive overload tracking.'}
            </p>
          </div>

          {/* Booking Confirmation / Status banner */}
          {isBooked ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-black flex items-center justify-center flex-shrink-0">
                  <Icon name="check" className="w-5 h-5 font-bold" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 light:text-emerald-800">
                    Seat Confirmed for {user?.name || 'You'}!
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Schedule added to your personal Member Workspace roster.
                  </p>
                </div>
              </div>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl whitespace-nowrap shadow-md transition-all active:scale-95"
              >
                Go to Dashboard
              </Link>
            </div>
          ) : (
            <div className="pt-4 border-t border-surface-border flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="flex-1 py-3.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl text-center transition-all shadow-lg shadow-brand-500/20 active:scale-95"
              >
                {bookingLoading ? 'Reserving Seat...' : `Book Session ($${classData.price})`}
              </button>
              <button
                onClick={toggleFavorite}
                className={`px-6 py-3.5 border rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-1.5 ${
                  savedFavorite
                    ? 'bg-amber-500/15 border-amber-500 text-amber-500'
                    : 'bg-surface-dark border-surface-border text-slate-300 hover:border-brand-500 hover:text-brand-500'
                }`}
              >
                <Icon name="star" className="w-4 h-4" />
                {savedFavorite ? 'Favorited' : 'Save to Favorites'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
