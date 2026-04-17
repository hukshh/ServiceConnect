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

  // Promo State
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null); // { code, discountAmount, originalValue, finalValue }
  const [promoError, setPromoError] = useState('');

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [applyingPromo, setApplyingPromo] = useState(false);

  const selectedService = services.find((s) => s._id === selectedServiceId);

  useEffect(() => {
    document.title = 'ServiceConnect - Book Service';
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

    setSubmitting(true);

    try {
      await API.post('/bookings', {
        serviceId: selectedServiceId,
        date,
        timeSlot,
        address: { street, city, pincode },
        notes,
        promoCode: appliedPromo?.code || '',
      });

      setSuccess('Booking confirmed successfully!');
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking.');
      setSubmitting(false);
    }
  };

  const handleApplyPromo = async () => {
     if (!promoCodeInput) return;
     if (!selectedServiceId) {
        setPromoError('Please select a service first.');
        return;
     }

     setApplyingPromo(true);
     setPromoError('');
     try {
        const { data } = await API.post('/promo/apply', {
           code: promoCodeInput,
           orderValue: selectedService?.price
        });
        setAppliedPromo(data);
        setPromoError('');
     } catch (err) {
        setPromoError(err.response?.data?.message || 'Invalid promo code');
        setAppliedPromo(null);
     } finally {
        setApplyingPromo(false);
     }
  };

  // Re-verify promo if selected service changes
  useEffect(() => {
     if (appliedPromo && selectedService) {
        setAppliedPromo(null);
        setPromoCodeInput('');
     }
  }, [selectedServiceId]);

  // Get minimum date (today) in YYYY-MM-DD for date picker
  const today = new Date().toISOString().split('T')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">Loading booking form...</div>
      </div>
    );
  }

  if (error && !provider) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 text-center text-red-500">{error}</div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 mt-1.5";

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in relative">
        <button onClick={() => navigate(-1)} className="absolute -top-4 left-4 sm:left-6 flex items-center gap-1 text-gray-500 hover:text-black transition-colors text-sm font-bold">
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
           Back
        </button>

        <div className="text-center mb-10 mt-6">
          <h1 className="text-3xl font-extrabold text-black mb-2">Book Service</h1>
          <p className="text-gray-500">
            Booking an appointment with <span className="font-bold text-black">{provider?.name}</span>
          </p>
        </div>

        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> 
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 text-black rounded-xl flex items-center gap-2 font-bold">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg> 
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Select Service */}
            <div>
              <label className="block text-sm font-bold text-black mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs shadow-sm">1</span>
                Select Service
              </label>
              <div className="space-y-3">
                {services.map(service => (
                  <label key={service._id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200 ${selectedServiceId === service._id ? 'bg-gray-50 border-black' : 'bg-white border-gray-200 hover:border-gray-300'}`}>
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="service" 
                        value={service._id}
                        checked={selectedServiceId === service._id}
                        onChange={(e) => setSelectedServiceId(e.target.value)}
                        className="w-4 h-4 text-black focus:ring-black border-gray-300"
                      />
                      <div>
                        <p className="text-black font-bold">{service.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{service.category?.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-black font-bold">₹{service.price}</p>
                      <p className="text-xs text-gray-500">/{service.priceType === 'hourly' ? 'hr' : 'fixed'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div>
              <label className="block text-sm font-bold text-black mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs shadow-sm">2</span>
                Date & Time
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">Date</label>
                  <input type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Time Slot</label>
                  <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} className={`${inputClass} appearance-none cursor-pointer`} required>
                    <option value="" className="bg-white">Select time...</option>
                    {TIME_SLOTS.map(t => <option key={t} value={t} className="bg-white">{t}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Address */}
            <div>
              <label className="block text-sm font-bold text-black mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs shadow-sm">3</span>
                Service Address
              </label>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500">Street Address</label>
                  <input type="text" placeholder="Flat No, Building, Street" value={street} onChange={e => setStreet(e.target.value)} className={inputClass} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500">City</label>
                    <input type="text" placeholder="e.g. Mumbai" value={city} onChange={e => setCity(e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">Pincode</label>
                    <input type="text" placeholder="400001" value={pincode} onChange={e => setPincode(e.target.value)} className={inputClass} required />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500">Additional Notes (Optional)</label>
                  <textarea placeholder="Any specific instructions for the provider..." value={notes} onChange={e => setNotes(e.target.value)} className={`${inputClass} min-h-[100px] resize-y`} />
                </div>
              </div>
            </div>

            {/* Step 4: Promo Code */}
            <div>
              <label className="block text-sm font-bold text-black mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs shadow-sm">4</span>
                Promo Code
              </label>
              <div className="flex gap-3 items-start">
                 <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Got a discount code?" 
                      value={promoCodeInput} 
                      onChange={e => setPromoCodeInput(e.target.value.toUpperCase())} 
                      className={`${inputClass} mt-0 uppercase`} 
                      disabled={!!appliedPromo}
                    />
                    {promoError && <p className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>{promoError}</p>}
                    {appliedPromo && <p className="text-black text-xs mt-2 font-bold flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg> Promo applied: -₹{appliedPromo.discountAmount}</p>}
                 </div>
                 {!appliedPromo ? (
                    <button 
                      type="button" 
                      onClick={handleApplyPromo}
                      disabled={!promoCodeInput || applyingPromo}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-black font-bold rounded-xl disabled:opacity-50 transition-colors border border-gray-200"
                    >
                      {applyingPromo ? '...' : 'Apply'}
                    </button>
                 ) : (
                    <button 
                      type="button" 
                      onClick={() => { setAppliedPromo(null); setPromoCodeInput(''); }}
                      className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-500 font-bold border border-red-200 rounded-xl transition-colors"
                    >
                      Remove
                    </button>
                 )}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl">
               <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
                  <div>
                    <p className="text-gray-500 text-sm">Service Fee</p>
                  </div>
                  <div className="text-lg font-bold text-black">
                    ₹{selectedService?.price || 0}
                  </div>
               </div>
               
               {appliedPromo && (
                  <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-3">
                    <div>
                      <p className="text-emerald-600 text-sm font-bold">Discount ({appliedPromo.code})</p>
                    </div>
                    <div className="text-lg font-bold text-emerald-600">
                      -₹{appliedPromo.discountAmount}
                    </div>
                  </div>
               )}

               <div className="flex items-center justify-between pt-1">
                  <div>
                     <p className="text-black font-bold">Total Amount Due</p>
                     <p className="text-xs text-gray-500 mt-0.5">Pay after service completion</p>
                  </div>
                  <div className="text-3xl font-black text-black">
                     ₹{appliedPromo ? appliedPromo.finalValue : (selectedService?.price || 0)}
                  </div>
               </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!!success || services.length === 0 || submitting}
              className="w-full py-4 bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all duration-200 flex justify-center items-center gap-2"
            >
              {submitting ? (
                 <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Confirming...
                 </>
              ) : 'Confirm Booking'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default BookService;
