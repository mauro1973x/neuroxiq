import { IQQuestion } from '@/data/iqQuestions';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface IQTestQuestionProps {
  question: IQQuestion;
  selectedAnswer: number | null;
  onAnswerSelect: (answer: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const IQTestQuestion = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions
}: IQTestQuestionProps) => {
  const letters = ['A', 'B', 'C', 'D'];
  const difficultyLabels = {
    easy: { text: 'Fácil', color: 'bg-success/20 text-success' },
    medium: { text: 'Média', color: 'bg-warning/20 text-warning' },
    hard: { text: 'Difícil', color: 'bg-destructive/20 text-destructive' }
  };

  return (
    <div className="space-y-6">
      {/* Question header */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Questão {questionNumber} de {totalQuestions}
        </span>
        <span className={`text-xs px-2 py-1 rounded-full ${difficultyLabels[question.difficulty].color}`}>
          {difficultyLabels[question.difficulty].text}
        </span>
      </div>

      {/* Question text */}
      <h2 className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
        {question.question}
      </h2>

      {/* Options */}
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
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            }`}
            onClick={() => onAnswerSelect(index)}
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
            <Label
              htmlFor={`option-${index}`}
              className="flex-1 cursor-pointer text-base font-medium"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-bold mr-3">
                {letters[index]}
              </span>
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default IQTestQuestion;
