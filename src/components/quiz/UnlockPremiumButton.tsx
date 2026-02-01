import { useState } from 'react';
import { Loader2, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

type ButtonState = 'idle' | 'loading' | 'redirecting' | 'error';

const UnlockPremiumButton = ({ 
  attemptId, 
  testType, 
  onPaymentInitiated,
  className = ''
}: UnlockPremiumButtonProps) => {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUnlockClick = async () => {
    if (!attemptId) {
      console.error('[UNLOCK-BUTTON] No attemptId provided');
      setErrorMessage('ID do teste não encontrado.');
      setButtonState('error');
      return;
    }
    
    console.log('[UNLOCK-BUTTON] Starting checkout for attempt:', attemptId, 'testType:', testType);
    setButtonState('loading');
    setErrorMessage(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          attemptId, 
          purchaseType: 'premium_report'
        }
      });

      if (error) {
        console.error('[UNLOCK-BUTTON] Checkout error:', error);
        throw new Error(error.message || 'Erro ao criar sessão de pagamento');
      }

      // Validate response has URL
      if (!data?.url) {
        console.error('[UNLOCK-BUTTON] No checkout URL in response:', data);
        throw new Error('URL de checkout não retornada pelo servidor');
      }

      console.log('[UNLOCK-BUTTON] Checkout session created:', data?.sessionId);

      // Show toast if PIX is unavailable
      if (data?.pix_available === false) {
        toast({
          title: 'PIX indisponível',
          description: 'PIX indisponível no momento. Use cartão.',
          variant: 'default',
        });
      }

      // Change state to redirecting before navigation
      setButtonState('redirecting');
      onPaymentInitiated?.();

      // Use window.location.assign for external URL redirect (NOT router.push)
      // Small delay to ensure UI feedback is visible
      setTimeout(() => {
        window.location.assign(data.url);
      }, 100);

    } catch (error) {
      console.error('[UNLOCK-BUTTON] Error:', error);
      const message = error instanceof Error ? error.message : 'Erro desconhecido';
      setErrorMessage(message);
      setButtonState('error');
      
      toast({
        title: 'Erro ao iniciar pagamento',
        description: 'Tente novamente ou entre em contato com o suporte.',
        variant: 'destructive',
      });
    }
  };

  const handleRetry = () => {
    setButtonState('idle');
    setErrorMessage(null);
  };

  const gradient = testTypeGradients[testType] || testTypeGradients.unknown;
  const label = testTypeLabels[testType] || testTypeLabels.unknown;

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
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  // Show redirecting state
  if (buttonState === 'redirecting') {
    return (
      <div className="w-full p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
        <div className="flex items-center justify-center gap-2 text-primary">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="font-medium">Redirecionando para pagamento...</span>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Aguarde, você será direcionado para o checkout seguro.
        </p>
      </div>
    );
  }

  return (
    <Button
      onClick={handleUnlockClick}
      disabled={buttonState === 'loading'}
      className={`w-full min-h-[52px] md:min-h-[48px] text-base md:text-base font-semibold bg-gradient-to-r ${gradient} hover:opacity-90 active:scale-[0.98] transition-all shadow-lg ${className}`}
      size="lg"
    >
      {buttonState === 'loading' ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Processando...
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 mr-2" />
          <span className="flex flex-col md:flex-row md:items-center md:gap-1.5">
            <span>Desbloquear {label}</span>
            <span className="text-sm md:text-base opacity-90">R$ {PREMIUM_PRICE.toFixed(2).replace('.', ',')}</span>
          </span>
        </>
      )}
    </Button>
  );
};

export default UnlockPremiumButton;
