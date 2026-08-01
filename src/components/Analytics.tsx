import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  initAnalytics,
  trackAppInstalled,
  trackAppLaunch,
  trackInstallPromptAvailable,
  trackPageView,
} from "@/lib/analytics";

/**
 * Boots Google Analytics and reports SPA page views plus home-screen
 * install signals. Renders nothing.
 */
export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    initAnalytics();
    trackAppLaunch();

    const onPrompt = () => trackInstallPromptAvailable();
    const onInstalled = () => trackAppInstalled("browser_prompt");
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    trackPageView(pathname, typeof document !== "undefined" ? document.title : undefined);
  }, [pathname]);

  return null;
}
