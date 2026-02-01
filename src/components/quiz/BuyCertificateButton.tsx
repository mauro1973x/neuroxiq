import { useState } from 'react';
import { Loader2, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import certificatePreview from '@/assets/certificate-preview.png';

interface BuyCertificateButtonProps {
  attemptId: string;
  testName: string;
  hasCertificate: boolean;
  onPaymentInitiated?: () => void;
  className?: string;
}

const CERTIFICATE_PRICE = 19.90;

const BuyCertificateButton = ({ 
  attemptId, 
  testName,
  hasCertificate,
  onPaymentInitiated,
  className = ''
}: BuyCertificateButtonProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const { toast } = useToast();

  const handlePurchaseClick = async () => {
    if (!attemptId) {
      console.error('[BUY-CERTIFICATE] No attemptId provided');
      return;
    }
    
    console.log('[BUY-CERTIFICATE] Starting checkout for attempt:', attemptId);
    setIsPurchasing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          attemptId, 
          purchaseType: 'certificate', 
          paymentMethod: 'card' 
        }
      });

      if (error) {
        console.error('[BUY-CERTIFICATE] Checkout error:', error);
        throw error;
      }

      console.log('[BUY-CERTIFICATE] Checkout session created:', data?.sessionId);

      if (data?.url) {
        console.log('[BUY-CERTIFICATE] Redirecting to checkout (same tab):', data.url);
        onPaymentInitiated?.();
        // Use same tab redirect to avoid popup blockers and ensure proper return flow
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('[BUY-CERTIFICATE] Error:', error);
      toast({
        title: 'Erro ao iniciar pagamento',
        description: 'Tente novamente ou entre em contato com o suporte.',
        variant: 'destructive',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  if (hasCertificate) {
    return (
      <Card className={`border-2 border-amber-500/50 bg-amber-500/5 ${className}`}>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Award className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-foreground mb-1">
                🎉 Certificado Desbloqueado!
              </h3>
              <p className="text-sm text-muted-foreground">
                Seu certificado oficial de {testName} está disponível.
              </p>
            </div>
            <Button
              variant="hero"
              className="w-full sm:w-auto min-h-[48px]"
              onClick={() => window.location.href = `/certificado/${attemptId}`}
            >
              <Award className="h-5 w-5 mr-2" />
              Ver Certificado
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 border-amber-500/30 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {/* Certificate thumbnail */}
          <div className="hidden sm:block w-20 h-20 rounded-lg overflow-hidden border-2 border-amber-300/50 shadow-md flex-shrink-0 bg-white">
            <img 
              src={certificatePreview} 
              alt="Certificado ilustrativo" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex items-center gap-3 flex-1">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Certificado Oficial NEUROX</CardTitle>
              <CardDescription className="text-sm">
                Documento exclusivo com seu resultado
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Seu nome completo no certificado</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Nome do teste: {testName}</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Seu resultado oficial</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Código de validação único</span>
          </li>
          <li className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Download em alta resolução (PNG)</span>
          </li>
        </ul>

        <Button
          onClick={handlePurchaseClick}
          disabled={isPurchasing}
          className="w-full min-h-[52px] text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
          size="lg"
        >
          {isPurchasing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              Processando...
            </>
          ) : (
            <>
              <Award className="h-5 w-5 mr-2" />
              <span className="flex flex-col sm:flex-row sm:items-center sm:gap-1.5">
                <span>Quero meu Certificado</span>
                <span className="text-sm opacity-90">R$ {CERTIFICATE_PRICE.toFixed(2).replace('.', ',')}</span>
              </span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BuyCertificateButton;
