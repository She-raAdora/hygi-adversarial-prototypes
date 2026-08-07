import { lessons } from "@/lib/lessons";
import { glossary } from "@/lib/glossary";

/**
 * Condensed text of the /cyber-hygiene guide (the site's blog article), so the
 * help assistant can answer questions about it without scraping the page.
 */
const BLOG = `# Blog article: "What is cyber hygiene? A practical guide" (page: /cyber-hygiene)

Cyber hygiene is the set of small, repeatable habits that keep your accounts, devices, and data out of the wrong hands. It is not a product you buy or a one-time cleanup — it is a routine, and the routine is what makes it work.

Why it matters more than advanced defenses: almost every incident that reaches a real person starts somewhere ordinary — a password reused from a breached site, a laptop two updates behind, a message that looked like it came from a colleague. Attackers prefer the cheap path. Cyber hygiene closes those cheap paths, which is why university and enterprise security programs teach it before threat hunting or zero trust architecture.

Cyber hygiene vs. digital hygiene: cyber hygiene is security-first — keeping attackers, malware, and account takeovers out (passwords, MFA, patching, encryption, backups, phishing awareness, incident reporting). Digital hygiene is broader: all of that plus privacy and footprint — what you share, which old accounts still exist, what data brokers hold, and how intentional your digital life is. Cyber hygiene is the security half of digital hygiene.

How often to review: automate what you can (updates, backups, password generation), then do a fifteen-minute review each quarter — check for breached passwords, remove unused accounts and app permissions, and confirm your backups actually restore.

Where to start from zero: a password manager, plus multi-factor authentication on your email account, because email resets everything else. Then work through the rest one habit at a time — Hygi. turns each into a short lesson with a quiz and a badge.`;

function lessonText() {
  return lessons
    .map((lesson, index) => {
      const sections = lesson.sections
        .map((s) => `### ${s.heading}\n${s.body}\nTips: ${s.tips.join(" | ")}`)
        .join("\n");
      const quiz = lesson.quiz
        .map((q) => `Q: ${q.q} → ${q.options[q.answer]} (${q.explain})`)
        .join("\n");
      return `## Lesson ${index + 1}: ${lesson.title} (page: /lesson/${lesson.id})
${lesson.tagline}. ${lesson.intro}
${sections}
Quiz answers & explanations:
${quiz}${lesson.urgency ? `\nWhy it matters: ${lesson.urgency}` : ""}`;
    })
    .join("\n\n");
}

function glossaryText() {
  return glossary
    .map(
      (entry) =>
        `- ${entry.term} (${entry.category}, page: /glossary#${entry.slug}): ${entry.definition} Example: ${entry.example} What to do: ${entry.todo} Important: ${entry.important}`,
    )
    .join("\n");
}

let cached: string | undefined;

/** The full knowledge base the help assistant is allowed to answer from. */
export function buildHelpSystemPrompt() {
  if (!cached) {
    cached = `You are Hygi Helper, the in-app help assistant for Hygi. — a free web app that teaches digital and cyber hygiene through ${lessons.length} short lessons, quizzes, badges, and a final trophy.

STRICT SCOPE. You may only answer using the Hygi. knowledge base below: the course lessons, the Digital Safety Glossary, and the cyber hygiene blog article. If a question falls outside that (general chit-chat, coding, news, medical/legal/financial advice, anything unrelated to digital hygiene, or app details not covered below), politely decline in one or two sentences and offer what you can help with instead. Never invent lesson numbers, quiz questions, glossary terms, or facts that are not below.

STYLE. Warm, plain language, no jargon without explaining it. Keep answers short — usually 2-5 sentences or a few bullets. Point people to the relevant page when useful (e.g. "see the Password Manager lesson at /lesson/passwords" or "/glossary"). Never ask for or repeat passwords, codes, or other personal data; if someone shares any, tell them not to. If a user reports being actively hacked or scammed, give the immediate steps from the relevant lesson and suggest contacting support at builtstrong1@outlook.com.

APP FACTS. No account is needed; progress and badges are stored on the visitor's device. Each lesson ends with a quiz; passing earns a badge, and all badges earn the Digital Hygiene Champion trophy. Lessons 6, 10 and 15 unlock after 2 shares of a badge card. Lessons are adapted from Dartmouth, Caltech, Cal Poly, Harvard and CISA guidance. Hygi. is brought to you by NorthBridge.

# KNOWLEDGE BASE

${BLOG}

# Course lessons

${lessonText()}

# Digital Safety Glossary

${glossaryText()}`;
  }
  return cached;
}