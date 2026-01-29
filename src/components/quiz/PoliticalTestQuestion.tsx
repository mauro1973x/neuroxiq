import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PoliticalQuestion, categoryLabels } from '@/data/politicalQuestions';
import { Badge } from '@/components/ui/badge';

interface PoliticalTestQuestionProps {
  question: PoliticalQuestion;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswer: (answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

const PoliticalTestQuestion = ({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswer,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}: PoliticalTestQuestionProps) => {
  const progress = ((questionIndex + 1) / totalQuestions) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'social': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'authority': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'values': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <Badge className={getCategoryColor(question.category)}>
            {categoryLabels[question.category]}
          </Badge>
          <span className="text-sm text-muted-foreground font-medium">
            Questão {questionIndex + 1} de {totalQuestions}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <div className="glass-card p-8 mb-8">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed mb-8">
          {question.question}
        </h2>

        {/* Answer Options */}
        <div className="grid grid-cols-1 gap-4">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className={`
                w-full py-6 px-6 text-lg font-medium transition-all duration-200
                ${selectedAnswer === index 
                  ? 'bg-primary text-primary-foreground shadow-lg scale-[1.02]' 
                  : 'hover:bg-accent hover:scale-[1.01]'
                }
              `}
              onClick={() => onAnswer(index)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className="text-muted-foreground hover:text-foreground"
        >
          ← Anterior
        </Button>

        <Button
          onClick={onNext}
          disabled={!canGoNext || selectedAnswer === null}
          className="px-8"
        >
          {questionIndex === totalQuestions - 1 ? 'Finalizar' : 'Próxima →'}
        </Button>
      </div>
    </div>
  );
};

export default PoliticalTestQuestion;
