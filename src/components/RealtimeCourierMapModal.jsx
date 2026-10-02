import React, { useState, useEffect } from 'react';
import { X, Navigation, Phone, MessageSquare, ShieldCheck, MapPin, Truck, Clock, RefreshCw, Zap, CheckCircle2, Compass } from 'lucide-react';

export default function RealtimeCourierMapModal({ isOpen, onClose, awbNumber, destinationAddress }) {
  const [satelliteView, setSatelliteView] = useState(false);
  const [progress, setProgress] = useState(65); // percentage along route
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [deliveryNoteSent, setDeliveryNoteSent] = useState(false);

  // Auto animate courier movement along path
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 40 : prev + 0.5));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 750);
  };

  const destinationCity = destinationAddress?.city || 'Mumbai';
  const recipientName = destinationAddress?.name || 'Valued Clientele';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#111827] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-[#1E293B] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#17213C] via-[#1E293B] to-[#17213C] text-white border-b border-[#C2A676]/30">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C2A676]/20 border border-[#C2A676]/40 text-[#C2A676]">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#FAF9F5]">Live GPS Courier Tracker</h3>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Signal
                </span>
              </div>
              <p className="text-xs text-[#94A3B8] font-mono">AWB: {awbNumber} • Blue Dart VIP Express</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSatelliteView(!satelliteView)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-[#FAF9F5] border border-white/20 transition-all flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#C2A676]" />
              <span>{satelliteView ? 'Vector Map' : 'Satellite View'}</span>
            </button>
            <button
              onClick={handleRefresh}
              className={`p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Refresh GPS Coordinates"
            >
              <RefreshCw className="w-4 h-4 text-[#C2A676]" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 text-gray-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Tracker Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 overflow-y-auto">
          
          {/* Left / Top: Interactive Simulated Vector Map */}
          <div className="lg:col-span-2 relative min-h-[320px] lg:min-h-[420px] bg-[#1E2638] overflow-hidden flex flex-col justify-between p-4">
            {/* Map Grid Pattern background */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                satelliteView ? 'bg-[#0f172a] opacity-95' : 'bg-[#182236]'
              }`}
              style={{
                backgroundImage: satelliteView
                  ? 'radial-gradient(#334155 1px, transparent 1px)'
                  : 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            {/* Map Roads & Route Canvas SVG */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              {/* Background Road Networks */}
              <path d="M -50 150 Q 200 80 400 220 T 950 300" stroke="#334155" strokeWidth="12" fill="none" opacity="0.6" />
              <path d="M 120 -50 Q 180 200 350 450" stroke="#334155" strokeWidth="8" fill="none" opacity="0.4" />
              
              {/* Active Delivery Route Line (Glowing Sapphire/Gold Path) */}
              <path
                id="deliveryPath"
                d="M 60 300 C 180 260, 240 120, 420 180 S 600 280, 720 220"
                stroke="#2563EB"
                strokeWidth="6"
                fill="none"
                strokeDasharray="8 6"
                className="animate-pulse"
              />

              {/* Traveled route line (Solid Gold) */}
              <path
                d="M 60 300 C 180 260, 240 120, 420 180 S 600 280, 720 220"
                stroke="#C2A676"
                strokeWidth="6"
                fill="none"
                strokeDasharray="600"
                strokeDashoffset={600 - (600 * progress) / 100}
              />

              {/* Hub Origin Marker */}
              <g transform="translate(60, 300)">
                <circle r="14" fill="#17213C" stroke="#C2A676" strokeWidth="2" />
                <circle r="6" fill="#C2A676" />
                <text x="-35" y="30" fill="#CBD5E1" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                  Bandra Hub
                </text>
              </g>

              {/* Destination Pin Marker */}
              <g transform="translate(720, 220)">
                <circle r="18" fill="#2563EB" opacity="0.3" className="animate-ping" />
                <circle r="12" fill="#1E40AF" stroke="#FAF9F5" strokeWidth="2" />
                <circle r="5" fill="#FAF9F5" />
                <text x="-40" y="-20" fill="#FAF9F5" fontSize="12" fontFamily="sans-serif" fontWeight="bold">
                  {destinationCity} Residence
                </text>
              </g>
            </svg>

            {/* Live Moving Courier Vehicle Badge */}
            <div
              className="absolute z-10 transition-all duration-1000 ease-out transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${progress}%`,
                top: `${45 + Math.sin(progress / 10) * 15}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute w-10 h-10 rounded-full bg-blue-500/30 animate-ping" />
                <div className="p-2.5 rounded-full bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white shadow-xl border-2 border-[#FAF9F5] flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div className="absolute top-11 whitespace-nowrap bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-[#C2A676]/40 text-[10px] text-white font-mono shadow-lg flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#C2A676]" />
                  <span>MH-02-EL-2026 (4.2 km away)</span>
                </div>
              </div>
            </div>

            {/* Map Overlay Telemetry Box */}
            <div className="relative z-20 flex flex-wrap gap-2 sm:gap-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white text-xs">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#C2A676]" />
                <div>
                  <span className="text-[10px] uppercase text-[#94A3B8] block">Est. Arrival</span>
                  <span className="font-semibold text-emerald-400">Today, 2:45 PM (24 min)</span>
                </div>
              </div>
              <div className="h-8 w-px bg-white/20 hidden sm:block" />
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-400" />
                <div>
                  <span className="text-[10px] uppercase text-[#94A3B8] block">Speed / Dist</span>
                  <span className="font-semibold text-white">42 km/h • 4.2 km remaining</span>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="relative z-20 mt-auto pt-3 flex items-center justify-between text-xs text-gray-300">
              <span className="flex items-center gap-1.5 text-[11px] bg-white/10 px-2.5 py-1 rounded-lg border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C2A676]" />
                Tamper-Proof Smart Vault Seal Intact
              </span>
              <span className="text-[11px] text-[#94A3B8]">Driver GPS updated 2s ago</span>
            </div>
          </div>

          {/* Right Panel: Driver & Timeline Info */}
          <div className="p-6 bg-[#FAF8F5] dark:bg-[#162038] space-y-6 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#E2E8F0] dark:border-[#1E293B]">
            
            {/* Courier Driver Card */}
            <div className="bg-white dark:bg-[#1E293B] p-4 rounded-xl border border-[#E2E8F0] dark:border-[#334155] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#64748B] dark:text-[#94A3B8]">
                  Assigned Concierge Driver
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                  Verified Agent
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#1E40AF] to-[#C2A676] p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-[#1E293B] flex items-center justify-center text-white font-bold text-sm">
                    VS
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E293B] dark:text-white">Vikram Singh</h4>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Senior VIP Courier • ⭐ 4.98 (840+ deliveries)</p>
                  <p className="text-[11px] text-[#C2A676] font-medium mt-0.5">Electric Express Van #MH02EL2026</p>
                </div>
              </div>

              {/* Action Buttons: Call & Note */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setShowPhoneModal(true)}
                  className="btn-sheen px-3 py-2 bg-[#1E40AF] hover:bg-[#1D4ED8] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Driver</span>
                </button>
                <button
                  onClick={() => {
                    setDeliveryNoteSent(true);
                    setTimeout(() => setDeliveryNoteSent(false), 3000);
                  }}
                  className="btn-sheen px-3 py-2 bg-white dark:bg-[#0F172A] border border-[#CBD5E1] dark:border-[#334155] text-[#1E293B] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B] rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#C2A676]" />
                  <span>{deliveryNoteSent ? 'Note Sent!' : 'Leave Note'}</span>
                </button>
              </div>
            </div>

            {/* Live Logistics Milestones */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B] dark:text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C2A676]" />
                <span>Live Route Milestones</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950/60" />
                    <div className="w-0.5 h-8 bg-emerald-500/40" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E293B] dark:text-white">Dispatched from Bandra Hub</p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Today, 1:15 PM • Package verified & sealed</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse ring-4 ring-blue-100 dark:ring-blue-950/60" />
                    <div className="w-0.5 h-8 bg-gray-300 dark:bg-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-blue-600 dark:text-blue-400">Out for Delivery (In Transit)</p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Passing Western Express Highway (4.2 km away)</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start opacity-60">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-700" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1E293B] dark:text-white">Destination Arrival & Handover</p>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Expected to {recipientName} • ~2:45 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Guarantee */}
            <div className="p-3 rounded-xl bg-[#C2A676]/10 border border-[#C2A676]/30 text-xs text-[#1E293B] dark:text-[#F1F5F9] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C2A676] shrink-0" />
              <span className="text-[11px]">
                Requires OTP Verification upon arrival for luxury asset security.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Driver Direct Phone Dial Modal */}
      {showPhoneModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-[#1E293B] p-6 rounded-2xl border border-[#C2A676]/40 shadow-2xl text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1E40AF] text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1E293B] dark:text-white">Connecting Concierge Dial...</h3>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">Vikram Singh (+91 98200-XXXXX)</p>
              <p className="text-[11px] font-mono text-[#C2A676] mt-2">Connecting via Encrypted VIP Line...</p>
            </div>
            <button
              onClick={() => setShowPhoneModal(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-md"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
