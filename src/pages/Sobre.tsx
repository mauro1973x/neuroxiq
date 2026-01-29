import { Target, Shield, Users, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import logo from '@/assets/logo.png';

const Sobre = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="NEUROX Logo" className="h-24 w-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Sobre a <span className="text-primary">NEUROX</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Avaliações Cognitivas Digitais
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-display font-semibold mb-4">Nossa Missão</h2>
            <p className="text-muted-foreground leading-relaxed">
              A NEUROX é uma plataforma dedicada a oferecer avaliações cognitivas digitais 
              acessíveis e de qualidade. Nosso objetivo é democratizar o acesso ao 
              autoconhecimento, permitindo que pessoas de todas as partes do mundo possam 
              explorar suas capacidades cognitivas, traços de personalidade e orientações 
              de forma prática e segura.
            </p>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-display font-semibold mb-6">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Precisão</h3>
                    <p className="text-sm text-muted-foreground">
                      Desenvolvemos testes baseados em metodologias estatísticas reconhecidas, 
                      buscando sempre a máxima qualidade em nossas avaliações.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Privacidade</h3>
                    <p className="text-sm text-muted-foreground">
                      Seus dados são tratados com o máximo sigilo e segurança. 
                      Respeitamos sua privacidade em todas as etapas.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Acessibilidade</h3>
                    <p className="text-sm text-muted-foreground">
                      Acreditamos que o autoconhecimento deve estar ao alcance de todos, 
                      por isso oferecemos testes gratuitos e preços acessíveis.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Alcance Global</h3>
                    <p className="text-sm text-muted-foreground">
                      Com sede na Suécia, atendemos usuários de todo o mundo, 
                      oferecendo uma experiência digital de excelência.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* What We Offer */}
          <section>
            <h2 className="text-2xl font-display font-semibold mb-4">O Que Oferecemos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Nossa plataforma disponibiliza diversos tipos de avaliações, incluindo:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Teste de QI (Quociente de Inteligência)</li>
              <li>Avaliação de Inteligência Emocional</li>
              <li>Teste de Personalidade</li>
              <li>Orientação de Carreira</li>
              <li>Mapeamento de Orientação Política</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <section className="bg-muted/50 rounded-xl p-6 border">
            <h2 className="text-lg font-semibold mb-3 text-foreground">
              ⚠️ Aviso Importante
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A NEUROX é uma plataforma <strong>educacional e estatística</strong>. 
              Nossos testes e relatórios têm caráter informativo e de autoconhecimento, 
              <strong> não possuindo fins diagnósticos, clínicos ou médicos</strong>. 
              Os resultados não substituem avaliações profissionais realizadas por 
              psicólogos, psiquiatras ou outros profissionais de saúde mental. 
              Para questões de saúde, consulte sempre um profissional qualificado.
            </p>
          </section>

          {/* Location */}
          <section className="text-center pt-8 border-t">
            <p className="text-muted-foreground">
              NEUROX . Suécia
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sobre;
