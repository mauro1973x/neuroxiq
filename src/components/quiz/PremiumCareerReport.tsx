import { Briefcase, Target, Lightbulb, Users, Globe, AlertTriangle, FileText, Award, TrendingUp, Compass } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  CareerResultBand, 
  CareerCategory, 
  categoryLabels, 
  categoryDescriptions,
  categoryCareerExamples
} from '@/data/careerQuestions';
import DownloadPdfButton from './DownloadPdfButton';

interface CategoryScore {
  category: CareerCategory;
  score: number;
  percentage: number;
}

interface PremiumCareerReportProps {
  totalScore: number;
  categoryScores: Record<CareerCategory, number>;
  topCategories: CareerCategory[];
  hollandCode: string;
  resultBand: CareerResultBand;
  userName?: string;
  testDate?: string;
}

// Career suggestions based on Holland code combinations
const careerSuggestionsByCode: Record<string, { title: string; careers: string[]; description: string }> = {
  'RIA': {
    title: 'Técnico-Criativo',
    careers: ['Arquiteto', 'Designer Industrial', 'Engenheiro de Produto', 'Técnico em Prototipagem', 'Desenvolvedor de Games'],
    description: 'Você combina habilidades práticas com pensamento analítico e criatividade, ideal para carreiras que envolvem projetar e construir soluções inovadoras.'
  },
  'RIS': {
    title: 'Técnico-Social',
    careers: ['Fisioterapeuta', 'Enfermeiro', 'Técnico em Saúde', 'Bombeiro', 'Instrutor de Esportes'],
    description: 'Você une habilidades práticas com interesse em ajudar pessoas, excelente para áreas da saúde e serviços comunitários.'
  },
  'RIE': {
    title: 'Técnico-Empreendedor',
    careers: ['Gerente de Produção', 'Empreendedor Industrial', 'Consultor Técnico', 'Diretor de Operações', 'Gerente de Projetos'],
    description: 'Você combina conhecimento técnico com liderança, ideal para gerenciar operações e empreender em setores técnicos.'
  },
  'RIC': {
    title: 'Técnico-Organizacional',
    careers: ['Engenheiro de Qualidade', 'Analista de Processos', 'Técnico em Metrologia', 'Controller Industrial', 'Especialista em Logística'],
    description: 'Você une habilidades práticas com precisão organizacional, perfeito para controle de qualidade e otimização de processos.'
  },
  'IAS': {
    title: 'Cientista-Social',
    careers: ['Psicólogo Pesquisador', 'Cientista Social', 'Antropólogo', 'Pesquisador de UX', 'Sociólogo'],
    description: 'Você combina curiosidade científica com interesse em pessoas, ideal para pesquisa em ciências humanas e sociais.'
  },
  'IAE': {
    title: 'Inovador-Líder',
    careers: ['Diretor de Inovação', 'Empreendedor Tech', 'Consultor de Estratégia', 'CEO de Startup', 'Venture Capitalist'],
    description: 'Você une pensamento analítico com criatividade e liderança, perfeito para liderar inovação e empreendimentos.'
  },
  'IAC': {
    title: 'Analista-Criativo',
    careers: ['Data Scientist', 'Analista de BI', 'Designer de Dados', 'Especialista em Visualização', 'Pesquisador de Mercado'],
    description: 'Você combina análise de dados com visão criativa, ideal para transformar informações em insights visuais.'
  },
  'ASE': {
    title: 'Artista-Comunicador',
    careers: ['Publicitário', 'Diretor de Marketing', 'Produtor de Conteúdo', 'Relações Públicas', 'Gerente de Marca'],
    description: 'Você une criatividade com habilidades sociais e de liderança, excelente para comunicação e marketing.'
  },
  'ASC': {
    title: 'Artista-Organizador',
    careers: ['Curador de Arte', 'Produtor Cultural', 'Editor', 'Gerente de Museu', 'Designer de Eventos'],
    description: 'Você combina senso estético com organização, perfeito para gestão cultural e produção artística.'
  },
  'SEC': {
    title: 'Social-Administrativo',
    careers: ['Gerente de RH', 'Coordenador Educacional', 'Administrador Hospitalar', 'Diretor de ONG', 'Gestor de Saúde'],
    description: 'Você une interesse em pessoas com habilidades organizacionais, ideal para liderar organizações sociais.'
  },
  'SEA': {
    title: 'Social-Criativo',
    careers: ['Terapeuta Artístico', 'Professor de Artes', 'Coach de Desenvolvimento', 'Orientador Vocacional', 'Facilitador de Workshops'],
    description: 'Você combina empatia com criatividade, excelente para ajudar pessoas através de abordagens inovadoras.'
  },
  'ECS': {
    title: 'Líder-Organizador',
    careers: ['Gerente Geral', 'Diretor Financeiro', 'Executivo de Vendas', 'Gerente Bancário', 'Consultor de Negócios'],
    description: 'Você une liderança com precisão organizacional e habilidades interpessoais, perfeito para gestão executiva.'
  },
  'ECA': {
    title: 'Empreendedor-Criativo',
    careers: ['CEO de Agência Criativa', 'Diretor de Publicidade', 'Produtor Executivo', 'Fundador de Startup', 'Diretor de Arte'],
    description: 'Você combina visão de negócios com criatividade, ideal para empreender em indústrias criativas.'
  },
  // Default combinations
  'RAS': {
    title: 'Prático-Humanista',
    careers: ['Professor Técnico', 'Terapeuta Ocupacional', 'Instrutor de Oficinas', 'Educador Ambiental', 'Coordenador de Voluntários'],
    description: 'Você une habilidades práticas com expressão criativa e interesse social.'
  },
  'ISE': {
    title: 'Cientista-Líder',
    careers: ['Diretor de Pesquisa', 'CTO', 'Gerente de Laboratório', 'Consultor Científico', 'Professor Universitário'],
    description: 'Você combina pensamento analítico com liderança e habilidades sociais.'
  }
};

// Category icons and colors
const categoryConfig: Record<CareerCategory, { icon: string; color: string; bgColor: string }> = {
  realistic: { icon: '🔧', color: 'text-amber-600', bgColor: 'bg-amber-500/20' },
  investigative: { icon: '🔬', color: 'text-blue-600', bgColor: 'bg-blue-500/20' },
  artistic: { icon: '🎨', color: 'text-purple-600', bgColor: 'bg-purple-500/20' },
  social: { icon: '👥', color: 'text-emerald-600', bgColor: 'bg-emerald-500/20' },
  enterprising: { icon: '💼', color: 'text-rose-600', bgColor: 'bg-rose-500/20' },
  conventional: { icon: '📊', color: 'text-slate-600', bgColor: 'bg-slate-500/20' }
};

const PremiumCareerReport = ({ 
  totalScore, 
  categoryScores, 
  topCategories, 
  hollandCode,
  resultBand, 
  userName = 'Usuário', 
  testDate 
}: PremiumCareerReportProps) => {
  const maxPossibleScore = 126; // 42 questions × 3 max
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  // Calculate category scores with percentages
  const categoryData: CategoryScore[] = (Object.entries(categoryScores) as [CareerCategory, number][])
    .map(([category, score]) => ({
      category,
      score,
      percentage: Math.round((score / 21) * 100) // 7 questions × 3 max = 21
    }))
    .sort((a, b) => b.score - a.score);

  // Get career suggestions based on Holland code
  const getCareerSuggestions = () => {
    // Try exact match first
    if (careerSuggestionsByCode[hollandCode]) {
      return careerSuggestionsByCode[hollandCode];
    }
    // Try first 3 letters
    const code3 = hollandCode.slice(0, 3);
    if (careerSuggestionsByCode[code3]) {
      return careerSuggestionsByCode[code3];
    }
    // Default based on top category
    const topCat = topCategories[0];
    return {
      title: `Perfil ${categoryLabels[topCat]}`,
      careers: categoryCareerExamples[topCat],
      description: categoryDescriptions[topCat]
    };
  };

  const careerSuggestions = getCareerSuggestions();

  const formattedDate = testDate || new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Get career recommendations
  const allCareers = careerSuggestions.careers;

  return (
    <div className="space-y-6 print:space-y-4 pb-24 md:pb-8">
      {/* Header */}
      <Card className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center">
                <Briefcase className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display">RELATÓRIO PREMIUM DE ORIENTAÇÃO DE CARREIRA</h1>
                <p className="opacity-90">Avaliação Vocacional RIASEC – Modelo Holland</p>
              </div>
            </div>
            <DownloadPdfButton
              variant="header"
              testType="career"
              testName="Orientação de Carreira"
              score={totalScore}
              maxScore={maxPossibleScore}
              resultBandName={careerSuggestions.title}
              description={resultBand.premiumDescription}
              careerAreas={allCareers}
              additionalInfo={{
                'Código Holland': hollandCode,
                'Perfil': topCategories.map(c => categoryLabels[c]).join(' + '),
              }}
            />
          </div>
        </div>

        <CardContent className="p-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Participante:</span>
              <span className="ml-2 font-medium">{userName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Data:</span>
              <span className="ml-2 font-medium">{formattedDate}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Código Holland:</span>
              <span className="ml-2 font-mono font-bold text-amber-600">{hollandCode}</span>
            </div>
            <div>
              <span className="text-muted-foreground">ID do Relatório:</span>
              <span className="ml-2 font-mono text-xs">NRX-CAR-{Date.now().toString(36).toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-500" />
            Sobre o Modelo Holland (RIASEC)
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            O <strong>Modelo Holland</strong>, também conhecido como RIASEC, é uma das teorias de orientação vocacional
            mais utilizadas mundialmente. Desenvolvida pelo psicólogo John L. Holland, esta abordagem identifica
            seis tipos de personalidade vocacional que se relacionam com diferentes ambientes de trabalho.
          </p>
          <p className="text-muted-foreground">
            Seu <strong>Código Holland</strong> é formado pelas suas três maiores pontuações, criando uma combinação
            única que indica as áreas profissionais mais compatíveis com seu perfil.
          </p>
        </CardContent>
      </Card>

      {/* Holland Code Result */}
      <Card className="border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-amber-500" />
            Seu Código Holland
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
              <Award className="h-8 w-8 text-amber-500" />
              <span className="text-4xl font-bold font-mono text-amber-600">{hollandCode}</span>
            </div>
            <p className="mt-3 text-muted-foreground">
              Seu perfil dominante: <strong>{topCategories.map(c => categoryLabels[c]).join(' + ')}</strong>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {topCategories.map((category, idx) => (
              <div 
                key={category}
                className={`p-4 rounded-xl text-center ${categoryConfig[category].bgColor}`}
              >
                <div className="text-3xl mb-2">{categoryConfig[category].icon}</div>
                <div className={`font-semibold ${categoryConfig[category].color}`}>
                  {idx + 1}º {categoryLabels[category]}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {categoryScores[category]}/21 pts ({Math.round((categoryScores[category] / 21) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Full Profile Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-500" />
            Análise Completa do Perfil RIASEC
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categoryData.map((item) => (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{categoryConfig[item.category].icon}</span>
                  <span className="font-medium">{categoryLabels[item.category]}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${categoryConfig[item.category].color}`}>
                    {item.percentage}%
                  </span>
                  <span className="text-sm text-muted-foreground">({item.score}/21)</span>
                </div>
              </div>
              <Progress value={item.percentage} className="h-3" />
              <p className="text-xs text-muted-foreground">{categoryDescriptions[item.category]}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Career Suggestions */}
      <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            Sugestões de Carreira para seu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center p-4 rounded-xl bg-white/50 border">
            <div className="text-sm text-muted-foreground mb-1">Seu tipo vocacional</div>
            <div className="text-2xl font-bold text-amber-600">{careerSuggestions.title}</div>
            <p className="mt-2 text-sm text-muted-foreground">{careerSuggestions.description}</p>
          </div>

          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <Briefcase className="h-4 w-4 text-amber-500" />
              Carreiras Recomendadas
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {careerSuggestions.careers.map((career, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-3 rounded-lg bg-white/50 border border-amber-200"
                >
                  <span className="text-amber-500">★</span>
                  <span className="font-medium text-sm">{career}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional careers by top categories */}
          <div>
            <h4 className="font-semibold mb-3">Mais Opções por Área de Interesse</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topCategories.map((category) => (
                <div key={category} className={`p-4 rounded-lg ${categoryConfig[category].bgColor}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span>{categoryConfig[category].icon}</span>
                    <span className={`font-medium ${categoryConfig[category].color}`}>
                      {categoryLabels[category]}
                    </span>
                  </div>
                  <ul className="text-sm space-y-1">
                    {categoryCareerExamples[category].map((career, idx) => (
                      <li key={idx} className="text-muted-foreground">• {career}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            Recomendações de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{resultBand.premiumDescription}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <h4 className="font-semibold text-success flex items-center gap-2 mb-3">
                <span>✓</span> Pontos Fortes
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Clareza sobre suas preferências vocacionais</li>
                <li>• Perfil bem definido no modelo RIASEC</li>
                <li>• Base sólida para decisões de carreira</li>
                <li>• Autoconhecimento sobre aptidões naturais</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
              <h4 className="font-semibold text-warning flex items-center gap-2 mb-3">
                <span>→</span> Áreas de Desenvolvimento
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Explore estágios ou projetos nas áreas indicadas</li>
                <li>• Desenvolva habilidades complementares</li>
                <li>• Busque mentores em carreiras de interesse</li>
                <li>• Invista em formação contínua</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compatibility Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-amber-500" />
            Compatibilidade com Ambientes de Trabalho
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categoryData.slice(0, 3).map((item) => {
              const isTop = item.category === topCategories[0];
              return (
                <div 
                  key={item.category}
                  className={`p-4 rounded-lg border-2 ${isTop ? 'border-amber-500 bg-amber-500/10' : 'border-border'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{categoryConfig[item.category].icon}</span>
                    {isTop && <span className="text-xs px-2 py-1 rounded bg-amber-500 text-white">Top</span>}
                  </div>
                  <h4 className="font-medium">{categoryLabels[item.category]}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Compatibilidade: <span className="font-semibold">{item.percentage}%</span>
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* International Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-500" />
            Contexto e Aplicação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            O modelo RIASEC é utilizado mundialmente em orientação vocacional, incluindo por agências de emprego,
            universidades e consultores de carreira. Seu código <strong>{hollandCode}</strong> pode ser usado para
            pesquisar ocupações em bases de dados internacionais como o O*NET (EUA) e sistemas de classificação
            ocupacional brasileiros. Este resultado é uma ferramenta valiosa para autoconhecimento e planejamento
            de carreira, mas deve ser complementado com experiências práticas e orientação profissional.
          </p>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-warning/50 bg-warning/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning">
            <AlertTriangle className="h-5 w-5" />
            Aviso de Uso Responsável
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            <strong>Este relatório tem finalidade exclusivamente educacional e orientativa.</strong>
            Não constitui diagnóstico clínico ou psicológico. Para orientação vocacional profissional,
            procure um psicólogo especializado em orientação de carreira ou um orientador vocacional
            registrado no conselho de classe. O resultado deve ser usado como ponto de partida para
            reflexão e exploração, não como determinação definitiva.
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>Relatório gerado automaticamente pela plataforma NEUROX.</p>
        <p className="mt-1">Data de geração: {formattedDate} | Modelo: Holland RIASEC</p>
      </div>

      {/* Mobile Sticky Download Button */}
      <DownloadPdfButton
        variant="sticky"
        testType="career"
        testName="Orientação de Carreira"
        score={totalScore}
        maxScore={maxPossibleScore}
        resultBandName={careerSuggestions.title}
        description={resultBand.premiumDescription}
        careerAreas={allCareers}
        additionalInfo={{
          'Código Holland': hollandCode,
          'Perfil': topCategories.map(c => categoryLabels[c]).join(' + '),
        }}
      />
    </div>
  );
};

export default PremiumCareerReport;
