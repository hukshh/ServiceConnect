import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import Navbar from '../components/Navbar';

const TIME_SLOTS = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
];

const BookService = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();

  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');

  // Auto-calculated selected service object
  const selectedService = services.find((s) => s._id === selectedServiceId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/providers/${providerId}`);
        setProvider(data.profile.user);
        setServices(data.services);
        if (data.services.length > 0) {
          setSelectedServiceId(data.services[0]._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load provider data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [providerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedServiceId || !date || !timeSlot || !street || !city || !pincode) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      await API.post('/bookings', {
        serviceId: selectedServiceId,
        date,
        timeSlot,
        address: { street, city, pincode },
        notes,
      });

      setSuccess('Booking confirmed successfully!');
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.');
    }
  };

  // Get minimum date (today) in YYYY-MM-DD for date picker
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center text-slate-400">Loading booking form...</div>
      </div>
    );
  }

  if (error && !provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center text-red-400">{error}</div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 mt-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-2">Book Service</h1>
          <p className="text-slate-400">
            Booking an appointment with <span className="font-semibold text-white">{provider?.name}</span>
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl flex items-center gap-2">
              <span className="text-xl">⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-2 font-medium">
              <span className="text-xl">✅</span> {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Select Service */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs">1</span>
                Select Service
              </label>
              <div className="space-y-3">
                {services.map(service => (
                  <label key={service._id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedServiceId === service._id ? 'bg-brand-500/10 border-brand-500' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="service" 
                        value={service._id}
                        checked={selectedServiceId === service._id}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-4 h-4 text-brand-500 focus:ring-brand-500 border-white/10 bg-black/20"
                      />
                      <div>
                        <p className="text-white font-medium">{service.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{service.category?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-300 font-bold">₹{service.price}</p>
                      <p className="text-xs text-slate-500">/{service.priceType === 'hourly' ? 'hr' : 'fixed'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs">2</span>
                Date & Time
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400">Date</label>
                  <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400">Time Slot</label>
                  <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`} required>
                    <option value="" className="bg-slate-800">Select time...</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Address */}
            <div>
              <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center text-xs">3</span>
                Service Address
              </label>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-400">Street Address</label>
                  <input type="text" placeholder="Flat No, Building, Street" value={street} onChange={e => setStreet(e.target.value)} className={inputClass} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400">City</label>
                    <input type="text" placeholder="e.g. Mumbai" value={city} onChange={e => setCity(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-400">Pincode</label>
                    <input type="text" placeholder="400001" value={pincode} onChange={e => setPincode(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400">Additional Notes (Optional)</label>
                  <textarea placeholder="Any specific instructions for the provider..." value={notes} onChange={e => setNotes(e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} />
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-5 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Amount Due</p>
                <p className="text-xs text-slate-500 mt-0.5">Pay after service completion</p>
              </div>
              <div className="text-2xl font-bold text-white">
                ₹{selectedService?.price || 0}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!!success || services.length === 0}
              className="w-full py-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all duration-200"
            >
              Confirm Booking
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BookService;
