ALTER TABLE public.lesson_metric_events
  ADD COLUMN IF NOT EXISTS referrer_domain text,
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS landing_path text;

ALTER TABLE public.lesson_metric_events DROP CONSTRAINT IF EXISTS lesson_metric_events_kind_check;
ALTER TABLE public.lesson_metric_events
  ADD CONSTRAINT lesson_metric_events_kind_check
  CHECK (kind IN ('question_missed','question_answered','glossary_open','share','trophy','onboarding_start','quiz_complete'));

CREATE INDEX IF NOT EXISTS lesson_metric_events_referrer_idx
  ON public.lesson_metric_events (referrer_domain, kind);