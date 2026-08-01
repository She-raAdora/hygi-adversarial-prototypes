/**
 * Server-only SEO health checks.
 *
 * Runs against the live site over plain HTTP so results reflect what a crawler
 * actually sees: robots.txt, sitemap.xml, and the head metadata of every key
 * page (unique title, description length, canonical, Open Graph, single H1).
 * Each run is stored in `seo_scan_runs`; the previous run is diffed so a check
 * that flips from passing to failing is surfaced as a regression.
 */

export interface SeoCheck {
  [key: string]: string;
  id: string;
  label: string;
  status: "passing" | "failing";
  detail: string;
}

export interface SeoAuditResult {
  baseUrl: string;
  status: "passing" | "failing";
  checks: SeoCheck[];
  failingCount: number;
  passingCount: number;
}

/** Pages worth auditing every week — the highest-value indexable routes. */
const AUDIT_PATHS = ["/", "/lessons", "/cyber-hygiene", "/badges", "/support"];

const MIN_DESCRIPTION = 70;
const MAX_DESCRIPTION = 160;
const MAX_TITLE = 60;

function tagContent(html: string, attr: "name" | "property", value: string): string | null {
  const pattern = new RegExp(
    `<meta[^>]+${attr}=["']${value}["'][^>]*content=["']([^"']*)["']|<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${value}["']`,
    "i",
  );
  const match = pattern.exec(html);
  if (!match) return null;
  return (match[1] ?? match[2] ?? "").trim() || null;
}

function titleOf(html: string): string | null {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return match ? match[1]!.replace(/\s+/g, " ").trim() : null;
}

function canonicalOf(html: string): string | null {
  const match = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html);
  return match ? match[1]!.trim() : null;
}

function countH1(html: string): number {
  return (html.match(/<h1[\s>]/gi) ?? []).length;
}

async function fetchText(url: string): Promise<{ ok: boolean; status: number; body: string }> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": "HygiSeoMonitor/1.0 (+https://digitalhygiene.app)" },
    });
    const body = await res.text();
    return { ok: res.ok, status: res.status, body };
  } catch (error) {
    console.error("seo audit fetch failed", url, error);
    return { ok: false, status: 0, body: "" };
  }
}

export async function runSeoAudit(baseUrl: string): Promise<SeoAuditResult> {
  const base = baseUrl.replace(/\/$/, "");
  const checks: SeoCheck[] = [];
  const add = (id: string, label: string, ok: boolean, detail: string) =>
    checks.push({ id, label, status: ok ? "passing" : "failing", detail });

  // robots.txt
  const robots = await fetchText(`${base}/robots.txt`);
  if (!robots.ok) {
    add("robots_txt", "robots.txt reachable", false, `Responded with HTTP ${robots.status}.`);
  } else if (/^\s*Disallow:\s*\/\s*$/im.test(robots.body)) {
    add("robots_txt", "robots.txt reachable", false, "robots.txt blocks all crawlers.");
  } else {
    add("robots_txt", "robots.txt reachable", true, "Served and allows crawling.");
  }

  // sitemap.xml
  const sitemap = await fetchText(`${base}/sitemap.xml`);
  const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
  if (!sitemap.ok) {
    add("sitemap_xml", "sitemap.xml reachable", false, `Responded with HTTP ${sitemap.status}.`);
  } else if (locs.length === 0) {
    add("sitemap_xml", "sitemap.xml reachable", false, "Sitemap contains no URLs.");
  } else {
    add("sitemap_xml", "sitemap.xml reachable", true, `${locs.length} URLs listed.`);
  }

  const missingFromSitemap = AUDIT_PATHS.filter(
    (path) => !locs.some((loc) => loc.replace(/\/$/, "") === `${base}${path}`.replace(/\/$/, "")),
  );
  add(
    "sitemap_coverage",
    "Key pages listed in sitemap",
    missingFromSitemap.length === 0,
    missingFromSitemap.length === 0
      ? "Every audited page appears in the sitemap."
      : `Missing: ${missingFromSitemap.join(", ")}.`,
  );

  // Per-page head metadata
  const seenTitles = new Map<string, string[]>();
  const seenDescriptions = new Map<string, string[]>();

  for (const path of AUDIT_PATHS) {
    const url = `${base}${path}`;
    const page = await fetchText(url);
    const label = path === "/" ? "Homepage" : path;

    if (!page.ok) {
      add(`page_ok:${path}`, `${label} responds`, false, `Responded with HTTP ${page.status}.`);
      continue;
    }
    add(`page_ok:${path}`, `${label} responds`, true, "HTTP 200.");

    const title = titleOf(page.body);
    add(
      `title:${path}`,
      `${label} title`,
      Boolean(title) && title!.length <= MAX_TITLE,
      !title
        ? "No <title> found."
        : title.length > MAX_TITLE
          ? `Title is ${title.length} characters (max ${MAX_TITLE}).`
          : `"${title}" (${title.length} chars).`,
    );
    if (title) seenTitles.set(title, [...(seenTitles.get(title) ?? []), path]);

    const description = tagContent(page.body, "name", "description");
    add(
      `description:${path}`,
      `${label} meta description`,
      Boolean(description) &&
        description!.length >= MIN_DESCRIPTION &&
        description!.length <= MAX_DESCRIPTION,
      !description
        ? "No meta description found."
        : `${description.length} characters (want ${MIN_DESCRIPTION}–${MAX_DESCRIPTION}).`,
    );
    if (description)
      seenDescriptions.set(description, [...(seenDescriptions.get(description) ?? []), path]);

    const canonical = canonicalOf(page.body);
    const wantCanonical = `${base}${path}`.replace(/\/$/, "") || base;
    add(
      `canonical:${path}`,
      `${label} canonical URL`,
      Boolean(canonical) && canonical!.replace(/\/$/, "") === wantCanonical,
      !canonical
        ? "No canonical link found."
        : canonical.replace(/\/$/, "") === wantCanonical
          ? "Self-referencing."
          : `Points at ${canonical} instead of ${wantCanonical}.`,
    );

    const ogTitle = tagContent(page.body, "property", "og:title");
    const ogDescription = tagContent(page.body, "property", "og:description");
    add(
      `open_graph:${path}`,
      `${label} social preview tags`,
      Boolean(ogTitle && ogDescription),
      ogTitle && ogDescription
        ? "og:title and og:description present."
        : `Missing ${[!ogTitle && "og:title", !ogDescription && "og:description"]
            .filter(Boolean)
            .join(" and ")}.`,
    );

    const h1s = countH1(page.body);
    add(
      `single_h1:${path}`,
      `${label} heading structure`,
      h1s === 1,
      h1s === 1 ? "Exactly one H1." : `${h1s} H1 elements found (want exactly 1).`,
    );
  }

  const duplicateTitles = [...seenTitles.entries()].filter(([, paths]) => paths.length > 1);
  add(
    "unique_titles",
    "Titles are unique across pages",
    duplicateTitles.length === 0,
    duplicateTitles.length === 0
      ? "No duplicate titles."
      : duplicateTitles.map(([t, paths]) => `"${t}" on ${paths.join(", ")}`).join("; "),
  );

  const duplicateDescriptions = [...seenDescriptions.entries()].filter(
    ([, paths]) => paths.length > 1,
  );
  add(
    "unique_descriptions",
    "Meta descriptions are unique across pages",
    duplicateDescriptions.length === 0,
    duplicateDescriptions.length === 0
      ? "No duplicate descriptions."
      : duplicateDescriptions.map(([, paths]) => paths.join(" / ")).join("; "),
  );

  const failingCount = checks.filter((c) => c.status === "failing").length;
  return {
    baseUrl: base,
    status: failingCount === 0 ? "passing" : "failing",
    checks,
    failingCount,
    passingCount: checks.length - failingCount,
  };
}

/** Stores an audit and returns it alongside the checks that regressed. */
export async function recordSeoAudit(result: SeoAuditResult) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: previous } = await supabaseAdmin
    .from("seo_scan_runs")
    .select("checks")
    .order("ran_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const previousChecks = new Map<string, string>(
    ((previous?.checks as SeoCheck[] | null) ?? []).map((c) => [c.id, c.status]),
  );

  const regressions = result.checks.filter(
    (c) => c.status === "failing" && previousChecks.get(c.id) === "passing",
  );

  const { error } = await supabaseAdmin.from("seo_scan_runs").insert({
    base_url: result.baseUrl,
    status: result.status,
    failing_count: result.failingCount,
    passing_count: result.passingCount,
    checks: result.checks,
    regressions,
  });
  if (error) console.error("failed to store seo scan run", error);

  return { ...result, regressions };
}