import { ExternalLink } from "lucide-react";

const SOURCES = [
  {
    label: "Dartmouth — Guide to Digital Hygiene",
    href: "https://services.dartmouth.edu/TDClient/1806/Portal/KB/Article/155669/Dartmouth-Guide-to-Digital-Hygiene",
  },
  {
    label: "Caltech IMSS — Cybersecurity Week 4",
    href: "https://imss.caltech.edu/documents/6692/Cybersecurity_Week_4.pdf",
  },
  {
    label: "Caltech IMSS — Cybersecurity Week 3",
    href: "https://imss.caltech.edu/documents/6691/Cybersecurity_Week_3.pdf",
  },
  {
    label: "Caltech IMSS — Cybersecurity Week 2",
    href: "https://imss.caltech.edu/documents/6690/Cybersecurity_Week_2.pdf",
  },
  {
    label: "Cal Poly — Top 10 Security Practices",
    href: "https://security.calpoly.edu/top-10-security-practices",
  },
  {
    label: "Harvard T.H. Chan — Digital Safety Kit for Public Health",
    href: "https://www.hsph.harvard.edu/chc/wp-content/uploads/sites/2464/2024/03/Digital-Safety-Kit-for-Public-Health-2024-1.pdf",
  },
];

export function LessonSources() {
  return (
    <div className="mt-8 w-full border-t border-border pt-6 text-left">
      <h3 className="text-sm font-semibold tracking-tight">Sources</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Everything you just learned was adapted from these university cybersecurity guides:
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {SOURCES.map((s) => (
          <li key={s.href}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              {s.label}
              <ExternalLink className="h-3 w-3" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
