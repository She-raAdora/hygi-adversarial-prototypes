CREATE TABLE public.learner_progress (
  user_id uuid PRIMARY KEY,
  badges jsonb NOT NULL DEFAULT '{}'::jsonb,
  extras jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT learner_progress_size CHECK (pg_column_size(badges) < 20000 AND pg_column_size(extras) < 20000)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.learner_progress TO authenticated;
GRANT ALL ON public.learner_progress TO service_role;
ALTER TABLE public.learner_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners read own progress" ON public.learner_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Learners create own progress" ON public.learner_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Learners update own progress" ON public.learner_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Learners delete own progress" ON public.learner_progress FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER learner_progress_touch BEFORE UPDATE ON public.learner_progress FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();