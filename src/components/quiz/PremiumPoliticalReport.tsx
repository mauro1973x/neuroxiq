import { Award, TrendingUp, AlertTriangle, Briefcase, Users, Scale, Globe, Shield, Heart, BookOpen, Target, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { PoliticalResultBand, calculateCategoryScores, spectrumLabels, categoryLabels } from '@/data/politicalQuestions';
import DownloadPdfButton from './DownloadPdfButton';

interface PremiumPoliticalReportProps {
  resultBand: PoliticalResultBand;
  totalScore: number;
  answers: (number | null)[];
  attemptId: string;
  userName?: string;
}

const PremiumPoliticalReport = ({
  resultBand,
  totalScore,
  answers,
  attemptId,
  userName = 'Participante'
}: PremiumPoliticalReportProps) => {
  const categoryScores = calculateCategoryScores(answers);

  const getSpectrumPosition = (score: number) => {
    return Math.min(100, Math.max(0, score));
  };

  const getSpectrumColor = (score: number) => {
    if (score < 30) return 'from-blue-500 to-cyan-500';
    if (score < 50) return 'from-green-500 to-emerald-500';
    if (score < 70) return 'from-yellow-500 to-orange-500';
    return 'from-orange-500 to-red-500';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'economic': return <TrendingUp className="h-5 w-5" />;
      case 'social': return <Users className="h-5 w-5" />;
      case 'authority': return <Shield className="h-5 w-5" />;
      case 'values': return <Globe className="h-5 w-5" />;
      default: return <Target className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24 md:pb-8">
      {/* Header with Desktop Download Button */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-xl">
            <Scale className="h-10 w-10 text-white" />
          </div>
        </div>
        <div>
          <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">
            Relatório Premium Completo
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold">
            Análise de Orientação Político-Ideológica
          </h1>
          <p className="text-muted-foreground mt-2">
            Preparado para {userName}
          </p>
          
          {/* Desktop Download Button */}
          <div className="mt-4 hidden md:flex justify-center">
            <DownloadPdfButton
              variant="inline"
              testType="political"
              testName="Orientação Política"
              score={totalScore}
              maxScore={100}
              resultBandName={resultBand.name}
              description={resultBand.premium_description}
              strengths={resultBand.strengths || []}
              challenges={resultBand.challenges || []}
              careerAreas={resultBand.compatible_careers || []}
              additionalInfo={{
                'Eixo Econômico': resultBand.economic_axis,
                'Eixo Social': resultBand.social_axis,
                'Eixo de Autoridade': resultBand.authority_axis,
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Result */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl md:text-3xl text-primary">
            {resultBand.name}
          </CardTitle>
          <div className="flex justify-center gap-4 mt-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Pontuação: {totalScore}/100
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Perfil #{resultBand.band_order} de 10
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg leading-relaxed text-center max-w-3xl mx-auto">
            {resultBand.premium_description}
          </p>

          {/* Axes Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="glass-card p-4 text-center">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-400" />
              <h4 className="font-semibold text-sm text-muted-foreground">Eixo Econômico</h4>
              <p className="font-medium">{resultBand.economic_axis}</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-400" />
              <h4 className="font-semibold text-sm text-muted-foreground">Eixo Social</h4>
              <p className="font-medium">{resultBand.social_axis}</p>
            </div>
            <div className="glass-card p-4 text-center">
              <Shield className="h-6 w-6 mx-auto mb-2 text-orange-400" />
              <h4 className="font-semibold text-sm text-muted-foreground">Eixo de Autoridade</h4>
              <p className="font-medium">{resultBand.authority_axis}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Political Spectrum Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Análise do Espectro Político
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {(Object.keys(categoryScores) as Array<keyof typeof categoryScores>).map((category) => {
            const score = categoryScores[category];
            const labels = spectrumLabels[category];
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    <span className="font-medium">{categoryLabels[category]}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{score}%</span>
                </div>
                <div className="relative">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>{labels.left}</span>
                    <span>{labels.right}</span>
                  </div>
                  <div className="h-4 bg-gradient-to-r from-blue-500 via-gray-400 to-red-500 rounded-full relative">
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-800 rounded-full shadow-lg transition-all"
                      style={{ left: `calc(${getSpectrumPosition(score)}% - 8px)` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Characteristics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Características do Seu Perfil
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {resultBand.characteristics.map((characteristic, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span>{characteristic}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <Award className="h-5 w-5" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {resultBand.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
              Desafios e Pontos de Atenção
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {resultBand.challenges.map((challenge, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Famous Figures */}
      {resultBand.famous_figures && resultBand.famous_figures.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Figuras Históricas Associadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {resultBand.famous_figures.map((figure, index) => (
                <Badge key={index} variant="secondary" className="text-sm px-4 py-2">
                  {figure}
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              * Estas figuras representam exemplos históricos de posições similares no espectro político. 
              A associação é puramente ilustrativa e não implica endosso.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Compatible Careers */}
      {resultBand.compatible_careers && resultBand.compatible_careers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Áreas de Atuação Compatíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Pessoas com seu perfil ideológico frequentemente se destacam nas seguintes áreas:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {resultBand.compatible_careers.map((career, index) => (
                <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{career}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Position */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Sua Posição no Espectro Geral
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative py-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Libertário de Esquerda</span>
              <span>Centro</span>
              <span>Autoritário de Direita</span>
            </div>
            <div className="h-6 bg-gradient-to-r from-blue-600 via-gray-400 to-red-600 rounded-full relative">
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg flex items-center justify-center"
                style={{ left: `calc(${totalScore}% - 12px)` }}
              >
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 text-lg px-6 py-2">
                Você está na posição {totalScore}% do espectro
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-amber-500 mb-2">Aviso de Uso Responsável</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Este teste tem caráter exclusivamente educacional e estatístico. O posicionamento 
                ideológico é um espectro complexo que não pode ser totalmente capturado por um 
                questionário. Os resultados refletem tendências baseadas nas respostas fornecidas, 
                não uma classificação definitiva. Respeite a diversidade de opiniões e evite 
                usar estes resultados para rotular ou discriminar pessoas. A NEUROX não endossa 
                nenhuma posição política específica.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground space-y-2 py-4">
        <Separator className="mb-4" />
        <p className="font-medium">NEUROX - Plataforma de Avaliações Psicométricas</p>
        <p>Relatório gerado em {new Date().toLocaleDateString('pt-BR')}</p>
        <p className="font-mono text-xs">ID: {attemptId}</p>
      </div>

      {/* Mobile Sticky Download Button */}
      <DownloadPdfButton
        variant="sticky"
        testType="political"
        testName="Orientação Política"
        score={totalScore}
        maxScore={100}
        resultBandName={resultBand.name}
        description={resultBand.premium_description}
        strengths={resultBand.strengths || []}
        challenges={resultBand.challenges || []}
        careerAreas={resultBand.compatible_careers || []}
        additionalInfo={{
          'Eixo Econômico': resultBand.economic_axis,
          'Eixo Social': resultBand.social_axis,
          'Eixo de Autoridade': resultBand.authority_axis,
        }}
      />
    </div>
  );
};

export default PremiumPoliticalReport;
