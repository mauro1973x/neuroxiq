export type TestType = 'iq' | 'personality' | 'political' | 'career' | 'emotional' | 'cognitive';

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  test_type: TestType;
  image_url: string | null;
  duration_minutes: number;
  question_count: number;
  is_premium: boolean;
  is_published: boolean;
  price_basic: number;
  price_premium: number;
  price_certificate: number;
  created_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_order: number;
  weight: number;
  category: string | null;
}

export interface AnswerOption {
  id: string;
  question_id: string;
  option_text: string;
  option_order: number;
  score_value: number;
  personality_trait: string | null;
}

export interface TestAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  started_at: string;
  completed_at: string | null;
  total_score: number | null;
  result_category: string | null;
  result_description: string | null;
  has_premium_access: boolean;
  has_certificate: boolean;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const TEST_TYPE_LABELS: Record<TestType, string> = {
  iq: 'QI & Inteligência',
  personality: 'Personalidade',
  political: 'Orientação Política',
  career: 'Carreira',
  emotional: 'Inteligência Emocional',
  cognitive: 'Habilidades Cognitivas',
};

export const TEST_TYPE_COLORS: Record<TestType, string> = {
  iq: 'from-blue-500 to-indigo-600',
  personality: 'from-purple-500 to-pink-600',
  political: 'from-red-500 to-orange-600',
  career: 'from-green-500 to-teal-600',
  emotional: 'from-rose-500 to-red-600',
  cognitive: 'from-cyan-500 to-blue-600',
};

export const TEST_TYPE_ICONS: Record<TestType, string> = {
  iq: '🧠',
  personality: '🎭',
  political: '⚖️',
  career: '💼',
  emotional: '❤️',
  cognitive: '🔮',
};
