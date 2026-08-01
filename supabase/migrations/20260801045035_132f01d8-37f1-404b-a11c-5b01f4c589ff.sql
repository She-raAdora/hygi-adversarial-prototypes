-- user_roles already has a SELECT policy allowing each user to read their own
-- rows, so this self-scoped check does not need elevated privileges at all.
-- Running as SECURITY INVOKER means RLS applies to the caller directly.
CREATE OR REPLACE FUNCTION public.current_user_has_role(_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role = _role
  )
$$;

REVOKE EXECUTE ON FUNCTION public.current_user_has_role(public.app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.current_user_has_role(public.app_role) FROM anon;
GRANT EXECUTE ON FUNCTION public.current_user_has_role(public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_has_role(public.app_role) TO service_role;