/**
 * Semrush backlink reads. Server-only: the gateway credentials never reach the
 * browser. All calls go through the Lovable connector gateway.
 */

const GATEWAY_URL = "https://connector-gateway.lovable.dev/semrush";

export interface RefDomain {
  domain: string;
  authority: number | null;
  backlinks: number | null;
}

export interface AnchorRow {
  anchor: string;
  domains: number | null;
  backlinks: number | null;
}

export interface BacklinkReport {
  target: string;
  authorityScore: number | null;
  trustScore: number | null;
  totalBacklinks: number | null;
  referringDomains: number | null;
  referringIps: number | null;
  followLinks: number | null;
  nofollowLinks: number | null;
  domains: RefDomain[];
  anchors: AnchorRow[];
}

type GatewayRows = Record<string, string>[];

async function callSemrush(
  path: string,
  params: Record<string, string>,
): Promise<GatewayRows> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const connectionKey = process.env["SEMRUSH_API_KEY"];
  if (!lovableKey || !connectionKey) {
    throw new Error("Semrush connection is not configured for this project.");
  }

  const url = `${GATEWAY_URL}${path}?${new URLSearchParams(params).toString()}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectionKey,
      "Allow-Limit-Offset": "true",
    },
  });

  const text = await response.text();
  if (!response.ok) {
    console.error(`Semrush gateway failed [${response.status}]: ${text}`);
    if (text.includes("LIMIT EXCEEDED")) {
      throw new Error(
        "The Semrush API quota is exhausted — upgrade your Semrush plan or wait for the quota to reset.",
      );
    }
    throw new Error(`Semrush request failed [${response.status}]: ${text}`);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Semrush returned an unreadable response.");
  }

  const payload = (parsed as { data?: { columnNames?: string[]; rows?: unknown[] } }).data;
  const columns = payload?.columnNames ?? [];
  const rows = payload?.rows ?? [];

  return rows.map((row) => {
    if (Array.isArray(row)) {
      const mapped: Record<string, string> = {};
      columns.forEach((name, i) => {
        mapped[name] = String(row[i] ?? "");
      });
      return mapped;
    }
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
      out[k] = String(v ?? "");
    }
    return out;
  });
}

function pick(row: Record<string, string>, names: string[]): string | null {
  for (const name of names) {
    const hit = Object.keys(row).find((k) => k.toLowerCase() === name.toLowerCase());
    if (hit && row[hit] !== "") return row[hit];
  }
  return null;
}

function num(value: string | null): number | null {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

/** One point-in-time read of the target's backlink profile. */
export async function fetchBacklinkReport(target: string): Promise<BacklinkReport> {
  const [overviewRows, domainRows, anchorRows] = await Promise.all([
    callSemrush("/backlinks/backlinks_overview", {
      target,
      target_type: "root_domain",
      export_columns: "ascore,total,domains_num,urls_num,ips_num,follows_num,nofollows_num",
    }),
    callSemrush("/backlinks/backlinks_refdomains", {
      target,
      target_type: "root_domain",
      export_columns: "domain_ascore,domain,backlinks_num",
      display_limit: "50",
      display_sort: "backlinks_num_desc",
    }),
    callSemrush("/backlinks/backlinks_anchors", {
      target,
      target_type: "root_domain",
      export_columns: "anchor,domains_num,backlinks_num",
      display_limit: "15",
      display_sort: "backlinks_num_desc",
    }),
  ]);

  const overview = overviewRows[0] ?? {};

  return {
    target,
    authorityScore: num(pick(overview, ["ascore", "Authority Score"])),
    trustScore: num(pick(overview, ["trust_score", "Trust Score"])),
    totalBacklinks: num(pick(overview, ["total", "backlinks_num", "Total"])),
    referringDomains: num(pick(overview, ["domains_num", "Referring Domains"])),
    referringIps: num(pick(overview, ["ips_num", "Referring IPs"])),
    followLinks: num(pick(overview, ["follows_num", "Follows"])),
    nofollowLinks: num(pick(overview, ["nofollows_num", "Nofollows"])),
    domains: domainRows
      .map((row) => ({
        domain: pick(row, ["domain", "Domain"]) ?? "",
        authority: num(pick(row, ["domain_ascore", "Domain Score", "ascore"])),
        backlinks: num(pick(row, ["backlinks_num", "Backlinks"])),
      }))
      .filter((d) => d.domain !== ""),
    anchors: anchorRows
      .map((row) => ({
        anchor: pick(row, ["anchor", "Anchor"]) ?? "",
        domains: num(pick(row, ["domains_num", "Domains"])),
        backlinks: num(pick(row, ["backlinks_num", "Backlinks"])),
      }))
      .filter((a) => a.anchor !== ""),
  };
}
