import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Clock, XCircle, Brain, Heart, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import IQTestResult from '@/components/quiz/IQTestResult';
import PremiumPaywall from '@/components/quiz/PremiumPaywall';
import PremiumReport from '@/components/quiz/PremiumReport';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { getResultBand, IQResultBand } from '@/data/iqQuestions';
import { getEmotionalResultBand, EmotionalResultBand } from '@/data/emotionalQuestions';
import { getPersonalityResultBand, PersonalityResultBand } from '@/data/personalityQuestions';
import { useToast } from '@/hooks/use-toast';

// Quiz IDs
const IQ_QUIZ_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const EMOTIONAL_QUIZ_ID = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';
const PERSONALITY_QUIZ_ID = 'c3d4e5f6-a7b8-9012-cdef-345678901234';

type TestType = 'iq' | 'emotional' | 'personality' | 'unknown';

interface AttemptData {
  id: string;
  quiz_id: string;
  total_score: number | null;
  result_category: string | null;
  result_description: string | null;
  has_premium_access: boolean | null;
  has_certificate: boolean | null;
  payment_status: string | null;
  completed_at: string | null;
}

const getTestType = (quizId: string): TestType => {
  switch (quizId) {
    case IQ_QUIZ_ID: return 'iq';
    case EMOTIONAL_QUIZ_ID: return 'emotional';
    case PERSONALITY_QUIZ_ID: return 'personality';
    default: return 'unknown';
  }
};

const getTestConfig = (testType: TestType) => {
  switch (testType) {
    case 'iq':
      return {
        title: 'Resultado do Teste de QI',
        subtitle: 'Análise do seu desempenho cognitivo',
        icon: Brain,
        color: 'from-primary to-blue-600',
        totalQuestions: 30,
        maxScore: 30,
        scoreLabel: 'Acertos',
        premiumPrice: 19.90
      };
    case 'emotional':
      return {
        title: 'Resultado do Teste Emocional',
        subtitle: 'Análise da sua inteligência emocional',
        icon: Heart,
        color: 'from-rose-500 to-red-600',
        totalQuestions: 30,
        maxScore: 30,
        scoreLabel: 'Pontuação QE',
        premiumPrice: 49.90
      };
    case 'personality':
      return {
        title: 'Resultado do Teste de Personalidade',
        subtitle: 'Análise do seu perfil Big Five (OCEAN)',
        icon: User,
        color: 'from-violet-500 to-purple-600',
        totalQuestions: 40,
        maxScore: 120,
        scoreLabel: 'Pontuação Total',
        premiumPrice: 39.90
      };
    default:
      return {
        title: 'Resultado do Teste',
        subtitle: 'Análise do seu desempenho',
        icon: TrendingUp,
        color: 'from-primary to-blue-600',
        totalQuestions: 30,
        maxScore: 30,
        scoreLabel: 'Pontuação',
        premiumPrice: 19.90
      };
  }
};

const Resultado = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [testType, setTestType] = useState<TestType>('unknown');
  const [iqResultBand, setIqResultBand] = useState<IQResultBand | null>(null);
  const [emotionalResultBand, setEmotionalResultBand] = useState<EmotionalResultBand | null>(null);
  const [personalityResultBand, setPersonalityResultBand] = useState<PersonalityResultBand | null>(null);
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

      const detectedType = getTestType(data.quiz_id);
      setTestType(detectedType);

      if (data.total_score !== null) {
        switch (detectedType) {
          case 'iq':
            setIqResultBand(getResultBand(data.total_score));
            break;
          case 'emotional':
            setEmotionalResultBand(getEmotionalResultBand(data.total_score));
            break;
          case 'personality':
            setPersonalityResultBand(getPersonalityResultBand(data.total_score));
            break;
        }
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

  if (error || !attempt) {
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
  const config = getTestConfig(testType);
  const Icon = config.icon;
  const percentage = Math.round((score / config.maxScore) * 100);

  // Render IQ Test Result (uses existing components)
  if (testType === 'iq' && iqResultBand) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          {/* Payment Status Alerts */}
          {renderPaymentAlerts()}

          {hasPremiumAccess ? (
            <PremiumReport
              score={score}
              totalQuestions={30}
              resultBand={iqResultBand}
            />
          ) : (
            <div className="space-y-8">
              <IQTestResult
                score={score}
                totalQuestions={30}
                resultBand={iqResultBand}
                showPremium={false}
                onUnlockClick={handleUnlockClick}
                isUnlocking={isUnlocking}
              />
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
  }

  // Generic Result Display for Emotional and Personality Tests
  const resultCategory = attempt.result_category || 'Resultado';
  const resultDescription = attempt.result_description || '';

  function renderPaymentAlerts() {
    return (
      <>
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
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12">
        {renderPaymentAlerts()}

        <div className="max-w-3xl mx-auto space-y-8">
          {/* Header Card */}
          <Card className="glass-card overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${config.color}`} />
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl md:text-3xl font-display">{config.title}</CardTitle>
              <CardDescription className="text-lg">{config.subtitle}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center p-6 rounded-xl bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">{config.scoreLabel}</div>
                <div className={`text-5xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                  {score}
                  <span className="text-2xl text-muted-foreground">/{config.maxScore}</span>
                </div>
                <Progress value={percentage} className="mt-4 h-3" />
                <div className="text-sm text-muted-foreground mt-2">{percentage}% de aproveitamento</div>
              </div>

              {/* Result Category */}
              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 bg-gradient-to-r ${config.color} text-white border-0`}>
                  {resultCategory}
                </Badge>
              </div>

              {/* Description */}
              <div className="p-4 rounded-lg bg-muted/20 border">
                <p className="text-center text-muted-foreground leading-relaxed">
                  {resultDescription}
                </p>
              </div>

              {/* Premium CTA */}
              {!hasPremiumAccess && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={handleUnlockClick}
                    disabled={isUnlocking}
                    className={`w-full bg-gradient-to-r ${config.color} hover:opacity-90`}
                    size="lg"
                  >
                    {isUnlocking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processando...
                      </>
                    ) : (
                      <>
                        Desbloquear Relatório Completo - R$ {config.premiumPrice.toFixed(2).replace('.', ',')}
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Paywall for non-premium users */}
          {!hasPremiumAccess && (
            <PremiumPaywall
              attemptId={attemptId!}
              onPaymentSuccess={() => fetchAttempt()}
            />
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/testes')}>
              Fazer outro teste
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Ver meu histórico
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-center text-muted-foreground">
            Este é um teste de caráter informativo e educacional. Os resultados não constituem diagnóstico psicológico ou médico.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resultado;
