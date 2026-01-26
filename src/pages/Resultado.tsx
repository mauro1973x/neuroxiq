import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import IQTestResult from '@/components/quiz/IQTestResult';
import PremiumPaywall from '@/components/quiz/PremiumPaywall';
import PremiumReport from '@/components/quiz/PremiumReport';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getResultBand, IQResultBand } from '@/data/iqQuestions';
import { useToast } from '@/hooks/use-toast';

interface AttemptData {
  id: string;
  quiz_id: string;
  total_score: number | null;
  result_category: string | null;
  has_premium_access: boolean | null;
  has_certificate: boolean | null;
  payment_status: string | null;
  completed_at: string | null;
}

const Resultado = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [resultBand, setResultBand] = useState<IQResultBand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const paymentParam = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');

  const fetchAttempt = useCallback(async () => {
    if (!attemptId || !user) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('id', attemptId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Resultado não encontrado');

      setAttempt(data as AttemptData);

      if (data.total_score !== null) {
        const band = getResultBand(data.total_score);
        setResultBand(band);
      }
    } catch (err) {
      console.error('Error fetching attempt:', err);
      setError('Não foi possível carregar o resultado.');
    } finally {
      setIsLoading(false);
    }
  }, [attemptId, user]);

  const verifyPayment = useCallback(async () => {
    if (!sessionId || !attemptId) return;

    setIsVerifyingPayment(true);
    try {
      const { data, error: verifyError } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId, attemptId }
      });

      if (verifyError) throw verifyError;

      setPaymentStatus(data?.status || 'unknown');

      if (data?.success) {
        // Refresh attempt data to get updated access
        await fetchAttempt();
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
    } finally {
      setIsVerifyingPayment(false);
    }
  }, [sessionId, attemptId, fetchAttempt]);

  const handleUnlockClick = useCallback(async () => {
    if (!attemptId) return;
    
    setIsUnlocking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          attemptId, 
          purchaseType: 'premium_report', 
          paymentMethod: 'card' 
        }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Erro ao iniciar pagamento',
        description: 'Tente novamente ou entre em contato com o suporte.',
        variant: 'destructive',
      });
    } finally {
      setIsUnlocking(false);
    }
  }, [attemptId, toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchAttempt();
    }
  }, [user, authLoading, navigate, fetchAttempt]);

  useEffect(() => {
    if (paymentParam === 'success' && sessionId) {
      verifyPayment();
    }
  }, [paymentParam, sessionId, verifyPayment]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando resultado...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt || !resultBand) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error || 'Resultado não encontrado.'}</AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const score = attempt.total_score || 0;
  const hasPremiumAccess = attempt.has_premium_access || false;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12">
        {/* Payment Status Alerts */}
        {isVerifyingPayment && (
          <Alert className="mb-6 max-w-2xl mx-auto">
            <Loader2 className="h-4 w-4 animate-spin" />
            <AlertTitle>Verificando pagamento...</AlertTitle>
            <AlertDescription>Aguarde enquanto confirmamos seu pagamento.</AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'approved' && (
          <Alert className="mb-6 max-w-2xl mx-auto border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Pagamento Confirmado!</AlertTitle>
            <AlertDescription>
              Seu relatório premium foi liberado com sucesso.
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'pending' && (
          <Alert className="mb-6 max-w-2xl mx-auto border-warning bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Pagamento Pendente</AlertTitle>
            <AlertDescription>
              Aguardando confirmação do pagamento. Se você pagou via PIX, pode levar alguns minutos.
              <Button
                variant="link"
                className="p-0 h-auto ml-2"
                onClick={verifyPayment}
              >
                Verificar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'expired' && (
          <Alert className="mb-6 max-w-2xl mx-auto" variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Pagamento Expirado</AlertTitle>
            <AlertDescription>
              O tempo para pagamento expirou. Por favor, tente novamente.
            </AlertDescription>
          </Alert>
        )}

        {paymentParam === 'cancelled' && (
          <Alert className="mb-6 max-w-2xl mx-auto" variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Pagamento Cancelado</AlertTitle>
            <AlertDescription>
              O pagamento foi cancelado. Você pode tentar novamente abaixo.
            </AlertDescription>
          </Alert>
        )}

        {/* Content based on access level */}
        {hasPremiumAccess ? (
          <PremiumReport
            score={score}
            totalQuestions={30}
            resultBand={resultBand}
          />
        ) : (
          <div className="space-y-8">
            {/* Free Result Summary */}
            <IQTestResult
              score={score}
              totalQuestions={30}
              resultBand={resultBand}
              showPremium={false}
              onUnlockClick={handleUnlockClick}
              isUnlocking={isUnlocking}
            />

            {/* Premium Paywall */}
            <PremiumPaywall
              attemptId={attemptId!}
              onPaymentSuccess={() => fetchAttempt()}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Resultado;
