import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Brain, Heart, User, TrendingUp, Scale, Flame, ArrowRight, LogIn, UserPlus, CheckCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PendingResult {
  quizId: string;
  testName: string;
  score: number;
  resultCategory: string;
  resultDescription: string;
  scoreLabel: string;
  scoreValue: string;
  testType: string;
  iqEstimated?: number;
}

const testIcons: Record<string, React.ElementType> = {
  iq: Brain,
  emotional: Heart,
  personality: User,
  career: TrendingUp,
  political: Scale,
  compatibility: Flame,
};

const testColors: Record<string, string> = {
  iq: 'from-blue-500 to-indigo-600',
  emotional: 'from-rose-500 to-red-600',
  personality: 'from-violet-500 to-purple-600',
  career: 'from-amber-500 to-orange-600',
  political: 'from-red-500 to-orange-600',
  compatibility: 'from-pink-500 to-rose-600',
};

const ResultadoPendente = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [pendingResult, setPendingResult] = useState<PendingResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // The route param IS the tempKey directly (e.g. temp-qi-1234567890)
  const tempKey = attemptId || '';

  useEffect(() => {
    const stored = sessionStorage.getItem(`pending-result-${tempKey}`);
    if (stored) {
      try {
        setPendingResult(JSON.parse(stored));
      } catch {
        navigate('/testes');
      }
    } else {
      navigate('/testes');
    }
  }, [tempKey, navigate]);

  // When user logs in, save result to database automatically
  useEffect(() => {
    if (!user || !pendingResult || isSaving) return;

    const saveResult = async () => {
      setIsSaving(true);
      try {
        const { data: attempt, error: insertError } = await supabase
          .from('test_attempts')
          .insert({
            user_id: user.id,
            quiz_id: pendingResult.quizId,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            total_score: pendingResult.score,
            result_category: pendingResult.resultCategory,
            result_description: pendingResult.resultDescription,
            test_name: pendingResult.testName,
            score_label: pendingResult.scoreLabel,
            score_value: pendingResult.scoreValue,
            iq_estimated: pendingResult.iqEstimated,
            payment_status: 'none',
            has_premium_access: false,
            has_certificate: false,
          })
          .select('id')
          .single();

        if (insertError) throw insertError;

        // Clean up sessionStorage
        sessionStorage.removeItem(`pending-result-${tempKey}`);

        toast({
          title: 'Resultado salvo!',
          description: 'Seu resultado foi salvo com sucesso.',
        });

        navigate(`/resultado/${attempt.id}`, { replace: true });
      } catch (err) {
        console.error('[ResultadoPendente] Error saving result:', err);
        toast({
          title: 'Erro ao salvar resultado',
          description: 'Tente novamente.',
          variant: 'destructive',
        });
        setIsSaving(false);
      }
    };

    saveResult();
  }, [user, pendingResult, isSaving, tempKey, navigate, toast]);

  if (authLoading || isSaving) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">
            {isSaving ? 'Salvando seu resultado...' : 'Carregando...'}
          </p>
        </div>
      </div>
    );
  }

  if (!pendingResult) return null;

  const Icon = testIcons[pendingResult.testType] || Brain;
  const gradient = testColors[pendingResult.testType] || 'from-primary to-blue-600';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Result Preview Card */}
          <Card className="glass-card overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${gradient}`} />
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
              </div>
              <Badge variant="outline" className="mb-2 mx-auto w-fit">
                {pendingResult.testName}
              </Badge>
              <CardTitle className="text-2xl font-display">Seu Resultado</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Result Summary */}
              <div className="p-5 rounded-xl bg-muted/50 text-center space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                  {pendingResult.scoreLabel}
                </p>
                <p className="text-3xl font-bold">{pendingResult.scoreValue}</p>
                <p className="text-lg font-semibold text-primary">{pendingResult.resultCategory}</p>
              </div>

              {/* Free Description */}
              <p className="text-sm text-muted-foreground leading-relaxed text-center">
                {pendingResult.resultDescription}
              </p>

              {/* Blurred premium teaser */}
              <div className="relative rounded-xl overflow-hidden border border-border">
                <div className="p-4 space-y-2 blur-sm select-none pointer-events-none">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                  <div className="text-center px-4">
                    <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm font-medium text-muted-foreground">Relatório completo bloqueado</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auth CTA */}
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="pt-6 space-y-4">
              <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-base">Salve seu resultado!</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Crie uma conta gratuita ou entre para salvar seu resultado permanentemente e ter acesso ao relatório completo.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link to={`/cadastro?redirect=/resultado-pendente/${tempKey}`}>
                  <Button variant="hero" className="w-full min-h-[48px]">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar conta grátis
                  </Button>
                </Link>
                <Link to={`/login?redirect=/resultado-pendente/${tempKey}`}>
                  <Button variant="outline" className="w-full min-h-[48px]">
                    <LogIn className="h-4 w-4 mr-2" />
                    Já tenho conta
                  </Button>
                </Link>
              </div>

              <ul className="text-xs text-muted-foreground space-y-1.5 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                  Resultado salvo automaticamente após login
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                  Acesso ao histórico de todos os testes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                  Relatório premium e certificado disponíveis
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link to="/testes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Fazer outro teste sem cadastro →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultadoPendente;
