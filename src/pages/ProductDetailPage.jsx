import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, Plus, Minus, ShieldCheck, Truck, RotateCcw, Sparkles, ChevronRight, Check, Zap, Star, MapPin, Clock, ThumbsUp, X, Bell, Crown } from 'lucide-react';
import { productApi } from '../services/productApi';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import VirtualFittingModal from '../components/VirtualFittingModal';
import MonogramStudioModal from '../components/MonogramStudioModal';
import Interactive3DProductViewer from '../components/Interactive3DProductViewer';
import VaultHoldBar from '../components/VaultHoldBar';
import GroupGiftModal from '../components/GroupGiftModal';
import SpatialSoundscapePlayer from '../components/SpatialSoundscapePlayer';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'materials' | 'shipping' | 'reviews'
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  // Amazon-grade Pincode Delivery Estimator
  const [pincode, setPincode] = useState(() => localStorage.getItem('elane_pincode') || '');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [deliveryEstimate, setDeliveryEstimate] = useState(null);

  // Amazon-grade Frequently Bought Together Bundle States
  const [includeBundleItem, setIncludeBundleItem] = useState(true);
  const [bundleAdding, setBundleAdding] = useState(false);
  const [bundleSuccess, setBundleSuccess] = useState(false);

  // Amazon-grade Review Submission States
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newReviewerName, setNewReviewerName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newReviewFit, setNewReviewFit] = useState('True to size'); // 'Runs small' | 'True to size' | 'Runs large'
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReviews, setUserReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(`elane_reviews_${slug}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Amazon-grade Price Drop & Restock Alert States
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertType, setAlertType] = useState('price_drop'); // 'price_drop' | 'restock'
  const [alertEmail, setAlertEmail] = useState('');
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertSubmitted, setAlertSubmitted] = useState(false);

  // 3D Virtual Fitting Atelier Modal State
  const [showFittingModal, setShowFittingModal] = useState(false);

  // Bespoke Monogramming & Foil Debossing Studio State
  const [showMonogramModal, setShowMonogramModal] = useState(false);
  const [appliedMonogram, setAppliedMonogram] = useState(null);

  // Luxury 3D WebGL Product Inspector & Group Gifting States
  const [show3DViewer, setShow3DViewer] = useState(false);
  const [showGiftModal, setShowGiftModal] = useState(false);

  // Amazon-grade Lightning Deal Countdown Timer State
  const [dealTimeLeft, setDealTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setDealTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadProduct = async () => {
      try {
        const data = await productApi.getProductBySlug(slug);
        if (isMounted) {
          setProduct(data);
          setActiveImageIndex(0);
          if (data.variants && data.variants.length > 0) {
            setSelectedVariant(data.variants[0]);
          }
          setQuantity(1);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 aspect-[3/4] bg-[#EAE8E2]" />
          <div className="lg:col-span-5 space-y-6">
            <div className="h-4 bg-[#EAE8E2] w-1/4" />
            <div className="h-10 bg-[#EAE8E2] w-3/4" />
            <div className="h-6 bg-[#EAE8E2] w-1/3" />
            <div className="h-24 bg-[#EAE8E2] w-full" />
            <div className="h-14 bg-[#EAE8E2] w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="font-serif text-3xl text-[#141414] mb-3">Product not found</h2>
        <p className="text-xs text-[#787570] mb-6">
          The requested product may have been archived or is no longer available.
        </p>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold inline-block"
        >
          Return to Collection
        </Link>
      </div>
    );
  }

  const isLiked = isInWishlist(product.id);
  const images = product.images || [];
  const currentImage = images[activeImageIndex] || images[0];

  // Group variants by unique color and size
  const colors = Array.from(
    new Map(product.variants?.map((v) => [v.color, { color: v.color, colorHex: v.colorHex }])).values()
  );

  const availableSizesForColor = product.variants?.filter(
    (v) => !selectedVariant || v.color === selectedVariant.color
  ) || [];

  const handleColorChange = (colorName) => {
    const matched = product.variants?.find((v) => v.color === colorName);
    if (matched) setSelectedVariant(matched);
  };

  const handleSizeChange = (variant) => {
    setSelectedVariant(variant);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    setAddingToCart(true);
    await addToCart(product, selectedVariant, quantity, true, appliedMonogram);
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant || selectedVariant.stock_quantity === 0) return;
    setBuyingNow(true);
    // Add item directly without showing drawer, then navigate to checkout
    await addToCart(product, selectedVariant, quantity, false, appliedMonogram);
    setBuyingNow(false);
    navigate('/checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length !== 6 || isNaN(Number(pincode))) {
      alert('Please enter a valid 6-digit Indian PIN code.');
      return;
    }
    setPincodeLoading(true);
    setTimeout(() => {
      localStorage.setItem('elane_pincode', pincode);
      const isMetro = ['11', '40', '56', '70', '60', '50'].some((prefix) => pincode.startsWith(prefix));
      const today = new Date();
      const deliveryDays = isMetro ? 1 : 3;
      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + deliveryDays);

      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      const formattedDate = deliveryDate.toLocaleDateString('en-IN', options);

      setDeliveryEstimate({
        date: formattedDate,
        isExpress: isMetro,
        fastestHours: isMetro ? 24 : 48,
        codAvailable: true,
      });
      setPincodeChecked(true);
      setPincodeLoading(false);
    }, 400);
  };

  const relatedProducts = mockProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  // Amazon-grade Comparison Products Matrix Candidates (Current item + 2 comparable pieces)
  const comparisonCandidates = mockProducts
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.is_featured))
    .slice(0, 2);
  const compareGarments = [product, ...comparisonCandidates];

  // Amazon-grade "Frequently Bought Together" Bundle Selection
  const bundleCandidate = mockProducts.find(
    (p) => p.id !== product.id && (p.category_id === 'cat-accessories' || p.category_id === 'cat-trousers' || p.category_id !== product.category_id)
  ) || relatedProducts[0] || null;

  const mainPrice = Number(product.sale_price || product.base_price);
  const bundlePrice = bundleCandidate ? Number(bundleCandidate.sale_price || bundleCandidate.base_price) : 0;
  const rawBundleTotal = mainPrice + (includeBundleItem && bundleCandidate ? bundlePrice : 0);
  const bundleDiscount = includeBundleItem && bundleCandidate ? Math.round(rawBundleTotal * 0.1) : 0;
  const finalBundleTotal = rawBundleTotal - bundleDiscount;

  const handleAddBundleToCart = async () => {
    if (!selectedVariant) return;
    setBundleAdding(true);
    // 1. Add current main product
    await addToCart(product, selectedVariant, 1, false);
    // 2. Add companion product if selected
    if (includeBundleItem && bundleCandidate) {
      const bundleVariant = bundleCandidate.variants?.[0] || { id: `var-${bundleCandidate.id}-default`, size: 'Standard', color: 'Default' };
      await addToCart(bundleCandidate, bundleVariant, 1, true);
    }
    setBundleAdding(false);
    setBundleSuccess(true);
    setTimeout(() => setBundleSuccess(false), 3000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReviewerName.trim() || !newReviewText.trim()) return;
    setSubmittingReview(true);

    const reviewObj = {
      id: `rev-${Date.now()}`,
      name: newReviewerName.trim(),
      city: newCity.trim() || 'Verified Clientele',
      rating: newRating,
      fit: newReviewFit,
      title: newReviewTitle.trim() || 'Exceptional Quality',
      text: newReviewText.trim(),
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    const updated = [reviewObj, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem(`elane_reviews_${slug}`, JSON.stringify(updated));
    } catch (err) {
      // ignore
    }

    setSubmittingReview(false);
    setShowReviewModal(false);
    setNewReviewTitle('');
    setNewReviewText('');
    setNewCity('');
  };

  const handleAlertSubmit = (e) => {
    e.preventDefault();
    if (!alertEmail.trim()) return;
    setAlertSubmitted(true);

    try {
      const existingAlerts = JSON.parse(localStorage.getItem('elane_alerts') || '[]');
      existingAlerts.push({
        id: `alert-${Date.now()}`,
        productSlug: slug,
        productName: product?.name,
        type: alertType,
        email: alertEmail.trim(),
        targetPrice: alertTargetPrice || (product?.sale_price || product?.base_price),
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem('elane_alerts', JSON.stringify(existingAlerts));
    } catch (err) {
      // ignore
    }

    setTimeout(() => {
      setShowAlertModal(false);
      setAlertSubmitted(false);
      setAlertEmail('');
      setAlertTargetPrice('');
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-[11px] uppercase tracking-[0.2em] text-[#787570] mb-8">
        <Link to="/" className="hover:text-[#141414] transition-colors">Home</Link>
        <ChevronRight className="w-3 h-3 text-[#A3A099]" />
        <Link to="/shop" className="hover:text-[#141414] transition-colors">Shop</Link>
        <ChevronRight className="w-3 h-3 text-[#A3A099]" />
        <Link to={`/shop?category=${product.category_id}`} className="hover:text-[#141414] transition-colors">
          {product.categoryName}
        </Link>
        <ChevronRight className="w-3 h-3 text-[#A3A099]" />
        <span className="text-[#141414] font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Gallery + Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* LEFT: Large Image Gallery with Thumbnails */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-20 sm:w-20 sm:h-26 bg-[#F3F1EC] shrink-0 overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#141414]' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Active Large Image Display with Subtle Zoom Effect or 3D WebGL Inspector */}
          <div className="flex-1 relative aspect-[3/4] bg-[#F3F1EC] dark:bg-[#13111C] overflow-hidden group rounded-xl">
            {show3DViewer ? (
              <Interactive3DProductViewer product={product} onClose={() => setShow3DViewer(false)} />
            ) : (
              <>
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {product.sale_price && (
                  <div className="absolute top-4 left-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase font-bold tracking-widest px-3 py-1">
                    SALE
                  </div>
                )}
                {/* 3D Model Launcher Pill */}
                <button
                  onClick={() => setShow3DViewer(true)}
                  className="absolute bottom-4 right-4 px-3.5 py-2 rounded-full bg-black/70 hover:bg-black text-[#C2A676] text-[11px] uppercase tracking-widest font-semibold backdrop-blur-md border border-[#C2A676]/40 shadow-lg flex items-center gap-1.5 transition-all hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Inspect in 3D (360°)</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Product Details & Purchase Form */}
        <div className="lg:col-span-5 flex flex-col justify-start">
          <div className="border-b border-[#E8E6E1] pb-6 mb-6">
            <span className="text-xs uppercase tracking-[0.25em] text-[#787570] font-medium">
              {product.categoryName}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#141414] font-normal mt-1 leading-tight">
              {product.name}
            </h1>

            {/* Price display */}
            <div className="mt-3 flex items-baseline gap-3">
              {product.sale_price ? (
                <>
                  <span className="text-2xl font-serif text-[#141414]">{formatPrice(product.sale_price)}</span>
                  <span className="text-base text-[#787570] line-through">{formatPrice(product.base_price)}</span>
                  <span className="text-xs font-bold text-[#FAF9F5] bg-[#991B1B] px-2 py-0.5 tracking-wider uppercase">
                    Save {Math.round(((product.base_price - product.sale_price) / product.base_price) * 100)}%
                  </span>
                </>
              ) : (
                <span className="text-2xl font-serif text-[#141414]">{formatPrice(product.base_price)}</span>
              )}
              <span className="text-[11px] text-[#787570] uppercase tracking-wider ml-1">
                Taxes included
              </span>
            </div>

            {/* Amazon-style Lightning Deal Urgency Banner */}
            {product.sale_price && (
              <div className="mt-4 p-3.5 bg-[#FAF8F5] border border-[#B45309]/30 rounded-none shadow-xs">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9A3412]">
                    <Zap className="w-3.5 h-3.5 fill-[#EA580C] text-[#EA580C]" />
                    Lightning Deal
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#141414]">
                    <Clock className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>Ends in {String(dealTimeLeft.hours).padStart(2, '0')}h : {String(dealTimeLeft.minutes).padStart(2, '0')}m : {String(dealTimeLeft.seconds).padStart(2, '0')}s</span>
                  </div>
                </div>

                {/* Claimed Progress Bar */}
                <div className="w-full bg-[#E5E2DC] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#B45309] h-full rounded-full transition-all duration-500" style={{ width: '78%' }} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-[#787570] mt-1.5">
                  <span className="font-medium text-[#141414]">78% claimed</span>
                  <span>Limited atelier quantity available</span>
                </div>
              </div>
            )}

            {/* ÉLANE Privilege Next-Day Express Ribbon */}
            {(product.is_featured || product.id === 'prod-1' || product.id === 'prod-2' || product.id === 'prod-3' || product.id === 'prod-5' || product.id === 'prod-7') && (
              <div className="mt-3.5 inline-flex items-center gap-2 p-2 bg-[#FAF9F5] border border-[#141414] shadow-2xs">
                <span className="bg-[#141414] text-[#C2A676] px-2 py-0.5 uppercase tracking-wider font-mono text-[10px] font-bold flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-[#C2A676]" />
                  <span>Privilege</span>
                </span>
                <span className="text-xs text-[#141414] font-medium">
                  Guaranteed Next-Day Air Dispatch
                </span>
              </div>
            )}
          </div>

          {/* Description Short */}
          <p className="text-xs sm:text-sm text-[#63605A] font-light leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Color Selector */}
          {colors.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-2.5">
                <span className="font-semibold text-[#141414]">Color:</span>
                <span className="text-[#787570]">{selectedVariant?.color}</span>
              </div>
              <div className="flex gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.color}
                    onClick={() => handleColorChange(c.color)}
                    className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 flex items-center justify-center ${
                      selectedVariant?.color === c.color ? 'border-[#141414] scale-110' : 'border-transparent'
                    }`}
                    title={c.color}
                  >
                    <span
                      className="w-full h-full rounded-full border border-black/20 block"
                      style={{ backgroundColor: c.colorHex || '#141414' }}
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizesForColor.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs uppercase tracking-wider mb-2.5">
                <span className="font-semibold text-[#141414] dark:text-[#FAF9F5]">
                  {product.category_id === 'cat-mobiles-tech' ? 'Storage Capacity:' : product.category_id === 'cat-audio-wearables' ? 'Case Size / Spec:' : product.category_id === 'cat-beauty-perfumes' ? 'Flacon Volume:' : 'Select Size:'}
                </span>
                {['cat-outerwear', 'cat-shirts', 'cat-trousers', 'cat-knitwear', 'cat-tailoring', 'cat-footwear', 'cat-mens-fashion', 'cat-womens-fashion'].includes(product.category_id) && (
                  <button
                    type="button"
                    onClick={() => setShowFittingModal(true)}
                    className="inline-flex items-center gap-1.5 text-[#C2A676] hover:text-[#A88B5B] dark:hover:text-[#DFCA9F] text-xs font-semibold tracking-wider transition-colors group"
                  >
                    <Sparkles className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" />
                    <span className="underline decoration-dotted underline-offset-4">3D Virtual Fitting Room</span>
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {availableSizesForColor.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isLowStock = variant.stock_quantity > 0 && variant.stock_quantity <= 5;
                  const isOutOfStock = variant.stock_quantity === 0;

                  return (
                    <button
                      key={variant.id}
                      disabled={isOutOfStock}
                      onClick={() => handleSizeChange(variant)}
                      className={`py-3 text-xs tracking-wider uppercase border text-center transition-all ${
                        isOutOfStock
                          ? 'opacity-40 border-[#E8E6E1] bg-[#F3F1EC] cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-[#141414] bg-[#141414] text-[#FAF9F5] font-bold'
                          : 'border-[#E8E6E1] bg-white text-[#141414] hover:border-[#141414]'
                      }`}
                    >
                      {variant.size}
                      {isLowStock && <span className="block text-[9px] text-[#C2A676]">Low stock</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bespoke Monogramming & Foil Debossing Studio Option */}
          <div className="mb-6 p-4 bg-[#FAF8F5] dark:bg-[#161520] border border-[#C2A676]/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#141414] dark:bg-[#C2A676] text-[#C2A676] dark:text-[#141414] flex items-center justify-center shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs uppercase font-serif font-bold tracking-wider text-[#141414] dark:text-white">
                    Bespoke Monogramming Studio
                  </h4>
                  <span className="text-[9px] font-mono uppercase bg-[#C2A676]/20 text-[#A37B30] dark:text-[#E6CA65] px-1.5 py-0.5 font-semibold">
                    Complimentary (₹0)
                  </span>
                </div>
                {appliedMonogram ? (
                  <p className="text-[11px] text-[#2E7D32] dark:text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Debossed: <strong>"{appliedMonogram.text}"</strong> in {appliedMonogram.foilName}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-[#787570] dark:text-[#A3A099]">
                    Add your custom initials in 24K Gold Leaf, Palladium Silver, or Blind Heat Deboss
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowMonogramModal(true)}
              className="px-3.5 py-2 border border-[#141414] dark:border-[#C2A676] text-[11px] uppercase tracking-wider font-semibold text-[#141414] dark:text-[#FAF9F5] hover:bg-[#141414] hover:text-white dark:hover:bg-[#C2A676] dark:hover:text-[#141414] transition-all whitespace-nowrap self-start sm:self-auto"
            >
              {appliedMonogram ? 'Edit Monogram' : 'Customize Monogram'}
            </button>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-4 pt-2">
            {/* Spatial Soundscape Audio Player for Audio/Wearables/Sanctuary Products */}
            {(product?.category_id === 'cat-audio-wearables' || product?.name?.toLowerCase().includes('headphone') || product?.name?.toLowerCase().includes('sound') || product?.name?.toLowerCase().includes('acoustic')) && (
              <div className="mb-4">
                <SpatialSoundscapePlayer productName={product.name} />
              </div>
            )}

            {/* 15-Minute Vault Hold & Exclusive Reservation */}
            <div className="mb-4">
              <VaultHoldBar product={product} variant={selectedVariant} />
            </div>

            {/* Quantity and Actions */}
            <div className="flex gap-4">
              {/* Stepper */}
              <div className="flex items-center border border-[#E8E6E1] bg-white w-32 justify-between px-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 text-[#787570] hover:text-[#141414]"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-semibold text-[#141414]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 text-[#787570] hover:text-[#141414]"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || !selectedVariant || selectedVariant.stock_quantity === 0}
                className="flex-1 py-4 bg-white border border-[#141414] text-[#141414] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#FAF9F5] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addingToCart ? (
                  <span>Adding to Bag...</span>
                ) : selectedVariant?.stock_quantity === 0 ? (
                  <span>Sold Out</span>
                ) : (
                  <span>Add To Bag</span>
                )}
              </button>

              {/* Amazon-grade 1-Click "Buy Now" Button */}
              <button
                onClick={handleBuyNow}
                disabled={buyingNow || !selectedVariant || selectedVariant.stock_quantity === 0}
                className="flex-1 py-4 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#2A2A2A] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 fill-[#FAF9F5]" />
                {buyingNow ? <span>Initiating Checkout...</span> : <span>Buy Now</span>}
              </button>

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product)}
                className="p-4 border border-[#E8E6E1] bg-white hover:border-[#141414] text-[#141414] transition-colors"
                aria-label="Toggle wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isLiked ? 'fill-[#141414] text-[#141414]' : 'text-[#141414]'
                  }`}
                />
              </button>
            </div>

            {/* Split Bill & Group Gifting Option */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowGiftModal(true)}
                className="w-full py-2.5 rounded-lg border border-[#C2A676]/60 bg-[#C2A676]/10 hover:bg-[#C2A676]/20 text-[#A37B30] dark:text-[#E6CA65] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>🎁 Split The Bill / Group Gifting Collective</span>
              </button>
            </div>

            {/* Amazon-style Alert Triggers (Price Drop & Back in Stock) */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setAlertType('price_drop');
                  setShowAlertModal(true);
                }}
                className="text-[11px] text-[#787570] hover:text-[#141414] flex items-center gap-1.5 transition-colors underline-offset-2 hover:underline"
              >
                <Bell className="w-3.5 h-3.5 text-[#C2A676]" />
                <span>Notify me on Price Drop</span>
              </button>
              <span className="text-[#E8E6E1]">•</span>
              <button
                type="button"
                onClick={() => {
                  setAlertType('restock');
                  setShowAlertModal(true);
                }}
                className="text-[11px] text-[#787570] hover:text-[#141414] flex items-center gap-1.5 transition-colors underline-offset-2 hover:underline"
              >
                <span>Size Out of Stock? Get Alert</span>
              </button>
            </div>

            {/* Amazon-style Pincode Delivery Estimator Box */}
            <div className="p-4 bg-[#F8F7F4] border border-[#E8E6E1] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C2A676]" />
                  Check Delivery & Services
                </span>
                <span className="text-[10px] text-[#787570] font-mono">India Dispatch</span>
              </div>

              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode (e.g. 110001, 400001)"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ''));
                    setPincodeChecked(false);
                  }}
                  className="flex-1 bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414] font-mono"
                />
                <button
                  type="submit"
                  disabled={pincodeLoading}
                  className="px-4 py-2 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
                >
                  {pincodeLoading ? 'Checking...' : 'Check'}
                </button>
              </form>

              {pincodeChecked && deliveryEstimate && (
                <div className="pt-2 text-xs space-y-1.5 border-t border-[#E8E6E1]/70">
                  <p className="text-emerald-800 font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>
                      {deliveryEstimate.isExpress ? 'Express Dispatch: ' : 'Standard Dispatch: '}
                      Expected by <strong className="underline">{deliveryEstimate.date}</strong>
                    </span>
                  </p>
                  <div className="flex items-center gap-4 text-[11px] text-[#787570]">
                    <span>✓ Free Delivery on orders over ₹10,000</span>
                    <span>✓ Cash on Delivery Eligible</span>
                    <span>✓ 7 Days Replacement</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="pt-2 grid grid-cols-2 gap-3 text-[11px] text-[#787570] uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C2A676]" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#C2A676]" />
                <span>30-Day Atelier Returns</span>
              </div>
            </div>
          </div>

          {/* Editorial Tabs Accordion */}
          <div className="mt-10 border-t border-[#E8E6E1]">
            <div className="flex border-b border-[#E8E6E1]">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
                  activeTab === 'details' ? 'border-[#141414] text-[#141414]' : 'border-transparent text-[#787570]'
                }`}
              >
                Craft & Details
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
                  activeTab === 'materials' ? 'border-[#141414] text-[#141414]' : 'border-transparent text-[#787570]'
                }`}
              >
                Materials & Care
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all ${
                  activeTab === 'shipping' ? 'border-[#141414] text-[#141414]' : 'border-transparent text-[#787570]'
                }`}
              >
                Shipping & Returns
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`py-3 px-4 text-xs uppercase tracking-widest font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'reviews' ? 'border-[#141414] text-[#141414]' : 'border-transparent text-[#787570]'
                }`}
              >
                <span>Reviews</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#F3F1EC] rounded-full text-[#141414] font-bold">
                  {product.reviewsCount || 24}
                </span>
              </button>
            </div>

            <div className="py-5 text-xs text-[#63605A] leading-relaxed">
              {activeTab === 'details' && (
                <ul className="space-y-2">
                  {product.details?.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-[#C2A676] rounded-full mt-1.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}

              {activeTab === 'materials' && (
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold text-[#141414]">Fabric Composition:</span> {product.material}
                  </p>
                  <p>
                    <span className="font-semibold text-[#141414]">Care Instructions:</span> {product.care}
                  </p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2.5">
                  <p>
                    We offer complimentary express courier shipping on all orders over ₹10,000. Dispatched from our central logistics atelier within 24 business hours.
                  </p>
                  <p>
                    Returns are accepted within 30 days of receipt in original condition with unclipped security tags.
                  </p>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-5">
                  {/* Rating Breakdown Bar */}
                  <div className="p-4 bg-[#F8F7F4] border border-[#E8E6E1] flex flex-col sm:flex-row items-center gap-6">
                    <div className="text-center sm:border-r sm:border-[#E8E6E1] sm:pr-6">
                      <div className="text-3xl font-serif text-[#141414] font-medium">
                        {product.rating || 4.9}
                      </div>
                      <div className="flex items-center justify-center gap-1 text-amber-500 my-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#787570] uppercase tracking-wider">
                        {product.reviewsCount || 24} Verified Ratings
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                      {[
                        { stars: '5 star', percent: 84 },
                        { stars: '4 star', percent: 12 },
                        { stars: '3 star', percent: 4 },
                        { stars: '2 star', percent: 0 },
                        { stars: '1 star', percent: 0 },
                      ].map((item) => (
                        <div key={item.stars} className="flex items-center gap-2 text-[10px]">
                          <span className="w-10 text-[#787570] font-medium">{item.stars}</span>
                          <div className="flex-1 bg-[#E8E6E1] h-2 rounded-full overflow-hidden">
                            <div className="bg-amber-400 h-full rounded-full" style={{ width: `${item.percent}%` }} />
                          </div>
                          <span className="w-8 text-right font-mono text-[#787570]">{item.percent}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar: Write a Review */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-[#141414] uppercase tracking-wider">
                      Customer Testimonials ({2 + userReviews.length})
                    </span>
                    <button
                      onClick={() => setShowReviewModal(true)}
                      className="px-3 py-1.5 bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF9F5] text-[10px] uppercase tracking-widest font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#C2A676]" />
                      <span>Write A Review</span>
                    </button>
                  </div>

                  {/* Customer Reviews List */}
                  <div className="space-y-4 pt-1">
                    {/* User-submitted Reviews */}
                    {userReviews.map((rev) => (
                      <div key={rev.id} className="border-b border-[#E8E6E1] pb-3 space-y-1.5 bg-[#FAF9F5]/70 p-3 border">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#141414] text-xs">{rev.name}</span>
                          <span className="text-[10px] text-[#787570]">{rev.city} • {rev.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex text-amber-500 gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-[#E8E6E1]'}`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 border border-emerald-200">
                            Fit: {rev.fit}
                          </span>
                        </div>
                        <p className="font-serif text-xs font-medium text-[#141414] pt-0.5">{rev.title}</p>
                        <p className="text-xs text-[#63605A] leading-relaxed">{rev.text}</p>
                      </div>
                    ))}

                    <div className="border-b border-[#E8E6E1] pb-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#141414]">Kavita Sharma</span>
                        <span className="text-[10px] text-[#787570]">Verified Buyer • Mumbai</span>
                      </div>
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-[#63605A] pt-1">
                        "Exceptional drape and finishing. The fabric feels substantially luxurious and arrived in under 24 hours in Mumbai."
                      </p>
                    </div>

                    <div className="border-b border-[#E8E6E1] pb-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#141414]">Aditya Rao</span>
                        <span className="text-[10px] text-[#787570]">Verified Buyer • Bengaluru</span>
                      </div>
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-xs text-[#63605A] pt-1">
                        "Accurate sizing and zero loose threads. Truly on par with international atelier suiting."
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Amazon-grade Frequently Bought Together Bundle */}
      {bundleCandidate && (
        <section className="mt-16 pt-12 border-t border-[#E8E6E1]">
          <div className="mb-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold">
              Curated Pairing
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal uppercase mt-1">
              Frequently Bought Together
            </h2>
          </div>

          <div className="bg-[#FAF9F5] border border-[#E8E6E1] p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Visual Products Chain */}
            <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
              {/* Product 1: Current Item */}
              <div className="flex items-center gap-3">
                <div className="w-20 h-24 sm:w-24 sm:h-28 bg-white border border-[#E8E6E1] shrink-0 p-1 relative">
                  <img
                    src={product.images?.[0] || currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-1 right-1 bg-[#141414] text-[#FAF9F5] text-[9px] px-1 font-mono uppercase">
                    This Item
                  </span>
                </div>
                <div className="max-w-[150px] sm:max-w-[180px]">
                  <p className="font-serif text-xs font-semibold text-[#141414] line-clamp-1">{product.name}</p>
                  <p className="text-xs text-[#787570] font-mono mt-0.5">{formatPrice(mainPrice)}</p>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 mt-1 inline-block border border-emerald-200">
                    Selected
                  </span>
                </div>
              </div>

              {/* Plus Divider */}
              <div className="w-8 h-8 rounded-full bg-white border border-[#E8E6E1] flex items-center justify-center text-[#787570] shrink-0 shadow-xs">
                <Plus className="w-4 h-4" />
              </div>

              {/* Product 2: Bundle Candidate */}
              <div className={`flex items-center gap-3 transition-opacity ${includeBundleItem ? 'opacity-100' : 'opacity-40'}`}>
                <div className="w-20 h-24 sm:w-24 sm:h-28 bg-white border border-[#E8E6E1] shrink-0 p-1 relative">
                  <img
                    src={bundleCandidate.images?.[0]}
                    alt={bundleCandidate.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-[#C2A676] text-[#141414] text-[8px] font-bold px-1 uppercase tracking-wider">
                    Pairing
                  </span>
                </div>
                <div className="max-w-[150px] sm:max-w-[180px]">
                  <Link to={`/product/${bundleCandidate.slug}`} className="font-serif text-xs font-semibold text-[#141414] hover:underline line-clamp-1">
                    {bundleCandidate.name}
                  </Link>
                  <p className="text-xs text-[#787570] font-mono mt-0.5">{formatPrice(bundlePrice)}</p>
                  <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer text-[11px] text-[#141414]">
                    <input
                      type="checkbox"
                      checked={includeBundleItem}
                      onChange={(e) => setIncludeBundleItem(e.target.checked)}
                      className="accent-[#141414] w-3.5 h-3.5"
                    />
                    <span>Add to bundle</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Total Price & CTA Box */}
            <div className="w-full lg:w-72 bg-white border border-[#E8E6E1] p-5 shrink-0 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between text-xs text-[#787570] mb-1">
                  <span>Price for {includeBundleItem ? 'both items' : '1 item'}:</span>
                  {bundleDiscount > 0 && (
                    <span className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 border border-emerald-200">
                      Save {formatPrice(bundleDiscount)} (10%)
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl sm:text-2xl font-serif font-bold text-[#141414]">
                    {formatPrice(finalBundleTotal)}
                  </span>
                  {bundleDiscount > 0 && (
                    <span className="text-xs text-[#A3A099] line-through font-mono">
                      {formatPrice(rawBundleTotal)}
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-[#787570] leading-snug mb-4">
                  Complimentary luxury gift boxing and unified courier tracking included.
                </p>
              </div>

              <button
                onClick={handleAddBundleToCart}
                disabled={bundleAdding}
                className="w-full py-3 bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                {bundleSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Added To Bag!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-[#C2A676]" />
                    <span>{bundleAdding ? 'Adding...' : includeBundleItem ? 'Add Both To Bag' : 'Add Item To Bag'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Amazon-grade Compare Similar Flagship Products Matrix */}
      {compareGarments.length > 1 && (
        <section className="mt-20 pt-16 border-t border-[#E8E6E1]">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-bold">
              Flagship Benchmarking
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#141414] font-normal uppercase mt-1">
              Compare With Similar Flagship Products
            </h2>
          </div>

          <div className="overflow-x-auto bg-white border border-[#E8E6E1] shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E8E6E1] bg-[#FAF9F5]">
                  <th className="p-4 w-44 font-semibold text-[#787570] uppercase tracking-wider text-[10px]">
                    Product Specification
                  </th>
                  {compareGarments.map((g, idx) => (
                    <th key={g.id} className="p-4 min-w-[200px] w-64 align-top">
                      <div className="space-y-3">
                        <div className="w-28 h-36 bg-[#F3F1EC] mx-auto overflow-hidden relative border border-[#E8E6E1]">
                          <img
                            src={g.images?.[0]}
                            alt={g.name}
                            className="w-full h-full object-cover"
                          />
                          {idx === 0 && (
                            <span className="absolute top-1 left-1 bg-[#141414] text-[#FAF9F5] text-[8px] font-mono px-1 font-bold uppercase">
                              Current Item
                            </span>
                          )}
                        </div>
                        <div className="text-center">
                          <Link
                            to={`/product/${g.slug || g.id}`}
                            className="font-serif font-semibold text-xs text-[#141414] hover:text-[#C2A676] line-clamp-2 block"
                          >
                            {g.name}
                          </Link>
                          <p className="font-bold text-sm text-[#141414] mt-1 font-serif">
                            {formatPrice(g.sale_price || g.base_price)}
                          </p>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1]">
                {/* Customer Rating */}
                <tr>
                  <td className="p-4 font-semibold text-[#787570] uppercase text-[10px] tracking-wider bg-[#FAF9F5]/40">
                    Customer Rating
                  </td>
                  {compareGarments.map((g) => (
                    <td key={g.id} className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-xs text-[#141414]">{g.rating || 4.9}</span>
                        <span className="text-[10px] text-[#787570]">({g.reviewsCount || 24})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Material / Composition */}
                <tr>
                  <td className="p-4 font-semibold text-[#787570] uppercase text-[10px] tracking-wider bg-[#FAF9F5]/40">
                    Materials & Build
                  </td>
                  {compareGarments.map((g) => (
                    <td key={g.id} className="p-4 text-center text-[#141414] font-medium leading-relaxed">
                      {g.material || 'Premium Aerospace & Atelier Craft'}
                    </td>
                  ))}
                </tr>

                {/* Silhouette / Department */}
                <tr>
                  <td className="p-4 font-semibold text-[#787570] uppercase text-[10px] tracking-wider bg-[#FAF9F5]/40">
                    Department
                  </td>
                  {compareGarments.map((g) => (
                    <td key={g.id} className="p-4 text-center uppercase tracking-wider text-[11px] text-[#787570]">
                      {g.categoryName}
                    </td>
                  ))}
                </tr>

                {/* Privilege Delivery */}
                <tr>
                  <td className="p-4 font-semibold text-[#787570] uppercase text-[10px] tracking-wider bg-[#FAF9F5]/40">
                    Express Dispatch
                  </td>
                  {compareGarments.map((g) => (
                    <td key={g.id} className="p-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                        <Zap className="w-2.5 h-2.5 text-[#C2A676] fill-[#C2A676]" />
                        <span>Next-Day Air Eligible</span>
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Care Guidelines */}
                <tr>
                  <td className="p-4 font-semibold text-[#787570] uppercase text-[10px] tracking-wider bg-[#FAF9F5]/40">
                    Care Guidelines
                  </td>
                  {compareGarments.map((g) => (
                    <td key={g.id} className="p-4 text-center text-[11px] text-[#787570]">
                      {g.care || 'Specialist Care & Protection'}
                    </td>
                  ))}
                </tr>

                {/* Quick Action Button */}
                <tr className="bg-[#FAF9F5]/20">
                  <td className="p-4 font-semibold text-[#787570] uppercase text-[10px] tracking-wider bg-[#FAF9F5]/40">
                    Action
                  </td>
                  {compareGarments.map((g, idx) => (
                    <td key={g.id} className="p-4 text-center">
                      {idx === 0 ? (
                        <span className="text-[10px] uppercase font-bold text-[#C2A676] tracking-wider">
                          Currently Viewing
                        </span>
                      ) : (
                        <Link
                          to={`/product/${g.slug || g.id}`}
                          className="inline-block px-4 py-2 bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF9F5] text-[10px] uppercase tracking-widest font-semibold transition-colors"
                        >
                          View Product
                        </Link>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="mt-20 pt-16 border-t border-[#E8E6E1]">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#787570] font-semibold">
              Complete The Look
            </span>
            <h2 className="font-serif text-3xl text-[#141414] font-normal mt-1">
              COORDINATING PIECES
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Add To Cart Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E8E6E1] p-4 z-30 flex items-center justify-between gap-4">
        <div>
          <p className="font-serif text-sm font-semibold text-[#141414] line-clamp-1">{product.name}</p>
          <p className="text-xs text-[#787570]">
            {formatPrice(product.sale_price || product.base_price)} • Size: {selectedVariant?.size || 'M'}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="px-4 py-3 bg-white border border-[#141414] text-[#141414] text-xs uppercase tracking-widest font-bold"
          >
            {addingToCart ? '...' : 'Bag'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={buyingNow}
            className="px-5 py-3 bg-[#141414] text-[#FAF9F5] text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 shadow-md"
          >
            <Zap className="w-3 h-3 fill-[#FAF9F5]" />
            <span>{buyingNow ? '...' : 'Buy Now'}</span>
          </button>
        </div>
      </div>

      {/* Amazon-grade Interactive Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF9F5] border border-[#141414] max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#E8E6E1] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-bold">
                  Clientele Appraisal
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#141414] mt-0.5">
                  Write A Verified Review
                </h3>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="p-1 text-[#787570] hover:text-[#141414]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star Rating Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#141414] font-semibold mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-1 text-amber-400 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-[#E8E6E1]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#787570] ml-2 font-mono">
                    {newRating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Name & City Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newReviewerName}
                    onChange={(e) => setNewReviewerName(e.target.value)}
                    placeholder="e.g. Rohini Iyer"
                    className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  />
                </div>
              </div>

              {/* Sizing & Fit Rating (Amazon style) */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1.5">
                  Sizing & Dimension / Fit
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Runs small', 'True to size', 'Runs large'].map((fit) => (
                    <button
                      key={fit}
                      type="button"
                      onClick={() => setNewReviewFit(fit)}
                      className={`py-2 text-xs text-center border transition-all ${
                        newReviewFit === fit
                          ? 'border-[#141414] bg-[#141414] text-[#FAF9F5] font-semibold'
                          : 'border-[#E8E6E1] bg-white text-[#787570] hover:border-[#141414]'
                      }`}
                    >
                      {fit}
                    </button>
                  ))}
                </div>
              </div>

              {/* Headline / Title */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Masterful tailoring and immaculate drape"
                  className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                  Written Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newReviewText}
                  onChange={(e) => setNewReviewText(e.target.value)}
                  placeholder="Share details about the fabric weight, silhouette, shoulder fit, and dispatch turnaround..."
                  className="w-full bg-white border border-[#E8E6E1] p-3 text-xs text-[#141414] focus:outline-none focus:border-[#141414] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E8E6E1]">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2.5 text-xs uppercase tracking-wider text-[#787570] hover:text-[#141414]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Check className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>{submittingReview ? 'Publishing...' : 'Publish Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Amazon-grade Price Drop & Restock Notification Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#FAF9F5] border border-[#141414] max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#E8E6E1] pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-bold flex items-center gap-1.5">
                  <Bell className="w-3 h-3 text-[#C2A676]" />
                  Automated Atelier Alerts
                </span>
                <h3 className="font-serif text-lg font-semibold text-[#141414] mt-0.5">
                  {alertType === 'price_drop' ? 'Price Drop Notification' : 'Restock / Back In Stock Alert'}
                </h3>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="p-1 text-[#787570] hover:text-[#141414]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {alertSubmitted ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-200 text-emerald-600">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-base font-semibold text-[#141414]">Alert Preference Registered</h4>
                <p className="text-xs text-[#787570] max-w-xs mx-auto">
                  We will transmit a priority notification to <strong>{alertEmail}</strong> the moment the status changes.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAlertSubmit} className="space-y-4">
                <p className="text-xs text-[#787570] leading-relaxed">
                  {alertType === 'price_drop'
                    ? `Set your desired price threshold for "${product.name}". We'll alert you immediately when our atelier price updates.`
                    : `Get notified the second fresh sizes or bolts of "${product.name}" are replenished at our atelier.`}
                </p>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="clientele@example.com"
                    className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                  />
                </div>

                {alertType === 'price_drop' && (
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-[#787570] mb-1">
                      Notify When Price Drops Below (₹)
                    </label>
                    <input
                      type="number"
                      value={alertTargetPrice}
                      onChange={(e) => setAlertTargetPrice(e.target.value)}
                      placeholder={`Current: ${formatPrice(product.sale_price || product.base_price)}`}
                      className="w-full bg-white border border-[#E8E6E1] px-3 py-2 text-xs text-[#141414] focus:outline-none focus:border-[#141414]"
                    />
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#E8E6E1]">
                  <button
                    type="button"
                    onClick={() => setShowAlertModal(false)}
                    className="px-4 py-2 text-xs uppercase tracking-wider text-[#787570] hover:text-[#141414]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#141414] hover:bg-[#2A2A2A] text-[#FAF9F5] text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Bell className="w-3.5 h-3.5 text-[#C2A676]" />
                    <span>Set Alert</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 3D Virtual Fitting Room / Drape Simulation Modal */}
      <VirtualFittingModal
        isOpen={showFittingModal}
        onClose={() => setShowFittingModal(false)}
        product={product}
        selectedSize={selectedVariant?.size || 'M'}
        onSelectSize={(newSize) => {
          const matchedVariant = availableSizesForColor.find((v) => v.size === newSize) || product.variants.find((v) => v.size === newSize);
          if (matchedVariant) {
            handleSizeChange(matchedVariant);
          }
        }}
      />

      {/* Bespoke Monogramming & Foil Debossing Studio Modal */}
      <MonogramStudioModal
        isOpen={showMonogramModal}
        onClose={() => setShowMonogramModal(false)}
        product={product}
        initialConfig={appliedMonogram}
        onApplyMonogram={(config) => {
          setAppliedMonogram(config);
        }}
      />

      {/* Split Bill & Group Gifting Modal */}
      {showGiftModal && (
        <GroupGiftModal
          product={product}
          onClose={() => setShowGiftModal(false)}
        />
      )}
    </div>
  );
}
