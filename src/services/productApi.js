import api from './api';
import { mockProducts, mockCategories } from '../data/mockProducts';

export const productApi = {
  // Fetch all products with filter, search, sort, pagination
  getProducts: async (params = {}) => {
    try {
      const res = await api.get('/products', { params });
      return res.data;
    } catch (err) {
      console.warn('API error or server offline, using local fallback dataset:', err.message);
      // Client-side filtering fallback for instant responsiveness
      let filtered = [...mockProducts];
      
      if (params.category && params.category !== 'all') {
        filtered = filtered.filter(p => p.category_id === params.category || p.categoryName?.toLowerCase().includes(params.category.toLowerCase()));
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(q) || 
          p.description.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q)
        );
      }
      if (params.minPrice) {
        filtered = filtered.filter(p => (p.sale_price || p.base_price) >= Number(params.minPrice));
      }
      if (params.maxPrice) {
        filtered = filtered.filter(p => (p.sale_price || p.base_price) <= Number(params.maxPrice));
      }
      if (params.size) {
        filtered = filtered.filter(p => p.variants?.some(v => v.size.toLowerCase() === params.size.toLowerCase()));
      }
      if (params.color) {
        filtered = filtered.filter(p => p.variants?.some(v => v.color.toLowerCase().includes(params.color.toLowerCase())));
      }
      if (params.inStock === 'true' || params.inStock === true) {
        filtered = filtered.filter(p => p.variants?.some(v => v.stock_quantity > 0));
      }

      // Sorting
      if (params.sort === 'price-asc') {
        filtered.sort((a, b) => (a.sale_price || a.base_price) - (b.sale_price || b.base_price));
      } else if (params.sort === 'price-desc') {
        filtered.sort((a, b) => (b.sale_price || b.base_price) - (a.sale_price || a.base_price));
      } else if (params.sort === 'newest') {
        // preserve or reverse
        filtered.reverse();
      }

      return {
        products: filtered,
        total: filtered.length,
        page: Number(params.page) || 1,
        limit: Number(params.limit) || 12,
        totalPages: Math.ceil(filtered.length / (Number(params.limit) || 12))
      };
    }
  },

  // Fetch single product by slug or id
  getProductBySlug: async (slug) => {
    try {
      const res = await api.get(`/products/${slug}`);
      return res.data;
    } catch (err) {
      console.warn('API error or server offline, using local fallback:', err.message);
      const found = mockProducts.find(p => p.slug === slug || p.id === slug);
      if (found) return found;
      throw new Error('Product not found');
    }
  },

  // Fetch categories
  getCategories: async () => {
    try {
      const res = await api.get('/categories');
      return res.data;
    } catch (err) {
      return mockCategories;
    }
  }
};
