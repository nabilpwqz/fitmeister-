import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export const Home: React.FC = () => {
  const featuredClasses = [
    {
      id: 'cls-101',
      name: 'High Intensity Power Metcon',
      trainer: 'Marcus Vance',
      category: 'Cardio',
      difficulty: 'Advanced',
      duration: '45 Mins',
      price: 35,
      bookings: 18,
      capacity: 25,
      schedule: 'Mon, Wed, Fri - 07:00 AM',
      img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'cls-102',
      name: 'Vinyasa Core Balance Alignment',
      trainer: 'Sarah Jenkins',
      category: 'Yoga',
      difficulty: 'Intermediate',
      duration: '60 Mins',
      price: 25,
      bookings: 22,
      capacity: 25,
      schedule: 'Tue, Thu - 09:00 AM',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'cls-103',
      name: 'Olympic Heavy Barbell Mastery',
      trainer: 'Marcus Vance',
      category: 'Weights',
      difficulty: 'Elite',
      duration: '90 Mins',
      price: 55,
      bookings: 12,
      capacity: 20,
      schedule: 'Sat - 11:00 AM',
      img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
    },
    {
      id: 'cls-104',
      name: 'Calisthenic Fluid Mechanics',
      trainer: 'David Cho',
      category: 'Gymnastics',
      difficulty: 'Intermediate',
      duration: '50 Mins',
      price: 30,
      bookings: 15,
      capacity: 20,
      schedule: 'Mon, Thu - 04:00 PM',
      img: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=800&auto=format&fit=crop',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-16">
      {/* Hero Section */}
      <section className="bg-surface-card border border-surface-border rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-brand-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-brand-500/15 border border-brand-500/30 text-amber-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Premium Studio & Athletic Training
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Train with Elite Coaches. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-300">
            Reserve Guaranteed Class Spots.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Discover verified athletic classes, secure reserved studio spots with strict capacity limits, and elevate your fitness journey through expert-led training and supportive community forums.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/classes"
            className="w-full sm:w-auto px-8 py-3.5 bg-brand-500 hover:bg-brand-600 text-black font-extrabold rounded-xl transition-all text-xs shadow-lg shadow-brand-500/20 active:scale-95"
          >
            Explore Active Classes
          </Link>
          <Link
            to="/forum"
            className="w-full sm:w-auto px-8 py-3.5 bg-surface-dark hover:bg-surface-border border border-surface-border hover:border-brand-500 text-slate-200 hover:text-brand-500 font-bold rounded-xl transition-all text-xs active:scale-95 shadow-sm"
          >
            Community Discussions
          </Link>
        </div>
      </section>

      {/* Featured Classes */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
          <div>
            <p className="text-xs text-brand-500 tracking-wider uppercase font-bold">
              Featured Sessions
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              Upcoming Studio Classes
            </h2>
          </div>
          <Link
            to="/classes"
            className="text-xs text-brand-500 font-bold hover:underline flex items-center gap-1 group"
          >
            View all classes <Icon name="arrow-right" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredClasses.map((item) => (
            <div
              key={item.id}
              className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-brand-500/40 transition-all duration-300 shadow-md group hover:-translate-y-1"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-sm text-[10px] font-extrabold text-brand-500 border border-brand-500/30">
                  {item.category}
                </span>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-black/70 text-[9px] font-bold text-slate-300">
                  {item.difficulty}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-slate-400">Coach: {item.trainer}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 font-medium">
                    <Icon name="clock" className="w-3 h-3 text-brand-500" />
                    {item.duration} &bull; {item.schedule}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-surface-border">
                  <span className="text-slate-400 font-medium">
                    {item.bookings}/{item.capacity} spots filled
                  </span>
                  <span className="text-brand-500 font-extrabold text-sm">${item.price}</span>
                </div>
                <Link
                  to={`/classes/${item.id}`}
                  className="w-full py-2.5 bg-brand-500 hover:bg-brand-600 text-black text-xs font-extrabold rounded-xl text-center transition-all shadow-md shadow-brand-500/20 active:scale-95"
                >
                  Reserve Spot
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Platform Value Pillars */}
      <section className="bg-surface-card border border-surface-border rounded-2xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center shadow-lg">
        <div className="p-3 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-500 tracking-tight">100%</div>
          <div className="text-xs font-bold text-white">Guaranteed Spots</div>
          <div className="text-[11px] text-slate-400">
            Strict capacity limits prevent overcrowded studios
          </div>
        </div>
        <div className="p-3 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-500 tracking-tight">Top-Tier</div>
          <div className="text-xs font-bold text-white">Certified Coaches</div>
          <div className="text-[11px] text-slate-400">
            Federation-verified trainers across all disciplines
          </div>
        </div>
        <div className="p-3 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-500 tracking-tight">Flexible</div>
          <div className="text-xs font-bold text-white">12h Free Cancel</div>
          <div className="text-[11px] text-slate-400">
            Full refund or credit for early schedule adjustments
          </div>
        </div>
        <div className="p-3 space-y-1">
          <div className="text-2xl sm:text-3xl font-extrabold text-brand-500 tracking-tight">Active</div>
          <div className="text-xs font-bold text-white">Athlete Forum</div>
          <div className="text-[11px] text-slate-400">
            Direct coaching feedback and technique discussions
          </div>
        </div>
      </section>

      {/* Customer Value Experience Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-3 shadow-md hover:border-brand-500/30 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
            <Icon name="shield" className="w-5 h-5 text-brand-500" />
          </div>
          <h3 className="text-base font-bold text-white">
            Zero-Overbooking Guarantee
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Never show up to an overcrowded studio. FitMeister enforces strict capacity limits for every session, guaranteeing that every enrolled member has dedicated equipment, ample workout space, and direct instructor coaching.
          </p>
        </div>

        <div className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-3 shadow-md hover:border-brand-500/30 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
            <Icon name="users" className="w-5 h-5 text-brand-500" />
          </div>
          <h3 className="text-base font-bold text-white">
            Structured Athletic Progression
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            From high-intensity metabolic conditioning and Olympic weightlifting to restorative vinyasa yoga, our sessions are structured into progressive curriculums designed to elevate your endurance, power, and physical resilience.
          </p>
        </div>
      </section>

      {/* Trainer Recruitment Call to Action */}
      <section className="bg-surface-card border border-surface-border rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-block px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-extrabold tracking-wider uppercase border border-amber-500/30">
            Instructor Community
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Are you a certified fitness professional?
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl font-medium leading-relaxed">
            Apply to coach on FitMeister. Publish your custom curriculums, organize private attendee rosters, and receive platform verified payouts.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-slate-950 font-extrabold rounded-xl text-xs transition-all shadow-md shadow-brand-500/25 whitespace-nowrap active:scale-95"
        >
          Apply as Trainer
        </Link>
      </section>
    </div>
  );
};

export default Home;
