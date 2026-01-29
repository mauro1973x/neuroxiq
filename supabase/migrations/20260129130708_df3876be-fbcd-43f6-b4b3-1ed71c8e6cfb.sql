-- Create political result bands table for 10 ideological levels
CREATE TABLE public.political_result_bands (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  band_order integer NOT NULL,
  min_score integer NOT NULL,
  max_score integer NOT NULL,
  economic_axis text NOT NULL,
  social_axis text NOT NULL,
  authority_axis text NOT NULL,
  free_description text NOT NULL,
  premium_description text NOT NULL,
  characteristics text[] NOT NULL,
  famous_figures text[],
  compatible_careers text[],
  strengths text[],
  challenges text[],
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.political_result_bands ENABLE ROW LEVEL SECURITY;

-- Users can view basic info
CREATE POLICY "Users can view political result bands"
  ON public.political_result_bands FOR SELECT
  USING (true);

-- Admins can manage
CREATE POLICY "Admins can manage political result bands"
  ON public.political_result_bands FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert the 10 political orientation levels
INSERT INTO public.political_result_bands (name, band_order, min_score, max_score, economic_axis, social_axis, authority_axis, free_description, premium_description, characteristics, famous_figures, compatible_careers, strengths, challenges) VALUES
(
  'Libertário de Esquerda',
  1,
  0,
  9,
  'Economia coletivista/redistributiva',
  'Progressista social',
  'Anti-autoritário',
  'Você combina valores sociais progressistas com economia redistributiva e forte oposição ao autoritarismo. Valoriza liberdades individuais e justiça social.',
  'Seu perfil político-ideológico indica uma visão de mundo que combina a defesa de liberdades individuais amplas com um modelo econômico focado em redistribuição e bem-estar coletivo. Você tende a questionar estruturas hierárquicas tradicionais e autoridades estabelecidas, preferindo modelos mais horizontais de organização social. Historicamente, esta posição está associada a movimentos como o anarquismo social, municipalismo libertário e certas correntes do socialismo democrático.',
  ARRAY['Defesa de liberdades civis amplas', 'Apoio a políticas redistributivas', 'Questionamento de hierarquias tradicionais', 'Valorização de movimentos sociais', 'Internacionalismo'],
  ARRAY['Noam Chomsky', 'Emma Goldman', 'Murray Bookchin'],
  ARRAY['ONGs e terceiro setor', 'Movimentos sociais', 'Educação popular', 'Jornalismo independente', 'Cooperativas'],
  ARRAY['Empatia social', 'Pensamento crítico', 'Valorização da diversidade', 'Consciência coletiva'],
  ARRAY['Pode subestimar complexidades econômicas', 'Tendência ao idealismo', 'Dificuldade com pragmatismo político']
),
(
  'Social-Democrata',
  2,
  10,
  19,
  'Economia mista regulada',
  'Progressista moderado',
  'Democrático institucional',
  'Você defende um equilíbrio entre mercado e Estado, com forte rede de proteção social e instituições democráticas robustas.',
  'Seu perfil indica afinidade com a tradição social-democrata, que busca conciliar a eficiência da economia de mercado com políticas públicas de bem-estar social. Você valoriza instituições democráticas fortes, sindicatos, e um Estado que garanta direitos básicos como saúde, educação e aposentadoria. Esta posição é influente nos países nórdicos e em muitas democracias europeias.',
  ARRAY['Defesa do Estado de bem-estar', 'Apoio a sindicatos e negociação coletiva', 'Regulação do mercado', 'Progressismo gradual', 'Multilateralismo'],
  ARRAY['Olof Palme', 'Willy Brandt', 'Bernie Sanders'],
  ARRAY['Serviço público', 'Políticas públicas', 'Economia', 'Direito trabalhista', 'Gestão de ONGs'],
  ARRAY['Pragmatismo', 'Capacidade de negociação', 'Visão sistêmica', 'Compromisso social'],
  ARRAY['Pode parecer pouco radical para alguns', 'Tensão entre eficiência e equidade', 'Dependência de crescimento econômico']
),
(
  'Progressista Liberal',
  3,
  20,
  29,
  'Economia de mercado com regulação social',
  'Socialmente liberal',
  'Democrático plural',
  'Você combina apoio à economia de mercado com valores sociais progressistas, defendendo igualdade de direitos e sustentabilidade.',
  'Seu perfil combina liberalismo econômico moderado com progressismo em questões sociais e culturais. Você tende a apoiar o capitalismo regulado, a globalização, os direitos das minorias e a sustentabilidade ambiental. Esta posição é comum em partidos liberais progressistas e no centro-esquerda de democracias ocidentais.',
  ARRAY['Economia de mercado com responsabilidade social', 'Direitos das minorias', 'Sustentabilidade ambiental', 'Educação e meritocracia', 'Globalização responsável'],
  ARRAY['Barack Obama', 'Emmanuel Macron', 'Justin Trudeau'],
  ARRAY['Direito', 'Consultoria', 'Tecnologia', 'Empreendedorismo social', 'Relações internacionais'],
  ARRAY['Flexibilidade ideológica', 'Cosmopolitismo', 'Inovação', 'Tolerância'],
  ARRAY['Pode parecer elitista', 'Tensão entre mercado e meio ambiente', 'Críticas de ambos os lados do espectro']
),
(
  'Centrista Pragmático',
  4,
  30,
  39,
  'Economia mista flexível',
  'Moderado adaptativo',
  'Institucionalista',
  'Você busca soluções práticas independente de ideologias, valorizando estabilidade, consenso e reformas graduais.',
  'Seu perfil indica uma abordagem pragmática da política, priorizando resultados práticos sobre pureza ideológica. Você tende a avaliar propostas caso a caso, buscando consensos e evitando extremos. Valoriza a estabilidade institucional e acredita que boas ideias podem vir de diferentes posições do espectro político.',
  ARRAY['Busca de consenso', 'Reformismo gradual', 'Avaliação caso a caso', 'Estabilidade institucional', 'Diálogo entre posições'],
  ARRAY['Angela Merkel', 'Bill Clinton', 'Tony Blair'],
  ARRAY['Gestão pública', 'Mediação e arbitragem', 'Administração', 'Diplomacia', 'Análise de políticas'],
  ARRAY['Adaptabilidade', 'Capacidade de diálogo', 'Senso prático', 'Estabilidade emocional'],
  ARRAY['Pode parecer sem convicções', 'Dificuldade em mobilizar paixões', 'Risco de manter status quo problemático']
),
(
  'Liberal Clássico',
  5,
  40,
  49,
  'Livre mercado com Estado mínimo',
  'Liberdades individuais',
  'Constitucionalista',
  'Você defende liberdades individuais amplas, economia de livre mercado e Estado limitado às funções essenciais.',
  'Seu perfil está alinhado com o liberalismo clássico, que enfatiza a liberdade individual como valor supremo, tanto na esfera econômica quanto pessoal. Você tende a desconfiar de intervenções estatais, defendendo que o mercado livre e a iniciativa individual são os melhores mecanismos para organizar a sociedade.',
  ARRAY['Liberdade econômica', 'Direitos de propriedade', 'Estado limitado', 'Livre iniciativa', 'Responsabilidade individual'],
  ARRAY['Adam Smith', 'John Locke', 'Milton Friedman'],
  ARRAY['Empreendedorismo', 'Mercado financeiro', 'Advocacia empresarial', 'Consultoria estratégica', 'Comércio internacional'],
  ARRAY['Iniciativa própria', 'Pensamento independente', 'Valorização da meritocracia', 'Eficiência'],
  ARRAY['Pode subestimar desigualdades estruturais', 'Risco de individualismo excessivo', 'Tensão com questões ambientais']
),
(
  'Conservador Moderado',
  6,
  50,
  59,
  'Capitalismo com responsabilidade',
  'Tradicionalista moderado',
  'Hierarquia orgânica',
  'Você valoriza tradições e instituições estabelecidas, apoiando mudanças graduais que preservem a estabilidade social.',
  'Seu perfil indica afinidade com o conservadorismo tradicional, que valoriza a prudência, a tradição e a mudança gradual. Você tende a respeitar instituições estabelecidas como família, religião e comunidade local, acreditando que elas transmitem sabedoria acumulada através das gerações. Economicamente, apoia o capitalismo com responsabilidade social.',
  ARRAY['Valorização da tradição', 'Mudança gradual', 'Família e comunidade', 'Patriotismo moderado', 'Responsabilidade fiscal'],
  ARRAY['Edmund Burke', 'Winston Churchill', 'Ronald Reagan'],
  ARRAY['Gestão empresarial', 'Direito', 'Forças Armadas', 'Administração pública', 'Educação tradicional'],
  ARRAY['Prudência', 'Senso de continuidade', 'Responsabilidade', 'Estabilidade'],
  ARRAY['Pode resistir a mudanças necessárias', 'Tensão com grupos minoritários', 'Risco de nostalgia excessiva']
),
(
  'Conservador Livre-Mercadista',
  7,
  60,
  69,
  'Capitalismo desregulado',
  'Conservador social',
  'Governo limitado',
  'Você combina conservadorismo social com forte defesa do livre mercado e redução significativa do papel do Estado.',
  'Seu perfil combina valores sociais conservadores com liberalismo econômico robusto. Você tende a defender a família tradicional, valores religiosos e patriotismo, ao mesmo tempo em que apoia fortemente o livre mercado, a desregulação e a redução de impostos. Esta posição é influente em partidos de centro-direita em muitos países.',
  ARRAY['Livre mercado radical', 'Valores tradicionais', 'Baixos impostos', 'Desregulação', 'Soberania nacional'],
  ARRAY['Margaret Thatcher', 'Friedrich Hayek', 'Barry Goldwater'],
  ARRAY['Finanças', 'Empreendedorismo', 'Agronegócio', 'Indústria', 'Advocacia tributária'],
  ARRAY['Determinação', 'Pragmatismo econômico', 'Disciplina', 'Foco em resultados'],
  ARRAY['Pode ignorar externalidades negativas', 'Tensão entre tradição e modernização', 'Risco de desigualdade crescente']
),
(
  'Tradicionalista',
  8,
  70,
  79,
  'Economia subordinada a valores',
  'Conservador forte',
  'Ordem e hierarquia',
  'Você prioriza a preservação de valores tradicionais, ordem social e instituições históricas sobre considerações econômicas.',
  'Seu perfil indica forte afinidade com o tradicionalismo, que vê a preservação da ordem moral e social como prioridade. Você tende a valorizar profundamente a família, a religião, a nação e as instituições históricas, acreditando que a modernidade trouxe uma crise de valores que precisa ser revertida. A economia é vista como meio para fins maiores.',
  ARRAY['Preservação de valores', 'Família tradicional', 'Religiosidade', 'Ordem social', 'Identidade nacional'],
  ARRAY['Russell Kirk', 'Roger Scruton', 'G.K. Chesterton'],
  ARRAY['Clero', 'Educação religiosa', 'Direito de família', 'História', 'Filosofia'],
  ARRAY['Senso de propósito', 'Comunidade forte', 'Continuidade histórica', 'Valores claros'],
  ARRAY['Dificuldade com pluralismo', 'Tensão com modernidade', 'Risco de exclusão de diferentes']
),
(
  'Nacionalista Conservador',
  9,
  80,
  89,
  'Protecionismo estratégico',
  'Nacionalista cultural',
  'Soberania nacional forte',
  'Você prioriza a soberania nacional, identidade cultural e proteção das tradições nacionais contra influências externas.',
  'Seu perfil indica forte identificação com o nacionalismo conservador, que coloca a nação, sua cultura e soberania no centro da vida política. Você tende a priorizar os interesses nacionais sobre compromissos internacionais, defender fronteiras mais rígidas e preservar a identidade cultural contra o que percebe como ameaças externas ou globalistas.',
  ARRAY['Soberania nacional', 'Proteção cultural', 'Controle de fronteiras', 'Ceticismo sobre globalização', 'Patriotismo forte'],
  ARRAY['Charles de Gaulle', 'Viktor Orbán', 'Marine Le Pen'],
  ARRAY['Forças Armadas', 'Diplomacia', 'Segurança pública', 'Defesa', 'Política externa'],
  ARRAY['Patriotismo', 'Senso de identidade', 'Defesa de interesses', 'Coesão social'],
  ARRAY['Risco de xenofobia', 'Tensão com comunidade internacional', 'Protecionismo pode prejudicar economia']
),
(
  'Autoritário Nacionalista',
  10,
  90,
  100,
  'Economia dirigida pelo Estado',
  'Coletivismo nacional',
  'Autoridade centralizada',
  'Você defende um Estado forte e centralizado, subordinação do indivíduo à nação e controle estatal sobre economia e sociedade.',
  'Seu perfil indica preferência por um modelo político que centraliza o poder para defender os interesses nacionais. Você tende a priorizar a ordem, a unidade nacional e a força do Estado sobre liberdades individuais. Este perfil está associado historicamente a regimes autoritários de diversas orientações. Recomendamos reflexão crítica sobre os riscos históricos deste posicionamento.',
  ARRAY['Estado forte', 'Unidade nacional', 'Ordem sobre liberdade', 'Liderança centralizada', 'Disciplina coletiva'],
  ARRAY['Referências históricas controversas'],
  ARRAY['Forças de segurança', 'Administração estatal', 'Planejamento central'],
  ARRAY['Capacidade de mobilização', 'Senso de ordem', 'Determinação'],
  ARRAY['Supressão de liberdades', 'Risco de abusos de poder', 'Histórico de violações de direitos', 'Incompatibilidade com democracia']
);

-- Insert the political quiz into quizzes table
INSERT INTO public.quizzes (id, title, description, test_type, duration_minutes, question_count, is_published, is_premium, price_premium, price_certificate)
VALUES (
  'e5f6a7b8-c9d0-1234-efab-567890123456',
  'Teste de Orientação Político-Ideológica',
  'Avalie seu posicionamento no espectro político através de 40 questões sobre economia, sociedade, autoridade e valores. Descubra onde você se situa entre 10 perfis ideológicos distintos.',
  'political',
  25,
  40,
  true,
  true,
  29.90,
  19.90
);