export type QuizQ = {
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

export type Lesson = {
  id: string;
  title: string;
  emoji: string;
  tagline: string;
  intro: string;
  sections: { heading: string; body: string; tips: string[] }[];
  quiz: QuizQ[];
};

export const lessons: Lesson[] = [
  {
    id: "personal-info",
    title: "Protect Personal Information",
    emoji: "🛡️",
    tagline: "Set boundaries in the digital world",
    intro:
      "Digital hygiene starts with being intentional about what you share. Treat personal details online the way you'd treat your house keys: don't hand them out.",
    sections: [
      {
        heading: "Tighten privacy on social media",
        body: "Each platform (Facebook, Instagram, TikTok, X, Reddit) has settings that govern who sees your posts, location, tags, and contact info. Audit them regularly.",
        tips: [
          "Run the platform's built-in 'Privacy Checkup'.",
          "Limit who can tag you and review tags before they go live.",
          "Disable location sharing and activity status.",
          "Remove third-party apps you no longer use.",
        ],
      },
      {
        heading: "Be careful with resumes & public profiles",
        body: "A CV uploaded to a job board may expose your home address, phone, or DOB to anyone. Strip sensitive details before posting publicly.",
        tips: [
          "Use a professional email, not your personal one.",
          "Never include SSN, DOB, or home address on a public CV.",
          "Request a confidentiality hold on school directory info.",
        ],
      },
    ],
    quiz: [
      {
        q: "Which detail should you NEVER include on a publicly posted resume?",
        options: ["Your name", "Social Security Number", "Skills", "Job title"],
        answer: 1,
        explain: "SSNs (and DOB or home address) should never appear on public CVs.",
      },
      {
        q: "What's a good first step when auditing a social media account?",
        options: [
          "Delete the account",
          "Run the platform's Privacy Checkup",
          "Make every post public",
          "Share your phone number",
        ],
        answer: 1,
        explain: "Privacy Checkups walk you through the most important settings.",
      },
      {
        q: "Why turn off Activity Status?",
        options: [
          "It saves battery only",
          "So others can't see when you're online or last active",
          "It boosts your follower count",
          "It's required by law",
        ],
        answer: 1,
        explain: "Hiding activity status reduces what strangers can learn about your routine.",
      },
    ],
  },
  {
    id: "safe-browsing",
    title: "Safe Browsing & Scams",
    emoji: "🧭",
    tagline: "Spot the traps before you click",
    intro:
      "Most attacks start with a click. Knowing how to read a URL and recognize a scam is one of the highest-leverage skills in digital hygiene.",
    sections: [
      {
        heading: "Read the URL like a label",
        body: "Look for HTTPS, the padlock icon, and the real domain. Attackers love lookalike domains (paypa1.com, micros0ft.support).",
        tips: [
          "Confirm the URL starts with https://.",
          "Click the padlock to inspect the certificate.",
          "Use Google Safe Browsing or VirusTotal to vet a URL.",
        ],
      },
      {
        heading: "Recognize phishing",
        body: "Legitimate companies will not ask for passwords or sensitive data over email. Urgency, threats, and 'too good to be true' offers are red flags.",
        tips: [
          "Don't click links in unsolicited emails.",
          "Hover to preview a link before clicking.",
          "Verify by visiting the site directly in your browser.",
        ],
      },
    ],
    quiz: [
      {
        q: "What does the 's' in https:// indicate?",
        options: ["Speed", "Secure (encrypted) connection", "Search engine", "Standard"],
        answer: 1,
        explain: "HTTPS encrypts traffic between your browser and the site.",
      },
      {
        q: "An email demands you 'verify your password in 5 minutes or lose access'. What is it?",
        options: ["Routine maintenance", "A phishing attempt", "A friendly reminder", "A software update"],
        answer: 1,
        explain: "Urgency + password requests = classic phishing.",
      },
      {
        q: "Which tool helps check if a URL is malicious?",
        options: ["VirusTotal", "Spotify", "Calculator", "Notes app"],
        answer: 0,
        explain: "VirusTotal and Google Safe Browsing scan URLs for known threats.",
      },
    ],
  },
  {
    id: "footprint",
    title: "Audit Your Digital Footprint",
    emoji: "👣",
    tagline: "Know what the internet knows about you",
    intro:
      "Your digital footprint is the trail of data you leave behind. Periodic audits let you clean up old posts, lock down profiles, and catch breaches early.",
    sections: [
      {
        heading: "Search yourself",
        body: "Start with your own name on Google and Bing. Set up Google Alerts so you're notified when new mentions appear.",
        tips: [
          "Set a Google Alert for your full name in quotes.",
          "Check old social profiles you've forgotten about.",
          "Ask data brokers to remove your info.",
        ],
      },
      {
        heading: "Watch for breaches",
        body: "Sign up for breach notifications on services like Have I Been Pwned to know the moment your email shows up in a leak.",
        tips: [
          "Subscribe to HIBP notifications.",
          "Make WHOIS info private if you own a domain.",
          "Rotate passwords on any breached account immediately.",
        ],
      },
    ],
    quiz: [
      {
        q: "What does Have I Been Pwned do?",
        options: [
          "Generates passwords",
          "Tells you if your email appears in a known data breach",
          "Blocks ads",
          "Hides your IP",
        ],
        answer: 1,
        explain: "HIBP cross-references your email against leaked breach databases.",
      },
      {
        q: "Why set up a Google Alert for your name?",
        options: [
          "To boost SEO",
          "To get notified when new mentions of you appear online",
          "To unlock premium features",
          "To delete search results",
        ],
        answer: 1,
        explain: "Alerts help you spot new content about you as soon as it's indexed.",
      },
      {
        q: "WHOIS privacy protects…",
        options: [
          "Your social media",
          "Personal contact info tied to a domain you own",
          "Your bank account",
          "Your Wi-Fi password",
        ],
        answer: 1,
        explain: "WHOIS privacy hides the registrant's personal details from public lookup.",
      },
    ],
  },
  {
    id: "accounts",
    title: "Protect Your Accounts",
    emoji: "🔐",
    tagline: "Strong passwords + MFA = a much harder target",
    intro:
      "The single biggest upgrade you can make to your digital security is unique passwords for every account, plus multi-factor authentication on the important ones.",
    sections: [
      {
        heading: "Use a password manager",
        body: "Built-in managers (iCloud Keychain, Google Password Manager, Windows/Edge) generate and store unique strong passwords so you never reuse one.",
        tips: [
          "Never reuse a password across services.",
          "Let your password manager generate them.",
          "Lock your device + manager with MFA.",
        ],
      },
      {
        heading: "Turn on multi-factor authentication",
        body: "MFA adds a second factor (an app code, a hardware key) so a stolen password alone isn't enough.",
        tips: [
          "Prefer an authenticator app over SMS codes.",
          "Save backup codes in a safe place.",
          "Keep recovery email & phone up to date.",
        ],
      },
    ],
    quiz: [
      {
        q: "Which is the strongest second factor?",
        options: ["SMS code", "Authenticator app or hardware key", "Security question", "Email link"],
        answer: 1,
        explain: "Authenticator apps and hardware keys are far harder to intercept than SMS.",
      },
      {
        q: "Why is reusing passwords risky?",
        options: [
          "It's slow to type",
          "One breach can compromise every account using that password",
          "It uses more storage",
          "It's against the law",
        ],
        answer: 1,
        explain: "Attackers replay leaked credentials across many sites — credential stuffing.",
      },
      {
        q: "Where should you store MFA backup codes?",
        options: [
          "On a sticky note on your laptop",
          "Posted publicly on social media",
          "In a secure place separate from your device",
          "In the email you're protecting",
        ],
        answer: 2,
        explain: "Backup codes belong somewhere offline or in a separate secure vault.",
      },
    ],
  },
  {
    id: "devices",
    title: "Protect Your Devices",
    emoji: "💻",
    tagline: "Your phone is the front door",
    intro:
      "Devices hold a wealth of sensitive info. A few one-time settings — encryption, updates, a strong screen lock — make a stolen device much less useful to a thief.",
    sections: [
      {
        heading: "Encrypt and lock",
        body: "FileVault (Mac), BitLocker (Windows), and on-by-default encryption on iOS/Android scramble your data so it's unreadable without your passcode.",
        tips: [
          "Set a strong passcode on every device.",
          "Turn on full-disk encryption.",
          "Enable Find My / Find My Device for remote wipe.",
        ],
      },
      {
        heading: "Stay patched & connect carefully",
        body: "Software updates close known security holes. Public Wi-Fi can expose your traffic — a VPN gives you a safer tunnel.",
        tips: [
          "Enable automatic OS and app updates.",
          "Avoid sensitive tasks on open public Wi-Fi.",
          "Use a VPN on untrusted networks.",
        ],
      },
    ],
    quiz: [
      {
        q: "What does full-disk encryption protect against?",
        options: [
          "Slow internet",
          "Someone reading your data after stealing your device",
          "Battery drain",
          "Spam emails",
        ],
        answer: 1,
        explain: "Without your passcode, the encrypted contents are unreadable.",
      },
      {
        q: "Best move when joining unknown public Wi-Fi for sensitive work?",
        options: ["Just trust it", "Use a VPN, or wait until you're on a trusted network", "Disable HTTPS", "Share your password"],
        answer: 1,
        explain: "VPNs encrypt your traffic so the local network can't snoop.",
      },
      {
        q: "Why install OS updates promptly?",
        options: [
          "To get new emojis only",
          "They patch known security vulnerabilities",
          "To slow your device down",
          "It's optional and unimportant",
        ],
        answer: 1,
        explain: "Most updates contain security fixes attackers actively exploit.",
      },
    ],
  },
  {
    id: "research-data",
    title: "Protect Sensitive Research",
    emoji: "🧪",
    tagline: "Guard proprietary and classified work",
    intro:
      "Universities are open by design, but that openness can be exploited. If you handle research, IP, or classified data, treat it like a high-value target — because adversaries do.",
    sections: [
      {
        heading: "Know the threats",
        body: "Foreign entities and competitors look for shortcuts: stealing technical data, skipping R&D costs, recruiting insiders, and abusing visiting-scholar or visa programs to access labs.",
        tips: [
          "Treat unsolicited collaboration offers with skepticism.",
          "Verify the identity of visitors before granting lab or data access.",
          "Report unusual recruitment approaches to your security office.",
        ],
      },
      {
        heading: "Recognize exploitation methods",
        body: "Common tactics include computer intrusions, phishing emails dressed as conference invites, and 'spotting' — quietly identifying students or faculty to recruit later for espionage.",
        tips: [
          "Be cautious with unsolicited emails and invitations.",
          "Don't share unpublished research over personal channels.",
          "Separate lab systems from general-purpose browsing and email.",
        ],
      },
    ],
    quiz: [
      {
        q: "Why is 'bypassing R&D costs' a threat to universities?",
        options: [
          "It saves the university money",
          "Adversaries steal academic research to skip their own development costs",
          "It speeds up publication",
          "It only affects private companies",
        ],
        answer: 1,
        explain: "Stealing academic research lets adversaries skip the cost of developing the technology themselves.",
      },
      {
        q: "An unsolicited 'conference invite' asks for a copy of your unpublished paper. What is it likely to be?",
        options: [
          "A routine peer review",
          "A collection attempt — possibly phishing or espionage",
          "A required submission",
          "A grant application",
        ],
        answer: 1,
        explain: "Unsolicited requests for unpublished work are a classic information-collection tactic.",
      },
      {
        q: "Why avoid using a lab system for personal web browsing and email?",
        options: [
          "It's slower",
          "It expands the attack surface that could expose sensitive research",
          "Email is banned in labs",
          "Browsers don't run on lab machines",
        ],
        answer: 1,
        explain: "Lab systems should be isolated so a phishing click or malicious site can't compromise research data.",
      },
    ],
  },
  {
    id: "networked-devices",
    title: "Secure Networked Devices & Backups",
    emoji: "🗄️",
    tagline: "Lock down everything that touches the network",
    intro:
      "Every connected device is a door. Closing the ones you don't need, patching the ones you do, and keeping clean backups makes you dramatically harder to hurt.",
    sections: [
      {
        heading: "Harden networked devices",
        body: "Follow the manufacturer's hardening guide for anything on the network — printers, lab instruments, IoT, servers. Open only the ports and protocols you actually need.",
        tips: [
          "Change default admin passwords immediately.",
          "Disable services and ports you don't use.",
          "Keep firmware and OS patched automatically.",
          "Run anti-malware that updates and scans on a schedule.",
        ],
      },
      {
        heading: "Back up — and test the backups",
        body: "A backup you've never restored is a hope, not a plan. Keep at least one copy offline or off-network so ransomware can't reach it, and verify restores regularly.",
        tips: [
          "Follow 3-2-1: 3 copies, 2 media, 1 offsite/offline.",
          "Disconnect at least one backup from the primary network.",
          "Test a full restore on a schedule — not just during an incident.",
        ],
      },
    ],
    quiz: [
      {
        q: "Why restrict incoming ports and protocols on a networked device?",
        options: [
          "To make it faster",
          "To shrink the attack surface so fewer services can be exploited",
          "To save electricity",
          "It's only for printers",
        ],
        answer: 1,
        explain: "Every open port is a potential entry point — close what you don't need.",
      },
      {
        q: "Why keep at least one backup disconnected from the primary network?",
        options: [
          "Disconnected disks are faster",
          "So ransomware or an attacker on the network can't encrypt or delete it",
          "Network backups are illegal",
          "It looks more professional",
        ],
        answer: 1,
        explain: "Offline backups survive ransomware that wipes everything reachable on the network.",
      },
      {
        q: "What's the point of regularly testing a backup restore?",
        options: [
          "To use more storage",
          "To confirm the backup is complete and actually restorable before you need it",
          "Backups don't need testing",
          "To reset the backup clock",
        ],
        answer: 1,
        explain: "Untested backups frequently fail during real incidents — verify them ahead of time.",
      },
    ],
  },
  {
    id: "incident-response",
    title: "Build an Incident Response Plan",
    emoji: "🚨",
    tagline: "Know what to do before something goes wrong",
    intro:
      "When an incident hits, improvisation costs hours and data. A simple, written plan turns a panic into a checklist.",
    sections: [
      {
        heading: "The five phases",
        body: "A solid IRP covers: (1) identify the incident, (2) contain it to stop the bleeding, (3) eradicate the root cause, (4) recover and validate systems, and (5) review what happened.",
        tips: [
          "Write the plan down — don't keep it only in your head.",
          "List who to call: IT, security office, leadership, legal.",
          "Keep an offline copy of the plan in case systems are down.",
        ],
      },
      {
        heading: "Practice and improve",
        body: "Run tabletop drills so the team has done it once before the real thing. After every incident — even small ones — do a post-incident review and update the plan.",
        tips: [
          "Drill the plan at least once a year.",
          "Capture lessons learned in writing.",
          "Update contact lists and recovery steps after every change.",
        ],
      },
    ],
    quiz: [
      {
        q: "Which phase comes FIRST in incident response?",
        options: ["Eradication", "Identification", "Recovery", "Post-incident review"],
        answer: 1,
        explain: "You can't contain or fix what you haven't identified yet.",
      },
      {
        q: "Why hold a post-incident review?",
        options: [
          "To assign blame",
          "To capture lessons learned and improve the plan",
          "It's required by law",
          "To close the ticket faster",
        ],
        answer: 1,
        explain: "Reviews turn an incident into improvements that prevent the next one.",
      },
      {
        q: "Why keep an offline copy of the incident response plan?",
        options: [
          "Paper looks nicer",
          "Because the systems hosting it may be down during the incident",
          "To save cloud storage",
          "It's not necessary",
        ],
        answer: 1,
        explain: "If the network or laptops are compromised, you still need to read the plan.",
      },
    ],
  },
  {
    id: "ransomware",
    title: "Defend Against Ransomware",
    emoji: "🦠",
    tagline: "Don't pay — prevent",
    intro:
      "Ransomware locks your files and demands payment to give them back. Most infections start with one click — and most are preventable with a few good habits.",
    sections: [
      {
        heading: "How infections happen",
        body: "You can pick up ransomware by opening an email attachment, clicking an ad, following a link, or visiting a site laced with malware. Once running, it can encrypt your local drive, attached drives, and anything reachable on the network.",
        tips: [
          "Don't open attachments you weren't expecting.",
          "Hover links before clicking — verify the real destination.",
          "Use an ad blocker to cut down on malicious ads.",
        ],
      },
      {
        heading: "Prevention that actually works",
        body: "Keep systems patched, run anti-malware that updates itself, and back up regularly to backups that are NOT connected to the machine they protect — so ransomware can't reach them.",
        tips: [
          "Turn on automatic OS and app updates.",
          "Schedule regular anti-virus / anti-malware scans.",
          "Keep at least one backup fully offline or off-network.",
          "Test restoring from backup before you ever need to.",
        ],
      },
    ],
    quiz: [
      {
        q: "How do most ransomware infections start?",
        options: [
          "A hardware failure",
          "Clicking a malicious link, ad, or attachment",
          "A power outage",
          "Installing OS updates",
        ],
        answer: 1,
        explain: "User-triggered clicks on links, ads, or attachments are the most common entry point.",
      },
      {
        q: "Why must backups be disconnected from the network they protect?",
        options: [
          "Network backups are slower",
          "So ransomware can't encrypt or delete the backups too",
          "It saves bandwidth only",
          "Network rules forbid it",
        ],
        answer: 1,
        explain: "Ransomware spreads to anything reachable — offline backups stay intact.",
      },
      {
        q: "When do most people first notice a ransomware infection?",
        options: [
          "During installation",
          "When files are locked or a ransom note appears",
          "When the OS updates",
          "When Wi-Fi disconnects",
        ],
        answer: 1,
        explain: "Ransomware usually stays hidden until it has encrypted enough to demand payment.",
      },
    ],
  },
  {
    id: "continuity",
    title: "Plan for Business Continuity",
    emoji: "🧭",
    tagline: "Keep going when things go wrong",
    intro:
      "A continuity plan helps you prepare for, respond to, and recover from disruptions — outages, ransomware, natural disasters — so the work doesn't stop.",
    sections: [
      {
        heading: "What a continuity plan covers",
        body: "A solid plan includes a business impact analysis (what hurts most if it stops), recovery strategies, written procedures, and ongoing testing and training so people actually know what to do.",
        tips: [
          "Identify the systems and data you can't operate without.",
          "Define a recovery time goal for each critical system.",
          "Document step-by-step recovery procedures.",
        ],
      },
      {
        heading: "Test and train",
        body: "A plan that lives in a binder fails in a real disruption. Run drills, rotate who leads them, and update the plan whenever your tools, vendors, or team change.",
        tips: [
          "Run a tabletop exercise at least annually.",
          "Keep an offline copy of the plan and contact list.",
          "Update after every real incident or major change.",
        ],
      },
    ],
    quiz: [
      {
        q: "What does a business impact analysis identify?",
        options: [
          "Which employees to fire",
          "Which systems and processes are most critical if disrupted",
          "The company's marketing strategy",
          "Tax obligations",
        ],
        answer: 1,
        explain: "A BIA ranks what would hurt the organization most if it went down.",
      },
      {
        q: "Why run continuity drills?",
        options: [
          "To impress auditors only",
          "So the team has practiced before a real disruption hits",
          "They aren't necessary",
          "To slow down operations",
        ],
        answer: 1,
        explain: "Drills surface gaps and build muscle memory before the real event.",
      },
      {
        q: "When should a continuity plan be updated?",
        options: [
          "Never — set it and forget it",
          "After incidents, drills, and major tool, vendor, or team changes",
          "Only every 10 years",
          "Only when leadership changes",
        ],
        answer: 1,
        explain: "Continuity plans are living documents that drift out of date quickly.",
      },
    ],
  },
];

export const getLesson = (id: string) => lessons.find((l) => l.id === id);