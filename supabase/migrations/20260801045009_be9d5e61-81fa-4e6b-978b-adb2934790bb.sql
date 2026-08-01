-- Reserve the arbitrary-user role lookup for server-side/privileged use only.
-- Signed-in users must not be able to probe other accounts' roles.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;

-- Self-scoped replacement: derives the account from the verified session,
-- so a caller can only ever ask about their own roles.
CREATE OR REPLACE FUNCTION public.current_user_has_role(_role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
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