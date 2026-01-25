import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, Award, FileText, ArrowRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
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
  const [attempts, setAttempts] = useState<AttemptWithQuiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchAttempts = async () => {
      if (!user) return;

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

      if (!error && data) {
        setAttempts(data as unknown as AttemptWithQuiz[]);
      }
      setIsLoading(false);
    };

    if (user) {
      fetchAttempts();
    }
  }, [user]);

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

      <main className="flex-1 py-12">
        <div className="container">
          {/* Welcome */}
          <div className="mb-10">
            <h1 className="font-display text-3xl font-bold mb-2">
              Olá, {profile?.full_name || 'Usuário'}! 👋
            </h1>
            <p className="text-muted-foreground">
              Acompanhe seu progresso e acesse seus resultados
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">
                    {attempts.length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Testes Realizados
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">
                    {attempts.filter((a) => a.has_certificate).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Certificados
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold">
                    {attempts.filter((a) => a.has_premium_access).length}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Relatórios Premium
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Test History */}
          <div className="glass-card">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold">
                  Histórico de Testes
                </h2>
                <Link to="/testes">
                  <Button variant="outline" size="sm">
                    Fazer Novo Teste
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="divide-y divide-border">
              {isLoading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="p-6">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <div className="flex-1">
                          <Skeleton className="h-5 w-48 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </div>
                  ))
              ) : attempts.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    Nenhum teste realizado
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Comece seu primeiro teste e descubra mais sobre você!
                  </p>
                  <Link to="/testes">
                    <Button variant="hero">
                      Explorar Testes
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                attempts.map((attempt) => (
                  <div key={attempt.id} className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                        {TEST_TYPE_ICONS[attempt.quizzes.test_type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">
                            {attempt.quizzes.title}
                          </h3>
                          {attempt.has_premium_access && (
                            <span className="premium-badge text-xs">Premium</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <Badge variant="secondary">
                            {TEST_TYPE_LABELS[attempt.quizzes.test_type]}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(attempt.started_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {attempt.completed_at ? (
                          <>
                            <Link to={`/resultado/${attempt.id}`}>
                              <Button variant="outline" size="sm">
                                Ver Resultado
                              </Button>
                            </Link>
                            {!attempt.has_premium_access && (
                              <Button variant="premium" size="sm">
                                Liberar Premium
                              </Button>
                            )}
                          </>
                        ) : (
                          <Link to={`/teste/${attempt.quiz_id}/continuar`}>
                            <Button variant="default" size="sm">
                              Continuar
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
