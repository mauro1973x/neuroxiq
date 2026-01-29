import { CheckCircle, Brain, Heart, Compass, Scale, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const Precos = () => {
  const tests = [
    {
      id: 'iq',
      name: 'Teste de QI',
      description: 'Avalie sua capacidade cognitiva com nosso teste cientificamente validado',
      icon: Brain,
      color: 'from-blue-500 to-indigo-600',
      route: '/teste-qi',
      features: [
        'Teste gratuito com 20 questões',
        'Resultado básico imediato',
        'Classificação de QI estimado',
      ],
      premiumFeatures: [
        'Análise cognitiva detalhada',
        'Comparativo com a população',
        'Recomendações personalizadas',
        'Certificado digital',
      ],
    },
    {
      id: 'emotional',
      name: 'Inteligência Emocional',
      description: 'Descubra seu nível de inteligência emocional e como desenvolvê-la',
      icon: Heart,
      color: 'from-rose-500 to-red-600',
      route: '/teste-emocional',
      features: [
        'Teste gratuito completo',
        'Resultado básico imediato',
        'Pontuação por dimensão',
      ],
      premiumFeatures: [
        'Análise aprofundada',
        'Estratégias de desenvolvimento',
        'Relatório detalhado',
        'Certificado digital',
      ],
    },
    {
      id: 'personality',
      name: 'Teste de Personalidade',
      description: 'Conheça seus traços de personalidade e como eles influenciam sua vida',
      icon: Compass,
      color: 'from-purple-500 to-pink-600',
      route: '/teste-personalidade',
      features: [
        'Teste gratuito completo',
        'Resultado básico imediato',
        'Tipo de personalidade',
      ],
      premiumFeatures: [
        'Análise de traços detalhada',
        'Compatibilidades',
        'Carreiras recomendadas',
        'Certificado digital',
      ],
    },
    {
      id: 'political',
      name: 'Orientação Política',
      description: 'Descubra sua posição no espectro político com base em suas crenças',
      icon: Scale,
      color: 'from-red-500 to-orange-600',
      route: '/teste-politico',
      features: [
        'Teste gratuito completo',
        'Resultado básico imediato',
        'Posição no espectro',
      ],
      premiumFeatures: [
        'Análise detalhada por eixo',
        'Comparativo histórico',
        'Figuras políticas similares',
        'Certificado digital',
      ],
    },
    {
      id: 'career',
      name: 'Orientação de Carreira',
      description: 'Encontre a carreira ideal com base em suas habilidades e interesses',
      icon: Briefcase,
      color: 'from-green-500 to-teal-600',
      route: '/teste-carreira',
      features: [
        'Teste gratuito completo',
        'Resultado básico imediato',
        'Áreas recomendadas',
      ],
      premiumFeatures: [
        'Plano de carreira',
        'Análise de competências',
        'Sugestões de cursos',
        'Certificado digital',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Nossos <span className="text-primary">Preços</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todos os nossos testes são <strong>gratuitos</strong>. Você só paga se quiser 
            desbloquear o relatório premium com análises detalhadas e certificado.
          </p>
        </div>

        {/* Pricing Highlight */}
        <div className="flex justify-center mb-12">
          <Card className="border-2 border-primary bg-primary/5 max-w-md w-full">
            <CardHeader className="text-center">
              <Badge className="w-fit mx-auto mb-2">Preço Único</Badge>
              <CardTitle className="text-3xl font-display">
                R$ <span className="text-5xl font-bold text-primary">19,90</span>
              </CardTitle>
              <CardDescription className="text-base">
                Por relatório premium + certificado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Relatório detalhado completo</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Certificado digital personalizado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Acesso vitalício ao resultado</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Pagamento único, sem assinatura</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Tests Grid */}
        <h2 className="text-2xl font-display font-semibold text-center mb-8">
          Escolha seu teste
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const IconComponent = test.icon;
            return (
              <Card key={test.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${test.color}`} />
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${test.color} flex items-center justify-center`}>
                      <IconComponent className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{test.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{test.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      ✓ Gratuito:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {test.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-primary mb-2">
                      ⭐ Premium (R$ 19,90):
                    </p>
                    <ul className="space-y-1 text-sm">
                      {test.premiumFeatures.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button asChild className="w-full mt-4">
                    <Link to={test.route}>Iniciar Teste Grátis</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-display font-semibold text-center mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Os testes são realmente gratuitos?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Sim! Todos os testes são 100% gratuitos. Você recebe um resultado básico 
                  imediatamente após completar. O pagamento é opcional, apenas se quiser 
                  desbloquear o relatório premium com análises detalhadas.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Como funciona o pagamento?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Aceitamos cartão de crédito e PIX. O pagamento é processado de forma 
                  segura pelo Stripe. É um pagamento único, sem assinatura ou renovação automática.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Posso refazer os testes?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Sim, você pode refazer os testes quantas vezes quiser. Cada tentativa 
                  gera um novo resultado. O relatório premium é válido por tentativa.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Precos;
