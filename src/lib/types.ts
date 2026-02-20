export type TestType = 'iq' | 'personality' | 'political' | 'career' | 'emotional' | 'cognitive' | 'compatibility';

// Quiz interface - includes pricing (for admin use)
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
  price_basic?: number | null;
  price_premium?: number | null;
  price_certificate?: number | null;
  created_at: string;
  updated_at?: string;
}

// Secure Quiz interface - excludes sensitive pricing data (for public use)
export interface QuizSecure {
  id: string;
  title: string;
  description: string | null;
  test_type: TestType;
  image_url: string | null;
  duration_minutes: number;
  question_count: number;
  is_premium: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Question interface - includes scoring data (for admin/server use)
export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  question_order: number;
  weight?: number | null;
  category?: string | null;
}

// Secure Question interface - excludes scoring data (for public use)
export interface QuestionSecure {
  id: string;
  quiz_id: string;
  question_text: string;
  question_order: number;
  created_at: string;
}

// Answer Option interface - includes score_value (for server-side scoring only)
export interface AnswerOption {
  id: string;
  question_id: string;
  option_text: string;
  option_order: number;
  score_value?: number | null;
  personality_trait?: string | null;
}

// Secure Answer Option interface - excludes score_value (for public use)
export interface AnswerOptionSecure {
  id: string;
  question_id: string;
  option_text: string;
  option_order: number;
  personality_trait?: string | null;
  created_at: string;
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
  compatibility: 'Compatibilidade Amorosa',
};

export const TEST_TYPE_COLORS: Record<TestType, string> = {
  iq: 'from-blue-500 to-indigo-600',
  personality: 'from-purple-500 to-pink-600',
  political: 'from-red-500 to-orange-600',
  career: 'from-green-500 to-teal-600',
  emotional: 'from-rose-500 to-red-600',
  cognitive: 'from-cyan-500 to-blue-600',
  compatibility: 'from-white to-white',
};

export const TEST_TYPE_ICONS: Record<TestType, string> = {
  iq: '🧠',
  personality: '🎭',
  political: '⚖️',
  career: '💼',
  emotional: '✨',
  cognitive: '🔮',
  compatibility: '❤️',
};
