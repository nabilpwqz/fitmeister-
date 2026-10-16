import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Icon } from '../ui/Icon';

interface ClassItem {
  id: string;
  name: string;
  trainer: string;
  category: string;
  difficulty: string;
  duration: string;
  price: number;
  bookings: number;
  schedule: string;
  img: string;
  desc?: string;
}

const DEFAULT_FALLBACK_CLASSES: ClassItem[] = [
  {
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
    desc: 'Push your heart health through rigorous state intervals engineered to spark long lasting physical adaptations and structural core resilience.',
  },
  {
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
    desc: 'A precision micro-toning system based on historic flow breathing techniques designed to foster mental alignment and stability metrics.',
  },
  {
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
    desc: 'Master the snatch, clean, and jerk cycles with optimal kinetics feedback from professional federation instructors.',
  },
  {
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
    desc: 'Advanced bodyweight control mechanisms built to map strong mind-to-muscle connections without secondary standard weights.',
  },
];

export const Classes: React.FC = () => {
  const [classesList, setClassesList] = useState<ClassItem[]>(DEFAULT_FALLBACK_CLASSES);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('popular');

  const categories = ['All', 'Cardio', 'Yoga', 'Weights', 'Gymnastics'];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setClassesList(res.data.data);
        }
      } catch (err) {
        console.warn('API /classes fallback applied:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const filteredAndSorted = useMemo(() => {
    let result = classesList.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.trainer.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesDifficulty =
        selectedDifficulty === 'All' || item.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
      return matchesSearch && matchesCategory && matchesDifficulty;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.bookings - a.bookings);
    }

    return result;
  }, [classesList, search, selectedCategory, selectedDifficulty, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedDifficulty('All');
    setSortBy('popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/15 text-amber-500 border border-brand-500/30">
            Catalog Explorer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Active Studio Sessions
          </h1>
          <p className="text-xs text-slate-400">
            Filter certified coaching sessions by specialty, intensity tier, or schedule availability.
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-surface-card border border-surface-border px-3.5 py-2 rounded-xl self-start sm:self-auto font-medium">
          Showing <span className="font-bold text-amber-500">{filteredAndSorted.length}</span> of {classesList.length} classes
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                isActive
                  ? 'bg-brand-500 text-black shadow-brand-500/20 scale-102'
                  : 'bg-surface-card hover:bg-surface-cardHover text-slate-300 border border-surface-border hover:border-brand-500/50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 bg-surface-card border border-surface-border rounded-2xl flex flex-col md:flex-row gap-3 items-center shadow-md">
        {/* Search */}
        <div className="relative w-full md:flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by class title, coach name, or focus keyword..."
            className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="w-full sm:w-44 flex-shrink-0">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="All">Level: All Tiers</option>
            <option value="Beginner">Level: Beginner</option>
            <option value="Intermediate">Level: Intermediate</option>
            <option value="Advanced">Level: Advanced</option>
            <option value="Elite">Level: Elite</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="w-full sm:w-44 flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-surface-dark border border-surface-border rounded-xl py-2.5 px-3.5 text-xs font-bold text-slate-300 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="popular">Sort: Most Popular</option>
            <option value="price-low">Sort: Price (Low to High)</option>
            <option value="price-high">Sort: Price (High to Low)</option>
          </select>
        </div>

        {/* Clear Filter Button */}
        {(search || selectedCategory !== 'All' || selectedDifficulty !== 'All' || sortBy !== 'popular') && (
          <button
            onClick={clearFilters}
            className="w-full sm:w-auto px-3.5 py-2.5 text-xs font-bold text-amber-500 hover:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl whitespace-nowrap transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid List (4-column layout) */}
      {loading ? (
        <div className="py-24 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span>Synchronizing active classes...</span>
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-surface-border rounded-3xl space-y-3 bg-surface-card/40">
          <div className="w-12 h-12 rounded-2xl bg-surface-border flex items-center justify-center mx-auto text-slate-400">
            <Icon name="search" className="w-5 h-5" />
          </div>
          <p className="text-sm text-slate-200 font-bold">No matching classes found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see available courses.
          </p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-brand-500 text-black text-xs font-extrabold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredAndSorted.map((item) => (
            <div
              key={item.id}
              className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-brand-500/40 transition-all duration-300 shadow-md group hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
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

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-500 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-slate-400">Coach: {item.trainer}</p>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 pt-1 font-medium">
                    <Icon name="calendar" className="w-3 h-3 text-brand-500" />
                    {item.schedule}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-surface-border">
                  <span className="text-slate-400 font-medium">{item.bookings} enrolled</span>
                  <span className="text-brand-500 font-extrabold text-sm">${item.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to={`/classes/${item.id}`}
                    className="py-2.5 px-3 bg-surface-dark hover:bg-surface-border border border-surface-border hover:border-brand-500 text-slate-200 hover:text-brand-500 text-xs font-bold rounded-xl text-center transition-all shadow-sm"
                  >
                    Details
                  </Link>
                  <Link
                    to={`/classes/${item.id}`}
                    className="py-2.5 px-3 bg-brand-500 hover:bg-brand-600 text-black text-xs font-extrabold rounded-xl text-center transition-all shadow-md shadow-brand-500/20 active:scale-95"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
