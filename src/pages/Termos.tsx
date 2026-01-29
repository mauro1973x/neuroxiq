import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Termos = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8 text-center">
            Termos de Uso
          </h1>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">1. Aceitação dos Termos</h2>
                <p className="text-muted-foreground">
                  Ao acessar e utilizar a plataforma NEUROX, você concorda com estes Termos de Uso. 
                  Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">2. Natureza dos Serviços</h2>
                <p className="text-muted-foreground mb-4">
                  A NEUROX é uma plataforma educacional e estatística focada em avaliações cognitivas. 
                  Nossos testes e relatórios têm caráter exclusivamente informativo e educacional.
                </p>
                <p className="text-muted-foreground font-medium">
                  IMPORTANTE: Os resultados fornecidos pela NEUROX não possuem caráter diagnóstico, 
                  clínico ou médico, e não substituem avaliação profissional qualificada.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">3. Conta do Usuário</h2>
                <p className="text-muted-foreground">
                  Você é responsável por manter a confidencialidade de sua conta e senha. 
                  Todas as atividades realizadas em sua conta são de sua responsabilidade.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">4. Uso Adequado</h2>
                <p className="text-muted-foreground">
                  Você concorda em utilizar a plataforma apenas para fins legais e de acordo com 
                  estes termos. É proibido tentar manipular resultados, compartilhar credenciais 
                  ou utilizar os serviços de forma que prejudique outros usuários.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">5. Propriedade Intelectual</h2>
                <p className="text-muted-foreground">
                  Todo o conteúdo da plataforma, incluindo testes, textos, gráficos e software, 
                  é propriedade da NEUROX e está protegido por leis de direitos autorais.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">6. Pagamentos e Reembolsos</h2>
                <p className="text-muted-foreground">
                  Os pagamentos por serviços premium são processados de forma segura. 
                  Políticas de reembolso podem variar conforme o tipo de serviço adquirido.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">7. Modificações</h2>
                <p className="text-muted-foreground">
                  A NEUROX reserva-se o direito de modificar estes termos a qualquer momento. 
                  Alterações significativas serão comunicadas aos usuários.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">8. Contato</h2>
                <p className="text-muted-foreground">
                  Para dúvidas sobre estes termos, entre em contato através do email:{' '}
                  <a href="mailto:hello.neurox@gmail.com" className="text-primary hover:underline">
                    hello.neurox@gmail.com
                  </a>
                </p>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground text-center pt-4">
              NEUROX . Suécia
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Termos;
