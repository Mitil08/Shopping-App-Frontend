import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Trigger tactile mobile haptics for premium micro-interactions.
 * @param {'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'} type 
 */
export const triggerHaptic = async (type = 'light') => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    switch (type) {
      case 'light':
        await Haptics.impact({ style: ImpactStyle.Light });
        break;
      case 'medium':
        await Haptics.impact({ style: ImpactStyle.Medium });
        break;
      case 'heavy':
        await Haptics.impact({ style: ImpactStyle.Heavy });
        break;
      case 'success':
        await Haptics.notification({ type: NotificationType.Success });
        break;
      case 'warning':
        await Haptics.notification({ type: NotificationType.Warning });
        break;
      case 'error':
        await Haptics.notification({ type: NotificationType.Error });
        break;
      default:
        await Haptics.impact({ style: ImpactStyle.Light });
    }
  } catch {
    // Fail silently on unsupported devices
  }
};
