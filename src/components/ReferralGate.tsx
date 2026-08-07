import { Link } from "@tanstack/react-router";
import { Lock, Users } from "lucide-react";
import { ShareResultButton } from "@/components/ShareResultButton";
import { PER_GATE, useReferrals, requiredFor } from "@/lib/referrals";

type Props = {
  /** 0-based index of the locked lesson. */
  index: number;
  /** Lesson number the gate sits behind (5, 9 or 14). */
  after: number;
  badgesEarned: number;
  totalBadges: number;
};

/** Blocks a lesson until the learner has shared their badge card twice. */
export function ReferralGate({ index, after, badgesEarned, totalBadges }: Props) {
  const referrals = useReferrals();
  const required = requiredFor(index);
  const remaining = Math.max(0, required - referrals);

  return (
    <section
      className="mt-10 rounded-3xl border border-dashed border-primary/40 bg-secondary/30 p-8 text-center"
      aria-labelledby="referral-gate-title"
    >
      <div
        aria-hidden="true"
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-primary-foreground"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-glow)" }}
      >
        <Users className="h-7 w-7" />
      </div>
      <h2 id="referral-gate-title" className="mt-5 text-2xl font-semibold tracking-tight">
        Refer {PER_GATE} contacts to keep going
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        You've reached the checkpoint after lesson {after}. Share your badge card with{" "}
        {PER_GATE} contacts to unlock the next set of lessons — use the share button below{" "}
        {PER_GATE} times and each share counts as one referral.
      </p>
      <p className="mt-4 text-sm font-medium" role="status">
        {referrals} of {required} referrals sent
        {remaining > 0 ? ` — ${remaining} to go` : " — unlocked!"}
      </p>
      <div className="mx-auto mt-3 h-1.5 max-w-xs overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, (referrals / required) * 100)}%`,
            background: "var(--gradient-hero)",
          }}
        />
      </div>
      <div className="mt-6 flex flex-wrap items-start justify-center gap-3">
        <ShareResultButton
          card={{
            eyebrow: "Digital hygiene progress",
            title: "Learn safer habits with Hygi.",
            stat: `${badgesEarned} / ${totalBadges} badges`,
            emoji: "🛡️",
            note: "Join me — 22 short lessons on protecting your digital life.",
          }}
          text={`I've earned ${badgesEarned}/${totalBadges} digital hygiene badges on Hygi. Try it: https://digitalhygiene.app`}
          label="Share referral"
          variant="solid"
        />
        <Link
          to="/lessons"
          className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Lock className="h-4 w-4" aria-hidden="true" /> Back to lessons
        </Link>
      </div>
    </section>
  );
}
