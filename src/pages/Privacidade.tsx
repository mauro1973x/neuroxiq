import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Privacidade = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-display font-bold mb-8 text-center">
            Política de Privacidade
          </h1>

          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">1. Informações que Coletamos</h2>
                <p className="text-muted-foreground mb-4">
                  A NEUROX coleta informações que você nos fornece diretamente, como:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Dados de cadastro (nome, email)</li>
                  <li>Respostas aos testes realizados</li>
                  <li>Informações de pagamento (processadas de forma segura)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">2. Como Utilizamos suas Informações</h2>
                <p className="text-muted-foreground mb-4">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Gerar relatórios personalizados</li>
                  <li>Processar pagamentos</li>
                  <li>Comunicar atualizações importantes</li>
                  <li>Realizar análises estatísticas agregadas</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">3. Proteção de Dados</h2>
                <p className="text-muted-foreground">
                  Implementamos medidas de segurança técnicas e organizacionais para proteger 
                  suas informações contra acesso não autorizado, alteração ou destruição. 
                  Seus dados são armazenados em servidores seguros com criptografia.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">4. Compartilhamento de Dados</h2>
                <p className="text-muted-foreground">
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com 
                  terceiros para fins de marketing. Podemos compartilhar dados apenas com 
                  provedores de serviços essenciais (como processadores de pagamento) sob 
                  rígidos acordos de confidencialidade.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">5. Seus Direitos</h2>
                <p className="text-muted-foreground mb-4">
                  Você tem o direito de:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir informações incorretas</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Exportar seus dados em formato legível</li>
                  <li>Retirar consentimento a qualquer momento</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">6. Cookies</h2>
                <p className="text-muted-foreground">
                  Utilizamos cookies para melhorar sua experiência na plataforma. 
                  Cookies são pequenos arquivos armazenados em seu dispositivo que nos ajudam 
                  a lembrar suas preferências e entender como você utiliza nossos serviços.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">7. Retenção de Dados</h2>
                <p className="text-muted-foreground">
                  Mantemos suas informações pelo tempo necessário para fornecer nossos serviços 
                  ou conforme exigido por lei. Você pode solicitar a exclusão de sua conta 
                  a qualquer momento.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">8. Contato</h2>
                <p className="text-muted-foreground">
                  Para questões sobre privacidade ou exercer seus direitos, entre em contato:{' '}
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

export default Privacidade;
