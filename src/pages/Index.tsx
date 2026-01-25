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
    title: "Teste de QI Profissional",
    description:
      "Avalie sua capacidade cognitiva com nosso teste de QI cientificamente validado. Receba um resultado detalhado.",
    test_type: "iq",
    image_url: null,
    duration_minutes: 30,
    question_count: 30,
    is_premium: true,
    is_published: true,
    price_basic: 0,
    price_premium: 19.9,
    price_certificate: 9.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Teste de Personalidade MBTI",
    description: "Descubra seu tipo de personalidade entre os 16 perfis e entenda melhor seus pontos fortes.",
    test_type: "personality",
    image_url: null,
    duration_minutes: 25,
    question_count: 60,
    is_premium: false,
    is_published: true,
    price_basic: 0,
    price_premium: 19.9,
    price_certificate: 9.9,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Orientação de Carreira",
    description: "Identifique as carreiras mais alinhadas com seu perfil, habilidades e valores pessoais.",
    test_type: "career",
    image_url: null,
    duration_minutes: 30,
    question_count: 35,
    is_premium: true,
    is_published: true,
    price_basic: 0,
    price_premium: 29.9,
    price_certificate: 14.9,
    created_at: new Date().toISOString(),
  },
];

const features = [
  {
    icon: Brain,
    title: "Testes Científicos",
    description: "Metodologias validadas por especialistas em psicometria e psicologia.",
  },
  {
    icon: Zap,
    title: "Resultados Instantâneos",
    description: "Receba seu resultado básico imediatamente após completar o teste.",
  },
  {
    icon: Award,
    title: "Certificados Oficiais",
    description: "Gere certificados personalizados em PDF para compartilhar.",
  },
  {
    icon: TrendingUp,
    title: "Relatórios Detalhados",
    description: "Análise profunda com interpretações e recomendações personalizadas.",
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Seus dados são criptografados e protegidos com as melhores práticas.",
  },
  {
    icon: Users,
    title: "+50.000 Usuários",
    description: "Junte-se a milhares de pessoas que já descobriram mais sobre si mesmas.",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent-foreground px-4 py-2 rounded-full mb-6 animate-fade-in">
              <span className="premium-badge">Novo</span>
              <span className="text-sm font-medium">Teste de Inteligência Emocional disponível</span>
            </div>

            <h1
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in"
              style={{ animationDelay: "0.1s" }}
            >
              Descubra Seu
              <span className="text-gradient-primary"> Verdadeiro Potencial</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground mb-8 animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              Testes científicos de personalidade, QI e carreira com resultados detalhados e certificados
              personalizados.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Link to="/cadastro">
                <Button variant="hero" size="xl">
                  Começar Agora Grátis
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/testes">
                <Button variant="outline" size="xl">
                  Ver Todos os Testes
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-border animate-fade-in"
              style={{ animationDelay: "0.4s" }}
            >
              <div>
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">50k+</div>
                <div className="text-sm text-muted-foreground">Usuários</div>
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">15+</div>
                <div className="text-sm text-muted-foreground">Tipos de Teste</div>
              </div>
              <div>
                <div className="font-display text-3xl md:text-4xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground">Satisfação</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tests */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Testes em Destaque</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha entre nossos testes mais populares e comece sua jornada de autoconhecimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/testes">
              <Button variant="outline" size="lg">
                Ver Todos os Testes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Por Que Escolher o QuizMaster?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para você descobrir mais sobre si mesmo com credibilidade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-6 text-center hover:shadow-lg transition-all duration-300">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto mb-4">
                  <feature.icon className="h-7 w-7" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Pronto Para Se Conhecer Melhor?</h2>
            <p className="text-lg opacity-90 mb-8">
              Crie sua conta gratuita e comece seu primeiro teste agora mesmo. Resultados básicos são sempre grátis!
            </p>
            <Link to="/cadastro">
              <Button variant="premium" size="xl">
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
