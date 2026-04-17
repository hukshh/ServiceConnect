import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import ServiceCard from '../components/ServiceCard';
import API from '../utils/axios';

const DEFAULT_FILTERS = {
  category: '',
  minPrice: '',
  maxPrice: '',
  minRating: '',
  sort: '',
};

// Renders 6 animated skeleton placeholder cards while services are loading
const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 space-y-4 animate-pulse">
        <div className="flex justify-between">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-lg" />
        </div>
        <div className="h-5 w-3/4 bg-gray-200 rounded-lg" />
        <div className="space-y-2">
          <div className="h-3 w-full bg-gray-200 rounded" />
          <div className="h-3 w-5/6 bg-gray-200 rounded" />
        </div>
        <div className="h-4 w-28 bg-gray-200 rounded-full" />
        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <div className="flex gap-2 items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
          </div>
          <div className="h-7 w-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
    ))}
  </div>
);

// Home page: hero, category chips, filter sidebar, and service card grid
const Home = () => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  // Fetches categories once on mount for the category chip bar and filter panel
  useEffect(() => {
    document.title = "ServiceConnect - Find Local Professionals";
    const fetchCategories = async () => {
      try {
        const { data } = await API.get('/categories');
        setCategories(data);
      } catch {
        // Non-critical error — categories chip bar will just be empty
      }
    };
    fetchCategories();
  }, []);

  // Fetches services from the API with current search + filter query params
  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (activeCategory) params.set('category', activeCategory);
      else if (filters.category) params.set('category', filters.category);
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
      if (filters.minRating) params.set('minRating', filters.minRating);
      if (filters.sort) params.set('sort', filters.sort);

      const { data } = await API.get(`/services?${params.toString()}`);
      setServices(data);
    } catch {
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, filters, activeCategory]);

  // Debounced effect: waits 400ms after the last change before fetching services
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchServices();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchServices]);

  // Resets all filters and search to their default values
  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearch('');
    setActiveCategory('');
  };

  // Selects a category chip and clears the filter panel category input
  const handleCategoryChip = (catId) => {
    setActiveCategory(catId === activeCategory ? '' : catId);
    setFilters((prev) => ({ ...prev, category: '' }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gray-100 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-64 h-64 bg-gray-50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10 animate-fade-in mt-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-black tracking-tight mb-4">
              Find Trusted Local
              <span className="block text-brand-600">
                Service Providers
              </span>
            </h1>
            <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
              Book verified professionals for home repairs, cleaning, tutoring, and more.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar value={search} onChange={setSearch} placeholder="Search for electricians, tutors, cleaners..." />
            </div>
          </div>

          {/* Category Chip Bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide pt-4">
            <button
              onClick={() => handleCategoryChip('')}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === ''
                  ? 'bg-black text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm'
              }`}
            >
              All Services
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => handleCategoryChip(cat._id)}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat._id
                    ? 'bg-black text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm'
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content: Filter Sidebar + Service Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex gap-6">
          {/* Filter Sidebar — hidden on mobile */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel
                categories={categories}
                filters={filters}
                onChange={setFilters}
                onReset={handleReset}
              />
            </div>
          </aside>

          {/* Services Section */}
          <div className="flex-1 min-w-0">
            {/* Result count */}
            {!loading && !error && (
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-gray-500 font-medium">
                  {services.length === 0
                    ? 'No services found'
                    : `${services.length} Recommended`}
                </p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                <h3 className="text-lg font-bold text-black mb-2">Something went wrong</h3>
                <p className="text-gray-500 text-sm mb-6">{error}</p>
                <button
                  onClick={fetchServices}
                  className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-all duration-200 shadow-md"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading skeleton */}
            {loading && <SkeletonGrid />}

            {/* Empty state */}
            {!loading && !error && services.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <h3 className="text-xl font-bold text-black mb-2">No services found</h3>
                <p className="text-gray-500 text-sm max-w-sm mb-6 font-medium">
                  Try adjusting your search or filters. Or check back later — more providers join every day!
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-black hover:bg-gray-800 text-white font-bold rounded-xl transition-all duration-200 shadow-md"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Service Cards Grid */}
            {!loading && !error && services.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 animate-fade-in">
                {services.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
