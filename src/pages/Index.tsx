import { Link } from "react-router-dom";
import { ArrowRight, Brain, Award, TrendingUp, Shield, Zap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import QuizCard from "@/components/quiz/QuizCard";
import { Quiz } from "@/lib/types";

// Demo quizzes for initial display
const demoQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Teste de QI",
    description:
      "Avalie sua capacidade cognitiva com nosso teste de QI cientificamente validado. Receba um resultado detalhado.",
    test_type: "iq",
    image_url: null,
    duration_minutes: 30,
    question_count: 30,
    is_premium: true,
    is_published: true,
    price_basic: 0,
    price_premium: 49.9,
    price_certificate: 29.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Teste de Personalidade MBTI",
    description: "Descubra seu tipo de personalidade entre os 16 perfis e entenda melhor seus pontos fortes.",
    test_type: "personality",
    image_url: null,
    duration_minutes: 30,
    question_count: 40,
    is_premium: true,
    is_published: true,
    price_basic: 0,
    price_premium: 39.9,
    price_certificate: 19.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Orientação de Carreira",
    description: "Identifique as carreiras mais alinhadas com seu perfil, habilidades e valores pessoais.",
    test_type: "career",
    image_url: null,
    duration_minutes: 30,
    question_count: 42,
    is_premium: true,
    is_published: true,
    price_basic: 0,
    price_premium: 59.9,
    price_certificate: 24.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Teste de Orientação Político-Ideológica",
    description: "Descubra seu posicionamento ideológico com base em valores sociais, econômicos e institucionais.",
    test_type: "political",
    image_url: null,
    duration_minutes: 25,
    question_count: 40,
    is_premium: true,
    is_published: true,
    price_basic: 0,
    price_premium: 39.9,
    price_certificate: 19.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Teste de Inteligência Emocional (QE)",
    description: "Avalie sua capacidade emocional em situações pessoais, sociais e profissionais.",
    test_type: "emotional",
    image_url: null,
    duration_minutes: 20,
    question_count: 30,
    is_premium: true,
    is_published: true,
    price_basic: 0,
    price_premium: 49.9,
    price_certificate: 24.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Teste de Compatibilidade Amorosa",
    description: "Descubra o nível de sintonia entre vocês. Análise afetiva e relacional em 5 dimensões psicológicas.",
    test_type: "compatibility",
    image_url: null,
    duration_minutes: 6,
    question_count: 30,
    is_premium: true,
    is_published: true,
    price_basic: 0,
    price_premium: 19.9,
    price_certificate: 19.9,
    created_at: new Date().toISOString(),
  },
];

const features = [
  {
    icon: Brain,
    title: "Testes Científicos",
    description: "Metodologias validadas por especialistas em psicometria.",
  },
  {
    icon: Zap,
    title: "Resultados Rápidos",
    description: "Receba seu resultado básico imediatamente.",
  },
  {
    icon: Award,
    title: "Certificados Oficiais",
    description: "Gere certificados personalizados em PDF.",
  },
  {
    icon: TrendingUp,
    title: "Relatórios Detalhados",
    description: "Análise profunda com recomendações personalizadas.",
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Seus dados são criptografados e protegidos.",
  },
  {
    icon: Users,
    title: "+50.000 Usuários",
    description: "Milhares já descobriram mais sobre si mesmos.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient py-12 md:py-20 lg:py-32">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-5 md:mb-6 animate-fade-in">
              <span className="premium-badge text-xs">Novo</span>
              <span className="text-xs md:text-sm font-medium">Teste de Compatibilidade Amorosa</span>
            </div>

            <h1
              className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 animate-fade-in leading-tight"
              style={{
                animationDelay: "0.1s",
              }}
            >
              Conheça sua Mente e
              <span className="text-gradient-primary"> Domine seu Futuro</span>
            </h1>

            <p
              className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 md:mb-8 animate-fade-in leading-relaxed px-2"
              style={{
                animationDelay: "0.2s",
              }}
            >
              Obtenha o mapa detalhado de suas habilidades com testes científicos validados, resultados e certificados personalizados, que revelam suas maiores forças e apontam o caminho exato para seu sucesso.
            </p>

            <div
              className="flex justify-center animate-fade-in px-4 md:px-0"
              style={{
                animationDelay: "0.3s",
              }}
            >
              <Link to="/testes">
                <div className="inline-flex flex-row items-center gap-3 border-2 border-yellow-400 bg-yellow-400 rounded-2xl px-8 py-4 shadow-xl hover:bg-yellow-300 hover:border-yellow-300 transition-all duration-200 cursor-pointer hover:scale-[1.03] active:scale-[0.98]">
                  <span className="text-base md:text-lg font-bold text-blue-600 tracking-wide">
                    Comece Agora, é Grátis
                  </span>
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </div>
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-4 md:gap-8 mt-10 md:mt-16 pt-6 md:pt-8 border-t border-border animate-fade-in"
              style={{
                animationDelay: "0.4s",
              }}
            >
              <div>
                <div className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">50k+</div>
                <div className="text-xs md:text-sm text-muted-foreground">Usuários</div>
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">6</div>
                <div className="text-xs md:text-sm text-muted-foreground">Tipos de Teste</div>
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">98%</div>
                <div className="text-xs md:text-sm text-muted-foreground">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tests */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">Testes em Destaque</h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Escolha entre nossos testes mais populares e comece sua jornada de autoconhecimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {demoQuizzes.map((quiz) => {
              // Map test_type to anchor ID
              const anchorId =
                quiz.test_type === "iq"
                  ? "teste-qi"
                  : quiz.test_type === "personality"
                    ? "teste-personalidade"
                    : quiz.test_type === "career"
                      ? "teste-carreira"
                      : quiz.test_type === "emotional"
                        ? "teste-inteligencia-emocional"
                        : quiz.test_type === "political"
                          ? "teste-politico"
                          : quiz.test_type === "compatibility"
                            ? "teste-compatibilidade"
                            : undefined;

              return (
                <div key={quiz.id} id={anchorId} className="scroll-mt-24">
                  <QuizCard quiz={quiz} />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 md:py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Por Que Escolher o NEUROX?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Uma plataforma completa para você descobrir mais sobre si mesmo com credibilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-5 md:p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-3 md:mb-4">
                  <feature.icon className="h-6 w-6 md:h-7 md:w-7" />
                </div>
                <h3 className="font-display text-base md:text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 bg-primary text-primary-foreground">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Pronto Para Se Conhecer Melhor?
            </h2>
            <p className="text-base md:text-lg opacity-90 mb-6 md:mb-8 leading-relaxed">
              Crie sua conta gratuita e comece seu primeiro teste agora mesmo. Resultados básicos são sempre grátis!
            </p>
            <Link to="/cadastro" className="block md:inline-block">
              <Button variant="premium" size="xl" className="w-full md:w-auto min-h-[52px] text-base">
                Criar Conta Grátis
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
