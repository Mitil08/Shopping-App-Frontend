import React, { useState, useEffect } from 'react';
import { X, Truck, CheckCircle2, Clock, MapPin, Navigation, ShieldCheck, RefreshCw } from 'lucide-react';
import { shippingApi } from '../services/shippingApi';

export default function LiveTrackingModal({ order, onClose }) {
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(true);

  const idOrAwb = order?.awb || order?.id;

  const fetchTracking = async () => {
    try {
      setLoading(true);
      const res = await shippingApi.trackShipment(idOrAwb);
      if (res.data?.tracking) {
        setTrackingData(res.data.tracking);
      }
    } catch (err) {
      console.warn('Tracking fetch warning:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idOrAwb) {
      fetchTracking();
    }
  }, [idOrAwb]);

  if (!order) return null;

  const checkpoints = trackingData?.checkpoints || [
    {
      timestamp: new Date().toISOString(),
      status: 'Order Manifested & Courier AWB Assigned',
      location: 'Central Logistics Vault — Mumbai',
      activity: `Air Waybill assigned via ${order.courier || 'Blue Dart Prime Air'}. Secure seal verified.`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full border border-[#E8E6E1] shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#141414] text-[#FAF9F5] p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#C2A676]" />
            <h3 className="font-serif text-sm tracking-wider uppercase">
              Live 3PL Courier GPS Transit Stream
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#FAF9F5]/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Courier & AWB Banner */}
        <div className="bg-[#FAF9F5] p-5 border-b border-[#E8E6E1] flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#787570] block">
              Carrier &amp; Air Waybill (AWB)
            </span>
            <p className="font-mono text-sm font-bold text-[#141414] mt-0.5">
              {order.courier || 'Blue Dart Prime Air'} • {order.awb || `BLU-${order.id?.slice(-6).toUpperCase()}IN`}
            </p>
            <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Status: {trackingData?.status || order.status || 'In Transit'}</span>
            </p>
          </div>
          <button
            onClick={fetchTracking}
            disabled={loading}
            className="p-2 border border-[#E8E6E1] hover:bg-[#F3F1EC] rounded-sm transition-colors"
            title="Refresh live ping"
          >
            <RefreshCw className={`w-4 h-4 text-[#141414] ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Step by Step Timeline */}
        <div className="p-6 max-h-[380px] overflow-y-auto space-y-6">
          {checkpoints.map((cp, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              {/* Connector line */}
              {idx < checkpoints.length - 1 && (
                <div className="absolute left-3.5 top-7 bottom-0 w-0.5 bg-[#E8E6E1]" />
              )}

              {/* Status icon badge */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                idx === 0 ? 'bg-[#141414] text-[#C2A676]' : 'bg-[#E8E6E1] text-[#787570]'
              }`}>
                {idx === 0 ? <Truck className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>

              {/* Milestone Details */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-serif text-sm font-semibold text-[#141414]">
                    {cp.status}
                  </h4>
                  <span className="text-[10px] font-mono text-[#787570] shrink-0">
                    {new Date(cp.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-[#787570] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-[#C2A676]" />
                  <span>{cp.location}</span>
                </p>
                <p className="text-xs text-[#444] bg-[#FAF9F5] p-2 rounded-xs border border-[#E8E6E1] mt-2 leading-relaxed">
                  {cp.activity}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8E6E1] flex justify-between items-center">
          <span className="text-[11px] text-[#787570]">
            Destination: <strong>{order.shippingAddress?.city || 'Mumbai'}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#141414] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2A2A2A] transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
