import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Clock, CheckCircle, ArrowRight, ArrowLeft, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EmotionalTestTimer from '@/components/quiz/EmotionalTestTimer';
import EmotionalTestQuestion from '@/components/quiz/EmotionalTestQuestion';
import { emotionalQuestions, getEmotionalResultBand } from '@/data/emotionalQuestions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type TestPhase = 'intro' | 'test' | 'result';

// Quiz ID for emotional test (will be created in database)
const EMOTIONAL_QUIZ_ID = 'b2c3d4e5-f6a7-8901-bcde-f23456789012';

const TesteEmocional = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(emotionalQuestions.length).fill(null));
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const handleStartTest = async () => {
    if (user) {
      try {
        const { data: attempt, error } = await supabase
          .from('test_attempts')
          .insert({
            user_id: user.id,
            quiz_id: EMOTIONAL_QUIZ_ID,
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
    setPhase('test');
    setIsTimerRunning(true);
  };

  const handleAnswerSelect = (answer: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < emotionalQuestions.length - 1) {
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
      if (answer !== null && answer === emotionalQuestions[index].correctAnswer) {
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
    const resultBand = getEmotionalResultBand(score);

    if (!user || !attemptId) {
      const tempId = `temp-emotional-${Date.now()}`;
      sessionStorage.setItem(`pending-result-${tempId}`, JSON.stringify({
        quizId: EMOTIONAL_QUIZ_ID,
        testName: 'Teste de Inteligência Emocional',
        score,
        resultCategory: resultBand.name,
        resultDescription: resultBand.freeDescription,
        scoreLabel: 'Nível de QE',
        scoreValue: resultBand.name,
        testType: 'emotional',
      }));
      navigate(`/resultado/pending-${tempId}`);
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
          test_name: 'Teste de Inteligência Emocional',
          score_label: 'Nível de QE',
          score_value: resultBand.name,
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
  const progressPercent = ((currentQuestion + 1) / emotionalQuestions.length) * 100;

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
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
                    <Heart className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-display">Teste de Inteligência Emocional</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Avaliação completa das suas competências emocionais
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">20 minutos</div>
                    <div className="text-sm text-muted-foreground">Tempo estimado</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold">30 questões</div>
                    <div className="text-sm text-muted-foreground">Múltipla escolha</div>
                  </div>
                </div>

                {/* Competencies */}
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold">Competências avaliadas:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-rose-500" />
                      <span>Autoconsciência</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-rose-500" />
                      <span>Autocontrole</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-rose-500" />
                      <span>Motivação</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-rose-500" />
                      <span>Empatia</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2 justify-center sm:justify-start">
                      <Brain className="h-4 w-4 text-rose-500" />
                      <span>Habilidades Sociais</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                  <h3 className="font-semibold">Instruções:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Responda com base no que você realmente faz, não no que gostaria de fazer</li>
                    <li>• Não há respostas certas ou erradas absolutas</li>
                    <li>• Seja honesto para obter um resultado mais preciso</li>
                    <li>• Você pode navegar entre as questões</li>
                    <li>• O teste será finalizado quando o tempo acabar</li>
                  </ul>
                </div>

                {/* Category Info */}
                <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
                  <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-600">6 Autoconsciência</span>
                  <span className="px-2 py-1 rounded bg-orange-500/20 text-orange-600">6 Autocontrole</span>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-600">6 Motivação</span>
                  <span className="px-2 py-1 rounded bg-pink-500/20 text-pink-600">6 Empatia</span>
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-600">6 Sociais</span>
                </div>

                {/* Start Button */}
                <Button 
                  onClick={handleStartTest} 
                  size="xl" 
                  className="w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700"
                >
                  Avaliar minha inteligência emocional
                  <ArrowRight className="h-5 w-5" />
                </Button>

                {/* Disclaimer */}
                <p className="text-xs text-center text-muted-foreground">
                  Este é um teste de caráter informativo e educacional. Os resultados não constituem diagnóstico psicológico.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect to result page if phase is result
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
                <Heart className="h-6 w-6 text-rose-500" />
                <span className="font-semibold text-lg">Teste Emocional</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {answeredCount}/{emotionalQuestions.length} respondidas
              </div>
            </div>
            <EmotionalTestTimer
              initialMinutes={20}
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
              <EmotionalTestQuestion
                question={emotionalQuestions[currentQuestion]}
                selectedAnswer={answers[currentQuestion]}
                onAnswerSelect={handleAnswerSelect}
                questionNumber={currentQuestion + 1}
                totalQuestions={emotionalQuestions.length}
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
              {emotionalQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-rose-500 text-white'
                      : answers[index] !== null
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === emotionalQuestions.length - 1 ? (
              <Button onClick={handleFinishTest} className="bg-gradient-to-r from-rose-500 to-red-600">
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
              {emotionalQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-rose-500 text-white'
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

export default TesteEmocional;
