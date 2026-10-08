import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { triggerHaptic } from '../utils/haptics';

const OfflineContext = createContext(null);
const OFFLINE_QUEUE_KEY = 'elane_offline_sync_queue';

export function OfflineProvider({ children }) {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [justReconnected, setJustReconnected] = useState(false);
  const [syncQueue, setSyncQueue] = useState(() => {
    try {
      const saved = localStorage.getItem(OFFLINE_QUEUE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save sync queue
  useEffect(() => {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(syncQueue));
    } catch (e) {
      console.error('Failed to save offline sync queue:', e);
    }
  }, [syncQueue]);

  // Online / Offline Listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setJustReconnected(true);
      triggerHaptic('success');

      // Clear the banner after 4 seconds
      const timer = setTimeout(() => {
        setJustReconnected(false);
      }, 4000);

      // Process any pending queued actions
      if (syncQueue.length > 0) {
        console.log(`[ÉLANE Offline Sync] Synchronizing ${syncQueue.length} offline actions...`);
        // Simulating batch sync resolution
        setTimeout(() => {
          setSyncQueue([]);
          try {
            localStorage.removeItem(OFFLINE_QUEUE_KEY);
          } catch {}
        }, 800);
      }

      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setJustReconnected(false);
      triggerHaptic('warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueue]);

  /**
   * Queue an action to sync when back online
   */
  const queueAction = useCallback((action) => {
    const newItem = {
      id: 'queue_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      ...action
    };
    setSyncQueue((prev) => [...prev, newItem]);
    triggerHaptic('light');
    return newItem;
  }, []);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        justReconnected,
        syncQueue,
        queueAction
      }}
    >
      {/* Offline Alert Banner */}
      {!isOnline && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-0 inset-x-0 z-50 bg-gradient-to-r from-stone-900 via-neutral-900 to-stone-900 text-amber-200/90 border-b border-amber-600/30 px-3 py-1.5 text-center text-xs font-medium shadow-lg flex items-center justify-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
          <span>Atelier Offline Mode &mdash; Browsing cached collections. Changes will sync when reconnected.</span>
        </aside>
      )}

      {/* Just Reconnected Banner */}
      {justReconnected && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed top-0 inset-x-0 z-50 bg-emerald-900 text-emerald-100 border-b border-emerald-500/40 px-3 py-1.5 text-center text-xs font-medium shadow-lg flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>Connection Restored &mdash; Atelier synchronized successfully.</span>
        </aside>
      )}

      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
