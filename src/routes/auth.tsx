import { createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/AuthScreen";
import { socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Hygi" },
      {
        name: "description",
        content:
          "Sign in or create a free Hygi account to save your badges, certificates and pathway progress across devices.",
      },
      { property: "og:title", content: "Sign in — Hygi" },
      {
        property: "og:description",
        content:
          "Sign in or create a free Hygi account to save your badges, certificates and pathway progress across devices.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/auth" },
      ...socialImageMeta,
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/auth" }],
  }),
  component: AuthPage,
});

function AuthPage() {
  return <AuthScreen />;
}
