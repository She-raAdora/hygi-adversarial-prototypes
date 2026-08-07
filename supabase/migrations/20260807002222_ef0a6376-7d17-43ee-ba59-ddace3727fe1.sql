CREATE TABLE public.lesson_metric_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('question_missed','question_answered','glossary_open','share','trophy')),
  lesson_id text,
  lesson_title text,
  question_index integer,
  question text,
  term text,
  share_format text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX lesson_metric_events_kind_created_at_idx ON public.lesson_metric_events (kind, created_at DESC);

GRANT INSERT ON public.lesson_metric_events TO anon;
GRANT INSERT, SELECT ON public.lesson_metric_events TO authenticated;
GRANT ALL ON public.lesson_metric_events TO service_role;

ALTER TABLE public.lesson_metric_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can record anonymous lesson metrics"
  ON public.lesson_metric_events FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read lesson metrics"
  ON public.lesson_metric_events FOR SELECT TO authenticated
  USING (current_user_has_role('admin'::app_role));