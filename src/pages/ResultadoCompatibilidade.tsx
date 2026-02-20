import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Loader2, AlertCircle, CheckCircle, Heart, RefreshCw, Lock,
  Clock, Zap, TrendingUp, Home, Star, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PremiumCompatibilityReport from '@/components/quiz/PremiumCompatibilityReport';
import UnlockPremiumButton from '@/components/quiz/UnlockPremiumButton';
import BuyCertificateButton from '@/components/quiz/BuyCertificateButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { usePaymentPolling } from '@/hooks/usePaymentPolling';
import { getCompatibilityResultBand, CompatibilityResultBand, categoryLabels } from '@/data/compatibilityQuestions';
import { useToast } from '@/hooks/use-toast';

// Compatibility test quiz ID
const COMPATIBILITY_QUIZ_ID = 'f6a7b8c9-d0e1-2345-fabc-678901234567';

type CompCat = 'communication' | 'values' | 'emotional-support' | 'lifestyle' | 'chemistry';

const dimensionConfig: Record<CompCat, { icon: string; label: string }> = {
  'communication':    { icon: '💬', label: 'Comunicação' },
  'values':           { icon: '🌟', label: 'Valores de Vida' },
  'emotional-support':{ icon: '💗', label: 'Apoio Emocional' },
  'lifestyle':        { icon: '🏠', label: 'Estilo de Vida' },
  'chemistry':        { icon: '🔥', label: 'Conexão e Química' },
};

interface AttemptData {
  id: string;
  quiz_id: string;
  total_score: number | null;
  result_category: string | null;
  result_description: string | null;
  has_premium_access: boolean | null;
  has_certificate: boolean | null;
  certificate_payment_status: string | null;
  payment_status: string | null;
  completed_at: string | null;
}

// ── PAYWALL COMPONENT ────────────────────────────────────────────────────────
const CompatibilityPaywall = ({
  resultBand,
  compatPercent,
  attemptId,
  startPolling,
  isPolling,
  pollingAttempts,
  pollingError,
}: {
  resultBand: CompatibilityResultBand;
  compatPercent: number;
  attemptId: string;
  startPolling: () => void;
  isPolling: boolean;
  pollingAttempts: number;
  pollingError: string | null;
}) => {
  const isHighScore = compatPercent >= 71;
  const isMediumScore = compatPercent >= 41 && compatPercent < 71;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Polling alerts */}
      {isPolling && (
        <Alert className="border-primary/50 bg-primary/5">
          <RefreshCw className="h-4 w-4 animate-spin text-primary" />
          <AlertTitle>Confirmando pagamento...</AlertTitle>
          <AlertDescription>Tentativa {pollingAttempts}/25 — aguarde alguns segundos</AlertDescription>
        </Alert>
      )}
      {pollingError && (
        <Alert className="border-amber-500 bg-amber-500/10">
          <Clock className="h-4 w-4 text-amber-500" />
          <AlertTitle className="text-amber-600">Pagamento ainda não confirmado</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <span>{pollingError}</span>
            <Button variant="outline" size="sm" className="w-fit" onClick={startPolling}>
              <RefreshCw className="h-4 w-4 mr-1" /> Verificar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Header card */}
      <Card className="glass-card overflow-hidden">
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-6 text-white text-center">
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mx-auto mb-4">
            ❤️
          </div>
          <h1 className="text-2xl font-bold font-display">Teste de Compatibilidade Amorosa</h1>
          <p className="opacity-90 mt-1 text-sm">Análise Afetiva e Relacional — NEUROX</p>
          <Badge className="mt-3 bg-white/20 text-white border-white/30 text-sm">
            Análise Concluída
          </Badge>
        </div>
      </Card>

      {/* Free summary — apenas 3 frases, sem revelar pontuação */}
      <Card className="glass-card">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-xl">Análise Concluída</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground leading-relaxed max-w-md mx-auto">
            {resultBand.freeDescription}
          </p>
        </CardContent>
      </Card>

      {/* Preview bloqueado das dimensões */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-pink-500" />
            Suas 5 Dimensões Afetivas
            <span className="ml-auto">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(Object.entries(dimensionConfig) as [CompCat, { icon: string; label: string }][]).map(([key, cfg]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5">
                  <span>{cfg.icon}</span>
                  <span className="font-medium">{cfg.label}</span>
                </span>
                <span className="text-muted-foreground text-xs">🔒 Bloqueado</span>
              </div>
              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-rose-500/30 blur-sm" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* O que o relatório contém */}
      <Card className="glass-card">
        <CardContent className="p-5">
          <p className="text-sm font-semibold text-foreground mb-3 text-center">O Relatório Completo Revela:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {[
              { icon: '📊', text: 'Índice real de compatibilidade' },
              { icon: '💬', text: 'Análise de 5 dimensões afetivas' },
              { icon: '✅', text: 'Seus pontos fortes relacionais' },
              { icon: '⚠️', text: 'Riscos ocultos do seu perfil' },
              { icon: '🔮', text: 'Projeção de curto, médio e longo prazo' },
              { icon: '🧠', text: 'Análise psicológica profunda' },
              { icon: '💑', text: 'Perfil do parceiro ideal' },
              { icon: '💡', text: '5 recomendações personalizadas' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-muted/30">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Paywall / CTA */}
      <Card className="glass-card border-pink-500/40 bg-gradient-to-br from-pink-500/5 via-background to-rose-500/5">
        <CardContent className="p-6 md:p-8 text-center space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-xs font-semibold text-pink-600">
              <Heart className="h-3 w-3 fill-pink-500" />
              Relatório Premium de Compatibilidade
            </div>
            <h2 className="text-2xl font-bold font-display">
              Seu nível real de compatibilidade foi calculado
            </h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
              O sistema identificou padrões profundos do seu perfil afetivo. Desbloqueie a análise completa e o PDF agora.
            </p>
          </div>

          {/* Price */}
          <div className="inline-flex flex-col items-center p-4 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Análise Completa + PDF</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-pink-600">R$ 19</span>
              <span className="text-xl font-bold text-pink-600">,90</span>
            </div>
            <span className="text-xs text-muted-foreground mt-1">Pagamento único • Acesso imediato</span>
          </div>

          <p className="text-xs text-muted-foreground italic">
            ⏳ Seu resultado está aguardando revelação. Disponível somente para você.
          </p>

          <UnlockPremiumButton
            attemptId={attemptId}
            testType="compatibility"
            onPaymentInitiated={startPolling}
          />

          <p className="text-xs text-muted-foreground">
            Pagamento 100% seguro • Stripe • Acesso liberado imediatamente após confirmação
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-center pb-6">
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <Home className="h-4 w-4 mr-2" />
            Voltar ao painel
          </Button>
        </Link>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
const ResultadoCompatibilidade = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [resultBand, setResultBand] = useState<CompatibilityResultBand | null>(null);
  const [categoryAnswers, setCategoryAnswers] = useState<Record<CompCat, number> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    isPolling,
    pollingAttempts,
    paymentConfirmed,
    error: pollingError,
    startPolling,
  } = usePaymentPolling({
    attemptId,
    sessionId: null,
    initialPaymentStatus: attempt?.payment_status || null,
    enabled: false,
  });

  const fetchAttempt = useCallback(async () => {
    if (!attemptId) return;

    // IDs temporários (resultado salvo em sessionStorage)
    if (attemptId.startsWith('temp-')) {
      const stored = sessionStorage.getItem(`compat-result-${attemptId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        const { score, percent, resultBand: band, answers, categoryScores } = parsed;
        setAttempt({
          id: attemptId,
          quiz_id: COMPATIBILITY_QUIZ_ID,
          total_score: score,
          result_category: band.name,
          result_description: band.freeDescription,
          has_premium_access: false,
          has_certificate: false,
          certificate_payment_status: null,
          payment_status: null,
          completed_at: new Date().toISOString(),
        });
        setResultBand(band);
        // Category scores se existirem
        if (categoryScores) setCategoryAnswers(categoryScores);
        setIsLoading(false);
        return;
      }
      setError('Resultado não encontrado. Por favor, refaça o teste.');
      setIsLoading(false);
      return;
    }

    if (!user) return;

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
        const percent = Math.round((data.total_score / 150) * 100);
        setResultBand(getCompatibilityResultBand(percent));
      }
    } catch (err) {
      console.error('[COMPATIBILIDADE] Error fetching attempt:', err);
      setError('Não foi possível carregar o resultado.');
    } finally {
      setIsLoading(false);
    }
  }, [attemptId, user]);

  // Refetch when payment confirmed via polling
  useEffect(() => {
    if (paymentConfirmed) {
      toast({
        title: '🎉 Pagamento Confirmado!',
        description: 'Seu relatório de compatibilidade foi liberado.',
      });
      fetchAttempt();
    }
  }, [paymentConfirmed, fetchAttempt, toast]);

  useEffect(() => {
    if (!attemptId) return;
    if (attemptId.startsWith('temp-')) {
      fetchAttempt();
      return;
    }
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) fetchAttempt();
  }, [user, authLoading, navigate, fetchAttempt, attemptId]);

  // Loading
  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-pink-500 mx-auto" />
            <p className="text-muted-foreground">Carregando seu resultado...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error
  if (error || !attempt || !resultBand) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-lg mx-auto">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Resultado não encontrado</AlertTitle>
              <AlertDescription>{error || 'Não foi possível carregar seu resultado de compatibilidade.'}</AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Link to="/teste-compatibilidade">
                <Button>Refazer o Teste</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const score = attempt.total_score ?? 0;
  const compatPercent = Math.round((score / 150) * 100);
  const hasPremium = attempt.has_premium_access === true;
  const hasCertificate = attempt.has_certificate === true && attempt.certificate_payment_status === 'paid';
  const userName = user?.user_metadata?.full_name || 'Participante';

  // Build per-category scores
  const avgPerQuestion = score / 30;
  const catScores = categoryAnswers || ({
    'communication':     Math.round(avgPerQuestion * 6),
    'values':            Math.round(avgPerQuestion * 6),
    'emotional-support': Math.round(avgPerQuestion * 6),
    'lifestyle':         Math.round(avgPerQuestion * 6),
    'chemistry':         Math.round(avgPerQuestion * 6),
  } as Record<CompCat, number>);

  // ── PREMIUM UNLOCKED ──────────────────────────────────────────────────────
  if (hasPremium) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-6 md:py-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <PremiumCompatibilityReport
              totalScore={score}
              compatibilityPercent={compatPercent}
              categoryScores={catScores}
              resultBand={resultBand}
              userName={userName}
              testDate={attempt.completed_at
                ? new Date(attempt.completed_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
                : undefined}
            />

            {/* Certificate section */}
            {!hasCertificate && (
              <Card className="border-pink-500/30">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="h-14 w-14 rounded-xl bg-pink-500/10 flex items-center justify-center mx-auto">
                    <Star className="h-7 w-7 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-bold">Certificado Oficial de Compatibilidade NEUROX</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Gere seu Certificado Oficial em PDF com nome, índice de compatibilidade, data e selo NEUROX.
                  </p>
                  <BuyCertificateButton
                    attemptId={attemptId!}
                    testName="Compatibilidade Amorosa"
                    hasCertificate={false}
                    onPaymentInitiated={startPolling}
                  />
                </CardContent>
              </Card>
            )}

            {hasCertificate && (
              <Card className="border-emerald-500/30 bg-emerald-500/5">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold mb-2">Certificado Disponível</h3>
                  <Link to={`/certificado/${attemptId}`}>
                    <Button variant="outline" className="border-emerald-500 text-emerald-600">
                      Ver Certificado
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── FREE / PAYWALL ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <CompatibilityPaywall
          resultBand={resultBand}
          compatPercent={compatPercent}
          attemptId={attemptId!}
          startPolling={startPolling}
          isPolling={isPolling}
          pollingAttempts={pollingAttempts}
          pollingError={pollingError}
        />
      </main>
      <Footer />
    </div>
  );
};

export default ResultadoCompatibilidade;
