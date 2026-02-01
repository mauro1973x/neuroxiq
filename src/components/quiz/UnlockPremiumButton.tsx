import { useState, useEffect, useRef } from 'react';
import { Loader2, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

type TestType = 'iq' | 'emotional' | 'personality' | 'career' | 'political' | 'unknown';

interface UnlockPremiumButtonProps {
  attemptId: string;
  testType: TestType;
  onPaymentInitiated?: () => void;
  className?: string;
}

const testTypeLabels: Record<TestType, string> = {
  iq: 'Relatório de QI',
  emotional: 'Relatório Emocional',
  personality: 'Relatório de Personalidade',
  career: 'Relatório de Carreira',
  political: 'Relatório Político',
  unknown: 'Relatório Completo'
};

const testTypeGradients: Record<TestType, string> = {
  iq: 'from-primary to-blue-600',
  emotional: 'from-rose-500 to-red-600',
  personality: 'from-violet-500 to-purple-600',
  career: 'from-amber-500 to-orange-600',
  political: 'from-red-500 to-orange-600',
  unknown: 'from-primary to-blue-600'
};

const PREMIUM_PRICE = 19.90;
const TIMEOUT_MS = 15000; // 15 seconds timeout

type ButtonState = 'idle' | 'loading' | 'error';

const UnlockPremiumButton = ({ 
  attemptId, 
  testType, 
  onPaymentInitiated,
  className = ''
}: UnlockPremiumButtonProps) => {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  const gradient = testTypeGradients[testType] || testTypeGradients.unknown;
  const label = testTypeLabels[testType] || testTypeLabels.unknown;

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = async () => {
    // Validate attemptId
    if (!attemptId) {
      console.error('[UNLOCK-BUTTON] No attemptId provided');
      setErrorMessage('ID do teste não encontrado.');
      setButtonState('error');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "ID do teste não encontrado."
      });
      return;
    }

    console.log('[UNLOCK-BUTTON] Creating Stripe checkout session...', { attemptId, testType });
    setButtonState('loading');
    setErrorMessage(null);
    onPaymentInitiated?.();

    // Set timeout to prevent infinite loading
    timeoutRef.current = setTimeout(() => {
      console.error('[UNLOCK-BUTTON] Timeout: checkout session took too long');
      setButtonState('error');
      setErrorMessage('Não foi possível iniciar o pagamento. Tente novamente.');
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
          purchaseType: 'premium_report',
          paymentMethod: 'card'
        }
      });

      // Clear timeout since we got a response
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Handle authentication errors
      if (error) {
        console.error('[UNLOCK-BUTTON] Edge function error:', error);
        
        // Check for auth errors (401/403)
        if (error.message?.includes('401') || error.message?.includes('403') || 
            error.message?.includes('not authenticated') || error.message?.includes('Unauthorized')) {
          setButtonState('error');
          setErrorMessage('Faça login para continuar');
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
        console.error('[UNLOCK-BUTTON] No checkout URL in response:', data);
        throw new Error('URL de checkout não retornada pelo servidor');
      }

      console.log('[UNLOCK-BUTTON] Checkout URL received:', data.url.substring(0, 80) + '...');
      console.log('[UNLOCK-BUTTON] Redirecting...');

      // Redirect using window.location.assign (same tab, no popup blocker issues)
      window.location.assign(data.url);

    } catch (err) {
      // Clear timeout on error
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[UNLOCK-BUTTON] Error creating checkout session:', err);
      
      setButtonState('error');
      setErrorMessage(message);
      toast({
        variant: "destructive",
        title: "Erro ao iniciar pagamento",
        description: message
      });
    }
  };

  const handleRetry = () => {
    setButtonState('idle');
    setErrorMessage(null);
  };

  // Show error state with retry button
  if (buttonState === 'error') {
    return (
      <div className="space-y-3">
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">
            {errorMessage || 'Erro ao processar pagamento.'}
          </AlertDescription>
        </Alert>
        <Button
          onClick={handleRetry}
          variant="outline"
          className="w-full"
          size="lg"
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Show loading state
  if (buttonState === 'loading') {
    return (
      <div className="w-full p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Iniciando pagamento...</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Aguarde, você será direcionado para o checkout seguro.
        </p>
      </div>
    );
  }

  // Main button
  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-full min-h-[52px] md:min-h-[48px] text-base md:text-base font-semibold bg-gradient-to-r ${gradient} hover:opacity-90 active:scale-[0.98] transition-all shadow-lg rounded-lg text-white px-4 py-3 cursor-pointer ${className}`}
    >
      <Sparkles className="h-5 w-5 mr-2" />
      <span className="flex flex-col md:flex-row md:items-center md:gap-1.5">
        <span>Desbloquear {label}</span>
        <span className="text-sm md:text-base opacity-90">R$ {PREMIUM_PRICE.toFixed(2).replace('.', ',')}</span>
      </span>
    </button>
  );
};

export default UnlockPremiumButton;
