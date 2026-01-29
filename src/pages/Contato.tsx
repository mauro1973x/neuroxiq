import { Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Contato = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-2xl">
          <h1 className="text-4xl font-display font-bold mb-8 text-center">
            Contato
          </h1>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-2">Entre em Contato</h2>
                  <p className="text-muted-foreground mb-4">
                    Para dúvidas, sugestões ou suporte, envie um email para:
                  </p>
                  <a 
                    href="mailto:hello.neurox@gmail.com" 
                    className="text-lg text-primary hover:underline font-medium"
                  >
                    hello.neurox@gmail.com
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-sm text-muted-foreground text-center mt-8">
            NEUROX . Suécia
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contato;
