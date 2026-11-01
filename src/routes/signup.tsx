import { createFileRoute } from "@tanstack/react-router";

import { AuthScreen } from "@/components/AuthScreen";
import { socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create a Free Account — Hygi" },
      {
        name: "description",
        content:
          "Create a free Hygi account to save your badges, certificates and pathway progress on every device. Anything you have already earned comes with you.",
      },
      { property: "og:title", content: "Create a Free Account — Hygi" },
      {
        property: "og:description",
        content:
          "Create a free Hygi account to save your badges, certificates and pathway progress on every device. Anything you have already earned comes with you.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/signup" },
      ...socialImageMeta,
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  return <AuthScreen initialMode="signup" />;
}
