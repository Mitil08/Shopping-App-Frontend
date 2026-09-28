import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, RotateCcw, Search, ChevronDown, Check } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ProductGridSkeleton } from '../components/Skeleton';
import { productApi } from '../services/productApi';
import { mockCategories } from '../data/mockProducts';
import { useLanguage } from '../context/LanguageContext';

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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParam);

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'One Size'];
  const availableColors = [
    { label: 'Black / Charcoal', hex: '#1C1C1E', query: 'black' },
    { label: 'White / Cream', hex: '#FDFBF7', query: 'white' },
    { label: 'Camel / Tan', hex: '#C39B77', query: 'camel' },
    { label: 'Navy / Indigo', hex: '#1B243B', query: 'indigo' },
    { label: 'Olive / Khaki', hex: '#3D4233', query: 'olive' },
    { label: 'Grey / Slate', hex: '#686B6F', query: 'grey' },
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
  }, [categoryParam, sortParam, searchParam, sizeParam, colorParam, minPriceParam, maxPriceParam, inStockParam]);

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
    inStockParam;

  // Filter UI Component
  const FilterContent = () => (
    <div className="space-y-8 text-sm">
      {/* Search within catalog */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#141414] mb-3">
          Search Atelier
        </h4>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search keywords..."
            className="w-full bg-white border border-[#E8E6E1] px-3.5 py-2 text-xs text-[#141414] placeholder-[#A3A099] focus:outline-none focus:border-[#141414]"
          />
          <button
            type="submit"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#787570] hover:text-[#141414]"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#141414] mb-3">
          {t.categories || 'Categories'}
        </h4>
        <div className="space-y-2">
          <button
            onClick={() => updateParam('category', 'all')}
            className={`w-full text-left text-xs tracking-wider uppercase py-1 transition-colors flex justify-between ${
              categoryParam === 'all' ? 'font-bold text-[#141414]' : 'text-[#787570] hover:text-[#141414]'
            }`}
          >
            <span>{t.allSilhouettes || 'All Silhouettes'}</span>
            {categoryParam === 'all' && <Check className="w-3.5 h-3.5 text-[#141414]" />}
          </button>
          {mockCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.id)}
              className={`w-full text-left text-xs tracking-wider uppercase py-1 transition-colors flex justify-between ${
                categoryParam === cat.id ? 'font-bold text-[#141414]' : 'text-[#787570] hover:text-[#141414]'
              }`}
            >
              <span>{cat.name}</span>
              {categoryParam === cat.id && <Check className="w-3.5 h-3.5 text-[#141414]" />}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#141414] mb-3">
          {t.sizes || 'Sizes'}
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((size) => {
            const isSelected = sizeParam.toLowerCase() === size.toLowerCase();
            return (
              <button
                key={size}
                onClick={() => updateParam('size', isSelected ? '' : size)}
                className={`py-2 text-xs tracking-wider uppercase border transition-all ${
                  isSelected
                    ? 'border-[#141414] bg-[#141414] text-[#FAF9F5] font-semibold'
                    : 'border-[#E8E6E1] bg-white text-[#141414] hover:border-[#141414]'
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
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#141414] mb-3">
          {t.palette || 'Colors'}
        </h4>
        <div className="space-y-2">
          {availableColors.map((col) => {
            const isSelected = colorParam.toLowerCase() === col.query.toLowerCase();
            return (
              <button
                key={col.query}
                onClick={() => updateParam('color', isSelected ? '' : col.query)}
                className={`w-full flex items-center justify-between text-xs tracking-wider uppercase py-1 transition-colors ${
                  isSelected ? 'font-bold text-[#141414]' : 'text-[#787570] hover:text-[#141414]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3 h-3 rounded-full border border-black/20"
                    style={{ backgroundColor: col.hex }}
                  />
                  <span>{col.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#141414]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#141414] mb-3">
          {t.priceRange || 'Price Range'}
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min $"
            value={minPriceParam}
            onChange={(e) => updateParam('minPrice', e.target.value)}
            className="w-1/2 bg-white border border-[#E8E6E1] px-3 py-1.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
          />
          <span className="text-[#A3A099]">-</span>
          <input
            type="number"
            placeholder="Max $"
            value={maxPriceParam}
            onChange={(e) => updateParam('maxPrice', e.target.value)}
            className="w-1/2 bg-white border border-[#E8E6E1] px-3 py-1.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
          />
        </div>
      </div>

      {/* Availability Filter */}
      <div className="pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer text-xs uppercase tracking-wider text-[#141414]">
          <input
            type="checkbox"
            checked={inStockParam}
            onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
            className="w-4 h-4 accent-[#141414] cursor-pointer"
          />
          <span>{t.inStockOnly || 'In Stock Only'}</span>
        </label>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetAllFilters}
          className="w-full py-2.5 border border-[#141414] text-[#141414] text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 hover:bg-[#141414] hover:text-[#FAF9F5] transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{t.resetFilters || 'Reset All Filters'}</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Header & Page Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold">
          Ready-to-Wear Atelier
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#141414] font-normal mt-1 uppercase tracking-wide">
          {t.collectionTitle || 'THE COLLECTION'}
        </h1>
        <p className="text-xs sm:text-sm text-[#787570] font-light mt-2 max-w-lg mx-auto">
          Impeccably tailored garments, natural noble fibers, and minimalist proportions designed for enduring permanence.
        </p>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="border-y border-[#E8E6E1] py-4 mb-10 flex flex-wrap items-center justify-between gap-4">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[#E8E6E1] bg-white text-xs uppercase tracking-wider font-semibold text-[#141414]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t.refineCatalog || 'Filters'} {hasActiveFilters && '• Active'}</span>
        </button>

        {/* Total Results Count */}
        <div className="text-xs uppercase tracking-widest text-[#787570]">
          {t.showing || 'Showing'} <span className="font-semibold text-[#141414]">{products.length}</span> {t.pieces || 'Pieces'}
          {hasActiveFilters && (
            <button
              onClick={resetAllFilters}
              className="ml-3 text-[#C2A676] underline hover:text-[#141414] font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-widest text-[#787570] hidden sm:inline">
            {t.sortBy || 'Sort By'}:
          </span>
          <div className="relative">
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="appearance-none bg-white border border-[#E8E6E1] px-4 py-2 pr-9 text-xs uppercase tracking-wider font-medium text-[#141414] focus:outline-none cursor-pointer"
            >
              <option value="featured">{t.featured || 'Featured Curations'}</option>
              <option value="newest">{t.newest || 'Newest Releases'}</option>
              <option value="price-asc">{t.priceLowHigh || 'Price: Low to High'}</option>
              <option value="price-desc">{t.priceHighLow || 'Price: High to Low'}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#787570] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-3 pr-6 border-r border-[#E8E6E1]">
          <div className="sticky top-28">
            <FilterContent />
          </div>
        </aside>

        {/* Products Grid Area */}
        <div className="lg:col-span-9">
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : products.length === 0 ? (
            <div className="py-24 text-center border border-dashed border-[#E8E6E1] bg-white p-8">
              <h3 className="font-serif text-2xl text-[#141414] mb-2">No matching silhouettes found</h3>
              <p className="text-xs text-[#787570] max-w-sm mx-auto mb-6">
                Try widening your price range, clearing specific sizes, or resetting your active filters.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-6 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2A2A2A] transition-colors"
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
            className="fixed inset-0 bg-[#141414]/50 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-[#FAF9F5] shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E8E6E1] mb-6">
                <h3 className="font-serif text-lg uppercase tracking-wider text-[#141414]">Refine Catalog</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-[#787570]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterContent />
            </div>

            <div className="pt-8 border-t border-[#E8E6E1] mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold"
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
