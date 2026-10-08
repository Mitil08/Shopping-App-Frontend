import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { pushNotificationService } from '../services/pushNotificationService';
import { useToast } from '../context/ToastContext';

export default function CapacitorBridge() {
  const location = useLocation();
  const navigate = useNavigate();
  const { info } = useToast();
  const currentPathRef = useRef(location.pathname);
  const lastBackPressRef = useRef(0);

  useEffect(() => {
    currentPathRef.current = location.pathname;
  }, [location.pathname]);

  // One-time initialization on native mount
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // 1. Hide native splash screen smoothly once React is fully mounted
    const splashTimer = setTimeout(() => {
      SplashScreen.hide({ fadeOutDuration: 400 }).catch(() => {});
    }, 500);

    // 2. Set Status Bar appearance safely
    try {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#17213C' }).catch(() => {});
    } catch {
      // Ignore if unsupported
    }

    // 3. Initialize native push notifications safely
    pushNotificationService.initialize().catch((err) => {
      console.warn('Push notification initialization warning:', err);
    });

    // 4. Android Hardware Back Button Handling with double-press to exit protection
    let backListenerHandle = null;
    const setupBackButton = async () => {
      try {
        backListenerHandle = await CapApp.addListener('backButton', ({ canGoBack }) => {
          const currentPath = currentPathRef.current;
          const isRootView = currentPath === '/' || currentPath === '' || currentPath === '/login';

          if (isRootView) {
            const now = Date.now();
            if (now - lastBackPressRef.current < 2000) {
              CapApp.exitApp();
            } else {
              lastBackPressRef.current = now;
              info('Press back again to exit ÉLANE');
            }
          } else if (canGoBack) {
            navigate(-1);
          } else {
            navigate('/');
          }
        });
      } catch (err) {
        console.warn('Back button listener registration error:', err);
      }
    };

    setupBackButton();

    return () => {
      clearTimeout(splashTimer);
      if (backListenerHandle && typeof backListenerHandle.remove === 'function') {
        backListenerHandle.remove();
      }
    };
  }, [navigate, info]);

  return null;
}

