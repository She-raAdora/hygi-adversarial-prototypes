DROP POLICY IF EXISTS "Anyone can record anonymous lesson metrics" ON public.lesson_metric_events;
CREATE POLICY "Anyone can record well-formed lesson metrics"
  ON public.lesson_metric_events FOR INSERT TO anon, authenticated
  WITH CHECK (
    kind IN ('question_missed','question_answered','glossary_open','share','trophy','onboarding_start','quiz_complete')
    AND created_at >= now() - interval '5 minutes' AND created_at <= now() + interval '5 minutes'
    AND (lesson_id IS NULL OR length(lesson_id) <= 100)
    AND (lesson_title IS NULL OR length(lesson_title) <= 200)
    AND (question IS NULL OR length(question) <= 1000)
    AND (term IS NULL OR length(term) <= 100)
    AND (share_format IS NULL OR length(share_format) <= 50)
    AND (question_index IS NULL OR question_index BETWEEN 0 AND 100)
    AND (referrer_domain IS NULL OR length(referrer_domain) <= 255)
    AND (utm_source IS NULL OR length(utm_source) <= 100)
    AND (landing_path IS NULL OR length(landing_path) <= 500)
  );