import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Check, Star } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { useToast } from '../context/ToastContext';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(() => {
    const custom = JSON.parse(localStorage.getItem('elane_admin_products') || '[]');
    return [...custom, ...mockProducts];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const { success } = useToast();

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.material?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you certain you wish to archive "${name}" from the active catalog?`)) {
      const remaining = products.filter((p) => p.id !== id);
      setProducts(remaining);
      const customOnly = remaining.filter((p) => p.id.startsWith('custom-'));
      localStorage.setItem('elane_admin_products', JSON.stringify(customOnly));
      success(`Archived "${name}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#787570] font-semibold">
            Catalog Management
          </span>
          <h1 className="font-serif text-3xl text-[#141414] font-normal uppercase mt-0.5">
            Products & Inventory ({products.length})
          </h1>
        </div>

        <Link
          to="/admin/products/new"
          className="px-5 py-2.5 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2A2A2A] transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Silhouette</span>
        </Link>
      </div>

      {/* Search Filter Toolbar */}
      <div className="bg-white border border-[#E8E6E1] p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-[#787570]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by silhouette name, fabric, or category..."
          className="w-full text-xs text-[#141414] focus:outline-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-xs uppercase tracking-wider text-[#787570] hover:text-[#141414]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white border border-[#E8E6E1] shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-[#E8E6E1] text-[10px] uppercase tracking-wider text-[#787570] bg-[#FAF9F5]">
            <tr>
              <th className="p-4 font-semibold">Product</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Base / Sale Price</th>
              <th className="p-4 font-semibold">Total Stock</th>
              <th className="p-4 font-semibold">Featured</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E6E1]">
            {filtered.map((prod) => {
              const totalStock = prod.variants?.reduce((acc, v) => acc + (v.stock_quantity || 0), 0) || 0;
              return (
                <tr key={prod.id} className="hover:bg-[#FAF9F5] transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={prod.images?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'}
                      alt={prod.name}
                      className="w-12 h-16 object-cover bg-[#F3F1EC]"
                    />
                    <div>
                      <h4 className="font-serif text-sm font-medium text-[#141414]">{prod.name}</h4>
                      <p className="text-[10px] text-[#787570] font-mono">{prod.id}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[#787570] uppercase tracking-wider text-[11px]">
                    {prod.categoryName || 'Ready-to-Wear'}
                  </td>
                  <td className="p-4 font-medium text-[#141414]">
                    {prod.sale_price ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-red-700">${prod.sale_price}</span>
                        <span className="text-[#A3A099] line-through">${prod.base_price}</span>
                      </div>
                    ) : (
                      <span>${prod.base_price}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        totalStock <= 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-[#F3F1EC] text-[#141414]'
                      }`}
                    >
                      {totalStock} units
                    </span>
                  </td>
                  <td className="p-4">
                    {prod.is_featured ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-[#C2A676]">
                        <Star className="w-3.5 h-3.5 fill-[#C2A676]" />
                        <span>Curated</span>
                      </span>
                    ) : (
                      <span className="text-[#A3A099] text-[10px] uppercase">Standard</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${prod.id}/edit`}
                        state={{ product: prod }}
                        className="p-1.5 text-[#787570] hover:text-[#141414] hover:bg-[#F3F1EC] transition-colors"
                        title="Edit Silhouette"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(prod.id, prod.name)}
                        className="p-1.5 text-[#787570] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Silhouette"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
