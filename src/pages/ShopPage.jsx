import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, RotateCcw, Search, ChevronDown, Check, Zap, Sparkles } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { productApi } from '../services/productApi';
import { mockCategories } from '../data/mockProducts';
import { useLanguage } from '../context/LanguageContext';
import AICapsuleBuilder from '../components/AICapsuleBuilder';
import Hero3DScene from '../components/Hero3DScene';

export default function ShopPage() {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL query params state
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'featured';
  const searchParam = searchParams.get('search') || '';
  const sizeParam = searchParams.get('size') || '';
  const colorParam = searchParams.get('color') || '';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const inStockParam = searchParams.get('inStock') === 'true';
  const expressParam = searchParams.get('express') === 'true';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [showAICapsule, setShowAICapsule] = useState(false);

  // Multi-department sizes & capacities: apparel, tech storage, horology, footwear, flacons
  const availableSizes = [
    '256GB', '512GB', '1TB', '46mm', '42mm',
    '41 (UK 7)', '42 (UK 8)', '43 (UK 9)',
    '50ml', '100ml',
    'S', 'M', 'L', 'One Size'
  ];

  const availableColors = [
    { label: 'Titanium / Graphite', hex: '#2E3033', query: 'titanium' },
    { label: 'Royal Sapphire / Blue', hex: '#1E40AF', query: 'blue' },
    { label: 'Ceramic / Chalk White', hex: '#FDFBF7', query: 'white' },
    { label: 'Saddle Cognac / Tan', hex: '#8E4A28', query: 'saddle' },
    { label: 'Smoked Amber / Gold', hex: '#D97706', query: 'amber' },
    { label: 'Emerald Jade / Green', hex: '#059669', query: 'green' },
    { label: 'Imperial Cobalt / Indigo', hex: '#1D4ED8', query: 'indigo' },
  ];

  // Fetch products whenever params change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchFiltered = async () => {
      try {
        const res = await productApi.getProducts({
          category: categoryParam,
          sort: sortParam,
          search: searchParam,
          size: sizeParam,
          color: colorParam,
          minPrice: minPriceParam,
          maxPrice: maxPriceParam,
          inStock: inStockParam,
          express: expressParam,
        });

        if (isMounted) {
          setProducts(res.products || []);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchFiltered();
    return () => {
      isMounted = false;
    };
  }, [categoryParam, sortParam, searchParam, sizeParam, colorParam, minPriceParam, maxPriceParam, inStockParam, expressParam]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const resetAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    categoryParam !== 'all' ||
    searchParam !== '' ||
    sizeParam !== '' ||
    colorParam !== '' ||
    minPriceParam !== '' ||
    maxPriceParam !== '' ||
    inStockParam ||
    expressParam;

  // Filter UI Component
  const FilterContent = () => (
    <div className="space-y-8 text-sm">
      {/* Search within catalog */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-3">
          Search Atelier
        </h4>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search keywords..."
            className="w-full bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#3B5288] px-3.5 py-2 text-xs text-[#1E293B] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:outline-none focus:border-[#2563EB] rounded-lg shadow-2xs"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#2563EB]"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-3">
          {t.categories || 'Categories'}
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => updateParam('category', 'all')}
            className={`w-full text-left text-xs tracking-wider uppercase py-1.5 px-2 rounded-md transition-colors flex justify-between ${
              categoryParam === 'all'
                ? 'font-bold bg-[#1E3A8A] text-white shadow-xs'
                : 'text-[#64748B] dark:text-[#CBD5E1] hover:text-[#1E3A8A] dark:hover:text-white hover:bg-blue-50/50'
            }`}
          >
            <span>{t.allSilhouettes || 'All Silhouettes'}</span>
            {categoryParam === 'all' && <Check className="w-3.5 h-3.5 text-white" />}
          </button>
          {mockCategories.map((cat) => {
            const isCategoryActive =
              categoryParam === cat.id ||
              categoryParam === cat.slug ||
              (cat.slug && categoryParam.toLowerCase() === cat.slug.toLowerCase()) ||
              (cat.id && categoryParam.toLowerCase() === cat.id.toLowerCase());
            return (
              <button
                key={cat.id}
                onClick={() => updateParam('category', cat.slug || cat.id)}
                className={`w-full text-left text-xs tracking-wider uppercase py-1.5 px-2 rounded-md transition-colors flex justify-between ${
                  isCategoryActive
                    ? 'font-bold bg-[#1E3A8A] text-white shadow-xs'
                    : 'text-[#64748B] dark:text-[#CBD5E1] hover:text-[#1E3A8A] dark:hover:text-white hover:bg-blue-50/50'
                }`}
              >
                <span>{cat.name}</span>
                {isCategoryActive && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-3">
          {t.sizes || 'Sizes'}
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((size) => {
            const isSelected = sizeParam.toLowerCase() === size.toLowerCase();
            return (
              <button
                key={size}
                onClick={() => updateParam('size', isSelected ? '' : size)}
                className={`py-2 text-xs tracking-wider uppercase border rounded-md transition-all ${
                  isSelected
                    ? 'border-[#1E3A8A] bg-[#1E3A8A] text-white font-bold shadow-xs'
                    : 'border-[#CBD5E1] dark:border-[#3B5288] bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F8FAFC] hover:border-[#2563EB]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-3">
          {t.palette || 'Colors'}
        </h4>
        <div className="space-y-2">
          {availableColors.map((col) => {
            const isSelected = colorParam.toLowerCase() === col.query.toLowerCase();
            return (
              <button
                key={col.query}
                onClick={() => updateParam('color', isSelected ? '' : col.query)}
                className={`w-full flex items-center justify-between text-xs tracking-wider uppercase py-1 px-1.5 rounded transition-colors ${
                  isSelected ? 'font-bold text-[#1E3A8A] dark:text-[#FCD34D] bg-blue-50/50 dark:bg-white/5' : 'text-[#64748B] dark:text-[#CBD5E1] hover:text-[#1E3A8A]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#1E3A8A] dark:text-[#FCD34D]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#1E293B] dark:text-[#F8FAFC] mb-3">
          {t.priceRange || 'Price Range'}
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min ₹"
            value={minPriceParam}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="w-1/2 bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#3B5288] px-3 py-1.5 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB] rounded-lg"
          />
          <span className="text-[#94A3B8]">-</span>
          <input
            type="number"
            placeholder="Max ₹"
            value={maxPriceParam}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="w-1/2 bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#3B5288] px-3 py-1.5 text-xs text-[#1E293B] dark:text-[#F8FAFC] focus:outline-none focus:border-[#2563EB] rounded-lg"
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-2 space-y-2.5">
        {/* ÉLANE Privilege Next-Day Air Filter */}
        <label className="flex items-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider text-[#1E293B] dark:text-[#F8FAFC] p-2 bg-[#EFF6FF] dark:bg-[#1E3A8A]/30 border border-[#BFDBFE] dark:border-[#3B5288] rounded-lg hover:border-[#2563EB] transition-colors">
          <input
            type="checkbox"
            checked={expressParam}
            onChange={(e) => updateParam('express', e.target.checked ? 'true' : '')}
            className="w-4 h-4 accent-[#2563EB] cursor-pointer"
          />
          <div className="flex items-center gap-1.5 font-semibold">
            <span className="bg-[#1E3A8A] text-[#FCD34D] px-1.5 py-0.5 font-mono text-[9px] rounded flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-[#FCD34D]" />
              <span>Privilege</span>
            </span>
            <span className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">Next-Day Air</span>
          </div>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider text-[#1E293B] dark:text-[#F8FAFC]">
          <input
            type="checkbox"
            checked={inStockParam}
            onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
            className="w-4 h-4 accent-[#2563EB] cursor-pointer"
          />
          <span>{t.inStockOnly || 'In Stock Only'}</span>
        </label>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetAllFilters}
          className="btn-sheen w-full py-2.5 border border-[#1E3A8A] dark:border-[#93C5FD] text-[#1E3A8A] dark:text-[#93C5FD] text-xs uppercase tracking-[0.2em] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-[#1E3A8A] hover:text-white transition-all shadow-xs group active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500" />
          <span>{t.resetFilters || 'Reset All Filters'}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      {/* 3D Shopping Atelier Showcase Pavilion */}
      <div className="relative w-full h-[220px] sm:h-[280px] rounded-3xl overflow-hidden mb-10 bg-gradient-to-r from-[#172554] via-[#1E40AF] to-[#1E3A8A] shadow-2xl border border-[#60A5FA]/30">
        <Hero3DScene />
        <div className="absolute inset-0 bg-gradient-to-r from-[#172554]/90 via-[#1E40AF]/40 to-[#172554]/90 pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 pointer-events-none">
          <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-[#FCD34D] border border-amber-300/40 text-[10px] uppercase tracking-[0.25em] font-bold mb-2 backdrop-blur-md">
            Interactive 3D Shopping Pavilion
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-white uppercase tracking-wider font-light drop-shadow-md">
            {t.collectionTitle || 'THE MASTER CATALOG'}
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 max-w-lg mt-2 font-light drop-shadow-sm">
            Handcrafted Indian master guilds & worldwide 190+ countries luxury delivery. Drag to inspect 3D shopping craft.
          </p>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="border-y border-[#CBD5E1] dark:border-[#2E4374] py-4 mb-10 flex flex-wrap items-center justify-between gap-4">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="btn-sheen lg:hidden flex items-center gap-2 px-4 py-2 border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] text-xs uppercase tracking-wider font-semibold text-[#1E293B] dark:text-white rounded-lg shadow-2xs active:scale-95"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t.refineCatalog || 'Filters'} {hasActiveFilters && '• Active'}</span>
        </button>

        {/* Total Results Count & AI Capsule Curator Action */}
        <div className="flex items-center gap-3">
          <div className="text-xs uppercase tracking-widest text-[#64748B] dark:text-[#CBD5E1]">
            {t.showing || 'Showing'} <span className="font-bold text-[#1E3A8A] dark:text-[#FCD34D]">{products.length}</span> {t.pieces || 'Pieces'}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="ml-3 text-[#D97706] hover:text-[#1E3A8A] dark:hover:text-white font-medium hover:underline active:scale-95 inline-block transition-transform"
              >
                Clear filters
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAICapsule(!showAICapsule)}
            className="btn-sheen btn-glow-pulse px-4 py-2 rounded-full bg-gradient-to-r from-[#D97706] via-[#EA580C] to-[#D97706] text-white text-[11px] uppercase tracking-wider font-bold flex items-center gap-1.5 hover:opacity-95 shadow-md shadow-amber-500/20 active:scale-95 transition-all group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-200 group-hover:rotate-45 transition-transform duration-300" />
            <span>{showAICapsule ? 'Hide AI Curator' : 'AI Life Capsule Curator'}</span>
          </button>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[#64748B] dark:text-[#CBD5E1] hidden sm:inline">
            {t.sortBy || 'Sort By'}:
          </span>
          <div className="relative">
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="appearance-none bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#3B5288] px-4 py-2 pr-9 text-xs uppercase tracking-wider font-semibold text-[#1E293B] dark:text-[#F8FAFC] rounded-lg focus:outline-none cursor-pointer shadow-2xs"
            >
              <option value="featured">{t.featured || 'Featured Curations'}</option>
              <option value="newest">{t.newest || 'Newest Releases'}</option>
              <option value="price-asc">{t.priceLowHigh || 'Price: Low to High'}</option>
              <option value="price-desc">{t.priceHighLow || 'Price: High to Low'}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] dark:text-[#CBD5E1] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 pr-6 border-r border-[#CBD5E1] dark:border-[#2E4374]">
          <div className="sticky top-28">
            <FilterContent />
          </div>
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-9 space-y-8">
          {/* Expandable AI Lifestyle Capsule Curator */}
          {showAICapsule && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <AICapsuleBuilder onComplete={() => setShowAICapsule(false)} />
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#CBD5E1] dark:border-[#3B5288] bg-white dark:bg-[#1E293B] p-8 rounded-2xl shadow-xs">
              <h3 className="font-serif text-2xl text-[#1E293B] dark:text-white mb-2">No matching products found</h3>
              <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] max-w-sm mx-auto mb-6">
                Try widening your price range, clearing specific filters, or resetting all options.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-3 bg-[#1E3A8A] text-white text-xs uppercase tracking-[0.2em] font-bold rounded-lg hover:bg-[#2563EB] transition-colors shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-in Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FAF8F5] dark:bg-[#172554] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#CBD5E1] dark:border-[#2E4374] mb-6">
                <h3 className="font-serif text-lg uppercase tracking-wider text-[#1E293B] dark:text-white">Refine Catalog</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#64748B] dark:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
            </div>

            <div className="pt-8 border-t border-[#CBD5E1] dark:border-[#2E4374] mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#1E3A8A] text-white text-xs uppercase tracking-widest font-bold rounded-lg shadow-md hover:bg-[#2563EB]"
              >
                Apply Filters ({products.length} Items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
