-- Insert personality quiz
INSERT INTO public.quizzes (
  id,
  title,
  description,
  test_type,
  duration_minutes,
  question_count,
  is_premium,
  is_published,
  price_basic,
  price_premium,
  price_certificate
) VALUES (
  'c3d4e5f6-a7b8-9012-cdef-345678901234',
  'Teste de Personalidade (Big Five)',
  'Descubra seu perfil de personalidade baseado no modelo científico Big Five (OCEAN). Avalia abertura, conscienciosidade, extroversão, amabilidade e estabilidade emocional.',
  'personality',
  30,
  40,
  true,
  true,
  0,
  39.90,
  19.90
);