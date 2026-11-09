CREATE TABLE public.spam_link_entries (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 link text NOT NULL CHECK(length(link) BETWEEN 1 AND 2048),
 normalized_link text NOT NULL CHECK(length(normalized_link) BETWEEN 1 AND 2048),
 status text NOT NULL DEFAULT 'review' CHECK(status IN ('review','ready','excluded')),
 duplicate_flag boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 created_by uuid NOT NULL DEFAULT auth.uid()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spam_link_entries TO authenticated;
GRANT ALL ON public.spam_link_entries TO service_role;
ALTER TABLE public.spam_link_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read spam link entries" ON public.spam_link_entries FOR SELECT TO authenticated USING(public.current_user_has_role('admin'));
CREATE POLICY "Admins add spam link entries" ON public.spam_link_entries FOR INSERT TO authenticated WITH CHECK(public.current_user_has_role('admin') AND created_by = auth.uid());
CREATE POLICY "Admins edit spam link entries" ON public.spam_link_entries FOR UPDATE TO authenticated USING(public.current_user_has_role('admin')) WITH CHECK(public.current_user_has_role('admin'));
CREATE POLICY "Admins delete spam link entries" ON public.spam_link_entries FOR DELETE TO authenticated USING(public.current_user_has_role('admin'));