import { useState, useEffect } from 'react';
import API from '../utils/axios';
import Navbar from '../components/Navbar';

const TABS = ['Overview', 'Users', 'Providers', 'Bookings'];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'Overview') {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } else if (tab === 'Users') {
        const { data } = await API.get('/admin/users');
        setUsers(data);
      } else if (tab === 'Providers') {
        const { data } = await API.get('/admin/providers');
        setProviders(data);
      } else if (tab === 'Bookings') {
        const { data } = await API.get('/bookings/all');
        setBookings(data);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleToggleBlock = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}/block`);
      // Update local state to reflect UI change instantly
      setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !u.isBlocked } : u));
    } catch (error) {
      alert(error.response?.data?.message || 'Action failed');
    }
  };

  const handleDeleteUser = async (userId, name) => {
    if (!window.confirm(`Are you sure you want to completely delete user [${name}]? This action cannot be undone.`)) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
    } catch (error) {
      alert(error.response?.data?.message || 'Delete failed');
    }
  };

  const handleVerifyProvider = async (profileId) => {
    try {
      await API.put(`/admin/providers/${profileId}/verify`);
      setProviders(providers.map(p => p._id === profileId ? { ...p, isVerified: true } : p));
    } catch (error) {
      alert(error.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">Admin Portal</h1>
            <p className="text-slate-400">Platform management and analytics</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto scrollbar-hide border-b border-white/10 mb-8 pb-px">
          <div className="flex gap-8 min-w-max px-2">
            {TABS.map((tab) => (
               <button
                 key={tab}
                 onClick={() => setActiveTab(tab)}
                 className={`pb-4 text-sm font-semibold transition-all duration-200 border-b-2 relative -mb-[2px] ${
                   activeTab === tab
                     ? 'text-brand-400 border-brand-400'
                     : 'text-slate-400 border-transparent hover:text-slate-200'
                 }`}
               >
                 {tab}
               </button>
            ))}
          </div>
        </div>

        {/* Loading State Overlay conceptually mapped to content area */}
        {loading ? (
           <div className="flex items-center justify-center h-64 text-slate-400">Loading data...</div>
        ) : (
           <div className="space-y-6">
             
             {/* OVERVIEW TAB */}
             {activeTab === 'Overview' && stats && (
               <>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                     <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Customers</p>
                     <p className="text-4xl font-black text-white">{stats.totalUsers}</p>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                     <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Providers</p>
                     <p className="text-4xl font-black text-brand-400">{stats.totalProviders}</p>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                     <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Bookings</p>
                     <p className="text-4xl font-black text-purple-400">{stats.totalBookings}</p>
                   </div>
                   <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                     <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Total Revenue</p>
                     <p className="text-4xl font-black text-emerald-400">₹{stats.totalRevenue}</p>
                   </div>
                 </div>
                 
                 <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
                   <h3 className="text-lg font-bold text-white mb-4">Bookings by Status</h3>
                   <div className="flex flex-wrap gap-4">
                     {stats.bookingsByStatus.map(b => (
                        <div key={b._id} className="px-4 py-2 bg-black/30 border border-white/5 rounded-xl flex items-center gap-3">
                           <span className="text-slate-300 font-medium capitalize">{b._id.replace('_', ' ')}</span>
                           <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white">{b.count}</span>
                        </div>
                     ))}
                     {stats.bookingsByStatus.length === 0 && <span className="text-slate-500 text-sm">No bookings found</span>}
                   </div>
                 </div>
               </>
             )}

             {/* USERS TAB */}
             {activeTab === 'Users' && (
               <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-white/5 text-slate-400">
                       <tr>
                         <th className="px-6 py-4 font-semibold">Name</th>
                         <th className="px-6 py-4 font-semibold">Email</th>
                         <th className="px-6 py-4 font-semibold">Role</th>
                         <th className="px-6 py-4 font-semibold">Status</th>
                         <th className="px-6 py-4 font-semibold text-right">Actions</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5 text-slate-300">
                       {users.map(user => (
                         <tr key={user._id} className="hover:bg-white/[0.02]">
                           <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                           <td className="px-6 py-4">{user.email}</td>
                           <td className="px-6 py-4 capitalize border border-transparent">
                             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-amber-500/10 text-amber-400' : user.role === 'provider' ? 'bg-brand-500/10 text-brand-400' : 'bg-slate-500/10 text-slate-400'}`}>
                               {user.role}
                             </span>
                           </td>
                           <td className="px-6 py-4">
                             {user.isBlocked ? (
                               <span className="text-red-400 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400"></div>Blocked</span>
                             ) : (
                               <span className="text-emerald-400 flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400"></div>Active</span>
                             )}
                           </td>
                           <td className="px-6 py-4 text-right space-x-3">
                             <button onClick={() => handleToggleBlock(user._id)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                               {user.isBlocked ? 'Unblock' : 'Block'}
                             </button>
                             <button onClick={() => handleDeleteUser(user._id, user.name)} className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors">
                               Delete
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}

             {/* PROVIDERS TAB */}
             {activeTab === 'Providers' && (
               <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-white/5 text-slate-400">
                       <tr>
                         <th className="px-6 py-4 font-semibold">Name</th>
                         <th className="px-6 py-4 font-semibold">Rating</th>
                         <th className="px-6 py-4 font-semibold">Earnings</th>
                         <th className="px-6 py-4 font-semibold">Verification</th>
                         <th className="px-6 py-4 font-semibold text-right">Action</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5 text-slate-300">
                       {providers.map(provider => (
                         <tr key={provider._id} className="hover:bg-white/[0.02]">
                           <td className="px-6 py-4 font-medium text-white">{provider.user?.name || 'Unknown'}</td>
                           <td className="px-6 py-4 font-medium text-amber-400">★ {provider.rating} <span className="text-slate-500">({provider.numReviews})</span></td>
                           <td className="px-6 py-4 font-medium text-emerald-400">₹{provider.totalEarnings}</td>
                           <td className="px-6 py-4">
                             {provider.isVerified ? (
                               <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400">
                                 <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                                 Verified
                               </span>
                             ) : (
                               <span className="text-slate-500 text-xs font-semibold">Unverified</span>
                             )}
                           </td>
                           <td className="px-6 py-4 text-right">
                             {!provider.isVerified && (
                               <button onClick={() => handleVerifyProvider(provider._id)} className="px-3 py-1.5 bg-brand-500/20 hover:bg-brand-500 text-brand-300 hover:text-white rounded-lg text-xs font-bold transition-all">
                                 Verify
                               </button>
                             )}
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}

             {/* BOOKINGS TAB */}
             {activeTab === 'Bookings' && (
               <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
                 <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm whitespace-nowrap">
                     <thead className="bg-white/5 text-slate-400">
                       <tr>
                         <th className="px-6 py-4 font-semibold">Service</th>
                         <th className="px-6 py-4 font-semibold">Customer</th>
                         <th className="px-6 py-4 font-semibold">Provider</th>
                         <th className="px-6 py-4 font-semibold">Status</th>
                         <th className="px-6 py-4 font-semibold text-right">Amount</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5 text-slate-300">
                       {bookings.map(booking => (
                         <tr key={booking._id} className="hover:bg-white/[0.02]">
                           <td className="px-6 py-4 font-medium text-white">{booking.service?.title}</td>
                           <td className="px-6 py-4">{booking.customer?.name}</td>
                           <td className="px-6 py-4">{booking.provider?.name}</td>
                           <td className="px-6 py-4 capitalize text-xs font-semibold border-transparent">
                             <span className="px-2 py-1 rounded-full border border-white/10 bg-white/5">
                               {booking.status.replace('_', ' ')}
                             </span>
                           </td>
                           <td className="px-6 py-4 text-right font-medium text-white">₹{booking.totalAmount}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}
             
           </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
