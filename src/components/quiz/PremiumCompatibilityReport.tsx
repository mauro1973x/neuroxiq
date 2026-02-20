import {
  Heart, AlertTriangle, TrendingUp, User, Lightbulb, BarChart3,
  Award, FileText, Sparkles, Shield, Brain, Clock, Star, CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  'values':        { icon: '🌟', color: 'text-amber-600', bgColor: 'bg-amber-500/20' },
  'emotional-support': { icon: '💗', color: 'text-rose-600', bgColor: 'bg-rose-500/20' },
  'lifestyle':     { icon: '🏠', color: 'text-emerald-600', bgColor: 'bg-emerald-500/20' },
  'chemistry':     { icon: '🔥', color: 'text-orange-600', bgColor: 'bg-orange-500/20' },
};

const getCompatibilityColor = (percent: number) => {
  if (percent >= 81) return 'text-emerald-600';
  if (percent >= 61) return 'text-blue-600';
  if (percent >= 41) return 'text-amber-600';
  if (percent >= 21) return 'text-orange-600';
  return 'text-rose-600';
};

const getCompatibilityGradient = (percent: number) => {
  if (percent >= 81) return 'from-emerald-500 to-teal-600';
  if (percent >= 61) return 'from-blue-500 to-indigo-600';
  if (percent >= 41) return 'from-amber-500 to-orange-600';
  if (percent >= 21) return 'from-orange-500 to-red-600';
  return 'from-rose-500 to-pink-700';
};

const PremiumCompatibilityReport = ({
  totalScore,
  compatibilityPercent,
  categoryScores,
  resultBand,
  userName = 'Participante',
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
      percentage: Math.round((score / 30) * 100),
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const reportId = `NRX-CPL-${Date.now().toString(36).toUpperCase()}`;

  return (
    <div className="space-y-6 pb-24 md:pb-8">

      {/* ── SEÇÃO 1: CAPA ───────────────────────────────────────────────────── */}
      <Card className="glass-card overflow-hidden">
        <div className={`bg-gradient-to-br ${gradient} text-white p-6 md:p-8`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shrink-0">
                ❤️
              </div>
              <div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-widest mb-1">NEUROX — Análise Afetiva e Relacional</p>
                <h1 className="text-xl md:text-2xl font-bold font-display leading-tight">
                  RELATÓRIO PREMIUM<br/>DE COMPATIBILIDADE AMOROSA
                </h1>
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
              challenges={resultBand.challenges}
              recommendations={resultBand.recommendations}
              careerAreas={[]}
              additionalInfo={{
                'Índice de Compatibilidade': `${compatibilityPercent}%`,
                'Nível': resultBand.name,
              }}
            />
          </div>

          {/* Score destaque */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-black">{compatibilityPercent}%</div>
              <div className="text-white/70 text-sm mt-1">Índice de Compatibilidade</div>
            </div>
            <Separator orientation="vertical" className="h-14 bg-white/20 hidden sm:block" />
            <div>
              <Badge className="bg-white/20 text-white border-white/30 text-sm font-semibold px-3 py-1 mb-2">
                {resultBand.name}
              </Badge>
              <p className="text-white/80 text-sm">{resultBand.compatibilityLevel} de compatibilidade afetiva</p>
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-wrap gap-4 md:gap-6 text-sm">
            <div><span className="text-muted-foreground">Participante:</span><span className="ml-2 font-medium">{userName}</span></div>
            <div><span className="text-muted-foreground">Data:</span><span className="ml-2 font-medium">{formattedDate}</span></div>
            <div><span className="text-muted-foreground">ID:</span><span className="ml-2 font-mono text-xs">{reportId}</span></div>
          </div>
        </CardContent>
      </Card>

      {/* Download mobile sticky */}
      <DownloadPdfButton
        variant="sticky"
        testType="emotional"
        testName="Compatibilidade Amorosa"
        score={compatibilityPercent}
        maxScore={100}
        resultBandName={resultBand.name}
        description={resultBand.premiumDescription}
        strengths={resultBand.strengths}
        challenges={resultBand.challenges}
        recommendations={resultBand.recommendations}
        careerAreas={[]}
        additionalInfo={{
          'Índice de Compatibilidade': `${compatibilityPercent}%`,
          'Nível': resultBand.name,
        }}
      />

      {/* ── SEÇÃO 2: VISÃO GERAL DO RELACIONAMENTO ──────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-pink-500" />
            Visão Geral do Seu Perfil Relacional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            {resultBand.premiumDescription}
          </p>
          <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/20">
            <p className="text-sm leading-relaxed text-foreground">
              {resultBand.overviewAnalysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ── SEÇÃO 3: ÍNDICE E DIMENSÕES ─────────────────────────────────────── */}
      <Card className="border-pink-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-pink-500" />
            Índice e Análise por Dimensão Afetiva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`text-center p-6 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-10 border border-pink-500/20`}>
              <div className={`text-6xl font-black ${colorClass}`}>{compatibilityPercent}%</div>
              <div className="text-sm text-muted-foreground mt-2">Compatibilidade Geral</div>
            </div>
            <div className="md:col-span-2 flex flex-col justify-center gap-3">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{resultBand.name}</span>
                  <span className={`font-bold ${colorClass}`}>{compatibilityPercent}%</span>
                </div>
                <Progress value={compatibilityPercent} className="h-4" />
              </div>
              <p className="text-sm text-muted-foreground">{resultBand.compatibilityLevel} — {resultBand.name}</p>
            </div>
          </div>

          <Separator />

          {/* Category breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-pink-500" />
              Análise por Dimensão
            </h4>
            {categoryData.map((item) => {
              const config = categoryConfig[item.category];
              const level = item.percentage >= 70 ? 'Alto' : item.percentage >= 45 ? 'Moderado' : 'Em Desenvolvimento';
              const detail = resultBand.strengthsDetail?.[
                item.category === 'communication' ? 'Comunicação'
                : item.category === 'values' ? 'Valores'
                : item.category === 'emotional-support' ? 'Apoio Emocional'
                : item.category === 'lifestyle' ? 'Estilo de Vida'
                : 'Química'
              ];
              return (
                <div key={item.category} className="space-y-2 p-4 rounded-xl bg-muted/20 border border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{config.icon}</span>
                      <span className="font-medium text-sm">{categoryLabels[item.category]}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                        {level}
                      </span>
                    </div>
                    <span className={`font-bold text-sm ${config.color}`}>{item.percentage}%</span>
                  </div>
                  <Progress value={item.percentage} className="h-2" />
                  {detail && (
                    <p className="text-xs text-muted-foreground leading-relaxed pt-1">{detail}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* ── SEÇÃO 4: PONTOS FORTES ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            Pontos Fortes do Seu Perfil Afetivo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3">
            {resultBand.strengths.map((strength, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="shrink-0 h-7 w-7 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm text-foreground font-medium">{strength}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── SEÇÃO 5: DESAFIOS E RISCOS ──────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Desafios e Riscos Estruturais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="font-semibold text-emerald-700 mb-3 text-sm flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Pontos de Apoio
              </h4>
              <ul className="space-y-2 text-sm">
                {resultBand.strengths.slice(0, 3).map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                    <span className="text-muted-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <h4 className="font-semibold text-amber-700 mb-3 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" /> Riscos Identificados
              </h4>
              <ul className="space-y-2 text-sm">
                {resultBand.risks.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 shrink-0 mt-0.5">•</span>
                    <span className="text-muted-foreground">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Challenges detail */}
          {resultBand.challengesDetail && Object.entries(resultBand.challengesDetail).length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Análise Detalhada dos Desafios</h4>
              {Object.entries(resultBand.challengesDetail).map(([key, value]) => (
                <div key={key} className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                  <p className="font-medium text-sm text-rose-700 mb-1">{key}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── SEÇÃO 6: POTENCIAL DE LONGO PRAZO ──────────────────────────────── */}
      <Card className="border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-rose-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            Potencial de Longo Prazo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-background border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <span className="text-xs font-semibold uppercase text-blue-600">Curto Prazo</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{resultBand.shortTermForecast}</p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold uppercase text-amber-600">Médio Prazo</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{resultBand.mediumTermForecast}</p>
            </div>
            <div className="p-4 rounded-xl bg-background border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-semibold uppercase text-emerald-600">Longo Prazo</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{resultBand.longTermForecast}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── SEÇÃO 7: ANÁLISE PSICOLÓGICA ────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-pink-500" />
            Análise Psicológica da Dinâmica Afetiva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
              <h4 className="font-semibold text-sm text-violet-700 mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4" /> Perfil Psicológico do Casal
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{resultBand.psychologicalProfile}</p>
            </div>
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <h4 className="font-semibold text-sm text-blue-700 mb-2 flex items-center gap-2">
                <Shield className="h-4 w-4" /> Estabilidade Relacional
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{resultBand.stabilityAnalysis}</p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <h4 className="font-semibold text-sm text-emerald-700 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4" /> Maturidade Afetiva
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{resultBand.emotionalMaturity}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── SEÇÃO 8: PARCEIRO IDEAL ─────────────────────────────────────────── */}
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

      {/* ── SEÇÃO 9: RECOMENDAÇÕES ──────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-pink-500" />
            Recomendações Personalizadas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {resultBand.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                <span className="shrink-0 h-7 w-7 rounded-full bg-pink-500/20 text-pink-700 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-sm text-muted-foreground leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ── SEÇÃO 10: CONCLUSÃO ─────────────────────────────────────────────── */}
      <Card className={`border-pink-500/40 bg-gradient-to-br ${gradient} bg-opacity-5`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-pink-500" />
            Conclusão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{resultBand.conclusion}</p>
          <div className="mt-4 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-500/10 border border-pink-500/30">
              <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
              <span className={`text-lg font-bold ${colorClass}`}>{resultBand.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── RODAPÉ ──────────────────────────────────────────────────────────── */}
      <Card className="border-0 bg-muted/30">
        <CardContent className="p-4 text-center text-xs text-muted-foreground">
          <p className="font-medium mb-1">NEUROX — Relatório Premium de Compatibilidade Amorosa</p>
          <p>Este relatório é de caráter psicológico-informativo. Não substitui acompanhamento terapêutico profissional.</p>
          <p className="mt-1 font-mono">{reportId} • {formattedDate}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumCompatibilityReport;
