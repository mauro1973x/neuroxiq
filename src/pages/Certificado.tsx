import { useEffect, useState } from 'react';
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
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CertificateData {
  id: string;
  user_id: string;
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

interface ProfileData {
  full_name: string | null;
}

const Certificado = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();

  const [attempt, setAttempt] = useState<CertificateData | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingCount, setPollingCount] = useState(0);

  const paymentParam = searchParams.get('payment');

  const fetchData = async () => {
    if (!attemptId || !user) return;

    console.log('[CERTIFICADO] Fetching data for attempt:', attemptId);

    try {
      // Fetch attempt data
      const { data: attemptData, error: attemptError } = await supabase
        .from('test_attempts')
        .select('id, user_id, test_name, score_label, score_value, total_score, iq_estimated, result_category, has_certificate, certificate_payment_status, validation_code, certificate_issued_at')
        .eq('id', attemptId)
        .eq('user_id', user.id)
        .single();

      if (attemptError) throw attemptError;
      if (!attemptData) throw new Error('Resultado não encontrado');

      console.log('[CERTIFICADO] Attempt data:', attemptData);
      setAttempt(attemptData as CertificateData);

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
  };

  // Polling for payment confirmation
  useEffect(() => {
    if (!attempt || attempt.has_certificate) return;
    if (paymentParam !== 'success') return;

    const pollPayment = async () => {
      if (pollingCount >= 25) {
        setIsPolling(false);
        return;
      }

      setIsPolling(true);
      setPollingCount(prev => prev + 1);

      const { data } = await supabase
        .from('test_attempts')
        .select('has_certificate, certificate_payment_status, validation_code, certificate_issued_at')
        .eq('id', attemptId)
        .single();

      if (data?.has_certificate) {
        setAttempt(prev => prev ? { ...prev, ...data } : null);
        setIsPolling(false);
        return;
      }

      setTimeout(pollPayment, 2000);
    };

    pollPayment();
  }, [attemptId, attempt?.has_certificate, paymentParam, pollingCount]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, authLoading, navigate, attemptId]);

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
  const scoreLabel = attempt.score_label || 'Resultado';
  const scoreValue = attempt.score_value || 
    (attempt.iq_estimated ? String(attempt.iq_estimated) : 
    (attempt.result_category || String(attempt.total_score || 0)));
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Participante';
  const issuedDate = attempt.certificate_issued_at 
    ? format(new Date(attempt.certificate_issued_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const validationCode = attempt.validation_code || 'NX-PENDING';

  const hasCertificate = attempt.has_certificate;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12 px-4">
        {/* Polling Status */}
        {isPolling && (
          <Alert className="mb-6 max-w-2xl mx-auto border-primary/50 bg-primary/5">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <AlertTitle className="text-primary">Confirmando pagamento...</AlertTitle>
            <AlertDescription>
              Aguarde enquanto verificamos seu pagamento. Tentativa {pollingCount}/25
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
