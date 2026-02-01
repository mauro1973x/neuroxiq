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
    <div className="space-y-5 md:space-y-6">
      {/* Question header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm md:text-base text-muted-foreground">
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[question.category]}`}>
          {categoryLabels[question.category]}
        </span>
      </div>

      {/* Question text */}
      <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground leading-relaxed">
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
            className={`flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 min-h-[56px] active:scale-[0.98] ${
              selectedAnswer === index
                ? 'border-violet-500 bg-violet-500/5 shadow-sm'
                : 'border-border hover:border-violet-500/50 hover:bg-muted/50'
            }`}
            onClick={() => onAnswerSelect(index)}
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} className="sr-only" />
            <Label
              htmlFor={`option-${index}`}
              className="flex-1 cursor-pointer text-base font-medium leading-relaxed"
            >
              {option}
            </Label>
            {selectedAnswer === index && (
              <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default PersonalityTestQuestion;
