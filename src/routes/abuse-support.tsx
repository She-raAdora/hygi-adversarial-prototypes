import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, HeartHandshake, LifeBuoy, MapPin, MessageCircle, Phone, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/abuse-support")({
  head: () => ({
    meta: [
      { title: "Abuse Support & Crisis Resources — Hygi" },
      { name: "description", content: "Find confidential crisis support, intimate-image abuse help, and local organizations in the United States, Canada, and Europe." },
      { property: "og:title", content: "Abuse Support & Crisis Resources — Hygi" },
      { property: "og:description", content: "Confidential crisis support, intimate-image abuse help, and local services in the United States, Canada, and Europe." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digitalhygiene.app/abuse-support" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "https://digitalhygiene.app/abuse-support" }],
  }),
  component: AbuseSupportPage,
});

type Resource = { name: string; description: string; actions: Array<{ label: string; href: string; kind?: "phone" | "message" }>; note?: string };

const US: Resource[] = [
  { name: "National Domestic Violence Hotline", description: "Free, confidential, 24-hour support, safety planning, and connections to nearby domestic-violence programs.", actions: [
    { label: "Call 1-800-799-7233", href: "tel:+18007997233", kind: "phone" },
    { label: "Text START to 88788", href: "sms:88788?body=START", kind: "message" },
    { label: "Chat or find local help", href: "https://www.thehotline.org/" },
  ]},
  { name: "RAINN National Sexual Assault Hotline", description: "Confidential, 24-hour sexual-assault support and referrals to local providers in English and Spanish.", actions: [
    { label: "Call 800-656-4673", href: "tel:+18006564673", kind: "phone" },
    { label: "Text HOPE to 64673", href: "sms:64673?body=HOPE", kind: "message" },
    { label: "Chat with RAINN", href: "https://hotline.rainn.org/" },
  ]},
  { name: "Cyber Civil Rights Initiative", description: "Free, 24-hour support for U.S. residents affected by nonconsensual intimate images, sextortion, or recorded sexual assault.", actions: [
    { label: "Call 1-844-878-2274", href: "tel:+18448782274", kind: "phone" },
    { label: "Open the CCRI Safety Center", href: "https://cybercivilrights.org/ccri-safety-center/" },
  ]},
  { name: "StrongHearts Native Helpline", description: "Anonymous, culturally grounded support for Native Americans and Alaska Natives experiencing domestic or sexual violence.", actions: [
    { label: "Call 1-844-762-8483", href: "tel:+18447628483", kind: "phone" },
    { label: "Chat or text", href: "https://strongheartshelpline.org/get-help" },
  ]},
];

const CANADA: Resource[] = [
  { name: "ShelterSafe", description: "A map of more than 600 women’s shelters and transition houses across Canada, searchable by province or location.", actions: [{ label: "Find a nearby shelter", href: "https://sheltersafe.ca/get-help/" }], note: "Call from a phone the abusive person cannot access when possible." },
  { name: "NeedHelpNow.ca", description: "Practical help for youth under 18 dealing with shared intimate images, luring, or sextortion.", actions: [{ label: "Get help for a young person", href: "https://needhelpnow.ca/en/" }] },
  { name: "Cybertip.ca", description: "Canada’s reporting line for online child sexual exploitation, luring, sextortion, and intimate-image abuse involving someone under 18.", actions: [{ label: "Make a report", href: "https://cybertip.ca/en/report/" }], note: "Reports are reviewed during posted business hours. Call 911 if there is immediate danger." },
];

const EUROPE: Resource[] = [
  { name: "WAVE Find Help", description: "A directory of national helplines, shelters, and specialist services across 46 European countries.", actions: [
    { label: "Find support by country", href: "https://wave-network.org/find-help/" },
    { label: "View national helplines", href: "https://wave-network.org/list-of-helplines-in-46-countries/" },
  ]},
  { name: "INHOPE", description: "Find the official hotline in your country for reporting suspected child sexual abuse material online.", actions: [{ label: "Find your country’s hotline", href: "https://www.inhope.org/" }] },
  { name: "116 016 — violence against women helpline", description: "An EU-harmonized support number being introduced for people experiencing violence against women.", actions: [{ label: "Check EU country information", href: "https://www.consilium.europa.eu/en/policies/eu-measures-end-violence-against-women/" }], note: "This number is not yet active in every EU country. Use WAVE to confirm the right local helpline." },
];

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="rounded-lg border border-border bg-card p-5">
      <h3 className="font-semibold text-card-foreground">{resource.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
      {resource.note ? <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{resource.note}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {resource.actions.map((action) => {
          const external = action.href.startsWith("http");
          const Icon = action.kind === "phone" ? Phone : action.kind === "message" ? MessageCircle : ExternalLink;
          return (
            <Button key={action.href} asChild variant="outline" size="sm">
              <a href={action.href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
                <Icon aria-hidden="true" />{action.label}{external ? <span className="sr-only"> (opens in a new tab)</span> : null}
              </a>
            </Button>
          );
        })}
      </div>
    </article>
  );
}

function Region({ id, title, intro, resources }: { id: string; title: string; intro: string; resources: Resource[] }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border pt-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">{resources.map((resource) => <ResourceCard key={resource.name} resource={resource} />)}</div>
    </section>
  );
}

function AbuseSupportPage() {
  return (
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/lesson/$id" params={{ id: "image-based-abuse-response" }} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">Return to the abuse-response lesson</Link>
        <Button asChild variant="outline" size="sm"><a href="https://www.google.com/" aria-label="Quick exit to Google">Quick exit</a></Button>
      </div>

      <header className="mt-8 max-w-3xl">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary"><HeartHandshake aria-hidden="true" /></div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight">Abuse support resources</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">What happened is not your fault. You can choose what help feels safest, and you do not have to make every decision today.</p>
      </header>

      <section aria-labelledby="urgent-help" className="mt-8 border-l-4 border-destructive bg-destructive/10 p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive-strong" aria-hidden="true" />
          <div><h2 id="urgent-help" className="font-semibold">If you are in immediate danger</h2><p className="mt-1 text-sm leading-relaxed">Call <a href="tel:911" className="font-semibold underline underline-offset-4">911</a> in the U.S. or Canada, or <a href="tel:112" className="font-semibold underline underline-offset-4">112</a> in the EU. If calling could increase danger, move to a safer place or device when you can.</p></div>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-semibold"><LifeBuoy className="size-5 text-primary" aria-hidden="true" />Emotional crisis support</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">You do not have to be suicidal to reach out. In the U.S., call or text <a href="tel:988" className="font-semibold text-foreground underline underline-offset-4">988</a>. In Canada, call or text <a href="tel:988" className="font-semibold text-foreground underline underline-offset-4">9-8-8</a>. Both are available 24 hours a day. In the EU, use WAVE below to find the right crisis line for your country.</p>
      </section>

      <section aria-labelledby="safer-browsing" className="mt-6 rounded-lg border border-border bg-secondary p-5">
        <h2 id="safer-browsing" className="font-semibold">Use a safer device if someone may be monitoring you</h2>
        <p className="mt-2 text-sm leading-relaxed text-secondary-foreground">A quick-exit button changes the page, but it does not erase browser history, downloads, call logs, or messages. If possible, use a trusted person’s device, a library computer, or an account the abusive person cannot access.</p>
      </section>

      <nav aria-label="Choose your region" className="mt-8 flex flex-wrap gap-2">
        <Button asChild variant="secondary" size="sm"><a href="#united-states"><MapPin aria-hidden="true" />United States</a></Button>
        <Button asChild variant="secondary" size="sm"><a href="#canada"><MapPin aria-hidden="true" />Canada</a></Button>
        <Button asChild variant="secondary" size="sm"><a href="#europe"><MapPin aria-hidden="true" />European Union</a></Button>
        <Button asChild variant="secondary" size="sm"><a href="#image-removal"><MapPin aria-hidden="true" />Image removal</a></Button>
      </nav>

      <div className="mt-10 space-y-12">
        <Region id="united-states" title="United States" intro="National services can support you directly and connect you with nearby advocates, shelters, counseling, or legal resources." resources={US} />
        <Region id="canada" title="Canada" intro="Services and legal options vary by province and territory. These directories can help you find local support." resources={CANADA} />
        <Region id="europe" title="European Union" intro="Services vary by country. Use the country directories below rather than assuming one number works everywhere." resources={EUROPE} />
      </div>
