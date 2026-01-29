import { PersonalityQuestion, categoryLabels } from '@/data/personalityQuestions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PersonalityTestQuestionProps {
  question: PersonalityQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const PersonalityTestQuestion = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions
}: PersonalityTestQuestionProps) => {
  const categoryColors: Record<PersonalityQuestion['category'], string> = {
    'openness': 'bg-violet-500/20 text-violet-600',
    'conscientiousness': 'bg-blue-500/20 text-blue-600',
    'extraversion': 'bg-amber-500/20 text-amber-600',
    'agreeableness': 'bg-emerald-500/20 text-emerald-600',
    'neuroticism': 'bg-rose-500/20 text-rose-600'
  };

  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[question.category]}`}>
          {categoryLabels[question.category]}
        </span>
      </div>

      {/* Question text */}
      <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
        {question.question}
      </h2>

      {/* Options - Likert Scale */}
      <RadioGroup
        value={selectedAnswer !== null ? selectedAnswer.toString() : ""}
        onValueChange={(value) => onAnswerSelect(parseInt(value))}
        className="space-y-3"
      >
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedAnswer === index
                ? 'border-violet-500 bg-violet-500/5'
                : 'border-border hover:border-violet-500/50 hover:bg-muted/50'
            }`}
            onClick={() => onAnswerSelect(index)}
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label
              htmlFor={`option-${index}`}
              className="flex-1 cursor-pointer text-base font-medium"
            >
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PersonalityTestQuestion;
