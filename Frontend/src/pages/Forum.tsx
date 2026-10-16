import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { Icon } from '../ui/Icon';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  summary: string;
  likes: number;
  comments: any[];
  coverImageUrl: string;
  category?: string;
  createdAt?: string;
}

const FALLBACK_POSTS: ForumPost[] = [
  {
    id: 'pst-101',
    title: 'Optimizing Hypertrophy: The Science of Mechanical Tension',
    author: 'Marcus Vance',
    authorRole: 'TRAINER',
    category: 'Hypertrophy',
    summary: 'Diving deep into progressive overload data parameters behind structural mechanical tension and muscle synthesis.',
    likes: 142,
    comments: [
      { id: 'com-1', author: 'Alex Rivera', text: 'Exceptional framework analysis! Applied it to my clients this morning.' }
    ],
    coverImageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-06-25',
  },
  {
    id: 'pst-102',
    title: 'Strategic Periodization Models for Competitive Multi-Sport Athletes',
    author: 'Admin Operations',
    authorRole: 'ADMIN',
    category: 'Periodization',
    summary: 'An operations layout outlining optimal microcycle tracking, central nervous fatigue, and physical supercompensation.',
    likes: 98,
    comments: [],
    coverImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-06-26',
  },
  {
    id: 'pst-103',
    title: 'Post-Workout Glycogen Replenishment & Muscle Protein Synthesis',
    author: 'Sarah Jenkins',
    authorRole: 'TRAINER',
    category: 'Nutrition',
    summary: 'Nutritional strategies optimizing the 4-hour anabolic window with leucine thresholds and electrolyte balance.',
    likes: 74,
    comments: [],
    coverImageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
    createdAt: '2026-06-28',
  },
];

export const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(FALLBACK_POSTS);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const toast = useToast();

  const categories = ['All', 'Hypertrophy', 'Periodization', 'Nutrition'];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          setPosts(res.data.data);
        }
      } catch (err) {
        console.warn('API /posts fallback applied:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.summary.toLowerCase().includes(search.toLowerCase()) ||
        p.author.toLowerCase().includes(search.toLowerCase());
      const matchesCat = filterCategory === 'All' || p.category === filterCategory;
      return matchesSearch && matchesCat;
    });
  }, [posts, search, filterCategory]);

  const handleEndorse = (e: React.MouseEvent, postId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
    toast.success('Endorsed discussion!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-widest bg-brand-500/15 text-amber-500 border border-brand-500/30">
            Community Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Athletic Bulletins & Research Discussions
          </h1>
          <p className="text-xs text-slate-400">
            Peer-reviewed training protocols, exercise physiology breakdowns, and platform community bulletins.
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                filterCategory === cat
                  ? 'bg-brand-500 text-black shadow-brand-500/20'
                  : 'bg-surface-card hover:bg-surface-cardHover text-slate-300 border border-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon name="search" className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search discussions..."
            className="w-full bg-surface-card border border-surface-border rounded-xl py-2 pl-9 pr-3 text-xs font-medium text-slate-200 focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
          <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading discussions...</span>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-surface-border rounded-3xl space-y-2 bg-surface-card/40">
          <p className="text-sm font-bold text-slate-200">No discussions match your filter</p>
          <button
            onClick={() => {
              setSearch('');
              setFilterCategory('All');
            }}
            className="px-4 py-2 bg-brand-500 text-black text-xs font-extrabold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden flex flex-col justify-between hover:border-brand-500/40 transition-all duration-300 shadow-md group hover:-translate-y-1"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={post.coverImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-brand-500/30 text-[10px] font-extrabold tracking-wider text-brand-500 px-2.5 py-1 rounded-lg">
                  {post.authorRole}
                </span>
                {post.category && (
                  <span className="absolute top-3 right-3 bg-black/70 text-slate-200 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {post.category}
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
                    <span className="flex items-center gap-1 font-bold text-slate-200">
                      <Icon name="user" className="w-3.5 h-3.5 text-brand-500" />
                      {post.author}
                    </span>
                    <span>&bull;</span>
                    <span>{post.comments?.length || 0} observations</span>
                  </div>
                  <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-amber-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {post.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-surface-border">
                  <button
                    onClick={(e) => handleEndorse(e, post.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-amber-500 transition-colors p-1 rounded-lg"
                    title="Endorse this bulletin"
                  >
                    <Icon name="star" className="w-4 h-4 text-brand-500" />
                    <span>{post.likes} endorsements</span>
                  </button>

                  <Link
                    to={`/forum/${post.id}`}
                    className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-black text-xs font-extrabold rounded-xl transition-all shadow-md shadow-brand-500/15 active:scale-95"
                  >
                    Read Discussion
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
