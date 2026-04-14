// Filter panel for category, price range, rating, and sort options
const FilterPanel = ({ categories, filters, onChange, onReset }) => {
  // Updates a single filter field by key
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const inputClass =
    'w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 appearance-none cursor-pointer';

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-brand-400 hover:text-brand-300 font-medium transition-colors duration-200"
        >
          Reset all
        </button>
      </div>

      {/* Category filter */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={inputClass}
          >
            <option value="" className="bg-slate-800">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-slate-800">
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Price Range (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200"
          />
        </div>
      </div>

      {/* Minimum rating */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Minimum Rating</label>
        <div className="relative">
          <select
            value={filters.minRating}
            onChange={(e) => handleChange('minRating', e.target.value)}
            className={inputClass}
          >
            <option value="" className="bg-slate-800">Any Rating</option>
            <option value="4" className="bg-slate-800">⭐ 4+ Stars</option>
            <option value="3" className="bg-slate-800">⭐ 3+ Stars</option>
            <option value="2" className="bg-slate-800">⭐ 2+ Stars</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Sort By</label>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className={inputClass}
          >
            <option value="" className="bg-slate-800">Default</option>
            <option value="price_asc" className="bg-slate-800">Price: Low to High</option>
            <option value="price_desc" className="bg-slate-800">Price: High to Low</option>
            <option value="rating" className="bg-slate-800">Top Rated</option>
            <option value="newest" className="bg-slate-800">Newest First</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
