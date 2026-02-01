import { useState } from 'react';
import { Loader2, Sparkles, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { buildCheckoutRedirectUrl, isEmbeddedInIframe, PurchaseType } from '@/lib/checkout';

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

type ButtonState = 'idle' | 'redirecting' | 'error';

const UnlockPremiumButton = ({ 
  attemptId, 
  testType, 
  onPaymentInitiated,
  className = ''
}: UnlockPremiumButtonProps) => {
  const [buttonState, setButtonState] = useState<ButtonState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const gradient = testTypeGradients[testType] || testTypeGradients.unknown;
  const label = testTypeLabels[testType] || testTypeLabels.unknown;

  // Build the server-side redirect URL
  const redirectUrl = buildCheckoutRedirectUrl({
    attemptId,
    purchaseType: 'premium_report' as PurchaseType
  });

  // Handle click - navigate using server-side redirect
  const handleClick = (e: React.MouseEvent) => {
    if (!attemptId) {
      e.preventDefault();
      console.error('[UNLOCK-BUTTON] No attemptId provided');
      setErrorMessage('ID do teste não encontrado.');
      setButtonState('error');
      return;
    }

    console.log('[UNLOCK-BUTTON] Initiating checkout redirect for attempt:', attemptId, 'testType:', testType);
    setButtonState('redirecting');
    onPaymentInitiated?.();
    
    // The navigation happens via the anchor's href
    // We just update the UI state here
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
        {/* Fallback link in case redirect is slow */}
        <a
          href={redirectUrl}
          target="_top"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary underline mt-3"
        >
          <ExternalLink className="h-3 w-3" />
          Clique aqui se não for redirecionado
        </a>
      </div>
    );
  }

  // Main button - using anchor tag for reliable navigation
  return (
    <a
      href={redirectUrl}
      target="_top"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`flex items-center justify-center w-full min-h-[52px] md:min-h-[48px] text-base md:text-base font-semibold bg-gradient-to-r ${gradient} hover:opacity-90 active:scale-[0.98] transition-all shadow-lg rounded-lg text-white px-4 py-3 no-underline ${className}`}
    >
      <Sparkles className="h-5 w-5 mr-2" />
      <span className="flex flex-col md:flex-row md:items-center md:gap-1.5">
        <span>Desbloquear {label}</span>
        <span className="text-sm md:text-base opacity-90">R$ {PREMIUM_PRICE.toFixed(2).replace('.', ',')}</span>
      </span>
    </a>
  );
};

export default UnlockPremiumButton;
