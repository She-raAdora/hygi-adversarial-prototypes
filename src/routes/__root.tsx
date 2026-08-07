import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { Analytics } from "@/components/Analytics";
import { AnalyticsDebugPanel } from "@/components/AnalyticsDebugPanel";
import { ConsentBanner } from "@/components/ConsentBanner";
import { HelpChat } from "@/components/HelpChat";
import { appleSplashLinks } from "@/lib/splashLinks";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#2a9d8f" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "default" },
      { name: "apple-mobile-web-app-title", content: "Hygi." },
      { name: "google-site-verification", content: "eULKPktRfXUW4MMdhEeLPtY8Ur6qbF22CeTobbcIUyo" },
      { name: "author", content: "Lovable" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Hygi." },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "manifest",
        href: "/manifest.webmanifest",
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: "/icon-192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: "/icon-512.png",
      },
      {
        rel: "apple-touch-icon",
        href: "/apple-touch-icon.png",
      },
      ...appleSplashLinks,
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://digitalhygiene.app/#organization",
              name: "Hygi.",
              url: "https://digitalhygiene.app",
              logo: "https://digitalhygiene.app/icon-512.png",
              description:
                "Hygi. teaches digital hygiene through short lessons, pop quizzes, and badges, brought to you by NorthBridge.",
            },
            {
              "@type": "WebSite",
              "@id": "https://digitalhygiene.app/#website",
              name: "Hygi.",
              url: "https://digitalhygiene.app",
              publisher: { "@id": "https://digitalhygiene.app/#organization" },
            },
          ],
        }),
      },
    ],
  }),

  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      void router.invalidate();
      if (event !== "SIGNED_OUT") void queryClient.invalidateQueries();
    });
    return () => data.subscription.unsubscribe();
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Analytics />
      <AnalyticsDebugPanel />
      <div className="min-h-dvh bg-background text-foreground">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <SiteHeader />
        <Outlet />
        <footer className="border-t border-border/60 py-8">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 text-xs text-muted-foreground">
            <span>Hygi. — brought to you by NorthBridge</span>
            <div className="flex flex-wrap items-center gap-4">
              <Link to="/cyber-hygiene" className="transition-colors hover:text-foreground">
                What is cyber hygiene?
              </Link>
              <Link to="/insights" className="transition-colors hover:text-foreground">
                Insights
              </Link>
              <Link to="/glossary" className="transition-colors hover:text-foreground">
                Glossary
              </Link>
              <Link to="/brand" className="transition-colors hover:text-foreground">
                Brand icon
              </Link>
              <Link to="/admin" className="transition-colors hover:text-foreground">
                Admin
              </Link>
              <Link to="/settings" className="transition-colors hover:text-foreground">
                Account settings
              </Link>
              <Link to="/support" className="transition-colors hover:text-foreground">
                Support
              </Link>
              <Link to="/delete-account" className="transition-colors hover:text-foreground">
                Delete account
              </Link>
              <Link to="/privacy" className="transition-colors hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/accessibility" className="transition-colors hover:text-foreground">
                Accessibility
              </Link>
            </div>
          </div>
        </footer>
        <ConsentBanner />
        <HelpChat />
      </div>
    </QueryClientProvider>
  );
}
