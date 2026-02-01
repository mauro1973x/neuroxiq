import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const testAttemptId = searchParams.get('testAttemptId');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8 md:py-12 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 md:h-12 md:w-12 text-destructive" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-destructive mb-2">Pagamento Cancelado</h2>
          <p className="text-sm md:text-base text-muted-foreground mb-6 leading-relaxed">
            Você cancelou o processo de pagamento. Seu relatório premium não foi desbloqueado.
          </p>
          <div className="flex flex-col gap-3">
            {testAttemptId ? (
              <Button onClick={() => navigate(`/resultado/${testAttemptId}`)} className="w-full min-h-[52px] text-base" variant="hero">
                Voltar ao Resultado
              </Button>
            ) : (
              <Button onClick={() => navigate('/dashboard')} className="w-full min-h-[52px] text-base" variant="hero">
                Voltar ao Dashboard
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/testes')} className="w-full min-h-[48px] text-base">
              Ver Outros Testes
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PaymentCancel;
