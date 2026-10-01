import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight, History, TrendingUp, Sparkles, Filter, ChevronRight, Camera } from 'lucide-react';
import { mockProducts, mockCategories } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import VisualSearchModal from './VisualSearchModal';

const RECENT_SEARCHES_KEY = 'elane_recent_searches';
const TRENDING_QUERIES = [
  'Cashmere Overcoat',
  'Tailored Wool Pants',
  'Italian Silk Poplin',
  'Double-Breasted Blazer',
  'Leather Cardholder',
  'Minimalist Trench Coat'
];

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [results, setResults] = useState([]);
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : ['Cashmere', 'Wool Coat', 'Tailoring'];
    } catch {
      return ['Cashmere', 'Wool Coat', 'Tailoring'];
    }
  });

  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setResults([]);
      setSelectedCategory('all');
    }
  }, [isOpen]);

  const saveToRecentSearches = (term) => {
    if (!term || !term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((item) => item.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const removeRecentSearch = (e, itemToRemove) => {
    e.stopPropagation();
    const updated = recentSearches.filter((item) => item !== itemToRemove);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  // Live Autocomplete Filtering
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      let matched = mockProducts.filter((p) => {
        const matchesQuery =
          p.name.toLowerCase().includes(q) ||
          p.categoryName?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q);

        const matchesCat = selectedCategory === 'all' || p.category_id === selectedCategory;
        return matchesQuery && matchesCat;
      });

      setResults(matched.slice(0, 8));
    }, 120);

    return () => clearTimeout(timer);
  }, [query, selectedCategory]);

  const handleSelectProduct = (slug, productName) => {
    saveToRecentSearches(productName);
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleFullSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    saveToRecentSearches(query.trim());
    onClose();
    const catQuery = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
    navigate(`/shop?search=${encodeURIComponent(query.trim())}${catQuery}`);
  };

  const handleChipClick = (term) => {
    setQuery(term);
    saveToRecentSearches(term);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      {/* Dropdown Container */}
      <div className="w-full bg-[#FAF9F5] border-b border-[#141414] shadow-2xl max-h-[90vh] flex flex-col">
        {/* Top Header / Search Bar */}
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-[#C2A676]" />
              ÉLANE Atelier Collection Directory
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-[#787570] hover:text-[#141414] transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Unified Input and Category Selector */}
          <form
            onSubmit={handleFullSearch}
            className="flex items-center bg-white border-2 border-[#141414] shadow-sm overflow-hidden"
          >
            {/* Category Dropdown (Amazon style) */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#F8F7F4] border-r border-[#E8E6E1] text-[11px] font-semibold text-[#141414] px-3 py-3 uppercase tracking-wider focus:outline-none cursor-pointer hidden sm:block shrink-0"
            >
              <option value="all">All Departments</option>
              {mockCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Main Search Input */}
            <div className="flex-1 flex items-center px-4">
              <Search className="w-5 h-5 text-[#787570] mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cashmere coats, silk shirts, trousers, leather..."
                className="w-full bg-transparent text-sm sm:text-base text-[#141414] placeholder-[#A3A099] focus:outline-none py-3"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-[#787570] hover:text-[#141414] transition-colors mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Visual Photo Search Camera Button */}
              <button
                type="button"
                onClick={() => setIsVisualSearchOpen(true)}
                className="p-1.5 text-[#C2A676] hover:text-[#A88B5B] dark:hover:text-[#E2CFA9] hover:bg-[#FAF9F5] dark:hover:bg-neutral-800 rounded-none transition-colors flex items-center gap-1 group shrink-0"
                title="Search by Photo / Image"
              >
                <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="hidden md:inline text-[10px] font-mono uppercase tracking-wider font-semibold">Visual Search</span>
              </button>
            </div>

            {/* Search Submit Button */}
            <button
              type="submit"
              className="bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF9F5] px-5 sm:px-8 py-3 text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
            </button>
          </form>
        </div>

        {/* Content Body: Autocomplete Results OR History & Trending */}
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 pb-6 overflow-y-auto flex-1">
          {query.trim().length > 0 ? (
            /* Live Results Grid */
            <div>
              <div className="flex items-center justify-between py-2 border-b border-[#E8E6E1] mb-3 text-xs">
                <span className="text-[10px] uppercase tracking-wider text-[#787570] font-semibold">
                  Instant Matches ({results.length})
                </span>
                <button
                  onClick={handleFullSearch}
                  className="text-[11px] text-[#141414] font-semibold hover:text-[#C2A676] flex items-center gap-1"
                >
                  <span>View all matching products</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {results.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product.slug || product.id, product.name)}
                      className="flex sm:flex-col bg-white border border-[#E8E6E1] hover:border-[#141414] p-2.5 cursor-pointer transition-all duration-150 group gap-3"
                    >
                      <div className="w-16 h-20 sm:w-full sm:h-36 bg-[#F3F1EC] shrink-0 overflow-hidden relative">
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        {product.sale_price && (
                          <span className="absolute top-1 left-1 bg-[#141414] text-[#FAF9F5] text-[8px] font-mono px-1 font-bold">
                            SALE
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-wider text-[#787570] truncate">
                          {product.categoryName}
                        </span>
                        <h4 className="font-serif text-xs font-semibold text-[#141414] group-hover:text-[#C2A676] transition-colors truncate">
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-xs font-bold text-[#141414]">
                            {formatPrice(product.sale_price || product.base_price)}
                          </span>
                          {product.sale_price && (
                            <span className="text-[10px] text-[#A3A099] line-through">
                              {formatPrice(product.base_price)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center space-y-2">
                  <p className="font-serif text-base text-[#141414]">
                    No garments matching "{query}"
                  </p>
                  <p className="text-xs text-[#787570]">
                    Try checking spelling or exploring trending pieces below.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Idle State: Recent Searches + Trending Queries + Quick Categories */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              {/* Col 1: Recent Searches */}
              <div className="bg-white border border-[#E8E6E1] p-4">
                <div className="flex items-center justify-between mb-3 border-b border-[#E8E6E1] pb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#787570] font-bold flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-[#C2A676]" />
                    <span>Recent Searches</span>
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={clearAllRecent}
                      className="text-[10px] text-[#A3A099] hover:text-red-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {recentSearches.length > 0 ? (
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        onClick={() => handleChipClick(term)}
                        className="flex items-center justify-between p-2 hover:bg-[#FAF9F5] cursor-pointer text-xs text-[#141414] group transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Search className="w-3 h-3 text-[#A3A099] group-hover:text-[#141414]" />
                          <span>{term}</span>
                        </span>
                        <button
                          onClick={(e) => removeRecentSearch(e, term)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[#A3A099] hover:text-[#141414]"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-[#A3A099] py-3">No recent searches recorded.</p>
                )}
              </div>

              {/* Col 2: Trending Searches (Amazon style) */}
              <div className="bg-white border border-[#E8E6E1] p-4">
                <div className="flex items-center justify-between mb-3 border-b border-[#E8E6E1] pb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#787570] font-bold flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#C2A676]" />
                    <span>Trending Now</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_QUERIES.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleChipClick(term)}
                      className="text-xs bg-[#FAF9F5] border border-[#E8E6E1] hover:border-[#141414] text-[#141414] px-2.5 py-1.5 transition-colors flex items-center gap-1"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-[#C2A676]" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Col 3: Popular Departments */}
              <div className="bg-white border border-[#E8E6E1] p-4">
                <div className="flex items-center justify-between mb-3 border-b border-[#E8E6E1] pb-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#787570] font-bold flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-[#C2A676]" />
                    <span>Popular Departments</span>
                  </span>
                </div>
                <div className="space-y-1.5">
                  {mockCategories.slice(0, 5).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onClose();
                        navigate(`/shop?category=${cat.id}`);
                      }}
                      className="w-full text-left p-2 hover:bg-[#FAF9F5] text-xs text-[#141414] flex items-center justify-between transition-colors"
                    >
                      <span>{cat.name}</span>
                      <ChevronRight className="w-3 h-3 text-[#A3A099]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop click to close */}
      <div className="flex-1 cursor-pointer" onClick={onClose} />

      {/* Visual Search AI Modal */}
      <VisualSearchModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
      />
    </div>
  );
}

