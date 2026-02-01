import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

type VerificationStatus = 'checking' | 'pending_webhook' | 'confirmed' | 'error';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [status, setStatus] = useState<VerificationStatus>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [pollingCount, setPollingCount] = useState(0);

  const sessionId = searchParams.get('session_id');
  const MAX_POLLS = 15; // 15 polls * 2s = 30 seconds
  const POLL_INTERVAL = 2000;

  // Check DATABASE for actual payment status - this is the source of truth
  const checkDatabaseStatus = useCallback(async (attId: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .select('has_premium_access, has_certificate, payment_status')
        .eq('id', attId)
        .single();

      if (error) {
        console.error('[PAYMENT-SUCCESS] DB check error:', error);
        return false;
      }

      console.log('[PAYMENT-SUCCESS] DB status:', data);

      // ONLY consider confirmed if database shows paid/approved
      if (data?.has_premium_access === true || data?.payment_status === 'approved') {
        return true;
      }

      return false;
    } catch (err) {
      console.error('[PAYMENT-SUCCESS] Check error:', err);
      return false;
    }
  }, []);

  const verifyAndPoll = useCallback(async () => {
    if (!sessionId || !user) return;

    console.log('[PAYMENT-SUCCESS] Verifying session:', sessionId, 'poll:', pollingCount);

    try {
      // First, call verify-session to get attemptId and check Stripe status
      const { data, error } = await supabase.functions.invoke('verify-session', {
        body: { sessionId }
      });

      if (error) {
        console.error('[PAYMENT-SUCCESS] Verification error:', error);
        if (pollingCount < MAX_POLLS) {
          setStatus('pending_webhook');
          setTimeout(() => setPollingCount(prev => prev + 1), POLL_INTERVAL);
        } else {
          setStatus('error');
          setErrorMessage('Não foi possível verificar o pagamento. Tente novamente.');
        }
        return;
      }

      console.log('[PAYMENT-SUCCESS] Verification result:', data);
      
      if (data?.attemptId) {
        setAttemptId(data.attemptId);
      }

      // If already confirmed in database (webhook processed)
      if (data?.verified && data?.alreadyProcessed) {
        setStatus('confirmed');
        // Wait a moment then redirect
        setTimeout(() => {
          navigate(`/resultado/${data.attemptId}`, { replace: true });
        }, 2000);
        return;
      }

      // Stripe shows paid but database not updated yet - wait for webhook
      if (data?.status === 'pending' || !data?.verified) {
        setStatus('pending_webhook');
        
        // Poll the DATABASE directly for confirmation
        if (data?.attemptId && pollingCount < MAX_POLLS) {
          const confirmed = await checkDatabaseStatus(data.attemptId);
          if (confirmed) {
            setStatus('confirmed');
            setTimeout(() => {
              navigate(`/resultado/${data.attemptId}`, { replace: true });
            }, 2000);
            return;
          }
          
          // Continue polling
          setTimeout(() => setPollingCount(prev => prev + 1), POLL_INTERVAL);
        } else if (pollingCount >= MAX_POLLS) {
          // Max polls reached - tell user to wait and refresh
          setStatus('error');
          setErrorMessage(
            'Seu pagamento está sendo processado. O relatório será liberado em breve. ' +
            'Por favor, aguarde alguns instantes e atualize a página.'
          );
        }
        return;
      }

      // Payment not yet complete according to Stripe
      if (data?.status === 'unpaid') {
        setStatus('error');
        setErrorMessage('Pagamento não foi concluído. Por favor, tente novamente.');
      }

    } catch (err) {
      console.error('[PAYMENT-SUCCESS] Error:', err);
      if (pollingCount < MAX_POLLS) {
        setStatus('pending_webhook');
        setTimeout(() => setPollingCount(prev => prev + 1), POLL_INTERVAL);
      } else {
        setStatus('error');
        setErrorMessage('Erro ao verificar pagamento. Atualize a página.');
      }
    }
  }, [sessionId, user, pollingCount, navigate, checkDatabaseStatus]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      const returnUrl = window.location.pathname + window.location.search;
      navigate(`/login?returnTo=${encodeURIComponent(returnUrl)}`);
      return;
    }

    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Session ID não encontrado na URL');
      return;
    }

    verifyAndPoll();
  }, [user, authLoading, sessionId, navigate, verifyAndPoll, pollingCount]);

  const handleManualRetry = () => {
    setPollingCount(0);
    setStatus('checking');
    setErrorMessage(null);
  };

  const handleGoToResult = () => {
    if (attemptId) {
      navigate(`/resultado/${attemptId}`);
    } else {
      navigate('/dashboard');
    }
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
          {(status === 'checking' || status === 'pending_webhook') && (
            <div className="text-center">
              <Loader2 className="h-14 w-14 md:h-16 md:w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                {status === 'pending_webhook' ? 'Aguardando Confirmação...' : 'Verificando Pagamento...'}
              </h2>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-4">
                {status === 'pending_webhook' 
                  ? `Processando pagamento... (${pollingCount + 1}/${MAX_POLLS})`
                  : 'Aguarde enquanto confirmamos seu pagamento.'
                }
              </p>
              
              {status === 'pending_webhook' && (
                <Alert className="text-left border-primary/30 bg-primary/5">
                  <Clock className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Pagamento em processamento</AlertTitle>
                  <AlertDescription className="text-sm">
                    Seu pagamento está sendo confirmado pelo sistema bancário. 
                    Isso pode levar alguns segundos.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {status === 'confirmed' && (
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
                onClick={handleGoToResult}
                className="w-full min-h-[52px] text-base"
                variant="hero"
              >
                Ver Relatório Premium
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 md:h-12 md:w-12 text-warning" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold mb-2">Processando Pagamento</h2>
              
              <Alert className="mb-6 text-left border-warning/50 bg-warning/5">
                <AlertCircle className="h-4 w-4 text-warning" />
                <AlertTitle className="text-warning">Aguarde a confirmação</AlertTitle>
                <AlertDescription className="text-sm">
                  {errorMessage || 'Seu pagamento está sendo processado.'}
                </AlertDescription>
              </Alert>
              
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Se você completou o pagamento, seu relatório será liberado em breve. 
                Aguarde alguns instantes e verifique novamente.
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleManualRetry} 
                  className="w-full min-h-[52px] text-base"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Verificar Novamente
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleGoToResult} 
                  className="w-full min-h-[48px] text-base"
                >
                  Ir para o Resultado
                </Button>
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
