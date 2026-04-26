// Filter panel for category, price range, rating, and sort options
const FilterPanel = ({ categories, filters, onChange, onReset }) => {
  // Updates a single filter field by key
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  const inputClass =
    'w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all duration-200 appearance-none cursor-pointer';

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-black flex items-center gap-2">
          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-black font-bold transition-colors duration-200"
        >
          Reset all
        </button>
      </div>

      {/* Category filter */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Category</label>
        <div className="relative">
          <select
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={inputClass}
          >
            <option value="" className="bg-white text-black">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id} className="bg-white text-black">
                {cat.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Price Range (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleChange('minPrice', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
          />
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleChange('maxPrice', e.target.value)}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-black text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200"
          />
        </div>
      </div>

      {/* Minimum rating */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Minimum Rating</label>
        <div className="relative">
          <select
            value={filters.minRating}
            onChange={(e) => handleChange('minRating', e.target.value)}
            className={inputClass}
          >
            <option value="" className="bg-white text-black">Any Rating</option>
            <option value="4" className="bg-white text-black">4+ Stars</option>
            <option value="3" className="bg-white text-black">3+ Stars</option>
            <option value="2" className="bg-white text-black">2+ Stars</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-bold text-gray-500 mb-1.5">Sort By</label>
        <div className="relative">
          <select
            value={filters.sort}
            onChange={(e) => handleChange('sort', e.target.value)}
            className={inputClass}
          >
            <option value="" className="bg-white text-black">Default</option>
            <option value="price_asc" className="bg-white text-black">Price: Low to High</option>
            <option value="price_desc" className="bg-white text-black">Price: High to Low</option>
            <option value="rating" className="bg-white text-black">Top Rated</option>
            <option value="newest" className="bg-white text-black">Newest First</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
