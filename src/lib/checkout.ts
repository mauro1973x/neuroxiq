import { supabase } from '@/integrations/supabase/client';

export type PurchaseType = 'premium_report' | 'certificate' | 'bundle';
export type PaymentMethod = 'card' | 'pix';

export interface CheckoutParams {
  attemptId: string;
  purchaseType: PurchaseType;
  paymentMethod?: PaymentMethod;
}

export interface CheckoutResult {
  success: boolean;
  url?: string;
  sessionId?: string;
  pixAvailable?: boolean;
  error?: string;
  fallbackUrl?: string;
}

/**
 * Detects if the app is running inside an iframe (e.g., Lovable preview).
 */
export const isEmbeddedInIframe = (): boolean => {
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin access blocked means we're in an iframe
    return true;
  }
};

/**
 * Navigates to the Stripe Checkout URL.
 * Handles iframe environments by using window.top.
 * Returns true if navigation succeeded, false if it failed.
 */
export const navigateToCheckout = (url: string): boolean => {
  try {
    const embedded = isEmbeddedInIframe();
    console.log('[CHECKOUT] Navigating to checkout, embedded:', embedded, 'url:', url.substring(0, 50) + '...');

    if (embedded) {
      // In iframe, navigate the top window to avoid Stripe frame-ancestors restrictions
      if (window.top) {
        window.top.location.assign(url);
        return true;
      } else {
        // Fallback: try location.assign on current window
        window.location.assign(url);
        return true;
      }
    } else {
      // Not in iframe, navigate normally
      window.location.assign(url);
      return true;
    }
  } catch (err) {
    console.error('[CHECKOUT] Navigation error:', err);
    return false;
  }
};

/**
 * Centralized function to start a Stripe checkout session.
 * Called directly in onClick handlers (user-initiated).
 * Returns the checkout URL for fallback rendering if navigation fails.
 */
export const startCheckout = async (params: CheckoutParams): Promise<CheckoutResult> => {
  const { attemptId, purchaseType, paymentMethod = 'card' } = params;

  console.log('[CHECKOUT] Starting checkout:', { attemptId, purchaseType, paymentMethod });

  try {
    // Call the edge function to create checkout session
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { attemptId, purchaseType, paymentMethod }
    });

    if (error) {
      console.error('[CHECKOUT] Edge function error:', error);
      return {
        success: false,
        error: error.message || 'Erro ao criar sessão de pagamento'
      };
    }

    // Validate response
    if (!data?.url) {
      console.error('[CHECKOUT] No URL in response:', data);
      return {
        success: false,
        error: 'URL de checkout não retornada pelo servidor'
      };
    }

    console.log('[CHECKOUT] Checkout session created:', data.sessionId);

    // Attempt navigation
    const navigated = navigateToCheckout(data.url);

    if (navigated) {
      return {
        success: true,
        url: data.url,
        sessionId: data.sessionId,
        pixAvailable: data.pix_available
      };
    } else {
      // Navigation failed, return URL for fallback link
      return {
        success: false,
        url: data.url,
        fallbackUrl: data.url,
        sessionId: data.sessionId,
        error: 'Não foi possível redirecionar automaticamente. Clique no link abaixo.'
      };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido ao processar checkout';
    console.error('[CHECKOUT] Unexpected error:', { error: err, message });
    return {
      success: false,
      error: message
    };
  }
};
