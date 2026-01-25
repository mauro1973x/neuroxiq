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
      originalPrice: 'R$ 39,80',
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
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center">
            <Lock className="h-7 w-7 text-accent-foreground" />
          </div>
        </div>
        <CardTitle className="text-xl font-display">Desbloqueie Seu Potencial</CardTitle>
        <CardDescription>
          Acesse análises detalhadas e recomendações personalizadas
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground">
                  Melhor Valor
                </Badge>
              )}
              {product.popular && !product.isBest && (
                <Badge variant="secondary" className="absolute -top-2 left-1/2 -translate-x-1/2">
                  Mais Popular
                </Badge>
              )}

              <div className="text-center mb-4 pt-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.description}</p>
                <div className="mt-2">
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through mr-2">
                      {product.originalPrice}
                    </span>
                  )}
                  <span className="text-2xl font-bold text-primary">{product.price}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-4 text-sm">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Payment Tabs */}
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-9">
                  <TabsTrigger value="card" className="text-xs">
                    <CreditCard className="h-3 w-3 mr-1" />
                    Cartão
                  </TabsTrigger>
                  <TabsTrigger value="pix" className="text-xs">
                    <QrCode className="h-3 w-3 mr-1" />
                    PIX
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-2">
                  <Button
                    onClick={() => handleCheckout(product.id as 'premium_report' | 'certificate' | 'bundle', 'card')}
                    disabled={isLoading !== null}
                    className="w-full"
                    variant={product.isBest ? 'premium' : 'default'}
                    size="sm"
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
                <TabsContent value="pix" className="mt-2">
                  <Button
                    onClick={() => handleCheckout(product.id as 'premium_report' | 'certificate' | 'bundle', 'pix')}
                    disabled={isLoading !== null}
                    className="w-full"
                    variant="outline"
                    size="sm"
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
        <div className="text-center text-xs text-muted-foreground">
          <p>🔒 Pagamento seguro processado pelo Stripe</p>
          <p className="mt-1">Aceitamos todos os cartões de crédito e débito</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumPaywall;
