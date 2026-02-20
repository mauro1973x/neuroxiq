export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      answer_options: {
        Row: {
          created_at: string
          id: string
          option_order: number
          option_text: string
          personality_trait: string | null
          question_id: string
          score_value: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          option_order?: number
          option_text: string
          personality_trait?: string | null
          question_id: string
          score_value?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          option_order?: number
          option_text?: string
          personality_trait?: string | null
          question_id?: string
          score_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "answer_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      iq_result_bands: {
        Row: {
          band_order: number
          career_areas: string[] | null
          challenges: string[] | null
          created_at: string
          free_description: string
          id: string
          iq_max: number
          iq_min: number
          max_score: number
          min_score: number
          name: string
          percentile_max: number
          percentile_min: number
          premium_description: string
          recommendations: string[] | null
          strengths: string[] | null
        }
        Insert: {
          band_order: number
          career_areas?: string[] | null
          challenges?: string[] | null
          created_at?: string
          free_description: string
          id?: string
          iq_max: number
          iq_min: number
          max_score: number
          min_score: number
          name: string
          percentile_max: number
          percentile_min: number
          premium_description: string
          recommendations?: string[] | null
          strengths?: string[] | null
        }
        Update: {
          band_order?: number
          career_areas?: string[] | null
          challenges?: string[] | null
          created_at?: string
          free_description?: string
          id?: string
          iq_max?: number
          iq_min?: number
          max_score?: number
          min_score?: number
          name?: string
          percentile_max?: number
          percentile_min?: number
          premium_description?: string
          recommendations?: string[] | null
          strengths?: string[] | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          attempt_id: string | null
          checkout_session_id: string | null
          created_at: string
          error: string | null
          event_type: string
          id: string
          payload_summary: Json | null
          payment_intent_id: string | null
          processed: boolean
          processed_at: string | null
          stripe_event_id: string
          user_id: string | null
        }
        Insert: {
          attempt_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          error?: string | null
          event_type: string
          id?: string
          payload_summary?: Json | null
          payment_intent_id?: string | null
          processed?: boolean
          processed_at?: string | null
          stripe_event_id: string
          user_id?: string | null
        }
        Update: {
          attempt_id?: string | null
          checkout_session_id?: string | null
          created_at?: string
          error?: string | null
          event_type?: string
          id?: string
          payload_summary?: Json | null
          payment_intent_id?: string | null
          processed?: boolean
          processed_at?: string | null
          stripe_event_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          attempt_id: string | null
          completed_at: string | null
          created_at: string
          currency: string | null
          id: string
          payment_type: string
          status: string | null
          stripe_customer_id: string | null
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          attempt_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          payment_type: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          attempt_id?: string | null
          completed_at?: string | null
          created_at?: string
          currency?: string | null
          id?: string
          payment_type?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      political_result_bands: {
        Row: {
          authority_axis: string
          band_order: number
          challenges: string[] | null
          characteristics: string[]
          compatible_careers: string[] | null
          created_at: string
          economic_axis: string
          famous_figures: string[] | null
          free_description: string
          id: string
          max_score: number
          min_score: number
          name: string
          premium_description: string
          social_axis: string
          strengths: string[] | null
        }
        Insert: {
          authority_axis: string
          band_order: number
          challenges?: string[] | null
          characteristics: string[]
          compatible_careers?: string[] | null
          created_at?: string
          economic_axis: string
          famous_figures?: string[] | null
          free_description: string
          id?: string
          max_score: number
          min_score: number
          name: string
          premium_description: string
          social_axis: string
          strengths?: string[] | null
        }
        Update: {
          authority_axis?: string
          band_order?: number
          challenges?: string[] | null
          characteristics?: string[]
          compatible_careers?: string[] | null
          created_at?: string
          economic_axis?: string
          famous_figures?: string[] | null
          free_description?: string
          id?: string
          max_score?: number
          min_score?: number
          name?: string
          premium_description?: string
          social_axis?: string
          strengths?: string[] | null
        }
        Relationships: []
      }
      premium_purchases: {
        Row: {
          amount: number
          attempt_id: string | null
          certificate_generated_at: string | null
          created_at: string
          currency: string | null
          email_sent_at: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          pix_copy_paste: string | null
          pix_expires_at: string | null
          pix_qr_code: string | null
          purchase_type: string
          report_generated_at: string | null
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          attempt_id?: string | null
          certificate_generated_at?: string | null
          created_at?: string
          currency?: string | null
          email_sent_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          pix_copy_paste?: string | null
          pix_expires_at?: string | null
          pix_qr_code?: string | null
          purchase_type: string
          report_generated_at?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          attempt_id?: string | null
          certificate_generated_at?: string | null
          created_at?: string
          currency?: string | null
          email_sent_at?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          pix_copy_paste?: string | null
          pix_expires_at?: string | null
          pix_qr_code?: string | null
          purchase_type?: string
          report_generated_at?: string | null
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "premium_purchases_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "premium_purchases_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          category: string | null
          created_at: string
          id: string
          question_order: number
          question_text: string
          quiz_id: string
          weight: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          question_order?: number
          question_text: string
          quiz_id: string
          weight?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          question_order?: number
          question_text?: string
          quiz_id?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          image_url: string | null
          is_premium: boolean | null
          is_published: boolean | null
          price_basic: number | null
          price_certificate: number | null
          price_premium: number | null
          question_count: number | null
          test_type: Database["public"]["Enums"]["test_type"]
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_premium?: boolean | null
          is_published?: boolean | null
          price_basic?: number | null
          price_certificate?: number | null
          price_premium?: number | null
          question_count?: number | null
          test_type?: Database["public"]["Enums"]["test_type"]
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          image_url?: string | null
          is_premium?: boolean | null
          is_published?: boolean | null
          price_basic?: number | null
          price_certificate?: number | null
          price_premium?: number | null
          question_count?: number | null
          test_type?: Database["public"]["Enums"]["test_type"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          certificate_issued_at: string | null
          certificate_payment_status: string | null
          certificate_url: string | null
          completed_at: string | null
          has_certificate: boolean | null
          has_premium_access: boolean | null
          id: string
          iq_estimated: number | null
          payment_status: string | null
          percentile_rank: number | null
          premium_report_url: string | null
          premium_unlocked_at: string | null
          purchased_at: string | null
          quiz_id: string
          result_category: string | null
          result_description: string | null
          score_label: string | null
          score_value: string | null
          started_at: string
          stripe_certificate_session_id: string | null
          test_name: string | null
          total_score: number | null
          user_id: string
          validation_code: string | null
        }
        Insert: {
          certificate_issued_at?: string | null
          certificate_payment_status?: string | null
          certificate_url?: string | null
          completed_at?: string | null
          has_certificate?: boolean | null
          has_premium_access?: boolean | null
          id?: string
          iq_estimated?: number | null
          payment_status?: string | null
          percentile_rank?: number | null
          premium_report_url?: string | null
          premium_unlocked_at?: string | null
          purchased_at?: string | null
          quiz_id: string
          result_category?: string | null
          result_description?: string | null
          score_label?: string | null
          score_value?: string | null
          started_at?: string
          stripe_certificate_session_id?: string | null
          test_name?: string | null
          total_score?: number | null
          user_id: string
          validation_code?: string | null
        }
        Update: {
          certificate_issued_at?: string | null
          certificate_payment_status?: string | null
          certificate_url?: string | null
          completed_at?: string | null
          has_certificate?: boolean | null
          has_premium_access?: boolean | null
          id?: string
          iq_estimated?: number | null
          payment_status?: string | null
          percentile_rank?: number | null
          premium_report_url?: string | null
          premium_unlocked_at?: string | null
          purchased_at?: string | null
          quiz_id?: string
          result_category?: string | null
          result_description?: string | null
          score_label?: string | null
          score_value?: string | null
          started_at?: string
          stripe_certificate_session_id?: string | null
          test_name?: string | null
          total_score?: number | null
          user_id?: string
          validation_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      user_answers: {
        Row: {
          answered_at: string
          attempt_id: string
          id: string
          question_id: string
          selected_option_id: string
        }
        Insert: {
          answered_at?: string
          attempt_id: string
          id?: string
          question_id: string
          selected_option_id: string
        }
        Update: {
          answered_at?: string
          attempt_id?: string
          id?: string
          question_id?: string
          selected_option_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts_secure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_secure"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "answer_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_answers_selected_option_id_fkey"
            columns: ["selected_option_id"]
            isOneToOne: false
            referencedRelation: "answer_options_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      answer_options_secure: {
        Row: {
          created_at: string | null
          id: string | null
          option_order: number | null
          option_text: string | null
          personality_trait: string | null
          question_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          option_order?: number | null
          option_text?: string | null
          personality_trait?: string | null
          question_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          option_order?: number | null
          option_text?: string | null
          personality_trait?: string | null
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answer_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "answer_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      iq_result_bands_free: {
        Row: {
          band_order: number | null
          created_at: string | null
          free_description: string | null
          id: string | null
          iq_max: number | null
          iq_min: number | null
          max_score: number | null
          min_score: number | null
          name: string | null
          percentile_max: number | null
          percentile_min: number | null
        }
        Insert: {
          band_order?: number | null
          created_at?: string | null
          free_description?: string | null
          id?: string | null
          iq_max?: number | null
          iq_min?: number | null
          max_score?: number | null
          min_score?: number | null
          name?: string | null
          percentile_max?: number | null
          percentile_min?: number | null
        }
        Update: {
          band_order?: number | null
          created_at?: string | null
          free_description?: string | null
          id?: string | null
          iq_max?: number | null
          iq_min?: number | null
          max_score?: number | null
          min_score?: number | null
          name?: string | null
          percentile_max?: number | null
          percentile_min?: number | null
        }
        Relationships: []
      }
      payments_secure: {
        Row: {
          amount: number | null
          attempt_id: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          id: string | null
          payment_type: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          attempt_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string | null
          payment_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          attempt_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          id?: string | null
          payment_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_purchases_secure: {
        Row: {
          amount: number | null
          attempt_id: string | null
          certificate_generated_at: string | null
          created_at: string | null
          currency: string | null
          email_sent_at: string | null
          id: string | null
          payment_method: string | null
          payment_status: string | null
          purchase_type: string | null
          report_generated_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          attempt_id?: string | null
          certificate_generated_at?: string | null
          created_at?: string | null
          currency?: string | null
          email_sent_at?: string | null
          id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          purchase_type?: string | null
          report_generated_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          attempt_id?: string | null
          certificate_generated_at?: string | null
          created_at?: string | null
          currency?: string | null
          email_sent_at?: string | null
          id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          purchase_type?: string | null
          report_generated_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premium_purchases_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "premium_purchases_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "test_attempts_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      questions_secure: {
        Row: {
          created_at: string | null
          id: string | null
          question_order: number | null
          question_text: string | null
          quiz_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          question_order?: number | null
          question_text?: string | null
          quiz_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          question_order?: number | null
          question_text?: string | null
          quiz_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes_secure"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes_secure: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string | null
          image_url: string | null
          is_premium: boolean | null
          is_published: boolean | null
          question_count: number | null
          test_type: Database["public"]["Enums"]["test_type"] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          image_url?: string | null
          is_premium?: boolean | null
          is_published?: boolean | null
          question_count?: number | null
          test_type?: Database["public"]["Enums"]["test_type"] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string | null
          image_url?: string | null
          is_premium?: boolean | null
          is_published?: boolean | null
          question_count?: number | null
          test_type?: Database["public"]["Enums"]["test_type"] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscriptions_secure: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      test_attempts_secure: {
        Row: {
          completed_at: string | null
          has_certificate: boolean | null
          has_premium_access: boolean | null
          id: string | null
          iq_estimated: number | null
          payment_status: string | null
          percentile_rank: number | null
          purchased_at: string | null
          quiz_id: string | null
          result_category: string | null
          result_description: string | null
          started_at: string | null
          total_score: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          has_certificate?: boolean | null
          has_premium_access?: boolean | null
          id?: string | null
          iq_estimated?: number | null
          payment_status?: string | null
          percentile_rank?: number | null
          purchased_at?: string | null
          quiz_id?: string | null
          result_category?: string | null
          result_description?: string | null
          started_at?: string | null
          total_score?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          has_certificate?: boolean | null
          has_premium_access?: boolean | null
          id?: string | null
          iq_estimated?: number | null
          payment_status?: string | null
          percentile_rank?: number | null
          purchased_at?: string | null
          quiz_id?: string | null
          result_category?: string | null
          result_description?: string | null
          started_at?: string | null
          total_score?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes_secure"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_test_score: {
        Args: { p_attempt_id: string }
        Returns: {
          max_possible: number
          percentage: number
          total_score: number
        }[]
      }
      generate_validation_code: { Args: never; Returns: string }
      get_certificate_holder_name: {
        Args: { p_validation_code: string }
        Returns: string
      }
      get_premium_result_band: {
        Args: { p_attempt_id: string }
        Returns: {
          band_order: number
          career_areas: string[]
          challenges: string[]
          free_description: string
          id: string
          iq_max: number
          iq_min: number
          max_score: number
          min_score: number
          name: string
          percentile_max: number
          percentile_min: number
          premium_description: string
          recommendations: string[]
          strengths: string[]
        }[]
      }
      get_premium_urls: {
        Args: { p_attempt_id: string }
        Returns: {
          certificate_url: string
          premium_report_url: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      test_type:
        | "iq"
        | "personality"
        | "political"
        | "career"
        | "emotional"
        | "cognitive"
        | "compatibility"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      test_type: [
        "iq",
        "personality",
        "political",
        "career",
        "emotional",
        "cognitive",
        "compatibility",
      ],
    },
  },
} as const
