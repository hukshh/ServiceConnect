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
      const bookingsRes = await API.get('/bookings/provider');
      const completed = bookingsRes.data.filter(b => b.status === 'completed');
      setBookings(completed);

      // Group completed bookings by date for daily chart
      const dailyData = {};
      completed.forEach(b => {
         const date = new Date(b.updatedAt);
         const dateKey = date.toISOString().split('T')[0];
         const dateName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
         
         if (!dailyData[dateKey]) {
            dailyData[dateKey] = { sortKey: dateKey, date: dateName, earnings: 0 };
         }
         dailyData[dateKey].earnings += b.totalAmount;
      });

      const formattedChart = Object.values(dailyData)
         .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
         .slice(-7); // Show last 7 active days

      setMonthlyChartData(formattedChart);

      // Sum completed bookings for perfect sync
      const total = completed.reduce((sum, b) => sum + b.totalAmount, 0);
      setProfile({ totalEarnings: total });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-black font-bold animate-pulse text-lg tracking-widest uppercase">Loading Revenue...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-20 text-gray-800">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-black mb-2 tracking-tight">Financial Overview</h1>
          <p className="text-gray-500 font-medium">Detailed breakdown of your service revenue and trends.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
           {/* Total Earnings Card */}
           <div className="bg-black rounded-3xl p-8 md:col-span-1 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4 relative z-10">Lifetime Revenue</p>
              <div className="flex items-baseline gap-1 relative z-10">
                <span className="text-3xl font-light text-white/50">₹</span>
                <p className="text-6xl font-black text-white">{profile?.totalEarnings?.toLocaleString() || 0}</p>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
                <div>
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Volume</p>
                   <p className="text-xl font-bold text-white">{bookings.length} <span className="text-sm font-medium text-gray-400">Jobs</span></p>
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Avg Ticket</p>
                   <p className="text-xl font-bold text-white">₹{bookings.length > 0 ? Math.round(profile.totalEarnings / bookings.length) : 0}</p>
                </div>
              </div>
           </div>
           
           {/* Chart Card */}
           <div className="bg-white border border-gray-100 rounded-3xl p-8 lg:col-span-2 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-black text-black uppercase tracking-tight">Revenue Trend</h3>
                 <div className="px-3 py-1 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest border border-gray-100">Recent Activity</div>
              </div>
              {monthlyChartData.length > 0 ? (
                 <div className="h-[240px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={monthlyChartData} margin={{ top: 5, right: 0, bottom: 5, left: -20 }}>
                       <defs>
                         <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="0%" stopColor="#000000" stopOpacity={1}/>
                           <stop offset="100%" stopColor="#222222" stopOpacity={0.8}/>
                         </linearGradient>
                       </defs>
                       <CartesianGrid stroke="#f1f1f1" strokeDasharray="4 4" vertical={false} />
                       <XAxis 
                         dataKey="date" 
                         stroke="#a1a1a1" 
                         fontSize={10} 
                         axisLine={false}
                         tickLine={false}
                         tick={{fill: '#999', fontWeight: '800'}} 
                         dy={10}
                       />
                       <YAxis 
                         stroke="#a1a1a1" 
                         fontSize={10} 
                         axisLine={false}
                         tickLine={false}
                         tickFormatter={(val) => `₹${val}`} 
                         tick={{fill: '#999', fontWeight: '800'}} 
                       />
                       <Tooltip 
                         contentStyle={{ 
                           backgroundColor: '#000', 
                           border: 'none',
                           borderRadius: '16px', 
                           boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                           padding: '12px 16px'
                         }} 
                         itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: '900' }} 
                         labelStyle={{ color: '#666', fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '800' }}
                         cursor={{fill: '#f8f8f8'}} 
                       />
                       <Bar dataKey="earnings" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
                     </BarChart>
                   </ResponsiveContainer>
                 </div>
              ) : (
                 <div className="h-[240px] flex flex-col items-center justify-center text-gray-300">
                    <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    <p className="font-black uppercase tracking-widest text-xs">Waiting for data trends</p>
                 </div>
              )}
           </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
           <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-black tracking-tight uppercase">Recent Ledger</h3>
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-black rounded-full animate-ping"></div>
              </div>
           </div>
           
           <div className="overflow-x-auto">
              {bookings.length > 0 ? (
                 <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-gray-50/50 text-gray-400 border-b border-gray-100">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Transaction Date</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Service Delivered</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Client</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-right">Net Earning</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-600">
                      {bookings.slice().reverse().map(booking => (
                         <tr key={booking._id} className="hover:bg-gray-50/80 transition-all duration-300 group">
                            <td className="px-8 py-6">
                               <span className="font-bold text-gray-400 text-xs tabular-nums">
                                  {new Date(booking.updatedAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                               </span>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex flex-col">
                                  <span className="font-black text-black group-hover:translate-x-1 transition-transform duration-300">{booking.service?.title}</span>
                                  <span className="text-[10px] text-gray-400 font-bold uppercase">ID: {booking._id.slice(-6)}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-[10px] font-black text-white uppercase shadow-sm">
                                     {booking.customer?.name?.charAt(0)}
                                  </div>
                                  <span className="font-bold text-gray-700">{booking.customer?.name}</span>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <span className="font-black text-black text-lg">₹{booking.totalAmount.toLocaleString()}</span>
                            </td>
                         </tr>
                      ))}
                    </tbody>
                 </table>
              ) : (
                 <div className="p-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                       <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="font-black text-black uppercase tracking-widest">No transaction history found</p>
                    <p className="text-gray-400 text-sm mt-2 font-medium">Complete your first job to start seeing earnings here.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderEarnings;
