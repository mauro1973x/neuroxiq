import { useState } from 'react';
import { Award, Lock, CreditCard, QrCode, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PremiumPaywallProps {
  attemptId: string;
  onPaymentSuccess?: () => void;
}

const PremiumPaywall = ({ attemptId, onPaymentSuccess }: PremiumPaywallProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleCheckout = async (purchaseType: 'premium_report' | 'certificate' | 'bundle', paymentMethod: 'card' | 'pix' = 'card') => {
    setIsLoading(`${purchaseType}-${paymentMethod}`);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { attemptId, purchaseType, paymentMethod }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Erro ao iniciar pagamento',
        description: 'Tente novamente ou entre em contato com o suporte.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(null);
    }
  };

  const products = [
    {
      id: 'premium_report',
      name: 'Relatório Premium',
      price: 'R$ 19,90',
      description: 'Análise cognitiva completa',
      features: [
        'Interpretação detalhada do seu resultado',
        'Comparativo com a população brasileira',
        'Pontos fortes e áreas de desenvolvimento',
        'Recomendações personalizadas',
        'Análise por categoria cognitiva',
      ],
      popular: true,
    },
    {
      id: 'certificate',
      name: 'Certificado',
      price: 'R$ 19,90',
      description: 'Documento personalizado',
      features: [
        'Certificado em PDF de alta qualidade',
        'Seu nome completo',
        'Classificação cognitiva',
        'Data de emissão',
        'Código de verificação',
      ],
      popular: false,
    },
    {
      id: 'bundle',
      name: 'Pacote Completo',
      price: 'R$ 29,90',
      description: 'Relatório + Certificado',
      features: [
        'Tudo do Relatório Premium',
        'Tudo do Certificado',
        'Economia de R$ 9,90',
        'Acesso vitalício',
      ],
      popular: false,
      isBest: true,
    },
  ];

  return (
    <Card className="border-2 border-accent/50 bg-gradient-to-br from-accent/5 to-background overflow-hidden">
      <CardHeader className="text-center pb-4 px-4 md:px-6">
        <div className="flex justify-center mb-3">
          <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
            <Lock className="h-6 w-6 md:h-7 md:w-7 text-accent-foreground" />
          </div>
        </div>
        <CardTitle className="text-lg md:text-xl font-display">Desbloqueie Seu Potencial</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Acesse análises detalhadas e recomendações personalizadas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 md:space-y-6 px-4 md:px-6">
        {/* Products - Stack on mobile, grid on desktop */}
        <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                product.isBest
                  ? 'border-accent bg-accent/10 shadow-lg'
                  : product.popular
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border bg-card'
              }`}
            >
              {product.isBest && (
                <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs">
                  Melhor Valor
                </Badge>
              )}
              {product.popular && !product.isBest && (
                <Badge variant="secondary" className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-xs">
                  Mais Popular
                </Badge>
              )}

              <div className="text-center mb-4 pt-2">
                <h3 className="font-semibold text-base md:text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="mt-2">
                  <span className="text-2xl md:text-2xl font-bold text-primary">{product.price}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-4 text-sm">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span className="text-muted-foreground leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Payment Tabs */}
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-10">
                  <TabsTrigger value="card" className="text-sm">
                    <CreditCard className="h-4 w-4 mr-1.5" />
                    Cartão
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="text-sm">
                    <QrCode className="h-4 w-4 mr-1.5" />
                    PIX
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-3">
                  <Button
                    onClick={() => handleCheckout(product.id as 'premium_report' | 'certificate' | 'bundle', 'card')}
                    disabled={isLoading !== null}
                    className="w-full min-h-[48px] text-base"
                    variant={product.isBest ? 'premium' : 'default'}
                  >
                    {isLoading === `${product.id}-card` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Pagar com Cartão
                      </>
                    )}
                  </Button>
                </TabsContent>
                <TabsContent value="pix" className="mt-3">
                  <Button
                    onClick={() => handleCheckout(product.id as 'premium_report' | 'certificate' | 'bundle', 'pix')}
                    disabled={isLoading !== null}
                    className="w-full min-h-[48px] text-base"
                    variant="outline"
                  >
                    {isLoading === `${product.id}-pix` ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <QrCode className="h-4 w-4" />
                        Pagar com PIX
                      </>
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs md:text-sm text-muted-foreground space-y-1">
          <p>🔒 Pagamento seguro processado pelo Stripe</p>
          <p>Aceitamos todos os cartões de crédito e débito</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumPaywall;
