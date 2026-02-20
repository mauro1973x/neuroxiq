import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Clock, XCircle, Brain, Heart, User, TrendingUp, Briefcase, Scale, RefreshCw, Flame } from 'lucide-react';
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
import PremiumCareerReport from '@/components/quiz/PremiumCareerReport';
import PremiumPersonalityReport from '@/components/quiz/PremiumPersonalityReport';
import PremiumEmotionalReport from '@/components/quiz/PremiumEmotionalReport';
import PremiumPoliticalReport from '@/components/quiz/PremiumPoliticalReport';
import PremiumCompatibilityReport from '@/components/quiz/PremiumCompatibilityReport';
import UnlockPremiumButton from '@/components/quiz/UnlockPremiumButton';
import BuyCertificateButton from '@/components/quiz/BuyCertificateButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentPolling } from '@/hooks/usePaymentPolling';
import { getResultBand, IQResultBand } from '@/data/iqQuestions';
import { getEmotionalResultBand, EmotionalResultBand } from '@/data/emotionalQuestions';
import { 
  getPersonalityResultBand, 
  PersonalityResultBand, 
  PersonalityCategory,
  categoryLabels as personalityCategoryLabels
} from '@/data/personalityQuestions';
import { 
  getCareerResultBand, 
  CareerResultBand, 
  CareerCategory,
  categoryLabels as careerCategoryLabels
} from '@/data/careerQuestions';
import { 
  PoliticalResultBand,
  calculateCategoryScores as calculatePoliticalCategoryScores,
  categoryLabels as politicalCategoryLabels
} from '@/data/politicalQuestions';
import { getCompatibilityResultBand, CompatibilityResultBand } from '@/data/compatibilityQuestions';
import { useToast } from '@/hooks/use-toast';

// Quiz IDs
const IQ_QUIZ_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const EMOTIONAL_QUIZ_ID = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';
const PERSONALITY_QUIZ_ID = 'c3d4e5f6-a7b8-9012-cdef-345678901234';
const CAREER_QUIZ_ID = 'd4e5f6a7-b8c9-0123-defa-456789012345';
const POLITICAL_QUIZ_ID = 'e5f6a7b8-c9d0-1234-efab-567890123456';
const COMPATIBILITY_QUIZ_ID = 'f6a7b8c9-d0e1-2345-fabc-678901234567';

type TestType = 'iq' | 'emotional' | 'personality' | 'career' | 'political' | 'compatibility' | 'unknown';

interface AttemptData {
  id: string;
  quiz_id: string;
  total_score: number | null;
  result_category: string | null;
  result_description: string | null;
  has_premium_access: boolean | null;
  has_certificate: boolean | null;
  certificate_payment_status: string | null;
  test_name: string | null;
  payment_status: string | null;
  completed_at: string | null;
}

const getTestType = (quizId: string): TestType => {
  switch (quizId) {
    case IQ_QUIZ_ID: return 'iq';
    case EMOTIONAL_QUIZ_ID: return 'emotional';
    case PERSONALITY_QUIZ_ID: return 'personality';
    case CAREER_QUIZ_ID: return 'career';
    case POLITICAL_QUIZ_ID: return 'political';
    case COMPATIBILITY_QUIZ_ID: return 'compatibility';
    default: return 'unknown';
  }
};

const getTestConfig = (testType: TestType) => {
  switch (testType) {
    case 'iq': return { title: 'Resultado do Teste de QI', subtitle: 'Análise do seu desempenho cognitivo', icon: Brain, color: 'from-primary to-blue-600', totalQuestions: 30, maxScore: 30, scoreLabel: 'Acertos', premiumPrice: 19.90 };
    case 'emotional': return { title: 'Resultado do Teste Emocional', subtitle: 'Análise da sua inteligência emocional', icon: Heart, color: 'from-rose-500 to-red-600', totalQuestions: 30, maxScore: 30, scoreLabel: 'Pontuação QE', premiumPrice: 19.90 };
    case 'personality': return { title: 'Resultado do Teste de Personalidade', subtitle: 'Análise do seu perfil Big Five (OCEAN)', icon: User, color: 'from-violet-500 to-purple-600', totalQuestions: 40, maxScore: 120, scoreLabel: 'Pontuação Total', premiumPrice: 19.90 };
    case 'career': return { title: 'Resultado da Orientação de Carreira', subtitle: 'Análise do seu perfil vocacional (RIASEC)', icon: TrendingUp, color: 'from-amber-500 to-orange-600', totalQuestions: 42, maxScore: 126, scoreLabel: 'Pontuação Total', premiumPrice: 19.90 };
    case 'political': return { title: 'Resultado do Teste Político-Ideológico', subtitle: 'Análise do seu posicionamento no espectro político', icon: Scale, color: 'from-red-500 to-orange-600', totalQuestions: 40, maxScore: 100, scoreLabel: 'Posição no Espectro', premiumPrice: 19.90 };
    case 'compatibility': return { title: 'Resultado do Teste de Compatibilidade', subtitle: 'Análise do seu perfil afetivo e relacional', icon: Flame, color: 'from-pink-500 to-rose-600', totalQuestions: 30, maxScore: 150, scoreLabel: 'Índice de Compatibilidade', premiumPrice: 19.90 };
    default: return { title: 'Resultado do Teste', subtitle: 'Análise do seu desempenho', icon: TrendingUp, color: 'from-primary to-blue-600', totalQuestions: 30, maxScore: 30, scoreLabel: 'Pontuação', premiumPrice: 19.90 };
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
  const [careerResultBand, setCareerResultBand] = useState<CareerResultBand | null>(null);
  const [politicalResultBand, setPoliticalResultBand] = useState<PoliticalResultBand | null>(null);
  const [compatibilityResultBand, setCompatibilityResultBand] = useState<CompatibilityResultBand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentParam = searchParams.get('payment');
  const sessionIdParam = searchParams.get('session_id');
  const [isVerifying, setIsVerifying] = useState(false);

  // Use the payment polling hook
  const {
    isPolling,
    pollingAttempts,
    paymentConfirmed,
    paymentStatus,
    error: pollingError,
    startPolling
  } = usePaymentPolling({
    attemptId,
    sessionId: sessionIdParam,
    initialPaymentStatus: attempt?.payment_status || null,
    enabled: !!(paymentParam === 'success' || sessionIdParam || attempt?.payment_status === 'pending')
  });

  const fetchAttempt = useCallback(async () => {
    if (!attemptId || !user) return;

    console.log('[RESULTADO] Fetching attempt:', attemptId, 'for user:', user.id);

    try {
      const { data, error: fetchError } = await supabase
        .from('test_attempts')
        .select('*')
        .eq('id', attemptId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('Resultado não encontrado');

      console.log('[RESULTADO] Attempt data:', {
        id: data.id,
        score: data.total_score,
        hasPremium: data.has_premium_access,
        paymentStatus: data.payment_status
      });

      setAttempt(data as AttemptData);

      const detectedType = getTestType(data.quiz_id);
      setTestType(detectedType);
      console.log('[RESULTADO] Test type detected:', detectedType);

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
          case 'career':
            setCareerResultBand(getCareerResultBand(data.total_score));
            break;
          case 'political':
            const { data: politicalBand } = await supabase
              .from('political_result_bands')
              .select('*')
              .gte('max_score', data.total_score)
              .lte('min_score', data.total_score)
              .single();
            if (politicalBand) {
              setPoliticalResultBand(politicalBand as PoliticalResultBand);
            }
            break;
          case 'compatibility': {
            const percent = Math.round((data.total_score / 150) * 100);
            setCompatibilityResultBand(getCompatibilityResultBand(percent));
            break;
          }
        }
      }
    } catch (err) {
      console.error('[RESULTADO] Error fetching attempt:', err);
      setError('Não foi possível carregar o resultado.');
    } finally {
      setIsLoading(false);
    }
  }, [attemptId, user]);

  // On payment return, call verify-session to unlock content if Stripe confirms paid
  // This provides a synchronous fallback when webhook is delayed
  // CRITICAL: Must verify even if has_premium_access is true (for bundle purchases that include certificate)
  useEffect(() => {
    const verifyAndUnlock = async () => {
      // Trigger verification if:
      // 1. We have payment success params
      // 2. User is logged in
      // 3. We're not already verifying
      // 4. We have attempt data loaded
      if (paymentParam === 'success' && sessionIdParam && user && !isVerifying && attempt !== null) {
        // For bundle: verify even if premium is already unlocked (certificate might not be)
        // For premium_report: verify only if premium is not unlocked
        // We don't know the purchase_type here, so we verify if EITHER content is missing
        const needsPremiumUnlock = !attempt.has_premium_access;
        const needsCertificateUnlock = attempt.certificate_payment_status !== 'paid';
        
        // Skip verification only if BOTH are already unlocked (bundle case)
        // or if premium is unlocked (premium_report case)
        // Since we don't know purchase_type, always verify if certificate is not unlocked
        if (!needsPremiumUnlock && !needsCertificateUnlock) {
          console.log('[RESULTADO] Both premium and certificate already unlocked, skipping verification');
          navigate(`/resultado/${attemptId}`, { replace: true });
          return;
        }

        setIsVerifying(true);
        console.log('[RESULTADO] Payment return detected, calling verify-session', { 
          sessionId: sessionIdParam,
          needsPremiumUnlock,
          needsCertificateUnlock
        });
        
        try {
          // Call verify-session edge function - this will unlock if Stripe shows 'paid'
          const { data, error: verifyError } = await supabase.functions.invoke('verify-session', {
            body: { sessionId: sessionIdParam }
          });

          console.log('[RESULTADO] verify-session response:', data, verifyError);

          if (verifyError) {
            console.error('[RESULTADO] verify-session error:', verifyError);
            toast({
              variant: 'destructive',
              title: 'Erro ao verificar pagamento',
              description: 'Tente atualizar a página em alguns segundos.'
            });
          } else if (data?.verified) {
            console.log('[RESULTADO] Payment verified and content unlocked!', { purchaseType: data.purchaseType });
            
            // Show appropriate toast based on what was unlocked
            const purchaseType = data.purchaseType || 'premium_report';
            if (purchaseType === 'bundle') {
              toast({
                title: '🎉 Pagamento Confirmado!',
                description: 'Seu relatório premium e certificado foram liberados.',
              });
            } else if (purchaseType === 'certificate') {
              toast({
                title: '🎉 Pagamento Confirmado!',
                description: 'Seu certificado foi liberado.',
              });
            } else {
              toast({
                title: 'Pagamento Confirmado!',
                description: 'Seu relatório premium foi liberado.',
              });
            }
            // Refetch to get updated data
            fetchAttempt();
          } else {
            console.log('[RESULTADO] Payment not yet confirmed, starting polling');
            // Payment not yet complete, start polling
            startPolling();
          }
        } catch (err) {
          console.error('[RESULTADO] Error calling verify-session:', err);
          // Fallback to polling
          startPolling();
        } finally {
          // Clean URL params
          navigate(`/resultado/${attemptId}`, { replace: true });
          setIsVerifying(false);
        }
      }
    };

    verifyAndUnlock();
  }, [paymentParam, sessionIdParam, user, attempt, isVerifying, navigate, attemptId, startPolling, fetchAttempt, toast]);

  // Refetch when payment is confirmed via polling
  useEffect(() => {
    if (paymentConfirmed) {
      console.log('[RESULTADO] Payment confirmed via polling, refetching attempt data');
      toast({
        title: 'Pagamento Confirmado!',
        description: 'Seu relatório premium foi liberado com sucesso.',
        variant: 'default',
      });
      fetchAttempt();
    }
  }, [paymentConfirmed, fetchAttempt, toast]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }

    if (user) {
      fetchAttempt();
    }
  }, [user, authLoading, navigate, fetchAttempt]);

  // Render payment status alerts
  const renderPaymentAlerts = () => {
    const canceled = searchParams.get('canceled') || searchParams.get('cancelled') || paymentParam === 'cancel';
    
    return (
      <>
        {isVerifying && (
          <Alert className="mb-6 max-w-2xl mx-auto border-primary/50 bg-primary/5">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <AlertTitle className="text-primary">Verificando pagamento...</AlertTitle>
            <AlertDescription>
              Aguarde enquanto confirmamos seu pagamento.
            </AlertDescription>
          </Alert>
        )}

        {isPolling && !isVerifying && (
          <Alert className="mb-6 max-w-2xl mx-auto border-primary/50 bg-primary/5">
            <RefreshCw className="h-4 w-4 animate-spin text-primary" />
            <AlertTitle className="text-primary">Confirmando pagamento...</AlertTitle>
            <AlertDescription>
              Aguarde enquanto verificamos seu pagamento. Tentativa {pollingAttempts}/25
            </AlertDescription>
          </Alert>
        )}

        {paymentConfirmed && (
          <Alert className="mb-6 max-w-2xl mx-auto border-success bg-success/10">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Pagamento Confirmado!</AlertTitle>
            <AlertDescription>
              Seu relatório premium foi liberado com sucesso.
            </AlertDescription>
          </Alert>
        )}

        {pollingError && (
          <Alert className="mb-6 max-w-2xl mx-auto border-warning bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Pagamento ainda não confirmado</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>{pollingError}</span>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startPolling}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Verificar novamente
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                >
                  Atualizar página
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'pending' && !isPolling && !paymentConfirmed && !isVerifying && (
          <Alert className="mb-6 max-w-2xl mx-auto border-warning bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Pagamento Pendente</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>Aguardando confirmação do pagamento. Se você pagou via PIX, pode levar alguns minutos.</span>
              <Button
                variant="outline"
                size="sm"
                className="w-fit mt-2"
                onClick={startPolling}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Verificar novamente
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {canceled && (
          <Alert className="mb-6 max-w-2xl mx-auto" variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Pagamento Cancelado</AlertTitle>
            <AlertDescription className="flex flex-col gap-2">
              <span>O pagamento foi cancelado. Você pode tentar novamente abaixo.</span>
              <Button
                variant="outline"
                size="sm"
                className="w-fit mt-2 border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={() => navigate(`/resultado/${attemptId}`, { replace: true })}
              >
                Fechar aviso
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </>
    );
  };

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
  // SECURITY: Premium access MUST come from database only (set by webhook)
  // Never grant access based on frontend state like paymentConfirmed
  const hasPremiumAccess = attempt.has_premium_access === true;
  const config = getTestConfig(testType);
  const Icon = config.icon;
  const percentage = Math.round((score / config.maxScore) * 100);

  // Render IQ Test Result
  if (testType === 'iq' && iqResultBand) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          {renderPaymentAlerts()}

          {hasPremiumAccess ? (
            <div className="space-y-8">
              <PremiumReport
                score={score}
                totalQuestions={30}
                resultBand={iqResultBand}
              />
              
              {/* Certificate CTA Section */}
              <div className="max-w-2xl mx-auto">
                <BuyCertificateButton
                  attemptId={attemptId!}
                  testName={attempt.test_name || 'Teste de QI'}
                  hasCertificate={attempt.has_certificate || false}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <IQTestResult
                score={score}
                totalQuestions={30}
                resultBand={iqResultBand}
                showPremium={false}
              />
              
              <div className="max-w-2xl mx-auto">
                <UnlockPremiumButton
                  attemptId={attemptId!}
                  testType="iq"
                  onPaymentInitiated={startPolling}
                />
              </div>

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

  // Render Career Test Result
  if (testType === 'career' && careerResultBand) {
    const parseCareerData = () => {
      const defaultScores: Record<CareerCategory, number> = {
        realistic: 0, investigative: 0, artistic: 0,
        social: 0, enterprising: 0, conventional: 0
      };
      const defaultTop: CareerCategory[] = ['realistic', 'investigative', 'artistic'];
      
      const hollandMatch = attempt.result_description?.match(/Perfil dominante: ([A-Za-z\s+]+)/);
      let hollandCode = 'RIA';
      let topCategories = defaultTop;
      
      if (hollandMatch) {
        const profiles = hollandMatch[1].split(' + ').map(p => p.trim().toLowerCase());
        const categoryMap: Record<string, CareerCategory> = {
          'realista': 'realistic',
          'investigativo': 'investigative',
          'artístico': 'artistic',
          'social': 'social',
          'empreendedor': 'enterprising',
          'convencional': 'conventional'
        };
        
        topCategories = profiles
          .map(p => categoryMap[p])
          .filter((c): c is CareerCategory => c !== undefined)
          .slice(0, 3);
        
        if (topCategories.length < 3) {
          topCategories = defaultTop;
        }
        
        hollandCode = topCategories.map(c => c[0].toUpperCase()).join('');
      }
      
      const totalScore = score;
      const baseScore = Math.floor(totalScore / 6);
      const remainder = totalScore % 6;
      
      const categoryScores = { ...defaultScores };
      topCategories.forEach((cat, idx) => {
        categoryScores[cat] = baseScore + (idx < remainder ? 3 : 2);
      });
      
      return { categoryScores, topCategories, hollandCode };
    };

    const careerData = parseCareerData();

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          {renderPaymentAlerts()}

          {hasPremiumAccess ? (
            <div className="space-y-8">
              <PremiumCareerReport
                totalScore={score}
                categoryScores={careerData.categoryScores}
                topCategories={careerData.topCategories}
                hollandCode={careerData.hollandCode}
                resultBand={careerResultBand}
              />
              
              {/* Certificate CTA Section */}
              <div className="max-w-2xl mx-auto">
                <BuyCertificateButton
                  attemptId={attemptId!}
                  testName={attempt.test_name || 'Teste de Orientação de Carreira'}
                  hasCertificate={attempt.has_certificate || false}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Card className="glass-card overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600" />
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-display">Resultado da Orientação de Carreira</CardTitle>
                  <CardDescription className="text-lg">Análise do seu perfil vocacional (RIASEC)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-2">Pontuação Total</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                      {score}
                      <span className="text-2xl text-muted-foreground">/126</span>
                    </div>
                    <Progress value={percentage} className="mt-4 h-3" />
                    <div className="text-sm text-muted-foreground mt-2">{percentage}% de aproveitamento</div>
                  </div>

                  <div className="text-center">
                    <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0">
                      {attempt.result_category}
                    </Badge>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="text-sm text-muted-foreground mb-1">Seu Código Holland</div>
                    <div className="text-2xl font-bold font-mono text-amber-600">{careerData.hollandCode}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {careerData.topCategories.map(c => careerCategoryLabels[c]).join(' + ')}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/20 border">
                    <p className="text-center text-muted-foreground leading-relaxed">
                      {attempt.result_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <UnlockPremiumButton
                      attemptId={attemptId!}
                      testType="career"
                      onPaymentInitiated={startPolling}
                    />
                  </div>
                </CardContent>
              </Card>

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

  // Render Personality Test Result
  if (testType === 'personality' && personalityResultBand) {
    const parsePersonalityData = () => {
      const defaultScores: Record<PersonalityCategory, number> = {
        openness: 50, conscientiousness: 50, extraversion: 50,
        agreeableness: 50, neuroticism: 50
      };
      
      const totalScore = score;
      const avgPerCategory = Math.round((totalScore / 120) * 100);
      
      const categoryScores = { ...defaultScores };
      const categories: PersonalityCategory[] = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
      
      categories.forEach((cat, idx) => {
        const variation = ((idx % 2 === 0) ? 5 : -5);
        categoryScores[cat] = Math.min(100, Math.max(0, avgPerCategory + variation));
      });
      
      const sortedCategories = [...categories].sort((a, b) => categoryScores[b] - categoryScores[a]);
      const dominantTraits = sortedCategories.slice(0, 3);
      
      return { categoryScores, dominantTraits };
    };

    const personalityData = parsePersonalityData();

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          {renderPaymentAlerts()}

          {hasPremiumAccess ? (
            <div className="space-y-8">
              <PremiumPersonalityReport
                totalScore={score}
                categoryScores={personalityData.categoryScores}
                dominantTraits={personalityData.dominantTraits}
                resultBand={personalityResultBand}
              />
              
              {/* Certificate CTA Section */}
              <div className="max-w-2xl mx-auto">
                <BuyCertificateButton
                  attemptId={attemptId!}
                  testName={attempt.test_name || 'Teste de Personalidade'}
                  hasCertificate={attempt.has_certificate || false}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Card className="glass-card overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-violet-500 to-purple-600" />
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                      <User className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-display">Resultado do Teste de Personalidade</CardTitle>
                  <CardDescription className="text-lg">Análise do seu perfil Big Five (OCEAN)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-2">Pontuação Total</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                      {score}
                      <span className="text-2xl text-muted-foreground">/120</span>
                    </div>
                    <Progress value={Math.round((score / 120) * 100)} className="mt-4 h-3" />
                    <div className="text-sm text-muted-foreground mt-2">{Math.round((score / 120) * 100)}% de aproveitamento</div>
                  </div>

                  <div className="text-center">
                    <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0">
                      {attempt.result_category}
                    </Badge>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-violet-500/10 border border-violet-500/30">
                    <div className="text-sm text-muted-foreground mb-1">Perfil OCEAN</div>
                    <div className="text-2xl font-bold font-mono text-violet-600">
                      {personalityData.dominantTraits.map(t => t[0].toUpperCase()).join('')}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {personalityData.dominantTraits.map(c => personalityCategoryLabels[c]).join(' + ')}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/20 border">
                    <p className="text-center text-muted-foreground leading-relaxed">
                      {attempt.result_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <UnlockPremiumButton
                      attemptId={attemptId!}
                      testType="personality"
                      onPaymentInitiated={startPolling}
                    />
                  </div>
                </CardContent>
              </Card>

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

  // Render Emotional Test Result
  if (testType === 'emotional' && emotionalResultBand) {
    const parseEmotionalData = () => {
      type EmotionalCategory = 'self-awareness' | 'self-regulation' | 'motivation' | 'empathy' | 'social-skills';
      
      const defaultScores: Record<EmotionalCategory, number> = {
        'self-awareness': 3, 'self-regulation': 3, 'motivation': 3,
        'empathy': 3, 'social-skills': 3
      };
      
      const avgPerCategory = Math.round(score / 5);
      const categories: EmotionalCategory[] = ['self-awareness', 'self-regulation', 'motivation', 'empathy', 'social-skills'];
      
      const categoryScores = { ...defaultScores };
      categories.forEach((cat, idx) => {
        const variation = idx < (score % 5) ? 1 : 0;
        categoryScores[cat] = Math.min(6, avgPerCategory + variation);
      });
      
      const sortedCategories = [...categories].sort((a, b) => categoryScores[b] - categoryScores[a]);
      const dominantCompetencies = sortedCategories.slice(0, 3);
      
      const estimatedEQ = Math.round(60 + (score / 30) * 80);
      
      return { categoryScores, dominantCompetencies, estimatedEQ };
    };

    const emotionalData = parseEmotionalData();
    const emotionalCategoryLabels: Record<string, string> = {
      'self-awareness': 'Autoconsciência',
      'self-regulation': 'Autorregulação',
      'motivation': 'Motivação',
      'empathy': 'Empatia',
      'social-skills': 'Habilidades Sociais'
    };

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          {renderPaymentAlerts()}

          {hasPremiumAccess ? (
            <div className="space-y-8">
              <PremiumEmotionalReport
                totalScore={score}
                categoryScores={emotionalData.categoryScores}
                dominantCompetencies={emotionalData.dominantCompetencies}
                estimatedEQ={emotionalData.estimatedEQ}
                resultBand={emotionalResultBand}
              />
              
              {/* Certificate CTA Section */}
              <div className="max-w-2xl mx-auto">
                <BuyCertificateButton
                  attemptId={attemptId!}
                  testName={attempt.test_name || 'Teste de Inteligência Emocional'}
                  hasCertificate={attempt.has_certificate || false}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Card className="glass-card overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-rose-500 to-red-600" />
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-display">Resultado do Teste Emocional</CardTitle>
                  <CardDescription className="text-lg">Análise da sua Inteligência Emocional (QE)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-muted/30">
                    <div className="text-sm text-muted-foreground mb-2">Pontuação Total</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-rose-500 to-red-600 bg-clip-text text-transparent">
                      {score}
                      <span className="text-2xl text-muted-foreground">/30</span>
                    </div>
                    <Progress value={Math.round((score / 30) * 100)} className="mt-4 h-3" />
                    <div className="text-sm text-muted-foreground mt-2">{Math.round((score / 30) * 100)}% de aproveitamento</div>
                  </div>

                  <div className="text-center">
                    <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-rose-500 to-red-600 text-white border-0">
                      {attempt.result_category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      <div className="text-sm text-muted-foreground mb-1">QE Estimado</div>
                      <div className="text-2xl font-bold font-mono text-rose-600">~{emotionalData.estimatedEQ}</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-rose-500/10 border border-rose-500/30">
                      <div className="text-sm text-muted-foreground mb-1">Faixa Percentil</div>
                      <div className="text-2xl font-bold font-mono text-rose-600">{emotionalResultBand.percentileRange}</div>
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-muted/20 border">
                    <div className="text-sm text-muted-foreground mb-2">Competências Dominantes</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {emotionalData.dominantCompetencies.map((comp, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 text-sm">
                          {emotionalCategoryLabels[comp]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/20 border">
                    <p className="text-center text-muted-foreground leading-relaxed">
                      {attempt.result_description}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <UnlockPremiumButton
                      attemptId={attemptId!}
                      testType="emotional"
                      onPaymentInitiated={startPolling}
                    />
                  </div>
                </CardContent>
              </Card>

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

  // Render Political Test Result
  if (testType === 'political' && politicalResultBand) {
    const mockAnswers: (number | null)[] = new Array(40).fill(1);
    
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          {renderPaymentAlerts()}

          {hasPremiumAccess ? (
            <div className="space-y-8">
              <PremiumPoliticalReport
                resultBand={politicalResultBand}
                totalScore={score}
                answers={mockAnswers}
                attemptId={attemptId!}
                userName={user?.user_metadata?.full_name || 'Participante'}
              />
              
              {/* Certificate CTA Section */}
              <div className="max-w-2xl mx-auto">
                <BuyCertificateButton
                  attemptId={attemptId!}
                  testName={attempt.test_name || 'Teste de Orientação Político-Ideológica'}
                  hasCertificate={attempt.has_certificate || false}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Card className="glass-card overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-red-500 to-orange-600" />
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
                      <Scale className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-display">Resultado do Teste Político-Ideológico</CardTitle>
                  <CardDescription className="text-lg">Análise do seu posicionamento no espectro político</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-muted/30">
                    <div className="flex justify-center mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-foreground mb-1">Análise Concluída</div>
                    <p className="text-sm text-muted-foreground">
                      Suas 40 respostas foram processadas com sucesso.
                    </p>
                  </div>

                  <div className="p-5 rounded-xl bg-gradient-to-br from-red-500/5 to-orange-500/5 border border-red-500/20">
                    <div className="flex items-start gap-3">
                      <Brain className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          Seu perfil político-ideológico foi identificado com alta precisão.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          A análise cruzou seus posicionamentos em quatro eixos — econômico, social, autoridade e valores — revelando padrões que definem como você interpreta o mundo político.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">O relatório completo inclui:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Sua posição ideológica detalhada',
                        'Análise dos 4 eixos políticos',
                        'Tendências e traços comportamentais',
                        'Figuras históricas com perfil similar',
                        'Carreiras compatíveis com seu perfil',
                        'Interpretação psicológica completa'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <UnlockPremiumButton
                      attemptId={attemptId!}
                      testType="political"
                      onPaymentInitiated={startPolling}
                    />
                  </div>
                </CardContent>
              </Card>

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

  // Render Compatibility Test Result
  if (testType === 'compatibility' && compatibilityResultBand) {
    const compatPercent = Math.round((score / 150) * 100);
    type CompCat = 'communication' | 'values' | 'emotional-support' | 'lifestyle' | 'chemistry';
    const catKeys: CompCat[] = ['communication', 'values', 'emotional-support', 'lifestyle', 'chemistry'];
    const avgPerCat = Math.floor(score / 5);
    const catScores = Object.fromEntries(catKeys.map((k, i) => [k, avgPerCat + (i < score % 5 ? 1 : 0)])) as Record<CompCat, number>;

    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          {renderPaymentAlerts()}
          {hasPremiumAccess ? (
            <div className="space-y-8">
              <PremiumCompatibilityReport
                totalScore={score}
                compatibilityPercent={compatPercent}
                categoryScores={catScores}
                resultBand={compatibilityResultBand}
                userName={user?.user_metadata?.full_name || 'Participante'}
              />
              <div className="max-w-2xl mx-auto">
                <BuyCertificateButton
                  attemptId={attemptId!}
                  testName={attempt.test_name || 'Teste de Compatibilidade Amorosa'}
                  hasCertificate={attempt.has_certificate || false}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <Card className="glass-card overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-pink-500 to-rose-600" />
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-3xl shadow-lg shadow-pink-500/30">❤️</div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl font-display">Resultado do Teste de Compatibilidade</CardTitle>
                  <CardDescription className="text-lg">Análise do seu perfil afetivo e relacional</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 rounded-xl bg-muted/30">
                    <div className="flex justify-center mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-foreground mb-1">Análise Concluída</div>
                    <p className="text-sm text-muted-foreground">Suas 30 respostas foram processadas com sucesso.</p>
                  </div>
                  <div className="p-5 rounded-xl bg-pink-500/5 border border-pink-500/20">
                    <p className="text-sm text-muted-foreground leading-relaxed text-center">
                      {attempt.result_description}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">O relatório completo inclui:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {['Nível real de compatibilidade', 'Pontos fortes do casal', 'Riscos ocultos identificados', 'Probabilidade de longo prazo', 'Perfil do parceiro ideal', 'Recomendações práticas'].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-pink-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <UnlockPremiumButton attemptId={attemptId!} testType="compatibility" onPaymentInitiated={startPolling} />
                  </div>
                </CardContent>
              </Card>
              <PremiumPaywall attemptId={attemptId!} onPaymentSuccess={() => fetchAttempt()} />
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }

  // Generic Result Display for unknown test types
  const resultCategory = attempt.result_category || 'Resultado';
  const resultDescription = attempt.result_description || '';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-12">
        {renderPaymentAlerts()}

        <div className="max-w-3xl mx-auto space-y-8">
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
              <div className="text-center p-6 rounded-xl bg-muted/30">
                <div className="text-sm text-muted-foreground mb-2">{config.scoreLabel}</div>
                <div className={`text-5xl font-bold bg-gradient-to-r ${config.color} bg-clip-text text-transparent`}>
                  {score}
                  <span className="text-2xl text-muted-foreground">/{config.maxScore}</span>
                </div>
                <Progress value={percentage} className="mt-4 h-3" />
                <div className="text-sm text-muted-foreground mt-2">{percentage}% de aproveitamento</div>
              </div>

              <div className="text-center">
                <Badge className={`text-lg px-4 py-2 bg-gradient-to-r ${config.color} text-white border-0`}>
                  {resultCategory}
                </Badge>
              </div>

              <div className="p-4 rounded-lg bg-muted/20 border">
                <p className="text-center text-muted-foreground leading-relaxed">
                  {resultDescription}
                </p>
              </div>

              {!hasPremiumAccess && (
                <div className="pt-4 border-t">
                  <UnlockPremiumButton
                    attemptId={attemptId!}
                    testType={testType}
                    onPaymentInitiated={startPolling}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {!hasPremiumAccess && (
            <PremiumPaywall
              attemptId={attemptId!}
              onPaymentSuccess={() => fetchAttempt()}
            />
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate('/testes')}>
              Fazer outro teste
            </Button>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Ver meu histórico
            </Button>
          </div>

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
