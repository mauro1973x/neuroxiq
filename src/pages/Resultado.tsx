import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Clock, XCircle, Brain, Heart, User, TrendingUp, Briefcase, Scale, RefreshCw } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';

// Quiz IDs
const IQ_QUIZ_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
const EMOTIONAL_QUIZ_ID = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';
const PERSONALITY_QUIZ_ID = 'c3d4e5f6-a7b8-9012-cdef-345678901234';
const CAREER_QUIZ_ID = 'd4e5f6a7-b8c9-0123-defa-456789012345';
const POLITICAL_QUIZ_ID = 'e5f6a7b8-c9d0-1234-efab-567890123456';

type TestType = 'iq' | 'emotional' | 'personality' | 'career' | 'political' | 'unknown';

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
        premiumPrice: 19.90
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
        premiumPrice: 19.90
      };
    case 'career':
      return {
        title: 'Resultado da Orientação de Carreira',
        subtitle: 'Análise do seu perfil vocacional (RIASEC)',
        icon: TrendingUp,
        color: 'from-amber-500 to-orange-600',
        totalQuestions: 42,
        maxScore: 126,
        scoreLabel: 'Pontuação Total',
        premiumPrice: 19.90
      };
    case 'political':
      return {
        title: 'Resultado do Teste Político-Ideológico',
        subtitle: 'Análise do seu posicionamento no espectro político',
        icon: Scale,
        color: 'from-red-500 to-orange-600',
        totalQuestions: 40,
        maxScore: 100,
        scoreLabel: 'Posição no Espectro',
        premiumPrice: 19.90
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
  const [careerResultBand, setCareerResultBand] = useState<CareerResultBand | null>(null);
  const [politicalResultBand, setPoliticalResultBand] = useState<PoliticalResultBand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const paymentParam = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');

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
    sessionId,
    initialPaymentStatus: attempt?.payment_status || null,
    enabled: !!(paymentParam === 'success' || sessionId || attempt?.payment_status === 'pending')
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
        }
      }
    } catch (err) {
      console.error('[RESULTADO] Error fetching attempt:', err);
      setError('Não foi possível carregar o resultado.');
    } finally {
      setIsLoading(false);
    }
  }, [attemptId, user]);

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
    return (
      <>
        {isPolling && (
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
            <AlertTitle className="text-warning">Aguardando Confirmação</AlertTitle>
            <AlertDescription>
              {pollingError}
              <Button
                variant="link"
                className="p-0 h-auto ml-2"
                onClick={() => window.location.reload()}
              >
                Atualizar página
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {paymentStatus === 'pending' && !isPolling && !paymentConfirmed && (
          <Alert className="mb-6 max-w-2xl mx-auto border-warning bg-warning/10">
            <Clock className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Pagamento Pendente</AlertTitle>
            <AlertDescription>
              Aguardando confirmação do pagamento. Se você pagou via PIX, pode levar alguns minutos.
              <Button
                variant="link"
                className="p-0 h-auto ml-2"
                onClick={startPolling}
              >
                Verificar novamente
              </Button>
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
  const hasPremiumAccess = attempt.has_premium_access || paymentConfirmed;
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
                    <div className="text-sm text-muted-foreground mb-2">Posição no Espectro</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                      {score}
                      <span className="text-2xl text-muted-foreground">/100</span>
                    </div>
                    <div className="mt-4 relative">
                      <div className="h-4 bg-gradient-to-r from-blue-600 via-gray-400 to-red-600 rounded-full" />
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full"
                        style={{ left: `calc(${score}% - 8px)` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-2">
                      <span>Progressista</span>
                      <span>Centro</span>
                      <span>Conservador</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-red-500 to-orange-600 text-white border-0">
                      {attempt.result_category}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-muted/20 border">
                      <div className="text-xs text-muted-foreground mb-1">Econômico</div>
                      <div className="text-sm font-medium">{politicalResultBand.economic_axis}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/20 border">
                      <div className="text-xs text-muted-foreground mb-1">Social</div>
                      <div className="text-sm font-medium">{politicalResultBand.social_axis}</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-muted/20 border">
                      <div className="text-xs text-muted-foreground mb-1">Autoridade</div>
                      <div className="text-sm font-medium">{politicalResultBand.authority_axis}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/20 border">
                    <p className="text-center text-muted-foreground leading-relaxed">
                      {attempt.result_description || politicalResultBand.free_description}
                    </p>
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
