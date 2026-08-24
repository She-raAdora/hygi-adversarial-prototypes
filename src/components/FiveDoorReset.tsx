import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";

const KEY = "hygi-five-door-v1";

const DOORS = [
  { id: "email", label: "Primary email", hint: "The inbox that resets everything else." },
  { id: "bank", label: "Primary bank", hint: "Day-to-day money." },
  { id: "invest", label: "Investment or retirement account", hint: "Hard to unwind if lost." },
  {
    id: "manager",
    label: "Password manager or main credential system",
    hint: "The vault that holds the rest.",
  },
  {
    id: "yours",
    label: "One account that matters most to you",
    hint: "Cloud photos, a health portal, insurance, main social media, a business or utility account — your call.",
  },
] as const;

const CHECKS = [
  {
    id: "unique",
    label: "Unique",
    question:
      "Does this account have a credential used nowhere else, or does it support a passkey?",
  },
  {
    id: "layered",
    label: "Layered",
    question: "Is the strongest practical authentication available turned on?",
  },
  {
    id: "recoverable",
    label: "Recoverable",
    question: "Are recovery details and backup methods current?",
  },
] as const;

type State = Record<string, boolean>;

function read(): State {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}") as State;
  } catch {
    return {};
  }
}

/**
 * The Hygi Five-Door Reset: a small, finishable exercise across the five
 * accounts that matter most. Checkbox state lives on the device only — Hygi
 * never asks for account names, passwords, codes, or any other secret.
 */
export function FiveDoorReset() {
  const [state, setState] = useState<State>({});

  useEffect(() => {
    setState(read());
  }, []);

  function toggle(key: string) {
    setState((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }

  const total = DOORS.length * CHECKS.length;
  const done = DOORS.reduce(
    (sum, door) => sum + CHECKS.filter((check) => state[`${door.id}:${check.id}`]).length,
    0,
  );

  return (
    <section
      aria-labelledby="five-door-heading"
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-center gap-2">
        <KeyRound className="h-4 w-4 text-primary" aria-hidden="true" />
        <h2 id="five-door-heading" className="text-xl font-semibold tracking-tight">
          The Hygi Five-Door Reset
        </h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        You don't have to secure every account today. Start with five accounts that would matter
        most if someone else gained access, and run each through Unique, Layered, Recoverable.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        These checkboxes stay on this device. Never type an account name, password, passkey,
        verification code, or recovery code into Hygi.
      </p>

      <p className="mt-4 text-sm font-medium" aria-live="polite">
        {done} of {total} checks done
      </p>

      <ol className="mt-4 space-y-4">
        {DOORS.map((door, i) => (
          <li key={door.id} className="rounded-xl border border-border bg-background p-4">
            <fieldset>
              <legend className="text-sm font-semibold">
                {i + 1}. {door.label}
              </legend>
              <p className="mt-1 text-xs text-muted-foreground">{door.hint}</p>
              <div className="mt-3 space-y-2">
                {CHECKS.map((check) => {
                  const key = `${door.id}:${check.id}`;
                  return (
                    <label
                      key={check.id}
                      className="flex cursor-pointer items-start gap-3 text-sm"
                      htmlFor={key}
                    >
                      <input
                        id={key}
                        type="checkbox"
                        checked={Boolean(state[key])}
                        onChange={() => toggle(key)}
                        className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                      <span>
                        <span className="font-medium">{check.label}</span>{" "}
                        <span className="text-muted-foreground">— {check.question}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>
    </section>
  );
}
