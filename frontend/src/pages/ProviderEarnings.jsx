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

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-black font-bold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 text-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-black mb-2">My Earnings</h1>
          <p className="text-gray-500 font-medium">Track your revenue and completed jobs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="bg-black border border-black rounded-2xl p-6 md:col-span-1 shadow-md">
              <p className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-2">Total Lifetime Earnings</p>
              <p className="text-5xl font-black text-white mb-2">₹{profile?.totalEarnings || 0}</p>
              <p className="text-sm text-gray-400 font-medium">{bookings.length} completed jobs</p>
           </div>
           
           <div className="bg-white border border-gray-200 rounded-2xl p-6 md:col-span-2 shadow-sm">
              <h3 className="text-lg font-bold text-black mb-4">Monthly Earnings Trend</h3>
              {monthlyChartData.length > 0 ? (
                 <div className="h-[200px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={monthlyChartData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                       <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" vertical={false} />
                       <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} tick={{fill: '#6b7280', fontWeight: 'bold'}} />
                       <YAxis stroke="#9ca3af" fontSize={12} tickFormatter={(val) => `₹${val}`} tick={{fill: '#6b7280', fontWeight: 'bold'}} />
                       <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', color: '#000', fontWeight: 'bold', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: '#000' }} cursor={{fill: '#f9fafb'}} />
                       <Bar dataKey="earnings" fill="#000000" radius={[4, 4, 0, 0]} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              ) : (
                 <div className="h-[200px] flex items-center justify-center text-gray-400 font-bold">Not enough data to display chart</div>
              )}
           </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mt-6 shadow-sm">
           <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-black">Recent Transactions</h3>
           </div>
           
           <div className="overflow-x-auto">
              {bookings.length > 0 ? (
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-white text-gray-500 border-b border-gray-200">
                     <tr>
                       <th className="px-6 py-4 font-bold uppercase tracking-wider">Date Completed</th>
                       <th className="px-6 py-4 font-bold uppercase tracking-wider">Service</th>
                       <th className="px-6 py-4 font-bold uppercase tracking-wider">Customer</th>
                       <th className="px-6 py-4 font-bold uppercase tracking-wider text-right">Amount Earned</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 text-gray-600">
                     {bookings.slice().reverse().map(booking => (
                        <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                           <td className="px-6 py-4 font-bold">
                              {new Date(booking.updatedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                           </td>
                           <td className="px-6 py-4 font-bold text-black">{booking.service?.title}</td>
                           <td className="px-6 py-4 flex items-center gap-2 font-medium">
                              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-black text-black uppercase">{booking.customer?.name?.charAt(0)}</div>
                              {booking.customer?.name}
                           </td>
                           <td className="px-6 py-4 font-black text-black text-right">₹{booking.totalAmount}</td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
              ) : (
                 <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="font-bold text-lg text-black">No completed jobs yet</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderEarnings;
