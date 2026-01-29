import { Link } from 'react-router-dom';
import { Clock, Users, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Quiz, QuizSecure, TEST_TYPE_LABELS, TEST_TYPE_ICONS, TEST_TYPE_COLORS } from '@/lib/types';

interface QuizCardProps {
  quiz: Quiz | QuizSecure;
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  return (
    <div className="group glass-card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${TEST_TYPE_COLORS[quiz.test_type]} text-2xl`}>
          {TEST_TYPE_ICONS[quiz.test_type]}
        </div>
        {quiz.is_premium && (
          <span className="premium-badge">
            <Star className="h-3 w-3" />
            Premium
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <Badge variant="secondary" className="mb-3">
          {TEST_TYPE_LABELS[quiz.test_type]}
        </Badge>
        <h3 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition-colors">
          {quiz.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {quiz.description}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{quiz.duration_minutes} min</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{quiz.question_count} questões</span>
        </div>
      </div>

      {/* CTA */}
      <Link to={
        quiz.test_type === 'iq' ? '/teste-qi' : 
        quiz.test_type === 'political' ? '/teste-politico' : 
        quiz.test_type === 'emotional' ? '/teste-emocional' :
        quiz.test_type === 'personality' ? '/teste-personalidade' :
        `/teste/${quiz.id}`
      }>
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          Começar Teste
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  );
};

export default QuizCard;
