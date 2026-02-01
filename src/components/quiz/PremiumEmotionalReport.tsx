import { Heart, Target, Lightbulb, Users, Globe, AlertTriangle, FileText, Award, TrendingUp, Brain, Sparkles, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { EmotionalResultBand } from '@/data/emotionalQuestions';
import DownloadPdfButton from './DownloadPdfButton';

type EmotionalCategory = 'self-awareness' | 'self-regulation' | 'motivation' | 'empathy' | 'social-skills';

interface CategoryScore {
  category: EmotionalCategory;
  score: number;
  percentage: number;
}

interface PremiumEmotionalReportProps {
  totalScore: number;
  categoryScores: Record<EmotionalCategory, number>;
  dominantCompetencies: EmotionalCategory[];
  estimatedEQ: number;
  resultBand: EmotionalResultBand;
  userName?: string;
  testDate?: string;
}

// Category configuration
const categoryConfig: Record<EmotionalCategory, { 
  icon: string; 
  color: string; 
  bgColor: string; 
  label: string;
  description: string;
}> = {
  'self-awareness': { 
    icon: '🪞', 
    color: 'text-violet-600', 
    bgColor: 'bg-violet-500/20', 
    label: 'Autoconsciência',
    description: 'Capacidade de reconhecer e compreender suas próprias emoções, forças, fraquezas e como elas afetam suas decisões.'
  },
  'self-regulation': { 
    icon: '🎯', 
    color: 'text-blue-600', 
    bgColor: 'bg-blue-500/20', 
    label: 'Autorregulação',
    description: 'Habilidade de gerenciar suas emoções, impulsos e adaptar-se a situações em mudança de forma construtiva.'
  },
  'motivation': { 
    icon: '🔥', 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-500/20', 
    label: 'Motivação',
    description: 'Impulso interno para alcançar objetivos, persistir diante de desafios e manter otimismo mesmo em dificuldades.'
  },
  'empathy': { 
    icon: '💗', 
    color: 'text-rose-600', 
    bgColor: 'bg-rose-500/20', 
    label: 'Empatia',
    description: 'Capacidade de compreender as emoções, necessidades e perspectivas dos outros e responder de forma apropriada.'
  },
  'social-skills': { 
    icon: '🤝', 
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-500/20', 
    label: 'Habilidades Sociais',
    description: 'Competência em gerenciar relacionamentos, influenciar positivamente e colaborar efetivamente com outros.'
  }
};

// Get detailed recommendations by category
const getCategoryRecommendations = (category: EmotionalCategory, percentage: number): string[] => {
  const recommendations: Record<EmotionalCategory, { high: string[]; medium: string[]; low: string[] }> = {
    'self-awareness': {
      high: ['Continue praticando reflexão diária', 'Mentore outros em autoconhecimento', 'Explore práticas avançadas de mindfulness'],
      medium: ['Mantenha um diário emocional', 'Pratique identificar gatilhos emocionais', 'Peça feedback regularmente'],
      low: ['Comece com check-ins emocionais diários', 'Aprenda a nomear suas emoções', 'Considere terapia ou coaching']
    },
    'self-regulation': {
      high: ['Desafie-se com situações de alta pressão', 'Ensine técnicas a outros', 'Desenvolva resiliência avançada'],
      medium: ['Pratique técnicas de respiração', 'Desenvolva rituais de pausa', 'Identifique padrões de reação'],
      low: ['Comece com pausas antes de reagir', 'Aprenda técnicas básicas de relaxamento', 'Evite decisões impulsivas']
    },
    'motivation': {
      high: ['Busque projetos desafiadores', 'Inspire e motive equipes', 'Estabeleça metas de longo prazo'],
      medium: ['Conecte tarefas a propósitos maiores', 'Celebre pequenas vitórias', 'Crie sistemas de recompensa'],
      low: ['Identifique o que te move internamente', 'Divida metas em passos menores', 'Busque apoio de um mentor']
    },
    'empathy': {
      high: ['Use sua empatia para liderar mudanças', 'Proteja-se de sobrecarga emocional', 'Mentore em comunicação empática'],
      medium: ['Pratique escuta ativa diariamente', 'Busque entender antes de responder', 'Observe linguagem não-verbal'],
      low: ['Faça perguntas sobre os sentimentos dos outros', 'Pratique colocar-se no lugar do outro', 'Leia sobre emoções humanas']
    },
    'social-skills': {
      high: ['Lidere iniciativas colaborativas', 'Desenvolva redes estratégicas', 'Facilite resoluções de conflitos'],
      medium: ['Pratique feedback construtivo', 'Desenvolva habilidades de persuasão', 'Amplie sua rede de contatos'],
      low: ['Comece com conversas pequenas', 'Observe comunicadores eficazes', 'Pratique assertividade básica']
    }
  };

  const level = percentage >= 70 ? 'high' : percentage >= 40 ? 'medium' : 'low';
  return recommendations[category][level];
};

// Get EQ level description
const getEQDescription = (eq: number): { level: string; description: string } => {
  if (eq >= 121) return {
    level: 'Excepcional',
    description: 'Você possui um domínio notável de todas as competências emocionais. É capaz de influenciar positivamente ambientes e pessoas ao seu redor.'
  };
  if (eq >= 106) return {
    level: 'Elevado',
    description: 'Você demonstra habilidades emocionais acima da média, com boa capacidade de autogestão e relacionamentos saudáveis.'
  };
  if (eq >= 91) return {
    level: 'Moderado',
    description: 'Você possui uma base sólida de inteligência emocional, com espaço para refinamento em áreas específicas.'
  };
  if (eq >= 76) return {
    level: 'Em Desenvolvimento',
    description: 'Você está construindo suas competências emocionais. Continue investindo em autoconhecimento e prática.'
  };
  return {
    level: 'Inicial',
    description: 'Há grande potencial de crescimento. A inteligência emocional é uma habilidade que pode ser desenvolvida com dedicação.'
  };
};

const PremiumEmotionalReport = ({ 
  totalScore, 
  categoryScores, 
  dominantCompetencies, 
  estimatedEQ,
  resultBand, 
  userName = 'Usuário', 
  testDate 
}: PremiumEmotionalReportProps) => {
  const maxPossibleScore = 30;
  const percentage = Math.round((totalScore / maxPossibleScore) * 100);

  // Calculate category data with percentages
  const categoryData: CategoryScore[] = (Object.entries(categoryScores) as [EmotionalCategory, number][])
    .map(([category, score]) => ({
      category,
      score,
      percentage: Math.round((score / 6) * 100) // 6 questions per category
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const formattedDate = testDate || new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  // Build recommendations from all categories
  const allRecommendations = categoryData.flatMap(item => 
    getCategoryRecommendations(item.category, item.percentage).slice(0, 1)
  );

  const eqInfo = getEQDescription(estimatedEQ);

  return (
    <div className="space-y-6 print:space-y-4 pb-24 md:pb-8">
      {/* Header */}
      <Card className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center">
                <Heart className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display">RELATÓRIO PREMIUM DE INTELIGÊNCIA EMOCIONAL</h1>
                <p className="opacity-90">Avaliação de Competências Emocionais – Modelo Goleman</p>
              </div>
            </div>
            <DownloadPdfButton
              variant="header"
              testType="emotional"
              testName="Inteligência Emocional"
              score={totalScore}
              maxScore={maxPossibleScore}
              resultBandName={resultBand.name}
              description={resultBand.premiumDescription}
              strengths={resultBand.strengths}
              challenges={resultBand.challenges}
              recommendations={allRecommendations}
              careerAreas={resultBand.careerAreas}
              additionalInfo={{
                'QE Estimado': `~${estimatedEQ}`,
                'Faixa Percentil': resultBand.percentileRange,
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
              <span className="text-muted-foreground">QE Estimado:</span>
              <span className="ml-2 font-mono font-bold text-rose-600">~{estimatedEQ}</span>
            </div>
            <div>
              <span className="text-muted-foreground">ID do Relatório:</span>
              <span className="ml-2 font-mono text-xs">NRX-EMO-{Date.now().toString(36).toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Emotional Intelligence */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-rose-500" />
            O Que é Inteligência Emocional (QE)
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            A <strong>Inteligência Emocional (QE)</strong> é a capacidade de perceber, usar, compreender e gerenciar 
            emoções – tanto as próprias quanto as dos outros. Popularizada pelo psicólogo Daniel Goleman, 
            esta competência é considerada tão ou mais importante que o QI para o sucesso na vida pessoal e profissional.
          </p>
          <p className="text-muted-foreground">
            Diferente do QI, que é relativamente estável, a inteligência emocional pode ser desenvolvida 
            significativamente através de prática consciente e dedicação ao autoconhecimento.
          </p>
        </CardContent>
      </Card>

      {/* EQ Score Display */}
      <Card className="border-rose-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-rose-500" />
            Seu Quociente Emocional (QE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20">
              <div className="text-4xl font-bold text-rose-600">{totalScore}/{maxPossibleScore}</div>
              <div className="text-sm text-muted-foreground mt-1">Pontuação Bruta</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20">
              <div className="text-4xl font-bold text-pink-600">~{estimatedEQ}</div>
              <div className="text-sm text-muted-foreground mt-1">QE Estimado</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20">
              <div className="text-4xl font-bold text-red-600">{resultBand.percentileRange}</div>
              <div className="text-sm text-muted-foreground mt-1">Faixa Percentil</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Sua Classificação de QE</div>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-500/10 border border-rose-500/30">
              <Award className="h-6 w-6 text-rose-500" />
              <span className="text-2xl font-bold text-rose-600">{eqInfo.level}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
              {eqInfo.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Dominant Competencies */}
      <Card className="border-rose-500/30 bg-gradient-to-br from-rose-500/5 to-pink-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            Suas Competências Dominantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {dominantCompetencies.slice(0, 3).map((category, idx) => (
              <div 
                key={category}
                className={`p-4 rounded-xl text-center bg-white/50 border ${categoryConfig[category].bgColor}`}
              >
                <div className="text-3xl mb-2">{categoryConfig[category].icon}</div>
                <div className={`font-semibold ${categoryConfig[category].color}`}>
                  {idx + 1}º {categoryConfig[category].label}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {categoryScores[category]}/6 acertos
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm">
            Estas são as áreas onde você demonstrou maior competência emocional. Use-as como base para seu desenvolvimento.
          </p>
        </CardContent>
      </Card>

      {/* Detailed Competency Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-rose-500" />
            Análise das Cinco Competências
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {categoryData.map((item) => {
            const config = categoryConfig[item.category];
            const level = item.percentage >= 70 ? 'Alto' : item.percentage >= 40 ? 'Moderado' : 'Em Desenvolvimento';
            
            return (
              <div key={item.category} className="space-y-3 p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="font-medium">{config.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                      {level}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${config.color}`}>
                      {item.percentage}%
                    </span>
                    <span className="text-sm text-muted-foreground">({item.score}/6)</span>
                  </div>
                </div>
                <Progress value={item.percentage} className="h-3" />
                <p className="text-sm text-muted-foreground">{config.description}</p>
                
                <div className="mt-3 pt-3 border-t border-dashed">
                  <div className="text-xs font-semibold text-muted-foreground mb-2">Recomendações:</div>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {getCategoryRecommendations(item.category, item.percentage).map((rec, idx) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Strengths and Challenges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-rose-500" />
            Pontos Fortes e Desafios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-success/10 border border-success/30">
              <h4 className="font-semibold text-success flex items-center gap-2 mb-3">
                <span>✓</span> Pontos Fortes Identificados
              </h4>
              <ul className="space-y-2 text-sm">
                {resultBand.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-success">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
              <h4 className="font-semibold text-warning flex items-center gap-2 mb-3">
                <span>→</span> Áreas para Desenvolvimento
              </h4>
              <ul className="space-y-2 text-sm">
                {resultBand.challenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-warning">•</span>
                    {challenge}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Areas */}
      <Card className="border-rose-500/30 bg-gradient-to-br from-rose-500/5 to-pink-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-rose-500" />
            Áreas Profissionais Compatíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm mb-4">
            Com base no seu perfil de inteligência emocional, estas são áreas onde suas competências podem se destacar:
          </p>
          <div className="flex flex-wrap gap-3">
            {resultBand.careerAreas.map((area, idx) => (
              <span 
                key={idx} 
                className="px-4 py-2 rounded-full bg-rose-500/10 text-rose-600 text-sm font-medium border border-rose-500/30"
              >
                {area}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Development Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-rose-500" />
            Plano de Desenvolvimento Personalizado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{resultBand.premiumDescription}</p>
          
          <Separator />
          
          <div>
            <h4 className="font-semibold mb-3">Ações Recomendadas</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {resultBand.recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 p-3 rounded-lg bg-muted/20">
                  <span className="text-rose-500 font-bold">{idx + 1}.</span>
                  <span className="text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-rose-500" />
            Contexto Comparativo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Seu QE estimado de <strong>~{estimatedEQ}</strong> coloca você na faixa <strong>{resultBand.eqRange}</strong>, 
            correspondendo ao percentil <strong>{resultBand.percentileRange}</strong> da população. 
            Isso significa que você demonstrou competências emocionais equivalentes ou superiores a uma parcela significativa 
            das pessoas avaliadas em testes similares. Lembre-se: a inteligência emocional é uma habilidade que pode ser 
            continuamente desenvolvida ao longo da vida.
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
            (psicólogo ou psiquiatra registrado no conselho de classe).
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
        testType="emotional"
        testName="Inteligência Emocional"
        score={totalScore}
        maxScore={maxPossibleScore}
        resultBandName={resultBand.name}
        description={resultBand.premiumDescription}
        strengths={resultBand.strengths}
        challenges={resultBand.challenges}
        recommendations={allRecommendations}
        careerAreas={resultBand.careerAreas}
        additionalInfo={{
          'QE Estimado': `~${estimatedEQ}`,
          'Faixa Percentil': resultBand.percentileRange,
        }}
      />
    </div>
  );
};

export default PremiumEmotionalReport;
