-- Insert emotional intelligence quiz
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
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'Teste de Inteligência Emocional (QE)',
  'Avalie sua capacidade emocional em situações pessoais, sociais e profissionais. Mede autoconsciência, empatia, autocontrole, motivação e habilidades sociais.',
  'emotional',
  20,
  30,
  true,
  true,
  0,
  49.90,
  24.90
);