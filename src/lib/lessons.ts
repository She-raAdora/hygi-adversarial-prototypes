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
];

export const getLesson = (id: string) => lessons.find((l) => l.id === id);