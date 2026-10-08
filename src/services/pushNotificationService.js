import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { triggerHaptic } from '../utils/haptics';

const NOTIFICATIONS_STORAGE_KEY = 'elane_atelier_notifications';
const PUSH_TOKEN_STORAGE_KEY = 'elane_push_device_token';

// Default luxury notification dispatches for initial patron experience
const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_welcome',
    title: 'Maison ÉLANE Atelier Privilège',
    body: 'Welcome to ÉLANE. Your bespoke seasonal wardrobe allocation is active.',
    category: 'vip',
    timestamp: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    read: false,
    data: { route: '/society' }
  },
  {
    id: 'notif_flash_drop',
    title: 'Secret Vault Drop: Cashmere Overcoat',
    body: 'Only 3 pieces crafted in Como, Italy released to society patrons.',
    category: 'vault',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    read: true,
    data: { route: '/shop' }
  }
];

class PushNotificationService {
  constructor() {
    this.listeners = new Set();
    this.deviceToken = localStorage.getItem(PUSH_TOKEN_STORAGE_KEY) || null;
    this.isNative = Capacitor.isNativePlatform();
  }

  /**
   * Subscribe state listeners
   */
  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    const list = this.getNotifications();
    this.listeners.forEach((cb) => {
      try {
        cb(list);
      } catch (e) {
        console.error('Error notifying notification listener:', e);
      }
    });
  }

  /**
   * Get all stored notifications
   */
  getNotifications() {
    try {
      const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  }

  /**
   * Save notifications to storage
   */
  saveNotifications(notifications) {
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
      this.notifyListeners();
    } catch (e) {
      console.error('Failed to save notifications:', e);
    }
  }

  /**
   * Mark notification as read
   */
  markAsRead(id) {
    const list = this.getNotifications().map((item) =>
      item.id === id ? { ...item, read: true } : item
    );
    this.saveNotifications(list);
    triggerHaptic('light');
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead() {
    const list = this.getNotifications().map((item) => ({ ...item, read: true }));
    this.saveNotifications(list);
    triggerHaptic('medium');
  }

  /**
   * Clear notification by ID
   */
  deleteNotification(id) {
    const list = this.getNotifications().filter((item) => item.id !== id);
    this.saveNotifications(list);
    triggerHaptic('light');
  }

  /**
   * Get count of unread notifications
   */
  getUnreadCount() {
    return this.getNotifications().filter((n) => !n.read).length;
  }

  /**
   * Initialize Push Notification plugin or fallback
   */
  async initialize() {
    if (this.initialized) return;
    this.initialized = true;

    if (this.isNative) {
      try {
        let permStatus;
        try {
          permStatus = await PushNotifications.checkPermissions();
        } catch (e) {
          console.warn('[ÉLANE Push] checkPermissions fallback:', e);
          return;
        }

        if (permStatus?.receive === 'prompt' || permStatus?.receive === 'prompt-with-rationale') {
          try {
            permStatus = await PushNotifications.requestPermissions();
          } catch (e) {
            console.warn('[ÉLANE Push] requestPermissions fallback:', e);
          }
        }

        if (permStatus?.receive === 'granted') {
          // Listeners for token registration (register listeners before register() call)
          try {
            await PushNotifications.addListener('registration', (token) => {
              console.log('[ÉLANE Push] Registered with token:', token?.value);
              if (token?.value) {
                this.deviceToken = token.value;
                localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token.value);
              }
            });

            await PushNotifications.addListener('registrationError', (err) => {
              console.warn('[ÉLANE Push] Registration notification warning:', err);
            });

            // Incoming notification while app is in foreground
            await PushNotifications.addListener('pushNotificationReceived', (notification) => {
              console.log('[ÉLANE Push] Received in foreground:', notification);
              this.addNotification({
                id: 'push_' + Date.now(),
                title: notification?.title || 'Maison ÉLANE Dispatch',
                body: notification?.body || '',
                category: notification?.data?.category || 'general',
                timestamp: new Date().toISOString(),
                read: false,
                data: notification?.data || {}
              });
              triggerHaptic('success');
            });

            // Notification action (tap)
            await PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
              console.log('[ÉLANE Push] Notification tapped:', action);
              const route = action?.notification?.data?.route;
              if (route && window.location.pathname !== route) {
                window.location.href = route;
              }
            });

            // Register with Firebase messaging
            await PushNotifications.register().catch((err) => {
              console.warn('[ÉLANE Push] Safe registration notice:', err);
            });
          } catch (registerErr) {
            console.warn('[ÉLANE Push] Register sequence non-fatal warning:', registerErr);
          }
        }
      } catch (error) {
        console.warn('[ÉLANE Push] Native setup fallback:', error);
      }
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      // Browser Web Notifications fallback
      if (Notification.permission === 'default') {
        // Can request later when user interacts
      }
    }
  }

  /**
   * Add a new incoming notification
   */
  addNotification(item) {
    const current = this.getNotifications();
    const updated = [item, ...current];
    this.saveNotifications(updated);
    triggerHaptic('medium');
    return item;
  }

  /**
   * Trigger a test notification dispatch
   */
  async dispatchTestPush({ title, body, category = 'vip', route = '/' }) {
    triggerHaptic('success');
    const newNotif = {
      id: 'dispatch_' + Date.now(),
      title: title || 'Maison ÉLANE: Vault Allocation Ready',
      body: body || 'Your bespoke piece has been reserved with complimentary express delivery.',
      category,
      timestamp: new Date().toISOString(),
      read: false,
      data: { route }
    };

    this.addNotification(newNotif);

    // If browser supports web notification and granted, show system popup
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        });
      } catch {
        // Ignore web notification failure
      }
    }

    return newNotif;
  }

  /**
   * Request push permission explicitly
   */
  async requestPermission() {
    if (this.isNative) {
      try {
        const result = await PushNotifications.requestPermissions();
        if (result.receive === 'granted') {
          await PushNotifications.register();
          return true;
        }
        return false;
      } catch {
        return false;
      }
    } else if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        return perm === 'granted';
      } catch {
        return false;
      }
    }
    return false;
  }
}

export const pushNotificationService = new PushNotificationService();
