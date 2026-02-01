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
 * Maps purchase type to product parameter for the redirect endpoint
 */
const purchaseTypeToProduct: Record<PurchaseType, string> = {
  premium_report: 'report',
  certificate: 'certificate',
  bundle: 'bundle'
};

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
 * Gets the base URL for the Supabase functions
 */
const getSupabaseUrl = (): string => {
  // Use the Supabase URL from environment or fallback
  return import.meta.env.VITE_SUPABASE_URL || 'https://gcwqmbugqksztdukjlez.supabase.co';
};

/**
 * Builds the server-side redirect URL for Stripe checkout.
 * This URL triggers a 303 redirect directly to Stripe, bypassing iframe restrictions.
 */
export const buildCheckoutRedirectUrl = (params: CheckoutParams): string => {
  const supabaseUrl = getSupabaseUrl();
  const product = purchaseTypeToProduct[params.purchaseType] || 'report';
  return `${supabaseUrl}/functions/v1/stripe-redirect?attemptId=${params.attemptId}&product=${product}`;
};

/**
 * Navigates to the Stripe Checkout URL.
 * Handles iframe environments by using window.top.
 * Returns true if navigation succeeded, false if it failed.
 */
export const navigateToCheckout = (url: string): boolean => {
  try {
    const embedded = isEmbeddedInIframe();
    console.log('[CHECKOUT] Navigating to checkout, embedded:', embedded, 'url:', url.substring(0, 80) + '...');

    if (embedded) {
      // In iframe, navigate the top window to avoid Stripe frame-ancestors restrictions
      if (window.top) {
        window.top.location.href = url;
        return true;
      } else {
        // Fallback: try location.href on current window
        window.location.href = url;
        return true;
      }
    } else {
      // Not in iframe, navigate normally
      window.location.href = url;
      return true;
    }
  } catch (err) {
    console.error('[CHECKOUT] Navigation error:', err);
    return false;
  }
};

/**
 * Starts checkout using the server-side redirect approach.
 * This is the PREFERRED method as it avoids iframe/popup blocking issues.
 * 
 * The redirect endpoint creates the Stripe session and returns a 303 redirect,
 * which bypasses all client-side navigation restrictions.
 */
export const startCheckoutRedirect = (params: CheckoutParams): CheckoutResult => {
  const redirectUrl = buildCheckoutRedirectUrl(params);
  console.log('[CHECKOUT] Starting redirect checkout:', { ...params, redirectUrl: redirectUrl.substring(0, 80) + '...' });
  
  const navigated = navigateToCheckout(redirectUrl);
  
  if (navigated) {
    return {
      success: true,
      url: redirectUrl
    };
  } else {
    return {
      success: false,
      fallbackUrl: redirectUrl,
      error: 'Não foi possível redirecionar automaticamente. Clique no link abaixo.'
    };
  }
};

/**
 * Legacy checkout method using POST to create-checkout endpoint.
 * This is kept for backwards compatibility but startCheckoutRedirect is preferred.
 */
export const startCheckout = async (params: CheckoutParams): Promise<CheckoutResult> => {
  const { attemptId, purchaseType, paymentMethod = 'card' } = params;

  console.log('[CHECKOUT] Starting checkout via POST:', { attemptId, purchaseType, paymentMethod });

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
