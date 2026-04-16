import { useState, useEffect } from 'react';
import API from '../utils/axios';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ProviderEarnings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);

  useEffect(() => {
    document.title = 'ServiceConnect - My Earnings';
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      // Fetch provider profile for total earnings
      const profileRes = await API.get('/providers/me');
      setProfile(profileRes.data);

      // Fetch provider bookings
      const bookingsRes = await API.get('/bookings/provider');
      const completed = bookingsRes.data.filter(b => b.status === 'completed');
      setBookings(completed);

      // Group completed bookings by month for chart
      const monthlyData = {};
      completed.forEach(b => {
         const date = new Date(b.createdAt);
         const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
         const monthName = date.toLocaleString('default', { month: 'short', year: '2-digit' });
         
         if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { sortKey: monthKey, month: monthName, earnings: 0 };
         }
         monthlyData[monthKey].earnings += b.totalAmount;
      });

      // Sort chronological and take last 6
      const formattedChart = Object.values(monthlyData)
         .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
         .slice(-6);

      setMonthlyChartData(formattedChart);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-brand-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20 text-slate-300">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">My Earnings</h1>
          <p className="text-slate-400">Track your revenue and completed jobs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-brand-500/10 border border-brand-500/20 rounded-2xl p-6 md:col-span-1">
              <p className="text-sm font-bold text-brand-400 uppercase tracking-wider mb-2">Total Lifetime Earnings</p>
              <p className="text-5xl font-black text-white mb-2">₹{profile?.totalEarnings || 0}</p>
              <p className="text-sm text-slate-400">{bookings.length} completed jobs</p>
           </div>
           
           <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:col-span-2">
              <h3 className="text-lg font-bold text-white mb-4">Monthly Earnings Trend</h3>
              {monthlyChartData.length > 0 ? (
                 <div className="h-[200px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={monthlyChartData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                       <CartesianGrid stroke="#ffffff1a" strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                       <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(val) => `₹${val}`} />
                       <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} itemStyle={{ color: '#10b981' }} cursor={{fill: '#ffffff0a'}} />
                       <Bar dataKey="earnings" fill="#10b981" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              ) : (
                 <div className="h-[200px] flex items-center justify-center text-slate-500">Not enough data to display chart</div>
              )}
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden mt-6">
           <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
           </div>
           
           <div className="overflow-x-auto">
              {bookings.length > 0 ? (
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-black/20 text-slate-400">
                     <tr>
                       <th className="px-6 py-4 font-semibold">Date Completed</th>
                       <th className="px-6 py-4 font-semibold">Service</th>
                       <th className="px-6 py-4 font-semibold">Customer</th>
                       <th className="px-6 py-4 font-semibold text-right">Amount Earned</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5 text-slate-300">
                     {bookings.slice().reverse().map(booking => (
                        <tr key={booking._id} className="hover:bg-white/[0.02]">
                           <td className="px-6 py-4 font-medium text-slate-400">
                              {new Date(booking.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                           </td>
                           <td className="px-6 py-4 font-medium text-white">{booking.service?.title}</td>
                           <td className="px-6 py-4 flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-white uppercase">{booking.customer?.name?.charAt(0)}</div>
                              {booking.customer?.name}
                           </td>
                           <td className="px-6 py-4 font-bold text-emerald-400 text-right">₹{booking.totalAmount}</td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
              ) : (
                 <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                    <span className="text-4xl mb-4 opacity-50">💸</span>
                    <p className="font-semibold">No completed jobs yet</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderEarnings;
