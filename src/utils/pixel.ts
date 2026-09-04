// Meta (Facebook) Pixel Tracking Utility
// Pixel ID: 2472461739900461

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const PIXEL_ID = '2472461739900461';

/**
 * Ensures Meta Pixel is initialized and safe to call
 */
export function isPixelAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.fbq === 'function';
}

/**
 * Track PageView event
 */
export function trackPageView(): void {
  try {
    if (isPixelAvailable()) {
      window.fbq!('track', 'PageView');
    }
  } catch (err) {
    console.debug('Pixel PageView tracking suppressed or blocked:', err);
  }
}

/**
 * Track ViewContent event (e.g. viewing the VIP Accelerator Upsell offer)
 */
export function trackViewContent(params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}): void {
  try {
    if (isPixelAvailable()) {
      window.fbq!('track', 'ViewContent', {
        content_name: params?.content_name || 'Protocolo Acelerador Glúteos 3X VIP',
        content_category: params?.content_category || 'Upsell OTO',
        value: params?.value ?? 19.0,
        currency: params?.currency || 'USD',
      });
    }
  } catch (err) {
    console.debug('Pixel ViewContent tracking suppressed:', err);
  }
}

/**
 * Track InitiateCheckout event (when student clicks 1-Click Buy button)
 */
export function trackInitiateCheckout(params?: {
  content_name?: string;
  value?: number;
  currency?: string;
}): void {
  try {
    if (isPixelAvailable()) {
      window.fbq!('track', 'InitiateCheckout', {
        content_name: params?.content_name || 'Protocolo Acelerador Glúteos 3X VIP',
        value: params?.value ?? 19.0,
        currency: params?.currency || 'USD',
      });
    }
  } catch (err) {
    console.debug('Pixel InitiateCheckout tracking suppressed:', err);
  }
}

/**
 * Track Purchase event (when 1-Click Buy is successfully processed)
 */
export function trackPurchase(params?: {
  content_name?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
}): void {
  try {
    if (isPixelAvailable()) {
      window.fbq!('track', 'Purchase', {
        content_name: params?.content_name || 'Protocolo Acelerador Glúteos 3X VIP',
        content_type: 'product',
        value: params?.value ?? 19.0,
        currency: params?.currency || 'USD',
        transaction_id: params?.transaction_id || `TX-${Date.now()}`,
      });
    }
  } catch (err) {
    console.debug('Pixel Purchase tracking suppressed:', err);
  }
}
