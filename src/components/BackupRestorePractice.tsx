import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, HardDriveDownload, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { backupRestorePractice as practice } from "@/lib/backupRestorePractice";

export function BackupRestorePractice() {
  const [outcome, setOutcome] = useState<keyof typeof practice.outcomes | null>(null);

  return (
    <aside id="one-file-restore" aria-labelledby="backup-restore-title" className="mt-6 rounded-lg border border-primary/30 bg-primary/5 p-5">
      <p className="text-xs font-medium text-muted-foreground">Optional practice</p>
      <h3 id="backup-restore-title" className="mt-2 flex items-start gap-2 text-lg font-semibold">
        <HardDriveDownload aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
        {practice.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{practice.intro}</p>
      <ol className="mt-5 list-decimal space-y-4 pl-5 text-sm leading-relaxed">
        {practice.steps.map((step) => (
          <li key={step.title} className="pl-1">
            <span className="font-semibold">{step.title}</span>{" "}
            <span className="text-muted-foreground">{step.body}</span>
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-col items-start gap-2" role="group" aria-label="Restore practice result">
        <Button variant="outline" aria-pressed={outcome === "worked"} aria-controls="backup-restore-result" className="h-auto min-h-11 max-w-full whitespace-normal py-3 text-left" onClick={() => setOutcome("worked")}>
          <Check aria-hidden="true" />{practice.outcomes.worked.label}
        </Button>
        <Button variant="outline" aria-pressed={outcome === "retry"} aria-controls="backup-restore-result" className="h-auto min-h-11 max-w-full whitespace-normal py-3 text-left" onClick={() => setOutcome("retry")}>
          <RotateCcw aria-hidden="true" />{practice.outcomes.retry.label}
        </Button>
      </div>
      <div id="backup-restore-result" role="status" aria-live="polite" className="mt-3 text-sm leading-relaxed">
        {outcome ? <p className="font-medium">{practice.outcomes[outcome].body}</p> : null}
      </div>
      <p className="mt-5 border-t border-primary/20 pt-4 text-sm leading-relaxed text-muted-foreground">
        {practice.warning}{" "}Use Hygi’s{" "}
        <Link to="/lesson/$id" params={{ id: "ransomware" }} className="text-primary underline underline-offset-4">Defend Against Ransomware</Link>{" "}
        lesson for next steps.
      </p>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Hygi’s consumer adaptation: a one-file recovery drill. CISA recommends keeping offline backups and regularly testing recovery.
      </p>
      <a href={practice.source.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary underline underline-offset-4">
        CISA: {practice.source.title}<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </aside>
  );
}