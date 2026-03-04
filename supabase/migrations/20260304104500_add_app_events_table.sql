-- Centralized client/app observability events.
CREATE TABLE IF NOT EXISTS public.app_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  event_level text NOT NULL DEFAULT 'info',
  event_category text NOT NULL DEFAULT 'frontend',
  path text NULL,
  message text NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  source text NOT NULL DEFAULT 'web'
);

CREATE INDEX IF NOT EXISTS idx_app_events_created_at ON public.app_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_events_event_name ON public.app_events (event_name);
CREATE INDEX IF NOT EXISTS idx_app_events_event_level ON public.app_events (event_level);
CREATE INDEX IF NOT EXISTS idx_app_events_user_id ON public.app_events (user_id);

ALTER TABLE public.app_events ENABLE ROW LEVEL SECURITY;

-- Only service-role should write/read by default.
-- Dashboard queries and edge functions using service role bypass RLS.
