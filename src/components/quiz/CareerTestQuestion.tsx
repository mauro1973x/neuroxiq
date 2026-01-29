import { CareerQuestion, categoryLabels } from '@/data/careerQuestions';
import { Badge } from '@/components/ui/badge';

interface CareerTestQuestionProps {
  question: CareerQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const categoryColors: Record<string, string> = {
  realistic: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
  investigative: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
  artistic: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
  social: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
  enterprising: 'bg-rose-500/20 text-rose-600 border-rose-500/30',
  conventional: 'bg-slate-500/20 text-slate-600 border-slate-500/30'
};

const CareerTestQuestion = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions
}: CareerTestQuestionProps) => {
  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">
          Questão {questionNumber} de {totalQuestions}
        </span>
        <Badge 
          variant="outline" 
          className={categoryColors[question.category]}
        >
          {categoryLabels[question.category]}
        </Badge>
      </div>

      {/* Question Text */}
      <h2 className="text-xl md:text-2xl font-semibold leading-relaxed">
        {question.question}
      </h2>

      {/* Answer Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswerSelect(index)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              selectedAnswer === index
                ? 'border-primary bg-primary/10 shadow-md'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                selectedAnswer === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className={selectedAnswer === index ? 'font-medium' : ''}>
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CareerTestQuestion;
