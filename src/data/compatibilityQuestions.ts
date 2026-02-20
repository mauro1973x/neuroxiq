export interface CompatibilityQuestion {
  id: number;
  question: string;
  category: 'communication' | 'values' | 'emotional-support' | 'lifestyle' | 'chemistry';
}

export const compatibilityQuestions: CompatibilityQuestion[] = [
  // Comunicação (1–6)
  { id: 1, question: "Consigo falar abertamente sobre sentimentos.", category: 'communication' },
  { id: 2, question: "Prefiro resolver conflitos rapidamente.", category: 'communication' },
  { id: 3, question: "Sou transparente em relacionamentos.", category: 'communication' },
  { id: 4, question: "Valorizo diálogo constante.", category: 'communication' },
  { id: 5, question: "Escuto antes de reagir.", category: 'communication' },
  { id: 6, question: "Consigo pedir desculpas.", category: 'communication' },
  // Valores de vida (7–12)
  { id: 7, question: "Valorizo estabilidade emocional.", category: 'values' },
  { id: 8, question: "Quero um relacionamento duradouro.", category: 'values' },
  { id: 9, question: "Tenho objetivos claros de vida.", category: 'values' },
  { id: 10, question: "Busco crescimento financeiro a dois.", category: 'values' },
  { id: 11, question: "Dou importância à fidelidade.", category: 'values' },
  { id: 12, question: "Tenho valores familiares fortes.", category: 'values' },
  // Apoio emocional (13–18)
  { id: 13, question: "Gosto de demonstrar carinho.", category: 'emotional-support' },
  { id: 14, question: "Preciso de atenção emocional.", category: 'emotional-support' },
  { id: 15, question: "Me sinto confortável em demonstrar amor.", category: 'emotional-support' },
  { id: 16, question: "Busco parceria verdadeira.", category: 'emotional-support' },
  { id: 17, question: "Apoio meu parceiro em momentos difíceis.", category: 'emotional-support' },
  { id: 18, question: "Gosto de proximidade emocional.", category: 'emotional-support' },
  // Estilo de vida (19–24)
  { id: 19, question: "Gosto de rotina organizada.", category: 'lifestyle' },
  { id: 20, question: "Valorizo tempo de qualidade juntos.", category: 'lifestyle' },
  { id: 21, question: "Gosto de planejar o futuro.", category: 'lifestyle' },
  { id: 22, question: "Prefiro estabilidade a mudanças constantes.", category: 'lifestyle' },
  { id: 23, question: "Tenho hábitos previsíveis.", category: 'lifestyle' },
  { id: 24, question: "Equilibro bem vida pessoal e relacionamento.", category: 'lifestyle' },
  // Conexão e química (25–30)
  { id: 25, question: "Acredito em forte conexão emocional.", category: 'chemistry' },
  { id: 26, question: "A atração física é importante.", category: 'chemistry' },
  { id: 27, question: "Preciso de intimidade emocional.", category: 'chemistry' },
  { id: 28, question: "Busco profundidade na relação.", category: 'chemistry' },
  { id: 29, question: "Gosto de relações intensas.", category: 'chemistry' },
  { id: 30, question: "Quero construir algo sólido com alguém.", category: 'chemistry' },
];

export const categoryLabels: Record<CompatibilityQuestion['category'], string> = {
  'communication': 'Comunicação',
  'values': 'Valores de Vida',
  'emotional-support': 'Apoio Emocional',
  'lifestyle': 'Estilo de Vida',
  'chemistry': 'Conexão e Química',
};

export interface CompatibilityResultBand {
  minPercent: number;
  maxPercent: number;
  name: string;
  compatibilityLevel: string;
  freeDescription: string;
  // Premium sections
  premiumDescription: string;
  overviewAnalysis: string;
  strengths: string[];
  strengthsDetail: Record<string, string>;
  challenges: string[];
  challengesDetail: Record<string, string>;
  shortTermForecast: string;
  mediumTermForecast: string;
  longTermForecast: string;
  psychologicalProfile: string;
  stabilityAnalysis: string;
  emotionalMaturity: string;
  recommendations: string[];
  conclusion: string;
  risks: string[];
  idealPartnerProfile: string;
}

// ── 10 FAIXAS DE COMPATIBILIDADE (0–10, 11–20, ..., 91–100) ─────────────────

export const compatibilityResultBands: CompatibilityResultBand[] = [
  // ── FAIXA 1: 91–100 → Alma Gêmea ─────────────────────────────────────────
  {
    minPercent: 91,
    maxPercent: 100,
    name: "Compatibilidade de Alma Gêmea",
    compatibilityLevel: "91–100%",
    freeDescription: "Seu perfil revela padrões afetivos extraordinariamente coesos — uma combinação raríssima que explica por que certas conexões mudam a vida de forma permanente. Há algo no seu jeito de amar que poucas pessoas desenvolvem de forma tão integrada. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você atingiu o nível mais elevado de coerência afetiva e relacional medido pelo sistema NEUROX. Seus valores, padrões de comunicação, necessidades emocionais e visão de futuro formam um sistema interno extraordinariamente alinhado. Pessoas nessa faixa não apenas buscam conexão profunda — elas são capazes de sustentá-la de maneira genuína e duradoura.",
    overviewAnalysis: "Seu perfil de compatibilidade é excepcional em todas as cinco dimensões avaliadas. A pontuação de 91–100% indica que você possui uma rara integração entre o que sente, o que valoriza e como age nos relacionamentos. Essa harmonia interna é o que permite que você forme conexões do tipo que a maioria das pessoas apenas sonha. Não é coincidência: é o resultado de uma maturidade afetiva profunda que se manifesta em cada escolha relacional.",
    strengths: ["Comunicação emocional extraordinariamente madura", "Valores de vida plenamente integrados e vividos", "Capacidade de apoio emocional profundo e consistente", "Equilíbrio perfeito entre autonomia e vínculo", "Química e conexão genuína e sustentável"],
    strengthsDetail: {
      "Comunicação": "Sua capacidade de expressar sentimentos, ouvir ativamente e resolver conflitos com maturidade é excepcional. Você não apenas fala — você se comunica de uma forma que cria segurança e intimidade genuína.",
      "Valores": "Você vive o que acredita. Há uma consistência rara entre seus valores declarados e seus comportamentos reais, especialmente em momentos de pressão emocional.",
      "Apoio Emocional": "Sua disposição para estar presente nos momentos difíceis, sem perder a si mesmo, é uma das características mais raras em relacionamentos. Você sabe apoiar sem se perder.",
      "Estilo de Vida": "Sua visão de futuro está integrada à sua vida presente. Você planeja, organiza e cultiva o relacionamento com a mesma atenção que dedica a outras áreas importantes da vida.",
      "Química": "A profundidade que você busca e é capaz de criar vai muito além da atração superficial. Você constrói vínculos que têm substância, intensidade e durabilidade.",
    },
    challenges: ["Expectativas muito elevadas podem tornar difícil encontrar parceiros à altura", "Risco de decepção profunda quando não há reciprocidade equivalente"],
    challengesDetail: {
      "Expectativas": "Pessoas com seu nível de maturidade afetiva frequentemente lutam para encontrar parceiros que correspondam à profundidade que oferecem. Isso não é um defeito — é um critério de qualidade.",
      "Reciprocidade": "Quando investe em uma conexão que não tem reciprocidade equivalente, a dor pode ser mais intensa do que para a maioria. Proteger-se sem fechar o coração é um dos seus principais desafios.",
    },
    shortTermForecast: "Nos primeiros meses de um relacionamento, seu perfil cria uma experiência extraordinária para ambos. Você sabe criar segurança emocional desde o início, o que acelera a construção de intimidade genuína.",
    mediumTermForecast: "No médio prazo, relacionamentos com parceiros compatíveis se aprofundam de maneira consistente. Você sustenta o interesse, o cuidado e a conexão ao longo do tempo — algo que a maioria das pessoas não consegue manter.",
    longTermForecast: "Para o longo prazo — casamento, construção de vida juntos — seu perfil tem estatisticamente as maiores taxas de satisfação e durabilidade. A probabilidade de construir algo verdadeiramente significativo é extraordinária, desde que o parceiro tenha nível equivalente de maturidade.",
    psychologicalProfile: "Do ponto de vista psicológico, você apresenta um estilo de apego seguro altamente desenvolvido. Sua regulação emocional é sofisticada, seu senso de identidade é estável mesmo dentro de vínculos profundos, e sua capacidade de vulnerabilidade autêntica é rara. Esses três elementos combinados são a fórmula dos relacionamentos mais satisfatórios estudados pela psicologia contemporânea.",
    stabilityAnalysis: "Sua estabilidade relacional é alta e consistente. Você não cria dramas desnecessários, mas também não evita conversas difíceis. Essa maturidade resulta em relacionamentos com muito menos turbulência e muito mais profundidade.",
    emotionalMaturity: "Sua maturidade afetiva está no percentil mais elevado. Você compreende que amor é também escolha, esforço e presença — não apenas sentimento. Isso transforma completamente a qualidade dos vínculos que você cria.",
    recommendations: [
      "Não acelere: permita que conexões extraordinárias se desenvolvam no ritmo certo",
      "Busque parceiros que demonstrem maturidade emocional equivalente antes de investir totalmente",
      "Pratique comunicar suas expectativas desde o início — seu nível de profundidade nem sempre é intuitivo para outros",
      "Continue investindo no seu desenvolvimento emocional — é seu maior diferencial e fonte de atração",
      "Proteja sua energia afetiva: qualidade é infinitamente mais valiosa do que quantidade",
    ],
    conclusion: "Seu relatório de compatibilidade NEUROX revela um perfil afetivo extraordinário. Você está entre as pessoas mais preparadas emocionalmente para construir relacionamentos profundos, duradouros e verdadeiramente satisfatórios. O desafio não é aprender a amar melhor — é encontrar alguém à altura do amor que você é capaz de oferecer. E quando isso acontecer, a conexão que você criará será do tipo que transforma duas vidas de maneira permanente.",
    risks: ["Investir emocionalmente em pessoas com menor maturidade afetiva", "Minimizar suas necessidades para adaptar-se a parceiros menos compatíveis"],
    idealPartnerProfile: "Alguém com alto nível de maturidade emocional, valores plenamente integrados, capacidade de comunicação aberta e desejo genuíno de profundidade e crescimento conjunto. Que aprecie estabilidade sem abrir mão de evolução e que saiba corresponder à intensidade e qualidade que você oferece.",
  },

  // ── FAIXA 2: 81–90 → Alta Compatibilidade ────────────────────────────────
  {
    minPercent: 81,
    maxPercent: 90,
    name: "Alta Compatibilidade",
    compatibilityLevel: "81–90%",
    freeDescription: "Seu perfil revela alta coerência afetiva — uma combinação incomum de clareza emocional e capacidade de vínculo que diferencia profundamente como você ama e como é amado. Existem dimensões no seu funcionamento relacional que explicam as conexões mais significativas que você já viveu. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você demonstra um perfil afetivo altamente desenvolvido, com pontos fortes claros em múltiplas dimensões relacionais. Sua capacidade de criar vínculos profundos, manter compromisso e nutrir conexões ao longo do tempo é um diferencial significativo. Há algumas nuances a refinar que, quando trabalhadas, elevarão ainda mais a qualidade das suas relações.",
    overviewAnalysis: "Com uma pontuação de 81–90%, seu perfil relacional é robusto e bem estruturado. Você possui clareza de valores, boa comunicação emocional e genuíno comprometimento com a qualidade dos seus vínculos. O que diferencia você é a consistência: você não é apenas bom no início — você sustenta e aprofunda as conexões ao longo do tempo. Isso é extraordinariamente raro e valioso.",
    strengths: ["Alta clareza de valores e objetivos de vida", "Comunicação emocional bem desenvolvida", "Comprometimento genuíno com relações de qualidade", "Boa capacidade de apoio emocional", "Visão de futuro integrada ao presente relacional"],
    strengthsDetail: {
      "Comunicação": "Você consegue expressar necessidades e sentimentos com clareza na maior parte do tempo. Sua capacidade de escuta ativa cria segurança emocional para o parceiro.",
      "Valores": "Seus valores de vida são bem definidos e você os pratica com consistência. Isso cria previsibilidade positiva e confiança nos relacionamentos.",
      "Apoio Emocional": "Você está genuinamente presente quando o parceiro precisa. Essa disposição para o cuidado real é uma das bases dos relacionamentos mais satisfatórios.",
      "Estilo de Vida": "Sua organização de vida e capacidade de planejamento conjunto são pontos fortes importantes para a construção de um futuro compartilhado.",
      "Química": "Você busca e é capaz de criar conexões com substância real. A profundidade que você traz transforma relacionamentos em algo significativo.",
    },
    challenges: ["Ocasional dificuldade em expressar vulnerabilidade em momentos críticos", "Pode subestimar diferenças de ritmo emocional com o parceiro"],
    challengesDetail: {
      "Vulnerabilidade": "Em momentos de maior pressão emocional, pode haver uma tendência a se fechar levemente. Desenvolver a capacidade de se mostrar vulnerável justamente quando é mais difícil vai elevar sua intimidade a outro nível.",
      "Ritmo Emocional": "Parceiros com estilos emocionais diferentes podem criar fricção. Aprender a identificar e respeitar ritmos diferentes sem interpretá-los como desinteresse é um ponto de desenvolvimento importante.",
    },
    shortTermForecast: "Nos primeiros meses, você cria relacionamentos com boa base emocional. Sua clareza de intenção e capacidade de comunicação facilitam o estabelecimento de confiança desde o início.",
    mediumTermForecast: "No médio prazo, seus relacionamentos tendem a se aprofundar de forma consistente. Você sustenta o investimento e o cuidado ao longo do tempo, o que é um diferencial crucial.",
    longTermForecast: "Para o longo prazo, sua probabilidade de construir relacionamentos satisfatórios e duradouros é muito alta. Com pequenos ajustes nos pontos identificados, pode alcançar o nível mais elevado de satisfação relacional.",
    psychologicalProfile: "Seu perfil psicológico indica um estilo de apego predominantemente seguro com alguns aspectos a desenvolver. Você possui boa regulação emocional, senso de identidade estável e capacidade genuína de intimidade. Esses são os alicerces dos relacionamentos mais saudáveis.",
    stabilityAnalysis: "Sua estabilidade emocional é uma das suas maiores forças relacionais. Você não oscila excessivamente diante de desafios normais do relacionamento, o que cria segurança para o parceiro.",
    emotionalMaturity: "Sua maturidade afetiva está bem desenvolvida. Você compreende que relacionamentos exigem trabalho consistente e está genuinamente disposto a esse investimento.",
    recommendations: [
      "Invista em comunicação explícita sobre expectativas desde o início do relacionamento",
      "Pratique a expressão de vulnerabilidade — especialmente nos momentos mais difíceis",
      "Observe a compatibilidade de longo prazo além da sintonia inicial",
      "Aprenda a identificar diferenças de ritmo emocional sem interpretá-las como rejeição",
      "Continue desenvolvendo sua inteligência emocional — o retorno é extraordinário",
    ],
    conclusion: "Seu perfil de compatibilidade NEUROX é notavelmente forte. Você possui as bases emocionais e relacionais para construir algo verdadeiramente satisfatório e duradouro. Os pontos identificados para desenvolvimento são nuances que, quando trabalhadas, não apenas melhorarão seus relacionamentos — transformarão profundamente a qualidade de como você vive e ama.",
    risks: ["Subestimar a importância de comunicar necessidades específicas", "Escolher parceiros pela atração inicial sem verificar compatibilidade de valores"],
    idealPartnerProfile: "Alguém com maturidade emocional sólida, valores alinhados e disposição genuína para comprometimento. Que demonstre afeto de forma consistente, valorize planejamento conjunto e tenha objetivos de vida compatíveis.",
  },

  // ── FAIXA 3: 71–80 → Muito Boa ───────────────────────────────────────────
  {
    minPercent: 71,
    maxPercent: 80,
    name: "Compatibilidade Muito Boa",
    compatibilityLevel: "71–80%",
    freeDescription: "Suas respostas indicam um perfil afetivo sólido — padrão que revela uma combinação de abertura emocional e valores estruturados que poucos desenvolvem com essa consistência. Existem camadas no seu funcionamento relacional que determinam como você escolhe e mantém vínculos de forma mais profunda do que a média. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você possui boas bases relacionais com pontos fortes claros e algumas áreas específicas que, quando desenvolvidas, elevarão consideravelmente a qualidade das suas conexões. Seu perfil indica alguém genuinamente comprometido com relações de qualidade e em processo consistente de crescimento afetivo.",
    overviewAnalysis: "Com 71–80% de compatibilidade, você demonstra um perfil relacional bem acima da média. Sua capacidade de criar vínculos, comunicar-se emocionalmente e comprometer-se com qualidade é real e perceptível. O que o diferencia de perfis ainda mais altos são algumas inconsistências pontuais que, identificadas e trabalhadas, têm potencial de transformação significativa.",
    strengths: ["Comprometimento genuíno com a qualidade dos vínculos", "Boa base de valores pessoais estruturados", "Capacidade real de apoio emocional", "Abertura para diálogo e comunicação", "Visão de relacionamento como construção conjunta"],
    strengthsDetail: {
      "Comunicação": "Você tem boa capacidade de comunicação na maioria dos contextos. Seu ponto de crescimento é manter essa qualidade também sob pressão emocional.",
      "Valores": "Seus valores são sólidos e definem claramente o tipo de relacionamento que você busca. Isso elimina muito da confusão que prejudica muitas relações.",
      "Apoio Emocional": "Quando está presente, seu apoio é genuíno e sentido pelo parceiro. O desafio é manter essa presença consistente mesmo quando você mesmo está sobrecarregado.",
      "Estilo de Vida": "Você tem boa capacidade de planejar e organizar a vida a dois. Alguns ajustes de flexibilidade podem fortalecer ainda mais esse aspecto.",
      "Química": "Você busca conexões com substância. Isso te protege de relacionamentos superficiais e abre espaço para vínculos verdadeiramente significativos.",
    },
    challenges: ["Algumas inconsistências entre valores declarados e comportamentos sob pressão", "Possível dificuldade em manter profundidade emocional ao longo do tempo"],
    challengesDetail: {
      "Consistência": "Há momentos em que o comportamento no relacionamento não reflete completamente os valores que você afirma ter. Identificar esses momentos e entender o que os provoca é transformador.",
      "Profundidade no Tempo": "No início dos relacionamentos, a intensidade e o investimento são altos. O desafio está em manter essa qualidade de presença à medida que a relação amadurece e a novidade passa.",
    },
    shortTermForecast: "Nos primeiros meses, você cria uma boa impressão emocional e estabelece bases sólidas. Sua intenção genuína é sentida pelo parceiro desde o início.",
    mediumTermForecast: "No médio prazo, relacionamentos com parceiros compatíveis tendem a se estabilizar positivamente. Há espaço para aprofundamento consistente quando há reciprocidade.",
    longTermForecast: "Para o longo prazo, sua probabilidade de relacionamentos estáveis é alta. Com atenção às áreas de desenvolvimento identificadas, pode alcançar satisfação relacional em níveis muito elevados.",
    psychologicalProfile: "Seu perfil psicológico indica um estilo de apego em desenvolvimento positivo. Você possui boa regulação emocional na maior parte do tempo, senso de identidade razoavelmente estável e capacidade de intimidade genuína.",
    stabilityAnalysis: "Sua estabilidade emocional é uma base positiva. Há alguns momentos de oscilação que, quando compreendidos, podem ser transformados em pontos de fortalecimento.",
    emotionalMaturity: "Sua maturidade afetiva está bem desenvolvida para a maioria dos contextos relacionais. O próximo nível envolve desenvolver respostas mais consistentes nos momentos de maior tensão.",
    recommendations: [
      "Pratique consistência entre seus valores declarados e seu comportamento, especialmente sob pressão",
      "Invista em rituais regulares de conexão com o parceiro para manter a profundidade ao longo do tempo",
      "Trabalhe a expressão de vulnerabilidade — é aí que o vínculo mais profundo se forma",
      "Observe padrões que se repetem nos seus relacionamentos e explore suas origens",
      "Comunique expectativas de forma clara e regular — não assuma que o parceiro sabe",
    ],
    conclusion: "Seu relatório NEUROX revela um perfil afetivo sólido com potencial real de crescimento. Você já possui as bases — o próximo passo é a consistência. Os relacionamentos que você tem o potencial de criar podem ser genuinamente transformadores, tanto para você quanto para quem compartilha esse caminho.",
    risks: ["Manter relacionamentos por conforto mesmo quando há incompatibilidade de valores", "Negligenciar o cuidado com a relação após a fase inicial de encantamento"],
    idealPartnerProfile: "Parceiro paciente, com estabilidade emocional e valores similares. Que valorize crescimento conjunto, demonstre afeto consistentemente e tenha objetivos de vida compatíveis.",
  },

  // ── FAIXA 4: 61–70 → Boa Compatibilidade ─────────────────────────────────
  {
    minPercent: 61,
    maxPercent: 70,
    name: "Boa Compatibilidade",
    compatibilityLevel: "61–70%",
    freeDescription: "Seu perfil revela capacidade real de vínculo com características que, quando ativadas, criam conexões genuínas — um padrão que contém traços ainda pouco explorados sobre como você ama. Há dimensões emocionais no seu modo relacional que nem sempre você percebe conscientemente, mas que determinam o tipo de relação que você atrai e mantém. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você possui boas bases relacionais com pontos fortes reais e algumas áreas que, quando desenvolvidas, elevarão significativamente sua satisfação afetiva. Seu perfil indica uma jornada de crescimento relacional em progresso consistente — você já avançou bastante e há um próximo nível claro à sua frente.",
    overviewAnalysis: "Com 61–70% de compatibilidade, você demonstra uma base relacional funcional com potencial real de elevação. Seus pontos fortes são concretos e observáveis. As áreas de desenvolvimento são específicas e trabalháveis — não são defeitos de caráter, são habilidades relacionais que qualquer pessoa pode desenvolver com intenção e prática.",
    strengths: ["Boa intenção relacional clara e perceptível", "Capacidade de empatia em desenvolvimento", "Abertura para compromisso quando há conexão genuína", "Valores pessoais estruturados", "Disposição para aprendizado relacional"],
    strengthsDetail: {
      "Comunicação": "Você tem boa disposição para comunicação, especialmente em momentos positivos. O desenvolvimento está em manter essa abertura também diante de conflitos.",
      "Valores": "Seus valores de vida são estruturados e funcionam como guia para suas escolhas relacionais. Isso é uma base importante.",
      "Apoio Emocional": "Você tem capacidade de apoio emocional genuíno. O ponto de crescimento é a consistência — estar presente não apenas nos momentos grandes, mas também nos pequenos.",
      "Estilo de Vida": "Você tem boa visão de futuro. Integrar essa visão às práticas cotidianas do relacionamento é o próximo passo.",
      "Química": "Sua busca por conexões com substância te posiciona bem para relacionamentos significativos.",
    },
    challenges: ["Inconsistências na comunicação emocional em momentos de tensão", "Possível conflito entre necessidades de independência e desejo de vínculo"],
    challengesDetail: {
      "Comunicação sob Tensão": "Nos momentos de conflito ou estresse, pode haver dificuldade em manter a mesma qualidade de comunicação do dia a dia. Isso é comum, mas pode criar ciclos de mal-entendidos.",
      "Independência vs Vínculo": "Há uma tensão entre o desejo de conexão profunda e a necessidade de espaço pessoal. Encontrar o equilíbrio certo é fundamental para sua satisfação relacional.",
    },
    shortTermForecast: "Nos primeiros meses, você cria boa conexão inicial. Sua intenção positiva é sentida e cria um começo promissor para relacionamentos com parceiros compatíveis.",
    mediumTermForecast: "No médio prazo, há espaço para aprofundamento consistente quando há reciprocidade e comunicação ativa. O desenvolvimento das áreas identificadas neste relatório acelerará esse processo.",
    longTermForecast: "Boas perspectivas para relacionamentos duradouros com o parceiro certo. O desenvolvimento das áreas específicas identificadas pode transformar significativamente a qualidade e durabilidade das suas relações.",
    psychologicalProfile: "Seu perfil psicológico indica um estilo de apego em transição positiva. Você possui boa intenção relacional e está desenvolvendo habilidades emocionais que tornarão seus relacionamentos progressivamente mais satisfatórios.",
    stabilityAnalysis: "Sua estabilidade emocional é boa na maior parte do tempo, com alguns pontos de oscilação em situações de maior pressão. Esses pontos, quando compreendidos, se tornam oportunidades de crescimento.",
    emotionalMaturity: "Sua maturidade afetiva está em desenvolvimento ativo. Você já superou muitos dos desafios que impedem conexões mais profundas e está claramente evoluindo.",
    recommendations: [
      "Identifique os padrões que se repetem nos seus relacionamentos e explore suas origens",
      "Desenvolva clareza sobre suas necessidades afetivas prioritárias e aprenda a comunicá-las",
      "Pratique comunicação não-violenta, especialmente durante conflitos",
      "Invista em espaços de reflexão — terapia, journaling, grupos de desenvolvimento",
      "Observe a diferença entre o que atrai inicialmente e o que sustenta a longo prazo",
    ],
    conclusion: "Seu perfil NEUROX revela uma trajetória de crescimento relacional genuíno. Você tem as bases e a intenção — o próximo passo é desenvolver as habilidades específicas que transformarão seus relacionamentos. Com investimento consciente, seu potencial relacional é significativamente maior do que onde você está hoje.",
    risks: ["Repetir padrões relacionais sem consciência do que os origina", "Escolher parceiros pela atração inicial sem verificar compatibilidade de valores e objetivos"],
    idealPartnerProfile: "Alguém com paciência, estabilidade emocional e clareza de valores. Que encare o relacionamento como um projeto conjunto de crescimento e demonstre comprometimento de forma consistente.",
  },

  // ── FAIXA 5: 51–60 → Compatibilidade Promissora ──────────────────────────
  {
    minPercent: 51,
    maxPercent: 60,
    name: "Compatibilidade Promissora",
    compatibilityLevel: "51–60%",
    freeDescription: "Suas respostas indicam um perfil afetivo em desenvolvimento — combinação de pontos fortes reais e áreas que ainda não foram completamente exploradas. Há padrões no seu jeito de se relacionar que explicam tanto as conexões que funcionam quanto as que se frustram de maneira recorrente. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você demonstra algumas habilidades relacionais importantes com espaço real de crescimento. Existem tensões específicas que criam dificuldades em certos contextos relacionais — mas essas tensões são identificáveis, compreensíveis e trabalháveis. Com clareza e desenvolvimento focado, seu potencial relacional pode aumentar consideravelmente.",
    overviewAnalysis: "Com 51–60% de compatibilidade, você está na zona de transição: acima de conflitos fundamentais, mas ainda aquém do potencial que seu perfil revela. Isso é uma posição interessante — significa que você já superou muitos obstáculos básicos e que o crescimento disponível à sua frente é real e alcançável com os passos certos.",
    strengths: ["Presença de valores claros em áreas importantes", "Capacidade genuína de afeto", "Disposição para relacionamentos de qualidade", "Consciência crescente sobre seus padrões relacionais", "Abertura para mudança e desenvolvimento"],
    strengthsDetail: {
      "Comunicação": "Você tem capacidade de comunicação, especialmente em contextos positivos. O desenvolvimento está em manter essa qualidade em situações de conflito.",
      "Valores": "Há valores claros em algumas áreas-chave. O desafio é integrar esses valores de forma mais consistente ao comportamento cotidiano no relacionamento.",
      "Apoio Emocional": "Você tem disposição para apoio, que se manifesta especialmente nas grandes situações. Desenvolver presença também nos pequenos momentos cotidianos é o próximo nível.",
      "Estilo de Vida": "Há aspirações de futuro bem definidas. Conectá-las às práticas diárias do relacionamento é um passo importante.",
      "Química": "Você busca conexões com significado real — isso é um ativo importante que te diferencia de relações mais superficiais.",
    },
    challenges: ["Conflitos internos entre necessidades e comportamentos no relacionamento", "Comunicação emocional inconsistente, especialmente sob pressão", "Expectativas não comunicadas que geram frustração"],
    challengesDetail: {
      "Conflitos Internos": "Há tensões entre o que você quer no relacionamento e como você se comporta em certos momentos. Compreender a origem dessas tensões é transformador.",
      "Comunicação": "Há variação significativa na qualidade da sua comunicação emocional dependendo do contexto. Nos momentos mais críticos, quando mais importa, pode ser mais difícil se expressar.",
      "Expectativas": "Expectativas não verbalizadas são uma das principais fontes de frustração relacional. Desenvolver a habilidade de nomear o que você espera é fundamental.",
    },
    shortTermForecast: "Nos primeiros meses, você cria conexões com potencial. Os pontos de fricção tendem a aparecer com mais clareza à medida que a relação se aprofunda — o que é uma oportunidade de crescimento, não apenas um problema.",
    mediumTermForecast: "No médio prazo, há espaço real para crescimento e aprofundamento. O desenvolvimento das habilidades identificadas neste relatório pode transformar significativamente a qualidade dos seus relacionamentos nessa fase.",
    longTermForecast: "Perspectivas moderadas sem intervenção. Com desenvolvimento consciente das áreas identificadas, a probabilidade de sucesso em relacionamentos duradouros aumenta de forma significativa. A chave está no investimento intencional.",
    psychologicalProfile: "Seu perfil psicológico indica um estilo de apego em desenvolvimento com alguns padrões que merecem atenção. Há boa intenção relacional e algumas barreiras que, quando compreendidas, perdem muito do seu poder.",
    stabilityAnalysis: "Há oscilações emocionais mais frequentes do que o ideal para manter estabilidade relacional. Compreender os gatilhos dessas oscilações é o primeiro passo para uma presença mais consistente.",
    emotionalMaturity: "Sua maturidade afetiva está em processo ativo de desenvolvimento. Você tem clareza intelectual sobre o que um relacionamento saudável requer — o trabalho é alinhar comportamentos a essa visão.",
    recommendations: [
      "Invista em autoconhecimento afetivo — terapia, grupos de crescimento, leituras especializadas",
      "Identifique e nomeie suas necessidades afetivas prioritárias antes de entrar em novos relacionamentos",
      "Pratique comunicar expectativas de forma direta e sem passividade",
      "Explore as origens dos padrões relacionais que se repetem — geralmente estão na história pessoal",
      "Desenvolva tolerância à vulnerabilidade — é onde os vínculos mais profundos se formam",
    ],
    conclusion: "Seu relatório NEUROX aponta uma posição de transição com potencial real. Você tem as intenções certas e alguns pontos fortes concretos. O caminho para relacionamentos mais satisfatórios é claro e está ao seu alcance. Com os passos certos, a diferença entre onde você está e o relacionamento que você deseja é menor do que parece.",
    risks: ["Entrar em novos relacionamentos antes de compreender padrões que se repetem", "Escolher parceiros com quem haja química inicial mas incompatibilidade de valores"],
    idealPartnerProfile: "Parceiro compreensivo, com alta maturidade emocional e disposição genuína para crescimento conjunto. Que entenda processos de desenvolvimento e valorize honestidade sobre perfeição.",
  },

  // ── FAIXA 6: 41–50 → Compatibilidade Moderada ────────────────────────────
  {
    minPercent: 41,
    maxPercent: 50,
    name: "Compatibilidade Moderada",
    compatibilityLevel: "41–50%",
    freeDescription: "Seu perfil revela tensões internas no campo afetivo — padrões pouco percebidos que explicam os altos e baixos recorrentes nas suas conexões emocionais. Há contradições entre o que você deseja em um relacionamento e como você tende a se comportar nele. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil indica inconsistências significativas em várias dimensões afetivas. Isso não é um julgamento — é um mapa. Compreender essas tensões internamente é o primeiro passo para transformá-las em pontos de força real. Muitas pessoas com perfis semelhantes alcançaram relacionamentos extraordinários após desenvolver o que você está prestes a descobrir.",
    overviewAnalysis: "Com 41–50% de compatibilidade, você está em uma zona que requer atenção honesta. Há tensões internas que afetam a qualidade das suas relações de formas que nem sempre são óbvias. A boa notícia: essas tensões são identificáveis, têm origem compreensível e podem ser trabalhadas. Você está no ponto certo para iniciar uma transformação relacional significativa.",
    strengths: ["Consciência de que algo precisa ser desenvolvido — isso é raro e valioso", "Capacidade de afeto presente em algumas dimensões importantes", "Disposição básica para relacionamentos", "Abertura para aprendizado quando motivado"],
    strengthsDetail: {
      "Comunicação": "Há capacidade de comunicação em contextos de baixa tensão. O desenvolvimento está em expandir essa capacidade para situações mais desafiadoras.",
      "Valores": "Você possui valores em algumas áreas, mesmo que nem sempre os viva consistentemente no relacionamento.",
      "Apoio Emocional": "Em momentos específicos, você demonstra capacidade de suporte genuíno. O trabalho é tornar isso mais consistente e previsível.",
      "Estilo de Vida": "Há aspirações de estabilidade que, quando traduzidas em comportamentos consistentes, podem ser uma base positiva.",
      "Química": "Você tem capacidade de sentir e criar conexão — o trabalho está em sustentar essa conexão para além dos momentos iniciais.",
    },
    challenges: ["Padrões de comunicação inconsistentes que criam ciclos de conflito", "Conflito entre necessidades de conexão e comportamentos distanciadores", "Instabilidade emocional que afeta a previsibilidade relacional"],
    challengesDetail: {
      "Comunicação Inconsistente": "A qualidade da sua comunicação varia muito dependendo do estado emocional. Isso cria insegurança no parceiro e ciclos difíceis de romper.",
      "Aproximar-se e Distanciar": "Há um padrão de buscar conexão e, quando ela se aproxima, criar distância. Esse padrão tem raízes psicológicas identificáveis e é trabalhável.",
      "Instabilidade Emocional": "Reações emocionais imprevisíveis afetam diretamente a segurança que o parceiro sente na relação. Desenvolver regulação emocional é prioritário.",
    },
    shortTermForecast: "Nos primeiros meses, pode haver boa conexão inicial seguida de fricção crescente à medida que os padrões mais profundos emergem. Isso é uma oportunidade de identificar exatamente o que precisa ser trabalhado.",
    mediumTermForecast: "No médio prazo, relacionamentos longos podem apresentar desafios recorrentes sem trabalho interno consciente. Com desenvolvimento focado, a mudança nessa fase pode ser significativa.",
    longTermForecast: "Relacionamentos longos apresentarão desafios recorrentes sem intervenção focada. Com trabalho interno real — não superficial — transformação profunda é completamente possível e tem sido documentada.",
    psychologicalProfile: "Seu perfil indica padrões de apego que merecem atenção especializada. Esses padrões têm origem compreensível — geralmente na história de vínculos anteriores — e são a principal área de desenvolvimento para sua satisfação relacional.",
    stabilityAnalysis: "Há oscilações emocionais que afetam a consistência relacional. Desenvolver ferramentas de regulação emocional é o investimento com maior retorno para sua vida afetiva.",
    emotionalMaturity: "Há espaço significativo para crescimento na maturidade afetiva. Isso não é crítica — é a identificação clara do próximo nível que está disponível para você.",
    recommendations: [
      "Priorize autoconhecimento profundo — terapia especializada em relações afetivas é altamente recomendada",
      "Trabalhe com um profissional para mapear a origem dos seus padrões relacionais",
      "Pratique regulação emocional — técnicas de mindfulness, respiração e autorregulação",
      "Comunique expectativas de forma explícita e regular — não assuma que o parceiro sabe",
      "Antes de novos relacionamentos, invista pelo menos alguns meses em desenvolvimento pessoal focado",
    ],
    conclusion: "Seu relatório NEUROX revela uma posição que exige honestidade e ação. Você tem o potencial real de transformar seus padrões relacionais — mas isso requer investimento consciente e suporte adequado. A diferença entre onde você está e relacionamentos genuinamente satisfatórios não é sorte ou circunstância: é desenvolvimento interno específico e alcançável.",
    risks: ["Relacionamentos longos sem desenvolvimento podem perpetuar ciclos de insatisfação", "Parceiros com baixa paciência tendem a se frustrar com os padrões identificados"],
    idealPartnerProfile: "Parceiro com alta estabilidade emocional, muita paciência e genuína disposição para suporte mútuo. Que compreenda processos de desenvolvimento e não confunda inconsistência com falta de amor.",
  },

  // ── FAIXA 7: 31–40 → Compatibilidade Instável ────────────────────────────
  {
    minPercent: 31,
    maxPercent: 40,
    name: "Compatibilidade Instável",
    compatibilityLevel: "31–40%",
    freeDescription: "Suas respostas indicam um perfil afetivo com tensões importantes — características que nem sempre são conscientes mas que moldam os padrões nos seus relacionamentos de forma marcante. Há uma combinação de bloqueios e potencial que define como você se conecta e o que atrai e repele. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil atual mostra áreas significativas de desenvolvimento em múltiplas dimensões afetivas. Isso representa uma oportunidade genuína de crescimento — não um limite permanente. Muitas das características que hoje criam dificuldades têm origem clara e são completamente transformáveis com o suporte e a consciência adequados.",
    overviewAnalysis: "Com 31–40% de compatibilidade, você está em uma zona que requer atenção séria e comprometimento real com o desenvolvimento. Não se trata de defeitos — trata-se de padrões que se formaram por razões compreensíveis e que podem ser transformados. O primeiro passo é o que você já deu: buscar clareza. O segundo é agir sobre ela.",
    strengths: ["Potencial de crescimento real e disponível", "Presença de alguma capacidade de afeto", "Coragem de buscar autoconhecimento", "Disposição básica para relacionamentos"],
    strengthsDetail: {
      "Comunicação": "Há momentos de boa comunicação que demonstram que a capacidade existe. O trabalho é torná-la mais acessível e consistente.",
      "Valores": "Existem valores, mesmo que não sejam vividos consistentemente. Esse é um ponto de trabalho importante — e promissor.",
      "Apoio Emocional": "A capacidade de apoio existe, mas pode estar bloqueada por defesas emocionais desenvolvidas ao longo do tempo.",
      "Estilo de Vida": "Há aspirações de estabilidade que indicam que você valoriza a construção de algo duradouro.",
      "Química": "A busca por conexão genuína ainda está presente, mesmo que frequentemente frustrada.",
    },
    challenges: ["Dificuldades de comunicação emocional em múltiplos contextos", "Conflito significativo entre valores declarados e comportamentos efetivos", "Tendência a padrões relacionais que geram insatisfação recorrente"],
    challengesDetail: {
      "Comunicação": "A comunicação emocional é frequentemente comprometida por defesas, medos ou padrões aprendidos que dificultam a expressão genuína.",
      "Valores vs Comportamento": "Há uma brecha significativa entre o que você diz valorizar e como age nos relacionamentos, especialmente sob pressão.",
      "Padrões Recorrentes": "Os mesmos problemas tendem a aparecer em relacionamentos diferentes, sugerindo origem interna que precisa ser endereçada.",
    },
    shortTermForecast: "Nos primeiros meses, pode haver conexão inicial seguida de padrões que criam distância ou conflito. Reconhecer esses momentos como sinais de trabalho interno necessário — não como falhas do relacionamento ou do parceiro — é um passo importante.",
    mediumTermForecast: "No médio prazo, sem intervenção focada, há tendência de repetição de padrões insatisfatórios. Com trabalho real, essa fase pode ser o ponto de virada.",
    longTermForecast: "Sem trabalho interno, relacionamentos longos provavelmente reproduzirão padrões de insatisfação. Com suporte profissional e comprometimento genuíno, mudança real é alcançável e tem sido documentada.",
    psychologicalProfile: "Seu perfil indica padrões de apego que requerem trabalho especializado. Esses padrões têm origem em vínculos anteriores e funcionam como programas automáticos — poderosos, mas modificáveis com o suporte certo.",
    stabilityAnalysis: "A instabilidade emocional é a principal área de trabalho. Desenvolver recursos de regulação emocional transformará não apenas seus relacionamentos, mas sua qualidade de vida como um todo.",
    emotionalMaturity: "Há espaço significativo para crescimento. A boa notícia é que maturidade afetiva pode ser desenvolvida em qualquer fase da vida — não é algo fixo ou determinado geneticamente.",
    recommendations: [
      "Priorize terapia especializada em vínculos afetivos como próximo passo concreto",
      "Faça uma pausa reflexiva antes de iniciar novos relacionamentos sérios",
      "Mapeie com honestidade os padrões que se repetem em relacionamentos anteriores",
      "Desenvolva autocuidado e autocompaixão — são a base de qualquer transformação relacional",
      "Construa uma rede de suporte emocional sólida fora dos relacionamentos românticos",
    ],
    conclusion: "Seu relatório NEUROX revela uma posição que exige compromisso real com transformação. Você tem potencial genuíno — o que falta é o caminho específico para acessá-lo. Os padrões identificados não são sentença: são pontos de partida para uma jornada que, com suporte adequado, pode mudar profundamente a qualidade dos seus relacionamentos e da sua vida.",
    risks: ["Repetição de ciclos relacionais sem compreensão das causas", "Investimento emocional em relações sem base de compatibilidade real"],
    idealPartnerProfile: "Parceiro com alta estabilidade emocional, muito suporte e disposição para crescimento conjunto. Que compreenda vulnerabilidades e não as utilize como fraquezas. Neste momento, o desenvolvimento pessoal é a relação mais importante.",
  },

  // ── FAIXA 8: 21–30 → Baixa Compatibilidade ───────────────────────────────
  {
    minPercent: 21,
    maxPercent: 30,
    name: "Baixa Compatibilidade",
    compatibilityLevel: "21–30%",
    freeDescription: "Seu perfil revela bloqueios afetivos significativos — um padrão pouco percebido que explica dificuldades recorrentes em criar e manter vínculos saudáveis. Há camadas emocionais que ainda não foram completamente processadas e que afetam diretamente como você experimenta os relacionamentos e o que você reproduz neles. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil atual indica desalinhamentos importantes entre várias dimensões afetivas. Esta é uma informação valiosa e rara: a maioria das pessoas nunca recebe esse nível de clareza sobre seus padrões. O mapa que preparamos é o ponto de partida para uma transformação real — não superficial, mas profunda e duradoura.",
    overviewAnalysis: "Com 21–30% de compatibilidade, você está diante de uma realidade que merece honestidade e cuidado. Não se trata de você ser incapaz de amar ou de ser amado — trata-se de padrões profundos que se formaram por razões compreensíveis e que requerem trabalho específico. A clareza que este relatório oferece é, paradoxalmente, o começo da mudança.",
    strengths: ["Disposição para fazer o teste indica consciência e coragem", "Potencial de transformação com suporte adequado", "Capacidade básica de afeto ainda presente"],
    strengthsDetail: {
      "Comunicação": "Há momentos isolados de boa comunicação que demonstram que a capacidade existe, mesmo que frequentemente bloqueada.",
      "Valores": "Existem valores básicos que, quando ativados, podem servir como base para reconstrução relacional.",
      "Apoio Emocional": "Em situações específicas, a capacidade de suporte se manifesta. O trabalho é criar condições para que isso aconteça com mais frequência e consistência.",
      "Estilo de Vida": "Há aspirações de estabilidade que indicam que você quer algo melhor — isso é importante.",
      "Química": "A busca por conexão existe, mesmo que frequentemente frustrada ou bloqueada por defesas.",
    },
    challenges: ["Padrões relacionais disfuncionais que se repetem sistematicamente", "Alta tendência de repetição de ciclos afetivos insatisfatórios", "Dificuldade de conexão genuína em múltiplas dimensões"],
    challengesDetail: {
      "Padrões Repetitivos": "Os mesmos conflitos aparecem em relacionamentos diferentes porque a origem é interna. Identificar e trabalhar essa origem é a prioridade.",
      "Ciclos Afetivos": "Há um ciclo identificável de atração, conexão, conflito e distanciamento que tende a se repetir. Romper esse ciclo requer suporte especializado.",
      "Conexão Genuína": "Dificuldades em múltiplas dimensões criam barreiras para a intimidade genuína. Essas barreiras têm história e podem ser desconstruídas.",
    },
    shortTermForecast: "Nos primeiros meses de relacionamentos novos, pode haver conexão superficial inicial. Os padrões mais profundos tendem a emergir com o tempo, criando os mesmos ciclos de sempre.",
    mediumTermForecast: "No médio prazo, sem intervenção especializada, os padrões provavelmente persistem. Com trabalho real, essa pode ser a fase de maior transformação.",
    longTermForecast: "A construção de relacionamentos saudáveis a longo prazo requer um investimento interno significativo e contínuo. Com suporte profissional e comprometimento genuíno, transformação é documentada e alcançável.",
    psychologicalProfile: "Seu perfil indica padrões de apego que provavelmente têm origem em vínculos formativos da história pessoal. Esses padrões funcionam automaticamente e são poderosos — mas não são permanentes. Com o suporte certo, podem ser reconfigurados.",
    stabilityAnalysis: "A instabilidade emocional é pronunciada e afeta diretamente a qualidade dos vínculos. Desenvolver regulação emocional é o investimento mais importante que você pode fazer.",
    emotionalMaturity: "Há muito espaço para crescimento — o que também significa muito potencial disponível. Maturidade afetiva é desenvolvível em qualquer ponto da vida com os recursos certos.",
    recommendations: [
      "Busque terapia especializada em vínculos afetivos — não adie este passo",
      "Não inicie novos relacionamentos sérios antes de pelo menos 3–6 meses de trabalho interno",
      "Pratique autocompaixão diariamente — é a base de toda transformação relacional",
      "Construa relacionamentos de amizade saudáveis como treino para vínculos",
      "Mapeie a origem dos seus padrões relacionais com ajuda profissional",
    ],
    conclusion: "Seu relatório NEUROX apresenta um mapa claro de onde você está e de onde pode chegar. Não existe nenhuma razão para desânimo — existe um caminho claro para transformação. O ponto de partida é este documento. O próximo passo é agir sobre o que ele revela com a seriedade e o cuidado que você merece.",
    risks: ["Iniciar relacionamentos sérios sem trabalho interno prévio", "Buscar parceiros para preencher vazios que requerem trabalho individual"],
    idealPartnerProfile: "O investimento mais valioso neste momento é no relacionamento com você mesmo. Suporte terapêutico, autocuidado e reconstrução de autoestima afetiva são as bases para atrair e manter relacionamentos verdadeiramente satisfatórios no futuro.",
  },

  // ── FAIXA 9: 11–20 → Muito Difícil ───────────────────────────────────────
  {
    minPercent: 11,
    maxPercent: 20,
    name: "Compatibilidade Muito Difícil",
    compatibilityLevel: "11–20%",
    freeDescription: "Suas respostas indicam padrões afetivos com bloqueios profundos — características que explicam por que os relacionamentos frequentemente representam um território de dor, confusão ou repetição de ciclos negativos. Há traços emocionais profundamente arraigados que moldam suas experiências relacionais de formas que raramente são percebidas. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil revela desalinhamentos críticos em múltiplas dimensões afetivas. Esta é uma informação importante e, mais do que isso, é o começo de uma compreensão que pode mudar completamente sua trajetória relacional. Nenhum padrão é permanente quando há clareza e suporte — e o que você está lendo agora é o início dessa clareza.",
    overviewAnalysis: "Com 11–20% de compatibilidade, você está diante de uma realidade que requer honestidade radical e comprometimento com mudança profunda. Isso não é culpa — é história. Os padrões que este relatório identifica têm origem em experiências reais e compreensíveis. E é exatamente por terem origem que podem ser transformados.",
    strengths: ["Coragem de se conhecer profundamente — raro e valioso", "Potencial real de transformação com suporte adequado", "A busca por clareza é o primeiro passo real para mudança"],
    strengthsDetail: {
      "Comunicação": "Há capacidade potencial de comunicação que está bloqueada por defesas construídas ao longo do tempo. Com trabalho, essa capacidade pode ser recuperada.",
      "Valores": "Mesmo em situações de grande dificuldade relacional, há valores básicos presentes que podem servir de âncora para a transformação.",
      "Apoio Emocional": "A necessidade de apoio está presente — o desafio é criar condições internas para recebê-lo e oferecê-lo.",
      "Estilo de Vida": "Há desejo de estabilidade, mesmo que esse desejo frequentemente seja frustrado por padrões automáticos.",
      "Química": "A busca por conexão não desapareceu — está apenas frequentemente bloqueada ou mal direcionada.",
    },
    challenges: ["Bloqueios emocionais profundos que afetam múltiplas dimensões", "Alto risco de repetição de padrões prejudiciais sem intervenção", "Dificuldade severa de conexão e vínculo genuíno"],
    challengesDetail: {
      "Bloqueios Profundos": "Os bloqueios identificados têm profundidade que requer trabalho especializado. Eles não desaparecem com boa vontade — precisam de processo.",
      "Repetição de Padrões": "Sem intervenção, a probabilidade de repetir em novos relacionamentos o que aconteceu nos anteriores é alta. Compreender isso é o primeiro passo para romper o ciclo.",
      "Vínculo Genuíno": "A capacidade de vínculo genuíno está comprometida por defesas que, no passado, fizeram sentido como proteção. Hoje, são barreiras que podem ser desconstruídas.",
    },
    shortTermForecast: "Novos relacionamentos provavelmente reproduzirão padrões conhecidos nos primeiros meses. Reconhecer esse momento quando acontece é uma habilidade crucial a desenvolver.",
    mediumTermForecast: "No médio prazo, sem trabalho interno, o ciclo tende a se repetir. Com suporte profissional ativo, essa fase pode ser diferente — mas requer comprometimento real.",
    longTermForecast: "Relacionamentos saudáveis a longo prazo exigem transformação interna significativa. Com suporte profissional e comprometimento genuíno, esta transformação é completamente possível — e vale cada passo do caminho.",
    psychologicalProfile: "Seu perfil indica padrões de apego que requerem trabalho terapêutico especializado. Esses padrões têm origem em vínculos formativos e funcionam como scripts automáticos poderosos. Terapia de apego ou abordagens focadas em vínculos são especialmente indicadas.",
    stabilityAnalysis: "A instabilidade emocional é pronunciada e afeta todas as dimensões relacionais. Este é o ponto de maior prioridade para o desenvolvimento — com impacto direto em todas as outras áreas.",
    emotionalMaturity: "Há espaço significativo para desenvolvimento — o que significa que o potencial de transformação é igualmente significativo. Não há teto para o crescimento afetivo quando há comprometimento real.",
    recommendations: [
      "Busque terapia especializada em vínculos e apego como prioridade máxima",
      "Faça uma pausa em relacionamentos românticos para investimento exclusivo em si mesmo",
      "Pratique autocompaixão com seriedade — não como slogan, mas como prática diária",
      "Construa uma rede de suporte emocional fora de relacionamentos românticos",
      "Leia sobre padrões de apego — a compreensão intelectual pode ser um ponto de entrada",
    ],
    conclusion: "Seu relatório NEUROX apresenta uma realidade que requer coragem para encarar — e você já demonstrou essa coragem ao chegar aqui. O caminho até relacionamentos verdadeiramente satisfatórios é real, mas exige investimento sério no processo interno. Você merece esse investimento. E o resultado — quando acontece — muda tudo.",
    risks: ["Novos relacionamentos sem trabalho interno tendem a reproduzir ciclos de dor", "Buscar validação em relacionamentos como substituto para autoconhecimento e cura"],
    idealPartnerProfile: "Neste momento, o foco mais valioso e mais transformador é o relacionamento com você mesmo. Um parceiro ideal surgirá naturalmente quando as bases internas estiverem mais sólidas — e será completamente diferente dos padrões do passado.",
  },

  // ── FAIXA 10: 0–10 → Compatibilidade Muito Baixa ─────────────────────────
  {
    minPercent: 0,
    maxPercent: 10,
    name: "Compatibilidade Muito Baixa",
    compatibilityLevel: "0–10%",
    freeDescription: "Suas respostas indicam padrões afetivos com bloqueios que raramente são identificados com essa clareza. Há uma combinação de experiências não processadas e defesas construídas ao longo do tempo que moldam profundamente como você experimenta os relacionamentos — e o que você atrai e reproduz neles. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil revela o grau mais profundo de desalinhamento afetivo medido pelo sistema NEUROX. Isso não é um julgamento — é um convite para a transformação mais profunda e significativa disponível para qualquer pessoa. Os padrões identificados têm origem real, compreensível e trabalhável. Nenhuma situação é permanente quando há comprometimento com o processo certo.",
    overviewAnalysis: "Com 0–10% de compatibilidade, você está diante do ponto mais difícil — e mais cheio de potencial — da sua trajetória relacional. A dificuldade que os relacionamentos têm representado na sua vida não é aleatória: tem causas identificáveis, compreensíveis e trabalhá­veis. Este relatório não é um veredicto. É um mapa.",
    strengths: ["Ter chegado até aqui revela uma busca genuína por mudança", "Potencial de transformação real — especialmente porque os padrões têm origem identificável", "A clareza que este relatório oferece é um ativo que poucos possuem"],
    strengthsDetail: {
      "Comunicação": "Há momentos raros, mas presentes, de comunicação genuína. Esses momentos provam que a capacidade existe e pode ser cultivada.",
      "Valores": "Mesmo em situações extremamente difíceis, há valores básicos que persistem e podem ser a semente de reconstrução.",
      "Apoio Emocional": "A necessidade de apoio e conexão está presente — frequentemente frustrada, mas não extinta.",
      "Estilo de Vida": "O desejo de algo melhor, de estabilidade e de relacionamentos satisfatórios ainda existe. Esse desejo é o ponto de partida.",
      "Química": "Mesmo que bloqueada por múltiplas defesas, a capacidade de conexão não foi completamente eliminada.",
    },
    challenges: ["Bloqueios emocionais profundos em todas as dimensões avaliadas", "Alto risco de repetição de padrões prejudiciais sem intervenção especializada", "Dificuldade severa e generalizada de conexão genuína"],
    challengesDetail: {
      "Bloqueios Generalizados": "Os bloqueios afetam múltiplas dimensões simultaneamente, o que torna a mudança mais desafiadora — mas não impossível. Requer abordagem especializada e comprometimento.",
      "Repetição de Padrões": "A probabilidade de repetir em novos relacionamentos o que aconteceu nos anteriores é muito alta sem intervenção. Compreender esse mecanismo é urgente.",
      "Conexão Genuína": "As defesas construídas ao longo do tempo são poderosas o suficiente para bloquear conexão genuína na maioria dos contextos. Mas defesas são aprendidas — e o que foi aprendido pode ser reaprendido.",
    },
    shortTermForecast: "Novos relacionamentos provavelmente reproduzirão padrões conhecidos rapidamente. A capacidade de identificar esses momentos e sair do piloto automático é o primeiro objetivo.",
    mediumTermForecast: "Com suporte profissional intensivo, o médio prazo pode ser o período de maior transformação. Mudanças profundas geralmente levam tempo — mas cada passo importa.",
    longTermForecast: "Relacionamentos saudáveis a longo prazo são possíveis — mas requerem uma reconstrução das bases emocionais. Com suporte e comprometimento, pessoas com perfis semelhantes alcançaram transformações extraordinárias.",
    psychologicalProfile: "Seu perfil indica padrões de apego desorganizados ou evitantes profundos, provavelmente com raízes em experiências formativas significativas. Abordagens terapêuticas especializadas — como EMDR, terapia focada no apego ou abordagens somáticas — são especialmente indicadas.",
    stabilityAnalysis: "A instabilidade emocional é o principal ponto de trabalho. É também a área de maior impacto: quando a regulação emocional melhora, todas as outras dimensões afetivas se beneficiam diretamente.",
    emotionalMaturity: "Há muito espaço para crescimento — o que, paradoxalmente, significa que o potencial de transformação é extraordinário. O caminho é longo, mas completamente real.",
    recommendations: [
      "Busque terapia especializada — preferencialmente focada em apego e trauma relacional — como prioridade imediata",
      "Suspenda relacionamentos românticos por um período dedicado exclusivamente ao desenvolvimento pessoal",
      "Pratique autocompaixão radical — a maneira como você fala consigo mesmo sobre seus relacionamentos importa mais do que você pensa",
      "Construa vínculos de amizade saudáveis como primeiro laboratório de conexão",
      "Leia sobre apego, trauma relacional e regulação emocional — o entendimento é uma ferramenta poderosa",
    ],
    conclusion: "Seu relatório NEUROX apresenta o diagnóstico mais desafiador e, ao mesmo tempo, mais cheio de potencial. Cada padrão identificado aqui tem origem. E tudo que tem origem pode ser trabalhado. O caminho não é curto nem fácil — mas é completamente real. E você merece percorrê-lo com o suporte certo.",
    risks: ["Relacionamentos sem base de trabalho interno profundo tendem a causar mais dor", "Buscar validação em outros como substituto para o processo de cura interna"],
    idealPartnerProfile: "O investimento mais urgente e transformador neste momento é na sua relação com você mesmo: terapia, autocuidado, construção de autoestima e conexões de amizade saudáveis. O parceiro ideal virá — e será fundamentalmente diferente — quando essas bases estiverem construídas.",
  },
];

export const getCompatibilityResultBand = (percent: number): CompatibilityResultBand => {
  const found = compatibilityResultBands.find(
    (band) => percent >= band.minPercent && percent <= band.maxPercent
  );
  return found || compatibilityResultBands[compatibilityResultBands.length - 1];
};
