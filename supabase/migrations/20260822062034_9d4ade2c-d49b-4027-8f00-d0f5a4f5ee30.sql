CREATE TABLE public.backlink_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  target TEXT NOT NULL,
  authority_score INTEGER,
  trust_score INTEGER,
  total_backlinks BIGINT,
  referring_domains INTEGER,
  referring_ips INTEGER,
  follow_links BIGINT,
  nofollow_links BIGINT,
  domains JSONB NOT NULL DEFAULT '[]'::jsonb,
  anchors JSONB NOT NULL DEFAULT '[]'::jsonb,
  new_domains JSONB NOT NULL DEFAULT '[]'::jsonb,
  lost_domains JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE INDEX backlink_snapshots_captured_at_idx ON public.backlink_snapshots (target, captured_at DESC);

GRANT SELECT, INSERT ON public.backlink_snapshots TO authenticated;
GRANT ALL ON public.backlink_snapshots TO service_role;

ALTER TABLE public.backlink_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read backlink snapshots"
ON public.backlink_snapshots FOR SELECT TO authenticated
USING (public.current_user_has_role('admin'::public.app_role));

CREATE POLICY "Admins can record backlink snapshots"
ON public.backlink_snapshots FOR INSERT TO authenticated
WITH CHECK (public.current_user_has_role('admin'::public.app_role));