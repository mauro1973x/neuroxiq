import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertCircle, Award, Lock, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CertificateTemplate from '@/components/quiz/CertificateTemplate';
import BuyCertificateButton from '@/components/quiz/BuyCertificateButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CertificateData {
  id: string;
  user_id: string;
  quiz_id: string;
  test_name: string | null;
  score_label: string | null;
  score_value: string | null;
  total_score: number | null;
  iq_estimated: number | null;
  result_category: string | null;
  has_certificate: boolean | null;
  certificate_payment_status: string | null;
  validation_code: string | null;
  certificate_issued_at: string | null;
}

interface QuizData {
  test_type: string;
}

interface ProfileData {
  full_name: string | null;
}

const Certificado = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [attempt, setAttempt] = useState<CertificateData | null>(null);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  const paymentParam = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');

  const fetchData = useCallback(async () => {
    if (!attemptId || !user) return;

    console.log('[CERTIFICADO] Fetching data for attempt:', attemptId);

    try {
      // Fetch attempt data
      const { data: attemptData, error: attemptError } = await supabase
        .from('test_attempts')
        .select('id, user_id, quiz_id, test_name, score_label, score_value, total_score, iq_estimated, result_category, has_certificate, certificate_payment_status, validation_code, certificate_issued_at')
        .eq('id', attemptId)
        .eq('user_id', user.id)
        .single();

      if (attemptError) throw attemptError;
      if (!attemptData) throw new Error('Resultado não encontrado');

      console.log('[CERTIFICADO] Attempt data:', {
        id: attemptData.id,
        has_certificate: attemptData.has_certificate,
        certificate_payment_status: attemptData.certificate_payment_status,
        validation_code: attemptData.validation_code
      });
      setAttempt(attemptData as CertificateData);

      // Fetch quiz to get test_type
      const { data: quizData } = await supabase
        .from('quizzes')
        .select('test_type')
        .eq('id', attemptData.quiz_id)
        .single();

      if (quizData) {
        setQuiz(quizData as QuizData);
      }

      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }
    } catch (err) {
      console.error('[CERTIFICADO] Error:', err);
      setError('Não foi possível carregar o certificado.');
    } finally {
      setIsLoading(false);
    }
  }, [attemptId, user]);

  // STEP 4: Verify payment session on return from Stripe
  const verifyPaymentSession = useCallback(async () => {
    if (!sessionId || !user || !attemptId || isVerifying) return;
    
    // Only verify if certificate is not already unlocked
    if (attempt?.certificate_payment_status === 'paid') {
      console.log('[CERTIFICADO] Certificate already paid, skipping verification');
      return;
    }

    console.log('[CERTIFICADO] Verifying payment session:', sessionId);
    setIsVerifying(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-session', {
        body: { sessionId }
      });

      console.log('[CERTIFICADO] Verification response:', data);

      if (error) {
        console.error('[CERTIFICADO] Verification error:', error);
        // Fall back to polling
        setIsPolling(true);
        return;
      }

      if (data?.verified) {
        console.log('[CERTIFICADO] Payment verified successfully!');
        toast({
          title: '🎉 Pagamento Confirmado!',
          description: 'Seu certificado foi gerado com sucesso.',
        });
        
        // Clear URL params and refetch data
        navigate(`/certificado/${attemptId}`, { replace: true });
        await fetchData();
      } else if (data?.status === 'unpaid') {
        console.log('[CERTIFICADO] Payment not completed yet, starting polling');
        setIsPolling(true);
      }
    } catch (err) {
      console.error('[CERTIFICADO] Verification failed:', err);
      // Fall back to polling
      setIsPolling(true);
    } finally {
      setIsVerifying(false);
    }
  }, [sessionId, user, attemptId, attempt?.certificate_payment_status, isVerifying, navigate, fetchData, toast]);

  // Trigger verification when returning from payment
  useEffect(() => {
    if (paymentParam === 'success' && sessionId && user && !isVerifying && attempt !== null) {
      // Only verify if certificate is not already unlocked
      if (attempt.certificate_payment_status !== 'paid') {
        verifyPaymentSession();
      }
    }
  }, [paymentParam, sessionId, user, attempt, isVerifying, verifyPaymentSession]);

  // Polling for payment confirmation (fallback if verify-session fails)
  useEffect(() => {
    if (!isPolling || !attemptId) return;
    // Stop polling if certificate is already unlocked
    if (attempt?.certificate_payment_status === 'paid') {
      setIsPolling(false);
      return;
    }

    const pollPayment = async () => {
      if (pollingCount >= 25) {
        console.log('[CERTIFICADO] Polling limit reached');
        setIsPolling(false);
        return;
      }

      setPollingCount(prev => prev + 1);
      console.log('[CERTIFICADO] Polling attempt:', pollingCount + 1);

      const { data } = await supabase
        .from('test_attempts')
        .select('has_certificate, certificate_payment_status, validation_code, certificate_issued_at')
        .eq('id', attemptId)
        .single();

      console.log('[CERTIFICADO] Poll result:', {
        has_certificate: data?.has_certificate,
        certificate_payment_status: data?.certificate_payment_status
      });

      // CRITICAL: Check certificate_payment_status, not just has_certificate
      if (data?.certificate_payment_status === 'paid') {
        console.log('[CERTIFICADO] Certificate unlocked via polling!');
        setAttempt(prev => prev ? { ...prev, ...data } : null);
        setIsPolling(false);
        toast({
          title: '🎉 Certificado Liberado!',
          description: 'Seu certificado está pronto.',
        });
        return;
      }

      setTimeout(pollPayment, 2000);
    };

    pollPayment();
  }, [isPolling, attemptId, attempt?.certificate_payment_status, pollingCount, toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user && attemptId) {
      fetchData();
    }
  }, [user, authLoading, navigate, attemptId, fetchData]);

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Carregando certificado...</p>
        </div>
      </div>
    );
  }

  if (error || !attempt) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-8 md:py-12 px-4">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error || 'Certificado não encontrado.'}</AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Button onClick={() => navigate('/dashboard')}>Voltar ao Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Derive test name and score
  const testName = attempt.test_name || 'Avaliação Cognitiva';
  
  // ONLY show "QI estimado" for IQ tests (test_type === 'iq')
  const isIQTest = quiz?.test_type === 'iq';
  const scoreLabel = isIQTest ? 'QI estimado' : (attempt.score_label || 'Resultado');
  const scoreValue = isIQTest && attempt.iq_estimated 
    ? String(attempt.iq_estimated) 
    : (attempt.score_value || attempt.result_category || String(attempt.total_score || 0));
  
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Participante';
  const issuedDate = attempt.certificate_issued_at 
    ? format(new Date(attempt.certificate_issued_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const validationCode = attempt.validation_code || 'NX-PENDING';

  // CRITICAL: Check certificate_payment_status === 'paid', NOT just has_certificate
  const hasCertificate = attempt.certificate_payment_status === 'paid';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12 px-4">
        {/* Verification/Polling Status */}
        {(isVerifying || isPolling) && (
          <Alert className="mb-6 max-w-2xl mx-auto border-primary/50 bg-primary/5">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <AlertTitle className="text-primary">
              {isVerifying ? 'Verificando pagamento...' : 'Confirmando pagamento...'}
            </AlertTitle>
            <AlertDescription>
              {isVerifying 
                ? 'Consultando status do pagamento no Stripe...'
                : `Aguarde enquanto verificamos seu pagamento. Tentativa ${pollingCount}/25`
              }
            </AlertDescription>
          </Alert>
        )}

        {paymentParam === 'success' && hasCertificate && (
          <Alert className="mb-6 max-w-2xl mx-auto border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Pagamento Confirmado!</AlertTitle>
            <AlertDescription>
              Seu certificado foi gerado com sucesso.
            </AlertDescription>
          </Alert>
        )}

        {hasCertificate ? (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Seu Certificado Oficial
              </h1>
              <p className="text-muted-foreground mt-2">
                {testName} - NEUROX
              </p>
            </div>

            <CertificateTemplate
              userName={userName}
              testName={testName}
              scoreLabel={scoreLabel}
              scoreValue={scoreValue}
              issuedDate={issuedDate}
              validationCode={validationCode}
            />

            <div className="text-center text-sm text-muted-foreground max-w-md mx-auto">
              <p>
                Seu certificado possui código de validação único: <strong>{validationCode}</strong>
              </p>
              <p className="mt-2">
                Qualquer pessoa pode verificar a autenticidade em{' '}
                <a href={`/validar/${validationCode}`} className="text-primary hover:underline">
                  neurox.app/validar/{validationCode}
                </a>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/resultado/${attemptId}`)}
                className="min-h-[48px]"
              >
                Ver Relatório
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="min-h-[48px]"
              >
                Ir para Dashboard
              </Button>
            </div>
          </div>
        ) : (
          <div className="max-w-lg mx-auto space-y-6">
            <Card className="border-2 border-muted">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
                <CardTitle className="text-xl">Certificado Bloqueado</CardTitle>
                <CardDescription>
                  Adquira seu certificado oficial para {testName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BuyCertificateButton
                  attemptId={attemptId!}
                  testName={testName}
                  hasCertificate={false}
                  onPaymentInitiated={() => setPollingCount(0)}
                />
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                variant="link"
                onClick={() => navigate(`/resultado/${attemptId}`)}
              >
                ← Voltar ao relatório
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Certificado;
