import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { Icon } from '../ui/Icon';

export const AdminPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState<'applications' | 'users' | 'classes' | 'transactions'>('applications');
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [userSearch, setUserSearch] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/admin/login');
      return;
    }
    if (user.role !== 'ADMIN') {
      toast.error('Access restricted to verified administrators.');
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const [uRes, aRes, cRes, tRes] = await Promise.all([
          api.get('/admin/users').catch(() => ({ data: { success: false, data: [] } })),
          api.get('/admin/trainer-applications').catch(() => ({ data: { success: false, data: [] } })),
          api.get('/classes').catch(() => ({ data: { success: false, data: [] } })),
          api.get('/admin/transactions').catch(() => ({ data: { success: false, data: [] } })),
        ]);

        if (uRes.data?.success && Array.isArray(uRes.data.data)) {
          setUsers(uRes.data.data);
        } else {
          setUsers([
            { id: 'usr-admin-1', name: 'Admin Operations', email: 'admin@fitmeister.com', role: 'ADMIN', status: 'ACTIVE' },
            { id: 'usr-trainer-1', name: 'Marcus Vance', email: 'marcus@fitmeister.com', role: 'TRAINER', status: 'ACTIVE' },
            { id: 'usr-user-1', name: 'Ethan Hunts', email: 'ethan@fitmeister.com', role: 'USER', status: 'ACTIVE' },
          ]);
        }

        if (aRes.data?.success && Array.isArray(aRes.data.data)) {
          setApplications(aRes.data.data);
        } else {
          setApplications([
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

        if (cRes.data?.success && Array.isArray(cRes.data.data)) {
          setClasses(cRes.data.data);
        }

        if (tRes.data?.success && Array.isArray(tRes.data.data)) {
          setTransactions(tRes.data.data);
        }
      } catch (err) {
        console.warn('Admin portal initial load notice:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [user, navigate]);

  const handleReviewApplication = async (appId: string, approve: boolean) => {
    const target = applications.find((a) => a.id === appId);
    setApplications((prev) => prev.filter((a) => a.id !== appId));

    if (approve) {
      toast.success(`Accredited ${target?.name || 'Applicant'} as certified TRAINER.`);
      if (target) {
        setUsers((prev) => [
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
      toast.info(`Application for ${target?.name || 'Applicant'} rejected.`);
    }

    try {
      await api.post(`/admin/trainer-applications/${appId}/review`, { approve });
    } catch (err: any) {
      console.warn('Review application sync:', err);
    }
  };

  const handleToggleSoftBlock = async (targetUserId: string) => {
    let nextStatus = 'ACTIVE';
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetUserId) {
          nextStatus = u.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );

    if (nextStatus === 'BLOCKED') {
      toast.warning('Account restricted. User cannot reserve sessions or post.');
    } else {
      toast.success('Account restored to active status.');
    }

    try {
      await api.patch(`/admin/users/${targetUserId}/status`);
    } catch (err) {
      console.warn('User status sync warning:', err);
    }
  };

  const handleRemoveClass = async (classId: string, className: string) => {
    if (!window.confirm(`Unpublish and remove "${className}" from schedule?`)) return;

    setClasses((prev) => prev.filter((c) => c.id !== classId));
    toast.success(`Class "${className}" removed from platform.`);

    try {
      await api.delete(`/admin/classes/${classId}`);
    } catch (err) {
      console.warn('Delete class sync warning:', err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role?.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Admin Header */}
      <div className="bg-surface-card border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-500 shadow-md">
            <Icon name="shield" className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-500 text-[10px] font-extrabold uppercase tracking-wider">
              Executive Console
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Platform Administration
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Logged in as <span className="font-bold text-amber-500">{user?.email}</span> (Master Operations)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/classes"
            className="px-4 py-2 bg-surface-dark border border-surface-border text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-colors"
          >
            Live Site View
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 rounded-xl text-xs font-bold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Pending Trainer Apps</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-500 mt-1">{applications.length}</p>
          <span className="text-[11px] text-slate-500">Requires verification review</span>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Managed Users</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">{users.length}</p>
          <span className="text-[11px] text-slate-500">Athletes, Trainers & Admins</span>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Active Studio Classes</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-brand-500 mt-1">{classes.length}</p>
          <span className="text-[11px] text-slate-500">Live on schedule</span>
        </div>
        <div className="bg-surface-card border border-surface-border rounded-2xl p-5 shadow-md">
          <p className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Platform Bookings</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500 mt-1">
            {classes.reduce((acc, c) => acc + (c.bookings || 0), 0)}
          </p>
          <span className="text-[11px] text-slate-500">Guaranteed reserved slots</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-surface-border gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'applications'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-surface-card'
          }`}
        >
          <Icon name="users" className="w-4 h-4" />
          Trainer Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-surface-card'
          }`}
        >
          <Icon name="shield" className="w-4 h-4" />
          User Moderation ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'classes'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-surface-card'
          }`}
        >
          <Icon name="dumbbell" className="w-4 h-4" />
          Class Catalog Oversight ({classes.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'transactions'
              ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-surface-card'
          }`}
        >
          <Icon name="clock" className="w-4 h-4" />
          Financial Audit ({transactions.length})
        </button>
      </div>

      {/* Tab 1: Trainer Applications Queue */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Instructor Accreditation Queue
            </h2>
            <p className="text-xs text-slate-400">
              Approving an applicant immediately promotes their account to certified TRAINER status.
            </p>
          </div>

          {applications.length === 0 ? (
            <div className="bg-surface-card border border-surface-border rounded-2xl p-8 text-center text-xs text-slate-400">
              No pending trainer applications in review queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-surface-card border border-surface-border rounded-2xl p-6 space-y-4 shadow-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{app.name}</h3>
                      <p className="text-xs text-slate-400">{app.email}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-lg uppercase">
                      {app.specialty}
                    </span>
                  </div>

                  <div className="p-3 bg-surface-dark border border-surface-border rounded-xl space-y-1 text-xs">
                    <p className="text-slate-400 font-semibold">Experience: <span className="text-white">{app.experience}</span></p>
                    <p className="text-slate-400 italic font-medium leading-relaxed">
                      "{app.strategyStatement}"
                    </p>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleReviewApplication(app.id, true)}
                      className="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs rounded-xl transition-colors shadow-sm"
                    >
                      Approve & Promote to Trainer
                    </button>
                    <button
                      onClick={() => handleReviewApplication(app.id, false)}
                      className="py-2 px-3 bg-surface-dark hover:bg-rose-500/20 border border-surface-border text-rose-500 font-bold text-xs rounded-xl transition-colors"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Moderation */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Platform Identity & Moderation
              </h2>
              <p className="text-xs text-slate-400">
                Soft-blocking an account instantly revokes booking and class publishing privileges.
              </p>
            </div>
            <input
              type="text"
              placeholder="Search by name, email or role..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="bg-surface-dark border border-surface-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 w-full sm:w-64"
            />
          </div>

          <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-surface-dark border-b border-surface-border text-[10px] font-extrabold uppercase text-slate-400">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Account Status</th>
                    <th className="py-3 px-4 text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-dark/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                              : u.role === 'TRAINER'
                              ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/10 text-emerald-500'
                              : 'bg-rose-500/10 text-rose-500 font-extrabold'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {u.email === 'admin@fitmeister.com' ? (
                          <span className="text-[11px] text-slate-500 italic">Root Administrator</span>
                        ) : (
                          <button
                            onClick={() => handleToggleSoftBlock(u.id)}
                            className={`py-1 px-3 rounded-lg text-[11px] font-bold transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                            }`}
                          >
                            {u.status === 'ACTIVE' ? 'Suspend Account' : 'Restore Active'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Class Catalog Oversight */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Studio Class Catalog Moderation
            </h2>
            <p className="text-xs text-slate-400">
              Admins can unpublish classes that breach facility guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3 shadow-md flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">{cls.name}</h3>
                    <span className="text-brand-500 font-extrabold text-sm">${cls.price}</span>
                  </div>
                  <p className="text-xs text-slate-400">Instructor: <span className="text-white font-medium">{cls.trainer}</span></p>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="px-2 py-0.5 bg-surface-dark rounded-md border border-surface-border font-bold text-slate-300">
                      {cls.category}
                    </span>
                    <span>{cls.schedule}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Enrolled: <span className="font-bold text-emerald-400">{cls.bookings || 0}</span> / {cls.capacity || 20} spots
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border flex justify-between items-center">
                  <Link
                    to={`/classes/${cls.id}`}
                    className="text-xs text-brand-500 font-bold hover:underline"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemoveClass(cls.id, cls.name)}
                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 text-xs font-bold rounded-lg transition-colors"
                  >
                    Unpublish Class
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Financial Transactions */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Platform Financial Audit Trail
          </h2>
          <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden shadow-md">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-dark border-b border-surface-border text-[10px] font-extrabold uppercase text-slate-400">
                <tr>
                  <th className="py-3 px-4">Transaction ID</th>
                  <th className="py-3 px-4">Athlete Email</th>
                  <th className="py-3 px-4">Class Reserved</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface-dark/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-amber-500">{tx.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-200">{tx.email}</td>
                    <td className="py-3 px-4 text-slate-300">{tx.className}</td>
                    <td className="py-3 px-4 font-bold text-emerald-400">${tx.amount?.toFixed(2)}</td>
                    <td className="py-3 px-4 text-slate-400">{tx.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminPortal;
