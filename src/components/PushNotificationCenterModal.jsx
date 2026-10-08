import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  X, 
  CheckCheck, 
  Trash2, 
  Sparkles, 
  Crown, 
  ShoppingBag, 
  ExternalLink,
  Send,
  ShieldCheck
} from 'lucide-react';
import { pushNotificationService } from '../services/pushNotificationService';
import { triggerHaptic } from '../utils/haptics';

export default function PushNotificationCenterModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Load initial
    setNotifications(pushNotificationService.getNotifications());

    // Subscribe to real-time additions
    const unsubscribe = pushNotificationService.subscribe((updated) => {
      setNotifications(updated);
    });

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAllRead = () => {
    pushNotificationService.markAllAsRead();
    triggerHaptic('medium');
  };

  const handleItemClick = (item) => {
    pushNotificationService.markAsRead(item.id);
    if (item.data?.route) {
      onClose();
      navigate(item.data.route);
    }
  };

  const handleDeleteItem = (e, id) => {
    e.stopPropagation();
    pushNotificationService.deleteNotification(id);
  };

  const handleSendTestDispatch = async () => {
    setTestSent(true);
    await pushNotificationService.dispatchTestPush({
      title: 'Maison ÉLANE: Secret Vault Allocation',
      body: 'Your custom Como Silk foulard has been reserved with complimentary express delivery.',
      category: 'vault',
      route: '/shop'
    });
    setTimeout(() => setTestSent(false), 2500);
  };

  const handleRequestPermission = async () => {
    const granted = await pushNotificationService.requestPermission();
    if (granted) {
      triggerHaptic('success');
    }
  };

  const filteredList = notifications.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'vip') return item.category === 'vip' || item.category === 'vault';
    if (filter === 'orders') return item.category === 'orders' || item.category === 'shipping';
    return item.category === filter;
  });

  const unreadCount = pushNotificationService.getUnreadCount();

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'vault':
      case 'vip':
        return <Crown className="w-4 h-4 text-amber-400" />;
      case 'orders':
      case 'shipping':
        return <ShoppingBag className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-300" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-md bg-[#FAF8F5] dark:bg-[#0B1410] border border-amber-900/20 dark:border-emerald-800/30 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#064E3B] via-[#043E30] to-[#022C22] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
              <Bell className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
                Atelier Dispatches
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-amber-400 text-[#064E3B] font-extrabold px-1.5 py-0.2 rounded-full">
                    {unreadCount} NEW
                  </span>
                )}
              </h2>
              <p className="text-[10px] text-emerald-200/80 font-light">Exclusive alerts & order updates</p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Filter Bar & Controls */}
        <div className="px-3 py-2 bg-stone-100 dark:bg-[#07130F] border-b border-stone-200 dark:border-emerald-900/30 flex items-center justify-between gap-2">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'vip', label: 'VIP Drops' },
              { id: 'orders', label: 'Orders' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  setFilter(f.id);
                  triggerHaptic('light');
                }}
                className={`text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap transition-all font-medium ${
                  filter === f.id
                    ? 'bg-[#064E3B] text-white dark:bg-emerald-600 shadow-xs'
                    : 'bg-white dark:bg-[#0E2018] text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-emerald-900/40'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-[10px] font-semibold text-[#064E3B] dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0 px-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-emerald-950/40 p-2 space-y-1">
          {filteredList.length === 0 ? (
            <div className="text-center py-12 px-4">
              <ShieldCheck className="w-10 h-10 text-stone-300 dark:text-emerald-900/60 mx-auto mb-2" />
              <p className="text-xs font-semibold text-stone-600 dark:text-stone-300">You're all caught up</p>
              <p className="text-[10px] text-stone-400 dark:text-stone-500 mt-1">
                Seasonal allocations and private dispatches will appear here.
              </p>
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3 rounded-xl transition-all cursor-pointer relative flex gap-3 items-start ${
                  !item.read
                    ? 'bg-amber-50/70 dark:bg-emerald-950/30 border border-amber-200/50 dark:border-emerald-800/30 shadow-xs'
                    : 'hover:bg-stone-50 dark:hover:bg-[#0e221a]'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-stone-100 dark:bg-[#0e221a] border border-stone-200 dark:border-emerald-800/50 flex items-center justify-center shrink-0 mt-0.5">
                  {getCategoryIcon(item.category)}
                </div>

                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`text-xs ${!item.read ? 'font-bold text-stone-900 dark:text-white' : 'font-medium text-stone-700 dark:text-stone-300'}`}>
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">
                    {item.body}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[9px] font-mono text-stone-400 dark:text-stone-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {item.data?.route && (
                      <span className="text-[9px] text-[#064E3B] dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                        View <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteItem(e, item.id)}
                  className="opacity-40 hover:opacity-100 p-1 text-stone-400 hover:text-red-500 transition-opacity"
                  title="Remove alert"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer with Push Permission & Test Simulation Actions */}
        <div className="p-3 bg-stone-50 dark:bg-[#07130F] border-t border-stone-200 dark:border-emerald-900/30 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={handleRequestPermission}
              className="flex-1 text-[11px] font-semibold text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-emerald-800/40 py-2 px-3 rounded-lg hover:bg-stone-100 dark:hover:bg-emerald-950/40 transition-colors flex items-center justify-center gap-1.5"
            >
              <Bell className="w-3.5 h-3.5 text-amber-500" />
              Enable Native Push
            </button>

            <button
              onClick={handleSendTestDispatch}
              disabled={testSent}
              className="flex-1 text-[11px] font-bold bg-gradient-to-r from-[#064E3B] to-[#043E30] text-amber-200 py-2 px-3 rounded-lg shadow-xs hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {testSent ? 'Dispatched!' : 'Send Test Alert'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
