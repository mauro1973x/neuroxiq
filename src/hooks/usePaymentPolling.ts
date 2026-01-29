import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PaymentPollingOptions {
  attemptId: string | undefined;
  sessionId: string | null;
  initialPaymentStatus: string | null;
  enabled: boolean;
}

interface PaymentPollingResult {
  isPolling: boolean;
  pollingAttempts: number;
  paymentConfirmed: boolean;
  paymentStatus: string | null;
  error: string | null;
  startPolling: () => void;
  stopPolling: () => void;
}

const MAX_POLLING_ATTEMPTS = 25;
const POLLING_INTERVAL_MS = 2000;

export const usePaymentPolling = ({
  attemptId,
  sessionId,
  initialPaymentStatus,
  enabled
}: PaymentPollingOptions): PaymentPollingResult => {
  const [isPolling, setIsPolling] = useState(false);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(initialPaymentStatus);
  const [error, setError] = useState<string | null>(null);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef(false);

  const stopPolling = useCallback(() => {
    console.log('[PAYMENT-POLLING] Stopping polling');
    isPollingRef.current = false;
    setIsPolling(false);
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const checkPaymentStatus = useCallback(async (): Promise<boolean> => {
    if (!attemptId) return false;

    try {
      console.log('[PAYMENT-POLLING] Checking payment status for attempt:', attemptId);
      
      const { data, error: fetchError } = await supabase
        .from('test_attempts')
        .select('has_premium_access, payment_status')
        .eq('id', attemptId)
        .single();

      if (fetchError) {
        console.error('[PAYMENT-POLLING] Error fetching status:', fetchError);
        throw fetchError;
      }

      console.log('[PAYMENT-POLLING] Status check result:', data);

      if (data?.has_premium_access === true || data?.payment_status === 'approved') {
        console.log('[PAYMENT-POLLING] Payment confirmed! Access granted.');
        setPaymentConfirmed(true);
        setPaymentStatus('approved');
        return true;
      }

      setPaymentStatus(data?.payment_status || null);
      return false;
    } catch (err) {
      console.error('[PAYMENT-POLLING] Check error:', err);
      return false;
    }
  }, [attemptId]);

  const startPolling = useCallback(() => {
    if (!enabled || !attemptId || isPollingRef.current) {
      console.log('[PAYMENT-POLLING] Polling not started - disabled or already polling');
      return;
    }

    console.log('[PAYMENT-POLLING] Starting payment polling for attempt:', attemptId);
    isPollingRef.current = true;
    setIsPolling(true);
    setPollingAttempts(0);
    setError(null);

    // Immediate first check
    checkPaymentStatus().then(confirmed => {
      if (confirmed) {
        stopPolling();
        return;
      }

      // Start interval polling
      pollingIntervalRef.current = setInterval(async () => {
        if (!isPollingRef.current) {
          stopPolling();
          return;
        }

        setPollingAttempts(prev => {
          const newAttempts = prev + 1;
          console.log('[PAYMENT-POLLING] Polling attempt:', newAttempts, '/', MAX_POLLING_ATTEMPTS);
          
          if (newAttempts >= MAX_POLLING_ATTEMPTS) {
            console.log('[PAYMENT-POLLING] Max attempts reached, stopping');
            setError('Pagamento ainda não confirmado. Aguarde e atualize a página em instantes.');
            stopPolling();
            return newAttempts;
          }
          
          return newAttempts;
        });

        const confirmed = await checkPaymentStatus();
        if (confirmed) {
          stopPolling();
        }
      }, POLLING_INTERVAL_MS);
    });
  }, [enabled, attemptId, checkPaymentStatus, stopPolling]);

  // Auto-start polling when conditions are met
  useEffect(() => {
    const shouldAutoStart = enabled && 
      attemptId && 
      (sessionId || initialPaymentStatus === 'pending') && 
      !paymentConfirmed;

    if (shouldAutoStart) {
      console.log('[PAYMENT-POLLING] Auto-starting polling - session_id or pending status detected');
      startPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, attemptId, sessionId, initialPaymentStatus, paymentConfirmed, startPolling, stopPolling]);

  return {
    isPolling,
    pollingAttempts,
    paymentConfirmed,
    paymentStatus,
    error,
    startPolling,
    stopPolling
  };
};
