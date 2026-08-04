-- 1) Explicit deny policies for direct client writes to user_roles
CREATE POLICY "No direct role inserts" ON public.user_roles
  AS RESTRICTIVE FOR INSERT TO authenticated, anon WITH CHECK (false);
CREATE POLICY "No direct role updates" ON public.user_roles
  AS RESTRICTIVE FOR UPDATE TO authenticated, anon USING (false) WITH CHECK (false);
CREATE POLICY "No direct role deletes" ON public.user_roles
  AS RESTRICTIVE FOR DELETE TO authenticated, anon USING (false);

-- 2) Atomic first-admin claim: serialized, and impossible once any admin exists.
CREATE OR REPLACE FUNCTION public.claim_first_admin_seat(_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted boolean := false;
BEGIN
  -- Advisory lock serializes concurrent claims so only one can win.
  PERFORM pg_advisory_xact_lock(hashtext('claim_first_admin_seat'));
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    RETURN false;
  END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, 'admin');
  inserted := true;
  RETURN inserted;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_first_admin_seat(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_admin_seat(uuid) TO service_role;

-- 3) Weekly SEO scan job now presents a server-only secret, not the public key.
SELECT cron.unschedule('hygi-weekly-seo-scan');
SELECT cron.schedule(
  'hygi-weekly-seo-scan',
  '0 7 * * 1',
  $job$
  SELECT net.http_post(
    url := 'https://project--841c0963-da99-4602-b096-ec862faffe4e.lovable.app/api/public/hooks/seo-scan',
    headers := '{"Content-Type": "application/json", "x-seo-scan-secret": "c7986dd65118a24bf0f065ce0758872a8093df4458440140d0ccd237a2505cf1"}'::jsonb,
    body := '{}'::jsonb
  ) as request_id;
  $job$
);