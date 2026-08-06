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
  /** Why learning this lesson is urgent — shown when the badge is earned. */
  urgency?: string;
};

const rawLessons: Lesson[] = [
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
      {
        heading: "Lock down account recovery (CISA)",
        body: "CISA's Project Upskill stresses that recovery options are a back door around your password. If an attacker can reset your password, your MFA barely matters.",
        tips: [
          "Use phishing-resistant MFA — passkeys or security keys — on email, banking, and work accounts.",
          "Remove old recovery phone numbers and addresses you no longer control.",
          "Answer security questions with random stored strings, not real facts.",
          "Protect your primary email first — it unlocks every other account.",
        ],
      },
    ],
    quiz: [
      {
        q: "Why does CISA tell you to secure account-recovery options?",
        options: [
          "They speed up logins",
          "An attacker who controls recovery can reset your password and bypass MFA",
          "They are required for backups",
          "They reduce data usage",
        ],
        answer: 1,
        explain: "Recovery email, phone, and security questions are a bypass route around your password.",
      },
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
      {
        heading: "Run as a standard user (CISA)",
        body: "CISA's Project Upskill Module 1 recommends doing everyday work in a standard, non-administrator account. Malware that lands in a limited account can do far less damage.",
        tips: [
          "Create a separate admin account and use it only to install software.",
          "Leave built-in antivirus and anti-malware protections enabled.",
          "Review app permissions and revoke camera, mic, and location access you don't need.",
          "Research the developer before installing any app, and drop devices that no longer get security updates.",
        ],
      },
    ],
    quiz: [
      {
        q: "Why does CISA suggest daily work in a standard, non-admin account?",
        options: [
          "It makes the device faster",
          "Malware in a limited account can't make system-wide changes as easily",
          "Admin accounts cost more",
          "It disables updates",
        ],
        answer: 1,
        explain: "Least privilege limits what a compromise can reach.",
      },
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
      "Universities are open by design, and that openness gets exploited. If you handle research, IP, or restricted data, treat it like a high-value target.",
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
    id: "ai-phishing",
    title: "Spot AI-Powered Phishing",
    emoji: "🤖",
    tagline: "Deepfakes, voice clones, and BEC",
    intro:
      "Attackers use AI to write flawless phishing emails, clone voices, and impersonate executives. The old typo tells are gone, so verify on a second channel.",
    sections: [
      {
        heading: "New AI tactics to know",
        body: "Deepfake emails mimic an exec's tone perfectly. Voice cloning fakes urgent phone calls. AI scrapes your socials to personalize a lure. Business Email Compromise (BEC) targets payments and wire transfers.",
        tips: [
          "Treat urgent money or credential requests as suspicious by default.",
          "Confirm wire transfers via a known phone number — not the one in the email.",
          "Set a family/team code word for high-stakes voice requests.",
        ],
      },
      {
        heading: "Shrink what AI can scrape",
        body: "The more personal detail you post, the easier you are to impersonate. Limit what you share about your role, schedule, pets, schools, and family on public profiles.",
        tips: [
          "Audit what's public on LinkedIn and social media.",
          "Avoid using real answers for security questions.",
          "Be cautious sharing org charts, vendor names, and travel plans.",
        ],
      },
    ],
    quiz: [
      {
        q: "Your CFO calls urgently asking you to wire funds. What should you do?",
        options: [
          "Send it right away",
          "Verify via a known phone number or in-person before acting",
          "Email them back to confirm",
          "Reply to the same call",
        ],
        answer: 1,
        explain: "AI voice cloning makes calls sound real — always verify through a separate, known channel.",
      },
      {
        q: "What is Business Email Compromise (BEC)?",
        options: [
          "Spam folder overflow",
          "Targeted email fraud that tricks employees into sending money or data",
          "An email outage",
          "A backup failure",
        ],
        answer: 1,
        explain: "BEC uses impersonation — often AI-enhanced — to redirect payments.",
      },
      {
        q: "Why is oversharing on social media a phishing risk?",
        options: [
          "It uses up storage",
          "AI can scrape it to personalize convincing phishing lures",
          "It slows your phone",
          "It's not a risk at all",
        ],
        answer: 1,
        explain: "Personalized phishing has a far higher success rate than generic spam.",
      },
    ],
  },
  {
    id: "mobile",
    title: "Lock Down Your Phone",
    emoji: "📱",
    tagline: "Your phone is a pocket computer",
    intro:
      "Smartphones hold email, banking, photos, and 2FA codes. Lost or unlocked, they're a goldmine. A few settings turn one into a brick for a thief.",
    sections: [
      {
        heading: "Treat it like a laptop",
        body: "Phones need passcodes, updates, anti-malware (especially on Android), and you should avoid storing confidential data on them when you don't have to.",
        tips: [
          "Use a 6+ digit passcode or biometric.",
          "Turn on auto-updates for OS and apps.",
          "Only install apps from official stores; verify the publisher.",
          "Enable Find My / Find My Device with remote wipe.",
        ],
      },
      {
        heading: "Be picky about apps and permissions",
        body: "Malicious apps disguise themselves as antivirus or utilities. Even legit apps can over-collect — review what you've granted location, mic, contacts, and photos.",
        tips: [
          "Stick to well-known brands for security apps.",
          "Audit permissions monthly; revoke what you don't use.",
          "Disable Bluetooth and Wi-Fi auto-join when not needed.",
        ],
      },
    ],
    quiz: [
      {
        q: "Why should you avoid installing random 'antivirus' apps on your phone?",
        options: [
          "They drain battery only",
          "Many are malware disguised as security tools",
          "They cost too much",
          "They never work",
        ],
        answer: 1,
        explain: "Stick with well-known brands — fake AV apps are a common malware vector.",
      },
      {
        q: "Best feature to enable in case your phone is lost?",
        options: [
          "Airplane mode",
          "Find My / Find My Device with remote wipe",
          "Dark mode",
          "Auto-brightness",
        ],
        answer: 1,
        explain: "Remote wipe lets you erase the device before a thief can mine it.",
      },
      {
        q: "Why audit app permissions periodically?",
        options: [
          "It speeds up the OS",
          "Apps often keep access to mic, location, and contacts long after you stopped using them",
          "It's required by law",
          "It clears storage",
        ],
        answer: 1,
        explain: "Revoking unused permissions limits what a compromised app can leak.",
      },
    ],
  },
  {
    id: "workstation",
    title: "Workstations & Public Computers",
    emoji: "🖥️",
    tagline: "Lock it. Don't trust it.",
    intro:
      "Three unattended minutes is enough to send email as you, install a keylogger, or copy files. On public computers, assume you are already compromised.",
    sections: [
      {
        heading: "Lock when you leave",
        body: "Make screen-lock a reflex. On Windows, Win+L. On Mac, Ctrl+Cmd+Q. Set the screen to auto-lock after a short idle time.",
        tips: [
          "Lock your screen every single time you stand up.",
          "Auto-lock after 5 minutes of inactivity or less.",
          "Require a password (not just a swipe) to unlock.",
        ],
      },
      {
        heading: "Public computers = casual browsing only",
        body: "Hotel business centers and cybercafé PCs may have keyloggers or malware. Never sign in to email, banking, or work systems from them.",
        tips: [
          "Never enter passwords on a public computer.",
          "Use your phone with cellular data for sensitive tasks instead.",
          "Always sign out and close the browser when you finish.",
        ],
      },
    ],
    quiz: [
      {
        q: "Why lock your screen even for a quick break?",
        options: [
          "It saves power only",
          "A passerby can send email as you, copy files, or install a keylogger in seconds",
          "It's a company logo display",
          "It's optional and unimportant",
        ],
        answer: 1,
        explain: "Unattended unlocked workstations are one of the easiest insider-threat vectors.",
      },
      {
        q: "Is it safe to check your bank account on a hotel lobby PC?",
        options: [
          "Yes, hotels are trusted",
          "No — assume it may have keyloggers or malware",
          "Only on weekdays",
          "Only if HTTPS is on",
        ],
        answer: 1,
        explain: "You can't verify what's running on a public machine — never enter sensitive credentials.",
      },
      {
        q: "Quickest way to lock a Windows workstation?",
        options: ["Alt+F4", "Win+L", "Ctrl+S", "Esc"],
        answer: 1,
        explain: "Win+L locks Windows instantly — make it muscle memory.",
      },
    ],
  },
  {
    id: "recognize-harassment",
    title: "Recognize Online Harassment",
    emoji: "🚨",
    tagline: "Name the tactics used against public health voices",
    intro:
      "Online harassment of public-facing professionals is rising. Knowing the tactics, and the words for them, helps you report it and get the right help.",
    sections: [
      {
        heading: "Common harassment tactics",
        body: "Harassers borrow from a shared playbook. Spotting the pattern is the first step to responding calmly and getting support.",
        tips: [
          "Astroturfing: fake accounts making backlash look like a crowd.",
          "Dogpiling: many coordinated accounts piling onto one post or person.",
          "Concern trolling: hostile messages dressed up in a supportive tone.",
          "Dog-whistles: coded language that evokes hate without breaking platform rules.",
          "Hashtag hijacking: swarming a campaign hashtag to drown out its message.",
        ],
      },
      {
        heading: "When harassment escalates",
        body: "Some tactics cross from insults into safety threats. Treat these as emergencies, not disagreements.",
        tips: [
          "Doxing: publishing someone's private info like home address or phone.",
          "Cyberstalking: repeated invasive contact across platforms and inboxes.",
          "Impersonation: fake accounts posting under your name and photo.",
          "Targeting: harassment aimed at your family or personal life.",
          "Swatting: false crime reports meant to send police to your door.",
          "Deepfakes: fabricated audio/video meant to look like a real record.",
        ],
      },
    ],
    quiz: [
      {
        q: "A wave of accounts uses a vaccine campaign's hashtag to flood it with disinformation. What is this?",
        options: ["Concern trolling", "Hashtag hijacking", "Swatting", "Impersonation"],
        answer: 1,
        explain: "Hashtag hijacking co-opts an existing hashtag to drown out its intended message.",
      },
      {
        q: "Someone posts a scientist's home address and phone number publicly. This is:",
        options: ["Dogpiling", "Astroturfing", "Doxing", "A dog-whistle"],
        answer: 2,
        explain: "Doxing is the public release of someone's private personal information.",
      },
      {
        q: "A message says 'I support your research, but…' then piles on far-fetched objections. Most likely tactic?",
        options: ["Concern trolling", "Swatting", "Deepfake", "Targeting"],
        answer: 0,
        explain: "Concern trolling masks antagonism with a supportive tone.",
      },
    ],
  },
  {
    id: "shield-accounts",
    title: "Shield Your Accounts",
    emoji: "🔐",
    tagline: "Harden the accounts harassers try first",
    intro:
      "Attackers usually start with your accounts. A few settings changes make it dramatically harder for anyone to take them over or use them to reach you.",
    sections: [
      {
        heading: "Lock down logins",
        body: "Assume every password will eventually leak. Layered protection is what actually keeps accounts yours.",
        tips: [
          "Turn on multi-factor auth everywhere — prefer an authenticator app over SMS.",
          "Use a password manager and unique passwords for every account.",
          "Review active sessions and sign out unknown devices.",
          "Log out of email and social apps on shared or mobile devices when you're done.",
        ],
      },
      {
        heading: "Cut off the side doors",
        body: "Recovery flows, connected apps, and old accounts are common ways in.",
        tips: [
          "Set a strong PIN or passcode on your phone number with your carrier.",
          "Update recovery email and phone — remove any you no longer control.",
          "Revoke third-party apps you no longer use.",
          "Delete inactive accounts so they can't be hijacked and used against you.",
        ],
      },
    ],
    quiz: [
      {
        q: "Which MFA option is most resistant to SIM-swap attacks?",
        options: ["SMS text codes", "Authenticator app or security key", "Email only", "No MFA"],
        answer: 1,
        explain: "Authenticator apps and hardware keys aren't tied to your phone number.",
      },
      {
        q: "Why call your mobile carrier to add a PIN?",
        options: [
          "It speeds up your data",
          "It helps prevent SIM-swap account takeovers",
          "It hides your number",
          "It's required to receive MFA texts",
        ],
        answer: 1,
        explain: "A carrier PIN makes it harder for someone to port your number and steal MFA codes.",
      },
      {
        q: "What should you do with an old social account you no longer use?",
        options: ["Leave it public", "Delete it", "Share the login", "Reuse the password elsewhere"],
        answer: 1,
        explain: "Inactive accounts are easy takeover targets — delete them.",
      },
    ],
  },
  {
    id: "smaller-trail",
    title: "Leave a Smaller Digital Trail",
    emoji: "👣",
    tagline: "Post like strangers are watching — because they are",
    intro:
      "You can't fully undo what's online, but you can shrink the trail. Fewer public details mean fewer footholds for harassers, stalkers, and doxers.",
    sections: [
      {
        heading: "Post with a stranger in mind",
        body: "Before sharing, ask how comfortable you'd be with a stranger knowing this — your location, workplace, routine, or family.",
        tips: [
          "Strip location data and identifying backgrounds from photos.",
          "Delay 'I'm here' posts until after you've left.",
          "Prefer time-limited formats (Stories) for casual updates.",
          "Delete old posts you no longer need public.",
        ],
      },
      {
        heading: "Shrink your public data",
        body: "Data brokers and old profiles quietly rebuild a map of you. Audit yourself the way a harasser would.",
        tips: [
          "Search your name, email, and phone; set Google Alerts for each.",
          "Use a reverse image search to find photos of yourself online.",
          "Submit opt-out requests to data broker sites.",
          "Leave and clean out old group chats, forums, and Facebook groups.",
        ],
      },
      {
        heading: "Separate work from personal",
        body: "Blur the line between your professional persona and personal life so a work-related attack can't spill into home.",
        tips: [
          "Use different usernames and photos for work vs. personal accounts.",
          "Keep family and children off public professional profiles.",
          "Use a work-only email and phone number for public listings.",
        ],
      },
    ],
    quiz: [
      {
        q: "Best way to monitor whether new info about you appears online?",
        options: [
          "Check once a year",
          "Set Google Alerts for your name, email, and phone",
          "Delete your browser history",
          "Turn off your Wi-Fi",
        ],
        answer: 1,
        explain: "Google Alerts notify you when new pages mention your search terms.",
      },
      {
        q: "You want to post about a conference you're attending. Safer approach?",
        options: [
          "Live-post your exact location",
          "Share after you've left the venue",
          "Tag your hotel room number",
          "Post your flight details",
        ],
        answer: 1,
        explain: "Delaying location posts denies harassers real-time tracking.",
      },
      {
        q: "Why keep separate work and personal social profiles?",
        options: [
          "It's required by law",
          "So a professional attack has fewer footholds into your personal life",
          "It boosts SEO",
          "It makes MFA optional",
        ],
        answer: 1,
        explain: "Separation limits how easily harassment can cross from work into home.",
      },
    ],
  },
  {
    id: "respond-harassment",
    title: "Respond to Online Harassment",
    emoji: "🆘",
    tagline: "An emergency checklist when it's happening",
    intro:
      "In the moment, harassment is disorienting. A short checklist keeps you safe, preserves evidence, and pulls in support instead of leaving you to face it alone.",
    sections: [
      {
        heading: "Stabilize and document",
        body: "Don't argue with harassers. Prioritize safety, then evidence, then response.",
        tips: [
          "Screenshot posts, messages, usernames, timestamps, and URLs before they disappear.",
          "Save evidence somewhere off-platform (cloud folder, printed copies).",
          "Do not reply or retaliate — it fuels dogpiling.",
          "Mute or temporarily deactivate notifications, not your whole account.",
        ],
      },
      {
        heading: "Pull in help",
        body: "You should not handle this alone. Employers, schools, and platforms have obligations to help.",
        tips: [
          "Tell your supervisor, security team, or department chair immediately.",
          "Report content to the platform and, for threats of violence, to law enforcement.",
          "Ask a trusted colleague to monitor your inboxes so you don't have to.",
          "If you're a student, ask your school about a FERPA block on directory info.",
        ],
      },
      {
        heading: "Support someone else",
        body: "If a colleague is targeted, don't wait for them to ask.",
        tips: [
          "Offer to screenshot and log harassment on their behalf.",
          "Help audit and remove their public data (work bio, directory info).",
          "Reach out socially and offline — isolation makes harassment worse.",
          "Amplify their work, not the harassment.",
        ],
      },
    ],
    quiz: [
      {
        q: "First thing to do when harassment starts flooding in?",
        options: [
          "Reply to each harasser",
          "Screenshot and save evidence before it's deleted",
          "Delete your account immediately",
          "Post a public rebuttal",
        ],
        answer: 1,
        explain: "Evidence disappears fast — capture it before responding to anything.",
      },
      {
        q: "A student facing harassment can ask their school for what protection?",
        options: ["A FERPA block on directory info", "A new SSN", "A tax refund", "Free MFA hardware"],
        answer: 0,
        explain: "A FERPA block prevents the school from releasing directory information publicly.",
      },
      {
        q: "Best way to help a colleague who is being harassed online?",
        options: [
          "Tell them to log off and forget it",
          "Argue with the harassers on their behalf",
          "Offer to document harassment and audit their public data",
          "Share the harassing posts to raise awareness",
        ],
        answer: 2,
        explain: "Practical, quiet support — documenting and reducing public exposure — actually helps.",
      },
    ],
  },
  {
    id: "core-four",
    title: "The Four Core Habits",
    emoji: "⭐",
    tagline: "CISA's Secure Our World basics",
    intro:
      "CISA's Secure Our World campaign boils personal cybersecurity down to four habits that stop the overwhelming majority of everyday attacks: recognize and report phishing, use strong passwords, turn on multifactor authentication, and update your software.",
    sections: [
      {
        heading: "Recognize and report phishing",
        body: "Urgency is the tell. Attackers push you to act before you think, so the fix is to slow down and verify through a different channel.",
        tips: [
          "Pause before responding to urgent or alarming messages.",
          "Examine the sender, links, attachments, and unusual requests.",
          "Verify the request by calling or messaging the person another way.",
          "Report suspicious messages instead of just deleting them.",
        ],
      },
      {
        heading: "Passwords, MFA, and updates",
        body: "Long, random, unique passwords in a reputable password manager; a second factor on the accounts that matter; and automatic updates everywhere.",
        tips: [
          "Make passwords long, random, and unique — never reused.",
          "Add MFA to email, financial, social, cloud-storage, and work accounts first.",
          "Prefer passkeys or security keys where offered.",
          "Turn on automatic updates and replace gear that no longer gets security support.",
        ],
      },
    ],
    quiz: [
      {
        q: "What are CISA's four core cyber habits?",
        options: [
          "Antivirus, VPN, firewall, incognito mode",
          "Recognize phishing, strong passwords, MFA, update software",
          "Backups, encryption, shredding, insurance",
          "Two emails, two phones, two laptops, two routers",
        ],
        answer: 1,
        explain: "Secure Our World centers on exactly those four habits.",
      },
      {
        q: "You get an urgent text from 'your bank' asking you to confirm a transfer. Best move?",
        options: [
          "Tap the link and log in quickly",
          "Reply STOP",
          "Contact the bank through a number you already trust",
          "Forward it to friends",
        ],
        answer: 2,
        explain: "Verify through a separate, known channel — never the one the message gave you.",
      },
      {
        q: "What should you do with software that no longer receives security updates?",
        options: [
          "Keep using it forever",
          "Replace or retire it",
          "Turn off its updates",
          "Only use it on Wi-Fi",
        ],
        answer: 1,
        explain: "Unsupported software keeps known holes open permanently.",
      },
    ],
  },
  {
    id: "threat-landscape",
    title: "Know Your Threat Landscape",
    emoji: "🎯",
    tagline: "Who might target you, and why",
    intro:
      "CISA identifies high-risk communities — activists, journalists, human-rights defenders, academics, and civil-society staff — who are targeted because of their work or identity. Knowing your own risk profile tells you which defenses to build first.",
    sections: [
      {
        heading: "Name your risks",
        body: "Security decisions get easy once you know what you're protecting, who wants it, and what happens if they get it.",
        tips: [
          "List your most sensitive accounts, files, and contacts.",
          "Ask who would benefit from access — scammers, harassers, or a determined adversary.",
          "Rank fixes by damage prevented, not by effort.",
          "Assume your primary email is the top prize and defend it first.",
        ],
      },
      {
        heading: "Get help when you need it",
        body: "CISA maintains a resource catalog for high-risk communities, including digital-emergency help, the Digital First Aid Kit, and cyber volunteer clinics for under-resourced organizations.",
        tips: [
          "Save a digital-security helpline contact before you need it.",
          "Know your organization's incident reporting path.",
          "Share CISA's free materials with colleagues and family.",
          "Treat unusual login alerts as incidents, not annoyances.",
        ],
      },
    ],
    quiz: [
      {
        q: "Which group does CISA count as a high-risk community?",
        options: [
          "Only government employees",
          "Journalists, activists, academics, and civil-society staff",
          "Only large corporations",
          "Nobody in particular",
        ],
        answer: 1,
        explain: "They may be targeted specifically because of their work or identity.",
      },
      {
        q: "Which account usually deserves your strongest protection?",
        options: ["A shopping account", "Your primary email", "A game login", "A news site account"],
        answer: 1,
        explain: "Email resets everything else, so it is the highest-value target.",
      },
      {
        q: "What's the point of naming your risks first?",
        options: [
          "It replaces the need for MFA",
          "It tells you which protections matter most for you",
          "It guarantees you'll never be attacked",
          "It's a legal requirement",
        ],
        answer: 1,
        explain: "A quick threat model turns a long checklist into a short priority list.",
      },
    ],
  },
  {
    id: "encrypt-backup",
    title: "Encrypt & Back Up Your Data",
    emoji: "🗄️",
    tagline: "Project Upskill Module 3",
    intro:
      "CISA's third Upskill module is about the information sitting on your devices right now: find it, copy it somewhere safe, and encrypt it so a lost laptop isn't a data breach.",
    sections: [
      {
        heading: "Back up like it's already broken",
        body: "Ransomware, theft, and dead drives all end the same way if your only copy was on the device.",
        tips: [
          "Identify the sensitive information stored locally.",
          "Keep at least one backup you can restore from.",
          "Disconnect external backup drives when you're not using them.",
          "Evaluate a cloud-backup provider's security before trusting it.",
        ],
      },
      {
        heading: "Encrypt devices, drives, and files",
        body: "Full-device encryption is one setting. Removable drives and individual sensitive files deserve their own.",
        tips: [
          "Turn on full-device encryption (FileVault, BitLocker, device encryption).",
          "Encrypt USB sticks and external drives too.",
          "Encrypt individual highly sensitive files with a strong passphrase.",
          "Store recovery keys somewhere safe and separate from the device.",
        ],
      },
    ],
    quiz: [
      {
        q: "Why keep a backup drive disconnected when not in use?",
        options: [
          "To save electricity",
          "So ransomware or malware on the computer can't encrypt the backup too",
          "Drives expire when plugged in",
          "It speeds up backups",
        ],
        answer: 1,
        explain: "An always-connected backup gets encrypted alongside the original.",
      },
      {
        q: "Where should an encryption recovery key live?",
        options: [
          "In a text file on the encrypted device",
          "Safe and separate from the device it unlocks",
          "In your email signature",
          "Nowhere — memorize it and hope",
        ],
        answer: 1,
        explain: "A key stored on the device it unlocks protects nothing, and a lost key means lost data.",
      },
      {
        q: "Beyond your laptop's internal disk, what else should be encrypted?",
        options: [
          "Nothing else",
          "Removable drives and sensitive individual files",
          "Only cloud photos",
          "Only work documents",
        ],
        answer: 1,
        explain: "USB sticks and single sensitive files are the ones that walk away most easily.",
      },
    ],
  },
  {
    id: "secure-comms",
    title: "Secure Comms & Browsing",
    emoji: "💬",
    tagline: "Project Upskill Module 4",
    intro:
      "Messages, browsing, and cloud services are where most of your daily exposure happens. CISA's fourth module is about choosing encrypted tools and tightening the defaults.",
    sections: [
      {
        heading: "Use encrypted messaging and calling",
        body: "End-to-end encrypted apps mean the provider — and anyone watching the network — can't read your conversations.",
        tips: [
          "Pick a reputable end-to-end encrypted messaging and calling app.",
          "Verify contacts through a second channel before sharing sensitive details.",
          "Turn on disappearing messages for sensitive threads.",
          "Assume SMS is readable in transit.",
        ],
      },
      {
        heading: "Harden the browser and vet cloud services",
        body: "Browsers ship permissive by default, and cloud providers vary wildly in how they protect what you upload.",
        tips: [
          "Adjust browser privacy and security settings; block third-party tracking.",
          "Insist on HTTPS connections and stop at certificate warnings.",
          "Recognize unsafe sites and refuse unexpected downloads.",
          "Assess a cloud provider's encryption and MFA support before entrusting sensitive data.",
        ],
      },
    ],
    quiz: [
      {
        q: "What does end-to-end encryption give you?",
        options: [
          "Faster messages",
          "Only you and the recipient can read the content",
          "Free storage",
          "Guaranteed delivery",
        ],
        answer: 1,
        explain: "Not even the service provider or the network can read end-to-end encrypted content.",
      },
      {
        q: "A site throws a certificate warning. You should:",
        options: [
          "Click through — warnings are usually wrong",
          "Stop and don't enter any information",
          "Disable HTTPS and retry",
          "Log in from your phone instead",
        ],
        answer: 1,
        explain: "A certificate warning can mean your connection is being intercepted.",
      },
      {
        q: "Before storing sensitive files with a cloud provider, what should you check?",
        options: [
          "Its logo design",
          "Its encryption, MFA support, and security track record",
          "Whether it has a mobile app",
          "How many users it has",
        ],
        answer: 1,
        explain: "CISA advises assessing providers before entrusting them with sensitive information.",
      },
    ],
  },
  {
    id: "home-wifi",
    title: "Secure Your Home Wi-Fi",
    emoji: "📶",
    tagline: "Project Upskill Module 5",
    intro:
      "Your router is the gate to every device in your home, and most people never touch its settings. CISA calls this module the minimum essential steps for home-router privacy and security.",
    sections: [
      {
        heading: "Take control of the router",
        body: "Default admin credentials are published online. Changing them is the single highest-value five-minute task in your home.",
        tips: [
          "Change the router's default administrator password.",
          "Rename the network so it doesn't advertise the make and model.",
          "Install firmware updates, or enable automatic updates.",
          "Disable remote administration if you don't use it.",
        ],
      },
      {
        heading: "Encrypt and segment",
        body: "Modern Wi-Fi encryption plus a guest network keeps visitors and chatty smart devices away from your laptops and files.",
        tips: [
          "Use current Wi-Fi encryption (WPA3, or WPA2 if that's the best available).",
          "Review the list of connected devices and remove anything you don't recognize.",
          "Put guests and smart-home gadgets on a separate guest network.",
          "Use a long passphrase for the Wi-Fi itself.",
        ],
      },
    ],
    quiz: [
      {
        q: "First thing to change on a brand-new router?",
        options: [
          "The color of the LEDs",
          "The default administrator password",
          "The antenna angle",
          "Nothing — defaults are secure",
        ],
        answer: 1,
        explain: "Default admin credentials are publicly documented per model.",
      },
      {
        q: "Why put smart-home devices on a guest network?",
        options: [
          "They get faster Wi-Fi",
          "To keep a compromised gadget away from your computers and files",
          "It's required by law",
          "It lowers your bill",
        ],
        answer: 1,
        explain: "Segmentation limits what a weak device can reach.",
      },
      {
        q: "Which Wi-Fi encryption should you prefer?",
        options: ["None", "WEP", "WPA3 (or WPA2 if WPA3 isn't available)", "Hidden SSID instead of encryption"],
        answer: 2,
        explain: "WEP is broken and hiding the network name is not encryption.",
      },
    ],
  },
  {
    id: "public-footprint",
    title: "Shrink Your Public Footprint",
    emoji: "🔎",
    tagline: "Project Upskill Module 6",
    intro:
      "Targeted attacks start with research. CISA's sixth module is about limiting what a stranger can learn about you — and how separate harmless posts combine into a targeting package.",
    sections: [
      {
        heading: "Audit what's searchable",
        body: "Search yourself the way an adversary would, then remove or lock down what you find.",
        tips: [
          "Search your name, email, phone, and usernames.",
          "Request removal from people-search and data-broker sites.",
          "Tighten social-media privacy and account settings.",
          "Prune old accounts and public posts you no longer need.",
        ],
      },
      {
        heading: "Think about aggregation",
        body: "One post about your gym, one about your kid's school, one about a trip — together they map your routine, your family, and when your home is empty.",
        tips: [
          "Delay travel posts until you're home.",
          "Avoid publishing family, location, employer, and schedule details together.",
          "Be skeptical of new contacts, impersonators, and cloned profiles.",
          "Verify anyone claiming to be a colleague before sharing organizational details.",
        ],
      },
    ],
    quiz: [
      {
        q: "Why is 'aggregation' a risk even when each post seems harmless?",
        options: [
          "Posts slow your phone down",
          "Combined details reveal your routine, relationships, and location",
          "Platforms charge for many posts",
          "It uses more data",
        ],
        answer: 1,
        explain: "Attackers assemble small public details into a targeting profile.",
      },
      {
        q: "A 'colleague' messages from a brand-new profile asking for internal details. You should:",
        options: [
          "Answer — the name matches",
          "Verify their identity through a known channel first",
          "Send a partial answer",
          "Add them and share your calendar",
        ],
        answer: 1,
        explain: "Impersonation and cloned profiles are a standard social-engineering opener.",
      },
      {
        q: "Best time to post vacation photos?",
        options: ["Live from the airport", "After you're back home", "Before you leave", "Whenever, it doesn't matter"],
        answer: 1,
        explain: "Real-time travel posts announce that your home is empty.",
      },
    ],
  },
  {
    id: "incident-plan",
    title: "Your Personal Incident Plan",
    emoji: "🚨",
    tagline: "Decide now, not mid-crisis",
    intro:
      "The last step in CISA's curriculum is planning your response. A written half-page plan turns a panicked night into a checklist — and then you extend the habit to colleagues and family.",
    sections: [
      {
        heading: "Write the plan",
        body: "Cover the first hour: what you check, what you lock, and who you tell.",
        tips: [
          "List steps: change passwords from a clean device, revoke sessions, rotate MFA, check recovery settings.",
          "Keep offline copies of key contacts and backup codes.",
          "Note where your backups are and how to restore them.",
          "Save a digital-security helpline and your organization's reporting contact.",
        ],
      },
      {
        heading: "Extend it outward",
        body: "Attackers move through the people around you. Sharing what you've learned is a security control, not just a courtesy.",
        tips: [
          "Walk family and colleagues through phishing, passwords, MFA, and updates.",
          "Share CISA's free Secure Our World materials.",
          "Agree on a code phrase to verify urgent requests within your team or family.",
          "Practise the plan once — a five-minute dry run finds the gaps.",
        ],
      },
    ],
    quiz: [
      {
        q: "You suspect your account is compromised. Where should you change the password from?",
        options: ["The same possibly infected device", "A device you trust is clean", "A public library kiosk", "Any phone nearby"],
        answer: 1,
        explain: "Changing a password on a compromised device just hands over the new one.",
      },
      {
        q: "After regaining access to an account, what else must you check?",
        options: [
          "Nothing — the password is enough",
          "Active sessions, MFA devices, and recovery settings the attacker may have added",
          "Your profile photo",
          "The theme colour",
        ],
        answer: 1,
        explain: "Attackers leave behind their own recovery methods and app sessions to get back in.",
      },
      {
        q: "Why agree on a code phrase with family or teammates?",
        options: [
          "It's fun",
          "To verify urgent or unusual requests that could be impersonation or AI voice cloning",
          "To share passwords faster",
          "It replaces MFA",
        ],
        answer: 1,
        explain: "A pre-agreed phrase defeats urgent impersonation, including cloned voices.",
      },
    ],
  },
];

/**
 * Curriculum order, ranked by everyday usefulness to a typical adult
 * (frequency of the risk, potential harm, protection gained, and how
 * easily an ordinary person can act on it).
 */
const LESSON_ORDER: string[] = [
  "safe-browsing",
  "accounts",
  "shield-accounts",
  "ai-phishing",
  "devices",
  "incident-plan",
  "footprint",
  "mobile",
  "networked-devices",
  "home-wifi",
  "secure-comms",
  "workstation",
  "encrypt-backup",
  "core-four",
  "threat-landscape",
  "personal-info",
  "public-footprint",
  "smaller-trail",
  "ransomware",
  "research-data",
  "recognize-harassment",
  "respond-harassment",
];

/** Why each lesson matters right now — shown with the earned badge. */
const LESSON_URGENCY: Record<string, string> = {
  "safe-browsing":
    "Scams are the single most common way people lose money online. Fake bank, delivery, toll, tax, job, romance, and tech-support messages arrive every week, and AI now makes them read and sound convincing. Learning to stop, leave the message, and verify another way protects you more than any setting on your phone.",
  accounts:
    "Your email is the master key to almost everything else — whoever controls it can reset your other passwords. Turning on multifactor authentication and using unique, long passwords from a password manager blocks the overwhelming majority of account takeovers, and a single reused password from an old breach is all an attacker needs.",
  "shield-accounts":
    "Attackers go straight for your highest-value accounts: email, banking, Apple/Google/Microsoft, social, health, and government. Hardening those five or six first, with passkeys or an authenticator app instead of SMS, closes the door before anyone tries it.",
  "ai-phishing":
    "A familiar name, logo, voice, or photo is no longer proof of identity. Cloned voices and deepfaked video are already being used to request urgent payments, gift cards, crypto, and verification codes. Verifying money and sensitive information through a number you look up yourself is what stops these losses.",
  devices:
    "Most successful attacks exploit a flaw that was already patched. Turning on automatic updates for your operating system, browser, and apps — and replacing devices that no longer get security updates — is the highest protection for the least ongoing effort.",
  "incident-plan":
    "Almost everyone gets a real security alert eventually, and the panicked minutes that follow decide how much damage is done. Knowing the recovery sequence in advance — never click the alert's link, check login activity, change the password, sign out other sessions, reset MFA, fix recovery contacts, call your bank — turns a disaster into an inconvenience.",
  footprint:
    "Birthdate, address, employer, travel plans, family and pet names, and old school details are exactly what scammers combine to impersonate you or answer your recovery questions. You don't need to disappear — you need to share deliberately and know who can see it.",
  mobile:
    "Most people tap 'Allow' without reading. Sticking to official app stores, checking the developer, questioning requests for contacts, microphone, camera, location, photos, or accessibility access, and deleting apps you no longer use removes spyware-style risk from your pocket.",
  "networked-devices":
    "Photos, tax records, medical files, and work documents are irreplaceable, and ransomware or a lost phone can take them all at once. A backup you actually have — cloud plus an external drive kept disconnected — is the only thing that makes those events survivable.",
  "home-wifi":
    "Your router is the front door to every device in the house. A default admin password, outdated firmware, weak encryption, or an unsupported router quietly exposes everything behind it, and unknown devices on the network can go unnoticed for years.",
  "secure-comms":
    "Sensitive conversations, logins, and files deserve the safe path: official apps and bookmarked sites, a careful look at the full web address, encrypted messaging, and caution on shared or public devices. HTTPS proves the connection is private — not that the site is honest.",
  workstation:
    "Devices get lost, stolen, borrowed, and sold. A strong PIN, automatic screen lock, find-and-erase turned on, hidden notification previews, and wiping accounts before you hand a device on keep a bad afternoon from becoming identity theft.",
  "encrypt-backup":
    "Encryption is what makes a stolen laptop, phone, or USB drive worthless to a thief. Modern devices often do it for you — but only if it's turned on, and only if you've stored your recovery key somewhere you won't lose it.",
  "core-four":
    "Four habits — strong unique passwords, multifactor authentication, prompt updates, and recognizing phishing — prevent the large majority of everyday attacks. Everything else in this curriculum builds on them.",
  "threat-landscape":
    "Knowing who might target you and why turns vague anxiety into focused action, so you spend your effort on the risks that actually apply to your job, family, and public profile.",
  "personal-info":
    "Every detail you hand over gets stored, sold, and eventually breached. Setting boundaries about what you share, and with whom, shrinks the raw material available for fraud against you.",
  "public-footprint":
    "Data brokers and search results assemble a profile of you from scattered public pieces. Trimming and monitoring it makes you a harder target for impersonation, stalking, and account recovery attacks.",
  "smaller-trail":
    "Posts, photos, and check-ins reveal patterns — where you live, when you're away, who your family is. Posting as if strangers are watching keeps ordinary sharing from becoming a targeting guide.",
  ransomware:
    "Ransomware can lock a lifetime of photos and records in seconds, and paying often fails. Prevention plus disconnected backups is the only reliable defense.",
  "research-data":
    "Proprietary, confidential, or regulated work is actively sought by criminals and competitors. Mishandling it can end projects, careers, and funding — not just files.",
  "recognize-harassment":
    "Coordinated harassment starts with recognizable tactics. Naming them early lets you document, report, and protect yourself before it escalates offline.",
  "respond-harassment":
    "In the middle of an attack there is no time to research. Having the emergency checklist ready — lock accounts, preserve evidence, report, get support — protects your safety and your record.",
};

export const lessons: Lesson[] = LESSON_ORDER.map((id): Lesson | undefined => {
  const lesson = rawLessons.find((l) => l.id === id);
  return lesson ? { ...lesson, urgency: LESSON_URGENCY[id] } : undefined;
})
  .filter((l): l is Lesson => Boolean(l))
  .concat(
    rawLessons
      .filter((l) => !LESSON_ORDER.includes(l.id))
      .map((l) => ({ ...l, urgency: LESSON_URGENCY[l.id] })),
  );

export const getLesson = (id: string) => lessons.find((l) => l.id === id);