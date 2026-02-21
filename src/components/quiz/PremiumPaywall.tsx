import { useState, useEffect, useRef } from 'react';
import { Award, Lock, CreditCard, QrCode, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { PurchaseType } from '@/lib/checkout';

interface PremiumPaywallProps {
  attemptId: string;
  onPaymentSuccess?: () => void;
}

type ButtonState = 'idle' | 'loading' | 'error';

interface ProductState {
  state: ButtonState;
  error: string | null;
}

const TIMEOUT_MS = 15000; // 15 seconds timeout

const PremiumPaywall = ({ attemptId, onPaymentSuccess }: PremiumPaywallProps) => {
  const [productStates, setProductStates] = useState<Record<string, ProductState>>({});
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const navigate = useNavigate();

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const getProductState = (productId: string): ProductState => {
    return productStates[productId] || { state: 'idle', error: null };
  };

  const updateProductState = (productId: string, updates: Partial<ProductState>) => {
    setProductStates(prev => ({
      ...prev,
      [productId]: { ...getProductState(productId), ...updates }
    }));
  };

  const clearProductTimeout = (productId: string) => {
    if (timeoutRefs.current[productId]) {
      clearTimeout(timeoutRefs.current[productId]);
      delete timeoutRefs.current[productId];
    }
  };

  const handleClick = async (purchaseType: PurchaseType) => {
    const productKey = purchaseType;
    
    // Validate attemptId
    if (!attemptId) {
      console.error('[PAYWALL] No attemptId provided');
      updateProductState(productKey, { state: 'error', error: 'ID do teste não encontrado.' });
      toast({
        variant: "destructive",
        title: "Erro",
        description: "ID do teste não encontrado."
      });
      return;
    }
    
    console.log('[PAYWALL] Creating Stripe checkout session...', { purchaseType, attemptId });
    updateProductState(productKey, { state: 'loading', error: null });

    // Set timeout to prevent infinite loading
    timeoutRefs.current[productKey] = setTimeout(() => {
      console.error('[PAYWALL] Timeout: checkout session took too long');
      updateProductState(productKey, { 
        state: 'error', 
        error: 'Não foi possível iniciar o pagamento. Tente novamente.' 
      });
      toast({
        variant: "destructive",
        title: "Tempo esgotado",
        description: "Não foi possível iniciar o pagamento. Tente novamente."
      });
    }, TIMEOUT_MS);

    try {
      // Call edge function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          attemptId, 
          purchaseType,
          paymentMethod: 'card'
        }
      });

      // Clear timeout since we got a response
      clearProductTimeout(productKey);

      // Handle authentication errors
      if (error) {
        console.error('[PAYWALL] Edge function error:', error);
        
        // Check for auth errors (401/403)
        if (error.message?.includes('401') || error.message?.includes('403') || 
            error.message?.includes('not authenticated') || error.message?.includes('Unauthorized')) {
          updateProductState(productKey, { state: 'error', error: 'Faça login para continuar' });
          toast({
            variant: "destructive",
            title: "Autenticação necessária",
            description: "Faça login para continuar"
          });
          navigate('/login');
          return;
        }

        throw new Error(error.message || 'Erro ao criar sessão de pagamento');
      }

      // Validate response has checkout URL
      if (!data?.url) {
        console.error('[PAYWALL] No checkout URL in response:', data);
        throw new Error('URL de checkout não retornada pelo servidor');
      }

      console.log('[PAYWALL] Checkout URL received:', data.url.substring(0, 80) + '...');
      console.log('[PAYWALL] Redirecting...');

      // Redirect using window.location.assign (same tab, no popup blocker issues)
      window.location.assign(data.url);

    } catch (err) {
      // Clear timeout on error
      clearProductTimeout(productKey);

      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[PAYWALL] Error creating checkout session:', err);
      
      updateProductState(productKey, { state: 'error', error: message });
      toast({
        variant: "destructive",
        title: "Erro ao iniciar pagamento",
        description: message
      });
    }
  };

  const handleRetry = (productKey: string) => {
    updateProductState(productKey, { state: 'idle', error: null });
  };

  const products = [
    {
      id: 'premium_report' as PurchaseType,
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
      id: 'certificate' as PurchaseType,
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
      id: 'bundle' as PurchaseType,
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

  const renderPaymentButton = (product: typeof products[0]) => {
    const productState = getProductState(product.id);
    const isAnyLoading = Object.values(productStates).some(s => s.state === 'loading');

    // Show error state
    if (productState.state === 'error') {
      return (
        <div className="space-y-2">
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-3 w-3" />
            <AlertDescription className="ml-2 text-xs">
              {productState.error}
            </AlertDescription>
          </Alert>
          <Button
            onClick={() => handleRetry(product.id)}
            variant="outline"
            className="w-full min-h-[48px]"
          >
            Tentar novamente
          </Button>
        </div>
      );
    }

    // Show loading state
    if (productState.state === 'loading') {
      return (
        <div className="w-full p-3 rounded-lg bg-primary/10 border border-primary/30 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Iniciando pagamento...</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Aguarde, você será redirecionado...
          </p>
        </div>
      );
    }

    // Normal button
    return (
      <a
        href="https://buy.stripe.com/eVq14p2C01U93vh1ML6J201"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center justify-center gap-2 w-full min-h-[48px] text-base font-medium rounded-lg px-4 py-2 transition-all active:scale-[0.98] cursor-pointer no-underline ${
          product.isBest 
            ? 'bg-gradient-to-r from-accent to-accent/80 text-accent-foreground hover:opacity-90' 
            : 'bg-primary text-primary-foreground hover:opacity-90'
        }`}
      >
        <CreditCard className="h-4 w-4" />
        Pagar Agora
      </a>
    );
  };

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

              {/* Payment button */}
              {renderPaymentButton(product)}
              
              <p className="text-xs text-center text-muted-foreground mt-2">
                Cartão ou PIX disponíveis no checkout
              </p>
            </div>
          ))}
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs md:text-sm text-muted-foreground space-y-1">
          <p>🔒 Pagamento seguro processado pelo Stripe</p>
          <p>Aceitamos todos os cartões de crédito, débito e PIX</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PremiumPaywall;
