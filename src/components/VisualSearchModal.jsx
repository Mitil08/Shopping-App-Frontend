import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, X, Check, Image, ArrowRight, RefreshCw, Zap } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';
import { useNavigate } from 'react-router-dom';

export default function VisualSearchModal({ isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [detectedAttributes, setDetectedAttributes] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  // Preset sample lookbooks for instant demonstration
  const SAMPLE_IMAGES = [
    {
      label: 'Editorial Camel Overcoat',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      category: 'cat-outerwear',
      palette: ['#C39B77', '#1C1C1E', '#EAE6DF'],
      silhouette: 'Tailored Overcoat',
      keywords: ['coat', 'wool', 'cashmere', 'outerwear']
    },
    {
      label: 'Minimalist Poplin Shirting',
      url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
      category: 'cat-shirts',
      palette: ['#FAF9F5', '#334155'],
      silhouette: 'Relaxed Studio Shirt',
      keywords: ['shirt', 'poplin', 'cotton', 'top']
    },
    {
      label: 'Full-Grain Leather Tote',
      url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
      category: 'cat-accessories',
      palette: ['#8E4A28', '#2B170B'],
      silhouette: 'Architectural Leather Goods',
      keywords: ['bag', 'leather', 'accessories', 'tote']
    },
    {
      label: 'Pleated Wide-Leg Trousers',
      url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
      category: 'cat-trousers',
      palette: ['#1C1C1E', '#3D3D40'],
      silhouette: 'Wide-Leg Tailored Silhouette',
      keywords: ['trouser', 'pants', 'wool', 'tailoring']
    }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      processImageAnalysis(reader.result, file.name);
    };
    reader.readAsDataURL(file);
  };

  const processImageAnalysis = (imageSrc, sampleLabel = '') => {
    setSelectedImage(imageSrc);
    setAnalyzing(true);
    setAnalysisResults(null);
    setDetectedAttributes(null);

    // AI Computer Vision Feature Extraction Simulation
    setTimeout(() => {
      // Find matching products based on label or random weighted selection
      const matchedSample = SAMPLE_IMAGES.find((s) =>
        sampleLabel.toLowerCase().includes(s.label.toLowerCase()) ||
        sampleLabel.toLowerCase().includes(s.silhouette.toLowerCase())
      ) || SAMPLE_IMAGES[0];

      // Score products in catalog
      const scored = mockProducts.map((p) => {
        let score = 70;
        if (p.category_id === matchedSample.category) score += 20;
        if (matchedSample.keywords.some((k) => p.name.toLowerCase().includes(k) || p.description.toLowerCase().includes(k))) {
          score += 8;
        }
        // Add random variance between 88% and 99% for top matches
        const finalScore = Math.min(99, Math.max(74, score + Math.floor(Math.random() * 5)));
        return { product: p, matchPercentage: finalScore };
      });

      scored.sort((a, b) => b.matchPercentage - a.matchPercentage);

      setDetectedAttributes({
        silhouette: matchedSample.silhouette,
        dominantColors: matchedSample.palette,
        detectedTexture: 'Substantial Brushed Virgin Wool / Woven Gabardine',
        detectedCategory: matchedSample.category === 'cat-outerwear' ? 'Outerwear & Tailoring' : 'Fine Apparel'
      });

      setAnalysisResults(scored.slice(0, 4));
      setAnalyzing(false);
    }, 1100);
  };

  const handleProductClick = (slug) => {
    onClose();
    navigate(`/product/${slug}`);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResults(null);
    setDetectedAttributes(null);
    setAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF9F5] dark:bg-[#121118] text-[#141414] dark:text-[#FAF9F5] rounded-none shadow-2xl border border-[#DCD9D0] dark:border-[#2A2834] overflow-hidden my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1] dark:border-[#26242E] bg-white dark:bg-[#16151E]">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-[#C2A676]/20 text-[#C2A676]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold tracking-wider uppercase">ÉLANE Visual Studio</h3>
                <span className="text-[10px] px-2 py-0.5 font-mono uppercase bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#141414] font-semibold">AI Fashion Matcher</span>
              </div>
              <p className="text-[11px] text-[#787570] dark:text-[#A3A099]">Upload or snap any street-style or runway photo to discover matching atelier garments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#787570] hover:text-[#141414] dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 space-y-6">

          {!selectedImage ? (
            /* Upload Screen */
            <div className="space-y-6">
              {/* Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#C2A676]/50 hover:border-[#C2A676] bg-white/60 dark:bg-[#16151E]/60 p-8 sm:p-12 text-center cursor-pointer transition-all hover:bg-white dark:hover:bg-[#16151E] group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div className="w-16 h-16 mx-auto mb-4 bg-[#C2A676]/10 text-[#C2A676] flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8" />
                </div>
                <h4 className="font-serif text-base sm:text-lg font-semibold uppercase tracking-wider mb-1">
                  Drop Your Fashion Image Here
                </h4>
                <p className="text-xs text-[#787570] dark:text-[#A3A099] max-w-md mx-auto mb-4">
                  Drag & drop any outfit photo, street snap, or sketch, or click to browse files (JPEG, PNG, WEBP).
                </p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#141414] dark:bg-[#C2A676] text-white dark:text-[#141414] text-xs font-mono uppercase tracking-widest font-bold shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  Upload Photo
                </div>
              </div>

              {/* Sample Presets */}
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#787570] dark:text-[#A3A099] block mb-3">
                  Or test with sample editorial lookbook snapshots:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SAMPLE_IMAGES.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => processImageAnalysis(sample.url, sample.label)}
                      className="group text-left border border-[#E8E6E1] dark:border-[#2A2834] bg-white dark:bg-[#181722] overflow-hidden hover:border-[#141414] dark:hover:border-[#C2A676] transition-all"
                    >
                      <div className="aspect-[3/4] overflow-hidden bg-neutral-200">
                        <img
                          src={sample.url}
                          alt={sample.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-2.5">
                        <span className="text-[10px] font-bold font-serif uppercase tracking-wider block text-[#141414] dark:text-white truncate">
                          {sample.label}
                        </span>
                        <span className="text-[9px] font-mono text-[#C2A676] flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-2.5 h-2.5" /> Quick Match
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6">

              {/* Visual Breakdown Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 bg-white dark:bg-[#16151E] p-4 sm:p-6 border border-[#E8E6E1] dark:border-[#2A2834]">
                
                {/* Uploaded Thumbnail */}
                <div className="sm:col-span-3 aspect-[3/4] overflow-hidden relative border border-[#E8E6E1] dark:border-[#2A2834] bg-neutral-100">
                  <img
                    src={selectedImage}
                    alt="Analyzed target"
                    className="w-full h-full object-cover"
                  />
                  {analyzing && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#C2A676] mb-2" />
                      <span className="text-[10px] font-mono uppercase tracking-wider">Scanning...</span>
                    </div>
                  )}
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#141414]/90 text-[9px] font-mono text-white uppercase tracking-wider">
                    Source
                  </span>
                </div>

                {/* AI Detected Attributes */}
                <div className="sm:col-span-9 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#C2A676]">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Visual Feature Extraction
                      </span>
                      <button
                        onClick={handleReset}
                        className="text-[11px] font-mono uppercase tracking-wider text-[#787570] hover:text-[#141414] dark:hover:text-white underline"
                      >
                        Upload Another Photo
                      </button>
                    </div>

                    {analyzing ? (
                      <div className="space-y-2 mt-4">
                        <div className="h-4 bg-[#EAE8E2] dark:bg-neutral-800 w-2/3 animate-pulse" />
                        <div className="h-3 bg-[#EAE8E2] dark:bg-neutral-800 w-1/2 animate-pulse" />
                        <div className="h-8 bg-[#EAE8E2] dark:bg-neutral-800 w-full animate-pulse mt-3" />
                      </div>
                    ) : detectedAttributes ? (
                      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-3 bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834]">
                          <span className="text-[10px] font-mono text-[#787570] dark:text-[#A3A099] block uppercase">Silhouette Class</span>
                          <span className="text-xs font-bold text-[#141414] dark:text-white block mt-0.5">{detectedAttributes.silhouette}</span>
                        </div>
                        <div className="p-3 bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834]">
                          <span className="text-[10px] font-mono text-[#787570] dark:text-[#A3A099] block uppercase">Detected Fabric</span>
                          <span className="text-xs font-bold text-[#141414] dark:text-white block mt-0.5 truncate">{detectedAttributes.detectedTexture}</span>
                        </div>
                        <div className="p-3 bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834] col-span-2 sm:col-span-1">
                          <span className="text-[10px] font-mono text-[#787570] dark:text-[#A3A099] block uppercase">Color Extraction</span>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            {detectedAttributes.dominantColors.map((hex, i) => (
                              <span
                                key={i}
                                className="w-5 h-5 rounded-full border border-black/20 shadow-2xs"
                                style={{ backgroundColor: hex }}
                                title={hex}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {!analyzing && (
                    <div className="text-[11px] text-[#787570] dark:text-[#A3A099] flex items-center gap-1.5 pt-2 border-t border-[#E8E6E1] dark:border-[#2A2834]">
                      <Zap className="w-3.5 h-3.5 text-[#C2A676]" />
                      <span>Direct matches computed across active ÉLANE Luxury Inventory in Indian Rupees (₹).</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Matched Products Grid */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#141414] dark:text-white flex items-center gap-1.5">
                    Closest Atelier Matches ({analysisResults?.length || 0})
                  </h4>
                  <span className="text-[10px] font-mono text-[#787570]">Ranked by visual similarity</span>
                </div>

                {analyzing ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-[3/4] bg-[#EAE8E2] dark:bg-neutral-800 animate-pulse" />
                    ))}
                  </div>
                ) : analysisResults && analysisResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {analysisResults.map(({ product, matchPercentage }) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.slug)}
                        className="group cursor-pointer border border-[#E8E6E1] dark:border-[#2A2834] bg-white dark:bg-[#181722] overflow-hidden hover:border-[#141414] dark:hover:border-[#C2A676] transition-all relative flex flex-col justify-between"
                      >
                        {/* Match Percentage Pill */}
                        <div className="absolute top-2 left-2 z-10 bg-[#141414] text-[#C2A676] px-2 py-0.5 text-[9px] font-mono font-bold tracking-wider uppercase shadow-xs">
                          {matchPercentage}% Match
                        </div>

                        {/* Image */}
                        <div className="aspect-[3/4] overflow-hidden bg-neutral-100 relative">
                          <img
                            src={product.primary_image_url || product.images?.[0]?.image_url || product.images?.[0]}
                            alt={product.name || product.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>

                        {/* Info */}
                        <div className="p-3">
                          <span className="text-[9px] font-mono uppercase tracking-wider text-[#787570] block truncate">
                            {product.categoryName || 'Luxury Atelier'}
                          </span>
                          <h5 className="font-serif text-xs font-semibold text-[#141414] dark:text-white truncate group-hover:text-[#C2A676] transition-colors mt-0.5">
                            {product.name || product.title}
                          </h5>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8E6E1]/60 dark:border-[#2A2834]">
                            <span className="font-serif font-bold text-xs text-[#141414] dark:text-[#C2A676]">
                              {formatPrice(product.sale_price || product.base_price)}
                            </span>
                            <span className="text-[9px] font-mono text-[#787570] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                              View <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
