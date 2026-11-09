ALTER TABLE public.spam_link_entries ADD COLUMN threat_category text CHECK (threat_category IN ('phishing','malware','scams'));
CREATE FUNCTION public.validate_spam_link_input() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 NEW.link := trim(NEW.link);
 IF length(NEW.link) > 2048 OR NEW.link ~ '[[:space:][:cntrl:]]' OR NOT (
 NEW.link ~* '^(domain:)?([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}$'
 OR NEW.link ~* '^https?://([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,63}(:[0-9]{1,5})?([/?#][^[:space:][:cntrl:]]*)?$'
 ) THEN RAISE EXCEPTION 'Enter a valid domain or full http/https link'; END IF;
 IF NEW.threat_category IS NOT NULL AND TG_OP = 'INSERT' THEN NEW.status := 'ready'; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_spam_link_input BEFORE INSERT OR UPDATE ON public.spam_link_entries FOR EACH ROW EXECUTE FUNCTION public.validate_spam_link_input();