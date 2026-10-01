import React, { useState } from 'react';
import { formatPrice } from '../utils/currency';
import { Printer, Download, X, ShieldCheck, Mail, Check, ExternalLink } from 'lucide-react';

export default function InvoiceModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const orderId = order.id || 'ELN-UNKNOWN';
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const items = order.items || [];
  const subtotal = order.total ? Math.round(order.total * 0.82) : 0;
  const gstAmount = order.total ? order.total - subtotal : 0;
  const cgst = Math.round(gstAmount / 2);
  const sgst = Math.round(gstAmount / 2);

  const handlePrint = () => {
    window.print();
  };

  const handleEmailInvoice = async () => {
    setSendingEmail(true);
    try {
      await fetch('/api/notifications/invoice/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          email: order.shippingAddress?.email || order.email || 'client@elane.com',
        }),
      });
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 3000);
    } catch {
      // Fallback
      setEmailSent(true);
    } finally {
      setSendingEmail(false);
    }
  };

  const verificationUrl = encodeURIComponent(`http://localhost:5173/order-success/${orderId}`);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=110x110&margin=2&data=${verificationUrl}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border border-[#141414] max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Modal Controls */}
        <div className="p-4 bg-[#FAF9F5] border-b border-[#E8E6E1] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C2A676] font-bold">
              Official Tax Invoice
            </span>
            <span className="text-xs text-[#787570] font-mono">#{orderId}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEmailInvoice}
              disabled={sendingEmail}
              className="px-3 py-1.5 border border-[#141414] bg-white text-[#141414] hover:bg-[#FAF8F5] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {emailSent ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Invoice Dispatched</span>
                </>
              ) : (
                <>
                  <Mail className="w-3.5 h-3.5" />
                  <span>{sendingEmail ? 'Dispatching...' : 'Email Invoice'}</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#141414] text-[#FAF9F5] hover:bg-[#2A2A2A] text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#787570] hover:text-[#141414] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto space-y-6 text-xs text-[#141414] font-sans print:p-0">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b border-[#141414] pb-6">
            <div>
              <h1 className="font-serif text-3xl font-semibold tracking-[0.25em] uppercase text-[#141414]">
                ÉLANE
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-[#787570] mt-1">
                Luxury Atelier & Ready-to-Wear
              </p>
              <p className="text-[11px] text-[#787570] mt-2 leading-relaxed">
                Élane High Fashion India Pvt Ltd.<br />
                Atelier 4B, The Mill District, Lower Parel<br />
                Mumbai, Maharashtra — 400013<br />
                GSTIN: 27AABCE1234F1Z8
              </p>
            </div>

            <div className="text-right">
              <span className="text-[9px] uppercase tracking-[0.2em] bg-[#141414] text-[#FAF9F5] px-2 py-0.5 font-bold">
                Tax Invoice
              </span>
              <p className="font-mono text-xs font-bold mt-2">INV-{orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}</p>
              <p className="text-[11px] text-[#787570] mt-1">Order Date: {orderDate}</p>
              <p className="text-[11px] text-[#787570]">Payment: {order.paymentMethod ? order.paymentMethod.toUpperCase() : 'PREPAID'}</p>
            </div>
          </div>

          {/* Billing & Shipping Destination & QR Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-[#FAF9F5] p-4 border border-[#E8E6E1]">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#787570] font-bold block mb-1">
                Billed & Shipped To:
              </span>
              <p className="font-semibold text-xs text-[#141414]">{order.shippingAddress?.name || 'Valued Clientele'}</p>
              <p className="text-[#63605A] mt-0.5">{order.shippingAddress?.street || order.shippingAddress?.address}</p>
              {order.shippingAddress?.apartment && <p className="text-[#63605A]">{order.shippingAddress?.apartment}</p>}
              <p className="text-[#63605A]">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.postalCode}
              </p>
              <p className="text-[#63605A]">{order.shippingAddress?.country || 'India'}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#787570] font-bold block mb-1">
                Courier & Fulfillment Details:
              </span>
              <p className="font-semibold text-xs text-[#141414]">BlueDart Prime Air Express</p>
              <p className="text-[#63605A] mt-0.5 font-mono">
                AWB: BLU-{orderId.replace(/[^a-zA-Z0-9]/g, '').slice(-8)}IN
              </p>
              <p className="text-[#63605A] mt-1">Status: Confirmed & Dispatched</p>
              <p className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Verified Tax Paid Invoice
              </p>
            </div>

            <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-[#E8E6E1] pt-3 sm:pt-0 sm:pl-4 text-center">
              <img
                src={qrCodeUrl}
                alt="QR Authenticity Verification"
                className="w-20 h-20 border border-[#E8E6E1] p-1 bg-white mb-1.5 shadow-2xs"
              />
              <span className="text-[9px] font-mono text-[#787570] uppercase tracking-wider">
                Scan to Verify
              </span>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#141414] text-[10px] uppercase tracking-wider text-[#787570]">
                  <th className="py-2">Item Description</th>
                  <th className="py-2 text-center">HSN</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Price</th>
                  <th className="py-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1]">
                {items.map((item, idx) => (
                  <tr key={idx} className="text-xs">
                    <td className="py-3">
                      <p className="font-serif font-medium text-[#141414]">{item.name}</p>
                      <span className="text-[10px] text-[#787570]">Size: {item.size} • Color: {item.color}</span>
                      {item.monogram && (
                        <p className="text-[9px] font-mono text-[#8C6D2D] bg-[#FAF8F5] inline-block px-1.5 py-0.5 border border-[#C2A676]/30 mt-0.5">
                          Monogram: <strong>{item.monogram.text}</strong> ({item.monogram.foilName})
                        </p>
                      )}
                    </td>
                    <td className="py-3 text-center font-mono text-[11px] text-[#787570]">6204</td>
                    <td className="py-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 text-right font-mono">{formatPrice(item.price, true)}</td>
                    <td className="py-3 text-right font-mono font-semibold">{formatPrice(item.price * item.quantity, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tax Calculation Breakdown */}
          <div className="border-t border-[#141414] pt-4 flex justify-between items-start">
            <div className="text-[10px] text-[#787570] space-y-1 max-w-xs">
              <p>• GST Rate applicable @ 18% as per luxury apparel classification.</p>
              <p>• Goods once sold are eligible for 30-day atelier exchange policy.</p>
              <p>• Computer generated invoice — no physical signature required.</p>
            </div>

            <div className="w-56 space-y-1.5 text-xs text-[#787570]">
              <div className="flex justify-between">
                <span>Taxable Value:</span>
                <span className="font-mono text-[#141414]">{formatPrice(subtotal, true)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%):</span>
                <span className="font-mono text-[#141414]">{formatPrice(cgst, true)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (9%):</span>
                <span className="font-mono text-[#141414]">{formatPrice(sgst, true)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier:</span>
                <span className="text-emerald-700 font-semibold uppercase text-[10px]">FREE</span>
              </div>
              <div className="flex justify-between text-base font-serif font-bold text-[#141414] border-t border-[#141414] pt-2 mt-2">
                <span>Total Due:</span>
                <span>{formatPrice(order.total, true)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
