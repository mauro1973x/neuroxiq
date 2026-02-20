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

  // Quiz ID from database
  const QUIZ_ID = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

  const handleStartTest = async () => {
    if (user) {
      // Logged in: create attempt in database
      try {
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
      } catch (error) {
        console.error('Error starting test:', error);
        toast({
          title: 'Erro ao iniciar teste',
          description: 'Tente novamente.',
          variant: 'destructive',
        });
        return;
      }
    }
    // Not logged in: start test without attempt (will save after login)
    setPhase('test');
    setIsTimerRunning(true);
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

    const estimatedIQ = 85 + Math.round((score / 30) * 45);

    if (!user || !attemptId) {
      // Not logged in: save result to sessionStorage and show result with login prompt
      const tempId = `temp-qi-${Date.now()}`;
      sessionStorage.setItem(`pending-result-${tempId}`, JSON.stringify({
        quizId: QUIZ_ID,
        testName: 'Teste de QI',
        score,
        resultCategory: resultBand.name,
        resultDescription: resultBand.freeDescription,
        iqEstimated: estimatedIQ,
        scoreLabel: 'QI estimado',
        scoreValue: String(estimatedIQ),
        testType: 'iq',
      }));
      navigate(`/resultado-pendente/${tempId}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('test_attempts')
        .update({
          completed_at: new Date().toISOString(),
          total_score: score,
          result_category: resultBand.name,
          result_description: resultBand.freeDescription,
          iq_estimated: estimatedIQ,
          test_name: 'Teste de QI',
          score_label: 'QI estimado',
          score_value: String(estimatedIQ),
        })
        .eq('id', attemptId);

      if (error) throw error;
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
        <main className="flex-1 container py-6 md:py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="glass-card">
              <CardHeader className="text-center pb-4 px-4 md:px-6">
                <div className="flex justify-center mb-4">
                  <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Brain className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-display">Teste de QI</CardTitle>
                <CardDescription className="text-base md:text-lg mt-2">
                  Avaliação cognitiva com 30 questões de dificuldade progressiva
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 md:space-y-6 px-4 md:px-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-base">30 minutos</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Tempo estimado</div>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-base">30 questões</div>
                    <div className="text-xs md:text-sm text-muted-foreground">Múltipla escolha</div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold text-base">Instruções:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2.5 leading-relaxed">
                    <li>• Cada questão possui 4 alternativas (A, B, C, D)</li>
                    <li>• Apenas uma alternativa é correta</li>
                    <li>• A dificuldade aumenta progressivamente</li>
                    <li>• Você pode navegar entre as questões</li>
                    <li>• O teste será finalizado quando o tempo acabar</li>
                    <li>• Cada resposta correta vale 1 ponto</li>
                  </ul>
                </div>

                {/* Difficulty Info */}
                <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm">
                  <span className="px-3 py-1.5 rounded-full bg-success/20 text-success font-medium">10 Fáceis</span>
                  <span className="px-3 py-1.5 rounded-full bg-warning/20 text-warning font-medium">10 Médias</span>
                  <span className="px-3 py-1.5 rounded-full bg-destructive/20 text-destructive font-medium">10 Difíceis</span>
                </div>

                {/* Start Button */}
                <Button 
                  onClick={handleStartTest} 
                  size="xl" 
                  className="w-full min-h-[52px] text-base"
                  variant="hero"
                >
                  Iniciar Teste
                  <ArrowRight className="h-5 w-5" />
                </Button>

                {/* Disclaimer */}
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
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
      <main className="flex-1 container py-4 md:py-6 px-4">
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                <span className="font-semibold text-base md:text-lg">Teste de QI</span>
              </div>
              <div className="text-xs md:text-sm text-muted-foreground">
                {answeredCount}/{iqQuestions.length}
              </div>
            </div>
            <IQTestTimer
              initialMinutes={30}
              onTimeUp={handleTimeUp}
              isRunning={isTimerRunning}
            />
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5 md:space-y-2">
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Início</span>
              <span>{Math.round(progressPercent)}%</span>
              <span>Fim</span>
            </div>
          </div>

          {/* Question Card */}
          <Card className="glass-card">
            <CardContent className="p-4 md:p-6 lg:p-8">
              <IQTestQuestion
                question={iqQuestions[currentQuestion]}
                selectedAnswer={answers[currentQuestion]}
                onAnswerSelect={handleAnswerSelect}
                questionNumber={currentQuestion + 1}
                totalQuestions={iqQuestions.length}
              />
            </CardContent>
          </Card>

          {/* Navigation - Mobile optimized */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              className="min-h-[48px] px-4 md:px-6"
            >
              <ArrowLeft className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Anterior</span>
            </Button>

            {currentQuestion === iqQuestions.length - 1 ? (
              <Button 
                onClick={handleFinishTest} 
                variant="success"
                className="min-h-[48px] flex-1 md:flex-none md:px-6 text-base"
              >
                Finalizar Teste
                <CheckCircle className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                className="min-h-[48px] flex-1 md:flex-none md:px-6 text-base"
              >
                Próxima
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Question Selector - Scrollable on mobile */}
          <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <div className="flex items-center gap-1.5 md:gap-1 flex-nowrap md:flex-wrap md:justify-center min-w-max md:min-w-0">
              {iqQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-9 h-9 md:w-7 md:h-7 rounded-lg md:rounded text-sm font-medium transition-colors shrink-0 ${
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
