import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import QuizCard from '@/components/quiz/QuizCard';
import { supabase } from '@/integrations/supabase/client';
import { QuizSecure, TestType, TEST_TYPE_LABELS } from '@/lib/types';

const testTypes: (TestType | 'all')[] = ['all', 'iq', 'personality', 'political', 'career', 'emotional', 'cognitive'];

const Testes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [quizzes, setQuizzes] = useState<QuizSecure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<TestType | 'all'>(
    (searchParams.get('tipo') as TestType) || 'all'
  );

  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      // Use secure view that hides internal pricing data
      let query = supabase
        .from('quizzes_secure')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedType !== 'all') {
        query = query.eq('test_type', selectedType);
      }

      const { data, error } = await query;

      if (!error && data) {
        setQuizzes(data as QuizSecure[]);
      }
      setIsLoading(false);
    };

    fetchQuizzes();
  }, [selectedType]);

  const handleTypeChange = (type: TestType | 'all') => {
    setSelectedType(type);
    if (type === 'all') {
      searchParams.delete('tipo');
    } else {
      searchParams.set('tipo', type);
    }
    setSearchParams(searchParams);
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quiz.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-6 md:py-12">
        <div className="container px-4">
          {/* Header */}
          <div className="text-center mb-6 md:mb-10">
            <h1 className="font-display text-2xl md:text-4xl font-bold mb-2 md:mb-4">
              Catálogo de Testes
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore nossa coleção de testes científicos e descubra mais sobre
              sua personalidade, inteligência e potencial.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 mb-6 md:mb-8">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar testes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-12 md:h-10 w-full rounded-xl md:rounded-md border border-input bg-background px-3 py-2 pl-10 md:pl-11 text-base text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            
            {/* Filter Buttons - Horizontal scroll on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              {testTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTypeChange(type)}
                  className="flex-shrink-0 min-h-[40px] px-4"
                >
                  {type === 'all' ? 'Todos' : TEST_TYPE_LABELS[type]}
                </Button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {!isLoading && (
            <div className="mb-4 md:mb-6">
              <Badge variant="secondary" className="text-sm">
                {filteredQuizzes.length} teste{filteredQuizzes.length !== 1 ? 's' : ''} encontrado{filteredQuizzes.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}

          {/* Quiz Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="glass-card p-5 md:p-6">
                    <Skeleton className="h-11 w-11 md:h-12 md:w-12 rounded-xl mb-4" />
                    <Skeleton className="h-5 w-20 mb-3" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ))}
            </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="text-center py-12 md:py-16">
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                <Search className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground" />
              </div>
              <h3 className="font-display text-lg md:text-xl font-semibold mb-2">
                Nenhum teste encontrado
              </h3>
              <p className="text-sm md:text-base text-muted-foreground mb-6">
                Tente ajustar sua busca ou filtros
              </p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  handleTypeChange('all');
                }}
                className="min-h-[48px]"
              >
                Limpar filtros
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Testes;
