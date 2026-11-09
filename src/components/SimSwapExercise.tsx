import { useEffect, useState } from "react";
import { ArrowRight, Smartphone, Building2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const KEY = "hygi-sim-swap-review-v1";
const carriers = {
  verizon: { name: "Verizon", text: "SIM Protection and Number Lock are distinct: SIM Protection covers SIM/device changes, while Number Lock covers transfers to another carrier.", url: "https://www.verizon.com/support/knowledge-base-309293/" },
  att: { name: "AT&T", text: "Wireless Account Lock can restrict sensitive changes, including SIM changes and number transfers. Access depends on account permissions and supported transactions.", url: "https://www.att.com/support/article/wireless/000102016/" },
  tmobile: { name: "T-Mobile", text: "SIM Protection and Port Out Protection are distinct controls. Options and eligibility may vary; check the current instructions for your account.", url: "https://www.t-mobile.com/support/plans-features/help-with-t-mobile-account-fraud" },
};

export function SimSwapExercise({ stage }: { stage: "intro" | "attack" | "protections" | "carrier" | "takeaway" }) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [carrier, setCarrier] = useState("");
  const [reviewed, setReviewed] = useState(false);
  useEffect(() => {
    const read = () => setReviewed(localStorage.getItem(KEY) === "true");
    read();
    window.addEventListener("dh-progress-synced", read);
    return () => window.removeEventListener("dh-progress-synced", read);
  }, []);

  if (stage === "intro") return (
    <section className="border-y border-border py-6">
      <h2 className="text-xl font-semibold">Can someone steal control of your number without your phone?</h2>
      <div className="mt-4 flex flex-col gap-2">
        {["Yes, by fraudulently transferring the number", "No, they must physically possess the phone", "Only if you use public Wi-Fi"].map((option, i) => (
          <Button key={option} variant={answer === i ? "secondary" : "outline"} className="h-auto min-h-11 justify-start whitespace-normal text-left" aria-pressed={answer === i} onClick={() => setAnswer(i)}>{option}</Button>
        ))}
      </div>
      {answer !== null ? <p role="status" className="mt-4 text-sm text-muted-foreground">{answer === 0 ? "Good choice!" : "Here's why the answer is yes:"} A criminal may impersonate you to convince your carrier to move your number to another SIM or eSIM. Your physical phone can stay in your hand.</p> : null}
    </section>
  );
  if (stage === "attack") return (
    <div className="mt-5">
      <figure>
        <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-start">
          {[{ icon: Smartphone, label: "Your phone number" }, { icon: Building2, label: "Carrier processes an unauthorized change" }, { icon: Smartphone, label: "Scammer's SIM/eSIM receives your number's cellular service" }].map((item, i) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              <item.icon aria-hidden="true" className="size-7 text-primary" />
              <span className="text-sm">{item.label}</span>
              {i < 2 ? <ArrowRight aria-hidden="true" className="size-5 rotate-90 text-muted-foreground sm:rotate-0" /> : null}
            </div>
          ))}
        </div>
        <figcaption className="mt-4 text-xs text-muted-foreground">Illustrative example — not a live network transaction.</figcaption>
      </figure>
      <details className="mt-5 border-y border-border py-4">
        <summary className="cursor-pointer font-medium">SIM swapping vs. port-out fraud</summary>
        <p className="mt-3 text-sm text-muted-foreground">SIM swapping moves your number to another SIM or eSIM, potentially at the same carrier. Port-out fraud transfers your number to another carrier. Providers may use these terms differently.</p>
      </details>
    </div>
  );
  if (stage === "protections") return (
    <div className="mt-4 space-y-3">
      {[
        { title: "Secure your carrier account", items: ["Use a strong, unique password.", "Set a carrier account PIN or passcode where available.", "Enable supported multifactor authentication.", "Never give an unsolicited caller your PIN or verification code."] },
        { title: "Lock unauthorized number changes", items: ["Ask about SIM-change or SIM-swap protection.", "Ask separately about number-transfer or port-out protection.", "Legitimate transfers, SIM replacements or upgrades may need temporary changes to locks. Restore protection afterward."] },
        { title: "Protect accounts connected to your number", items: ["Prefer passkeys or FIDO security keys where supported.", "Use an authenticator app if phishing-resistant options aren't available.", "Save recovery codes securely.", "Confirm alternate recovery methods before removing SMS authentication."] },
      ].map((card) => <details key={card.title} className="rounded-lg border border-border bg-card p-4"><summary className="cursor-pointer font-medium">{card.title}</summary><ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">{card.items.map((item) => <li key={item}>{item}</li>)}</ul></details>)}
    </div>
  );
  if (stage === "carrier") {
    const info = carrier === "verizon" || carrier === "att" || carrier === "tmobile" ? carriers[carrier] : null;
    return <div className="mt-4">
      <label htmlFor="sim-carrier" className="text-sm font-medium">Your carrier (optional)</label>
      <select id="sim-carrier" value={carrier} onChange={(event) => setCarrier(event.target.value)} className="mt-2 min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm">
        <option value="">Choose a carrier</option><option value="verizon">Verizon</option><option value="att">AT&T</option><option value="tmobile">T-Mobile</option><option value="other">Another carrier</option><option value="unsure">Not sure</option>
      </select>
      <div aria-live="polite">
        {info ? <><p className="mt-4 text-sm text-muted-foreground">{info.text}</p><a className="mt-3 inline-block text-sm text-primary underline underline-offset-4" href={info.url} target="_blank" rel="noopener noreferrer">Official {info.name} protection instructions (opens in a new tab)</a></> : carrier ? <p className="mt-4 text-sm text-muted-foreground">Visit your carrier's official app or website and search for “SIM swap protection,” “port-out protection” or “account security PIN.” If unsure who your carrier is, check your bill or phone's account information.</p> : null}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Carrier features and instructions may change. Never enter your phone number, PIN, password or verification codes into Hygi.</p>
    </div>;
  }
  return <div className="mt-4 flex items-start gap-3">
    <Checkbox id="sim-reviewed" checked={reviewed} onCheckedChange={(value) => {
      const next = value === true;
      setReviewed(next);
      localStorage.setItem(KEY, String(next));
      window.dispatchEvent(new Event("dh-progress"));
    }} />
    <div><label htmlFor="sim-reviewed" className="cursor-pointer text-sm font-medium">I've reviewed my carrier protection</label><p className="mt-1 text-xs text-muted-foreground"><ShieldCheck aria-hidden="true" className="mr-1 inline size-3" />Your personal checklist only. Hygi has not verified or enabled any carrier setting.</p></div>
  </div>;
}