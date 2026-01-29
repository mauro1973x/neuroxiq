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
      <main className="flex-1 container py-12 flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Pagamento Cancelado</h2>
          <p className="text-muted-foreground mb-6">
            Você cancelou o processo de pagamento. Seu relatório premium não foi desbloqueado.
          </p>
          <div className="flex flex-col gap-2">
            {testAttemptId ? (
              <Button onClick={() => navigate(`/resultado/${testAttemptId}`)}>
                Voltar ao Resultado
              </Button>
            ) : (
              <Button onClick={() => navigate('/dashboard')}>
                Voltar ao Dashboard
              </Button>
            )}
            <Button variant="outline" onClick={() => navigate('/testes')}>
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
