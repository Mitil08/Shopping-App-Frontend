import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

export default function CapacitorBridge() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // 1. Hide native splash screen once React is mounted
    SplashScreen.hide().catch(() => {});

    // 2. Set Status Bar appearance
    try {
      StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
      StatusBar.setBackgroundColor({ color: '#141414' }).catch(() => {});
    } catch {
      // Ignore if unsupported
    }

    // 3. Android Hardware Back Button Handling
    let backListenerHandle;
    const setupBackButton = async () => {
      backListenerHandle = await CapApp.addListener('backButton', ({ canGoBack }) => {
        if (location.pathname === '/' || location.pathname === '') {
          // If on home, let Capacitor minimize/exit app
          CapApp.exitApp();
        } else if (canGoBack) {
          navigate(-1);
        } else {
          navigate('/');
        }
      });
    };

    setupBackButton();

    return () => {
      if (backListenerHandle && backListenerHandle.remove) {
        backListenerHandle.remove();
      }
    };
  }, [location.pathname, navigate]);

  return null;
}
