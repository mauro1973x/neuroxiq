-- Insert Career Orientation Test quiz
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
  'd4e5f6a7-b8c9-0123-defa-456789012345',
  'Teste de Orientação de Carreira',
  'Descubra seu perfil vocacional baseado no modelo Holland (RIASEC). Identifique áreas profissionais que combinam com suas aptidões e interesses naturais.',
  'career',
  30,
  42,
  true,
  true,
  0,
  39.90,
  19.90
);