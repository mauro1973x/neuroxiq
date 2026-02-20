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
  premiumDescription: string;
  strengths: string[];
  risks: string[];
  longTermForecast: string;
  idealPartnerProfile: string;
  recommendations: string[];
}

export const compatibilityResultBands: CompatibilityResultBand[] = [
  {
    minPercent: 95,
    maxPercent: 100,
    name: "Compatibilidade Extremamente Rara",
    compatibilityLevel: "95–100%",
    freeDescription: "Seu perfil revela padrões afetivos e emocionais de alta coerência — uma combinação incomum que indica profunda capacidade de vínculo. Há traços pouco conscientes no seu jeito de amar que explicam conexões que se tornam raras e únicas. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você possui um perfil afetivo extraordinariamente coeso. Seus valores, estilo de comunicação, necessidades emocionais e visão de futuro são altamente integrados. Pessoas com esse nível de auto-harmonia tendem a formar parcerias profundas, maduras e duradouras — quando encontram alguém com compatibilidade semelhante, a relação tem potencial transformador.",
    strengths: ["Autoconhecimento afetivo profundo", "Alta coerência entre valores e comportamento", "Capacidade de vínculo seguro e duradouro", "Comunicação emocional madura", "Clareza sobre o que busca em uma relação"],
    risks: ["Expectativas muito elevadas podem dificultar encontrar parceiros à altura", "Tendência a se frustrar com relacionamentos superficiais"],
    longTermForecast: "Perfis como o seu têm estatisticamente as maiores taxas de satisfação em relacionamentos longos. A probabilidade de construir uma relação sólida e significativa é extremamente alta, desde que haja compatibilidade mútua.",
    idealPartnerProfile: "Alguém com alto nível de maturidade emocional, valores alinhados, capacidade de comunicação aberta e desejo genuíno de profundidade. Que aprecie estabilidade sem abrir mão de crescimento conjunto.",
    recommendations: ["Não acelere: permita que conexões reais se desenvolvam naturalmente", "Busque parceiros com nível equivalente de autoconhecimento", "Valorize qualidade sobre quantidade nas suas conexões afetivas", "Continue investindo no seu desenvolvimento emocional — é seu maior diferencial"],
  },
  {
    minPercent: 90,
    maxPercent: 94,
    name: "Sintonia Afetiva Intensa",
    compatibilityLevel: "90–94%",
    freeDescription: "Suas respostas indicam um padrão afetivo de alta intensidade — traços que explicam por que você forma vínculos mais profundos do que a maioria. Há dimensões no seu perfil emocional que nem sempre são conscientes, mas que determinam o tipo de conexão que você é capaz de criar. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você apresenta sintonia afetiva intensa e uma capacidade rara de investir genuinamente em relacionamentos. Seus padrões emocionais são consistentes e refletem uma visão clara de parceria. Esse perfil é altamente favorável para relacionamentos de longo prazo com profundidade real.",
    strengths: ["Capacidade elevada de conexão emocional", "Investimento genuíno nas relações", "Valores bem definidos", "Comunicação emocionalmente inteligente", "Alto comprometimento"],
    risks: ["Intensidade emocional pode assustar parceiros com menor maturidade afetiva", "Risco de absorver emoções do parceiro excessivamente"],
    longTermForecast: "Alta probabilidade de sucesso em relacionamentos longos. Sua intensidade afetiva é um ativo valioso quando encontra reciprocidade. A estabilidade emocional que você traz à relação é um diferencial significativo.",
    idealPartnerProfile: "Alguém capaz de corresponder à sua intensidade sem se sentir pressionado. Com boa capacidade de escuta, desejo de profundidade e abertura emocional semelhante à sua.",
    recommendations: ["Aprenda a identificar rapidamente pessoas com maturidade emocional equivalente", "Não minimize suas necessidades afetivas para agradar o parceiro", "Cultive espaço para vulnerabilidade mútua na relação", "Observe se há reciprocidade antes de investir totalmente"],
  },
  {
    minPercent: 85,
    maxPercent: 89,
    name: "Compatibilidade Muito Alta",
    compatibilityLevel: "85–89%",
    freeDescription: "Seu perfil revela alta coerência afetiva — uma combinação incomum de clareza de valores e capacidade de vínculo que poucas pessoas desenvolvem. Existem padrões na sua forma de se relacionar que explicam a qualidade das conexões que você experimenta. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você demonstra um perfil afetivo muito bem estruturado. Sua capacidade de comunicação, clareza de valores e disposição para apoio emocional colocam você em posição privilegiada para relacionamentos saudáveis e duradouros. Há apenas algumas nuances a ajustar para maximizar seu potencial relacional.",
    strengths: ["Forte clareza de valores", "Boa comunicação emocional", "Disposição para compromisso", "Equilíbrio entre autonomia e conexão"],
    risks: ["Ocasional dificuldade em expressar necessidades em momentos de vulnerabilidade", "Pode subestimar diferenças de estilo de vida"],
    longTermForecast: "Probabilidade muito alta de construir relacionamentos satisfatórios e duradouros. Pequenos ajustes no estilo de comunicação podem elevar ainda mais a qualidade das suas conexões.",
    idealPartnerProfile: "Alguém comprometido, com boa base emocional, que aprecie estabilidade e planejamento conjunto. Que demonstre afeto de forma consistente e tenha valores familiares alinhados.",
    recommendations: ["Invista em comunicação sobre expectativas desde o início", "Não negligencie a expressão das suas próprias necessidades", "Observe compatibilidade de longo prazo, não apenas sintonia inicial"],
  },
  {
    minPercent: 80,
    maxPercent: 84,
    name: "Compatibilidade Forte",
    compatibilityLevel: "80–84%",
    freeDescription: "Suas respostas indicam um perfil afetivo sólido — padrão pouco percebido que revela uma combinação de abertura emocional e valores bem estabelecidos. Existem camadas no seu funcionamento relacional que determinam como você escolhe e mantém vínculos. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você possui uma base afetiva forte, com boas capacidades relacionais em várias dimensões. Seu perfil indica alguém comprometido com a qualidade dos seus vínculos, com espaço para aprofundar algumas áreas específicas.",
    strengths: ["Comprometimento com qualidade nos vínculos", "Boa base de valores", "Capacidade de apoio emocional", "Abertura para diálogo"],
    risks: ["Algumas inconsistências entre o que valoriza e o que pratica em momentos de pressão", "Possível dificuldade em manter profundidade ao longo do tempo"],
    longTermForecast: "Alta probabilidade de relacionamentos estáveis. Com atenção às áreas de desenvolvimento, pode alcançar níveis muito elevados de satisfação relacional.",
    idealPartnerProfile: "Parceiro paciente, que valorize estabilidade e demonstre afeto de forma consistente. Que tenha objetivos de vida semelhantes e comunicação aberta.",
    recommendations: ["Pratique consistência entre seus valores declarados e comportamento", "Invista em rituais de conexão com o parceiro", "Trabalhe a expressão de vulnerabilidade em momentos difíceis"],
  },
  {
    minPercent: 70,
    maxPercent: 79,
    name: "Compatibilidade Positiva",
    compatibilityLevel: "70–79%",
    freeDescription: "Seu perfil revela capacidade real de vínculo com características que, quando ativadas, criam conexões genuínas — um padrão que contém traços pouco explorados sobre como você ama. Há dimensões emocionais no seu modo relacional que nem sempre você percebe conscientemente. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você possui boas bases relacionais, com pontos fortes claros e algumas áreas que, quando desenvolvidas, elevarão significativamente sua satisfação afetiva. Seu perfil indica uma jornada de crescimento relacional em progresso.",
    strengths: ["Boa intenção relacional", "Capacidade de empatia", "Abertura para compromisso", "Valores estruturados"],
    risks: ["Inconsistências ocasionais na comunicação emocional", "Possível conflito entre necessidades de independência e vínculo"],
    longTermForecast: "Boas perspectivas de relacionamentos duradouros com parceiro compatível. O desenvolvimento das áreas identificadas pode transformar significativamente a qualidade das suas relações.",
    idealPartnerProfile: "Alguém com paciência, estabilidade emocional e clareza de valores. Que encare o relacionamento como um projeto conjunto de crescimento.",
    recommendations: ["Identifique padrões que se repetem nos seus relacionamentos", "Desenvolva clareza sobre suas necessidades afetivas prioritárias", "Invista em comunicação não-violenta"],
  },
  {
    minPercent: 60,
    maxPercent: 69,
    name: "Compatibilidade Moderada",
    compatibilityLevel: "60–69%",
    freeDescription: "Suas respostas indicam um perfil afetivo em desenvolvimento — combinação de pontos fortes e áreas que ainda não foram completamente exploradas. Há padrões no seu jeito de se relacionar que explicam tanto as conexões que funcionam quanto as que se frustram. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Você demonstra algumas habilidades relacionais importantes, mas existem áreas de tensão que podem criar dificuldades em relacionamentos. Com clareza e desenvolvimento, seu potencial relacional pode aumentar consideravelmente.",
    strengths: ["Presença de valores claros em algumas áreas", "Capacidade de afeto", "Disposição para relacionamentos"],
    risks: ["Conflitos internos entre necessidades e comportamentos", "Comunicação emocional irregular", "Possível instabilidade nas expectativas"],
    longTermForecast: "Perspectivas moderadas sem intervenção. Com desenvolvimento consciente das áreas identificadas, a probabilidade de sucesso em relacionamentos duradouros aumenta significativamente.",
    idealPartnerProfile: "Parceiro compreensivo, com alta maturidade emocional e disposição para crescimento conjunto. Que tolere inconsistências durante o processo de desenvolvimento.",
    recommendations: ["Invista em autoconhecimento afetivo antes de novos relacionamentos", "Identifique padrões repetitivos que precisam ser transformados", "Considere terapia ou coaching de relacionamentos"],
  },
  {
    minPercent: 50,
    maxPercent: 59,
    name: "Compatibilidade Instável",
    compatibilityLevel: "50–59%",
    freeDescription: "Seu perfil revela tensões internas no campo afetivo — padrões pouco percebidos que explicam os altos e baixos nas suas conexões emocionais. Existem contradições entre o que você deseja e como se comporta em relacionamentos. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil indica inconsistências significativas em várias dimensões afetivas. Isso não é um julgamento — é um mapa. Compreender essas tensões é o primeiro passo para transformá-las.",
    strengths: ["Consciência de que há algo a desenvolver", "Capacidade de afeto presente em algumas dimensões"],
    risks: ["Padrões de comunicação inconsistentes", "Conflito entre necessidades de conexão e comportamentos distanciadores", "Instabilidade emocional em contextos relacionais"],
    longTermForecast: "Relacionamentos longos podem apresentar desafios recorrentes sem trabalho interno. Com desenvolvimento focado, a transformação é possível e os resultados podem ser significativos.",
    idealPartnerProfile: "Parceiro com alta estabilidade emocional, muita paciência e disposição para suporte mútuo. Que entenda processos de desenvolvimento e não confunda inconsistência com falta de amor.",
    recommendations: ["Priorize autoconhecimento profundo antes de novos comprometimentos", "Identifique as origens dos seus padrões relacionais", "Busque apoio terapêutico especializado em relacionamentos", "Trabalhe expectativas com honestidade"],
  },
  {
    minPercent: 40,
    maxPercent: 49,
    name: "Compatibilidade Baixa",
    compatibilityLevel: "40–49%",
    freeDescription: "Suas respostas indicam um perfil afetivo com tensões importantes — características que nem sempre são conscientes mas que moldam os padrões nos seus relacionamentos. Há uma combinação de bloqueios e potencial que define como você se conecta. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil atual mostra áreas significativas de desenvolvimento em múltiplas dimensões afetivas. Isso representa uma oportunidade genuína de crescimento — não um limite permanente.",
    strengths: ["Potencial de crescimento disponível", "Presença de alguma capacidade de afeto"],
    risks: ["Dificuldades de comunicação emocional", "Conflito significativo entre valores declarados e comportamentos", "Tendência a padrões relacionais insatisfatórios"],
    longTermForecast: "Sem trabalho interno, há risco de repetição de padrões em novos relacionamentos. Com investimento focado, mudança profunda é alcançável.",
    idealPartnerProfile: "Parceiro com alta estabilidade, muito suporte e disposição para crescimento conjunto. Que compreenda vulnerabilidades e não as utilize como fraquezas.",
    recommendations: ["Invista pesado em terapia ou coaching especializado", "Faça uma pausa reflexiva antes de novos relacionamentos", "Mapeie padrões recorrentes nos relacionamentos passados", "Desenvolva autocuidado e autocompaixão primeiro"],
  },
  {
    minPercent: 30,
    maxPercent: 39,
    name: "Compatibilidade Muito Baixa",
    compatibilityLevel: "30–39%",
    freeDescription: "Seu perfil revela bloqueios afetivos profundos — um padrão pouco percebido que explica dificuldades recorrentes em criar vínculos saudáveis. Há camadas emocionais que ainda não foram processadas e que afetam diretamente como você experimenta os relacionamentos. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil atual indica desalinhamentos importantes entre várias dimensões afetivas. Esta é uma informação valiosa: a maioria das pessoas nunca recebe clareza sobre esses padrões. O mapa detalhado que preparamos é o ponto de partida para uma transformação real.",
    strengths: ["Disposição para fazer o teste indica consciência", "Potencial de transformação com suporte adequado"],
    risks: ["Padrões relacionais disfuncionais estruturados", "Alta tendência a repetição de ciclos afetivos negativos", "Dificuldade de conexão genuína em várias dimensões"],
    longTermForecast: "Relacionamentos duradouros exigirão trabalho interno significativo. A boa notícia: com suporte adequado e comprometimento, mudança profunda é possível.",
    idealPartnerProfile: "Neste momento, o foco recomendado é o relacionamento com você mesmo. Um parceiro ideal será identificado com mais clareza após o trabalho interno necessário.",
    recommendations: ["Priorize terapia individual antes de relacionamentos sérios", "Mapeie origens dos seus padrões afetivos", "Pratique conexão consigo mesmo através de mindfulness", "Construa rede de suporte emocional sólida"],
  },
  {
    minPercent: 0,
    maxPercent: 29,
    name: "Compatibilidade Crítica",
    compatibilityLevel: "0–29%",
    freeDescription: "Suas respostas indicam padrões afetivos com bloqueios significativos — características que explicam por que os relacionamentos representam um território de dor ou confusão. Há traços emocionais profundamente arraigados que nem sempre aparecem na superfície. A análise completa revela o que esse perfil significa na sua vida, decisões e relações.",
    premiumDescription: "Seu perfil revela desalinhamentos críticos em múltiplas dimensões afetivas. Esta é uma informação importante e, mais do que isso, é o começo de uma compreensão que pode mudar completamente sua trajetória relacional. Nenhum padrão é permanente quando há clareza e suporte.",
    strengths: ["Coragem de se conhecer profundamente", "Potencial real de transformação"],
    risks: ["Bloqueios emocionais profundos em múltiplas dimensões", "Alto risco de repetição de padrões prejudiciais", "Dificuldade severa de conexão e vínculo"],
    longTermForecast: "A construção de relacionamentos saudáveis requer um investimento interno significativo. Com suporte profissional e comprometimento genuíno, transformação é possível e tem sido documentada.",
    idealPartnerProfile: "O parceiro ideal neste momento é o autoconhecimento e o cuidado com sua saúde emocional. Relações futuras serão muito mais satisfatórias após esse processo.",
    recommendations: ["Busque terapia especializada em vínculos afetivos imediatamente", "Não inicie novos relacionamentos sérios antes do processo interno", "Pratique autocompaixão diariamente", "Construa relacionamentos de amizade saudáveis como treino para vínculos"],
  },
];

export const getCompatibilityResultBand = (percent: number): CompatibilityResultBand => {
  return compatibilityResultBands.find(
    (band) => percent >= band.minPercent && percent <= band.maxPercent
  ) || compatibilityResultBands[compatibilityResultBands.length - 1];
};
