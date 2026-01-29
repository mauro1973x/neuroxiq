// Political Orientation Test Questions
// Categories: economic, social, authority, values
// Score: 0-2 per question (0=disagree, 1=neutral, 2=agree)
// Higher scores = more conservative/authoritarian orientation

export type PoliticalCategory = 'economic' | 'social' | 'authority' | 'values';

export interface PoliticalQuestion {
  id: number;
  question: string;
  options: string[];
  category: PoliticalCategory;
  reverseScored: boolean; // If true, agreeing gives lower score (more progressive)
}

export interface PoliticalResultBand {
  id: string;
  name: string;
  band_order: number;
  min_score: number;
  max_score: number;
  economic_axis: string;
  social_axis: string;
  authority_axis: string;
  free_description: string;
  premium_description: string;
  characteristics: string[];
  famous_figures: string[];
  compatible_careers: string[];
  strengths: string[];
  challenges: string[];
}

export const categoryLabels: Record<PoliticalCategory, string> = {
  economic: 'Economia',
  social: 'Sociedade',
  authority: 'Autoridade',
  values: 'Valores'
};

export const categoryDescriptions: Record<PoliticalCategory, string> = {
  economic: 'Visões sobre o papel do Estado na economia, distribuição de riqueza e mercado',
  social: 'Posições sobre liberdades individuais, direitos civis e questões sociais',
  authority: 'Percepções sobre hierarquia, ordem social e papel das instituições',
  values: 'Orientações sobre tradição, mudança social e identidade cultural'
};

// 40 questions - 10 per category
export const politicalQuestions: PoliticalQuestion[] = [
  // ECONOMIC (10 questions)
  {
    id: 1,
    question: 'O Estado deve garantir serviços públicos universais como saúde e educação, mesmo que isso exija impostos mais altos.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: true // Concordar = mais progressista
  },
  {
    id: 2,
    question: 'A iniciativa privada é mais eficiente que o Estado na prestação de serviços.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: false
  },
  {
    id: 3,
    question: 'Políticas de redistribuição de renda são essenciais para uma sociedade justa.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: true
  },
  {
    id: 4,
    question: 'Impostos sobre grandes fortunas prejudicam o crescimento econômico.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: false
  },
  {
    id: 5,
    question: 'Empresas estatais estratégicas devem ser mantidas sob controle do governo.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: true
  },
  {
    id: 6,
    question: 'O livre mercado, sem interferência estatal, é o melhor regulador da economia.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: false
  },
  {
    id: 7,
    question: 'Sindicatos são importantes para proteger os direitos dos trabalhadores.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: true
  },
  {
    id: 8,
    question: 'Reduzir regulamentações sobre empresas estimula o empreendedorismo.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: false
  },
  {
    id: 9,
    question: 'O salário mínimo deve ser determinado pelo mercado, não pelo governo.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: false
  },
  {
    id: 10,
    question: 'O Estado deve intervir para reduzir a desigualdade entre ricos e pobres.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'economic',
    reverseScored: true
  },

  // SOCIAL (10 questions)
  {
    id: 11,
    question: 'A diversidade cultural enriquece a sociedade.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: true
  },
  {
    id: 12,
    question: 'O casamento deve ser definido exclusivamente como união entre homem e mulher.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: false
  },
  {
    id: 13,
    question: 'Políticas de ação afirmativa são necessárias para corrigir injustiças históricas.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: true
  },
  {
    id: 14,
    question: 'A imigração deve ser rigorosamente controlada para proteger empregos nacionais.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: false
  },
  {
    id: 15,
    question: 'O aborto deve ser uma decisão da mulher, sem interferência do Estado.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: true
  },
  {
    id: 16,
    question: 'A identidade nacional deve ser preservada contra influências estrangeiras.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: false
  },
  {
    id: 17,
    question: 'Minorias devem ter proteções legais específicas contra discriminação.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: true
  },
  {
    id: 18,
    question: 'A família tradicional é a base mais importante da sociedade.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: false
  },
  {
    id: 19,
    question: 'A legalização de drogas reduziria problemas sociais relacionados ao tráfico.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: true
  },
  {
    id: 20,
    question: 'Escolas devem ensinar valores religiosos e morais tradicionais.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'social',
    reverseScored: false
  },

  // AUTHORITY (10 questions)
  {
    id: 21,
    question: 'A democracia direta é preferível à representação por políticos profissionais.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: true
  },
  {
    id: 22,
    question: 'Um líder forte é mais importante que processos democráticos lentos.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: false
  },
  {
    id: 23,
    question: 'A sociedade civil organizada deve ter mais poder que o governo central.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: true
  },
  {
    id: 24,
    question: 'As Forças Armadas devem ter papel ativo na manutenção da ordem pública.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: false
  },
  {
    id: 25,
    question: 'A liberdade de expressão deve ser irrestrita, mesmo para opiniões ofensivas.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: true
  },
  {
    id: 26,
    question: 'A segurança nacional justifica restrições temporárias às liberdades individuais.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: false
  },
  {
    id: 27,
    question: 'Descentralização do poder é melhor que governo central forte.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: true
  },
  {
    id: 28,
    question: 'A obediência às autoridades é uma virtude essencial para a ordem social.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: false
  },
  {
    id: 29,
    question: 'Os cidadãos devem poder questionar abertamente decisões governamentais.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: true
  },
  {
    id: 30,
    question: 'Disciplina e hierarquia são mais importantes que liberdade individual.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'authority',
    reverseScored: false
  },

  // VALUES (10 questions)
  {
    id: 31,
    question: 'O progresso social requer mudanças nas tradições estabelecidas.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: true
  },
  {
    id: 32,
    question: 'A religião deve ter papel importante nas decisões políticas.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: false
  },
  {
    id: 33,
    question: 'O meio ambiente deve ser protegido mesmo às custas do crescimento econômico.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: true
  },
  {
    id: 34,
    question: 'Os valores da geração passada eram melhores que os atuais.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: false
  },
  {
    id: 35,
    question: 'A ciência deve guiar as políticas públicas, não crenças pessoais.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: true
  },
  {
    id: 36,
    question: 'Patriotismo e amor à pátria são virtudes que devem ser cultivadas.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: false
  },
  {
    id: 37,
    question: 'A globalização beneficia mais do que prejudica a sociedade.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: true
  },
  {
    id: 38,
    question: 'A moral absoluta existe e deve guiar o comportamento social.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: false
  },
  {
    id: 39,
    question: 'A cooperação internacional é mais importante que interesses nacionais.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: true
  },
  {
    id: 40,
    question: 'A tradição e os costumes são guias melhores que ideias novas não testadas.',
    options: ['Discordo', 'Neutro', 'Concordo'],
    category: 'values',
    reverseScored: false
  }
];

// Score calculation: 0-100 scale (0=most progressive/libertarian, 100=most conservative/authoritarian)
export const calculatePoliticalScore = (answers: (number | null)[]): number => {
  let totalScore = 0;
  let answeredQuestions = 0;

  politicalQuestions.forEach((question, index) => {
    const answer = answers[index];
    if (answer !== null) {
      answeredQuestions++;
      if (question.reverseScored) {
        // Reverse: 0 (concordo) -> 2, 1 -> 1, 2 (discordo) -> 0
        totalScore += (2 - answer);
      } else {
        totalScore += answer;
      }
    }
  });

  // Normalize to 0-100 scale
  const maxPossibleScore = 40 * 2; // 40 questions * 2 max per question
  return Math.round((totalScore / maxPossibleScore) * 100);
};

export const calculateCategoryScores = (answers: (number | null)[]): Record<PoliticalCategory, number> => {
  const categoryScores: Record<PoliticalCategory, { total: number; count: number }> = {
    economic: { total: 0, count: 0 },
    social: { total: 0, count: 0 },
    authority: { total: 0, count: 0 },
    values: { total: 0, count: 0 }
  };

  politicalQuestions.forEach((question, index) => {
    const answer = answers[index];
    if (answer !== null) {
      const score = question.reverseScored ? (2 - answer) : answer;
      categoryScores[question.category].total += score;
      categoryScores[question.category].count++;
    }
  });

  const result: Record<PoliticalCategory, number> = {
    economic: 0,
    social: 0,
    authority: 0,
    values: 0
  };

  (Object.keys(categoryScores) as PoliticalCategory[]).forEach(category => {
    const { total, count } = categoryScores[category];
    if (count > 0) {
      // Normalize to 0-100 scale (10 questions * 2 max = 20 per category)
      result[category] = Math.round((total / 20) * 100);
    }
  });

  return result;
};

export const getPoliticalResultBand = (score: number, bands: PoliticalResultBand[]): PoliticalResultBand | null => {
  return bands.find(band => score >= band.min_score && score <= band.max_score) || null;
};

// Labels for spectrum visualization
export const spectrumLabels = {
  economic: { left: 'Coletivismo', right: 'Livre Mercado' },
  social: { left: 'Progressista', right: 'Conservador' },
  authority: { left: 'Libertário', right: 'Autoritário' },
  values: { left: 'Globalista', right: 'Nacionalista' }
};
