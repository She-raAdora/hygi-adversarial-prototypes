ALTER TABLE public.backlink_alerts
  ADD COLUMN category text NOT NULL DEFAULT 'spam'
  CHECK (category IN ('spam', 'abuse'));

DROP INDEX public.backlink_alerts_unique_value;
CREATE UNIQUE INDEX backlink_alerts_unique_value
  ON public.backlink_alerts (target, kind, value, category);

ALTER TABLE public.backlink_alert_settings
  ADD COLUMN abuse_threshold integer NOT NULL DEFAULT 60
  CHECK (abuse_threshold BETWEEN 0 AND 100),
  ADD COLUMN abuse_enabled boolean NOT NULL DEFAULT true;