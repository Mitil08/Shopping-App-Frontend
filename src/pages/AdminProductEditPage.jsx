import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Check, Plus, Trash2 } from 'lucide-react';
import { mockCategories, mockProducts } from '../data/mockProducts';
import { useToast } from '../context/ToastContext';

export default function AdminProductEditPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { success } = useToast();

  const isEditing = Boolean(id);
  const initialProduct = location.state?.product || (id ? mockProducts.find((p) => p.id === id) : null);

  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    category_id: initialProduct?.category_id || 'cat-tailoring',
    base_price: initialProduct?.base_price || '',
    sale_price: initialProduct?.sale_price || '',
    material: initialProduct?.material || '',
    description: initialProduct?.description || '',
    care: initialProduct?.care || 'Dry clean only.',
    image1: initialProduct?.images?.[0] || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1000&q=80',
    image2: initialProduct?.images?.[1] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80',
    is_featured: initialProduct?.is_featured || false,
    variants: initialProduct?.variants || [
      { id: 'v1', size: 'S', color: 'Midnight Noir', colorHex: '#141414', stock_quantity: 12 },
      { id: 'v2', size: 'M', color: 'Midnight Noir', colorHex: '#141414', stock_quantity: 15 },
      { id: 'v3', size: 'L', color: 'Midnight Noir', colorHex: '#141414', stock_quantity: 8 },
    ],
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVariantStockChange = (index, value) => {
    const updated = [...formData.variants];
    updated[index].stock_quantity = parseInt(value, 10) || 0;
    setFormData((prev) => ({ ...prev, variants: updated }));
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: `var-${Date.now()}`,
          size: 'M',
          color: 'New Color',
          colorHex: '#8A7D70',
          stock_quantity: 10,
        },
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    const categoryObj = mockCategories.find((c) => c.id === formData.category_id);
    const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const savedProduct = {
      id: isEditing ? id : `custom-${Date.now()}`,
      name: formData.name,
      slug,
      category_id: formData.category_id,
      categoryName: categoryObj?.name || 'Ready-to-Wear',
      base_price: parseFloat(formData.base_price),
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      material: formData.material,
      description: formData.description,
      care: formData.care,
      images: [formData.image1, formData.image2].filter(Boolean),
      is_featured: formData.is_featured,
      is_active: true,
      variants: formData.variants,
      rating: 5.0,
      reviewsCount: 1,
    };

    // Save to local custom list for persistence
    const stored = JSON.parse(localStorage.getItem('elane_admin_products') || '[]');
    let updated;
    if (isEditing) {
      updated = stored.map((p) => (p.id === id ? savedProduct : p));
      if (!updated.some((p) => p.id === id)) updated.push(savedProduct);
    } else {
      updated = [savedProduct, ...stored];
    }
    localStorage.setItem('elane_admin_products', JSON.stringify(updated));

    setTimeout(() => {
      setSaving(false);
      success(isEditing ? 'Garment specifications updated successfully' : 'New garment published to catalog');
      navigate('/admin/products');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E8E6E1] pb-6">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#787570] hover:text-[#141414] mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
          <h1 className="font-serif text-3xl text-[#141414] font-normal uppercase">
            {isEditing ? `Edit: ${formData.name || 'Garment'}` : 'Introduce New Garment'}
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info Card */}
        <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-4 shadow-2xs">
          <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414] border-b border-[#E8E6E1] pb-3">
            Core Silhouette Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Sculpted Wool Car Coat"
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              >
                {mockCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Base Price ($ USD) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                name="base_price"
                value={formData.base_price}
                onChange={handleChange}
                placeholder="490.00"
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Sale Price (Optional discount)
              </label>
              <input
                type="number"
                step="0.01"
                name="sale_price"
                value={formData.sale_price}
                onChange={handleChange}
                placeholder="Leave blank if regular price"
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
              Fabric Composition & Origin *
            </label>
            <input
              type="text"
              required
              name="material"
              value={formData.material}
              onChange={handleChange}
              placeholder="e.g. 100% Grade-A Mongolian Cashmere"
              className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
              Editorial Description *
            </label>
            <textarea
              rows={4}
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of silhouette, craftsmanship, tailoring details..."
              className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-wider text-[#141414] font-medium">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-4 h-4 accent-[#141414]"
              />
              <span>Feature prominently on Homepage & Seasonal curations</span>
            </label>
          </div>
        </div>

        {/* Imagery Card */}
        <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-4 shadow-2xs">
          <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414] border-b border-[#E8E6E1] pb-3">
            Editorial Photography Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Primary Image URL
              </label>
              <input
                type="url"
                required
                name="image1"
                value={formData.image1}
                onChange={handleChange}
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs font-mono text-[#141414] focus:outline-none"
              />
              {formData.image1 && (
                <img
                  src={formData.image1}
                  alt="Preview 1"
                  className="w-20 h-26 object-cover mt-2 bg-[#F3F1EC] border border-[#E8E6E1]"
                />
              )}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] font-medium mb-1">
                Secondary Image URL (Hover view)
              </label>
              <input
                type="url"
                name="image2"
                value={formData.image2}
                onChange={handleChange}
                className="w-full bg-[#FAF9F5] border border-[#E8E6E1] px-4 py-2.5 text-xs font-mono text-[#141414] focus:outline-none"
              />
              {formData.image2 && (
                <img
                  src={formData.image2}
                  alt="Preview 2"
                  className="w-20 h-26 object-cover mt-2 bg-[#F3F1EC] border border-[#E8E6E1]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Variants & Inventory Card */}
        <div className="bg-white border border-[#E8E6E1] p-6 lg:p-8 space-y-4 shadow-2xs">
          <div className="flex justify-between items-center border-b border-[#E8E6E1] pb-3">
            <h2 className="font-serif text-lg uppercase tracking-wider text-[#141414]">
              Sizes, Colors & Inventory Levels
            </h2>
            <button
              type="button"
              onClick={handleAddVariant}
              className="text-xs uppercase tracking-wider text-[#141414] hover:text-[#C2A676] font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Variant</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.variants.map((variant, index) => (
              <div
                key={variant.id || index}
                className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 bg-[#FAF9F5] border border-[#E8E6E1]"
              >
                <div className="w-24">
                  <label className="block text-[9px] uppercase tracking-wider text-[#787570] mb-0.5">
                    Size
                  </label>
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) => {
                      const updated = [...formData.variants];
                      updated[index].size = e.target.value;
                      setFormData((prev) => ({ ...prev, variants: updated }));
                    }}
                    className="w-full bg-white border border-[#E8E6E1] px-2 py-1.5 text-xs text-[#141414]"
                  />
                </div>

                <div className="flex-1 min-w-[120px]">
                  <label className="block text-[9px] uppercase tracking-wider text-[#787570] mb-0.5">
                    Color Name
                  </label>
                  <input
                    type="text"
                    value={variant.color}
                    onChange={(e) => {
                      const updated = [...formData.variants];
                      updated[index].color = e.target.value;
                      setFormData((prev) => ({ ...prev, variants: updated }));
                    }}
                    className="w-full bg-white border border-[#E8E6E1] px-2 py-1.5 text-xs text-[#141414]"
                  />
                </div>

                <div className="w-28">
                  <label className="block text-[9px] uppercase tracking-wider text-[#787570] mb-0.5">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={variant.stock_quantity}
                    onChange={(e) => handleVariantStockChange(index, e.target.value)}
                    className="w-full bg-white border border-[#E8E6E1] px-2 py-1.5 text-xs font-semibold text-[#141414]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="p-2 text-[#A3A099] hover:text-red-600 transition-colors mt-3"
                  title="Remove variant"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-4">
          <Link
            to="/admin/products"
            className="px-6 py-3 border border-[#141414] text-[#141414] text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-bold hover:bg-[#2A2A2A] transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Recording Garment...' : 'Publish Garment'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
