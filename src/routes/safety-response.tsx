import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Award, CheckCircle2, CircleDashed, Download, Printer } from "lucide-react";
import { lessons } from "@/lib/lessons";
import { getPathway } from "@/lib/pathways";
import { useProgress } from "@/lib/progress";
import { socialImageMeta } from "@/lib/seo";

const TITLE = "Safety & Response Pathway — Hygi";
const DESC =
  "Free lessons on online abuse, harassment, account takeover, and identity theft recovery, with badges and a completion certificate.";
const NAME_KEY = "dh-cert-name";

export const Route = createFileRoute("/safety-response")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/safety-response" },
      ...socialImageMeta,
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/safety-response" }],
  }),
  component: SafetyResponsePage,
});

function drawCertificate(name: string, count: number, date: string) {
  const c = document.createElement("canvas");
  c.width = 1600;
  c.height = 1130;
  const x = c.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const bg = "#fbfaf6", ink = "#1d2a2a", teal = "#0f766e", gold = "#b8892b";
  void css;
  x.fillStyle = bg;
  x.fillRect(0, 0, c.width, c.height);
  x.strokeStyle = teal;
  x.lineWidth = 14;
  x.strokeRect(40, 40, c.width - 80, c.height - 80);
  x.strokeStyle = gold;
  x.lineWidth = 3;
  x.strokeRect(70, 70, c.width - 140, c.height - 140);
  x.textAlign = "center";
  x.fillStyle = teal;
  x.font = "600 34px Georgia, serif";
  x.fillText("HYGI. DIGITAL HYGIENE", 800, 200);
  x.fillStyle = ink;
  x.font = "bold 80px Georgia, serif";
  x.fillText("Certificate of Completion", 800, 320);
  x.font = "32px Georgia, serif";
  x.fillText("This certifies that", 800, 420);
  x.fillStyle = teal;
  x.font = "italic bold 72px Georgia, serif";
  x.fillText(name || "Hygi Learner", 800, 530);
  x.strokeStyle = gold;
  x.beginPath();
  x.moveTo(420, 560);
  x.lineTo(1180, 560);
  x.stroke();
  x.fillStyle = ink;
  x.font = "32px Georgia, serif";
  x.fillText(`completed all ${count} lessons and mini-quizzes in the`, 800, 640);
  x.font = "bold 50px Georgia, serif";
  x.fillText("Safety & Response Pathway", 800, 720);
  x.font = "26px Georgia, serif";
  x.fillText("Online abuse · Harassment · Account takeover · Identity theft recovery", 800, 785);
  x.font = "28px Georgia, serif";
  x.fillText(`Awarded ${date}`, 800, 900);
  x.fillStyle = gold;
  x.font = "24px Georgia, serif";
  x.fillText("digitalhygiene.app/safety-response", 800, 980);
  return c;
}

function SafetyResponsePage() {
  const pathway = getPathway("response")!;
  const items = pathway.lessonIds.map((id) => lessons.find((l) => l.id === id)!).filter(Boolean);
  const progress = useProgress();
  const done = items.filter((l) => (progress[l.id] ?? 0) >= l.quiz.length);
  const complete = done.length === items.length;
  const [name, setName] = useState("");
  useEffect(() => setName(localStorage.getItem(NAME_KEY) ?? ""), []);
  const date = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const download = () => {
    localStorage.setItem(NAME_KEY, name);
    const url = drawCertificate(name.trim(), items.length, date).toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "Hygi-Safety-Response-Certificate.png";
    a.click();
  };
  const print = () => {
    localStorage.setItem(NAME_KEY, name);
    const url = drawCertificate(name.trim(), items.length, date).toDataURL("image/png");
    const w = window.open("");
    if (!w) return download();
    w.document.write(`<title>Certificate</title><img src="${url}" style="width:100%" onload="window.print()">`);
  };

  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Pathway</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight">🚨 Safety & Response</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {pathway.blurb} Work through online abuse, harassment, account takeover, and identity theft recovery.
        Earn each badge by acing its mini-quiz, then claim your completion certificate.
      </p>

      <div className="mt-6">
        <div className="flex justify-between text-sm">
          <span>{done.length} of {items.length} badges earned</span>
          <span className="text-muted-foreground">{Math.round((done.length / items.length) * 100)}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-secondary" role="progressbar" aria-valuenow={done.length} aria-valuemin={0} aria-valuemax={items.length} aria-label="Pathway progress">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${(done.length / items.length) * 100}%` }} />
        </div>
      </div>

      <ol className="mt-8 space-y-3">
        {items.map((l, i) => {
          const earned = (progress[l.id] ?? 0) >= l.quiz.length;
          return (
            <li key={l.id}>
              <Link
                to="/lesson/$id"
                params={{ id: l.id }}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 hover:border-primary/40"
              >
                <span className="text-sm text-muted-foreground w-5">{i + 1}</span>
                <span className="text-2xl" aria-hidden>{l.emoji}</span>
                <span className="flex-1 min-w-0">
                  <span className="block font-medium">{l.title}</span>
                  <span className="block text-xs text-muted-foreground">{l.tagline}</span>
                </span>
                {earned ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-label="Badge earned" />
                ) : (
                  <CircleDashed className="h-5 w-5 shrink-0 text-muted-foreground" aria-label="Take the quiz" />
                )}
              </Link>
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="cert" className="mt-10 rounded-3xl border border-primary/30 bg-card p-8 text-center" style={{ boxShadow: "var(--shadow-soft)" }}>
        <Award className="mx-auto h-10 w-10 text-primary" />
        <h2 id="cert" className="mt-3 text-2xl font-semibold tracking-tight">Completion certificate</h2>
        {complete ? (
          <>
            <p className="mt-2 text-sm text-muted-foreground">You've earned every badge in this pathway. Add your name as you'd like it shown.</p>
            <label className="mx-auto mt-5 block max-w-sm text-left text-sm">
              Name on certificate
              <input
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 60))}
                placeholder="Your name"
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2"
              />
            </label>
            <p className="mt-2 text-xs text-muted-foreground">Your name stays on this device only.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button onClick={download} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
                <Download className="h-4 w-4" /> Download PNG
              </button>
              <button onClick={print} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm">
                <Printer className="h-4 w-4" /> Print
              </button>
            </div>
          </>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Earn all {items.length} badges above to unlock your certificate. {items.length - done.length} to go.
          </p>
        )}
      </section>

      <p className="mt-8 text-sm text-muted-foreground">
        Need help right now? Visit <Link to="/abuse-support" className="text-primary underline">abuse support resources</Link>.
      </p>
    </main>
  );
}
