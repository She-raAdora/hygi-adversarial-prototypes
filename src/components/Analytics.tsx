import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import {
  initAnalytics,
  trackAppInstalled,
  trackAppLaunch,
  trackInstallPromptAvailable,
  trackPageView,
} from "@/lib/analytics";
import { onConsentChange } from "@/lib/consent";

/**
 * Boots Google Analytics and reports SPA page views plus home-screen
 * install signals. Renders nothing.
 */
export function Analytics() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    initAnalytics();
    trackAppLaunch();

    // Boot GA the moment the visitor opts in, without a page reload.
    const stopConsentWatch = onConsentChange((state) => {
      if (state === "granted") {
        initAnalytics();
        // The launch (and any first-standalone install conversion) was dropped
        // before opt-in, so report it now that reporting is allowed.
        trackAppLaunch();
      }
    });

    const onPrompt = () => trackInstallPromptAvailable();
    const onInstalled = () => trackAppInstalled("browser_prompt");
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      stopConsentWatch();
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    trackPageView(pathname, typeof document !== "undefined" ? document.title : undefined);
  }, [pathname]);

  return null;
}
