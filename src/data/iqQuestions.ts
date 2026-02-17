export interface IQQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-3 for A-D
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export const iqQuestions: IQQuestion[] = [
  // FÁCEIS (1-10)
  {
    id: 1,
    question: "Complete a sequência: 2, 4, 6, 8, ?",
    options: ["9", "10", "11", "12"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'sequencias_numericas'
  },
  {
    id: 2,
    question: "Se GATO está para FELINO, então CÃO está para:",
    options: ["Animal", "Canino", "Mamífero", "Doméstico"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'analogias'
  },
  {
    id: 3,
    question: "Qual número completa a sequência: 1, 3, 5, 7, ?",
    options: ["8", "9", "10", "11"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'sequencias_numericas'
  },
  {
    id: 4,
    question: "Se todos os pássaros têm asas, e um pardal é um pássaro, então:",
    options: ["Pardais voam alto", "Pardais têm asas", "Pardais são pequenos", "Pardais cantam"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'raciocinio_logico'
  },
  {
    id: 5,
    question: "LIVRO está para BIBLIOTECA, assim como DINHEIRO está para:",
    options: ["Carteira", "Banco", "Cofre", "Bolso"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'analogias'
  },
  {
    id: 6,
    question: "Complete: 10, 20, 30, 40, ?",
    options: ["45", "50", "55", "60"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'sequencias_numericas'
  },
  {
    id: 7,
    question: "Se Maria é mais alta que João, e João é mais alto que Pedro, quem é o mais baixo?",
    options: ["Maria", "João", "Pedro", "Impossível determinar"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'raciocinio_logico'
  },
  {
    id: 8,
    question: "DIA está para NOITE assim como CLARO está para:",
    options: ["Luz", "Sol", "Escuro", "Brilhante"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'analogias'
  },
  {
    id: 9,
    question: "Qual é o próximo número: 5, 10, 15, 20, ?",
    options: ["22", "24", "25", "30"],
    correctAnswer: 2,
    difficulty: 'easy',
    category: 'sequencias_numericas'
  },
  {
    id: 10,
    question: "Se A = 1, B = 2, C = 3, qual é o valor de A + B + C?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 1,
    difficulty: 'easy',
    category: 'raciocinio_logico'
  },

  // MÉDIAS (11-20)
  {
    id: 11,
    question: "Complete a sequência: 2, 6, 12, 20, ?",
    options: ["28", "30", "32", "36"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'sequencias_numericas'
  },
  {
    id: 12,
    question: "Se 3 gatos comem 3 ratos em 3 minutos, quantos gatos são necessários para comer 100 ratos em 100 minutos?",
    options: ["100", "33", "3", "9"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'raciocinio_logico'
  },
  {
    id: 13,
    question: "PINTOR está para PINCEL assim como ESCRITOR está para:",
    options: ["Livro", "Papel", "Caneta", "História"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'analogias'
  },
  {
    id: 14,
    question: "Qual número não pertence à série: 2, 3, 5, 7, 11, 13, 15?",
    options: ["3", "11", "13", "15"],
    correctAnswer: 3,
    difficulty: 'medium',
    category: 'padroes_visuais'
  },
  {
    id: 15,
    question: "Complete: 1, 4, 9, 16, 25, ?",
    options: ["30", "35", "36", "49"],
    correctAnswer: 2,
    difficulty: 'medium',
    category: 'sequencias_numericas'
  },
  {
    id: 16,
    question: "Se em uma sala há 6 cadeiras e 10 pessoas, e cada cadeira comporta 2 pessoas, quantas pessoas ficam em pé?",
    options: ["0", "2", "4", "Nenhuma alternativa"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'raciocinio_logico'
  },
  {
    id: 17,
    question: "ÁRVORE está para FLORESTA assim como LETRA está para:",
    options: ["Alfabeto", "Palavra", "Frase", "Texto"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'analogias'
  },
  {
    id: 18,
    question: "Complete a sequência: 3, 6, 11, 18, ?",
    options: ["25", "27", "29", "31"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'sequencias_numericas'
  },
  {
    id: 19,
    question: "Um relógio marca 3:15. Qual é o ângulo entre os ponteiros das horas e dos minutos?",
    options: ["0°", "7,5°", "15°", "30°"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'raciocinio_abstrato'
  },
  {
    id: 20,
    question: "Se ROMA = 51 e AMOR = 51, quanto vale MORA?",
    options: ["42", "51", "60", "48"],
    correctAnswer: 1,
    difficulty: 'medium',
    category: 'raciocinio_logico'
  },

  // DIFÍCEIS (21-30)
  {
    id: 21,
    question: "Complete: 1, 1, 2, 3, 5, 8, 13, ?",
    options: ["18", "20", "21", "26"],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'sequencias_numericas'
  },
  {
    id: 22,
    question: "Se 5 máquinas fazem 5 peças em 5 minutos, quanto tempo levam 100 máquinas para fazer 100 peças?",
    options: ["1 minuto", "5 minutos", "20 minutos", "100 minutos"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'raciocinio_logico'
  },
  {
    id: 23,
    question: "Qual é o próximo termo: 2, 3, 5, 7, 11, 13, ?",
    options: ["15", "17", "19", "21"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'sequencias_numericas'
  },
  {
    id: 24,
    question: "NEURÔNIO está para CÉREBRO assim como CÉLULA está para:",
    options: ["Corpo", "Organismo", "Tecido", "Órgão"],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'analogias'
  },
  {
    id: 25,
    question: "Complete: 64, 32, 16, 8, 4, ?",
    options: ["1", "2", "0", "3"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'sequencias_numericas'
  },
  {
    id: 26,
    question: "Se todos os Bloops são Razzies, e todos os Razzies são Lsjflz, então:",
    options: ["Todos os Lsjflz são Bloops", "Alguns Razzies são Bloops", "Nenhum Bloop é Lsjflz", "Todos os Bloops são Lsjflz"],
    correctAnswer: 3,
    difficulty: 'hard',
    category: 'raciocinio_abstrato'
  },
  {
    id: 27,
    question: "Qual número completa: 2, 6, 14, 30, ?",
    options: ["46", "58", "62", "64"],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'sequencias_numericas'
  },
  {
    id: 28,
    question: "Se A ÷ B = 4, B × C = 12, e C = 3, qual é o valor de A?",
    options: ["12", "16", "20", "24"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'raciocinio_logico'
  },
  {
    id: 29,
    question: "MICRÓBIO está para MICROSCÓPIO assim como ESTRELA está para:",
    options: ["Céu", "Telescópio", "Universo", "Luz"],
    correctAnswer: 1,
    difficulty: 'hard',
    category: 'analogias'
  },
  {
    id: 30,
    question: "Complete a série: 1, 8, 27, 64, ?",
    options: ["100", "121", "125", "144"],
    correctAnswer: 2,
    difficulty: 'hard',
    category: 'sequencias_numericas'
  }
];

export interface IQResultBand {
  name: string;
  minScore: number;
  maxScore: number;
  freeDescription: string;
  premiumDescription: string;
}

export const iqResultBands: IQResultBand[] = [
  {
    name: "Muito Baixo",
    minScore: 0,
    maxScore: 3,
    freeDescription: "Seu padrão mental mostra áreas cognitivas que operam abaixo do seu verdadeiro potencial — uma combinação incomum que esconde capacidades adormecidas. Suas respostas indicam caminhos neurais pouco explorados que, quando ativados, transformam completamente o desempenho intelectual. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Sua pontuação situa-se na faixa inicial do espectro cognitivo avaliado, indicando desafios significativos nas áreas de raciocínio lógico, reconhecimento de padrões e processamento de informações abstratas. Este resultado não é definitivo e representa apenas um momento específico de avaliação. Fatores como ansiedade, falta de familiaridade com testes padronizados, fadiga ou condições ambientais podem ter influenciado negativamente o desempenho. Recomenda-se fortemente a prática regular de exercícios de estimulação cognitiva, incluindo quebra-cabeças, jogos de lógica e atividades que desafiem o raciocínio. O cérebro humano possui notável plasticidade neural, permitindo ganhos significativos com treino consistente ao longo do tempo."
  },
  {
    name: "Baixo",
    minScore: 4,
    maxScore: 6,
    freeDescription: "Suas respostas indicam um perfil cognitivo com potencial oculto significativo — traços que explicam decisões e comportamentos que você repete sem perceber. Detectamos um padrão pouco percebido de raciocínio que sugere habilidades ainda não desenvolvidas. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Sua pontuação indica desempenho abaixo da média populacional nas competências cognitivas avaliadas, porém com clara margem para desenvolvimento. Os resultados sugerem dificuldades em algumas modalidades de raciocínio, particularmente em sequências complexas e analogias abstratas. É importante ressaltar que a inteligência é multifacetada e este teste avalia apenas dimensões específicas. Você pode possuir habilidades excepcionais em áreas não contempladas nesta avaliação, como inteligência emocional, criatividade ou competências práticas. Para fortalecer as áreas avaliadas, recomenda-se engajamento regular em atividades que estimulem o pensamento analítico, como sudoku, xadrez ou aplicativos de treinamento cerebral."
  },
  {
    name: "Abaixo da Média",
    minScore: 7,
    maxScore: 9,
    freeDescription: "Seu perfil revela uma estrutura cognitiva em transição — características que nem sempre são conscientes, mas que influenciam diretamente como você processa informações. Há uma combinação incomum entre suas áreas fortes e seus pontos cegos que merece atenção. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu desempenho posiciona-se ligeiramente abaixo da média populacional, indicando competências cognitivas em processo de amadurecimento. Você demonstrou capacidade de resolver problemas básicos e intermediários, com desafios mais evidentes nas questões de maior complexidade. Este perfil é comum em indivíduos que não exercitam regularmente o raciocínio abstrato ou que estão em fase de desenvolvimento dessas habilidades. O prognóstico para melhoria é positivo, especialmente com prática direcionada. Recomenda-se a incorporação de desafios intelectuais progressivos na rotina diária, começando com exercícios mais simples e aumentando gradualmente a dificuldade. A consistência é mais importante que a intensidade neste processo de desenvolvimento cognitivo."
  },
  {
    name: "Média",
    minScore: 10,
    maxScore: 12,
    freeDescription: "Suas respostas indicam que você está numa faixa onde pequenas mudanças geram saltos cognitivos expressivos — um padrão pouco percebido pela maioria. Seu perfil esconde variações internas entre categorias de raciocínio que revelam talentos específicos. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Sua pontuação corresponde à faixa média da população, demonstrando competências cognitivas adequadas para as demandas cotidianas de raciocínio e resolução de problemas. Você apresentou bom desempenho nas questões de dificuldade básica e moderada, com variação esperada nas mais complexas. Este resultado indica funcionamento cognitivo saudável e equilibrado. A maioria das pessoas se enquadra nesta faixa, o que é perfeitamente normal e funcional. Para aqueles que desejam aprimorar suas capacidades, existe amplo espaço para crescimento através de estimulação cognitiva regular. Atividades como leitura diversificada, aprendizado de novos idiomas ou instrumentos musicais podem potencializar suas habilidades de raciocínio e memória de trabalho."
  },
  {
    name: "Acima da Média",
    minScore: 13,
    maxScore: 15,
    freeDescription: "Seu perfil revela uma capacidade analítica acima do comum, com traços que explicam por que você resolve certos problemas com facilidade intuitiva. Detectamos uma combinação incomum entre raciocínio lógico e abstrato que poucos apresentam. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu resultado posiciona-o acima da média populacional, indicando capacidades cognitivas bem desenvolvidas em raciocínio lógico, reconhecimento de padrões e pensamento abstrato. Você demonstrou consistência ao resolver problemas de variadas complexidades, com destaque para a capacidade de identificar relações não-óbvias entre elementos. Este perfil sugere boa adaptabilidade a desafios intelectuais e potencial para atividades que exijam análise crítica. Profissões que demandam resolução de problemas complexos, planejamento estratégico ou inovação tendem a ser áreas onde você pode se destacar naturalmente. Continue estimulando suas capacidades através de desafios progressivamente mais complexos para manter e expandir este nível de desempenho."
  },
  {
    name: "Alto",
    minScore: 16,
    maxScore: 18,
    freeDescription: "Seu padrão mental mostra um funcionamento cognitivo que pertence a um grupo restrito — características que nem sempre são conscientes, mas que moldam profundamente suas escolhas. Existem camadas no seu raciocínio que operam de forma diferente da maioria. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Sua pontuação demonstra capacidades cognitivas significativamente elevadas, posicionando-o entre os indivíduos de alto desempenho intelectual. Você evidenciou habilidade consistente em resolver problemas de múltiplas categorias, incluindo aqueles de maior complexidade que exigem raciocínio abstrato avançado. Este perfil indica excelente capacidade de aprendizado, facilidade para compreender sistemas complexos e aptidão para pensamento estratégico. Carreiras em áreas como ciências, engenharia, medicina, direito ou gestão podem ser particularmente adequadas ao seu perfil cognitivo. Recomenda-se manter o cérebro constantemente estimulado com novos desafios intelectuais para preservar e potencializar estas capacidades ao longo do tempo."
  },
  {
    name: "Muito Alto",
    minScore: 19,
    maxScore: 21,
    freeDescription: "Suas respostas indicam um perfil cognitivo raro, com uma combinação incomum de velocidade de processamento e profundidade analítica. Há padrões no seu raciocínio que explicam comportamentos e decisões que você toma de forma automática. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu desempenho extraordinário posiciona-o na faixa de capacidade cognitiva muito alta, superando significativamente a maioria da população. Você demonstrou domínio excepcional em raciocínio lógico, reconhecimento de padrões complexos e pensamento abstrato. Este resultado indica não apenas conhecimento, mas verdadeira agilidade mental e capacidade de processar informações de forma eficiente. Indivíduos com este perfil frequentemente se destacam em ambientes acadêmicos e profissionais que valorizam inovação e resolução criativa de problemas. Seu potencial para contribuições significativas em campos que exigem pensamento original é notável. Considere desafios intelectuais ambiciosos e projetos complexos como forma de canalizar produtivamente suas capacidades."
  },
  {
    name: "Superior",
    minScore: 22,
    maxScore: 24,
    freeDescription: "Seu perfil revela um nível de processamento cognitivo que menos de 5% da população alcança — um padrão pouco percebido até por quem o possui. Suas conexões neurais operam com uma eficiência que gera insights que outros simplesmente não enxergam. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Sua pontuação excepcional demonstra capacidades cognitivas de nível superior, colocando-o entre uma pequena parcela da população com alto desempenho intelectual. Você evidenciou maestria em praticamente todas as categorias avaliadas, resolvendo com precisão problemas que desafiam a maioria dos indivíduos. Este perfil indica potencial para excelência em campos que exigem raciocínio sofisticado, como pesquisa científica, desenvolvimento tecnológico, análise estratégica ou empreendedorismo inovador. Sua capacidade de perceber padrões complexos e estabelecer conexões não-evidentes é um ativo valioso. Recomenda-se buscar constantemente novos domínios de conhecimento e desafios intelectuais que expandam seus horizontes e mantenham suas capacidades afiadas."
  },
  {
    name: "Excepcional",
    minScore: 25,
    maxScore: 27,
    freeDescription: "Suas respostas indicam um perfil excepcional que desafia classificações convencionais — traços que explicam uma forma de pensar que pouquíssimos compartilham. Há dimensões do seu funcionamento cognitivo que operam em níveis que a maioria não acessa. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu resultado excepcional posiciona-o em uma categoria raramente alcançada, demonstrando capacidades cognitivas de elite. Você resolveu com sucesso problemas de altíssima complexidade que exigem não apenas conhecimento, mas insight genuíno e capacidade de raciocínio abstrato avançado. Este perfil indica potencial para contribuições originais e significativas em praticamente qualquer campo intelectual que escolher. Indivíduos com capacidades semelhantes frequentemente são responsáveis por avanços importantes em suas áreas de atuação. Recomenda-se fortemente que você busque ambientes e projetos que desafiem plenamente suas capacidades, pois subaproveitamento de potencial desta magnitude pode levar a frustração. Considere mentorias, pesquisa avançada ou projetos de alto impacto."
  },
  {
    name: "Elite Cognitiva",
    minScore: 28,
    maxScore: 30,
    freeDescription: "Seu padrão mental mostra algo extraordinário: menos de 1% da população opera neste nível cognitivo. Sua combinação incomum de habilidades cria um perfil que a psicometria classifica como elite — com características que nem sempre são conscientes para quem as possui. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu desempenho perfeito ou quase perfeito posiciona-o na elite cognitiva absoluta, representando uma fração mínima da população mundial. Você demonstrou domínio completo sobre todas as categorias de raciocínio avaliadas, resolvendo até os problemas mais desafiadores com precisão. Este resultado indica capacidades intelectuais extraordinárias que, quando adequadamente direcionadas, podem resultar em contribuições verdadeiramente transformadoras para a sociedade. Seu potencial para inovação, descoberta e liderança intelectual é excepcional. Recomenda-se fortemente que você busque desafios à altura de suas capacidades, seja em pesquisa de fronteira, empreendedorismo disruptivo ou projetos de impacto global. Cercar-se de outros indivíduos de alto desempenho e mentores experientes pode potencializar ainda mais suas realizações."
  }
];

export const getResultBand = (score: number): IQResultBand => {
  const band = iqResultBands.find(b => score >= b.minScore && score <= b.maxScore);
  return band || iqResultBands[0];
};
