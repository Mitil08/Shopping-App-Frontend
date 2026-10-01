import React, { useState } from 'react';
import { MessageCircle, Send, CheckCircle2, RefreshCw, Smartphone, ShieldCheck, Zap, Bell, Check } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function WhatsAppNotificationSimulator({ orders }) {
  const [selectedOrderId, setSelectedOrderId] = useState(orders?.[0]?.id || 'ORD-L89K2-4912');
  const [eventType, setEventType] = useState('dispatch'); // 'confirmed' | 'packed' | 'dispatch' | 'out_for_delivery' | 'delivered'
  const [targetPhone, setTargetPhone] = useState('+91 98765 43210');
  const [customCourier, setCustomCourier] = useState('Blue Dart Prime Air');
  const [awbCode, setAwbCode] = useState('BLU-89410294IN');
  const [simulating, setSimulating] = useState(false);
  const [sentLogs, setSentLogs] = useState([
    {
      id: 'log-1',
      recipient: '+91 9831442051',
      event: 'Order Confirmed',
      orderId: 'ORD-L89K2-4912',
      status: 'Delivered (HTTP 200 OK)',
      time: '12 mins ago'
    },
    {
      id: 'log-2',
      recipient: '+91 91234 56789',
      event: 'Dispatched via Air',
      orderId: 'ORD-K71M4-9210',
      status: 'Delivered (HTTP 200 OK)',
      time: '1 hour ago'
    }
  ]);

  const selectedOrder = orders?.find((o) => o.id === selectedOrderId) || orders?.[0];

  // Template message generator
  const getSimulatedMessage = () => {
    const orderRef = selectedOrder ? `#${selectedOrder.id}` : '#ELN-8941';
    const totalVal = selectedOrder ? formatPrice(selectedOrder.total, true) : '₹42,500';

    switch (eventType) {
      case 'confirmed':
        return `*ÉLANE LUXURY ATELIER — ORDER CONFIRMED* 🏛️\n\nDear Clientele, your order ${orderRef} for ${totalVal} has been authorized. Our master curators have begun preparing your acquisitions.\n\nEstimated dispatch: within 24 hours.`;
      case 'packed':
        return `*ÉLANE ATELIER — PACKED & SEALED* 📦✨\n\nYour items in order ${orderRef} have passed luxury quality inspection and are sealed in signature obsidian keepsake packaging with our tamper-proof wax seal.`;
      case 'dispatch':
        return `*ÉLANE DISPATCH ADVISORY — IN TRANSIT* ✈️🚚\n\nOrder ${orderRef} is airborne with ${customCourier}.\n\n*AWB Tracking #:* ${awbCode}\n*Status:* Next-Day Priority Delivery.`;
      case 'out_for_delivery':
        return `*ÉLANE CONCIERGE — OUT FOR DELIVERY TODAY* 📍\n\nYour courier agent is en route with order ${orderRef}. Please have your PIN code or authorization ready at delivery.`;
      case 'delivered':
        return `*ÉLANE DELIVERED — ENJOY YOUR ACQUISITION* 🥂\n\nOrder ${orderRef} has been delivered. Thank you for collecting ÉLANE. Access 30-day hassle-free returns or size exchanges any time in your account.`;
      default:
        return '';
    }
  };

  const handleSimulateWebhook = (e) => {
    e.preventDefault();
    setSimulating(true);

    const messageText = getSimulatedMessage();
    let cleanPhone = targetPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = `91${cleanPhone}`;
    }

    // Launch WhatsApp directly targeted to client number
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(messageText)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

    // Window navigation triggers direct WhatsApp Web or App
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Also notify backend API to register the dispatch in server-side logs and external webhooks
    fetch('/api/notifications/whatsapp/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone,
        orderId: selectedOrderId,
        customName: selectedOrder?.customer || 'ÉLANE VIP Connoisseur',
      }),
    }).catch((err) => console.warn('Backend notification trigger note:', err));

    setTimeout(() => {
      const eventLabels = {
        confirmed: 'Order Confirmed',
        packed: 'Atelier Packed',
        dispatch: 'Air Dispatched',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivery Completed'
      };

      const newLog = {
        id: `log-${Date.now()}`,
        recipient: targetPhone,
        event: eventLabels[eventType] || 'Notification Sent',
        orderId: selectedOrderId,
        status: 'Dispatched (Backend & Web App)',
        time: 'Just now'
      };

      setSentLogs((prev) => [newLog, ...prev]);
      setSimulating(false);
    }, 400);
  };

  return (
    <div className="bg-white dark:bg-[#161520] border border-[#25D366]/40 p-6 lg:p-8 space-y-6 shadow-sm">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E6E1] dark:border-[#2A2834] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-[#141414] dark:text-white">
                WhatsApp Automated Webhook & Dispatch Simulator
              </h2>
              <span className="text-[10px] font-mono uppercase bg-[#25D366]/15 text-[#25D366] px-2 py-0.5 font-bold">
                Live Console
              </span>
            </div>
            <p className="text-xs text-[#787570] dark:text-[#A3A099]">
              Test and trigger simulated automated WhatsApp Cloud API notifications for courier dispatch, out-for-delivery, and payment receipts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#25D366] bg-[#25D366]/10 px-3 py-1.5 rounded-full border border-[#25D366]/30 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
          <span>Meta WhatsApp Cloud API: Active</span>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Form: Trigger Controls (7 cols) */}
        <form onSubmit={handleSimulateWebhook} className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] dark:text-[#A3A099] font-medium mb-1">
                Select Client Order
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834] px-3 py-2 text-xs text-[#141414] dark:text-white focus:outline-none focus:border-[#25D366] font-mono cursor-pointer"
              >
                {orders?.map((ord) => (
                  <option key={ord.id} value={ord.id}>
                    {ord.id} ({ord.customer || 'Client'} • {formatPrice(ord.total, true)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] dark:text-[#A3A099] font-medium mb-1">
                Notification Trigger Event
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834] px-3 py-2 text-xs text-[#141414] dark:text-white focus:outline-none focus:border-[#25D366] font-mono cursor-pointer"
              >
                <option value="confirmed">1. Order Confirmed & Receipt</option>
                <option value="packed">2. Atelier Quality Packed</option>
                <option value="dispatch">3. Air Dispatch & AWB Assigned</option>
                <option value="out_for_delivery">4. Out for Delivery (Agent En Route)</option>
                <option value="delivered">5. Delivery Successful</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] dark:text-[#A3A099] font-medium mb-1">
                Client Phone Number (WhatsApp)
              </label>
              <input
                type="text"
                value={targetPhone}
                onChange={(e) => setTargetPhone(e.target.value)}
                className="w-full bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834] px-3 py-2 text-xs text-[#141414] dark:text-white focus:outline-none focus:border-[#25D366] font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-[#787570] dark:text-[#A3A099] font-medium mb-1">
                Airway Bill (AWB) Code
              </label>
              <input
                type="text"
                value={awbCode}
                onChange={(e) => setAwbCode(e.target.value)}
                className="w-full bg-[#FAF9F5] dark:bg-[#121118] border border-[#E8E6E1] dark:border-[#2A2834] px-3 py-2 text-xs text-[#141414] dark:text-white focus:outline-none focus:border-[#25D366] font-mono"
              />
            </div>
          </div>

          {/* Trigger Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={simulating}
              className="w-full sm:w-auto px-8 py-3 bg-[#25D366] hover:bg-[#20BD5A] text-white text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              {simulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Dispatching Webhook...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Automated WhatsApp Notification</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right: Live WhatsApp Phone Message Mockup (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-[#EFEAE2] dark:bg-[#0B141A] p-4 rounded-2xl border border-[#D1D7DB] dark:border-[#2A2834] relative shadow-inner">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-black/10 dark:border-white/10">
              <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white text-[10px] font-bold">
                É
              </div>
              <div>
                <span className="text-xs font-bold text-[#141414] dark:text-white block">ÉLANE Luxury Atelier</span>
                <span className="text-[9px] text-[#25D366] block">Verified Business Account ✓</span>
              </div>
            </div>

            {/* Bubble */}
            <div className="bg-white dark:bg-[#202C33] text-[#141414] dark:text-white p-3 rounded-lg text-[11px] font-mono whitespace-pre-line leading-relaxed shadow-xs relative">
              {getSimulatedMessage()}
              <div className="text-right text-[9px] text-[#8696A0] mt-1 flex items-center justify-end gap-1">
                <span>18:54</span>
                <span className="text-[#53BDEB]">✓✓</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-[#787570] dark:text-[#A3A099]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366]" />
              HMAC SHA-256 Webhook Signing
            </span>
            <span className="font-mono">Payload: JSON</span>
          </div>
        </div>

      </div>

      {/* Audit Log Table */}
      <div className="pt-4 border-t border-[#E8E6E1] dark:border-[#2A2834]">
        <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#141414] dark:text-white mb-3">
          Recent WhatsApp Webhook Activity Logs
        </h4>
        <div className="divide-y divide-[#E8E6E1] dark:divide-[#26242E] text-xs font-mono">
          {sentLogs.map((log) => (
            <div key={log.id} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                <span className="font-bold text-[#141414] dark:text-white">{log.event}</span>
                <span className="text-[#787570] dark:text-[#A3A099]">to {log.recipient}</span>
                <span className="text-[#C2A676]">({log.orderId})</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{log.status}</span>
                <span className="text-[#787570] dark:text-[#A3A099]">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
