import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, CheckCircle, ArrowRight, ArrowLeft, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { compatibilityQuestions, categoryLabels, getCompatibilityResultBand } from '@/data/compatibilityQuestions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export const COMPATIBILITY_QUIZ_ID = 'f6a7b8c9-d0e1-2345-fabc-678901234567';

type TestPhase = 'intro' | 'test';

const scaleLabels: Record<number, string> = {
  1: 'Discordo totalmente',
  2: 'Discordo',
  3: 'Neutro',
  4: 'Concordo',
  5: 'Concordo totalmente',
};

const TesteCompatibilidade = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(compatibilityQuestions.length).fill(null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const handleStartTest = async () => {
    if (!user) {
      toast({
        title: 'Login necessário',
        description: 'Faça login para iniciar o teste e salvar seu resultado.',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    try {
      const { data: attempt, error } = await supabase
        .from('test_attempts')
        .insert({
          user_id: user.id,
          quiz_id: COMPATIBILITY_QUIZ_ID,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setAttemptId(attempt.id);
      setPhase('test');
    } catch (error) {
      console.error('Error starting test:', error);
      toast({
        title: 'Erro ao iniciar teste',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleAnswerSelect = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < compatibilityQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFinishTest = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Sum all answers (1–5 scale, 30 questions → max 150)
    const rawScore = answers.reduce((acc, val) => acc + (val ?? 3), 0);
    const percent = Math.round((rawScore / 150) * 100);
    const resultBand = getCompatibilityResultBand(percent);

    if (!attemptId || !user) {
      navigate('/');
      return;
    }

    try {
      const { error } = await supabase
        .from('test_attempts')
        .update({
          completed_at: new Date().toISOString(),
          total_score: rawScore,
          result_category: resultBand.name,
          result_description: resultBand.freeDescription,
          test_name: 'Teste de Compatibilidade Amorosa',
          score_label: 'Índice de Compatibilidade',
          score_value: `${percent}%`,
        })
        .eq('id', attemptId);

      if (error) throw error;

      navigate(`/resultado/${attemptId}`);
    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        title: 'Erro ao salvar resultado',
        description: 'Resultado calculado, mas houve um erro ao salvar.',
        variant: 'destructive',
      });
      navigate(`/resultado/${attemptId}`);
    }
  }, [attemptId, user, answers, isSubmitting, navigate, toast]);

  const answeredCount = answers.filter((a) => a !== null).length;
  const progressPercent = ((currentQuestion + 1) / compatibilityQuestions.length) * 100;

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-4xl shadow-lg shadow-pink-500/30">
                    ❤️
                  </div>
                </div>
                <CardTitle className="text-3xl font-display">Teste de Compatibilidade Amorosa</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Descubra o nível de sintonia entre vocês
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                    <div className="font-semibold">6 minutos</div>
                    <div className="text-sm text-muted-foreground">Tempo estimado</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-pink-500" />
                    <div className="font-semibold">30 questões</div>
                    <div className="text-sm text-muted-foreground">Escala de 1 a 5</div>
                  </div>
                </div>

                {/* Dimensions */}
                <div className="space-y-3 p-4 rounded-lg bg-pink-500/5 border border-pink-500/20">
                  <h3 className="font-semibold">Dimensões avaliadas:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <div key={key} className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-pink-500 shrink-0" />
                        <span>{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                  <h3 className="font-semibold">Instruções:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Responda com base em como você realmente se sente e age</li>
                    <li>• Não há respostas certas ou erradas</li>
                    <li>• Seja honesto para obter um resultado mais preciso</li>
                    <li>• Use a escala de 1 (Discordo totalmente) a 5 (Concordo totalmente)</li>
                    <li>• Você pode voltar e alterar respostas anteriores</li>
                  </ul>
                </div>

                {/* Scale Preview */}
                <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground px-2">
                  <span className="text-center">1<br/>Discordo<br/>totalmente</span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-center">3<br/>Neutro</span>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-center">5<br/>Concordo<br/>totalmente</span>
                </div>

                <Button
                  onClick={handleStartTest}
                  size="xl"
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 shadow-lg shadow-pink-500/25"
                >
                  Iniciar teste
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Teste de caráter informativo. Os resultados não constituem diagnóstico psicológico ou garantia de compatibilidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── TEST ───────────────────────────────────────────────────────────────────
  const question = compatibilityQuestions[currentQuestion];
  const currentAnswer = answers[currentQuestion];
  const isLastQuestion = currentQuestion === compatibilityQuestions.length - 1;
  const allAnswered = answeredCount === compatibilityQuestions.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-pink-500" />
                <span className="font-semibold">Compatibilidade</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {answeredCount}/{compatibilityQuestions.length} respondidas
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Questão {currentQuestion + 1} de {compatibilityQuestions.length}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Início</span>
              <span>{Math.round(progressPercent)}%</span>
              <span>Fim</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="glass-card">
            <CardContent className="p-6 md:p-8">
              {/* Category badge */}
              <div className="mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 text-xs font-medium border border-pink-500/20">
                  <Heart className="h-3 w-3" />
                  {categoryLabels[question.category]}
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-8 leading-relaxed">
                {currentQuestion + 1}. {question.question}
              </h2>

              {/* Likert Scale */}
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleAnswerSelect(value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left group ${
                      currentAnswer === value
                        ? 'border-pink-500 bg-pink-500/10 shadow-md shadow-pink-500/10'
                        : 'border-border hover:border-pink-400/50 hover:bg-pink-500/5'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                        currentAnswer === value
                          ? 'bg-pink-500 border-pink-500 text-white'
                          : 'border-muted-foreground/30 text-muted-foreground group-hover:border-pink-400/50'
                      }`}
                    >
                      {value}
                    </div>
                    <span className={`text-sm font-medium transition-colors ${currentAnswer === value ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {scaleLabels[value]}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>

            {/* Question Indicators - desktop */}
            <div className="hidden md:flex items-center gap-1 flex-wrap justify-center max-w-sm">
              {compatibilityQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-pink-500 text-white'
                      : answers[index] !== null
                        ? 'bg-pink-500/20 text-pink-600'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {isLastQuestion ? (
              <Button
                onClick={handleFinishTest}
                disabled={isSubmitting || !allAnswered}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
              >
                {isSubmitting ? 'Calculando...' : 'Ver resultado'}
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNextQuestion}
                disabled={currentAnswer === null}
              >
                Próxima
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile indicators */}
          <div className="md:hidden flex items-center gap-1 flex-wrap justify-center">
            {compatibilityQuestions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-pink-500 text-white'
                    : answers[index] !== null
                      ? 'bg-pink-500/20 text-pink-600'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {!allAnswered && isLastQuestion && (
            <p className="text-center text-sm text-muted-foreground">
              Responda todas as {compatibilityQuestions.length} questões para finalizar.
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TesteCompatibilidade;
