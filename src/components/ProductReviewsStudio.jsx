import React, { useState } from 'react';
import { Star, ShieldCheck, ThumbsUp, Camera, Sparkles, Filter, Check, X, User, Image as ImageIcon } from 'lucide-react';

export default function ProductReviewsStudio({ product, slug }) {
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | '5' | '4' | 'photos'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'highest'
  const [showModal, setShowModal] = useState(false);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [fit, setFit] = useState('True to size');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Local storage persisted user reviews
  const [userReviews, setUserReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(`elane_reviews_${slug}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Helpfulness counts map
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const defaultReviews = [
    {
      id: 'def-1',
      name: 'Kavita Sharma',
      city: 'Mumbai',
      date: '2 days ago',
      rating: 5,
      fit: 'True to size',
      title: 'Sublime Craftsmanship & Supreme Comfort',
      comment: 'Exceptional drape and hand-stitched finishing. The fabric feels substantially luxurious and arrived in under 24 hours in Mumbai in signature gold packaging.',
      verified: true,
      helpful: 14,
      photos: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80'],
    },
    {
      id: 'def-2',
      name: 'Aditya Rao',
      city: 'Bengaluru',
      date: '1 week ago',
      rating: 5,
      fit: 'True to size',
      title: 'A True Masterpiece of Indian Heritage Couture',
      comment: 'The silhouette aligns perfectly with my expectations. Wore it to a gala event and received countless compliments.',
      verified: true,
      helpful: 9,
      photos: [],
    },
    {
      id: 'def-3',
      name: 'Elena Rostova',
      city: 'London, UK',
      date: '2 weeks ago',
      rating: 4,
      fit: 'Slightly tailored',
      title: 'Worldwide Express Delivery to London was Flawless',
      comment: 'International customs was handled automatically. The embroidery work is breathtaking.',
      verified: true,
      helpful: 21,
      photos: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80'],
    },
  ];

  const allReviews = [...userReviews, ...defaultReviews];

  const handleHelpful = (id) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!name || !title || !comment) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newRev = {
        id: `rev-${Date.now()}`,
        name,
        city: city || 'Valued Clientele',
        date: 'Just now',
        rating,
        fit,
        title,
        comment,
        verified: true,
        helpful: 0,
        photos: photoPreview ? [photoPreview] : [],
      };

      const updated = [newRev, ...userReviews];
      setUserReviews(updated);
      try {
        localStorage.setItem(`elane_reviews_${slug}`, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }

      setIsSubmitting(false);
      setShowModal(false);
      // Reset form
      setName('');
      setCity('');
      setTitle('');
      setComment('');
      setPhotoPreview(null);
    }, 600);
  };

  // Filtering
  const filteredReviews = allReviews.filter((r) => {
    if (activeFilter === '5') return r.rating === 5;
    if (activeFilter === '4') return r.rating === 4;
    if (activeFilter === 'photos') return r.photos && r.photos.length > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Rating Breakdown Card */}
      <div className="p-6 bg-[#FAF8F5] dark:bg-[#162038] border border-[#E2E8F0] dark:border-[#1E293B] rounded-2xl flex flex-col md:flex-row items-center gap-8 shadow-xs">
        
        {/* Left Score Box */}
        <div className="text-center md:border-r md:border-[#E2E8F0] dark:md:border-[#1E293B] md:pr-8 shrink-0">
          <div className="text-4xl font-serif font-bold text-[#1E293B] dark:text-white">
            {product?.rating || 4.9}
          </div>
          <div className="flex items-center justify-center gap-1 text-amber-400 my-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium uppercase tracking-wider block">
            {allReviews.length} Verified Reviews
          </span>
          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            100% Verified Buyers
          </span>
        </div>

        {/* Middle Distribution Bars */}
        <div className="flex-1 w-full space-y-2">
          {[
            { label: '5 Stars', count: '88%', width: '88%' },
            { label: '4 Stars', count: '10%', width: '10%' },
            { label: '3 Stars', count: '2%', width: '2%' },
            { label: '2 Stars', count: '0%', width: '0%' },
            { label: '1 Star', count: '0%', width: '0%' },
          ].map((bar, i) => (
            <div key={i} className="flex items-center gap-3 text-xs">
              <span className="w-14 text-[#64748B] dark:text-[#94A3B8] font-medium">{bar.label}</span>
              <div className="flex-1 h-2 bg-[#E2E8F0] dark:bg-[#1E293B] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-[#C2A676] rounded-full transition-all duration-500"
                  style={{ width: bar.width }}
                />
              </div>
              <span className="w-8 text-right font-mono text-xs text-[#64748B] dark:text-[#94A3B8]">{bar.count}</span>
            </div>
          ))}
        </div>

        {/* Right Fit Metric */}
        <div className="text-center md:border-l md:border-[#E2E8F0] dark:md:border-[#1E293B] md:pl-8 shrink-0 space-y-1">
          <span className="text-xs uppercase font-bold tracking-wider text-[#64748B] dark:text-[#94A3B8]">Fit Accuracy</span>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">96% True to Size</p>
          <p className="text-[11px] text-[#94A3B8]">Based on Atelier tailoring data</p>
        </div>
      </div>

      {/* Filter & Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-[#1E293B] pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#C2A676]" />
            Filter:
          </span>
          {[
            { id: 'all', label: 'All Reviews' },
            { id: '5', label: '5★ Ratings' },
            { id: '4', label: '4★ Ratings' },
            { id: 'photos', label: 'With Photos 📸' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#1E40AF] text-white shadow-xs'
                  : 'bg-[#FAF8F5] dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E293B] dark:hover:text-white border border-[#E2E8F0] dark:border-[#334155]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-sheen btn-sapphire-glow w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white text-xs uppercase tracking-wider font-semibold rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#C2A676]" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF8F5] dark:bg-[#162038] rounded-xl border text-xs text-[#64748B]">
            No reviews match the selected filter. Be the first to share your feedback!
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] rounded-xl space-y-3 shadow-xs hover:border-[#C2A676]/40 transition-colors"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E40AF] to-[#C2A676] p-0.5">
                    <div className="w-full h-full rounded-full bg-[#162038] flex items-center justify-center text-white text-xs font-bold uppercase">
                      {rev.name.slice(0, 2)}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1E293B] dark:text-white">{rev.name}</span>
                      {rev.verified && (
                        <span className="px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                      {rev.city} • {rev.date}
                    </p>
                  </div>
                </div>

                {/* Rating & Fit Badge */}
                <div className="text-right">
                  <div className="flex items-center gap-0.5 justify-end text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium block mt-1">
                    Fit: <strong className="text-[#1E293B] dark:text-white">{rev.fit}</strong>
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <h4 className="font-serif font-semibold text-sm text-[#1E293B] dark:text-white">{rev.title}</h4>
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">{rev.comment}</p>

              {/* Photo Gallery if present */}
              {rev.photos && rev.photos.length > 0 && (
                <div className="flex items-center gap-2 pt-1">
                  {rev.photos.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="Customer upload"
                      className="w-16 h-16 object-cover rounded-lg border border-[#CBD5E1] dark:border-[#334155] hover:scale-105 transition-transform cursor-pointer"
                    />
                  ))}
                </div>
              )}

              {/* Helpfulness Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] dark:border-[#334155]/60 text-xs text-[#64748B] dark:text-[#94A3B8]">
                <span>Was this review helpful?</span>
                <button
                  onClick={() => handleHelpful(rev.id)}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] dark:bg-[#162038] hover:bg-blue-50 dark:hover:bg-[#2563EB]/20 border border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold flex items-center gap-1.5 transition-colors text-[#1E293B] dark:text-white"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>Helpful ({rev.helpful + (helpfulVotes[rev.id] || 0)})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Write a Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-2xl border border-[#C2A676]/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#17213C] via-[#1E293B] to-[#17213C] text-white border-b border-[#C2A676]/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#C2A676]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">Share Your Atelier Experience</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitReview} className="p-6 overflow-y-auto space-y-4 text-xs">
              
              {/* Star Selection */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                  Overall Rating *
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-hidden"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 font-bold text-sm text-[#1E293B] dark:text-white">{rating} / 5 Stars</span>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ananya Roy"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#162038] border border-[#CBD5E1] dark:border-[#334155] rounded-lg text-xs text-[#1E293B] dark:text-white focus:outline-hidden focus:border-[#1E40AF]"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                    City / Country
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. New Delhi"
                    className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#162038] border border-[#CBD5E1] dark:border-[#334155] rounded-lg text-xs text-[#1E293B] dark:text-white focus:outline-hidden focus:border-[#1E40AF]"
                  />
                </div>
              </div>

              {/* Fit Scale Selector */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                  Garment Fit Assessment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Runs small', 'True to size', 'Runs large'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFit(opt)}
                      className={`py-2 px-2 rounded-lg text-[11px] font-semibold transition-all ${
                        fit === opt
                          ? 'bg-[#1E40AF] text-white border-transparent shadow-xs'
                          : 'bg-[#FAF8F5] dark:bg-[#162038] text-[#64748B] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#334155]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Exquisite tailoring & unmatched comfort"
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#162038] border border-[#CBD5E1] dark:border-[#334155] rounded-lg text-xs text-[#1E293B] dark:text-white focus:outline-hidden focus:border-[#1E40AF]"
                />
              </div>

              {/* Text */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                  Detailed Feedback *
                </label>
                <textarea
                  rows="3"
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us about the fabric texture, fit, drape, and delivery experience..."
                  className="w-full px-3 py-2 bg-[#FAF8F5] dark:bg-[#162038] border border-[#CBD5E1] dark:border-[#334155] rounded-lg text-xs text-[#1E293B] dark:text-white focus:outline-hidden focus:border-[#1E40AF]"
                />
              </div>

              {/* Simulated Photo Attachment */}
              <div>
                <label className="block font-semibold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] mb-1">
                  Attach Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-2 bg-[#FAF8F5] dark:bg-[#162038] hover:bg-gray-100 dark:hover:bg-[#283548] border border-[#CBD5E1] dark:border-[#334155] rounded-lg text-xs font-semibold text-[#1E293B] dark:text-white flex items-center gap-2 transition-colors">
                    <Camera className="w-4 h-4 text-[#C2A676]" />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                  </label>
                  {photoPreview && (
                    <div className="relative">
                      <img src={photoPreview} alt="Preview" className="w-10 h-10 object-cover rounded-md border" />
                      <button
                        type="button"
                        onClick={() => setPhotoPreview(null)}
                        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-sheen btn-sapphire-glow w-full py-3 bg-gradient-to-r from-[#1E40AF] to-[#2563EB] hover:from-[#1D4ED8] hover:to-[#3B82F6] text-white text-xs uppercase tracking-widest font-bold rounded-xl shadow-md transition-all active:scale-95 mt-2"
              >
                {isSubmitting ? 'Publishing Review...' : 'Publish Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
