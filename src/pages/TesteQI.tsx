import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Clock, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import IQTestTimer from '@/components/quiz/IQTestTimer';
import IQTestQuestion from '@/components/quiz/IQTestQuestion';
import { iqQuestions, getResultBand } from '@/data/iqQuestions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type TestPhase = 'intro' | 'test' | 'result';

const TesteQI = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(iqQuestions.length).fill(null));
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  // Get or create quiz ID (using first quiz from database or local fallback)
  const QUIZ_ID = 'iq-test-v1';

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
      // Create test attempt in database
      const { data: attempt, error } = await supabase
        .from('test_attempts')
        .insert({
          user_id: user.id,
          quiz_id: QUIZ_ID,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      
      setAttemptId(attempt.id);
      setPhase('test');
      setIsTimerRunning(true);
    } catch (error) {
      console.error('Error starting test:', error);
      toast({
        title: 'Erro ao iniciar teste',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const handleAnswerSelect = (answer: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < iqQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = useCallback((): number => {
    return answers.reduce((score, answer, index) => {
      if (answer !== null && answer === iqQuestions[index].correctAnswer) {
        return score + 1;
      }
      return score;
    }, 0);
  }, [answers]);

  const handleFinishTest = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setIsTimerRunning(false);

    const score = calculateScore();
    const resultBand = getResultBand(score);

    if (!attemptId || !user) {
      // Fallback: show result without saving
      navigate(`/resultado/local?score=${score}`);
      return;
    }

    try {
      // Save result to database
      const { error } = await supabase
        .from('test_attempts')
        .update({
          completed_at: new Date().toISOString(),
          total_score: score,
          result_category: resultBand.name,
          result_description: resultBand.freeDescription,
        })
        .eq('id', attemptId);

      if (error) throw error;

      // Navigate to result page
      navigate(`/resultado/${attemptId}`);
    } catch (error) {
      console.error('Error saving result:', error);
      toast({
        title: 'Erro ao salvar resultado',
        description: 'Seu resultado foi calculado, mas houve um erro ao salvar.',
        variant: 'destructive',
      });
      navigate(`/resultado/${attemptId}`);
    }
  }, [attemptId, user, calculateScore, isSubmitting, navigate, toast]);

  const handleTimeUp = useCallback(() => {
    handleFinishTest();
  }, [handleFinishTest]);

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercent = ((currentQuestion + 1) / iqQuestions.length) * 100;

  // Intro Phase
  if (phase === 'intro') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-display">Teste de QI Profissional</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Avaliação cognitiva com 30 questões de dificuldade progressiva
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">30 minutos</div>
                    <div className="text-sm text-muted-foreground">Tempo estimado</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">30 questões</div>
                    <div className="text-sm text-muted-foreground">Múltipla escolha</div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold">Instruções:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Cada questão possui 4 alternativas (A, B, C, D)</li>
                    <li>• Apenas uma alternativa é correta</li>
                    <li>• A dificuldade aumenta progressivamente</li>
                    <li>• Você pode navegar entre as questões</li>
                    <li>• O teste será finalizado quando o tempo acabar</li>
                    <li>• Cada resposta correta vale 1 ponto</li>
                  </ul>
                </div>

                {/* Difficulty Info */}
                <div className="flex items-center justify-center gap-4 text-sm">
                  <span className="px-2 py-1 rounded bg-success/20 text-success">10 Fáceis</span>
                  <span className="px-2 py-1 rounded bg-warning/20 text-warning">10 Médias</span>
                  <span className="px-2 py-1 rounded bg-destructive/20 text-destructive">10 Difíceis</span>
                </div>

                {/* Start Button */}
                <Button 
                  onClick={handleStartTest} 
                  size="xl" 
                  className="w-full"
                  variant="hero"
                >
                  Iniciar Teste
                  <ArrowRight className="h-5 w-5" />
                </Button>

                {/* Disclaimer */}
                <p className="text-xs text-center text-muted-foreground">
                  Este é um teste de caráter informativo. Os resultados não constituem diagnóstico clínico.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect to result page if phase is result (shouldn't happen with new flow)
  if (phase === 'result') {
    if (attemptId) {
      navigate(`/resultado/${attemptId}`);
    }
    return null;
  }

  // Test Phase
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg">Teste de QI</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {answeredCount}/{iqQuestions.length} respondidas
              </div>
            </div>
            <IQTestTimer
              initialMinutes={30}
              onTimeUp={handleTimeUp}
              isRunning={isTimerRunning}
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Início</span>
              <span>Progresso: {Math.round(progressPercent)}%</span>
              <span>Fim</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="glass-card">
            <CardContent className="p-6 md:p-8">
              <IQTestQuestion
                question={iqQuestions[currentQuestion]}
                selectedAnswer={answers[currentQuestion]}
                onAnswerSelect={handleAnswerSelect}
                questionNumber={currentQuestion + 1}
                totalQuestions={iqQuestions.length}
              />
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

            {/* Question Indicators */}
            <div className="hidden md:flex items-center gap-1 flex-wrap justify-center max-w-md">
              {iqQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-primary text-primary-foreground'
                      : answers[index] !== null
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === iqQuestions.length - 1 ? (
              <Button onClick={handleFinishTest} variant="success">
                Finalizar Teste
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Próxima
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Mobile Question Selector */}
          <div className="md:hidden">
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {iqQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-primary text-primary-foreground'
                      : answers[index] !== null
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TesteQI;
