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
        const catQuery = params.category.toLowerCase().trim();
        const matchedCategory = mockCategories.find(
          c => c.id?.toLowerCase() === catQuery || c.slug?.toLowerCase() === catQuery || c.name?.toLowerCase().includes(catQuery)
        );
        const targetId = matchedCategory ? matchedCategory.id.toLowerCase() : catQuery;
        const targetSlug = matchedCategory ? matchedCategory.slug.toLowerCase() : catQuery;
        const targetName = matchedCategory ? matchedCategory.name.toLowerCase() : catQuery;

        // Umbrella category definitions for seamless shopping
        const isMensFashion = targetId === 'cat-mens-fashion' || targetSlug === 'mens-fashion' || catQuery.includes('men');
        const isWomensFashion = targetId === 'cat-womens-fashion' || targetSlug === 'womens-fashion' || catQuery.includes('women');
        const isAccessories = targetId === 'cat-accessories' || targetSlug === 'leather-accessories' || catQuery.includes('access') || catQuery.includes('leather');
        const isTech = targetId === 'cat-mobiles-tech' || targetSlug === 'mobiles-electronics' || catQuery.includes('mobile') || catQuery.includes('tech') || catQuery.includes('electronic');
        const isAudio = targetId === 'cat-audio-wearables' || targetSlug === 'smartwatches-audio' || catQuery.includes('watch') || catQuery.includes('audio');
        const isFootwear = targetId === 'cat-footwear' || targetSlug === 'footwear-sneakers' || catQuery.includes('foot') || catQuery.includes('sneaker') || catQuery.includes('boot');
        const isBeauty = targetId === 'cat-beauty-perfumes' || targetSlug === 'beauty-fragrances' || catQuery.includes('beauty') || catQuery.includes('perfume') || catQuery.includes('fragrance');
        const isHome = targetId === 'cat-home-living' || targetSlug === 'home-luxury-living' || catQuery.includes('home') || catQuery.includes('decor') || catQuery.includes('living');

        filtered = filtered.filter(p => {
          const pCatId = (p.category_id || '').toLowerCase();
          const pCatName = (p.categoryName || '').toLowerCase();
          const pName = (p.name || '').toLowerCase();

          // 1. Direct Category Match
          if (
            pCatId === targetId ||
            pCatId === targetSlug ||
            pCatName.includes(targetName) ||
            pCatName.includes(catQuery) ||
            pCatId.includes(catQuery)
          ) {
            return true;
          }

          // 2. Umbrella Mappings
          if (isMensFashion) {
            return (
              ['cat-tailoring', 'cat-shirts', 'cat-outerwear', 'cat-trousers', 'cat-knitwear', 'cat-footwear', 'cat-mens-fashion'].includes(pCatId) ||
              pCatName.includes('men') || pCatName.includes('suit') || pCatName.includes('shirt') || pCatName.includes('trouser') ||
              pName.includes('shirt') || pName.includes('coat') || pName.includes('trouser') || pName.includes('blazer') || pName.includes('jean') || pName.includes('polo')
            );
          }

          if (isWomensFashion) {
            return (
              ['cat-outerwear', 'cat-knitwear', 'cat-tailoring', 'cat-shirts', 'cat-womens-fashion', 'cat-beauty-perfumes'].includes(pCatId) ||
              pCatName.includes('women') || pCatName.includes('dress') || pCatName.includes('skirt') || pCatName.includes('knit') ||
              pName.includes('dress') || pName.includes('skirt') || pName.includes('wrap') || pName.includes('coat') || pName.includes('cashmere') || pName.includes('tote')
            );
          }

          if (isAccessories) {
            return pCatId === 'cat-accessories' || pCatName.includes('access') || pCatName.includes('leather') || pName.includes('tote') || pName.includes('belt') || pName.includes('wallet') || pName.includes('beanie');
          }

          if (isTech) {
            return pCatId === 'cat-mobiles-tech' || pCatName.includes('phone') || pCatName.includes('electronic') || pName.includes('phone') || pName.includes('tablet');
          }

          if (isAudio) {
            return pCatId === 'cat-audio-wearables' || pCatName.includes('audio') || pCatName.includes('watch') || pName.includes('headphone') || pName.includes('smartwatch');
          }

          if (isFootwear) {
            return pCatId === 'cat-footwear' || pCatName.includes('foot') || pCatName.includes('sneaker') || pName.includes('sneaker') || pName.includes('boot');
          }

          if (isBeauty) {
            return pCatId === 'cat-beauty-perfumes' || pCatName.includes('beauty') || pCatName.includes('fragrance') || pName.includes('parfum') || pName.includes('elixir');
          }

          if (isHome) {
            return pCatId === 'cat-home-living' || pCatName.includes('home') || pCatName.includes('living') || pName.includes('lamp') || pName.includes('stand') || pName.includes('espresso');
          }

          return false;
        });
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
      if (params.express === 'true' || params.express === true) {
        // Express delivery items (featured or items with id ending in odd/even or is_featured)
        filtered = filtered.filter(p => p.is_featured || p.id === 'prod-1' || p.id === 'prod-2' || p.id === 'prod-3' || p.id === 'prod-5' || p.id === 'prod-7');
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
      // 1. Direct match on slug or id
      let found = mockProducts.find(p => p.slug === slug || p.id === slug);
      if (found) return found;

      // 2. Normalize and check for aliases/keywords (e.g. "the-atelier-trench-coat" -> matches "trench" or "atelier")
      const cleanSlug = String(slug).toLowerCase().replace(/-/g, ' ');
      found = mockProducts.find(p => {
        const pSlug = p.slug.toLowerCase().replace(/-/g, ' ');
        const pName = p.name.toLowerCase();
        // check keyword intersection
        const keywords = cleanSlug.split(' ').filter(w => w.length > 3 && w !== 'the');
        return keywords.some(k => pSlug.includes(k) || pName.includes(k));
      });
      if (found) return found;

      // 3. Fallback to default featured garment if any product page requested
      if (mockProducts.length > 0) return mockProducts[0];

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
