import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';

export default function SearchBar({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const matched = mockProducts
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.categoryName?.toLowerCase().includes(q) ||
            p.material?.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
        .slice(0, 6);
      setResults(matched);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectProduct = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleFullSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onClose();
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#FAF9F5]/98 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="max-w-4xl w-full mx-auto px-6 pt-8 pb-4 flex justify-end">
        <button
          onClick={onClose}
          className="p-2 text-[#787570] hover:text-[#141414] transition-colors"
          aria-label="Close search"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="max-w-3xl w-full mx-auto px-6 pt-4 flex-1 flex flex-col">
        {/* Search Input Bar */}
        <form onSubmit={handleFullSearch} className="relative border-b-2 border-[#141414] pb-3 flex items-center">
          <Search className="w-6 h-6 text-[#787570] mr-4 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH PRODUCTS, FABRICS, SILHOUETTES..."
            className="w-full bg-transparent text-xl sm:text-2xl font-serif tracking-wider text-[#141414] placeholder-[#A3A099] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs uppercase tracking-widest text-[#787570] hover:text-[#141414] ml-2"
            >
              Clear
            </button>
          )}
        </form>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#787570] font-semibold mb-3">
              Suggested Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Cashmere', 'Outerwear', 'Tailored Trousers', 'Linen Shirt', 'Wool Coat', 'Silk'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3.5 py-1.5 border border-[#E8E6E1] bg-white text-xs text-[#141414] tracking-wider hover:border-[#141414] transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="mt-8 flex-1 overflow-y-auto pb-12">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#787570] font-semibold mb-4">
              Products ({results.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.slug || product.id)}
                  className="flex gap-4 p-3 bg-white border border-[#E8E6E1] hover:border-[#141414] cursor-pointer transition-all duration-200 group"
                >
                  <div className="w-16 h-20 bg-[#F3F1EC] shrink-0 overflow-hidden">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] uppercase tracking-widest text-[#787570]">
                      {product.categoryName}
                    </span>
                    <h4 className="font-serif text-sm text-[#141414] group-hover:text-[#C2A676] transition-colors line-clamp-1">
                      {product.name}
                    </h4>
                    <span className="text-xs font-semibold text-[#141414] mt-1">
                      {formatPrice(product.sale_price || product.base_price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleFullSearch}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#141414] hover:text-[#C2A676] transition-colors"
              >
                <span>View all results for "{query}"</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {query && results.length === 0 && (
          <div className="mt-12 text-center py-8">
            <p className="font-serif text-lg text-[#141414]">No products found matching "{query}"</p>
            <p className="text-xs text-[#787570] mt-1">
              Check your spelling or try searching for another term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
