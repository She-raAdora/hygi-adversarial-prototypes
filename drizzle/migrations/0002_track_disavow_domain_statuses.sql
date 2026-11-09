CREATE TABLE public.disavow_domain_statuses (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 upload_id uuid NOT NULL REFERENCES public.disavow_uploads(id) ON DELETE CASCADE,
 domain text NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('accepted','pending','rejected')),
 updated_at timestamptz NOT NULL DEFAULT now(),
 updated_by uuid,
 UNIQUE(upload_id, domain)
);
GRANT SELECT, UPDATE ON public.disavow_domain_statuses TO authenticated;
GRANT ALL ON public.disavow_domain_statuses TO service_role;
ALTER TABLE public.disavow_domain_statuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read domain statuses" ON public.disavow_domain_statuses FOR SELECT TO authenticated USING (public.current_user_has_role('admin'));
CREATE POLICY "Admins update domain statuses" ON public.disavow_domain_statuses FOR UPDATE TO authenticated USING (public.current_user_has_role('admin')) WITH CHECK (public.current_user_has_role('admin'));
CREATE FUNCTION public.validate_disavow_domain_status() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NEW.id IS DISTINCT FROM OLD.id OR NEW.upload_id IS DISTINCT FROM OLD.upload_id OR NEW.domain IS DISTINCT FROM OLD.domain THEN
 RAISE EXCEPTION 'Submitted domain identity cannot be changed';
 END IF;
 NEW.updated_at := now();
 NEW.updated_by := auth.uid();
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_disavow_domain_status BEFORE UPDATE ON public.disavow_domain_statuses FOR EACH ROW EXECUTE FUNCTION public.validate_disavow_domain_status();
CREATE FUNCTION public.create_disavow_domain_statuses() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.disavow_domain_statuses (upload_id, domain)
 SELECT NEW.id, lower(trim(d)) FROM unnest(NEW.domains) d WHERE trim(d) <> '' ON CONFLICT DO NOTHING;
 RETURN NEW;
END;
$$;
REVOKE ALL ON FUNCTION public.create_disavow_domain_statuses() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER create_disavow_domain_statuses AFTER INSERT ON public.disavow_uploads FOR EACH ROW EXECUTE FUNCTION public.create_disavow_domain_statuses();
INSERT INTO public.disavow_domain_statuses (upload_id, domain)
SELECT u.id, lower(trim(d)) FROM public.disavow_uploads u CROSS JOIN LATERAL unnest(u.domains) d WHERE trim(d) <> '' ON CONFLICT DO NOTHING;
COMMENT ON COLUMN public.disavow_uploads.domains_accepted IS 'Legacy aggregate acceptance count; domain statuses are authoritative for new dashboards. Historical counts cannot identify individual accepted domains.';