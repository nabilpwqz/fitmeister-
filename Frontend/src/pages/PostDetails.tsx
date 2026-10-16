import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Icon } from '../ui/Icon';

const FALLBACK_POSTS_MAP: Record<string, any> = {
  'pst-101': {
    id: 'pst-101',
    title: 'Optimizing Hypertrophy: The Science of Mechanical Tension',
    author: 'Marcus Vance',
    authorRole: 'TRAINER',
    summary: 'Diving deep into progressive overload data parameters behind structural mechanical tension and muscle synthesis.',
    content: `Mechanical tension remains quantified as the ultimate driver of muscle protein synthesis. Subjects analyzed under strict time-under-tension parameters showed double down-stream activation of the mammalian target of rapamycin complex (mTORC1).

Key Protocol Takeaways:
1. Ensure your eccentric tempo is systematically clocked at 3-4 seconds per rep matrix.
2. Maintain load ranges at 70-85% 1RM across multi-joint barbell movements.
3. Track progressive overload systematically week over week rather than chasing momentary metabolic pump.
4. Allow 48-72 hours between identical muscle group stimulation blocks.`,
    likes: 142,
    dislikes: 2,
    comments: [
      { id: 'com-1', author: 'Alex Rivera', text: 'Exceptional framework analysis! Applied it to my clients this morning with immediate improvements in form consistency.' }
    ],
    coverImageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
  },
  'pst-102': {
    id: 'pst-102',
    title: 'Strategic Periodization Models for Competitive Multi-Sport Athletes',
    author: 'Admin Operations',
    authorRole: 'ADMIN',
    summary: 'An operations layout outlining optimal microcycle tracking, central nervous fatigue, and physical supercompensation.',
    content: `Athletic block structure models ensure central nervous pathway recovery protocols do not conflict with intense output. When organizing a macrocycle matrix, always alternate peak velocity intervals with heavy loading blocks to maintain physical readiness metrics without metabolic degradation.

System Recommendations:
- Accumulation Phase: 4 weeks high volume, low-to-moderate velocity.
- Transmutation Phase: 3 weeks specific explosive strength conversion.
- Realization & Taper: 1-2 weeks 40% volume reduction preserving intensity.`,
    likes: 98,
    dislikes: 0,
    comments: [],
    coverImageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
    createdAt: new Date().toISOString(),
  },
};

export const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();

  const [post, setPost] = useState<any>(() => (id ? FALLBACK_POSTS_MAP[id] || null : null));
  const [loading, setLoading] = useState<boolean>(!post);
  const [commentInput, setCommentInput] = useState<string>('');
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);
  const [hasEndorsed, setHasEndorsed] = useState<boolean>(false);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      if (res.data?.success && res.data.data) {
        setPost(res.data.data);
      }
    } catch (err) {
      console.warn('API /posts/:id fallback used:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleEndorse = () => {
    if (!hasEndorsed) {
      setPost((prev: any) => ({ ...prev, likes: prev.likes + 1 }));
      setHasEndorsed(true);
      toast.success('You endorsed this discussion bulletin!');
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Discussion link copied to clipboard!');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please sign in to post observations.');
      return;
    }
    if (!commentInput.trim()) return;

    setSubmittingComment(true);

    const newComment = {
      id: `com-${Date.now()}`,
      author: user.name || user.email.split('@')[0],
      text: commentInput.trim(),
    };

    // Optimistic comment insert
    setPost((prev: any) => ({
      ...prev,
      comments: [...(prev.comments || []), newComment],
    }));
    setCommentInput('');
    toast.success('Observation posted to forum!');

    try {
      await api.post(`/posts/${id}/comments`, { text: newComment.text });
    } catch (err) {
      console.warn('Comment posted locally (offline or preview mode).');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <span>Loading discussion bulletin...</span>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Bulletin Not Found</h2>
        <Link to="/forum" className="px-5 py-2.5 bg-brand-500 text-black font-extrabold text-xs rounded-xl inline-block">
          Return to Community Forum
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12 space-y-6">
      {/* Top action row */}
      <div className="flex items-center justify-between">
        <Link
          to="/forum"
          className="text-xs text-slate-400 hover:text-brand-500 font-bold flex items-center gap-1.5 transition-colors"
        >
          <Icon name="arrow-left" className="w-3.5 h-3.5" /> Back to Bulletins
        </Link>
        <button
          onClick={handleShare}
          className="text-xs text-slate-400 hover:text-amber-500 flex items-center gap-1 font-semibold transition-colors"
          title="Share bulletin"
        >
          <Icon name="card" className="w-3.5 h-3.5" /> Share
        </button>
      </div>

      <div className="bg-surface-card border border-surface-border rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="relative rounded-2xl overflow-hidden border border-surface-border">
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-black/80 backdrop-blur-md border border-brand-500/40 text-[10px] font-extrabold tracking-wider text-brand-500 px-3 py-1 rounded-lg">
              {post.authorRole}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Icon name="user" className="w-3.5 h-3.5 text-brand-500" />
              {post.author}
            </span>
            <span>&bull;</span>
            <span>Community Bulletin</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-white leading-tight">
            {post.title}
          </h1>
        </div>

        <div className="p-4 bg-surface-dark border-l-4 border-brand-500 rounded-r-2xl border-y border-r border-surface-border">
          <p className="text-xs font-semibold text-slate-300 leading-relaxed italic">
            "{post.summary}"
          </p>
        </div>

        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line space-y-4 font-normal">
          {post.content}
        </div>

        {/* Endorsement and Share Row */}
        <div className="flex items-center justify-between pt-4 border-t border-surface-border">
          <button
            onClick={handleEndorse}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95 ${
              hasEndorsed
                ? 'bg-amber-500/20 border border-amber-500 text-amber-500'
                : 'bg-surface-dark hover:bg-surface-border border border-surface-border text-slate-200 hover:text-amber-500'
            }`}
          >
            <Icon name="star" className="w-4 h-4 text-brand-500" />
            <span>{post.likes} Endorsements</span>
          </button>

          <button
            onClick={handleShare}
            className="px-4 py-2 bg-surface-dark hover:bg-surface-border border border-surface-border text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
          >
            Share Article
          </button>
        </div>

        {/* Comments Section */}
        <div className="space-y-5 pt-6 border-t border-surface-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            Observations & Discussions ({post.comments?.length || 0})
          </h3>

          <form onSubmit={handleAddComment} className="space-y-3">
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Contribute your professional observation or feedback..."
              rows={3}
              className="w-full bg-surface-dark border border-surface-border rounded-2xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none font-medium transition-colors"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !commentInput.trim()}
                className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-black font-extrabold text-xs rounded-xl transition-all shadow-md shadow-brand-500/20 active:scale-95"
              >
                {submittingComment ? 'Posting...' : 'Post Observation'}
              </button>
            </div>
          </form>

          <div className="space-y-3 pt-2">
            {!post.comments || post.comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-4 text-center bg-surface-dark/50 rounded-xl border border-surface-border">
                No observations posted yet. Be the first to share your feedback!
              </p>
            ) : (
              post.comments.map((com: any) => (
                <div
                  key={com.id}
                  className="p-4 bg-surface-dark border border-surface-border rounded-2xl space-y-1.5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-amber-500">
                      {com.author}
                    </span>
                    <span className="text-[10px] text-slate-500">Verified Member</span>
                  </div>
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{com.text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
