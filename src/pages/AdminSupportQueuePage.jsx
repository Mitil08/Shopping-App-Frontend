import React, { useState } from 'react';
import {
  Headphones,
  MessageCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Send,
  Phone,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Search,
  Check
} from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function AdminSupportQueuePage() {
  const [selectedTicketId, setSelectedTicketId] = useState('TCK-8921');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'open' | 'in_progress' | 'resolved'
  const [replyText, setReplyText] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: 'TCK-8921',
      customerName: 'Aarav Malhotra',
      email: 'aarav.m@luxuryclient.in',
      phone: '+91 98314 42051',
      subject: 'Size exchange inquiry for Atelier Trench Coat',
      category: 'Size Exchange',
      urgency: 'high',
      status: 'open',
      orderId: 'ORD-L89K2-4912',
      garment: 'Structured Trench with Storm Flap (Sand / Size L)',
      createdAt: '15 mins ago',
      messages: [
        {
          sender: 'customer',
          time: '15 mins ago',
          text: "Hello Concierge desk, I received my Structured Trench today. The craftsmanship is magnificent, however the chest is slightly broad for my silhouette. I would like to exchange it for Size M without returning the whole order."
        }
      ]
    },
    {
      id: 'TCK-8894',
      customerName: 'Priya Singhania',
      email: 'priya.s@atelierclub.com',
      phone: '+91 98765 12345',
      subject: 'Expedited Dispatch for Wedding Gala',
      category: 'Priority Dispatch',
      urgency: 'medium',
      status: 'in_progress',
      orderId: 'ORD-K71M4-9210',
      garment: 'Silk & Virgin Wool Relaxed Blazer (Noir / Size S)',
      createdAt: '2 hours ago',
      messages: [
        {
          sender: 'customer',
          time: '2 hours ago',
          text: "Can you confirm if Blue Dart can deliver by tomorrow 3 PM to Delhi? It's for an evening banquet."
        },
        {
          sender: 'agent',
          time: '1 hour ago',
          text: "Greetings Mrs. Singhania, our dispatch manager has marked your order as Priority Air. We have assigned Blue Dart Express AWB BLU-78910IN for next-day 1 PM delivery."
        }
      ]
    },
    {
      id: 'TCK-8742',
      customerName: 'Rohit Mehta',
      email: 'rohit.mehta@mumbaicapital.com',
      phone: '+91 98111 22334',
      subject: 'Custom monogramming request on leather tote',
      category: 'Bespoke Customization',
      urgency: 'low',
      status: 'resolved',
      orderId: 'ORD-B23V8-1049',
      garment: 'Full-Grain Italian Leather Tote',
      createdAt: 'Yesterday',
      messages: [
        {
          sender: 'customer',
          time: 'Yesterday',
          text: "I forgot to add gold embossed initials 'R.M.' during checkout. Can this still be engraved before sealing the box?"
        },
        {
          sender: 'agent',
          time: 'Yesterday',
          text: "Certainly Mr. Mehta. Our master leather artisan has completed the 24K gold foil debossing of 'R.M.' on the front tag."
        }
      ]
    }
  ]);

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const newMsg = {
      sender: 'agent',
      time: 'Just now',
      text: replyText.trim()
    };

    setTickets((prev) =>
      prev.map((t) =>
        t.id === selectedTicket.id
          ? { ...t, status: 'in_progress', messages: [...t.messages, newMsg] }
          : t
      )
    );
    setReplyText('');
  };

  const handleMarkStatus = (newStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: newStatus } : t))
    );
  };

  // Launch WhatsApp Chat directly with customer
  const handleLaunchWhatsApp = () => {
    if (!selectedTicket?.phone) return;
    const cleanPhone = selectedTicket.phone.replace(/[^0-9]/g, '');
    const prefilledText = encodeURIComponent(
      `Hello ${selectedTicket.customerName}, this is the ÉLANE Luxury Concierge Team regarding your request (${selectedTicket.id}) for order ${selectedTicket.orderId}. How may we assist you further?`
    );
    window.open(`https://api.whatsapp.com/send?phone=${cleanPhone}&text=${prefilledText}`, '_blank');
  };

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus === 'all') return true;
    return t.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C2A676] font-semibold flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5" />
            Client Care Sanctuary
          </span>
          <h1 className="font-serif text-3xl text-[#141414] font-normal uppercase mt-0.5">
            Support Escalation & Live Queue
          </h1>
          <p className="text-xs text-[#787570] mt-1">
            Resolve customer return/exchange tickets, bespoke alterations, and 1-click WhatsApp escalations
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white border border-[#E8E6E1] p-1 self-start sm:self-auto">
          {['all', 'open', 'in_progress', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider transition-all ${
                filterStatus === st
                  ? 'bg-[#141414] text-white font-bold'
                  : 'text-[#787570] hover:text-[#141414]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Support Grid (4 cols list, 8 cols active chat/ticket) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[580px]">
        
        {/* Left Column: Tickets Queue List (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E8E6E1] p-4 flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E6E1] text-xs">
            <span className="font-bold uppercase tracking-wider text-[#141414] flex items-center gap-1.5">
              Active Cases ({filteredTickets.length})
            </span>
            <span className="text-[10px] font-mono text-[#787570]">Ranked by urgency</span>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[540px] pr-1">
            {filteredTickets.map((t) => {
              const isSelected = selectedTicket?.id === t.id;

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTicketId(t.id)}
                  className={`p-3.5 border transition-all cursor-pointer text-left space-y-2 relative ${
                    isSelected
                      ? 'border-[#141414] bg-[#FAF9F5] shadow-xs'
                      : 'border-[#E8E6E1] bg-white hover:border-[#141414]/50'
                  }`}
                >
                  {/* Urgency Dot */}
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#C2A676] font-bold">
                      {t.id} • {t.category}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.2 font-bold ${
                        t.urgency === 'high'
                          ? 'bg-rose-100 text-rose-800'
                          : t.urgency === 'medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {t.urgency}
                    </span>
                  </div>

                  <h4 className="font-serif text-xs font-semibold text-[#141414] truncate">
                    {t.subject}
                  </h4>

                  <p className="text-[11px] text-[#787570] truncate line-clamp-1">
                    {t.messages[t.messages.length - 1]?.text}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#A3A099] pt-1 border-t border-[#E8E6E1]/60">
                    <span className="font-medium text-[#141414]">{t.customerName}</span>
                    <span>{t.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & WhatsApp Escalation (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E6E1] p-6 flex flex-col justify-between space-y-4">
          
          {/* Header of Active Ticket */}
          <div className="border-b border-[#E8E6E1] pb-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#C2A676]">{selectedTicket.id}</span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#FAF9F5] border border-[#E8E6E1] text-[#141414] font-bold">
                    Order {selectedTicket.orderId}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-[#141414] mt-1 uppercase">
                  {selectedTicket.subject}
                </h3>
              </div>

              {/* Status Switcher Buttons */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  onClick={() => handleMarkStatus('open')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase ${
                    selectedTicket.status === 'open' ? 'bg-rose-700 text-white font-bold' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Open
                </button>
                <button
                  onClick={() => handleMarkStatus('in_progress')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase ${
                    selectedTicket.status === 'in_progress' ? 'bg-amber-700 text-white font-bold' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => handleMarkStatus('resolved')}
                  className={`px-2.5 py-1 text-[10px] font-mono uppercase ${
                    selectedTicket.status === 'resolved' ? 'bg-emerald-700 text-white font-bold' : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {/* Client Snapshot Strip */}
            <div className="p-3 bg-[#FAF9F5] border border-[#E8E6E1] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#141414] block">{selectedTicket.customerName}</span>
                <span className="text-[11px] text-[#787570] block">{selectedTicket.email} • {selectedTicket.phone}</span>
                <span className="text-[10px] text-[#C2A676] block">Item: {selectedTicket.garment}</span>
              </div>

              {/* Direct 1-Click WhatsApp Client Escalation Button */}
              <button
                type="button"
                onClick={handleLaunchWhatsApp}
                className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20BD5A] text-white text-[11px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                title="Launch WhatsApp chat with customer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Conversation Messages Thread */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[320px]">
            {selectedTicket.messages.map((m, idx) => {
              const isAgent = m.sender === 'agent';

              return (
                <div key={idx} className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-none max-w-[85%] text-xs leading-relaxed ${
                      isAgent
                        ? 'bg-[#141414] text-[#FAF9F5]'
                        : 'bg-[#F2EFE9] text-[#141414] border border-[#E8E6E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono uppercase mb-1 gap-4 opacity-75">
                      <span>{isAgent ? 'ÉLANE Concierge Support' : selectedTicket.customerName}</span>
                      <span>{m.time}</span>
                    </div>
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Internal Reply Composer */}
          <form onSubmit={handleSendReply} className="pt-3 border-t border-[#E8E6E1] space-y-2">
            <textarea
              rows={3}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type official clientele resolution or dispatch courier update..."
              className="w-full bg-[#FAF9F5] border border-[#E8E6E1] p-3 text-xs text-[#141414] focus:outline-none focus:border-[#141414] resize-none"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-[#787570]">
                Customer receives instant notification in app & via email/WhatsApp.
              </span>
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-5 py-2.5 bg-[#141414] text-white text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Reply</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
}
