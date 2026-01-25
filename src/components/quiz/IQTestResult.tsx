import { Link } from "react-router-dom";
import { Award, Lock, ArrowRight, Brain, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { IQResultBand } from "@/data/iqQuestions";

interface IQTestResultProps {
  score: number;
  totalQuestions: number;
  resultBand: IQResultBand;
  showPremium: boolean;
}

const IQTestResult = ({ score, totalQuestions, resultBand, showPremium }: IQTestResultProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Score Card */}
      <Card className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-6 text-center">
          <Brain className="h-16 w-16 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl font-bold mb-2">Resultado do Teste de QI</h2>
          <p className="opacity-90">Avaliação Cognitiva Completa</p>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Score Display */}
          <div className="text-center py-6">
            <div className="text-6xl font-bold text-primary mb-2">
              {score}/{totalQuestions}
            </div>
            <div className="text-lg text-muted-foreground">Pontuação: {percentage}%</div>
            <Progress value={percentage} className="mt-4 h-3" />
          </div>

          {/* Classification */}
          <div className="text-center py-4 border-y border-border">
            <div className="text-sm text-muted-foreground mb-2">Sua Classificação</div>
            <div className="flex items-center justify-center gap-2">
              <Star className="h-6 w-6 text-accent" />
              <span className="text-2xl font-bold text-foreground">{resultBand.name}</span>
              <Star className="h-6 w-6 text-accent" />
            </div>
          </div>

          {/* Free Result */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Análise Básica
            </h3>
            <p className="text-muted-foreground leading-relaxed">{resultBand.freeDescription}</p>
          </div>

          {/* Premium Section */}
          {!showPremium ? (
            <Card className="border-2 border-accent/50 bg-accent/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-accent" />
                  Relatório Premium Bloqueado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Desbloqueie sua análise completa com interpretações detalhadas, recomendações personalizadas e
                  comparativo com a população.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="premium" className="flex-1">
                    <Award className="h-4 w-4" />
                    Desbloquear por R$ 19,90
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-accent" />
                Análise Premium
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {resultBand.premiumDescription}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/testes">
          <Button variant="outline" size="lg">
            Ver Outros Testes
          </Button>
        </Link>
        <Link to="/dashboard">
          <Button size="lg">
            Ir para Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center text-muted-foreground max-w-md mx-auto">
        Este é um teste cognitivo de caráter informativo e educacional. Os resultados não constituem diagnóstico clínico
        e não substituem avaliação profissional por psicólogo ou neuropsicólogo.
      </p>
    </div>
  );
};

export default IQTestResult;
