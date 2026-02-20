import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Clock, CheckCircle, ArrowRight, ArrowLeft, Target, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CareerTestTimer from '@/components/quiz/CareerTestTimer';
import CareerTestQuestion from '@/components/quiz/CareerTestQuestion';
import { 
  careerQuestions, 
  getCareerResultBand,
  calculateTotalScore,
  getTopCategories,
  categoryLabels
} from '@/data/careerQuestions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type TestPhase = 'intro' | 'test' | 'result';

// Quiz ID for career test
const CAREER_QUIZ_ID = 'd4e5f6a7-b8c9-0123-defa-456789012345';

const TesteCarreira = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(careerQuestions.length).fill(null));
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
            quiz_id: CAREER_QUIZ_ID,
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
    if (currentQuestion < careerQuestions.length - 1) {
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
    setIsTimerRunning(false);

    const totalScore = calculateTotalScore(answers);
    const resultBand = getCareerResultBand(totalScore);
    const topCategories = getTopCategories(answers);
    const hollandCode = topCategories.map(cat => categoryLabels[cat]).join(' + ');

    if (!user || !attemptId) {
      const tempId = `temp-career-${Date.now()}`;
      sessionStorage.setItem(`pending-result-${tempId}`, JSON.stringify({
        quizId: CAREER_QUIZ_ID,
        testName: 'Teste de Orientação de Carreira',
        score: totalScore,
        resultCategory: resultBand.name,
        resultDescription: `${resultBand.freeDescription} Perfil dominante: ${hollandCode}.`,
        scoreLabel: 'Perfil Holland',
        scoreValue: hollandCode,
        testType: 'career',
      }));
      navigate(`/resultado-pendente/${tempId}`);
      return;
    }

    try {
      const { error } = await supabase
        .from('test_attempts')
        .update({
          completed_at: new Date().toISOString(),
          total_score: totalScore,
          result_category: resultBand.name,
          result_description: `${resultBand.freeDescription} Perfil dominante: ${hollandCode}.`,
          test_name: 'Teste de Orientação de Carreira',
          score_label: 'Perfil Holland',
          score_value: hollandCode,
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
  }, [attemptId, user, answers, isSubmitting, navigate, toast]);

  const handleTimeUp = useCallback(() => {
    handleFinishTest();
  }, [handleFinishTest]);

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercent = ((currentQuestion + 1) / careerQuestions.length) * 100;

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
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Briefcase className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-display">Teste de Orientação de Carreira</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Descubra seu perfil profissional baseado no modelo Holland (RIASEC)
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
                    <div className="font-semibold">42 questões</div>
                    <div className="text-sm text-muted-foreground">Escala de identificação</div>
                  </div>
                </div>

                {/* Profiles */}
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold">Perfis avaliados (RIASEC):</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-amber-500" />
                      <span>Realista (R)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span>Investigativo (I)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span>Artístico (A)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-500" />
                      <span>Social (S)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-rose-500" />
                      <span>Empreendedor (E)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-slate-500" />
                      <span>Convencional (C)</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                  <h3 className="font-semibold">Instruções:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Avalie o quanto cada afirmação descreve você</li>
                    <li>• Responda pensando no que você GOSTA de fazer</li>
                    <li>• Não há respostas certas ou erradas</li>
                    <li>• Seja honesto sobre suas preferências</li>
                    <li>• Você pode navegar entre as questões</li>
                  </ul>
                </div>

                {/* Career Areas */}
                <div className="flex items-center justify-center gap-2 text-xs flex-wrap">
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-600">7 Realista</span>
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-600">7 Investigativo</span>
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-600">7 Artístico</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-600">7 Social</span>
                  <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-600">7 Empreendedor</span>
                  <span className="px-2 py-1 rounded bg-slate-500/20 text-slate-600">7 Convencional</span>
                </div>

                {/* Start Button */}
                <Button 
                  onClick={handleStartTest} 
                  size="xl" 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  Descobrir meu perfil de carreira
                  <ArrowRight className="h-5 w-5" />
                </Button>

                {/* Disclaimer */}
                <p className="text-xs text-center text-muted-foreground">
                  Este é um teste de caráter informativo e educacional. Os resultados são orientativos e não substituem aconselhamento profissional.
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
                <Briefcase className="h-6 w-6 text-amber-500" />
                <span className="font-semibold text-lg">Orientação de Carreira</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {answeredCount}/{careerQuestions.length} respondidas
              </div>
            </div>
            <CareerTestTimer
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
              <CareerTestQuestion
                question={careerQuestions[currentQuestion]}
                selectedAnswer={answers[currentQuestion]}
                onAnswerSelect={handleAnswerSelect}
                questionNumber={currentQuestion + 1}
                totalQuestions={careerQuestions.length}
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
            <div className="hidden md:flex items-center gap-1 flex-wrap justify-center max-w-lg">
              {careerQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-amber-500 text-white'
                      : answers[index] !== null
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === careerQuestions.length - 1 ? (
              <Button onClick={handleFinishTest} className="bg-gradient-to-r from-amber-500 to-orange-600">
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
              {careerQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-amber-500 text-white'
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

export default TesteCarreira;
