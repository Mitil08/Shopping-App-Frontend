import React from 'react';
import { X, Printer, ShieldCheck, Download, Truck } from 'lucide-react';

export default function ShippingLabelModal({ order, onClose }) {
  if (!order) return null;

  const awbCode = order.awb || `BLU-${order.id?.slice(-6).toUpperCase()}IN`;
  const courier = order.courier || 'Blue Dart Prime Air';
  const labelUrl = `http://localhost:5000/api/shipping/label/${order.id}`;

  const handlePrint = () => {
    const printWindow = window.open(labelUrl, '_blank', 'width=600,height=800');
    if (printWindow) {
      printWindow.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-xl w-full border border-[#E8E6E1] shadow-2xl rounded-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-[#141414] text-[#FAF9F5] p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#C2A676]" />
            <h3 className="font-serif text-sm tracking-wider uppercase">
              3PL Courier Dispatch Manifest &amp; AWB Label
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#FAF9F5]/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body / Label Preview */}
        <div className="p-6 bg-[#FAF9F5]">
          <div className="bg-white border-2 border-dashed border-[#141414] p-5 shadow-xs">
            {/* Top Barcode Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-3">
              <div>
                <h2 className="font-serif text-xl tracking-[0.2em] font-black uppercase text-black">
                  É L A N E
                </h2>
                <p className="text-[8px] uppercase tracking-widest text-[#787570]">
                  Haute Maroquinerie • Logistics Hub
                </p>
              </div>
              <div className="text-right">
                <span className="bg-black text-white text-[10px] uppercase font-mono font-bold px-2 py-1">
                  {courier}
                </span>
                <p className="text-[9px] font-mono text-gray-600 mt-1">Priority White-Glove Air</p>
              </div>
            </div>

            {/* Barcode Visual */}
            <div className="text-center py-2 border-b border-black">
              <div className="inline-block tracking-widest text-lg font-mono font-black py-1">
                ||| | |||| | || ||||| ||| | ||| |||| |
              </div>
              <div className="font-mono text-xs font-bold tracking-[0.25em] text-black">
                {awbCode}
              </div>
            </div>

            {/* Recipient / Delivery Info */}
            <div className="grid grid-cols-2 gap-4 py-3 border-b border-black text-xs">
              <div>
                <span className="text-[9px] uppercase font-bold text-gray-500 block">Deliver To:</span>
                <p className="font-bold text-black text-sm mt-0.5">
                  {order.customer || order.shippingAddress?.name || 'Valued Patron'}
                </p>
                <p className="text-gray-700 text-[11px] leading-tight mt-0.5">
                  {order.shippingAddress?.street || 'Flagship Residence'}<br />
                  {order.shippingAddress?.city || 'Mumbai'}, {order.shippingAddress?.state || 'MH'} - {order.shippingAddress?.postalCode || '400001'}
                </p>
                <p className="text-[10px] text-gray-600 mt-1 font-mono">
                  Tel: {order.shippingAddress?.phone || '+91 98765 43210'}
                </p>
              </div>
              <div className="bg-[#F3F1EC] p-2.5 flex flex-col justify-between border border-[#E8E6E1]">
                <div>
                  <span className="text-[8px] uppercase font-bold text-gray-500 block">Payment Mode:</span>
                  <p className="font-bold text-xs text-emerald-800 uppercase mt-0.5">
                    {order.paymentMethod === 'cod' ? 'CASH ON DELIVERY' : 'PREPAID VERIFIED'}
                  </p>
                </div>
                <div>
                  <span className="text-[8px] uppercase font-bold text-gray-500 block">Order Ref:</span>
                  <p className="font-mono text-[11px] font-bold text-black">{order.id}</p>
                </div>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="flex justify-between items-center pt-2 text-[9px] text-gray-500 font-mono">
              <span>Origin: Central Atelier Hub</span>
              <span>Routing: BOM-EXP-01</span>
              <span>Weight: 1.25 KG</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-t border-[#E8E6E1] flex justify-between items-center">
          <span className="text-xs text-[#787570] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Official 4x6" Thermal Standard Compliant</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#E8E6E1] text-xs font-semibold uppercase tracking-wider text-[#141414] hover:bg-[#F3F1EC] transition-colors"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="px-5 py-2 bg-[#141414] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-[#2A2A2A] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Thermal Label</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
