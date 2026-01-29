import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      navigate('/login');
      return;
    }

    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Session ID não encontrado na URL');
      return;
    }

    verifyPayment();
  }, [user, authLoading, sessionId, navigate]);

  const verifyPayment = async () => {
    if (!sessionId) return;

    console.log('[PAYMENT-SUCCESS] Verifying session:', sessionId);

    try {
      const { data, error } = await supabase.functions.invoke('verify-session', {
        body: { sessionId }
      });

      if (error) {
        console.error('[PAYMENT-SUCCESS] Verification error:', error);
        throw error;
      }

      console.log('[PAYMENT-SUCCESS] Verification result:', data);

      if (data?.verified) {
        setStatus('success');
        setAttemptId(data.attemptId);
        
        // Auto-redirect after 2 seconds
        setTimeout(() => {
          navigate(`/resultado/${data.attemptId}?payment=success`);
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(data?.message || 'Pagamento não confirmado');
      }
    } catch (err) {
      console.error('[PAYMENT-SUCCESS] Error:', err);
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Erro ao verificar pagamento');
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
      <main className="flex-1 container py-12 flex items-center justify-center">
        <div className="max-w-md w-full">
          {status === 'verifying' && (
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Verificando Pagamento...</h2>
              <p className="text-muted-foreground">
                Aguarde enquanto confirmamos seu pagamento com o Stripe.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Pagamento Confirmado!</h2>
              <p className="text-muted-foreground mb-4">
                Seu relatório premium foi liberado com sucesso.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Redirecionando para seu resultado...
              </p>
              <Button onClick={() => navigate(`/resultado/${attemptId}`)}>
                Ver Relatório Premium
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erro na Verificação</AlertTitle>
                <AlertDescription>
                  {errorMessage || 'Não foi possível verificar o pagamento.'}
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Se você completou o pagamento, aguarde alguns instantes e tente novamente.
                  O webhook do Stripe pode demorar alguns segundos.
                </p>
                <div className="flex flex-col gap-2">
                  <Button onClick={verifyPayment}>
                    Tentar Novamente
                  </Button>
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    Voltar ao Dashboard
                  </Button>
                </div>
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
