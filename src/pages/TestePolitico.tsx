import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PoliticalTestQuestion from '@/components/quiz/PoliticalTestQuestion';
import PoliticalTestTimer from '@/components/quiz/PoliticalTestTimer';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Scale, Clock, FileText, AlertCircle, Brain } from 'lucide-react';
import { politicalQuestions, calculatePoliticalScore, calculateCategoryScores, getPoliticalResultBand, PoliticalResultBand } from '@/data/politicalQuestions';

const QUIZ_ID = 'e5f6a7b8-c9d0-1234-efab-567890123456';

const TestePolitico = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(politicalQuestions.length).fill(null)
  );
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultBands, setResultBands] = useState<PoliticalResultBand[]>([]);

  // Fetch result bands on mount
  useEffect(() => {
    const fetchResultBands = async () => {
      const { data, error } = await supabase
        .from('political_result_bands')
        .select('*')
        .order('band_order', { ascending: true });

      if (error) {
        console.error('Error fetching result bands:', error);
        return;
      }

      setResultBands(data || []);
    };

    fetchResultBands();
  }, []);

  // Check auth
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Autenticação necessária",
        description: "Faça login para realizar o teste.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/teste-politico' } });
    }
  }, [user, authLoading, navigate, toast]);

  const startTest = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .insert({
          user_id: user.id,
          quiz_id: QUIZ_ID,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      setAttemptId(data.id);
      setTestStarted(true);
    } catch (error) {
      console.error('Error starting test:', error);
      toast({
        title: "Erro ao iniciar teste",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < politicalQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitTest = useCallback(async () => {
    if (!attemptId || isSubmitting) return;
    setIsSubmitting(true);

    try {
      const totalScore = calculatePoliticalScore(answers);
      const categoryScores = calculateCategoryScores(answers);
      const resultBand = getPoliticalResultBand(totalScore, resultBands);

      // Update test attempt with results
      const { error } = await supabase
        .from('test_attempts')
        .update({
          completed_at: new Date().toISOString(),
          total_score: totalScore,
          result_category: resultBand?.name || 'Indefinido',
          result_description: resultBand?.free_description || '',
        })
        .eq('id', attemptId);

      if (error) throw error;

      toast({
        title: "Teste concluído!",
        description: "Seus resultados estão prontos.",
      });

      navigate(`/resultado/${attemptId}`);
    } catch (error) {
      console.error('Error submitting test:', error);
      toast({
        title: "Erro ao salvar resultados",
        description: "Tente novamente.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  }, [attemptId, answers, resultBands, isSubmitting, navigate, toast]);

  const handleTimeUp = useCallback(() => {
    toast({
      title: "Tempo esgotado!",
      description: "O teste será finalizado com as respostas atuais.",
      variant: "destructive",
    });
    submitTest();
  }, [submitTest, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Scale className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Teste de Orientação Político-Ideológica
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Descubra seu posicionamento no espectro político através de uma análise 
                multidimensional baseada em economia, sociedade, autoridade e valores.
              </p>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="glass-card p-6 text-center">
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">25 Minutos</h3>
                <p className="text-sm text-muted-foreground">Tempo estimado</p>
              </div>
              <div className="glass-card p-6 text-center">
                <FileText className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">40 Questões</h3>
                <p className="text-sm text-muted-foreground">4 categorias</p>
              </div>
              <div className="glass-card p-6 text-center">
                <Brain className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">10 Perfis</h3>
                <p className="text-sm text-muted-foreground">Resultados possíveis</p>
              </div>
            </div>

            {/* Important Notice */}
            <div className="glass-card p-6 mb-8 border-l-4 border-amber-500">
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-amber-500 mb-2">Aviso Importante</h3>
                  <p className="text-sm text-muted-foreground">
                    Este teste tem caráter exclusivamente educacional e estatístico. 
                    Responda de forma sincera, sem medo de julgamento. Não existem 
                    respostas certas ou erradas. Sua privacidade é protegida.
                  </p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="glass-card p-6 mb-8">
              <h3 className="font-semibold mb-4">Dimensões Avaliadas</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Economia (mercado vs. Estado)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Sociedade (progressista vs. conservador)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Autoridade (libertário vs. autoritário)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Valores (globalista vs. nacionalista)</span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <Button 
                size="lg" 
                onClick={startTest}
                className="text-lg px-12 py-6"
              >
                Iniciar Teste
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Ao iniciar, você terá 25 minutos para completar o teste.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Test in progress
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Test Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-primary" />
            <span className="font-semibold hidden sm:inline">Teste Político-Ideológico</span>
          </div>
          <PoliticalTestTimer totalMinutes={25} onTimeUp={handleTimeUp} />
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <PoliticalTestQuestion
          question={politicalQuestions[currentQuestion]}
          questionIndex={currentQuestion}
          totalQuestions={politicalQuestions.length}
          selectedAnswer={answers[currentQuestion]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          canGoNext={true}
          canGoPrevious={currentQuestion > 0}
        />

        {/* Question Navigation Map */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`
                  w-8 h-8 rounded-lg text-xs font-medium transition-all
                  ${index === currentQuestion 
                    ? 'bg-primary text-primary-foreground scale-110' 
                    : answer !== null 
                      ? 'bg-primary/20 text-primary' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestePolitico;
