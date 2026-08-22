CREATE TABLE public.backlink_trusted_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind text NOT NULL CHECK (kind IN ('domain','anchor')),
  value text NOT NULL,
  note text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kind, value)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.backlink_trusted_entries TO authenticated;
GRANT ALL ON public.backlink_trusted_entries TO service_role;
ALTER TABLE public.backlink_trusted_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read trusted entries" ON public.backlink_trusted_entries
  FOR SELECT TO authenticated USING (public.current_user_has_role('admin'));
CREATE POLICY "Admins can add trusted entries" ON public.backlink_trusted_entries
  FOR INSERT TO authenticated WITH CHECK (public.current_user_has_role('admin'));
CREATE POLICY "Admins can update trusted entries" ON public.backlink_trusted_entries
  FOR UPDATE TO authenticated USING (public.current_user_has_role('admin'))
  WITH CHECK (public.current_user_has_role('admin'));
CREATE POLICY "Admins can delete trusted entries" ON public.backlink_trusted_entries
  FOR DELETE TO authenticated USING (public.current_user_has_role('admin'));

CREATE TRIGGER backlink_trusted_entries_touch_updated_at
  BEFORE UPDATE ON public.backlink_trusted_entries
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.backlink_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target text NOT NULL,
  kind text NOT NULL CHECK (kind IN ('domain','anchor')),
  value text NOT NULL,
  score integer NOT NULL,
  level text NOT NULL,
  reasons text[] NOT NULL DEFAULT '{}',
  snapshot_id uuid REFERENCES public.backlink_snapshots(id) ON DELETE SET NULL,
  acknowledged_at timestamptz,
  acknowledged_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX backlink_alerts_created_at_idx ON public.backlink_alerts (created_at DESC);
CREATE UNIQUE INDEX backlink_alerts_unique_value ON public.backlink_alerts (target, kind, value);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.backlink_alerts TO authenticated;
GRANT ALL ON public.backlink_alerts TO service_role;
ALTER TABLE public.backlink_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read backlink alerts" ON public.backlink_alerts
  FOR SELECT TO authenticated USING (public.current_user_has_role('admin'));
CREATE POLICY "Admins can create backlink alerts" ON public.backlink_alerts
  FOR INSERT TO authenticated WITH CHECK (public.current_user_has_role('admin'));
CREATE POLICY "Admins can update backlink alerts" ON public.backlink_alerts
  FOR UPDATE TO authenticated USING (public.current_user_has_role('admin'))
  WITH CHECK (public.current_user_has_role('admin'));
CREATE POLICY "Admins can delete backlink alerts" ON public.backlink_alerts
  FOR DELETE TO authenticated USING (public.current_user_has_role('admin'));

CREATE TRIGGER backlink_alerts_touch_updated_at
  BEFORE UPDATE ON public.backlink_alerts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.backlink_alert_settings (
  id text NOT NULL PRIMARY KEY DEFAULT 'default',
  threshold integer NOT NULL DEFAULT 60 CHECK (threshold BETWEEN 0 AND 100),
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.backlink_alert_settings TO authenticated;
GRANT ALL ON public.backlink_alert_settings TO service_role;
ALTER TABLE public.backlink_alert_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read alert settings" ON public.backlink_alert_settings
  FOR SELECT TO authenticated USING (public.current_user_has_role('admin'));
CREATE POLICY "Admins can create alert settings" ON public.backlink_alert_settings
  FOR INSERT TO authenticated WITH CHECK (public.current_user_has_role('admin'));
CREATE POLICY "Admins can update alert settings" ON public.backlink_alert_settings
  FOR UPDATE TO authenticated USING (public.current_user_has_role('admin'))
  WITH CHECK (public.current_user_has_role('admin'));

CREATE TRIGGER backlink_alert_settings_touch_updated_at
  BEFORE UPDATE ON public.backlink_alert_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.backlink_alert_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;