ALTER TABLE public.disavow_domain_statuses ADD COLUMN threat_category text CHECK(threat_category IN ('phishing','malware','scams'));
CREATE OR REPLACE FUNCTION public.create_disavow_domain_statuses() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
 INSERT INTO public.disavow_domain_statuses(upload_id, domain, threat_category)
 SELECT NEW.id, lower(trim(d)), (SELECT e.threat_category FROM public.spam_link_entries e WHERE lower(trim(e.link)) IN (lower(trim(d)), 'domain:' || lower(trim(d))) AND e.threat_category IS NOT NULL ORDER BY e.created_at DESC, e.id DESC LIMIT 1)
 FROM unnest(NEW.domains) d WHERE trim(d) <> '' ON CONFLICT DO NOTHING;
 RETURN NEW;
END;
$$;