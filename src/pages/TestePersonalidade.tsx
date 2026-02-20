import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Clock, CheckCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PersonalityTestTimer from '@/components/quiz/PersonalityTestTimer';
import PersonalityTestQuestion from '@/components/quiz/PersonalityTestQuestion';
import { 
  personalityQuestions, 
  getPersonalityResultBand,
  calculateTotalScore,
  getCategoryPercentages
} from '@/data/personalityQuestions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

type TestPhase = 'intro' | 'test' | 'result';

// Quiz ID for personality test
const PERSONALITY_QUIZ_ID = 'c3d4e5f6-a7b8-9012-cdef-345678901234';

const TestePersonalidade = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(personalityQuestions.length).fill(null));
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
            quiz_id: PERSONALITY_QUIZ_ID,
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
    if (currentQuestion < personalityQuestions.length - 1) {
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
    const resultBand = getPersonalityResultBand(totalScore);
    const categoryScores = getCategoryPercentages(answers);

    if (!user || !attemptId) {
      const tempId = `temp-personality-${Date.now()}`;
      sessionStorage.setItem(`pending-result-${tempId}`, JSON.stringify({
        quizId: PERSONALITY_QUIZ_ID,
        testName: 'Teste de Personalidade',
        score: totalScore,
        resultCategory: resultBand.name,
        resultDescription: resultBand.freeDescription,
        scoreLabel: 'Perfil OCEAN',
        scoreValue: resultBand.name,
        testType: 'personality',
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
          result_description: resultBand.freeDescription,
          test_name: 'Teste de Personalidade',
          score_label: 'Perfil OCEAN',
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
  }, [attemptId, user, answers, isSubmitting, navigate, toast]);

  const handleTimeUp = useCallback(() => {
    handleFinishTest();
  }, [handleFinishTest]);

  const answeredCount = answers.filter(a => a !== null).length;
  const progressPercent = ((currentQuestion + 1) / personalityQuestions.length) * 100;

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
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-display">Teste de Personalidade</CardTitle>
                <CardDescription className="text-lg mt-2">
                  Descubra seu perfil de personalidade baseado no modelo Big Five (OCEAN)
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
                    <div className="font-semibold">40 questões</div>
                    <div className="text-sm text-muted-foreground">Escala Likert</div>
                  </div>
                </div>

                {/* Traits */}
                <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h3 className="font-semibold">Traços avaliados (Big Five):</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                      <span>Abertura à Experiência</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-blue-500" />
                      <span>Conscienciosidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-500" />
                      <span>Extroversão</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-emerald-500" />
                      <span>Amabilidade</span>
                    </div>
                    <div className="flex items-center gap-2 sm:col-span-2 justify-center sm:justify-start">
                      <Sparkles className="h-4 w-4 text-rose-500" />
                      <span>Estabilidade Emocional</span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-3 p-4 rounded-lg bg-muted/30">
                  <h3 className="font-semibold">Instruções:</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Responda de forma honesta e espontânea</li>
                    <li>• Não há respostas certas ou erradas</li>
                    <li>• Escolha a opção que melhor descreve seu comportamento habitual</li>
                    <li>• Evite pensar demais em cada questão</li>
                    <li>• Você pode navegar entre as questões</li>
                  </ul>
                </div>

                {/* Category Info */}
                <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
                  <span className="px-2 py-1 rounded bg-violet-500/20 text-violet-600">8 Abertura</span>
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-600">8 Conscienc.</span>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-600">8 Extroversão</span>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-600">8 Amabilidade</span>
                  <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-600">8 Estabilidade</span>
                </div>

                {/* Start Button */}
                <Button 
                  onClick={handleStartTest} 
                  size="xl" 
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  Descobrir meu perfil de personalidade
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
                <User className="h-6 w-6 text-violet-500" />
                <span className="font-semibold text-lg">Teste de Personalidade</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {answeredCount}/{personalityQuestions.length} respondidas
              </div>
            </div>
            <PersonalityTestTimer
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
              <PersonalityTestQuestion
                question={personalityQuestions[currentQuestion]}
                selectedAnswer={answers[currentQuestion]}
                onAnswerSelect={handleAnswerSelect}
                questionNumber={currentQuestion + 1}
                totalQuestions={personalityQuestions.length}
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
              {personalityQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-violet-500 text-white'
                      : answers[index] !== null
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestion === personalityQuestions.length - 1 ? (
              <Button onClick={handleFinishTest} className="bg-gradient-to-r from-violet-500 to-purple-600">
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
              {personalityQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    index === currentQuestion
                      ? 'bg-violet-500 text-white'
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

export default TestePersonalidade;
