import { Link } from 'react-router-dom';
import { Scale, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PoliticalTestHighlight = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/50 to-background">
      <div className="container">
        <Link 
          to="/teste-politico" 
          className="block group"
        >
          <div className="glass-card p-8 md:p-12 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-l-4 border-primary">
            <div className="flex flex-col lg:flex-row lg:items-center gap-8">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary group-hover:scale-110 transition-transform duration-300">
                  <Scale className="h-10 w-10" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-4">
                <div>
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-primary/10 text-primary rounded-full mb-3">
                    Avaliação Ideológica
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                    Teste de Orientação Político-Ideológica
                  </h2>
                </div>

                <p className="text-lg text-muted-foreground">
                  Descubra seu posicionamento ideológico com base em valores sociais, econômicos e institucionais.
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  Este teste analisa suas opiniões sobre economia, papel do Estado, liberdades individuais, 
                  justiça social e tradição cultural. Ao final, você recebe uma classificação ideológica 
                  clara e objetiva, apresentada de forma educacional e não partidária.
                </p>

                <p className="text-xs text-muted-foreground/70 italic">
                  Uso exclusivamente educacional e estatístico. Não possui caráter eleitoral ou partidário.
                </p>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0">
                <Button 
                  variant="hero" 
                  size="lg"
                  className="w-full lg:w-auto group-hover:scale-105 transition-transform"
                >
                  Fazer o teste agora
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default PoliticalTestHighlight;
