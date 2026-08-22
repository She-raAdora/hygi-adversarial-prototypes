/**
 * Heuristic backlink spam / risk scoring.
 *
 * Semrush gives us referring domains, their authority scores, and anchor text.
 * This module turns those signals into a 0-100 risk score per domain and per
 * anchor so obvious link-farm and paid-link patterns surface in the admin
 * dashboard. It is a heuristic, not a verdict — every flag lists its reasons.
 */

export type RiskLevel = "low" | "medium" | "high";

export type DomainRisk = {
  domain: string;
  authority: number | null;
  backlinks: number | null;
  score: number;
  level: RiskLevel;
  reasons: string[];
  trusted?: boolean;
};

export type AnchorRisk = {
  anchor: string;
  domains: number | null;
  backlinks: number | null;
  score: number;
  level: RiskLevel;
  reasons: string[];
  trusted?: boolean;
};

/** TLDs heavily used by throwaway link-selling sites. */
const RISKY_TLDS = [
  "shop",
  "top",
  "xyz",
  "click",
  "link",
  "buzz",
  "loan",
  "work",
  "site",
  "online",
  "space",
  "icu",
  "cfd",
  "sbs",
  "rest",
  "monster",
];

/** Substrings typical of SEO link farms and PBNs. */
const SPAM_DOMAIN_WORDS = [
  "pbn",
  "backlink",
  "seo",
  "serp",
  "rank",
  "boost",
  "traffic",
  "linkbuild",
  "submit",
  "directory",
  "guestpost",
  "indexer",
  "crawler",
];

/** Anchor phrasing that reads like paid or automated link placement. */
const SPAM_ANCHOR_WORDS = [
  "seo",
  "backlink",
  "rank",
  "unleash",
  "boost",
  "cheap",
  "buy",
  "casino",
  "porn",
  "loan",
  "crypto",
  "escort",
  "viagra",
  "free download",
  "click here",
];

function levelFor(score: number): RiskLevel {
  if (score >= 60) return "high";
  if (score >= 30) return "medium";
  return "low";
}

function tldOf(domain: string) {
  const parts = domain.toLowerCase().split(".");
  return parts.length > 1 ? parts[parts.length - 1] : "";
}

export function scoreDomain(input: {
  domain: string;
  authority: number | null;
  backlinks: number | null;
}): DomainRisk {
  const domain = input.domain.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  const tld = tldOf(domain);
  if (RISKY_TLDS.includes(tld)) {
    score += 30;
    reasons.push(`.${tld} is a TLD commonly used by link-selling sites`);
  }

  const word = SPAM_DOMAIN_WORDS.find((w) => domain.includes(w));
  if (word) {
    score += 30;
    reasons.push(`Domain name contains "${word}"`);
  }

  if (typeof input.authority === "number") {
    if (input.authority <= 5) {
      score += 30;
      reasons.push(`Authority score ${input.authority} — effectively unknown site`);
    } else if (input.authority < 20) {
      score += 15;
      reasons.push(`Low authority score (${input.authority})`);
    } else if (input.authority >= 40) {
      score -= 20;
      reasons.push(`Established site (authority ${input.authority})`);
    }
  } else {
    score += 5;
    reasons.push("No authority score available");
  }

  if (/\d{2,}/.test(domain.split(".")[0])) {
    score += 10;
    reasons.push("Machine-generated looking subdomain or number sequence");
  }

  if (domain.split(".").length > 3) {
    score += 5;
    reasons.push("Deeply nested subdomain");
  }

  if ((input.backlinks ?? 0) > 50 && (input.authority ?? 100) < 20) {
    score += 10;
    reasons.push("Many links from one low-authority site");
  }

  score = Math.max(0, Math.min(100, score));
  return {
    domain: input.domain,
    authority: input.authority,
    backlinks: input.backlinks,
    score,
    level: levelFor(score),
    reasons,
  };
}

export function scoreAnchor(input: {
  anchor: string;
  domains: number | null;
  backlinks: number | null;
}): AnchorRisk {
  const anchor = input.anchor.toLowerCase();
  const reasons: string[] = [];
  let score = 0;

  const word = SPAM_ANCHOR_WORDS.find((w) => anchor.includes(w));
  if (word) {
    score += 45;
    reasons.push(`Anchor text mentions "${word}"`);
  }

  if (anchor.length > 70) {
    score += 20;
    reasons.push("Unusually long, keyword-stuffed anchor");
  }

  if (/https?:\/\//.test(anchor) && !anchor.includes("digitalhygiene.app")) {
    score += 20;
    reasons.push("Anchor is a URL pointing somewhere else");
  }

  if ((input.backlinks ?? 0) > 5 && (input.domains ?? 1) <= 1) {
    score += 15;
    reasons.push("Repeated many times from a single domain");
  }

  score = Math.max(0, Math.min(100, score));
  return {
    anchor: input.anchor,
    domains: input.domains,
    backlinks: input.backlinks,
    score,
    level: levelFor(score),
    reasons,
  };
}

/** Lowercase + strip protocol/www so allowlist matching is forgiving. */
export function normalizeDomain(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

export function normalizeAnchor(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

/** A domain is trusted when it matches an entry exactly or is a subdomain of it. */
export function isDomainTrusted(domain: string, trusted: Iterable<string>) {
  const d = normalizeDomain(domain);
  for (const entry of trusted) {
    const t = normalizeDomain(entry);
    if (!t) continue;
    if (d === t || d.endsWith(`.${t}`)) return true;
  }
  return false;
}

export function isAnchorTrusted(anchor: string, trusted: Iterable<string>) {
  const a = normalizeAnchor(anchor);
  for (const entry of trusted) {
    const t = normalizeAnchor(entry);
    if (t && a === t) return true;
  }
  return false;
}

const TRUSTED_REASON = "Marked trusted — excluded from flagging and alerts";

export type RiskAssessment = {
  domains: DomainRisk[];
  anchors: AnchorRisk[];
  flaggedDomains: number;
  flaggedAnchors: number;
  /** Share of scored referring domains flagged medium or high, 0-100. */
  spamShare: number | null;
  /** Weighted profile risk, 0-100. */
  profileScore: number | null;
  level: RiskLevel;
};

export function assessBacklinkRisk(input: {
  domains: { domain: string; authority: number | null; backlinks: number | null }[];
  anchors: { anchor: string; domains: number | null; backlinks: number | null }[];
  /** Allowlisted referring domains — scored 0 and never flagged or alerted. */
  trustedDomains?: string[];
  /** Allowlisted anchor texts — scored 0 and never flagged or alerted. */
  trustedAnchors?: string[];
}): RiskAssessment {
  const trustedDomains = input.trustedDomains ?? [];
  const trustedAnchors = input.trustedAnchors ?? [];

  const domains = input.domains
    .map((d) => {
      const scored = scoreDomain(d);
      if (!isDomainTrusted(d.domain, trustedDomains)) return scored;
      return { ...scored, score: 0, level: "low" as RiskLevel, reasons: [TRUSTED_REASON], trusted: true };
    })
    .sort((a, b) => b.score - a.score);
  const anchors = input.anchors
    .map((a) => {
      const scored = scoreAnchor(a);
      if (!isAnchorTrusted(a.anchor, trustedAnchors)) return scored;
      return { ...scored, score: 0, level: "low" as RiskLevel, reasons: [TRUSTED_REASON], trusted: true };
    })
    .sort((a, b) => b.score - a.score);

  const flaggedDomains = domains.filter((d) => d.level !== "low").length;
  const flaggedAnchors = anchors.filter((a) => a.level !== "low").length;

  const spamShare = domains.length ? Math.round((flaggedDomains / domains.length) * 100) : null;
  const profileScore = domains.length
    ? Math.round(domains.reduce((sum, d) => sum + d.score, 0) / domains.length)
    : null;

  return {
    domains,
    anchors,
    flaggedDomains,
    flaggedAnchors,
    spamShare,
    profileScore,
    level: levelFor(profileScore ?? 0),
  };
}
