import { Award, Download, Brain, Target, Lightbulb, Users, Globe, AlertTriangle, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { IQResultBand } from '@/data/iqQuestions';

interface PremiumReportProps {
  score: number;
  totalQuestions: number;
  resultBand: IQResultBand;
  userName?: string;
  testDate?: string;
}

const PremiumReport = ({ score, totalQuestions, resultBand, userName = 'Usuário', testDate }: PremiumReportProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  // Estimate IQ based on score (simplified mapping)
  const estimatedIQ = Math.round(70 + (score / totalQuestions) * 60);
  const percentileRank = Math.round((score / totalQuestions) * 99);

  const getStrengths = () => {
    if (score >= 22) return ['Raciocínio abstrato avançado', 'Reconhecimento de padrões complexos', 'Pensamento analítico superior', 'Resolução criativa de problemas'];
    if (score >= 16) return ['Raciocínio lógico sólido', 'Boa capacidade analítica', 'Identificação de padrões', 'Aprendizado eficiente'];
    if (score >= 10) return ['Pensamento equilibrado', 'Raciocínio prático', 'Adaptabilidade cognitiva', 'Resolução de problemas cotidianos'];
    return ['Potencial de desenvolvimento', 'Pensamento concreto', 'Aprendizado gradual', 'Foco em tarefas práticas'];
  };

  const getChallenges = () => {
    if (score >= 22) return ['Manter-se estimulado em ambientes menos desafiadores', 'Comunicar ideias complexas de forma acessível'];
    if (score >= 16) return ['Problemas de altíssima complexidade abstrata', 'Situações com múltiplas variáveis simultâneas'];
    if (score >= 10) return ['Raciocínio abstrato muito complexo', 'Padrões não lineares', 'Problemas com muitas etapas'];
    return ['Problemas abstratos', 'Sequências numéricas complexas', 'Raciocínio espacial avançado'];
  };

  const getCareerAreas = () => {
    if (score >= 22) return ['Pesquisa científica', 'Desenvolvimento tecnológico', 'Medicina', 'Engenharia avançada', 'Empreendedorismo inovador'];
    if (score >= 16) return ['Engenharia', 'Análise de dados', 'Gestão empresarial', 'Ciências da computação', 'Direito'];
    if (score >= 10) return ['Administração', 'Educação', 'Saúde', 'Comércio', 'Serviços técnicos'];
    return ['Serviços práticos', 'Artesanato', 'Atividades manuais', 'Atendimento ao público', 'Logística'];
  };

  const getRecommendations = () => {
    if (score >= 22) return [
      'Busque desafios intelectuais de alto nível regularmente',
      'Considere projetos de pesquisa ou inovação',
      'Mentore outros e compartilhe conhecimento',
      'Explore áreas multidisciplinares',
    ];
    if (score >= 16) return [
      'Continue estimulando o raciocínio com quebra-cabeças',
      'Aprenda novos idiomas ou instrumentos',
      'Busque cursos de aprimoramento profissional',
      'Pratique exercícios de lógica regularmente',
    ];
    if (score >= 10) return [
      'Incorpore jogos de lógica na rotina diária',
      'Leia materiais diversos para expandir vocabulário',
      'Pratique exercícios de memória',
      'Busque atividades que desafiem o raciocínio',
    ];
    return [
      'Comece com exercícios cognitivos simples',
      'Pratique regularmente para desenvolver habilidades',
      'Foque em atividades práticas de aprendizado',
      'Considere acompanhamento educacional personalizado',
    ];
  };

  const formattedDate = testDate || new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation
    console.log('Download PDF');
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <Card className="glass-card overflow-hidden">
        <div className="bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-white/20 flex items-center justify-center">
                <Brain className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-display">RELATÓRIO PREMIUM DE INTELIGÊNCIA (QI)</h1>
                <p className="opacity-90">Avaliação Cognitiva Padronizada – Uso Educacional</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="print:hidden"
              onClick={handleDownloadPDF}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
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
              <span className="text-muted-foreground">ID do Relatório:</span>
              <span className="ml-2 font-mono text-xs">NRX-{Date.now().toString(36).toUpperCase()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Introdução Institucional – NEUROX
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <p className="text-muted-foreground">
            A <strong>NEUROX</strong> é uma plataforma educacional especializada em avaliações psicométricas padronizadas.
            Nosso compromisso é fornecer ferramentas de autoconhecimento baseadas em metodologias científicas reconhecidas,
            com foco em educação e desenvolvimento pessoal.
          </p>
          <p className="text-muted-foreground">
            Este relatório apresenta uma análise estatística e comparativa do seu desempenho cognitivo,
            oferecendo insights valiosos para seu crescimento pessoal e profissional.
          </p>
        </CardContent>
      </Card>

      {/* What is IQ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            O Que é QI e O Que Este Teste Avalia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            O <strong>Quociente de Inteligência (QI)</strong> é uma medida padronizada que avalia capacidades cognitivas
            em comparação com a população geral. Este teste mede especificamente:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🧩', title: 'Raciocínio Lógico', desc: 'Capacidade de resolver problemas sequenciais' },
              { icon: '🔍', title: 'Reconhecimento de Padrões', desc: 'Identificação de regularidades' },
              { icon: '📊', title: 'Capacidade Analítica', desc: 'Decomposição de problemas complexos' },
              { icon: '💭', title: 'Processamento Abstrato', desc: 'Manipulação de conceitos não concretos' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 rounded-lg bg-muted/50 text-center">
                <span className="text-2xl">{item.icon}</span>
                <h4 className="font-medium text-sm mt-2">{item.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Result */}
      <Card className="border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Resultado Individual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
              <div className="text-4xl font-bold text-primary">{score}/{totalQuestions}</div>
              <div className="text-sm text-muted-foreground mt-1">Pontuação Bruta</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
              <div className="text-4xl font-bold text-accent-foreground">~{estimatedIQ}</div>
              <div className="text-sm text-muted-foreground mt-1">QI Estimado</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
              <div className="text-4xl font-bold text-success">Top {100 - percentileRank}%</div>
              <div className="text-sm text-muted-foreground mt-1">Percentil Populacional</div>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Sua Classificação Cognitiva</div>
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/30">
              <Award className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-primary">{resultBand.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-accent" />
            Análise Premium Detalhada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {resultBand.premiumDescription}
          </p>

          {/* Strengths */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-success" />
              Pontos Fortes Identificados
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getStrengths().map((strength, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded bg-success/10 text-sm">
                  <span className="text-success">✓</span>
                  {strength}
                </div>
              ))}
            </div>
          </div>

          {/* Challenges */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-warning" />
              Áreas para Desenvolvimento
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getChallenges().map((challenge, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded bg-warning/10 text-sm">
                  <span className="text-warning">→</span>
                  {challenge}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-primary" />
              Recomendações Personalizadas
            </h4>
            <ul className="space-y-2">
              {getRecommendations().map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary font-bold">{idx + 1}.</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Career Areas */}
          <div>
            <h4 className="font-semibold flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-primary" />
              Áreas Profissionais Compatíveis
            </h4>
            <div className="flex flex-wrap gap-2">
              {getCareerAreas().map((area, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* International Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Comparação Internacional
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Com base em estudos estatísticos populacionais, seu desempenho posiciona-se no <strong>percentil {percentileRank}</strong>,
            o que significa que estatisticamente você demonstrou capacidade cognitiva superior a aproximadamente {percentileRank}%
            da população avaliada em testes similares. Esta é uma análise comparativa e educacional,
            não representando diagnóstico clínico ou determinação absoluta de capacidades.
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
            Não constitui diagnóstico clínico, psicológico ou médico.
            Para avaliações clínicas oficiais, procure um profissional habilitado
            (psicólogo ou neuropsicólogo registrado no conselho de classe).
          </p>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-xs text-muted-foreground pt-4 border-t">
        <p>Relatório gerado automaticamente pela plataforma NEUROX.</p>
        <p className="mt-1">Data de geração: {formattedDate}</p>
      </div>
    </div>
  );
};

export default PremiumReport;
