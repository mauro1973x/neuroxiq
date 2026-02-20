import { Heart, AlertTriangle, TrendingUp, User, Lightbulb, BarChart3, Award, FileText, Sparkles, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CompatibilityResultBand, categoryLabels } from '@/data/compatibilityQuestions';
import DownloadPdfButton from './DownloadPdfButton';

type CompatibilityCategory = 'communication' | 'values' | 'emotional-support' | 'lifestyle' | 'chemistry';

interface CategoryScore {
  category: CompatibilityCategory;
  score: number;
  percentage: number;
}

interface PremiumCompatibilityReportProps {
  totalScore: number;
  compatibilityPercent: number;
  categoryScores: Record<CompatibilityCategory, number>;
  resultBand: CompatibilityResultBand;
  userName?: string;
  testDate?: string;
}

const categoryConfig: Record<CompatibilityCategory, { icon: string; color: string; bgColor: string }> = {
  'communication': { icon: '💬', color: 'text-blue-600', bgColor: 'bg-blue-500/20' },
  'values': { icon: '🌟', color: 'text-amber-600', bgColor: 'bg-amber-500/20' },
  'emotional-support': { icon: '💗', color: 'text-rose-600', bgColor: 'bg-rose-500/20' },
  'lifestyle': { icon: '🏠', color: 'text-emerald-600', bgColor: 'bg-emerald-500/20' },
  'chemistry': { icon: '🔥', color: 'text-orange-600', bgColor: 'bg-orange-500/20' },
};

const getCompatibilityColor = (percent: number) => {
  if (percent >= 85) return 'text-emerald-600';
  if (percent >= 70) return 'text-blue-600';
  if (percent >= 50) return 'text-amber-600';
  return 'text-rose-600';
};

const getCompatibilityGradient = (percent: number) => {
  if (percent >= 85) return 'from-emerald-500 to-teal-600';
  if (percent >= 70) return 'from-blue-500 to-indigo-600';
  if (percent >= 50) return 'from-amber-500 to-orange-600';
  return 'from-rose-500 to-pink-600';
};

const PremiumCompatibilityReport = ({
  totalScore,
  compatibilityPercent,
  categoryScores,
  resultBand,
  userName = 'Usuário',
  testDate,
}: PremiumCompatibilityReportProps) => {
  const formattedDate = testDate || new Date().toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });

  const gradient = getCompatibilityGradient(compatibilityPercent);
  const colorClass = getCompatibilityColor(compatibilityPercent);

  const categoryData: CategoryScore[] = (Object.entries(categoryScores) as [CompatibilityCategory, number][])
    .map(([category, score]) => ({
      category,
      score,
      // 6 questions per category, max 5 per question = 30 max per category
      percentage: Math.round((score / 30) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <Card className="glass-card overflow-hidden">
        <div className={`bg-gradient-to-r ${gradient} text-white p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center text-3xl">
                ❤️
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display">RELATÓRIO PREMIUM DE COMPATIBILIDADE</h1>
                <p className="opacity-90">Análise Afetiva e Relacional — NEUROX</p>
              </div>
            </div>
            <DownloadPdfButton
              variant="header"
              testType="emotional"
              testName="Compatibilidade Amorosa"
              score={compatibilityPercent}
              maxScore={100}
              resultBandName={resultBand.name}
              description={resultBand.premiumDescription}
              strengths={resultBand.strengths}
              challenges={resultBand.risks}
              recommendations={resultBand.recommendations}
              careerAreas={[]}
              additionalInfo={{
                'Índice de Compatibilidade': `${compatibilityPercent}%`,
                'Classificação': resultBand.name,
              }}
            />
          </div>
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-6 text-sm">
            <div><span className="text-muted-foreground">Participante:</span><span className="ml-2 font-medium">{userName}</span></div>
            <div><span className="text-muted-foreground">Data:</span><span className="ml-2 font-medium">{formattedDate}</span></div>
            <div><span className="text-muted-foreground">Índice:</span><span className={`ml-2 font-mono font-bold ${colorClass}`}>{compatibilityPercent}%</span></div>
            <div><span className="text-muted-foreground">ID:</span><span className="ml-2 font-mono text-xs">NRX-CPL-{Date.now().toString(36).toUpperCase()}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* About the test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-pink-500" />
            Sobre Este Teste
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            O <strong>Teste de Compatibilidade Amorosa NEUROX</strong> avalia seu perfil afetivo e relacional em cinco dimensões psicológicas fundamentais: Comunicação, Valores de Vida, Apoio Emocional, Estilo de Vida e Conexão &amp; Química. O índice de compatibilidade representa o alinhamento interno entre suas necessidades, valores e comportamentos afetivos.
          </p>
          <p className="text-muted-foreground">
            Uma pontuação alta indica alta coerência afetiva interna — o que favorece relacionamentos saudáveis. Uma pontuação mais baixa aponta áreas de desenvolvimento que, quando trabalhadas, podem transformar profundamente a qualidade das suas relações.
          </p>
        </CardContent>
      </Card>

      {/* Compatibility Score */}
      <Card className="border-pink-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-pink-500" />
            Seu Índice de Compatibilidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`text-center p-6 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 border border-pink-500/20 col-span-1 md:col-span-1`}>
              <div className={`text-6xl font-black ${colorClass}`}>{compatibilityPercent}%</div>
              <div className="text-sm text-muted-foreground mt-2">Índice de Compatibilidade</div>
            </div>
            <div className="md:col-span-2 flex flex-col justify-center gap-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{resultBand.name}</span>
                  <span className={`font-bold ${colorClass}`}>{compatibilityPercent}%</span>
                </div>
                <Progress value={compatibilityPercent} className="h-4" />
              </div>
              <p className="text-sm text-muted-foreground">{resultBand.premiumDescription}</p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500/10 border border-pink-500/30">
              <Award className="h-6 w-6 text-pink-500" />
              <span className={`text-xl font-bold ${colorClass}`}>{resultBand.compatibilityLevel}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-500" />
            Análise por Dimensão Afetiva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {categoryData.map((item) => {
            const config = categoryConfig[item.category];
            const level = item.percentage >= 70 ? 'Alto' : item.percentage >= 45 ? 'Moderado' : 'Em Desenvolvimento';
            return (
              <div key={item.category} className="space-y-2 p-4 rounded-lg bg-muted/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{config.icon}</span>
                    <span className="font-medium">{categoryLabels[item.category]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                      {level}
                    </span>
                  </div>
                  <span className={`font-bold ${config.color}`}>{item.percentage}%</span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Strengths & Risks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-pink-500" />
            Pontos Fortes e Riscos Estruturais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <h4 className="font-semibold text-emerald-600 mb-3 flex items-center gap-2">
                <span>✓</span> Pontos Fortes
              </h4>
              <ul className="space-y-2 text-sm">
                {resultBand.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <h4 className="font-semibold text-amber-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Riscos Ocultos
              </h4>
              <ul className="space-y-2 text-sm">
                {resultBand.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 shrink-0">•</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Long Term Forecast */}
      <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            Previsão de Longo Prazo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{resultBand.longTermForecast}</p>
        </CardContent>
      </Card>

      {/* Ideal Partner Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-pink-500" />
            Perfil do Parceiro Ideal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{resultBand.idealPartnerProfile}</p>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-pink-500" />
            Recomendações Práticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {resultBand.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/20">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-pink-500/20 text-pink-600 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="border-0 bg-muted/30">
        <CardContent className="p-4 text-center text-xs text-muted-foreground">
          <p className="font-medium mb-1">NEUROX — Relatório de Compatibilidade Amorosa</p>
          <p>Este relatório é de caráter psicológico-informativo. Não substitui acompanhamento terapêutico profissional.</p>
          <p className="mt-1 font-mono">ID: NRX-CPL-{Date.now().toString(36).toUpperCase()} • {formattedDate}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumCompatibilityReport;
