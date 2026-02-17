export interface EmotionalQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'self-awareness' | 'self-regulation' | 'motivation' | 'empathy' | 'social-skills';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const emotionalQuestions: EmotionalQuestion[] = [
  // Self-Awareness (Autoconsciência) - 6 questões
  {
    id: 1,
    question: "Quando você está em uma reunião importante e sente ansiedade crescente, qual é geralmente sua primeira reação?",
    options: [
      "Ignoro completamente e finjo que está tudo bem",
      "Reconheço a ansiedade e tento identificar sua causa",
      "Saio da sala imediatamente",
      "Culpo os outros pela situação"
    ],
    correctAnswer: 1,
    category: 'self-awareness',
    difficulty: 'easy'
  },
  {
    id: 2,
    question: "Após receber um feedback negativo sobre seu trabalho, você geralmente:",
    options: [
      "Fica na defensiva e busca justificativas",
      "Aceita sem questionar, mesmo discordando",
      "Reflete sobre os pontos válidos e busca melhorar",
      "Ignora completamente o feedback"
    ],
    correctAnswer: 2,
    category: 'self-awareness',
    difficulty: 'easy'
  },
  {
    id: 3,
    question: "Você consegue identificar como seu humor afeta suas decisões no dia a dia?",
    options: [
      "Raramente penso sobre isso",
      "Só percebo depois que algo dá errado",
      "Geralmente percebo durante a situação",
      "Sempre analiso meu estado emocional antes de decidir"
    ],
    correctAnswer: 3,
    category: 'self-awareness',
    difficulty: 'medium'
  },
  {
    id: 4,
    question: "Quando alguém elogia seu trabalho, você:",
    options: [
      "Desconfia das intenções da pessoa",
      "Minimiza a conquista dizendo que não foi nada",
      "Aceita o elogio e reconhece seu esforço",
      "Fica constrangido e muda de assunto"
    ],
    correctAnswer: 2,
    category: 'self-awareness',
    difficulty: 'medium'
  },
  {
    id: 5,
    question: "Você sabe identificar quais situações específicas tendem a provocar irritação em você?",
    options: [
      "Não, geralmente me surpreendo com minhas reações",
      "Às vezes, mas nem sempre",
      "Sim, conheço bem meus gatilhos emocionais",
      "Prefiro não pensar nisso"
    ],
    correctAnswer: 2,
    category: 'self-awareness',
    difficulty: 'hard'
  },
  {
    id: 6,
    question: "Ao final de um dia difícil, você consegue distinguir entre cansaço físico e exaustão emocional?",
    options: [
      "Nunca pensei sobre essa diferença",
      "Às vezes confundo os dois",
      "Geralmente consigo diferenciar",
      "Sempre identifico claramente a origem do cansaço"
    ],
    correctAnswer: 3,
    category: 'self-awareness',
    difficulty: 'hard'
  },

  // Self-Regulation (Autocontrole) - 6 questões
  {
    id: 7,
    question: "Quando você está muito irritado durante uma discussão, qual sua estratégia?",
    options: [
      "Expresso tudo que estou sentindo imediatamente",
      "Peço um tempo para me acalmar antes de continuar",
      "Fico em silêncio absoluto para não piorar",
      "Saio sem dar explicações"
    ],
    correctAnswer: 1,
    category: 'self-regulation',
    difficulty: 'easy'
  },
  {
    id: 8,
    question: "Diante de uma mudança inesperada no trabalho, você geralmente:",
    options: [
      "Resiste fortemente à mudança",
      "Aceita passivamente sem opinar",
      "Avalia os prós e contras antes de reagir",
      "Reclama com os colegas sobre a situação"
    ],
    correctAnswer: 2,
    category: 'self-regulation',
    difficulty: 'easy'
  },
  {
    id: 9,
    question: "Quando você comete um erro no trabalho, sua tendência é:",
    options: [
      "Esconder o erro o máximo possível",
      "Culpar fatores externos",
      "Assumir o erro e buscar soluções",
      "Ficar paralisado sem saber o que fazer"
    ],
    correctAnswer: 2,
    category: 'self-regulation',
    difficulty: 'medium'
  },
  {
    id: 10,
    question: "Em momentos de grande pressão, você consegue manter a clareza de pensamento?",
    options: [
      "Raramente, a pressão me paralisa",
      "Depende muito da situação",
      "Na maioria das vezes, sim",
      "Sempre, funciono melhor sob pressão"
    ],
    correctAnswer: 2,
    category: 'self-regulation',
    difficulty: 'medium'
  },
  {
    id: 11,
    question: "Quando precisa esperar por algo importante, como você lida com a ansiedade?",
    options: [
      "Fico obcecado pensando nisso constantemente",
      "Tento me distrair, mas não consigo",
      "Ocupo minha mente com outras atividades",
      "Uso técnicas específicas de relaxamento"
    ],
    correctAnswer: 3,
    category: 'self-regulation',
    difficulty: 'hard'
  },
  {
    id: 12,
    question: "Se um colega interrompe seu trabalho repetidamente, você:",
    options: [
      "Explode de raiva eventualmente",
      "Aguenta calado até não suportar mais",
      "Comunica de forma assertiva seus limites",
      "Evita a pessoa completamente"
    ],
    correctAnswer: 2,
    category: 'self-regulation',
    difficulty: 'hard'
  },

  // Motivation (Motivação) - 6 questões
  {
    id: 13,
    question: "O que mais te motiva a alcançar seus objetivos?",
    options: [
      "Reconhecimento e status",
      "Dinheiro e benefícios materiais",
      "Realização pessoal e crescimento",
      "Medo de falhar"
    ],
    correctAnswer: 2,
    category: 'motivation',
    difficulty: 'easy'
  },
  {
    id: 14,
    question: "Quando enfrenta um obstáculo difícil, você:",
    options: [
      "Desiste se não resolver rápido",
      "Procura alguém para resolver por você",
      "Persiste buscando diferentes abordagens",
      "Reclama da situação antes de agir"
    ],
    correctAnswer: 2,
    category: 'motivation',
    difficulty: 'easy'
  },
  {
    id: 15,
    question: "Você estabelece metas pessoais e profissionais de forma:",
    options: [
      "Nunca estabeleço metas",
      "Estabeleço, mas raramente acompanho",
      "Estabeleço e monitoro regularmente",
      "Só quando alguém me cobra"
    ],
    correctAnswer: 2,
    category: 'motivation',
    difficulty: 'medium'
  },
  {
    id: 16,
    question: "Após uma falha significativa, sua tendência é:",
    options: [
      "Evitar tentar novamente",
      "Tentar imediatamente sem refletir",
      "Analisar o que deu errado e tentar de novo",
      "Culpar circunstâncias externas"
    ],
    correctAnswer: 2,
    category: 'motivation',
    difficulty: 'medium'
  },
  {
    id: 17,
    question: "Como você se mantém motivado em tarefas rotineiras e monótonas?",
    options: [
      "Não consigo, perco interesse rapidamente",
      "Faço por obrigação, sem engajamento",
      "Busco significado maior na tarefa",
      "Crio pequenas recompensas para mim"
    ],
    correctAnswer: 2,
    category: 'motivation',
    difficulty: 'hard'
  },
  {
    id: 18,
    question: "Você tende a ver desafios como:",
    options: [
      "Ameaças a serem evitadas",
      "Obrigações incômodas",
      "Oportunidades de crescimento",
      "Situações neutras sem significado"
    ],
    correctAnswer: 2,
    category: 'motivation',
    difficulty: 'hard'
  },

  // Empathy (Empatia) - 6 questões
  {
    id: 19,
    question: "Quando um amigo está passando por um momento difícil, você geralmente:",
    options: [
      "Oferece conselhos imediatamente",
      "Muda de assunto para algo mais leve",
      "Escuta atentamente antes de responder",
      "Compara com seus próprios problemas"
    ],
    correctAnswer: 2,
    category: 'empathy',
    difficulty: 'easy'
  },
  {
    id: 20,
    question: "Você consegue perceber quando alguém está desconfortável em uma conversa?",
    options: [
      "Raramente percebo esses sinais",
      "Só quando é muito óbvio",
      "Geralmente percebo sinais sutis",
      "Sempre identifico desconforto nos outros"
    ],
    correctAnswer: 2,
    category: 'empathy',
    difficulty: 'easy'
  },
  {
    id: 21,
    question: "Ao assistir a um filme emocionante, você:",
    options: [
      "Permanece completamente indiferente",
      "Entende a emoção, mas não sente",
      "Sente as emoções dos personagens",
      "Prefere filmes sem conteúdo emocional"
    ],
    correctAnswer: 2,
    category: 'empathy',
    difficulty: 'medium'
  },
  {
    id: 22,
    question: "Quando alguém tem uma opinião muito diferente da sua, você:",
    options: [
      "Tenta convencer a pessoa do seu ponto",
      "Ignora a opinião diferente",
      "Busca entender o ponto de vista dela",
      "Encerra a conversa"
    ],
    correctAnswer: 2,
    category: 'empathy',
    difficulty: 'medium'
  },
  {
    id: 23,
    question: "Você consegue identificar necessidades não expressas verbalmente pelas pessoas?",
    options: [
      "Não, preciso que me digam diretamente",
      "Raramente percebo",
      "Frequentemente percebo essas necessidades",
      "Sempre, é algo natural para mim"
    ],
    correctAnswer: 2,
    category: 'empathy',
    difficulty: 'hard'
  },
  {
    id: 24,
    question: "Ao ver alguém sendo tratado injustamente, você:",
    options: [
      "Prefere não se envolver",
      "Sente incômodo, mas não age",
      "Intervém de forma apropriada",
      "Fica muito afetado emocionalmente"
    ],
    correctAnswer: 2,
    category: 'empathy',
    difficulty: 'hard'
  },

  // Social Skills (Habilidades Sociais) - 6 questões
  {
    id: 25,
    question: "Em situações de conflito entre colegas, você geralmente:",
    options: [
      "Evita se envolver completamente",
      "Toma partido de um dos lados",
      "Tenta mediar buscando solução",
      "Alimenta o conflito com comentários"
    ],
    correctAnswer: 2,
    category: 'social-skills',
    difficulty: 'easy'
  },
  {
    id: 26,
    question: "Ao trabalhar em equipe, você prefere:",
    options: [
      "Fazer tudo sozinho",
      "Seguir ordens sem questionar",
      "Colaborar e contribuir ativamente",
      "Liderar sem ouvir os outros"
    ],
    correctAnswer: 2,
    category: 'social-skills',
    difficulty: 'easy'
  },
  {
    id: 27,
    question: "Como você costuma iniciar conversas com pessoas desconhecidas?",
    options: [
      "Evito ao máximo essas situações",
      "Espero que a outra pessoa comece",
      "Encontro pontos em comum para conectar",
      "Falo sobre mim imediatamente"
    ],
    correctAnswer: 2,
    category: 'social-skills',
    difficulty: 'medium'
  },
  {
    id: 28,
    question: "Ao dar feedback crítico a alguém, você:",
    options: [
      "Evita dar feedback negativo",
      "É direto sem considerar sentimentos",
      "Equilibra crítica com reconhecimento",
      "Apenas elogia para evitar conflitos"
    ],
    correctAnswer: 2,
    category: 'social-skills',
    difficulty: 'medium'
  },
  {
    id: 29,
    question: "Como você lida com pessoas difíceis no ambiente de trabalho?",
    options: [
      "Evito qualquer interação",
      "Entro em confronto direto",
      "Busco entender e adaptar minha abordagem",
      "Reclamo com outros sobre a pessoa"
    ],
    correctAnswer: 2,
    category: 'social-skills',
    difficulty: 'hard'
  },
  {
    id: 30,
    question: "Você consegue influenciar e persuadir pessoas de forma ética?",
    options: [
      "Não, prefiro não influenciar ninguém",
      "Uso manipulação quando necessário",
      "Uso argumentos e empatia para persuadir",
      "Imponho minhas ideias diretamente"
    ],
    correctAnswer: 2,
    category: 'social-skills',
    difficulty: 'hard'
  }
];

export interface EmotionalResultBand {
  minScore: number;
  maxScore: number;
  name: string;
  eqRange: string;
  percentileRange: string;
  freeDescription: string;
  premiumDescription: string;
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  careerAreas: string[];
}

export const emotionalResultBands: EmotionalResultBand[] = [
  {
    minScore: 0,
    maxScore: 6,
    name: "Inteligência Emocional Inicial",
    eqRange: "60-75",
    percentileRange: "1-10%",
    freeDescription: "Seu perfil revela padrões emocionais que operam abaixo da sua consciência — traços que explicam reações automáticas em momentos de pressão. Há um potencial transformador escondido nessas respostas, com características que nem sempre são conscientes mas que moldam seus relacionamentos. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Análise detalhada do seu perfil emocional inicial com plano de desenvolvimento personalizado.",
    strengths: ["Potencial de crescimento", "Abertura para aprendizado"],
    challenges: ["Reconhecimento emocional", "Gestão de reações", "Empatia"],
    recommendations: ["Iniciar diário emocional", "Praticar pausas antes de reagir", "Buscar feedback de pessoas próximas"],
    careerAreas: ["Funções técnicas", "Trabalho individual"]
  },
  {
    minScore: 7,
    maxScore: 12,
    name: "Inteligência Emocional em Desenvolvimento",
    eqRange: "76-90",
    percentileRange: "11-25%",
    freeDescription: "Suas respostas indicam uma consciência emocional em expansão — um padrão pouco percebido que revela capacidades empáticas ainda em formação. Detectamos sinais de habilidades emocionais que a maioria não desenvolve ao longo da vida. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Análise das áreas específicas que precisam de desenvolvimento com exercícios práticos.",
    strengths: ["Consciência básica", "Disposição para melhorar", "Alguma empatia"],
    challenges: ["Consistência emocional", "Comunicação assertiva", "Gestão de estresse"],
    recommendations: ["Praticar escuta ativa", "Desenvolver vocabulário emocional", "Exercícios de respiração"],
    careerAreas: ["Funções de suporte", "Trabalho em equipe supervisionado"]
  },
  {
    minScore: 13,
    maxScore: 18,
    name: "Inteligência Emocional Moderada",
    eqRange: "91-105",
    percentileRange: "26-50%",
    freeDescription: "Seu padrão mental mostra um equilíbrio emocional que esconde camadas mais profundas — uma combinação incomum de autoconsciência e regulação que nem sempre é consciente. Há nuances no seu perfil que podem redefinir como você navega conflitos e oportunidades. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Perfil equilibrado com oportunidades de refinamento em áreas específicas.",
    strengths: ["Autoconsciência razoável", "Empatia situacional", "Adaptabilidade"],
    challenges: ["Situações de alta pressão", "Conflitos complexos", "Liderança emocional"],
    recommendations: ["Desenvolver resiliência", "Praticar feedback construtivo", "Mentoria"],
    careerAreas: ["Gestão de projetos", "Atendimento ao cliente", "Funções colaborativas"]
  },
  {
    minScore: 19,
    maxScore: 24,
    name: "Inteligência Emocional Elevada",
    eqRange: "106-120",
    percentileRange: "51-75%",
    freeDescription: "Seu perfil revela competências emocionais que pertencem a um grupo restrito da população — traços que explicam por que certas pessoas confiam instintivamente em você. Há dimensões ainda inexploradas no seu funcionamento emocional que representam um diferencial raro. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Análise aprofundada de suas competências emocionais avançadas e potencial de liderança.",
    strengths: ["Autocontrole consistente", "Empatia desenvolvida", "Comunicação eficaz", "Gestão de conflitos"],
    challenges: ["Situações extremas", "Manutenção sob estresse prolongado"],
    recommendations: ["Desenvolver outros", "Coaching informal", "Projetos de alta complexidade"],
    careerAreas: ["Liderança de equipes", "Recursos Humanos", "Consultoria", "Vendas complexas"]
  },
  {
    minScore: 25,
    maxScore: 30,
    name: "Inteligência Emocional Superior",
    eqRange: "121-140",
    percentileRange: "76-99%",
    freeDescription: "Suas respostas indicam maestria emocional — uma combinação incomum de empatia profunda, autocontrole e influência social que menos de 5% das pessoas demonstram. Seu perfil contém padrões pouco percebidos que explicam um impacto interpessoal extraordinário. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Perfil de excelência emocional com análise de como maximizar seu potencial de impacto.",
    strengths: ["Maestria emocional", "Influência positiva", "Resiliência excepcional", "Liderança inspiradora", "Empatia profunda"],
    challenges: ["Manter equilíbrio pessoal", "Evitar absorver emoções alheias"],
    recommendations: ["Mentoria de alto nível", "Desenvolvimento de líderes", "Projetos transformacionais"],
    careerAreas: ["Alta liderança", "Coaching executivo", "Psicologia organizacional", "Diplomacia", "Empreendedorismo social"]
  }
];

export const getEmotionalResultBand = (score: number): EmotionalResultBand => {
  return emotionalResultBands.find(
    band => score >= band.minScore && score <= band.maxScore
  ) || emotionalResultBands[0];
};

export const categoryLabels: Record<EmotionalQuestion['category'], string> = {
  'self-awareness': 'Autoconsciência',
  'self-regulation': 'Autocontrole',
  'motivation': 'Motivação',
  'empathy': 'Empatia',
  'social-skills': 'Habilidades Sociais'
};
