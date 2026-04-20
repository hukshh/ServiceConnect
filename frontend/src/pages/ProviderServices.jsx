import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import Navbar from '../components/Navbar';

const ProviderServices = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [myServices, setMyServices] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Array of new services being created
  const [newServices, setNewServices] = useState([{
    title: '',
    description: '',
    category: '',
    price: '',
    priceType: 'fixed',
    customCategory: ''
  }]);

  useEffect(() => {
    document.title = 'ServiceConnect - Manage Services';
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        API.get('/services/my/listings'),
        API.get('/categories')
      ]);
      setMyServices(servicesRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error('Error fetching provider services data:', err);
      setError(err.response?.data?.message || 'Failed to load data. Make sure you are verified.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateServiceChange = (index, field, value) => {
    const updated = [...newServices];
    updated[index][field] = value;
    setNewServices(updated);
  };

  const addServiceForm = () => {
    setNewServices([...newServices, { title: '', description: '', category: '', price: '', priceType: 'fixed', customCategory: '' }]);
  };

  const removeServiceForm = (index) => {
    if (newServices.length === 1) return;
    const updated = [...newServices];
    updated.splice(index, 1);
    setNewServices(updated);
  };

  const handleBulkSubmit = async () => {
    setError('');
    setSuccess('');
    
    // Validate
    for (let s of newServices) {
      if (!s.title || !s.description || !s.category || !s.price) {
        setError('Please fill out all required fields for every service.');
        return;
      }
    }

    setSaving(true);
    try {
      await API.post('/services/bulk', { services: newServices });
      setSuccess(`Successfully added ${newServices.length} service(s)!`);
      setIsAdding(false);
      setNewServices([{ title: '', description: '', category: '', price: '', priceType: 'fixed', customCategory: '' }]);
      fetchData(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create services.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExisting = async (id) => {
    if (!window.confirm('Delete this service? This action cannot be undone.')) return;
    try {
      await API.delete(`/services/${id}`);
      setMyServices(prev => prev.filter(s => s._id !== id));
      setSuccess('Service deleted successfully.');
    } catch (err) {
      alert('Failed to delete service.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-8">
          <p className="text-black font-bold">Loading services...</p>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-black font-medium text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 animate-fade-in relative">
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-black mb-2">My Services</h1>
            <p className="text-gray-500 font-medium">Manage your active service listings and add new ones.</p>
          </div>
          <div className="flex gap-3">
             {isAdding ? (
               <button 
                 onClick={() => setIsAdding(false)}
                 className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-xl transition-colors shadow-sm"
               >
                 Cancel Adding
               </button>
             ) : (
               <button 
                 onClick={() => setIsAdding(true)}
                 className="px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl flex items-center gap-2 transition-colors shadow-md"
               >
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg>
                 Add Services
               </button>
             )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 font-bold rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg> 
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-200 text-black font-bold rounded-xl flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/></svg> 
            {success}
          </div>
        )}

        {isAdding ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-black border-b border-gray-200 pb-2">Adding Multiple Services</h2>
               <button onClick={addServiceForm} className="text-sm font-bold text-black hover:text-gray-600 flex items-center gap-1">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/></svg> Add Another Form
               </button>
            </div>
            
            {newServices.map((service, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative">
                {newServices.length > 1 && (
                  <button 
                    onClick={() => removeServiceForm(index)} 
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700 font-bold text-xs"
                  >
                    Remove
                  </button>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Service Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Full Home Deep Cleaning" 
                      value={service.title} 
                      onChange={(e) => handleCreateServiceChange(index, 'title', e.target.value)} 
                      className={inputClass}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                    <textarea 
                      placeholder="Describe what is included..."
                      value={service.description} 
                      onChange={(e) => handleCreateServiceChange(index, 'description', e.target.value)} 
                      className={`${inputClass} min-h-[80px] resize-y`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
                    <select 
                      value={service.category} 
                      onChange={(e) => handleCreateServiceChange(index, 'category', e.target.value)} 
                      className={`${inputClass} appearance-none cursor-pointer`}
                    >
                      <option value="">Select Category...</option>
                      {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  
                  {/* Conditional Input for Custom Category/Service mention */}
                  {categories.find(c => c._id === service.category)?.name === 'Other' && (
                    <div className="sm:col-span-2 animate-slide-up">
                      <label className="block text-xs font-bold text-gray-500 mb-1 leading-tight">
                        Mention the service/category you want to add
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Pet Grooming, Photography, etc." 
                        value={service.customCategory} 
                        onChange={(e) => handleCreateServiceChange(index, 'customCategory', e.target.value)} 
                        className={`${inputClass} border-black ring-1 ring-black bg-gray-50`}
                      />
                      <p className="text-[10px] text-gray-400 mt-1 font-bold italic">
                        * This will help us categorize your service properly.
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Price (₹)</label>
                       <input 
                         type="number" 
                         placeholder="0.00" 
                         value={service.price} 
                         onChange={(e) => handleCreateServiceChange(index, 'price', e.target.value)} 
                         className={inputClass}
                       />
                     </div>
                     <div>
                       <label className="block text-xs font-bold text-gray-500 mb-1">Type</label>
                       <select 
                         value={service.priceType} 
                         onChange={(e) => handleCreateServiceChange(index, 'priceType', e.target.value)} 
                         className={`${inputClass} appearance-none cursor-pointer`}
                       >
                         <option value="fixed">Fixed</option>
                         <option value="hourly">Hourly</option>
                       </select>
                     </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={handleBulkSubmit}
                disabled={saving}
                className="px-8 py-3.5 bg-black hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition-all duration-200"
              >
                {saving ? 'Saving Services...' : `Publish ${newServices.length} Service${newServices.length > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
             {myServices.length === 0 ? (
               <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl shadow-sm">
                 <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11v9h-5v-6h-4v6H5v-9"/></svg>
                 <h3 className="text-lg font-bold text-black mb-1">You don't have any active services.</h3>
                 <p className="text-sm font-medium text-gray-500">Click "Add Services" to start earning.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {myServices.map((service) => (
                   <div key={service._id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm relative group flex flex-col">
                     <button 
                       onClick={() => handleDeleteExisting(service._id)}
                       className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                       title="Delete Service"
                     >
                       <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                     </button>
                     <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center justify-center p-1.5 bg-gray-100 rounded-lg text-black">
                           {service.category?.icon ? service.category.icon : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                        </span>
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{service.category?.name}</span>
                     </div>
                     <h3 className="text-lg font-extrabold text-black mb-2 leading-tight">{service.title}</h3>
                     <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4 flex-1">{service.description}</p>
                     
                     <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div className="text-xl font-black text-black">₹{service.price}</div>
                        <div className="text-xs font-bold text-gray-400 uppercase">/{service.priceType}</div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderServices;
