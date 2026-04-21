import { useState } from "react";
import { FaFilter, FaTimes, FaChevronDown, FaChevronUp } from "react-icons/fa";

const AdvancedFilters = ({ filters, onFilterChange, onClearFilters, categories = [], priceRange = { min: 0, max: 1000 } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    rating: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      {/* Header - Mobile Toggle */}
      <div className="lg:hidden p-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-2">
            <FaFilter className="text-indigo-600" />
            <span className="font-semibold text-gray-800 dark:text-gray-100">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <FaFilter className="text-indigo-600" />
          <span className="font-semibold text-gray-800 dark:text-gray-100">Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <FaTimes size={12} />
            Clear All
          </button>
        )}
      </div>

      {/* Filter Content */}
      <div className={`${isOpen ? "block" : "hidden lg:block"} p-4 space-y-4`}>
        {/* Price Range */}
        <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
          <button
            onClick={() => toggleSection("price")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium text-gray-800 dark:text-gray-200">Price Range</span>
            {expandedSections.price ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Min</label>
                  <input
                    type="number"
                    value={filters.minPrice || ""}
                    onChange={(e) => onFilterChange("minPrice", e.target.value)}
                    placeholder={`$${priceRange.min}`}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 dark:text-gray-400">Max</label>
                  <input
                    type="number"
                    value={filters.maxPrice || ""}
                    onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                    placeholder={`$${priceRange.max}`}
                    className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
                  />
                </div>
              </div>
              
              {/* Quick Price Buttons */}
              <div className="flex flex-wrap gap-2">
                {["Under $10", "$10-$25", "$25-$50", "Over $50"].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      if (range === "Under $10") {
                        onFilterChange("maxPrice", 10);
                        onFilterChange("minPrice", 0);
                      } else if (range === "$10-$25") {
                        onFilterChange("minPrice", 10);
                        onFilterChange("maxPrice", 25);
                      } else if (range === "$25-$50") {
                        onFilterChange("minPrice", 25);
                        onFilterChange("maxPrice", 50);
                      } else {
                        onFilterChange("minPrice", 50);
                        onFilterChange("maxPrice", "");
                      }
                    }}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      filters.priceRange === range
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
          <button
            onClick={() => toggleSection("category")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium text-gray-800 dark:text-gray-200">Categories</span>
            {expandedSections.category ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
          
          {expandedSections.category && (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.categories?.includes(category)}
                    onChange={(e) => {
                      const newCategories = e.target.checked
                        ? [...(filters.categories || []), category]
                        : (filters.categories || []).filter((c) => c !== category);
                      onFilterChange("categories", newCategories);
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Rating */}
        <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
          <button
            onClick={() => toggleSection("rating")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium text-gray-800 dark:text-gray-200">Rating</span>
            {expandedSections.rating ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
          
          {expandedSections.rating && (
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="rating"
                    checked={filters.minRating === rating}
                    onChange={() => onFilterChange("minRating", rating)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${i < rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">& Up</span>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Availability */}
        <div className="pb-4">
          <button
            onClick={() => toggleSection("availability")}
            className="flex items-center justify-between w-full mb-3"
          >
            <span className="font-medium text-gray-800 dark:text-gray-200">Availability</span>
            {expandedSections.availability ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
          
          {expandedSections.availability && (
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => onFilterChange("inStock", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">In Stock Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.onSale}
                  onChange={(e) => onFilterChange("onSale", e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">On Sale</span>
              </label>
            </div>
          )}
        </div>

        {/* Mobile Clear Button */}
        {activeFiltersCount > 0 && (
          <button
            onClick={onClearFilters}
            className="lg:hidden w-full flex items-center justify-center gap-2 py-3 border-2 border-red-200 dark:border-red-800 text-red-600 rounded-xl font-medium"
          >
            <FaTimes />
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default AdvancedFilters;
