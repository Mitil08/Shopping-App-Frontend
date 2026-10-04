import React, { useState } from 'react';
import { X, Star, Sparkles, CheckCircle2, ShieldCheck, Award, UploadCloud } from 'lucide-react';
import { loyaltyApi } from '../services/loyaltyApi';
import { useToast } from '../context/ToastContext';

export default function ProductReviewModal({ isOpen, onClose, product, orderId, onReviewSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [comment, setComment] = useState('');
  const [fitFeedback, setFitFeedback] = useState('True to Size');
  const [customerName, setCustomerName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const { success, error } = useToast();

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      error('Please write a few words about the piece.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await loyaltyApi.submitReview({
        orderId: orderId || 'ORD-VERIFIED',
        productId: product.id,
        rating,
        headline: headline || 'Exceptional craftsmanship & luxurious drape',
        comment,
        fitFeedback,
        customerName: customerName || 'Valued Patron',
      });

      if (res.data?.success) {
        setSuccessData(res.data);
        success('✨ Verified review published! 500 Atelier Loyalty Points credited.');
        if (onReviewSubmitted) {
          onReviewSubmitted(res.data.review);
        }
      }
    } catch (err) {
      error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full border border-[#E8E6E1] shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#141414] text-[#FAF9F5] p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C2A676]" />
            <h3 className="font-serif text-sm tracking-wider uppercase">
              Commission Review &amp; Loyalty Reward
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#FAF9F5]/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {successData ? (
          <div className="p-8 text-center bg-[#FAF9F5] space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-xl uppercase tracking-wider text-[#141414]">
              Review Published Successfully
            </h3>
            <div className="bg-white border border-[#E8E6E1] p-4 rounded-xs shadow-2xs inline-block text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-[#787570]">Loyalty Reward Credited</span>
                <span className="px-2 py-0.5 bg-[#C2A676]/20 border border-[#C2A676]/50 text-[#8C6D2D] text-xs font-mono font-bold rounded-sm">
                  +500 Points
                </span>
              </div>
              <p className="text-xs text-[#555] mt-1.5 leading-relaxed">
                Your feedback has been verified and added to the master artisan archive. Your ₹500 reward credit is ready to redeem on your next commission.
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#141414] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2A2A2A] transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 bg-[#FAF9F5]">
            {/* Product Summary Banner */}
            <div className="flex items-center gap-3.5 pb-4 border-b border-[#E8E6E1] bg-white p-3 border rounded-xs">
              {product.images?.[0] && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-12 h-14 object-cover bg-[#F3F1EC]"
                />
              )}
              <div className="flex-1 min-w-0">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#787570] block">
                  {product.category || 'Atelier Garment'}
                </span>
                <h4 className="font-serif text-sm font-semibold text-[#141414] truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200 font-semibold uppercase tracking-wider">
                    Verified Acquisition
                  </span>
                  <span className="text-[10px] text-[#8C6D2D] font-bold">
                    ★ +500 Loyalty Points
                  </span>
                </div>
              </div>
            </div>

            {/* Star Rating Selector */}
            <div className="text-center py-2 bg-white border border-[#E8E6E1] p-3 rounded-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787570] block mb-1.5">
                Overall Craftsmanship &amp; Material Rating
              </span>
              <div className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= (hoverRating || rating)
                          ? 'fill-[#C2A676] text-[#C2A676]'
                          : 'text-[#D0CDBB]'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Fit Feedback Selector */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787570] block mb-1.5">
                Tailoring &amp; Silhouette Fit
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['Runs Small', 'True to Size', 'Runs Large'].map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => setFitFeedback(fit)}
                    className={`py-2 text-[11px] font-semibold uppercase tracking-wider border transition-colors ${
                      fitFeedback === fit
                        ? 'bg-[#141414] text-[#FAF9F5] border-[#141414]'
                        : 'bg-white text-[#787570] border-[#E8E6E1] hover:bg-[#F3F1EC]'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            {/* Review Headline & Comment */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787570] block mb-1">
                Headline Summary
              </span>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Exceptional virgin wool silhouette"
                className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787570] block mb-1">
                Your Review &amp; Material Impressions
              </span>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Share your thoughts on the stitching, drape, tactile feel, and unboxing experience..."
                className="w-full bg-white border border-[#E8E6E1] p-3 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            {/* Patron Name */}
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#787570] block mb-1">
                Public Patron Signature
              </span>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Alistair V. / Anonymous Patron"
                className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
              />
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex justify-between items-center border-t border-[#E8E6E1]">
              <span className="text-[11px] text-[#787570] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Purchase</span>
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-[#E8E6E1] text-xs font-semibold uppercase tracking-wider text-[#141414] hover:bg-[#F3F1EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#141414] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2A2A2A] transition-colors flex items-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>{submitting ? 'Publishing...' : 'Publish & Earn 500 Pts'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
