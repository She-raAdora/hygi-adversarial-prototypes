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
