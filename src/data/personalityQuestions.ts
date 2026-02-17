// Personality Test Questions - Big Five Model (OCEAN)
// Categories: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism

export type PersonalityCategory = 
  | 'openness'
  | 'conscientiousness' 
  | 'extraversion'
  | 'agreeableness'
  | 'neuroticism';

export interface PersonalityQuestion {
  id: number;
  question: string;
  options: string[];
  category: PersonalityCategory;
  isReversed: boolean; // Some questions are reverse-scored
}

export interface PersonalityResultBand {
  minScore: number;
  maxScore: number;
  name: string;
  freeDescription: string;
  premiumDescription: string;
  traits: {
    openness: string;
    conscientiousness: string;
    extraversion: string;
    agreeableness: string;
    neuroticism: string;
  };
}

export const categoryLabels: Record<PersonalityCategory, string> = {
  'openness': 'Abertura',
  'conscientiousness': 'Conscienciosidade',
  'extraversion': 'Extroversão',
  'agreeableness': 'Amabilidade',
  'neuroticism': 'Neuroticismo'
};

export const categoryDescriptions: Record<PersonalityCategory, string> = {
  'openness': 'Curiosidade intelectual, criatividade e abertura a novas experiências',
  'conscientiousness': 'Organização, disciplina e orientação para objetivos',
  'extraversion': 'Sociabilidade, energia e busca por estímulos externos',
  'agreeableness': 'Cooperação, empatia e consideração pelos outros',
  'neuroticism': 'Estabilidade emocional e capacidade de lidar com estresse'
};

// 40 questions - 8 per category
export const personalityQuestions: PersonalityQuestion[] = [
  // OPENNESS (8 questions)
  {
    id: 1,
    question: 'Você gosta de explorar ideias abstratas e conceitos filosóficos?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'openness',
    isReversed: false
  },
  {
    id: 2,
    question: 'Você prefere seguir rotinas estabelecidas ao invés de experimentar coisas novas?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'openness',
    isReversed: true
  },
  {
    id: 3,
    question: 'Você se sente atraído por formas de arte não convencionais ou experimentais?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'openness',
    isReversed: false
  },
  {
    id: 4,
    question: 'Você frequentemente imagina cenários diferentes para situações do dia a dia?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'openness',
    isReversed: false
  },
  {
    id: 5,
    question: 'Você tem dificuldade em aceitar pontos de vista muito diferentes dos seus?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'openness',
    isReversed: true
  },
  {
    id: 6,
    question: 'Você gosta de aprender sobre culturas e tradições diferentes da sua?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'openness',
    isReversed: false
  },
  {
    id: 7,
    question: 'Você prefere soluções práticas e comprovadas a abordagens inovadoras?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'openness',
    isReversed: true
  },
  {
    id: 8,
    question: 'Você frequentemente questiona tradições e convenções sociais?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'openness',
    isReversed: false
  },

  // CONSCIENTIOUSNESS (8 questions)
  {
    id: 9,
    question: 'Você mantém suas coisas organizadas e em seus devidos lugares?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'conscientiousness',
    isReversed: false
  },
  {
    id: 10,
    question: 'Você frequentemente deixa tarefas importantes para a última hora?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'conscientiousness',
    isReversed: true
  },
  {
    id: 11,
    question: 'Você segue um plano definido ao trabalhar em projetos?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'conscientiousness',
    isReversed: false
  },
  {
    id: 12,
    question: 'Você presta atenção aos detalhes em suas atividades?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'conscientiousness',
    isReversed: false
  },
  {
    id: 13,
    question: 'Você tem dificuldade em manter o foco em tarefas longas?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'conscientiousness',
    isReversed: true
  },
  {
    id: 14,
    question: 'Você cumpre suas promessas e compromissos?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'conscientiousness',
    isReversed: false
  },
  {
    id: 15,
    question: 'Você frequentemente age sem pensar nas consequências?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'conscientiousness',
    isReversed: true
  },
  {
    id: 16,
    question: 'Você estabelece metas claras e trabalha sistematicamente para alcançá-las?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'conscientiousness',
    isReversed: false
  },

  // EXTRAVERSION (8 questions)
  {
    id: 17,
    question: 'Você se sente energizado após interagir com muitas pessoas?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'extraversion',
    isReversed: false
  },
  {
    id: 18,
    question: 'Você prefere atividades solitárias a eventos sociais?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'extraversion',
    isReversed: true
  },
  {
    id: 19,
    question: 'Você costuma ser o centro das atenções em reuniões sociais?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'extraversion',
    isReversed: false
  },
  {
    id: 20,
    question: 'Você se sente confortável iniciando conversas com desconhecidos?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'extraversion',
    isReversed: false
  },
  {
    id: 21,
    question: 'Você precisa de tempo sozinho para recarregar suas energias?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'extraversion',
    isReversed: true
  },
  {
    id: 22,
    question: 'Você busca ativamente novas experiências e aventuras?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'extraversion',
    isReversed: false
  },
  {
    id: 23,
    question: 'Você se sente desconfortável sendo o líder de um grupo?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'extraversion',
    isReversed: true
  },
  {
    id: 24,
    question: 'Você expressa suas opiniões com entusiasmo em discussões?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'extraversion',
    isReversed: false
  },

  // AGREEABLENESS (8 questions)
  {
    id: 25,
    question: 'Você se preocupa genuinamente com o bem-estar dos outros?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'agreeableness',
    isReversed: false
  },
  {
    id: 26,
    question: 'Você tende a desconfiar das intenções das pessoas?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'agreeableness',
    isReversed: true
  },
  {
    id: 27,
    question: 'Você costuma ceder em discussões para manter a harmonia?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'agreeableness',
    isReversed: false
  },
  {
    id: 28,
    question: 'Você se oferece para ajudar mesmo quando não é solicitado?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'agreeableness',
    isReversed: false
  },
  {
    id: 29,
    question: 'Você acha difícil perdoar pessoas que o magoaram?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'agreeableness',
    isReversed: true
  },
  {
    id: 30,
    question: 'Você trata todas as pessoas com respeito, independentemente de sua posição?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'agreeableness',
    isReversed: false
  },
  {
    id: 31,
    question: 'Você fica irritado facilmente com os erros dos outros?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'agreeableness',
    isReversed: true
  },
  {
    id: 32,
    question: 'Você valoriza a cooperação mais do que a competição?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'agreeableness',
    isReversed: false
  },

  // NEUROTICISM (8 questions)
  {
    id: 33,
    question: 'Você se preocupa frequentemente com coisas que podem dar errado?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'neuroticism',
    isReversed: false
  },
  {
    id: 34,
    question: 'Você mantém a calma sob pressão?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'neuroticism',
    isReversed: true
  },
  {
    id: 35,
    question: 'Você experimenta mudanças de humor frequentes?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'neuroticism',
    isReversed: false
  },
  {
    id: 36,
    question: 'Você se sente ansioso em situações novas ou incertas?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'neuroticism',
    isReversed: false
  },
  {
    id: 37,
    question: 'Você se recupera rapidamente de situações estressantes?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'neuroticism',
    isReversed: true
  },
  {
    id: 38,
    question: 'Você tende a se sentir triste ou melancólico sem motivo aparente?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'neuroticism',
    isReversed: false
  },
  {
    id: 39,
    question: 'Você se sente seguro e confiante na maioria das situações?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'neuroticism',
    isReversed: true
  },
  {
    id: 40,
    question: 'Você fica facilmente irritado por pequenos contratempos?',
    options: [
      'Discordo totalmente',
      'Discordo parcialmente',
      'Concordo parcialmente',
      'Concordo totalmente'
    ],
    category: 'neuroticism',
    isReversed: false
  }
];

// Result bands based on overall score (0-120 possible, 40 questions × 0-3 points each)
export const personalityResultBands: PersonalityResultBand[] = [
  {
    minScore: 0,
    maxScore: 30,
    name: 'Perfil em Desenvolvimento',
    freeDescription: 'Seu perfil revela dimensões da sua personalidade que operam de forma silenciosa — traços que explicam decisões e comportamentos que você repete sem perceber. Há características que nem sempre são conscientes, mas que influenciam profundamente seus relacionamentos e escolhas. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.',
    premiumDescription: 'Análise detalhada dos cinco grandes traços de personalidade com recomendações específicas para seu desenvolvimento pessoal e profissional.',
    traits: {
      openness: 'Baixa abertura a novas experiências',
      conscientiousness: 'Necessita desenvolver organização',
      extraversion: 'Tendência introvertida',
      agreeableness: 'Pode ser mais cooperativo',
      neuroticism: 'Estabilidade emocional em desenvolvimento'
    }
  },
  {
    minScore: 31,
    maxScore: 60,
    name: 'Perfil Equilibrado Inicial',
    freeDescription: 'Suas respostas indicam contrastes internos fascinantes — uma combinação incomum de traços que cria tensões produtivas na sua personalidade. Detectamos um padrão pouco percebido entre suas dimensões psicológicas que explica dinâmicas importantes do seu dia a dia. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.',
    premiumDescription: 'Relatório completo com mapeamento dos seus pontos fortes e áreas de desenvolvimento nos cinco grandes traços.',
    traits: {
      openness: 'Abertura moderada',
      conscientiousness: 'Organização em desenvolvimento',
      extraversion: 'Equilíbrio social',
      agreeableness: 'Cooperação moderada',
      neuroticism: 'Estabilidade emocional moderada'
    }
  },
  {
    minScore: 61,
    maxScore: 90,
    name: 'Perfil Equilibrado',
    freeDescription: 'Seu padrão mental mostra uma arquitetura de personalidade rara — conexões entre seus cinco traços fundamentais que criam um perfil com características que nem sempre são conscientes. Há dimensões do seu funcionamento psicológico que explicam por que você se destaca em contextos específicos. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.',
    premiumDescription: 'Análise aprofundada do seu perfil equilibrado com estratégias para potencializar seus pontos fortes.',
    traits: {
      openness: 'Boa abertura a experiências',
      conscientiousness: 'Bem organizado e focado',
      extraversion: 'Sociabilidade saudável',
      agreeableness: 'Bom nível de cooperação',
      neuroticism: 'Boa estabilidade emocional'
    }
  },
  {
    minScore: 91,
    maxScore: 120,
    name: 'Perfil Altamente Desenvolvido',
    freeDescription: 'Seu perfil revela um nível de desenvolvimento psicológico que poucos alcançam — uma combinação incomum de maturidade emocional, abertura e conscienciosidade. Seus traços formam um mosaico que a psicometria classifica como excepcional, com padrões pouco percebidos que moldam seu impacto nas pessoas ao redor. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.',
    premiumDescription: 'Relatório premium com análise detalhada do seu perfil excepcional e orientações para carreiras e relacionamentos.',
    traits: {
      openness: 'Alta abertura e criatividade',
      conscientiousness: 'Excelente organização e disciplina',
      extraversion: 'Forte presença social',
      agreeableness: 'Alta cooperação e empatia',
      neuroticism: 'Excelente estabilidade emocional'
    }
  }
];

// Calculate score for a specific category
export const calculateCategoryScore = (
  answers: (number | null)[],
  category: PersonalityCategory
): number => {
  return personalityQuestions.reduce((score, question, index) => {
    if (question.category !== category || answers[index] === null) return score;
    
    const answer = answers[index]!;
    // Reversed questions: higher answer = lower trait score
    const adjustedScore = question.isReversed ? 3 - answer : answer;
    return score + adjustedScore;
  }, 0);
};

// Calculate total score
export const calculateTotalScore = (answers: (number | null)[]): number => {
  const categories: PersonalityCategory[] = [
    'openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'
  ];
  
  return categories.reduce((total, category) => {
    return total + calculateCategoryScore(answers, category);
  }, 0);
};

// Get category scores as percentages (0-100)
export const getCategoryPercentages = (answers: (number | null)[]): Record<PersonalityCategory, number> => {
  const maxPerCategory = 24; // 8 questions × 3 max points each
  
  return {
    openness: Math.round((calculateCategoryScore(answers, 'openness') / maxPerCategory) * 100),
    conscientiousness: Math.round((calculateCategoryScore(answers, 'conscientiousness') / maxPerCategory) * 100),
    extraversion: Math.round((calculateCategoryScore(answers, 'extraversion') / maxPerCategory) * 100),
    agreeableness: Math.round((calculateCategoryScore(answers, 'agreeableness') / maxPerCategory) * 100),
    neuroticism: Math.round((100 - (calculateCategoryScore(answers, 'neuroticism') / maxPerCategory) * 100)) // Inverted for "emotional stability"
  };
};

// Get result band based on total score
export const getPersonalityResultBand = (score: number): PersonalityResultBand => {
  return personalityResultBands.find(
    band => score >= band.minScore && score <= band.maxScore
  ) || personalityResultBands[0];
};
