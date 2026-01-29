import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  iq: 'Relatório de QI Completo',
  emotional: 'Relatório Emocional Completo',
  personality: 'Relatório de Personalidade Completo',
  career: 'Relatório com Sugestões de Carreira',
  political: 'Relatório Político Completo',
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

const UnlockPremiumButton = ({ 
  attemptId, 
  testType, 
  onPaymentInitiated,
  className = ''
}: UnlockPremiumButtonProps) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { toast } = useToast();

  const handleUnlockClick = async () => {
    if (!attemptId) {
      console.error('[UNLOCK-BUTTON] No attemptId provided');
      return;
    }
    
    console.log('[UNLOCK-BUTTON] Starting checkout for attempt:', attemptId, 'testType:', testType);
    setIsUnlocking(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          attemptId, 
          purchaseType: 'premium_report', 
          paymentMethod: 'card' 
        }
      });

      if (error) {
        console.error('[UNLOCK-BUTTON] Checkout error:', error);
        throw error;
      }

      console.log('[UNLOCK-BUTTON] Checkout session created:', data?.sessionId);

      if (data?.url) {
        onPaymentInitiated?.();
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('[UNLOCK-BUTTON] Error:', error);
      toast({
        title: 'Erro ao iniciar pagamento',
        description: 'Tente novamente ou entre em contato com o suporte.',
        variant: 'destructive',
      });
    } finally {
      setIsUnlocking(false);
    }
  };

  const gradient = testTypeGradients[testType] || testTypeGradients.unknown;
  const label = testTypeLabels[testType] || testTypeLabels.unknown;

  return (
    <Button
      onClick={handleUnlockClick}
      disabled={isUnlocking}
      className={`w-full bg-gradient-to-r ${gradient} hover:opacity-90 ${className}`}
      size="lg"
    >
      {isUnlocking ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Processando...
        </>
      ) : (
        <>
          <Lock className="h-4 w-4 mr-2" />
          Desbloquear {label} - R$ {PREMIUM_PRICE.toFixed(2).replace('.', ',')}
        </>
      )}
    </Button>
  );
};

export default UnlockPremiumButton;
