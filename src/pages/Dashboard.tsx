import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Award, FileText, ArrowRight, Crown, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { TEST_TYPE_LABELS, TEST_TYPE_ICONS } from '@/lib/types';
import type { TestType } from '@/lib/types';

interface AttemptWithQuiz {
  id: string;
  quiz_id: string;
  started_at: string;
  completed_at: string | null;
  total_score: number | null;
  result_category: string | null;
  has_premium_access: boolean;
  has_certificate: boolean;
  quizzes: {
    title: string;
    test_type: TestType;
  };
}

const Dashboard = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [attempts, setAttempts] = useState<AttemptWithQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!user) return;
      setFetchError(null);

      try {
        const { data, error } = await supabase
          .from('test_attempts')
          .select(`
            id,
            quiz_id,
            started_at,
            completed_at,
            total_score,
            result_category,
            has_premium_access,
            has_certificate,
            quizzes (
              title,
              test_type
            )
          `)
          .eq('user_id', user.id)
          .order('started_at', { ascending: false });

        if (error) throw error;
        setAttempts((data as unknown as AttemptWithQuiz[]) || []);
      } catch (err) {
        console.error('[Dashboard] Error fetching attempts:', err);
        setFetchError('Não foi possível carregar seu histórico. Tente novamente.');
        toast({
          title: 'Erro ao carregar histórico',
          description: 'Não foi possível buscar seus testes. Tente recarregar a página.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchAttempts();
    }
  }, [user, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-6 md:py-12">
        <div className="container px-4">
          {/* Welcome */}
          <div className="mb-6 md:mb-10">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-1 md:mb-2">
              Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}! 👋
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Acompanhe seu progresso e acesse seus resultados
            </p>
          </div>

          {/* Quick Stats - Horizontal scroll on mobile */}
          <div className="flex gap-3 md:gap-6 overflow-x-auto pb-2 mb-6 md:mb-10 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide md:grid md:grid-cols-3">
            <div className="glass-card p-4 md:p-6 min-w-[160px] md:min-w-0 shrink-0 md:shrink">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                  <FileText className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <div className="font-display text-xl md:text-2xl font-bold">
                    {attempts.length}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Testes
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 md:p-6 min-w-[160px] md:min-w-0 shrink-0 md:shrink">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-success/10 text-success shrink-0">
                  <Award className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <div className="font-display text-xl md:text-2xl font-bold">
                    {attempts.filter((a) => a.has_certificate).length}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Certificados
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-4 md:p-6 min-w-[160px] md:min-w-0 shrink-0 md:shrink">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground shrink-0">
                  <Crown className="h-5 w-5 md:h-6 md:w-6" />
                </div>
                <div>
                  <div className="font-display text-xl md:text-2xl font-bold">
                    {attempts.filter((a) => a.has_premium_access).length}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Premium
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test History */}
          <div className="glass-card">
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-display text-lg md:text-xl font-bold">
                  Histórico
                </h2>
                <Link to="/testes">
                  <Button variant="outline" size="sm" className="min-h-[40px] text-sm">
                    <span className="hidden sm:inline">Fazer Novo Teste</span>
                    <span className="sm:hidden">Novo</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="divide-y divide-border">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-4 md:p-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-xl shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Skeleton className="h-5 w-32 md:w-48 mb-2" />
                          <Skeleton className="h-4 w-24 md:w-32" />
                        </div>
                      </div>
                    </div>
                  ))
              ) : fetchError ? (
                <div className="p-8 md:p-12">
                  <Alert variant="destructive" className="max-w-md mx-auto">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="ml-2">
                      {fetchError}
                      <Button
                        variant="link"
                        className="p-0 h-auto ml-2 text-destructive-foreground underline"
                        onClick={() => window.location.reload()}
                      >
                        Recarregar
                      </Button>
                    </AlertDescription>
                  </Alert>
                </div>
              ) : attempts.length === 0 ? (
                <div className="p-8 md:p-12 text-center">
                  <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                    <FileText className="h-7 w-7 md:h-8 md:w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-base md:text-lg font-semibold mb-2">
                    Nenhum teste realizado
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-xs mx-auto">
                    Comece seu primeiro teste e descubra mais sobre você!
                  </p>
                  <Link to="/testes">
                    <Button variant="hero" className="min-h-[48px] text-base w-full sm:w-auto">
                      Explorar Testes
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                attempts.map((attempt) => (
                  <div key={attempt.id} className="p-4 md:p-6">
                    {/* Mobile: Stacked layout */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
                      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-muted text-xl md:text-2xl shrink-0">
                          {TEST_TYPE_ICONS[attempt.quizzes.test_type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-sm md:text-base truncate">
                              {attempt.quizzes.title}
                            </h3>
                            {attempt.has_premium_access && (
                              <span className="premium-badge text-xs py-0.5 px-1.5">Premium</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {TEST_TYPE_LABELS[attempt.quizzes.test_type]}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                              {new Date(attempt.started_at).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons - Full width on mobile */}
                      <div className="flex items-center gap-2 md:gap-2">
                        {attempt.completed_at ? (
                          <>
                            <Link to={`/resultado/${attempt.id}`} className="flex-1 md:flex-none">
                              <Button variant="outline" size="sm" className="w-full min-h-[44px] md:min-h-[36px]">
                                Ver Resultado
                                <ChevronRight className="h-4 w-4 ml-1 md:hidden" />
                              </Button>
                            </Link>
                            {!attempt.has_premium_access && (
                              <Link to={`/resultado/${attempt.id}`} className="flex-1 md:flex-none">
                                <Button variant="premium" size="sm" className="w-full min-h-[44px] md:min-h-[36px]">
                                  Premium
                                </Button>
                              </Link>
                            )}
                          </>
                        ) : (
                          <Link to={`/teste/${attempt.quiz_id}/continuar`} className="flex-1">
                            <Button variant="default" size="sm" className="w-full min-h-[44px] md:min-h-[36px]">
                              Continuar
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
