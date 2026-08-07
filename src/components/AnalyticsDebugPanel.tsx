import { useEffect, useMemo, useRef, useState } from "react";
import { isAnalyticsInitialized, getMeasurementId } from "@/lib/analytics";
import { readConsent, type ConsentState } from "@/lib/consent";
import { useEventLog, clearEventLog, type LoggedEvent } from "@/lib/eventLog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const STORAGE_KEY = "hygi-analytics-debug-open";

function isDebugEnabled() {
  if (typeof window === "undefined") return false;
  return (
    window.location.search.includes("debug=analytics") ||
    localStorage.getItem(STORAGE_KEY) === "true"
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function EventRow({ event }: { event: LoggedEvent }) {
  const isPageView = event.n === "page_view";
  const params = useMemo(() => JSON.stringify(event.p, null, 2), [event.p]);

  return (
    <div
      className={`rounded-md border px-3 py-2 text-xs ${
        isPageView ? "border-primary/40 bg-primary/5" : "border-border bg-muted/30"
      }`}
    >
      <div className="flex items-center gap-2">
        <Badge
          variant={isPageView ? "default" : "secondary"}
          className="text-[10px]"
        >
          {event.n}
        </Badge>
        <span className="ml-auto text-muted-foreground">{formatTime(event.t)}</span>
      </div>
      <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-tight text-muted-foreground">
        {params}
      </pre>
    </div>
  );
}

export function AnalyticsDebugPanel() {
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<ConsentState>("unset");
  const [dataLayerLength, setDataLayerLength] = useState(0);
  const events = useEventLog();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const enabled = isDebugEnabled();
    setOpen(enabled);
    if (enabled) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        /* ignore */
      }
    }
    setConsent(readConsent());
    setDataLayerLength(typeof window !== "undefined" ? window.dataLayer?.length || 0 : 0);

    const onConsentChange = () => {
      setConsent(readConsent());
      setDataLayerLength(window.dataLayer?.length || 0);
    };
    window.addEventListener("hygi-consent-change", onConsentChange);

    const onEvent = () => setDataLayerLength(window.dataLayer?.length || 0);
    window.addEventListener("hygi-events", onEvent);

    return () => {
      window.removeEventListener("hygi-consent-change", onConsentChange);
      window.removeEventListener("hygi-events", onEvent);
    };
  }, []);

  useEffect(() => {
    if (open && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, events.length]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* ignore */
    }
  };

  const pageViews = useMemo(() => events.filter((e) => e.n === "page_view").length, [events]);
  const recentEvents = useMemo(() => [...events].reverse().slice(0, 100), [events]);

  if (!open) {
    return (
      <button
        onClick={handleToggle}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Open analytics debug panel"
      >
        Analytics Debug
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)]">
      <Card className="border border-border shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-3">
          <CardTitle className="text-sm font-semibold">Analytics Debug</CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => {
                const blob = new Blob([JSON.stringify(events, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `hygi-analytics-events-${new Date().toISOString().slice(0, 10)}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={clearEventLog}
            >
              Clear
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={handleToggle}
              aria-label="Close analytics debug panel"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0">
          <div className="mb-3 grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-md bg-muted p-2">
              <span className="text-muted-foreground">GA initialized</span>
              <div className="font-medium">{isAnalyticsInitialized() ? "Yes" : "No"}</div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <span className="text-muted-foreground">Measurement ID</span>
              <div className="truncate font-medium">
                {getMeasurementId() ? "Configured" : "Missing"}
              </div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <span className="text-muted-foreground">Consent</span>
              <div className="font-medium capitalize">{consent}</div>
            </div>
            <div className="rounded-md bg-muted p-2">
              <span className="text-muted-foreground">dataLayer</span>
              <div className="font-medium">{dataLayerLength} items</div>
            </div>
          </div>
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {events.length} events · {pageViews} page_view
            </span>
            <span className="text-muted-foreground">showing newest first</span>
          </div>
          <ScrollArea className="h-64 pr-2">
            <div className="space-y-2">
              {recentEvents.length === 0 ? (
                <p className="text-center text-xs text-muted-foreground">
                  No events logged yet. Navigate to a route to see a page_view.
                </p>
              ) : (
                recentEvents.map((event, i) => (
                  <EventRow key={`${event.t}-${event.n}-${i}`} event={event} />
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
