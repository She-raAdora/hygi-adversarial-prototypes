import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, CheckCircle2, CircleDashed, Download, Printer, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lessons } from "@/lib/lessons";
import { useProgress } from "@/lib/progress";
import { socialImageMeta } from "@/lib/seo";

const TITLE = "Social Engineering Defense Pathway — Hygi";
const DESC = "Six evidence-informed lessons on phishing, verification, authentication manipulation, AI impersonation, response, and recovery.";
const RESULT_KEY = "dh-social-engineering-assessment-v1";
const NAME_KEY = "dh-social-engineering-cert-name";
const MODULES = [
  { id: "safe-browsing", name: "How Social Engineering Works", capability: "Recognize urgency, authority, fear, secrecy, rewards, and emotional manipulation." },
  { id: "phishing-prevention-tactics", name: "Phishing Across Channels", capability: "Spot suspicious email, text, calls, social messages, QR codes, and workplace requests." },
  { id: "phishing-case-study", name: "Verify the Person and Request", capability: "Independently verify financial, family, government, and workplace requests." },
  { id: "device-code-phishing", name: "Authentication Manipulation", capability: "Resist MFA fatigue, code theft, device-code phishing, fake support, and remote access." },
  { id: "ai-phishing", name: "AI-Enhanced Impersonation", capability: "Recognize voice cloning, deepfakes, polished AI messages, and synthetic identities." },
  { id: "incident-plan", name: "Respond, Recover and Report", capability: "Protect accounts, contact financial institutions, preserve evidence, and report incidents." },
] as const;

type Question = { prompt: string; options: string[]; answer: number; explain: string; critical?: boolean };
type Scenario = { title: string; setup: string; questions: Question[] };
type AssessmentResult = { score: number; passed: boolean; criticalPassed: boolean };
type SavedPass = AssessmentResult & { credentialId: string; completedAt: string; renewBy: string };

const SCENARIOS: Scenario[] = [
  {
    title: "A relative needs urgent money",
    setup: "A relative calls from a new number. They sound distressed, say they are stranded, and insist you send money now without telling anyone.",
    questions: [
      { prompt: "What manipulation tactic is most visible?", options: ["Urgency, fear, and secrecy", "A routine family update", "A software problem"], answer: 0, explain: "The caller combines emotional pressure, urgency, and secrecy to prevent careful verification." },
      { prompt: "What sensitive action are they requesting?", options: ["Sharing a photo", "Sending money", "Updating a calendar"], answer: 1, explain: "The requested action transfers money before the caller's identity is established." },
      { prompt: "What is the best separate verification route?", options: ["Call the relative on a saved number or contact another family member", "Ask the new caller for more personal facts", "Reply to the new number"], answer: 0, explain: "A saved number or another trusted person is independent of the channel the caller controls." },
      { prompt: "What is the safest immediate response?", options: ["Send a small test payment", "Pause, end the call, and verify independently", "Keep the caller talking while opening your bank app"], answer: 1, explain: "Pausing breaks the pressure cycle and prevents a rushed payment." },
      { prompt: "Where should an attempted money scam be reported?", options: ["Only in a family group chat", "The payment provider or bank, and the FTC at ReportFraud.ftc.gov", "Nowhere unless money was lost"], answer: 1, explain: "Reporting to the financial provider may stop a transfer; FTC reports help identify wider campaigns." },
    ],
  },
  {
    title: "“Microsoft support” sends a device code",
    setup: "A caller claiming to be Microsoft support gives you a device code. The code opens a genuine Microsoft sign-in page and the caller asks you to approve it.",
    questions: [
      { prompt: "What manipulation tactic is being used?", options: ["Fake authority and borrowed trust in a real sign-in page", "A normal password reset", "A browser update"], answer: 0, explain: "The attacker impersonates support and uses a genuine page to make an unauthorized request look safe." },
      { prompt: "What sensitive action are they requesting?", options: ["Approving their device to access your account", "Checking your internet speed", "Downloading a receipt"], answer: 0, explain: "Entering or approving the code can authorize the attacker's device, not yours.", critical: true },
      { prompt: "How should you verify the request?", options: ["Ask the caller to repeat the code", "End the call and contact support through the official app or website", "Search for the caller's number in the message"], answer: 1, explain: "Official support reached through a route you choose is independent of the caller." },
      { prompt: "What is the safest immediate response?", options: ["Never enter or approve the code; end the call", "Approve it because the page is genuine", "Approve it, then change your password"], answer: 0, explain: "A genuine page does not make an unsolicited authorization request safe.", critical: true },
      { prompt: "Where should you report the attempt?", options: ["The impersonated provider and your organization’s security team, if applicable", "Only the caller's phone carrier", "A public social-media reply"], answer: 0, explain: "The provider and workplace security team can investigate the account and campaign." },
    ],
  },
  {
    title: "A supervisor requests an unusual payment",
    setup: "A message from a legitimate-looking supervisor account asks you to urgently pay a new vendor and says they are unavailable for a call.",
    questions: [
      { prompt: "What manipulation tactic is most visible?", options: ["Authority, urgency, and discouraging verification", "A normal invoice reminder", "A password-strength test"], answer: 0, explain: "The request uses authority and time pressure while trying to block an independent check." },
      { prompt: "What sensitive action is requested?", options: ["Changing a profile image", "Sending money to new payment details", "Scheduling a meeting"], answer: 1, explain: "A new payee or changed bank details can redirect funds to an attacker." },
      { prompt: "What is the best separate verification route?", options: ["Reply to the same message", "Use a known phone number or the organization's established payment approval process", "Ask for another email"], answer: 1, explain: "Known contact details and an established approval process do not rely on the possibly compromised account." },
      { prompt: "What is the safest immediate response?", options: ["Pause the payment until the request is independently verified", "Pay half now", "Forward it to a coworker and let them decide"], answer: 0, explain: "Do not move money until both the person and changed payment details are verified." },
      { prompt: "Where should the attempt be reported?", options: ["The organization's security and finance teams through their established channels", "Only to the apparent sender", "Nowhere if the address looks legitimate"], answer: 0, explain: "Security can contain a compromised account, while finance can stop or recover a payment." },
    ],
  },
];

const SOURCES = [
  ["CISA", "Recognize and Report Phishing", "https://www.cisa.gov/secure-our-world/recognize-and-report-phishing"],
  ["FTC", "How To Recognize and Avoid Phishing Scams", "https://consumer.ftc.gov/articles/how-recognize-and-avoid-phishing-scams"],
  ["NIST", "Digital Identity Guidelines: Authentication and Authenticator Management", "https://pages.nist.gov/800-63-4/sp800-63b.html"],
  ["IETF", "RFC 8628, OAuth 2.0 Device Authorization Grant", "https://www.rfc-editor.org/rfc/rfc8628.html#section-5.4"],
] as const;

export const Route = createFileRoute("/social-engineering-defense")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/social-engineering-defense" },
      { name: "twitter:card", content: "summary" },
      ...socialImageMeta,
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/social-engineering-defense" }],
    scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "Course", name: "Social Engineering Defense", description: DESC, provider: { "@type": "Organization", name: "Hygi", url: "https://digitalhygiene.app" }, hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "PT60M" } }) }],
  }),
  component: SocialEngineeringDefensePage,
});

function makeCredentialId() {
  const value = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID().slice(0, 8) : Math.random().toString(36).slice(2, 10);
  return `HYGI-SE-${value.toUpperCase()}`;
}

function addYear(value: Date) {
  const date = new Date(value);
  date.setFullYear(date.getFullYear() + 1);
  return date;
}

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function drawCertificate(name: string, pass: SavedPass) {
  const canvas = document.createElement("canvas");
  canvas.width = 1600;
  canvas.height = 1130;
  const context = canvas.getContext("2d");
  if (!context) return canvas;
  const ink = "#1d2a2a", teal = "#0f766e", gold = "#b8892b";
  context.fillStyle = "#fbfaf6";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = teal;
  context.lineWidth = 14;
  context.strokeRect(40, 40, 1520, 1050);
  context.strokeStyle = gold;
  context.lineWidth = 3;
  context.strokeRect(70, 70, 1460, 990);
  context.textAlign = "center";
  context.fillStyle = teal;
  context.font = "600 34px Georgia, serif";
  context.fillText("HYGI. DIGITAL HYGIENE", 800, 165);
  context.fillStyle = ink;
  context.font = "bold 68px Georgia, serif";
  context.fillText("Certificate of Completion", 800, 275);
  context.font = "bold 50px Georgia, serif";
  context.fillText("Social Engineering Defense", 800, 350);
  context.font = "28px Georgia, serif";
  context.fillText("This certificate recognizes", 800, 425);
  context.fillStyle = teal;
  context.font = "italic bold 66px Georgia, serif";
  context.fillText(name || "Hygi Learner", 800, 520);
  context.strokeStyle = gold;
  context.beginPath(); context.moveTo(420, 548); context.lineTo(1180, 548); context.stroke();
  context.fillStyle = ink;
  context.font = "27px Georgia, serif";
  context.fillText("for identifying, verifying, preventing, reporting, and responding to", 800, 620);
  context.fillText("technology-enabled social-engineering threats.", 800, 662);
  context.font = "bold 25px Georgia, serif";
  context.fillText("SKILLS: PHISHING · VERIFICATION · AUTHENTICATION · AI IMPERSONATION · RECOVERY", 800, 735);
  context.font = "26px Georgia, serif";
  context.fillText(`Assessment: Passed (${pass.score}/15)`, 800, 805);
  context.fillText(`Completed ${formatDate(pass.completedAt)}  ·  Renew by ${formatDate(pass.renewBy)}`, 800, 850);
  context.font = "22px Georgia, serif";
  context.fillText(`Credential ${pass.credentialId}`, 800, 910);
  context.fillStyle = gold;
  context.fillText("digitalhygiene.app/social-engineering-defense", 800, 970);
  context.fillText("Evidence & sources available on the pathway page", 800, 1010);
  return canvas;
}

function SocialEngineeringDefensePage() {
  const progress = useProgress();
  const modules = useMemo(() => MODULES.map((module) => ({ ...module, lesson: lessons.find((lesson) => lesson.id === module.id) })).filter((module) => module.lesson), []);
  const completedModules = modules.filter((module) => module.lesson && (progress[module.id] ?? 0) >= module.lesson.quiz.length);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [savedPass, setSavedPass] = useState<SavedPass | null>(null);
  const [name, setName] = useState("");
  const questions = SCENARIOS.flatMap((scenario) => scenario.questions);

  useEffect(() => {
    setName(localStorage.getItem(NAME_KEY) ?? "");
    try {
      const stored = JSON.parse(localStorage.getItem(RESULT_KEY) ?? "null") as SavedPass | null;
      if (stored?.passed) setSavedPass(stored);
    } catch {
      localStorage.removeItem(RESULT_KEY);
    }
  }, []);

  const submitAssessment = (event: React.FormEvent) => {
    event.preventDefault();
    const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
    const criticalPassed = questions.every((question, index) => !question.critical || answers[index] === question.answer);
    const passed = score >= 12 && criticalPassed;
    const next = { score, passed, criticalPassed };
    setResult(next);
    if (passed) {
      const completedAt = new Date();
      const saved: SavedPass = { ...next, credentialId: savedPass?.credentialId ?? makeCredentialId(), completedAt: completedAt.toISOString(), renewBy: addYear(completedAt).toISOString() };
      localStorage.setItem(RESULT_KEY, JSON.stringify(saved));
      setSavedPass(saved);
    }
  };

  const certificateReady = completedModules.length === modules.length && Boolean(savedPass);
  const download = () => {
    if (!savedPass) return;
    localStorage.setItem(NAME_KEY, name);
    const anchor = document.createElement("a");
    anchor.href = drawCertificate(name.trim(), savedPass).toDataURL("image/png");
    anchor.download = "Hygi-Social-Engineering-Defense-Certificate.png";
    anchor.click();
  };
  const print = () => {
    if (!savedPass) return;
    localStorage.setItem(NAME_KEY, name);
    const url = drawCertificate(name.trim(), savedPass).toDataURL("image/png");
    const popup = window.open("");
    if (!popup) return download();
    popup.document.write(`<title>Social Engineering Defense Certificate</title><img alt="Certificate" src="${url}" style="width:100%" onload="window.print()">`);
  };

  let questionIndex = 0;
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Skills pathway · 60–90 minutes</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">Social Engineering Defense</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">Learn to pause pressure, verify through a separate route, protect authentication, and recover safely. Existing lesson badges count automatically—including your Phishing Defense badge.</p>

      <section aria-labelledby="modules" className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div><h2 id="modules" className="text-2xl font-semibold tracking-tight">Six modules</h2><p className="mt-1 text-sm text-muted-foreground">{completedModules.length} of {modules.length} lesson badges earned</p></div>
          <span className="text-sm text-muted-foreground">{Math.round((completedModules.length / modules.length) * 100)}%</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-secondary" role="progressbar" aria-valuenow={completedModules.length} aria-valuemin={0} aria-valuemax={modules.length} aria-label="Module progress"><div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(completedModules.length / modules.length) * 100}%` }} /></div>
        <ol className="mt-6 space-y-3">
          {modules.map((module, index) => {
            const earned = module.lesson && (progress[module.id] ?? 0) >= module.lesson.quiz.length;
            return <li key={module.id}><Link to="/lesson/$id" params={{ id: module.id }} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 hover:border-primary/40"><span className="w-6 shrink-0 text-sm text-muted-foreground">{index + 1}</span><span className="text-2xl" aria-hidden="true">{module.lesson?.emoji}</span><span className="min-w-0 flex-1"><span className="block font-semibold">{module.name}</span><span className="block text-sm text-muted-foreground">{module.capability}</span><span className="mt-1 block text-xs text-primary">Lesson: {module.lesson?.title}</span></span>{earned ? <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-label="Badge earned" /> : <CircleDashed className="h-5 w-5 shrink-0 text-muted-foreground" aria-label="Take the mini-quiz" />}</Link></li>;
          })}
        </ol>
      </section>

      <section aria-labelledby="assessment" className="mt-12 border-t border-border pt-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Final assessment</p>
        <h2 id="assessment" className="mt-1 text-2xl font-semibold tracking-tight">Three decisions under pressure</h2>
        <p className="mt-2 text-sm text-muted-foreground">Pass with 12 of 15 answers correct. Both device-code safety questions are mandatory. Review explanations and retry whenever you need.</p>
        <form onSubmit={submitAssessment} className="mt-6 space-y-8">
          {SCENARIOS.map((scenario, scenarioIndex) => <fieldset key={scenario.title} className="rounded-lg border border-border bg-card p-5"><legend className="px-2 text-lg font-semibold">Scenario {scenarioIndex + 1}: {scenario.title}</legend><p className="mt-1 text-sm text-muted-foreground">{scenario.setup}</p><div className="mt-5 space-y-6">{scenario.questions.map((question) => { const index = questionIndex++; const selected = answers[index]; return <div key={question.prompt}><p className="font-medium">{question.prompt}{question.critical && <span className="ml-2 text-xs font-semibold text-primary">Required safety item</span>}</p><div className="mt-2 space-y-2">{question.options.map((option, optionIndex) => <label key={option} className="flex cursor-pointer items-start gap-3 rounded-md border border-border p-3 text-sm hover:bg-secondary/40"><input type="radio" name={`question-${index}`} value={optionIndex} checked={selected === optionIndex} onChange={() => setAnswers((current) => ({ ...current, [index]: optionIndex }))} className="mt-0.5" /><span>{option}</span></label>)}</div>{result && <p className={`mt-2 text-sm ${selected === question.answer ? "text-success-strong" : "text-destructive"}`}>{selected === question.answer ? "Correct. " : `Review: ${question.options[question.answer]}. `}{question.explain}</p>}</div>; })}</div></fieldset>)}
          <div className="flex flex-wrap items-center gap-3"><Button type="submit" disabled={Object.keys(answers).length < questions.length}>Check my responses</Button>{result && <Button type="button" variant="outline" onClick={() => { setAnswers({}); setResult(null); }}><RotateCcw /> Retry assessment</Button>}<span className="text-sm text-muted-foreground">{Object.keys(answers).length} of {questions.length} answered</span></div>
        </form>
        {result && <div aria-live="polite" className={`mt-6 rounded-lg border p-5 ${result.passed ? "border-primary/30 bg-primary/10" : "border-destructive/30 bg-destructive/10"}`}><h3 className="font-semibold">{result.passed ? "Passed" : "Not passed yet"} · {result.score}/15</h3><p className="mt-1 text-sm text-muted-foreground">{result.passed ? "Your scenario assessment is complete. Finish any remaining module badges to unlock the certificate." : !result.criticalPassed ? "A required authentication-code safety answer needs review. Read the explanations above, then retry." : "Review the explanations above, then retry when ready. You need at least 12 correct answers."}</p></div>}
      </section>

      <section aria-labelledby="certificate" className="mt-12 rounded-lg border border-primary/30 bg-card p-8 text-center"><Award className="mx-auto h-10 w-10 text-primary" /><h2 id="certificate" className="mt-3 text-2xl font-semibold tracking-tight">Certificate of Completion: Social Engineering Defense</h2><p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">Recognizes successful completion of Hygi’s evidence-informed curriculum on identifying, verifying, preventing, reporting, and responding to technology-enabled social-engineering threats.</p>{certificateReady && savedPass ? <><label className="mx-auto mt-5 block max-w-sm text-left text-sm">Name on certificate<input value={name} onChange={(event) => setName(event.target.value.slice(0, 60))} placeholder="Your name" className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2" /></label><p className="mt-2 text-xs text-muted-foreground">Passed {savedPass.score}/15 · Credential {savedPass.credentialId} · Renew by {formatDate(savedPass.renewBy)}. Your details stay on this device.</p><div className="mt-5 flex flex-wrap justify-center gap-3"><Button onClick={download}><Download /> Download PNG</Button><Button variant="outline" onClick={print}><Printer /> Print</Button></div></> : <p className="mt-4 text-sm text-muted-foreground">Complete all six lesson badges and pass the final scenario assessment to unlock this one-year certificate. {modules.length - completedModules.length} module{modules.length - completedModules.length === 1 ? "" : "s"} remaining{savedPass ? ". Assessment passed." : "; assessment not yet passed."}</p>}</section>

      <details className="mt-10 rounded-lg border border-border bg-card p-5"><summary className="cursor-pointer font-semibold">Evidence and sources</summary><p className="mt-3 text-sm text-muted-foreground">The pathway combines the focused evidence shown inside each lesson. Core references include:</p><ul className="mt-4 space-y-3">{SOURCES.map(([org, title, url]) => <li key={url} className="text-sm"><a href={url} target="_blank" rel="noreferrer" className="font-medium text-primary underline">{org}: {title}</a></li>)}</ul></details>
    </main>
  );
}