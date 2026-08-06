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

-- 3) Weekly SEO scan job.
-- The shared secret is intentionally NOT stored here. It lives in the
-- private.job_secrets table (populated out-of-band, never in version control)
-- and the job reads it at run time. See the later migration that creates that
-- table and the reschedule applied alongside it.
