CREATE TABLE public.disavow_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  domains_selected integer NOT NULL,
  domains_accepted integer NOT NULL,
  domains text[] NOT NULL DEFAULT '{}',
  created_by uuid NOT NULL DEFAULT auth.uid()
);
GRANT SELECT, INSERT, DELETE ON public.disavow_uploads TO authenticated;
GRANT ALL ON public.disavow_uploads TO service_role;
ALTER TABLE public.disavow_uploads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read disavow uploads" ON public.disavow_uploads FOR SELECT TO authenticated USING (public.current_user_has_role('admin'::public.app_role));
CREATE POLICY "Admins add disavow uploads" ON public.disavow_uploads FOR INSERT TO authenticated WITH CHECK (public.current_user_has_role('admin'::public.app_role) AND created_by = auth.uid() AND domains_accepted >= 0 AND domains_accepted <= domains_selected);
CREATE POLICY "Admins delete disavow uploads" ON public.disavow_uploads FOR DELETE TO authenticated USING (public.current_user_has_role('admin'::public.app_role));