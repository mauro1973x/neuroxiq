import { User, Target, Lightbulb, Users, Globe, AlertTriangle, FileText, Award, TrendingUp, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  PersonalityResultBand, 
  PersonalityCategory, 
  categoryLabels, 
  categoryDescriptions 
} from '@/data/personalityQuestions';
import DownloadPdfButton from './DownloadPdfButton';

interface CategoryScore {
  category: PersonalityCategory;
  score: number;
  percentage: number;
}

interface PremiumPersonalityReportProps {
  totalScore: number;
  categoryScores: Record<PersonalityCategory, number>;
  dominantTraits: PersonalityCategory[];
  resultBand: PersonalityResultBand;
  userName?: string;
  testDate?: string;
}

// Category icons and colors
const categoryConfig: Record<PersonalityCategory, { icon: string; color: string; bgColor: string; letter: string }> = {
  openness: { icon: '🎨', color: 'text-purple-600', bgColor: 'bg-purple-500/20', letter: 'O' },
  conscientiousness: { icon: '📋', color: 'text-blue-600', bgColor: 'bg-blue-500/20', letter: 'C' },
  extraversion: { icon: '🌟', color: 'text-amber-600', bgColor: 'bg-amber-500/20', letter: 'E' },
  agreeableness: { icon: '🤝', color: 'text-emerald-600', bgColor: 'bg-emerald-500/20', letter: 'A' },
  neuroticism: { icon: '🧘', color: 'text-rose-600', bgColor: 'bg-rose-500/20', letter: 'N' }
};

// Detailed trait descriptions based on score level
const getTraitDescription = (category: PersonalityCategory, percentage: number): { level: string; description: string } => {
  const descriptions: Record<PersonalityCategory, { high: string; medium: string; low: string }> = {
    openness: {
      high: 'Você possui uma mente altamente criativa e curiosa. Busca ativamente novas experiências, ideias e perspectivas. Tem facilidade para pensar de forma abstrata e aprecia a arte, a cultura e discussões filosóficas.',
      medium: 'Você mantém um equilíbrio saudável entre tradição e inovação. Está aberto a novas experiências quando elas se mostram valiosas, mas também valoriza o que já conhece e funciona.',
      low: 'Você valoriza a praticidade e a tradição. Prefere métodos comprovados e rotinas estabelecidas. Tem foco no concreto e no que pode ser diretamente aplicado no dia a dia.'
    },
    conscientiousness: {
      high: 'Você é extremamente organizado, disciplinado e orientado para objetivos. Planeja com antecedência, cumpre prazos e presta atenção aos detalhes. É visto como alguém confiável e responsável.',
      medium: 'Você equilibra organização com flexibilidade. Consegue manter compromissos importantes enquanto se adapta a mudanças. Tem disciplina quando necessário, mas não é rígido.',
      low: 'Você tende a ser mais espontâneo e flexível. Pode ter dificuldade com planejamento de longo prazo, mas possui grande adaptabilidade e criatividade em situações imprevistas.'
    },
    extraversion: {
      high: 'Você é altamente sociável e energizado por interações sociais. Busca ativamente conexões, gosta de ser o centro das atenções e se sente revigorado em grupos.',
      medium: 'Você equilibra momentos sociais com tempo para si mesmo. Aprecia boas conversas e eventos, mas também valoriza sua privacidade e momentos de reflexão.',
      low: 'Você tende à introversão, preferindo interações profundas com poucos a eventos sociais amplos. Recarrega energias em solidão e reflete antes de agir.'
    },
    agreeableness: {
      high: 'Você é altamente cooperativo, empático e focado na harmonia social. Prioriza o bem-estar dos outros, evita conflitos e é visto como uma pessoa confiável e gentil.',
      medium: 'Você equilibra cooperação com assertividade. Sabe quando ceder e quando defender seus interesses. Mantém relacionamentos saudáveis enquanto preserva sua individualidade.',
      low: 'Você tende a ser mais competitivo e direto. Questiona intenções e prioriza seus próprios interesses. Isso pode ser valioso em negociações e situações que exigem firmeza.'
    },
    neuroticism: {
      high: 'Você tende a experimentar emoções negativas com mais intensidade e frequência. Pode se preocupar mais e reagir fortemente a estressores, mas isso também indica alta sensibilidade emocional.',
      medium: 'Você tem um equilíbrio emocional razoável. Experimenta altos e baixos, mas consegue se recuperar de situações estressantes em tempo adequado.',
      low: 'Você demonstra alta estabilidade emocional e resiliência. Mantém a calma sob pressão, lida bem com estresse e raramente se deixa dominar por emoções negativas.'
    }
  };

  const level = percentage >= 70 ? 'high' : percentage >= 40 ? 'medium' : 'low';
  const levelLabel = percentage >= 70 ? 'Alto' : percentage >= 40 ? 'Moderado' : 'Baixo';
  
  return { 
    level: levelLabel, 
    description: descriptions[category][level] 
  };
};

// Career recommendations based on personality profile
const getCareerRecommendations = (dominantTraits: PersonalityCategory[]): string[] => {
  const careersByTrait: Record<PersonalityCategory, string[]> = {
    openness: ['Artista', 'Designer', 'Pesquisador', 'Escritor', 'Psicólogo', 'Filósofo'],
    conscientiousness: ['Contador', 'Gerente de Projetos', 'Médico', 'Engenheiro', 'Advogado', 'Analista'],
    extraversion: ['Vendedor', 'Relações Públicas', 'Professor', 'Político', 'Empreendedor', 'Líder de Equipe'],
    agreeableness: ['Enfermeiro', 'Assistente Social', 'RH', 'Terapeuta', 'Mediador', 'Voluntário'],
    neuroticism: ['Artista', 'Escritor', 'Pesquisador', 'Analista de Dados', 'Desenvolvedor', 'Bibliotecário']
  };

  const careers = new Set<string>();
  dominantTraits.forEach(trait => {
    careersByTrait[trait].forEach(career => careers.add(career));
  });

  return Array.from(careers).slice(0, 8);
};

// Relationship insights
const getRelationshipInsights = (categoryScores: Record<PersonalityCategory, number>): { strength: string; challenge: string; tip: string }[] => {
  const insights: { strength: string; challenge: string; tip: string }[] = [];
  
  if (categoryScores.agreeableness > 60) {
    insights.push({
      strength: 'Você é naturalmente empático e atencioso',
      challenge: 'Pode ter dificuldade em estabelecer limites',
      tip: 'Pratique dizer "não" de forma assertiva e gentil'
    });
  }
  
  if (categoryScores.extraversion > 60) {
    insights.push({
      strength: 'Você cria conexões facilmente',
      challenge: 'Pode negligenciar tempo para si mesmo',
      tip: 'Reserve momentos de solidão para reflexão'
    });
  } else if (categoryScores.extraversion < 40) {
    insights.push({
      strength: 'Você valoriza conexões profundas',
      challenge: 'Pode parecer distante inicialmente',
      tip: 'Comunique suas necessidades de espaço aos outros'
    });
  }
  
  if (categoryScores.neuroticism > 60) {
    insights.push({
      strength: 'Você é altamente sensível aos outros',
      challenge: 'Pode absorver emoções negativas',
      tip: 'Desenvolva técnicas de proteção emocional'
    });
  }

  return insights.length > 0 ? insights : [{
    strength: 'Você tem um perfil equilibrado',
    challenge: 'Manter consistência em diferentes contextos',
    tip: 'Continue desenvolvendo autoconsciência'
  }];
};

const PremiumPersonalityReport = ({ 
  totalScore, 
  categoryScores, 
  dominantTraits, 
  resultBand, 
  userName = 'Usuário', 
  testDate 
}: PremiumPersonalityReportProps) => {
  const maxPossibleScore = 120;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  // Calculate category data with percentages
  const categoryData: CategoryScore[] = (Object.entries(categoryScores) as [PersonalityCategory, number][])
    .map(([category, score]) => ({
      category,
      score,
      percentage: category === 'neuroticism' 
        ? 100 - score  // Invert for "emotional stability"
        : score
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const formattedDate = testDate || new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Get strengths from trait descriptions
  const traitDescriptions = categoryData.slice(0, 3).map(item => 
    getTraitDescription(item.category, item.percentage).description
  );

  const careerRecommendations = getCareerRecommendations(dominantTraits);
  const relationshipInsights = getRelationshipInsights(categoryScores);

  return (
    <div className="space-y-6 print:space-y-4 pb-24 md:pb-8">
      {/* Header */}
      <Card className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display">RELATÓRIO PREMIUM DE PERSONALIDADE</h1>
                <p className="opacity-90">Avaliação Big Five (OCEAN) – Modelo Científico</p>
              </div>
            </div>
            <DownloadPdfButton
              variant="header"
              testType="personality"
              testName="Personalidade Big Five"
              score={totalScore}
              maxScore={maxPossibleScore}
              resultBandName={`Perfil ${dominantTraits.map(t => categoryConfig[t].letter).join('')}`}
              description={resultBand.premiumDescription}
              strengths={traitDescriptions}
              recommendations={relationshipInsights.map(i => i.tip)}
              careerAreas={careerRecommendations}
              additionalInfo={{
                'Perfil OCEAN': dominantTraits.map(t => categoryConfig[t].letter).join(''),
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
              <span className="text-muted-foreground">Perfil OCEAN:</span>
              <span className="ml-2 font-mono font-bold text-violet-600">
                {dominantTraits.map(t => categoryConfig[t].letter).join('')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">ID do Relatório:</span>
              <span className="ml-2 font-mono text-xs">NRX-PER-{Date.now().toString(36).toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Big Five */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-500" />
            Sobre o Modelo Big Five (OCEAN)
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            O <strong>Modelo Big Five</strong> é a teoria de personalidade mais aceita e validada cientificamente. 
            Desenvolvido ao longo de décadas de pesquisa, ele identifica cinco dimensões fundamentais que descrevem 
            a personalidade humana: <strong>Abertura</strong> (O), <strong>Conscienciosidade</strong> (C), 
            <strong>Extroversão</strong> (E), <strong>Amabilidade</strong> (A) e <strong>Neuroticismo</strong> (N).
          </p>
          <p className="text-muted-foreground">
            Não há perfis "melhores" ou "piores" – cada configuração tem seus pontos fortes e desafios únicos. 
            O autoconhecimento dessas dimensões permite maior compreensão de si mesmo e melhores decisões de vida.
          </p>
        </CardContent>
      </Card>

      {/* OCEAN Profile */}
      <Card className="border-violet-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            Seu Perfil OCEAN
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30">
              <Award className="h-8 w-8 text-violet-500" />
              <span className="text-4xl font-bold font-mono text-violet-600">
                {dominantTraits.map(t => categoryConfig[t].letter).join('')}
              </span>
            </div>
            <p className="mt-3 text-muted-foreground">
              Traços dominantes: <strong>{dominantTraits.map(c => categoryLabels[c]).join(' + ')}</strong>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {dominantTraits.slice(0, 3).map((category, idx) => (
              <div 
                key={category}
                className={`p-4 rounded-xl text-center ${categoryConfig[category].bgColor}`}
              >
                <div className="text-3xl mb-2">{categoryConfig[category].icon}</div>
                <div className={`font-semibold ${categoryConfig[category].color}`}>
                  {idx + 1}º {categoryLabels[category]}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {categoryScores[category]}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Trait Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-violet-500" />
            Análise Detalhada dos Cinco Traços
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categoryData.map((item) => {
            const traitInfo = getTraitDescription(item.category, item.percentage);
            const displayLabel = item.category === 'neuroticism' ? 'Estabilidade Emocional' : categoryLabels[item.category];
            
            return (
              <div key={item.category} className="space-y-3 p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{categoryConfig[item.category].icon}</span>
                    <span className="font-medium">{displayLabel}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryConfig[item.category].bgColor} ${categoryConfig[item.category].color}`}>
                      {traitInfo.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${categoryConfig[item.category].color}`}>
                      {item.percentage}%
                    </span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-3" />
                <p className="text-sm text-muted-foreground">{traitInfo.description}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Career Recommendations */}
      <Card className="border-violet-500/30 bg-gradient-to-br from-violet-500/5 to-purple-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-violet-500" />
            Carreiras Compatíveis com seu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Com base na combinação dos seus traços de personalidade, estas são áreas profissionais onde você 
            pode se destacar naturalmente:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {careerRecommendations.map((career, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-2 p-3 rounded-lg bg-white/50 border border-violet-200"
              >
                <span className="text-violet-500">★</span>
                <span className="font-medium text-sm">{career}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Relationship Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-violet-500" />
            Insights para Relacionamentos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {relationshipInsights.map((insight, idx) => (
            <div key={idx} className="p-4 rounded-lg border bg-muted/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-success/10">
                  <div className="text-success font-semibold text-sm mb-1">💪 Força</div>
                  <p className="text-xs text-muted-foreground">{insight.strength}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-warning/10">
                  <div className="text-warning font-semibold text-sm mb-1">⚡ Desafio</div>
                  <p className="text-xs text-muted-foreground">{insight.challenge}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-primary/10">
                  <div className="text-primary font-semibold text-sm mb-1">💡 Dica</div>
                  <p className="text-xs text-muted-foreground">{insight.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Development Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-violet-500" />
            Recomendações de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{resultBand.premiumDescription}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <h4 className="font-semibold text-success flex items-center gap-2 mb-3">
                <span>✓</span> Como Potencializar seus Pontos Fortes
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Identifique situações onde seus traços dominantes brilham</li>
                <li>• Busque papéis e projetos alinhados ao seu perfil</li>
                <li>• Use suas características naturais como diferencial</li>
                <li>• Cerque-se de pessoas com perfis complementares</li>
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
              <h4 className="font-semibold text-warning flex items-center gap-2 mb-3">
                <span>→</span> Áreas para Desenvolvimento
              </h4>
              <ul className="space-y-2 text-sm">
                <li>• Trabalhe nos traços com menor pontuação gradualmente</li>
                <li>• Pratique comportamentos fora da sua zona de conforto</li>
                <li>• Busque feedback de pessoas próximas</li>
                <li>• Considere coaching ou terapia para crescimento pessoal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* International Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-violet-500" />
            Contexto Comparativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Seu perfil de personalidade é único e representa uma combinação específica de traços. 
            Estudos internacionais mostram que a distribuição dos traços Big Five varia culturalmente, 
            mas as características fundamentais são universais. Seu perfil <strong>{resultBand.name}</strong> indica 
            {percentage >= 75 ? ' alto desenvolvimento e maturidade psicológica.' : 
             percentage >= 50 ? ' equilíbrio saudável entre diferentes dimensões.' : 
             ' potencial significativo para crescimento e autodescoberta.'}
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
            <strong>Este relatório tem finalidade exclusivamente educacional e informativa.</strong>
            {' '}Não constitui diagnóstico clínico, psicológico ou médico.
            Para avaliações clínicas oficiais, procure um profissional habilitado
            (psicólogo registrado no conselho de classe).
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>Relatório gerado automaticamente pela plataforma NEUROX.</p>
        <p className="mt-1">Data de geração: {formattedDate}</p>
      </div>

      {/* Mobile Sticky Download Button */}
      <DownloadPdfButton
        variant="sticky"
        testType="personality"
        testName="Personalidade Big Five"
        score={totalScore}
        maxScore={maxPossibleScore}
        resultBandName={`Perfil ${dominantTraits.map(t => categoryConfig[t].letter).join('')}`}
        description={resultBand.premiumDescription}
        strengths={traitDescriptions}
        recommendations={relationshipInsights.map(i => i.tip)}
        careerAreas={careerRecommendations}
        additionalInfo={{
          'Perfil OCEAN': dominantTraits.map(t => categoryConfig[t].letter).join(''),
        }}
      />
    </div>
  );
};

export default PremiumPersonalityReport;
