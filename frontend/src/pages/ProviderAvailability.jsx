import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import Navbar from '../components/Navbar';

const ProviderAvailability = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Availability State
  const [availability, setAvailability] = useState([]);
  
  // Blocked Dates State
  const [blockedDates, setBlockedDates] = useState([]);
  const [blockDateInput, setBlockDateInput] = useState('');

  useEffect(() => {
    document.title = "ServiceConnect - Availability Settings";
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/providers/profile/me');
      setAvailability(data.availability && data.availability.length > 0 ? data.availability : defaultAvailability);
      setBlockedDates(data.blockedDates || []);
    } catch (err) {
      if (err.response?.status === 404) {
         setAvailability(defaultAvailability);
      } else {
         setError(err.response?.data?.message || 'Failed to load availability');
      }
    } finally {
      setLoading(false);
    }
  };

  const defaultAvailability = [
    { day: 'Monday', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Tuesday', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Wednesday', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Thursday', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Friday', isAvailable: true, startTime: '09:00', endTime: '18:00' },
    { day: 'Saturday', isAvailable: false, startTime: '10:00', endTime: '16:00' },
    { day: 'Sunday', isAvailable: false, startTime: '10:00', endTime: '16:00' },
  ];

  const handleAvailabilityChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const saveAvailability = async () => {
    setSaving(true);
    setSuccessMsg('');
    setError('');
    try {
      await API.put('/providers/availability', { availability });
      setSuccessMsg('Weekly availability saved!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save availability');
    } finally {
      setSaving(false);
    }
  };

  const handleBlockDate = async () => {
    if (!blockDateInput) return;
    try {
      const { data } = await API.put('/providers/block-date', { date: blockDateInput, remove: false });
      setBlockedDates(data);
      setBlockDateInput('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to block date');
    }
  };

  const handleUnblockDate = async (date) => {
    try {
      const { data } = await API.put('/providers/block-date', { date, remove: true });
      setBlockedDates(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unblock date');
    }
  };

  if (loading) return (
     <div className="min-h-screen bg-gray-50"><Navbar /><div className="p-12 text-center text-black font-bold">Loading...</div></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
             <h1 className="text-3xl font-extrabold text-black mb-2">Availability Settings</h1>
             <p className="text-gray-500 font-medium">Manage your weekly working hours and blocked dates.</p>
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>}
        {successMsg && <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">{successMsg}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
           
           {/* Left side: Weekly Schedule */}
           <div className="lg:col-span-3 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-black flex items-center gap-2">
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       Weekly Schedule
                    </h2>
                    <button 
                       onClick={saveAvailability}
                       disabled={saving}
                       className="px-4 py-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow-md transition-all"
                    >
                       {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                 </div>

                 <div className="space-y-4">
                    {availability.map((dayObj, i) => (
                       <div key={dayObj.day} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-300 transition-colors">
                          <label className="flex items-center gap-3 w-32 cursor-pointer">
                             <input 
                                type="checkbox" 
                                checked={dayObj.isAvailable}
                                onChange={(e) => handleAvailabilityChange(i, 'isAvailable', e.target.checked)}
                                className="w-4 h-4 text-black focus:ring-black border-gray-300 rounded bg-white"
                             />
                             <span className={`font-bold ${dayObj.isAvailable ? 'text-black' : 'text-gray-400'}`}>{dayObj.day}</span>
                          </label>

                          <div className={`flex-1 flex items-center gap-3 ${dayObj.isAvailable ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                             <input 
                                type="time" 
                                value={dayObj.startTime}
                                onChange={(e) => handleAvailabilityChange(i, 'startTime', e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-black font-medium text-sm focus:outline-none focus:border-black"
                             />
                             <span className="text-gray-500 font-bold">to</span>
                             <input 
                                type="time" 
                                value={dayObj.endTime}
                                onChange={(e) => handleAvailabilityChange(i, 'endTime', e.target.value)}
                                className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-black font-medium text-sm focus:outline-none focus:border-black"
                             />
                          </div>
                          
                          {dayObj.isAvailable ? (
                             <span className="text-xs font-bold text-black w-16 text-right">Available</span>
                          ) : (
                             <span className="text-xs font-bold text-gray-400 w-16 text-right">Off</span>
                          )}
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right side: Blocked Dates */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                 <h2 className="text-xl font-bold text-black flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    Block Dates
                 </h2>
                 <p className="text-sm text-gray-500 font-medium mb-4">Select specific calendar dates when you will be unavailable for bookings entirely.</p>
                 
                 <div className="flex gap-2 mb-6">
                    <input 
                       type="date"
                       min={new Date().toISOString().split('T')[0]}
                       value={blockDateInput}
                       onChange={(e) => setBlockDateInput(e.target.value)}
                       className="flex-1 px-3 py-2 bg-white border border-gray-300 font-medium rounded-lg text-black focus:outline-none focus:border-black"
                    />
                    <button 
                       onClick={handleBlockDate}
                       disabled={!blockDateInput}
                       className="px-4 py-2 bg-black hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-all shadow-md"
                    >
                       Block
                    </button>
                 </div>

                 <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Currently Blocked</h3>
                    {blockedDates.length === 0 ? (
                       <p className="text-sm text-gray-400 italic font-medium">No specific dates blocked.</p>
                    ) : (
                       <ul className="space-y-2">
                          {blockedDates.map((d, idx) => (
                             <li key={idx} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                                <span className="text-sm text-black font-bold">{new Date(d).toLocaleDateString()}</span>
                                <button onClick={() => handleUnblockDate(d)} className="text-red-600 hover:text-red-800">
                                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                             </li>
                          ))}
                       </ul>
                    )}
                 </div>
              </div>
           </div>

        </div>
      </div>
    </div>
  );
};

export default ProviderAvailability;
