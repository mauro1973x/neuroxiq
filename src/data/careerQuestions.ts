// Career Orientation Test Questions - Holland RIASEC Model
// Categories: Realistic, Investigative, Artistic, Social, Enterprising, Conventional

export type CareerCategory = 
  | 'realistic'
  | 'investigative' 
  | 'artistic'
  | 'social'
  | 'enterprising'
  | 'conventional';

export interface CareerQuestion {
  id: number;
  question: string;
  options: string[];
  category: CareerCategory;
}

export interface CareerResultBand {
  minScore: number;
  maxScore: number;
  name: string;
  freeDescription: string;
  premiumDescription: string;
  profiles: {
    realistic: string;
    investigative: string;
    artistic: string;
    social: string;
    enterprising: string;
    conventional: string;
  };
}

export const categoryLabels: Record<CareerCategory, string> = {
  'realistic': 'Realista',
  'investigative': 'Investigativo',
  'artistic': 'Artístico',
  'social': 'Social',
  'enterprising': 'Empreendedor',
  'conventional': 'Convencional'
};

export const categoryDescriptions: Record<CareerCategory, string> = {
  'realistic': 'Preferência por atividades práticas, trabalho manual e resolução de problemas concretos',
  'investigative': 'Interesse por pesquisa, análise de dados e resolução de problemas complexos',
  'artistic': 'Valorização da criatividade, expressão pessoal e trabalhos não estruturados',
  'social': 'Foco em ajudar, ensinar e orientar outras pessoas',
  'enterprising': 'Orientação para liderança, persuasão e tomada de decisões',
  'conventional': 'Preferência por organização, procedimentos e trabalho com dados'
};

export const categoryCareerExamples: Record<CareerCategory, string[]> = {
  'realistic': ['Engenharia', 'Mecânica', 'Agricultura', 'Construção', 'Tecnologia'],
  'investigative': ['Ciências', 'Medicina', 'Pesquisa', 'Análise de Dados', 'Matemática'],
  'artistic': ['Design', 'Artes Visuais', 'Música', 'Escrita', 'Arquitetura'],
  'social': ['Educação', 'Psicologia', 'Serviço Social', 'RH', 'Saúde'],
  'enterprising': ['Vendas', 'Gestão', 'Empreendedorismo', 'Direito', 'Marketing'],
  'conventional': ['Contabilidade', 'Administração', 'Finanças', 'Logística', 'Banco']
};

// 42 questions - 7 per category
export const careerQuestions: CareerQuestion[] = [
  // REALISTIC (7 questions)
  {
    id: 1,
    question: 'Você gosta de trabalhar com ferramentas, máquinas ou equipamentos?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'realistic'
  },
  {
    id: 2,
    question: 'Você prefere resolver problemas de forma prática e direta?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'realistic'
  },
  {
    id: 3,
    question: 'Você se sente confortável trabalhando ao ar livre ou em ambientes físicos?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'realistic'
  },
  {
    id: 4,
    question: 'Você gosta de construir, consertar ou montar coisas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'realistic'
  },
  {
    id: 5,
    question: 'Você prefere ver resultados concretos e tangíveis do seu trabalho?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'realistic'
  },
  {
    id: 6,
    question: 'Você se interessa por tecnologia, eletrônica ou mecânica?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'realistic'
  },
  {
    id: 7,
    question: 'Você gosta de atividades que exigem coordenação física e destreza?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'realistic'
  },

  // INVESTIGATIVE (7 questions)
  {
    id: 8,
    question: 'Você gosta de analisar dados e identificar padrões?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'investigative'
  },
  {
    id: 9,
    question: 'Você se sente atraído por resolver quebra-cabeças e enigmas complexos?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'investigative'
  },
  {
    id: 10,
    question: 'Você gosta de pesquisar e aprofundar conhecimentos em temas específicos?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'investigative'
  },
  {
    id: 11,
    question: 'Você prefere trabalhos que exigem raciocínio lógico e analítico?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'investigative'
  },
  {
    id: 12,
    question: 'Você se interessa por ciências naturais, matemática ou tecnologia?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'investigative'
  },
  {
    id: 13,
    question: 'Você gosta de entender como as coisas funcionam por dentro?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'investigative'
  },
  {
    id: 14,
    question: 'Você prefere trabalhar de forma independente em projetos de pesquisa?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'investigative'
  },

  // ARTISTIC (7 questions)
  {
    id: 15,
    question: 'Você gosta de expressar ideias através da arte, música ou escrita?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'artistic'
  },
  {
    id: 16,
    question: 'Você prefere ambientes de trabalho criativos e não estruturados?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'artistic'
  },
  {
    id: 17,
    question: 'Você valoriza a originalidade e a inovação no seu trabalho?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'artistic'
  },
  {
    id: 18,
    question: 'Você se sente inspirado por design, estética e beleza?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'artistic'
  },
  {
    id: 19,
    question: 'Você gosta de trabalhar com imaginação e criar coisas novas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'artistic'
  },
  {
    id: 20,
    question: 'Você se sente desconfortável com regras rígidas e rotinas fixas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'artistic'
  },
  {
    id: 21,
    question: 'Você se interessa por literatura, teatro, cinema ou artes visuais?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'artistic'
  },

  // SOCIAL (7 questions)
  {
    id: 22,
    question: 'Você gosta de ajudar pessoas a resolver seus problemas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'social'
  },
  {
    id: 23,
    question: 'Você se sente realizado ao ensinar ou orientar outras pessoas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'social'
  },
  {
    id: 24,
    question: 'Você prefere trabalhar em equipe e colaborar com colegas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'social'
  },
  {
    id: 25,
    question: 'Você se preocupa genuinamente com o bem-estar dos outros?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'social'
  },
  {
    id: 26,
    question: 'Você gosta de ouvir e aconselhar pessoas em dificuldades?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'social'
  },
  {
    id: 27,
    question: 'Você se interessa por áreas como saúde, educação ou assistência social?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'social'
  },
  {
    id: 28,
    question: 'Você prefere trabalhos que envolvem interação direta com pessoas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'social'
  },

  // ENTERPRISING (7 questions)
  {
    id: 29,
    question: 'Você gosta de liderar grupos e tomar decisões importantes?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'enterprising'
  },
  {
    id: 30,
    question: 'Você se sente motivado por desafios competitivos e metas ambiciosas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'enterprising'
  },
  {
    id: 31,
    question: 'Você gosta de persuadir e influenciar pessoas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'enterprising'
  },
  {
    id: 32,
    question: 'Você se sente atraído por oportunidades de negócio e empreendedorismo?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'enterprising'
  },
  {
    id: 33,
    question: 'Você prefere assumir riscos calculados para alcançar objetivos?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'enterprising'
  },
  {
    id: 34,
    question: 'Você gosta de negociar e fechar acordos?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'enterprising'
  },
  {
    id: 35,
    question: 'Você se interessa por vendas, marketing ou gestão?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'enterprising'
  },

  // CONVENTIONAL (7 questions)
  {
    id: 36,
    question: 'Você gosta de trabalhar com números, dados e planilhas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'conventional'
  },
  {
    id: 37,
    question: 'Você prefere seguir procedimentos e regras estabelecidas?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'conventional'
  },
  {
    id: 38,
    question: 'Você se sente confortável com tarefas rotineiras e previsíveis?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'conventional'
  },
  {
    id: 39,
    question: 'Você gosta de organizar informações e manter arquivos ordenados?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'conventional'
  },
  {
    id: 40,
    question: 'Você prefere ambientes de trabalho estruturados e estáveis?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'conventional'
  },
  {
    id: 41,
    question: 'Você se interessa por finanças, contabilidade ou administração?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'conventional'
  },
  {
    id: 42,
    question: 'Você gosta de atenção aos detalhes e precisão no trabalho?',
    options: [
      'Não me identifico',
      'Identifico-me pouco',
      'Identifico-me parcialmente',
      'Identifico-me muito'
    ],
    category: 'conventional'
  }
];

// Score: 0-3 per question, max 21 per category, total max 126
export const calculateCategoryScores = (answers: (number | null)[]): Record<CareerCategory, number> => {
  const scores: Record<CareerCategory, number> = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0
  };

  careerQuestions.forEach((question, index) => {
    const answer = answers[index];
    if (answer !== null) {
      scores[question.category] += answer;
    }
  });

  return scores;
};

export const calculateTotalScore = (answers: (number | null)[]): number => {
  return answers.reduce((total, answer) => total + (answer ?? 0), 0);
};

export const getTopCategories = (answers: (number | null)[]): CareerCategory[] => {
  const scores = calculateCategoryScores(answers);
  const sortedCategories = (Object.entries(scores) as [CareerCategory, number][])
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
  
  return sortedCategories.slice(0, 3);
};

export const getCategoryPercentages = (answers: (number | null)[]): Record<CareerCategory, number> => {
  const scores = calculateCategoryScores(answers);
  const maxPerCategory = 21; // 7 questions × 3 max score
  
  const percentages: Record<CareerCategory, number> = {
    realistic: 0,
    investigative: 0,
    artistic: 0,
    social: 0,
    enterprising: 0,
    conventional: 0
  };

  (Object.keys(scores) as CareerCategory[]).forEach(category => {
    percentages[category] = Math.round((scores[category] / maxPerCategory) * 100);
  });

  return percentages;
};

// Result bands based on total score (0-126)
export const careerResultBands: CareerResultBand[] = [
  {
    minScore: 0,
    maxScore: 31,
    name: 'Perfil em Exploração',
    freeDescription: 'Seu perfil vocacional esconde possibilidades que você ainda não considerou. Há caminhos profissionais surpreendentes esperando para serem descobertos.',
    premiumDescription: 'Seu perfil indica que você ainda não possui preferências vocacionais claramente definidas. Isso é comum em pessoas que estão iniciando sua jornada profissional ou passando por uma transição de carreira. O relatório premium oferece orientações específicas para ajudá-lo a descobrir suas aptidões naturais.',
    profiles: {
      realistic: 'Em desenvolvimento',
      investigative: 'Em desenvolvimento',
      artistic: 'Em desenvolvimento',
      social: 'Em desenvolvimento',
      enterprising: 'Em desenvolvimento',
      conventional: 'Em desenvolvimento'
    }
  },
  {
    minScore: 32,
    maxScore: 62,
    name: 'Perfil Moderado',
    freeDescription: 'Detectamos tendências vocacionais intrigantes no seu perfil. Algumas combinações inesperadas apontam para carreiras que talvez nunca tenha considerado.',
    premiumDescription: 'Seu perfil mostra tendências moderadas em algumas áreas vocacionais. Você está começando a desenvolver preferências mais claras, mas ainda pode se beneficiar de exploração adicional. O relatório premium identifica suas áreas mais promissoras.',
    profiles: {
      realistic: 'Tendência moderada',
      investigative: 'Tendência moderada',
      artistic: 'Tendência moderada',
      social: 'Tendência moderada',
      enterprising: 'Tendência moderada',
      conventional: 'Tendência moderada'
    }
  },
  {
    minScore: 63,
    maxScore: 93,
    name: 'Perfil Definido',
    freeDescription: 'Suas respostas revelam um perfil profissional marcante. Há padrões no seu comportamento que conectam você a áreas específicas — a análise completa mostra quais.',
    premiumDescription: 'Seu perfil indica preferências vocacionais bem definidas. Você possui uma boa compreensão das suas aptidões e interesses profissionais. O relatório premium detalha as melhores carreiras e trajetórias para seu perfil único.',
    profiles: {
      realistic: 'Tendência definida',
      investigative: 'Tendência definida',
      artistic: 'Tendência definida',
      social: 'Tendência definida',
      enterprising: 'Tendência definida',
      conventional: 'Tendência definida'
    }
  },
  {
    minScore: 94,
    maxScore: 126,
    name: 'Perfil Consolidado',
    freeDescription: 'Perfil raro e consolidado. Suas inclinações vocacionais são poderosas e apontam para um propósito claro — a análise completa revela o mapa da sua carreira ideal.',
    premiumDescription: 'Seu perfil demonstra preferências vocacionais muito fortes e consistentes. Você tem uma visão clara do que busca profissionalmente e apresenta aptidões marcantes em áreas específicas. O relatório premium oferece insights avançados para maximizar seu potencial.',
    profiles: {
      realistic: 'Tendência consolidada',
      investigative: 'Tendência consolidada',
      artistic: 'Tendência consolidada',
      social: 'Tendência consolidada',
      enterprising: 'Tendência consolidada',
      conventional: 'Tendência consolidada'
    }
  }
];

export const getCareerResultBand = (score: number): CareerResultBand => {
  const band = careerResultBands.find(b => score >= b.minScore && score <= b.maxScore);
  return band || careerResultBands[0];
};

export const getHollandCode = (answers: (number | null)[]): string => {
  const topCategories = getTopCategories(answers);
  return topCategories.map(cat => cat[0].toUpperCase()).join('');
};
