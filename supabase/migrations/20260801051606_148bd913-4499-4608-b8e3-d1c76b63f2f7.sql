CREATE TABLE public.contact_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('support', 'deletion')),
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  captcha_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, DELETE ON public.contact_requests TO authenticated;
GRANT ALL ON public.contact_requests TO service_role;

ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read contact requests"
ON public.contact_requests FOR SELECT TO authenticated
USING (public.current_user_has_role('admin'));

CREATE POLICY "Admins can delete contact requests"
ON public.contact_requests FOR DELETE TO authenticated
USING (public.current_user_has_role('admin'));

CREATE INDEX contact_requests_created_at_idx ON public.contact_requests (created_at DESC);