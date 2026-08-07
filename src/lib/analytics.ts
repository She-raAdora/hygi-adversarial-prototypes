/**
 * Google Analytics 4 (gtag.js) wrapper.
 *
 * Only anonymous, aggregate product events are sent: page views, quiz
 * completions, and home-screen install conversions. No names, emails, quiz
 * answers, or other personal data are ever included in an event payload.
 */

import { logEvent } from "./eventLog";
import { hasAnalyticsConsent } from "./consent";
import { HOME_CTA_EXPERIMENT, getHomeCtaVariantId } from "./experiments";
import { recordTrophy } from "./metrics";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

const MEASUREMENT_ID = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_ANALYTICS_API_KEY"] as
  | string
  | undefined;

let initialized = false;

export function gtag(...args: unknown[]) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

export function isAnalyticsInitialized() {
  return initialized;
}

export function getMeasurementId() {
  return MEASUREMENT_ID;
}

/**
 * Loads gtag.js once. No-ops on the server, when the ID is unconfigured, or
 * until the visitor has explicitly opted in to analytics.
 */
export function initAnalytics() {
  if (typeof window === "undefined" || initialized || !MEASUREMENT_ID) return;
  if (!hasAnalyticsConsent()) return;
  initialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  gtag("js", new Date());
  // send_page_view is off: the SPA sends page_view itself on every route change.
  gtag("config", MEASUREMENT_ID, { send_page_view: false });
}


export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  // Stamp the visitor's A/B variant onto every event so downstream engagement
  // (quiz starts, completions, badges) can be attributed back to the variant.
  const payload: Record<string, unknown> = { ...params };
  if (typeof window !== "undefined" && payload["variant"] === undefined) {
    payload["experiment"] = HOME_CTA_EXPERIMENT;
    payload["variant"] = getHomeCtaVariantId();
  }
  // Always mirror to the device-local log so the in-app dashboard works even
  // when GA is unconfigured or blocked by the browser.
  logEvent(name, payload);
  // Nothing leaves the device without consent.
  if (!MEASUREMENT_ID || !initialized || !hasAnalyticsConsent()) return;
  gtag("event", name, payload);
}

/* -------------------------------------------------------------- experiments */

/** Fires once per homepage render: the visitor saw this CTA variant. */
export function trackExperimentView(variantId: string, placement: string) {
  trackEvent("experiment_view", {
    experiment: HOME_CTA_EXPERIMENT,
    variant: variantId,
    placement,
  });
}

/** Fires when the visitor clicks the primary homepage CTA. */
export function trackCtaClick(variantId: string, placement: string, copy: string) {
    trackEvent("cta_click", {
    experiment: HOME_CTA_EXPERIMENT,
    variant: variantId,
    placement,
    cta_copy: copy,
  });
}

export function trackPageView(path: string, title?: string) {
  trackEvent("page_view", {
    page_path: path,
    page_location: typeof window !== "undefined" ? window.location.href : undefined,
    page_title: title,
  });
}

/* ---------------------------------------------------------------- installs */

/** True when the app is running from a home-screen / installed window. */
export function isStandalone() {
  if (typeof window === "undefined") return false;
  const iosStandalone = (window.navigator as Navigator & { standalone?: boolean }).standalone;
  return window.matchMedia("(display-mode: standalone)").matches || iosStandalone === true;
}

/** Marks a once-per-browser event so conversions aren't double counted. */
function once(key: string) {
  try {
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, "1");
    return true;
  } catch {
    return true;
  }
}

export function trackInstallPromptAvailable() {
  trackEvent("install_prompt_available", { method: "browser" });
}

export function trackAppInstalled(method: string) {
  trackEvent("app_installed", { method });
}

/** Fires the conversion the first time the app is opened from the home screen. */
export function trackFirstStandaloneLaunch() {
  if (!isStandalone()) return;
  if (once("hygi-analytics-standalone-launch")) {
    trackEvent("install_conversion", { method: "add_to_home_screen" });
  }
  trackEvent("app_launch", { display_mode: "standalone" });
}

export function trackAppLaunch() {
  if (isStandalone()) {
    trackFirstStandaloneLaunch();
  } else {
    trackEvent("app_launch", { display_mode: "browser" });
  }
}

/* ------------------------------------------------------------------ quizzes */

export function trackQuizStart(lessonId: string, lessonTitle: string) {
  trackEvent("quiz_start", { lesson_id: lessonId, lesson_title: lessonTitle });
}

export function trackQuizComplete(args: {
  lessonId: string;
  lessonTitle: string;
  score: number;
  total: number;
  passed: boolean;
}) {
  trackEvent("quiz_complete", {
    lesson_id: args.lessonId,
    lesson_title: args.lessonTitle,
    score: args.score,
    total_questions: args.total,
    percent_correct: Math.round((args.score / args.total) * 100),
    passed: args.passed,
  });
  if (args.passed) {
    trackEvent("badge_earned", { lesson_id: args.lessonId, lesson_title: args.lessonTitle });
  }
}

export function trackAllLessonsComplete(total: number) {
  if (once("hygi-analytics-trophy")) {
    trackEvent("trophy_earned", { lessons_completed: total });
    recordTrophy(total);
  }
}
