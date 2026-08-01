CREATE TABLE public.seo_scan_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ran_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  base_url TEXT NOT NULL,
  status TEXT NOT NULL,
  failing_count INTEGER NOT NULL DEFAULT 0,
  passing_count INTEGER NOT NULL DEFAULT 0,
  checks JSONB NOT NULL DEFAULT '[]'::jsonb,
  regressions JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX seo_scan_runs_ran_at_idx ON public.seo_scan_runs (ran_at DESC);

GRANT SELECT ON public.seo_scan_runs TO authenticated;
GRANT ALL ON public.seo_scan_runs TO service_role;

ALTER TABLE public.seo_scan_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read SEO scan runs"
ON public.seo_scan_runs
FOR SELECT
TO authenticated
USING (public.current_user_has_role('admin'::app_role));