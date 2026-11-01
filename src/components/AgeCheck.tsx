import { useState } from "react";
import { Link } from "@tanstack/react-router";

import { isUnderMinAge } from "@/lib/ageGate";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const selectClass =
  "mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground";

/** Neutral birth month/year question shown before creating an account. */
export function AgeCheck({ onResult }: { onResult: (under: boolean) => void }) {
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => thisYear - i);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!month || !year) return;
        onResult(isUnderMinAge(Number(year), Number(month)));
      }}
      className="space-y-4"
    >
      <div>
        <h2 className="text-base font-semibold text-foreground">When were you born?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We ask everyone before creating an account. We don't save your birthday.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="birth-month" className="text-sm font-medium text-foreground">Month</label>
          <select id="birth-month" required value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass}>
            <option value="">Select</option>
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="birth-year" className="text-sm font-medium text-foreground">Year</label>
          <select id="birth-year" required value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
            <option value="">Select</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={!month || !year}
        className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        Continue
      </button>
    </form>
  );
}

/** Friendly message for under-13s: no account, but everything else stays open. */
export function UnderAgeNotice() {
  return (
    <div className="space-y-4" role="status">
      <h2 className="text-lg font-semibold text-foreground">You can keep learning without an account</h2>
      <p className="text-sm text-muted-foreground">
        Hygi accounts are for people 13 and older. You don't need one to learn: every lesson,
        mini-quiz, badge and certificate works without signing in, and your progress saves on
        this device.
      </p>
      <p className="text-sm text-muted-foreground">
        If you have questions about staying safe online, talk with a parent, guardian or teacher.
      </p>
      <Link
        to="/lessons"
        className="block w-full rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Go to the lessons
      </Link>
    </div>
  );
}
