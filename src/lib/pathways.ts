/**
 * Pathway (category) metadata layered over the existing 22 lessons.
 *
 * Pathways are descriptive only — they group related topics so people can
 * browse by theme. Nothing here gates or orders access: every lesson stays
 * open in any order.
 */

export type Pathway = {
  id: string;
  name: string;
  emoji: string;
  /** One-line description of what the pathway covers. */
  blurb: string;
  /** Hue used for the pathway chip, matching the lesson tint palette. */
  hue: number;
  /** Lesson ids that belong to this pathway. */
  lessonIds: string[];
};

export const pathways: Pathway[] = [
  {
    id: "foundations",
    name: "Foundations",
    emoji: "🌱",
    blurb: "The habits and threat basics everything else builds on.",
    hue: 150,
    lessonIds: ["core-four", "threat-landscape"],
  },
  {
    id: "accounts",
    name: "Accounts & Identity",
    emoji: "🔑",
    blurb: "Passwords, multifactor, and the accounts worth protecting first.",
    hue: 250,
    lessonIds: ["accounts", "shield-accounts", "personal-info"],
  },
  {
    id: "scams",
    name: "Scams & Social Engineering",
    emoji: "🎣",
    blurb: "Recognising phishing, AI impersonation, and unsafe links.",
    hue: 30,
    lessonIds: ["safe-browsing", "ai-phishing", "secure-comms"],
  },
  {
    id: "devices",
    name: "Devices & Workspaces",
    emoji: "📱",
    blurb: "Keeping phones, laptops, and shared computers trustworthy.",
    hue: 200,
    lessonIds: ["devices", "mobile", "workstation", "research-data"],
  },
  {
    id: "network-data",
    name: "Home Network & Data",
    emoji: "💾",
    blurb: "Router settings, encryption, backups, and ransomware defence.",
    hue: 300,
    lessonIds: ["networked-devices", "home-wifi", "encrypt-backup", "ransomware"],
  },
  {
    id: "privacy",
    name: "Privacy & Footprint",
    emoji: "👣",
    blurb: "Controlling what strangers, brokers, and search engines can find.",
    hue: 100,
    lessonIds: ["footprint", "public-footprint", "smaller-trail"],
  },
  {
    id: "response",
    name: "Safety & Response",
    emoji: "🚨",
    blurb: "What to do when something goes wrong — or someone targets you.",
    hue: 10,
    lessonIds: ["incident-plan", "recognize-harassment", "respond-harassment"],
  },
];

const byLesson = new Map<string, Pathway>();
for (const p of pathways) for (const id of p.lessonIds) byLesson.set(id, p);

/** The pathway a lesson belongs to, if any. */
export const pathwayOf = (lessonId: string): Pathway | undefined => byLesson.get(lessonId);

export const getPathway = (pathwayId: string): Pathway | undefined =>
  pathways.find((p) => p.id === pathwayId);

/** Soft background + readable text colours for a pathway chip. */
export const pathwayChipStyle = (hue: number) => ({
  background: `oklch(0.94 0.05 ${hue})`,
  color: `oklch(0.38 0.11 ${hue})`,
});