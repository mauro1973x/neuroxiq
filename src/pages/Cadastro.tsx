import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { logClientEvent } from "@/lib/observability";

const benefits = [
  "Acesso a testes gratuitos",
  "Histórico completo de resultados",
  "Certificados personalizados",
  "Relatórios detalhados premium",
];

const Cadastro = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('returnTo') || searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(email, password, fullName);

    if (error) {
      void logClientEvent({
        event: "signup_failed",
        level: "warn",
        category: "auth",
        message: error.message,
      });
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } else {
      void logClientEvent({
        event: "signup_success",
        category: "auth",
        metadata: { redirectTo },
      });
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao NEUROX.",
      });
      navigate(redirectTo);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-8 md:py-12 px-4">
        <div className="w-full max-w-4xl">
          {/* Mobile: Single column, Desktop: Two columns */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Benefits - Hidden on mobile, shown on desktop */}
            <div className="hidden md:flex flex-col justify-center">
              <h2 className="font-display text-3xl font-bold mb-6">
                Comece Sua Jornada de
                <span className="text-gradient-primary"> Autoconhecimento</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Junte-se a mais de 50.000 pessoas que já descobriram mais sobre si mesmas com nossos testes científicos.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success/20 text-success shrink-0">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Form */}
            <div className="glass-card p-6 md:p-8">
              <div className="text-center mb-6 md:mb-8">
                <h1 className="font-display text-xl md:text-2xl font-bold mb-2">Criar Conta Grátis</h1>
                <p className="text-sm md:text-base text-muted-foreground">Preencha os dados abaixo para começar</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm md:text-base">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Seu nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 md:pl-11 min-h-[48px] text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm md:text-base">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 md:pl-11 min-h-[48px] text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm md:text-base">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 md:pl-11 pr-11 min-h-[48px] text-base"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  variant="hero" 
                  className="w-full min-h-[52px] text-base" 
                  size="lg" 
                  disabled={isLoading}
                >
                  {isLoading ? "Criando conta..." : "Criar Conta Grátis"}
                  <ArrowRight className="h-5 w-5" />
                </Button>

                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  Ao criar uma conta, você concorda com nossos{" "}
                  <Link to="/termos" className="text-primary hover:underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link to="/privacidade" className="text-primary hover:underline">
                    Política de Privacidade
                  </Link>
                </p>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link
                    to={`/login?returnTo=${encodeURIComponent(redirectTo)}`}
                    className="text-primary font-medium hover:underline"
                  >
                    Entrar
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cadastro;
