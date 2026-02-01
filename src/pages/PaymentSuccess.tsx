import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type VerificationStatus = 'verifying' | 'success' | 'pending' | 'error';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [status, setStatus] = useState<VerificationStatus>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const sessionId = searchParams.get('session_id');
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 2000;

  const verifyPayment = useCallback(async () => {
    if (!sessionId) return;

    console.log('[PAYMENT-SUCCESS] Verifying session:', sessionId, 'retry:', retryCount);

    try {
      const { data, error } = await supabase.functions.invoke('verify-session', {
        body: { sessionId }
      });

      if (error) {
        console.error('[PAYMENT-SUCCESS] Verification error:', error);
        // Check if it's a retriable error
        if (retryCount < MAX_RETRIES) {
          console.log('[PAYMENT-SUCCESS] Will retry in', RETRY_DELAY, 'ms');
          setStatus('pending');
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, RETRY_DELAY);
          return;
        }
        throw error;
      }

      console.log('[PAYMENT-SUCCESS] Verification result:', data);

      if (data?.verified) {
        setStatus('success');
        setAttemptId(data.attemptId);
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          if (data.attemptId) {
            navigate(`/resultado/${data.attemptId}?payment=success`);
          }
        }, 2000);
      } else if (data?.status === 'unpaid' || data?.status === 'pending') {
        // Payment not yet complete, retry if possible
        if (retryCount < MAX_RETRIES) {
          console.log('[PAYMENT-SUCCESS] Payment pending, will retry');
          setStatus('pending');
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, RETRY_DELAY);
        } else {
          setStatus('error');
          setErrorMessage('O pagamento ainda não foi confirmado. Por favor, aguarde alguns instantes e tente novamente.');
        }
      } else {
        setStatus('error');
        setErrorMessage(data?.message || 'Pagamento não confirmado');
      }
    } catch (err) {
      console.error('[PAYMENT-SUCCESS] Error:', err);
      if (retryCount < MAX_RETRIES) {
        console.log('[PAYMENT-SUCCESS] Error occurred, will retry');
        setStatus('pending');
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, RETRY_DELAY);
      } else {
        setStatus('error');
        setErrorMessage(err instanceof Error ? err.message : 'Erro ao verificar pagamento');
      }
    }
  }, [sessionId, retryCount, navigate]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Store current URL and redirect to login
      const returnUrl = window.location.pathname + window.location.search;
      navigate(`/login?returnTo=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Session ID não encontrado na URL');
      return;
    }

    verifyPayment();
  }, [user, authLoading, sessionId, navigate, verifyPayment, retryCount]);

  const handleManualRetry = () => {
    setRetryCount(0);
    setStatus('verifying');
    setErrorMessage(null);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full">
          {(status === 'verifying' || status === 'pending') && (
            <div className="text-center">
              <Loader2 className="h-14 w-14 md:h-16 md:w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {status === 'pending' ? 'Aguardando Confirmação...' : 'Verificando Pagamento...'}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {status === 'pending' 
                  ? `Tentativa ${retryCount + 1} de ${MAX_RETRIES + 1}. Aguarde enquanto confirmamos seu pagamento.`
                  : 'Aguarde enquanto confirmamos seu pagamento.'
                }
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 md:h-12 md:w-12 text-success" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-success mb-2">Pagamento Confirmado!</h2>
              <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
                Seu relatório premium foi liberado com sucesso.
              </p>
              <p className="text-xs md:text-sm text-muted-foreground mb-6">
                Redirecionando para seu resultado...
              </p>
              <Button 
                onClick={() => attemptId && navigate(`/resultado/${attemptId}`)}
                className="w-full min-h-[52px] text-base"
                variant="hero"
                disabled={!attemptId}
              >
                Ver Relatório Premium
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <Alert variant="destructive" className="mb-6 text-left">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro na Verificação</AlertTitle>
                <AlertDescription className="text-sm">
                  {errorMessage || 'Não foi possível verificar o pagamento.'}
                </AlertDescription>
              </Alert>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Se você completou o pagamento, aguarde alguns instantes e tente novamente.
              </p>
              <div className="flex flex-col gap-3">
                <Button onClick={handleManualRetry} className="w-full min-h-[52px] text-base">
                  Tentar Novamente
                </Button>
                <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full min-h-[48px] text-base">
                  Voltar ao Dashboard
                </Button>
                {/* Show session ID for support reference */}
                {sessionId && (
                  <p className="text-xs text-muted-foreground mt-4">
                    Referência: {sessionId.substring(0, 20)}...
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
