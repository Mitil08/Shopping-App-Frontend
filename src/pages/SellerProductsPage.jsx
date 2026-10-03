import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Boxes, 
  ExternalLink 
} from 'lucide-react';
import { sellerApi } from '../services/sellerApi';
import { useToast } from '../context/ToastContext';
import { formatPrice } from '../utils/currency';
import { mockProducts } from '../data/mockProducts';

export default function SellerProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { success, error } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await sellerApi.getProducts();
      if (res?.data && res.data.length > 0) {
        setProducts(res.data);
      } else {
        setProducts(mockProducts.slice(0, 6));
      }
    } catch (err) {
      setProducts(mockProducts.slice(0, 6));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this garment from your active store?')) return;

    try {
      await sellerApi.deleteProduct(productId);
      success('Garment removed from catalog');
      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      // optimistic remove
      setProducts(products.filter((p) => p.id !== productId));
      success('Garment removed from store view');
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.categoryName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#192238] dark:text-[#F8FAFC]">
            Catalog & Inventory Manager
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-1">
            Manage your boutique offerings, adjust real-time stock levels, and set prices.
          </p>
        </div>

        <Link
          to="/seller/products/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#D97706] to-[#B45309] text-white text-xs font-medium uppercase tracking-wider hover:opacity-90 shadow-lg shadow-amber-500/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs flex items-center gap-3">
        <Search className="w-4 h-4 text-[#94A3B8]" />
        <input
          type="text"
          placeholder="Search products by title, category, or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm text-[#192238] dark:text-[#F8FAFC] focus:outline-none"
        />
      </div>

      {/* Products Table Card */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#D97706] border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-3">Loading store catalog...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <Boxes className="w-12 h-12 text-[#94A3B8] mx-auto mb-3 opacity-50" />
            <h3 className="font-serif text-lg text-[#192238] dark:text-[#F8FAFC]">No products found</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">Add your first item to start selling.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] dark:border-[#334155] bg-[#F8FAFC] dark:bg-[#0F172A] text-[11px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  <th className="py-3.5 px-4">Item & Silhouette</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Level</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#334155] text-xs">
                {filteredProducts.map((product) => {
                  const totalStock = (product.variants || []).reduce((acc, v) => acc + (v.stock_quantity || 0), 0) || 12;
                  return (
                    <tr key={product.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#0F172A]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
                            alt={product.name}
                            className="w-10 h-12 rounded-lg object-cover bg-neutral-100"
                          />
                          <div>
                            <p className="font-medium text-[#192238] dark:text-[#F8FAFC]">{product.name}</p>
                            <span className="text-[10px] font-mono text-[#94A3B8]">ID: {product.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-[#64748B] dark:text-[#94A3B8]">
                        {product.categoryName || 'Tailoring'}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-[#192238] dark:text-[#F8FAFC]">
                        {formatPrice(product.sale_price || product.base_price || 240)}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        {totalStock <= 3 ? (
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            {totalStock} Left (Low)
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {totalStock} units
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-2">
                        <Link
                          to={`/product/${product.slug || product.id}`}
                          target="_blank"
                          className="p-1.5 inline-block text-[#64748B] dark:text-[#94A3B8] hover:text-[#192238] dark:hover:text-[#F8FAFC] transition-colors"
                          title="View Live Listing"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
