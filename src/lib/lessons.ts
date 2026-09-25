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
  /** Authoritative references, shown in the expandable "Evidence behind this lesson" panel. */
  sources?: LessonSource[];
  /** Optional interactive exercise rendered after the lesson body. */
  interactive?: "five-door-reset";
};

export type LessonSource = {
  org: string;
  title: string;
  url: string;
  /** What this source backs up, in one short phrase. */
  note?: string;
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
      {
        heading: "Let phishing-resistant sign-in do the checking",
        body: "NIST Special Publication 800-63B calls an authenticator phishing-resistant when it is cryptographically bound to the real website address. Passkeys and security keys simply refuse to work on a lookalike domain, so even a convincing fake page gets nothing. A typed password or a six-digit code, by contrast, can be relayed to the real site by an attacker in real time — which is why 'the code arrived, so it must be legit' is not a safe assumption.",
        tips: [
          "Set up a passkey or security key wherever it's offered — it removes the judgment call.",
          "Never type a one-time code into a page you reached from a link or a phone call.",
          "If your password manager doesn't auto-fill, treat it as a domain mismatch warning.",
          "Nobody legitimate will ever ask you to read out an MFA code.",
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
      {
        q: "Why does a passkey protect you on a lookalike phishing site?",
        options: [
          "It's a longer password",
          "It's cryptographically bound to the real domain, so it won't work elsewhere",
          "It changes every 30 seconds",
          "It emails you a warning",
        ],
        answer: 1,
        explain:
          "NIST SP 800-63B calls this phishing resistance: the authenticator checks the site's real address for you, so a fake page gets nothing.",
      },
      {
        q: "Your password manager won't auto-fill on a login page you expected. What's the likely reason?",
        options: [
          "The site is faster than usual",
          "The domain doesn't match the saved entry — it may be a fake",
          "Your password expired",
          "You need to disable HTTPS",
        ],
        answer: 1,
        explain: "Auto-fill matches on exact domain, so a silent failure is a useful lookalike-domain warning.",
      },
    ],
  },

  {
    id: "device-code-phishing",
    title: "Stop Device-Code Phishing",
    emoji: "🎟️",
    tagline: "A real sign-in page can still approve the wrong device",
    intro:
      "A device code is meant to help a television, printer, or other hard-to-type-on device sign in. A criminal can start that same process on their device, then trick you into approving it. The page and code may be real; the request is not.",
    sections: [
      {
        heading: "Know the legitimate flow",
        body: "Device-code sign-in was created for devices that are difficult to type on, such as smart televisions, printers, and conference-room equipment. The device displays a short code, which you enter into a browser on another device to authorize that specific sign-in. [1, 2]",
        tips: [
          "Only enter a device code when you personally started a sign-in on a device in front of you.",
          "Match the service, device, and account shown on the approval screen to what you intended.",
          "Treat an unexpected code like an unexpected login approval: do not enter or approve it.",
        ],
      },
      {
        heading: "See how criminals reverse it",
        body: "In device-code phishing, the criminal—not your device—starts the sign-in. They send you their code and may direct you to the service's genuine website. If you enter that code and approve access, you can authorize the criminal's session even though the web address is real. [3]",
        tips: [
          "Pause when anyone sends you a code or asks you to open a device sign-in page.",
          "Do not trust a request just because it uses a genuine Microsoft or other provider page.",
          "Leave the message and verify through a contact method you already know.",
          "Never enter a code to prove your identity to an incoming caller, texter, or chat participant.",
        ],
      },
      {
        heading: "Recognize why this matters now",
        body: "Microsoft linked the AI-enabled EvilTokens service to more than 12,000 compromised inboxes across over 10,000 organizations. Attackers used stolen access to study email, identify financial relationships, and prepare impersonation and payment-redirection fraud. [3, 4]",
        tips: [
          "Warn coworkers if a message asks them to enter a device code on someone else's behalf.",
          "Report unusual device-code requests through your organization's security channel.",
          "Be especially cautious when the request is tied to a meeting, document, payment, or urgent account problem.",
        ],
      },
      {
        heading: "Recover beyond the password",
        body: "If you entered an unsolicited device code, changing your password may not end the criminal's authorized session. Contact your organization's IT or security team immediately so they can revoke active sessions and refresh tokens, inspect registered devices and inbox rules, and temporarily disable the account when necessary. [3]",
        tips: [
          "From a trusted device, change the password and review recent sign-in activity.",
          "Sign out other sessions and remove devices or connected apps you do not recognize.",
          "Check for new email-forwarding rules, inbox rules, delegates, or recovery methods.",
          "Tell your workplace or email provider exactly what happened: you entered an unsolicited device code.",
        ],
      },
    ],
    sources: [
      {
        org: "Microsoft Learn",
        title: "OAuth 2.0 device authorization grant",
        url: "https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-device-code",
        note: "How legitimate device-code sign-in works.",
      },
      {
        org: "Internet Engineering Task Force",
        title: "RFC 8628 — OAuth 2.0 Device Authorization Grant",
        url: "https://datatracker.ietf.org/doc/html/rfc8628",
        note: "The underlying standard, including remote-phishing safeguards in Section 5.4.",
      },
      {
        org: "Microsoft Security",
        title: "Unmasking EvilTokens: Getting to the root of device code phishing",
        url: "https://www.microsoft.com/en-us/security/blog/2026/09/22/unmasking-eviltokens-getting-to-the-root-of-device-code-phishing/",
        note: "Attack method, observed scale, and incident-response guidance.",
      },
      {
        org: "Microsoft Digital Crimes Unit",
        title: "Disrupting EvilTokens: The AI chatbot built for cybercrime",
        url: "https://blogs.microsoft.com/on-the-issues/2026/09/22/disrupting-eviltokens-the-ai-chatbot-built-for-cybercrime/",
        note: "Evidence of the campaign's reach and criminal use.",
      },
    ],
    quiz: [
      {
        q: "When is it appropriate to enter a device code?",
        options: [
          "Whenever a coworker sends one",
          "Only when you personally started sign-in on a device in front of you",
          "Whenever the code opens a real Microsoft page",
          "When a caller says it will verify your identity",
        ],
        answer: 1,
        explain: "A device code should complete a sign-in you intentionally started on a device you control—not a request someone sent you.",
      },
      {
        q: "Why can device-code phishing work even on a genuine sign-in website?",
        options: [
          "The website secretly disables encryption",
          "Entering the criminal's code can authorize the session they started",
          "Every device code reveals your password",
          "The browser automatically shares your inbox",
        ],
        answer: 1,
        explain: "The website can be genuine while the transaction is wrong: the code belongs to a sign-in initiated on the criminal's device.",
      },
      {
        q: "Someone unexpectedly sends you a device code and asks you to enter it. What should you do?",
        options: [
          "Enter it, then ask why",
          "Forward it to a friend to test",
          "Do not enter it; leave the message and verify independently",
          "Approve it if the sender knows your name",
        ],
        answer: 2,
        explain: "An unsolicited code is an unexpected login approval. Pause, leave the message, and verify through a channel you already trust.",
      },
      {
        q: "You entered an unsolicited device code. Is changing the password enough?",
        options: [
          "Always",
          "No—report it, revoke active sessions and tokens, and inspect devices and inbox rules",
          "Yes, if you wait 24 hours",
          "No, but deleting your browser history fixes it",
        ],
        answer: 1,
        explain: "The criminal may already hold an authorized session. Recovery must remove that access and check for changes they made inside the account.",
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
        heading: "Watch for breaches — a smoke detector, not a certificate",
        body: "Have I Been Pwned lets you check whether an email address appears in known breach data. Two things worth knowing: finding your email in a breach does not automatically mean someone currently controls your account, and not finding it does not prove your information has never been exposed. Think of a breach-checking tool as a smoke detector, not a certificate that everything is safe.",
        tips: [
          "Subscribe to breach notifications so you hear about new leaks early.",
          "If a breached password was reused anywhere, change those accounts first.",
          "Turn on breach monitoring in your password manager or browser too.",
          "Make WHOIS info private if you own a domain.",
        ],
      },
    ],
    quiz: [
      {
        q: "Your email appears in a known data breach. What does this definitely mean?",
        options: [
          "Criminals currently control your email",
          "Information associated with your email appeared in known breach data",
          "Your bank account has been compromised",
          "You must delete your email account",
        ],
        answer: 1,
        explain:
          "It means your address showed up in a leaked dataset — useful early warning, not proof of a takeover. Prioritize changing any password you reused elsewhere.",
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
    tagline: "Unique. Layered. Recoverable.",
    intro:
      "Good digital hygiene means building a few protective habits that stay useful even as the technology changes. For accounts, the whole idea fits into three words. Unique: important accounts don't share a password. Layered: use the strongest practical sign-in the service offers. Recoverable: keep a safe way for you — the real owner — to get back in.",
    sections: [
      {
        heading: "One account. One lock.",
        body: "Reusing a password means a break-in somewhere unimportant can become a problem somewhere that matters. Criminals use automated systems to try stolen email-and-password combinations on other websites — this is called credential stuffing. So a password exposed at one company can threaten your other accounts if you reused it. The fix isn't heroic: it's one lock per door.",
        tips: [
          "Give every important account a credential used nowhere else.",
          "Where a service offers a passkey, consider it instead of relying only on a reusable password.",
          "Adding a “1” or “!” to the end does not make it a different password.",
          "Start with email, banking, and your password manager — then work outward.",
        ],
      },
      {
        heading: "Long. Unique. Never reused.",
        body: "Password strength is mostly about length and uniqueness, not about forcing in an uppercase letter, a digit, and a symbol. Composition rules push people toward predictable patterns, and calendar-based changes every 30, 60, or 90 days mostly produce a bumped number on the end. Current NIST guidance asks services to drop both, and to screen new passwords against lists of previously breached ones instead.",
        tips: [
          "If you create a password yourself, make it long and unique — aim for at least 15 characters.",
          "A passphrase of several unrelated words is easy to remember and long by nature.",
          "Change a password when there's a reason — suspected compromise, a breach notice, or a policy that requires it — not on a schedule.",
          "Skip security questions where you can, or answer them with random text stored in your password manager.",
        ],
      },
      {
        heading: "What a password manager actually does",
        body: "A password manager generates and stores different passwords for your accounts so you do not have to memorize dozens of unrelated passwords. For most accounts, letting a reputable manager generate a long, random, unique password is easier and safer than inventing one yourself. It also fills passwords only on the matching website, which quietly catches some lookalike pages.",
        tips: [
          "Look for one that works across your devices and generates unique passwords.",
          "It should support secure sync, MFA on the vault itself, and passkeys where available.",
          "Check that its recovery options make sense to you before you rely on it.",
          "The best one is the one you will realistically use every day.",
        ],
      },
      {
        heading: "What is a passkey?",
        body: "A passkey lets your device prove that you are authorized to enter an account without requiring you to type a reusable password into the website. You may unlock a passkey using your fingerprint, face, device PIN, or another device-level method. Passkeys are designed to resist many common phishing attacks, because the important credential is tied to the legitimate service rather than something you type into a convincing fake login page. Passwords haven't disappeared — most of us live in a mixed environment of passwords, password managers, passkeys, authenticator apps, device approvals, security keys, and SMS codes.",
        tips: [
          "Hygi Habit: if an important account offers a passkey, don't dismiss it just because it's unfamiliar — read what the service is offering and decide whether it suits you.",
          "Keep a screen lock on any device that holds passkeys.",
          "Set up a second sign-in method so a lost device doesn't lock you out.",
          "A passkey is not just another password — there is nothing reusable to type or hand over.",
        ],
      },
      {
        heading: "The MFA ladder: pick the strongest practical rung",
        body: "Strongest practical protection: passkeys or FIDO/WebAuthn security keys — these are designed to resist phishing because authentication is connected to the legitimate service. Strong: authenticator apps and secure device-approval methods — substantially more protection than a password alone, though manually entered one-time codes can still be stolen through phishing. Better than a password alone: SMS/text verification — real protection compared with password-only login, but more vulnerable than phishing-resistant methods. If a stronger practical method is offered, consider using it.",
        tips: [
          "Turn on the strongest option each service actually supports.",
          "Never turn SMS codes off if the alternative is password-only sign-in.",
          "Manually typed authenticator codes are strong, but they are not phishing-resistant.",
          "No method makes an account unhackable — layers reduce risk substantially, and that's the goal.",
        ],
      },
      {
        heading: "A verification code is a key.",
        body: "A code sent to you is for you to enter — not for a stranger to collect. Say you get a call claiming to be from your bank, and during the call a six-digit code appears on your phone; the caller asks you to read it aloud. That is the moment to stop. Do not provide the code. End the incoming communication and contact the bank yourself using a number or app you already trust. Pause. Leave the message. Verify.",
        tips: [
          "Only enter a code into a page or app you opened yourself.",
          "No legitimate representative needs you to read a code back to them.",
          "If a login-approval prompt appears and you did not start a login, do not approve it just to make it stop.",
          "Repeated unexpected prompts (MFA fatigue) usually mean someone has your password — change it from a trusted device.",
        ],
      },
      {
        heading: "Your master key account",
        body: "Your primary email account may be used to reset passwords for many other services. That makes it one of the most important accounts to protect. Your primary email password should never be reused anywhere else.",
        tips: [
          "Give it a unique credential, and add a passkey if the provider offers one and it suits you.",
          "Turn on the strongest MFA it supports.",
          "Keep the recovery phone and recovery email current, and save any recovery codes it offers.",
          "Read unexpected sign-in alerts instead of dismissing them — check the account through the app, not the alert's link.",
        ],
      },
    ],
    interactive: "five-door-reset",
    sources: [
      {
        org: "NIST",
        title: "SP 800-63B-4: Digital Identity Guidelines — Authentication and Authenticator Management (July 2025)",
        url: "https://pages.nist.gov/800-63-4/sp800-63b.html",
        note: "Password length over composition rules, no scheduled changes, breach blocklists, phishing resistance, authenticator and recovery management.",
      },
      {
        org: "NIST",
        title: "Cybersecurity consumer guidance: passwords, password managers, passkeys and MFA",
        url: "https://www.nist.gov/cybersecurity",
        note: "Plain-language consumer framing for long passwords, managers and multifactor sign-in.",
      },
      {
        org: "CISA",
        title: "Implementing Phishing-Resistant MFA",
        url: "https://www.cisa.gov/sites/default/files/publications/fact-sheet-implementing-phishing-resistant-mfa-508c.pdf",
        note: "Relative strength of FIDO/WebAuthn, authenticator apps and SMS.",
      },
      {
        org: "CISA",
        title: "Secure Our World — Use Strong Passwords and Turn On MFA",
        url: "https://www.cisa.gov/secure-our-world",
        note: "The consumer habits this lesson is built around.",
      },
    ],
    quiz: [
      {
        q: "Your bank offers these authentication choices. Which provides the strongest protection against traditional phishing?",
        options: [
          "Password only",
          "Password + SMS code",
          "Password + manually entered authenticator code",
          "A passkey or FIDO security key",
        ],
        answer: 3,
        explain:
          "Passkeys and FIDO security keys are designed to provide phishing-resistant authentication. SMS and authenticator codes still provide important protection, but they can be vulnerable to some forms of phishing.",
      },
      {
        q: "You receive an unexpected call claiming to be from your bank. A six-digit verification code appears on your phone, and the caller asks you to read it aloud. What should you do?",
        options: [
          "Read the code, because the bank sent it",
          "Give only the first three digits",
          "End the call and contact the bank through a trusted channel",
          "Ask the caller to tell you your account number first",
        ],
        answer: 2,
        explain:
          "A verification code is a key. Don't give unexpected callers verification codes. Pause, leave the communication, and verify independently.",
      },
      {
        q: "If you're creating a password yourself, what matters most?",
        options: [
          "A mix of uppercase, symbols, and digits",
          "Making it long and unique — aim for at least 15 characters",
          "Changing it every 90 days",
          "A memorable hint saved alongside it",
        ],
        answer: 1,
        explain:
          "Length and uniqueness carry the weight. Current NIST guidance asks services to drop forced composition rules, which push people toward predictable patterns.",
      },
      {
        q: "Which statement about SMS text codes is accurate?",
        options: [
          "SMS is the strongest form of MFA",
          "SMS is useless and should be switched off",
          "SMS is better than password-only login, but weaker than phishing-resistant methods",
          "SMS codes cannot be phished",
        ],
        answer: 2,
        explain:
          "Text codes add real protection over a password alone. If the service offers something stronger and practical, prefer it — but don't disable SMS if the alternative is no second factor at all.",
      },
      {
        q: "Why is your primary email described as your “master key account”?",
        options: [
          "It stores your passwords",
          "It can be used to reset the passwords of many other services",
          "It's the only account with encryption",
          "Email providers never get breached",
        ],
        answer: 1,
        explain:
          "Password resets usually land in email, so whoever controls that inbox can reach a lot of other accounts. Give it a unique credential, the strongest practical MFA, and current recovery details.",
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
    id: "ai-agents-guardrails",
    title: "AI Agents Need Guardrails",
    emoji: "🧱",
    tagline: "Limit, approve, observe, revoke",
    intro:
      "A chatbot mainly gives you information. An AI agent can also take actions — reading files, sending messages, changing code, making purchases, or using connected accounts. The more an AI can access and act, the more carefully you must limit its permissions. [1, 2]",
    sections: [
      {
        heading: "Access turns answers into actions",
        body: "The important difference is authority. A normal chat cannot independently enter your accounts. Risk rises when an agent receives tools, credentials, internet access, or permission to act. In 2026, Anthropic documented four incidents in specially configured cybersecurity evaluations where models reached real external systems after an isolation failure. These were research environments running without ordinary safeguards — not everyday chatbot conversations escaping on their own. [1]",
        tips: [
          "Ask what the agent can read, change, send, buy, or delete.",
          "Treat every connected account as a real permission, not a convenience toggle.",
          "A claim such as 'read-only' does not make broad access necessary or harmless.",
        ],
      },
      {
        heading: "Use four guardrails",
        body: "Use one rule whenever an AI can act: limit, approve, observe, revoke. OWASP identifies excessive autonomy, tool abuse, and high-impact actions without human oversight as agent risks. Its guidance calls for least privilege, explicit approval for consequential actions, monitoring, and a way to stop an agent. [2, 3]",
        tips: [
          "Limit: give access only to the files, accounts, and permissions needed now.",
          "Approve: require confirmation before sending, publishing, purchasing, deleting, deploying, or changing an account.",
          "Observe: review logs, sent messages, purchases, and account changes.",
          "Revoke: disconnect the agent and remove temporary access when the task ends.",
        ],
      },
      {
        heading: "Share the receipt folder — not your digital life",
        body: "Suppose an agent organizing travel receipts asks for your entire email account, cloud drive, calendar, and payment information. Do not grant broad access. Put copies of the relevant receipts in a separate folder and share only that folder. The safest permission is the smallest one that can complete the task. A 2026 NIST NCCoE draft concept paper identifies least-privilege authorization for software and AI agents as an important open challenge. [4]",
        tips: [
          "Do not connect a primary financial account for a receipt-organizing task.",
          "Do not let the agent send messages or make purchases when the task needs neither.",
          "Use a separate folder or temporary workspace when possible.",
          "Remove access after checking the finished work.",
        ],
      },
      {
        heading: "Keep high-impact accounts behind stronger boundaries",
        body: "Some connections can expose money, identity, health information, recovery access, or an entire organization. Do not connect them without narrow permissions, clear approval points, activity records, and a tested way to disconnect access. [2, 3]",
        tips: [
          "Banking and payment accounts",
          "Password managers and primary email",
          "Health portals and cloud-administrator accounts",
          "Domain registrars and work systems containing personal or confidential information",
        ],
      },
    ],
    sources: [
      {
        org: "Anthropic",
        title: "An alignment assessment of recent cybersecurity incidents",
        url: "https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents",
        note: "Published September 9, 2026. Four incidents in specially configured cybersecurity evaluations and their context.",
      },
      {
        org: "OWASP Foundation",
        title: "AI Agent Security Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html",
        note: "Least privilege, human oversight, monitoring, tool controls, and excessive autonomy risks.",
      },
      {
        org: "OWASP Foundation",
        title: "AI Security Verification Standard — Orchestration and Agentic Action",
        url: "https://github.com/OWASP/AISVS/blob/main/1.0/en/0x10-C09-Orchestration-and-Agentic-Action.md",
        note: "Approval controls, reversibility, interruption, and high-impact agent actions.",
      },
      {
        org: "NIST National Cybersecurity Center of Excellence",
        title: "Accelerating the Adoption of Software and AI Agent Identity and Authorization",
        url: "https://www.nccoe.nist.gov/sites/default/files/2026-02/accelerating-the-adoption-of-software-and-ai-agent-identity-and-authorization-concept-paper.pdf",
        note: "Initial public draft, February 5, 2026. Agent identity, authorization, and least-privilege challenges.",
      },
    ],
    quiz: [
      {
        q: "An AI agent asks for full access to your email so it can find one document. What is safest?",
        options: [
          "Grant access because the agent says it is read-only",
          "Grant access and check the account afterward",
          "Put the document in a separate folder and share only that folder",
          "Give it your password temporarily",
        ],
        answer: 2,
        explain: "Read-only access can still expose far more than the task requires. Share only the specific document or folder.",
      },
      {
        q: "Which action should always require your approval?",
        options: [
          "Renaming files in a temporary practice folder",
          "Sending a message, making a purchase, or deleting data",
          "Sorting a list you already copied into the chat",
          "Drafting a checklist without connected tools",
        ],
        answer: 1,
        explain: "Externally visible, financial, destructive, and account-changing actions need explicit human approval.",
      },
      {
        q: "What does 'revoke' mean in the Hygi guardrail rule?",
        options: [
          "Give the agent more permissions if it works well",
          "Delete every file the agent used",
          "Disconnect the agent and remove temporary access when the task ends",
          "Trust the agent to disconnect itself",
        ],
        answer: 2,
        explain: "Temporary access should end with the temporary task. Disconnect it and confirm the permission is gone.",
      },
      {
        q: "Which set correctly states the four guardrails?",
        options: [
          "Connect, automate, ignore, repeat",
          "Limit, approve, observe, revoke",
          "Download, delegate, delete, deny",
          "Ask, trust, share, save",
        ],
        answer: 1,
        explain: "Limit access, approve important actions, observe activity, and revoke access after the task.",
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
    title: "Lock Down Account Access",
    emoji: "🗝️",
    tagline: "A login can be strong while recovery is weak",
    intro:
      "Protecting your accounts is about how you prove who you are. This lesson is about everything that surrounds that: recovery details, saved sessions, old devices, connected apps, and dormant accounts. A login can be strong while the recovery process is weak — and attackers know it.",
    sections: [
      {
        heading: "Strong locks need a safe spare key",
        body: "Strong security should not accidentally leave the legitimate account owner permanently locked out. Recovery codes are emergency spare keys: store them somewhere secure that you could still reach if your primary device were unavailable. There's no single right place for everyone — a password manager, a printed copy in a safe, or a locked drawer can all work, as long as it isn't inside the account they unlock.",
        tips: [
          "Ask yourself: is my recovery phone number still correct, and is my recovery email still accessible?",
          "Is that recovery email itself protected with a unique credential and strong MFA?",
          "Did this service give me backup or recovery codes — and do I know where they are?",
          "What happens if I lose my phone? Register a second method, or a backup security key, before you need it.",
        ],
      },
      {
        heading: "Sessions, devices, and connected apps",
        body: "Most services keep a list of everywhere you're currently signed in, plus every app you once granted access. Old laptops, borrowed tablets, and forgotten third-party tools stay logged in long after you've moved on.",
        tips: [
          "Review active sessions and sign out anything you don't recognize.",
          "Remove devices you no longer own or use.",
          "Revoke third-party apps and permissions you no longer need.",
          "Check for unfamiliar activity — new logins, new locations, changed settings.",
        ],
      },
      {
        heading: "Close the side doors",
        body: "A few quiet settings can hand over your account without touching your password. Email forwarding rules can copy your mail elsewhere. A phone number taken over in a SIM swap can intercept text codes and recovery calls. Dormant accounts you've forgotten can still be taken over and used against you.",
        tips: [
          "Check your email account for forwarding rules and filters you didn't create.",
          "Ask your mobile carrier to add a PIN or port-out lock to your number.",
          "Delete accounts you no longer use, especially ones tied to your main email.",
          "Where a service offers phishing-resistant sign-in, it also reduces how much rides on your phone number.",
        ],
      },
    ],
    sources: [
      {
        org: "NIST",
        title: "SP 800-63B-4: Digital Identity Guidelines — Authentication and Authenticator Management (July 2025)",
        url: "https://pages.nist.gov/800-63-4/sp800-63b.html",
        note: "Account recovery and re-binding authenticators as part of the authentication lifecycle.",
      },
      {
        org: "CISA",
        title: "Project Upskill — securing accounts and devices for high-risk individuals",
        url: "https://www.cisa.gov/audiences/high-risk-communities/project-upskill",
        note: "Sessions, connected apps, SIM-swap risk and recovery hardening.",
      },
    ],
    quiz: [
      {
        q: "Why can an account with strong MFA still be taken over?",
        options: [
          "MFA expires after a year",
          "A weak or outdated recovery path can bypass the login entirely",
          "Passwords always leak eventually",
          "Sign-in alerts turn MFA off",
        ],
        answer: 1,
        explain:
          "Recovery is a back door around your login. If someone can reset access using an old phone number or an unprotected backup email, the strength of the front door matters much less.",
      },
      {
        q: "Where should recovery codes be stored?",
        options: [
          "Inside the account they unlock",
          "Somewhere secure you could still reach if your primary device were unavailable",
          "In a public cloud album",
          "Nowhere — memorize them",
        ],
        answer: 1,
        explain:
          "Recovery codes are emergency spare keys. A password manager, a printed copy in a safe place, or another secure spot all work — as long as it isn't locked behind the very account they're for.",
      },
      {
        q: "What is a SIM swap?",
        options: [
          "Switching mobile carriers",
          "An attempt to take control of your phone number, which can affect text codes and recovery",
          "Upgrading to a new phone",
          "A type of password reset email",
        ],
        answer: 1,
        explain:
          "If someone takes over your number, text-message codes and phone-based recovery can go to them. A carrier PIN or port-out lock makes that harder.",
      },
      {
        q: "You find an email forwarding rule you didn't create. What does it suggest?",
        options: [
          "A normal provider feature",
          "Someone may have had access and set up a way to keep reading your mail",
          "Your inbox is full",
          "Your MFA is working",
        ],
        answer: 1,
        explain:
          "Unexpected forwarding rules and filters are a common leave-behind after account access. Remove them, change the password from a trusted device, and review sessions and connected apps.",
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
    id: "image-based-abuse-response",
    title: "When an Intimate Image Is Shared Without Consent",
    emoji: "🫶",
    tagline: "This is not your fault — here is what to do next",
    intro:
      "Image-based abuse happens when someone creates, shares, or threatens to share an intimate image without the depicted person's permission. It can involve a real image, a digitally altered image, an AI-generated deepfake, or something once shared privately. The abuse is not your fault, and you do not have to handle it alone. [1]",
    sections: [
      {
        heading: "First, protect your safety",
        body: "People may use intimate images for humiliation, coercive control, revenge, or financial extortion. If someone might monitor your phone, accounts, or email, use a safer device and an account they cannot access. Do not confront the person if that could put you in danger. [1]",
        tips: [
          "Move to a safer device or ask a trusted person to help if your device may be monitored.",
          "Tell someone you trust; you deserve practical and emotional support.",
          "If you face an immediate physical threat, contact local emergency services.",
          "Do not pay, send more images, or give the person access to an account or device.",
        ],
      },
      {
        heading: "Preserve only what you need",
        body: "Keep enough information to support a report without spreading the image further. Record the page URL, platform, account name, date and time, threats or demands, and later the removal-request date and confirmation number. [1]",
        tips: [
          "Save the URL, username, timestamps, and relevant messages.",
          "Keep the platform's confirmation or case number.",
          "Do not repost the image to explain what happened.",
          "Never download, forward, or redistribute an intimate image of a minor.",
        ],
      },
      {
        heading: "Report it and start the 48-hour clock",
        body: "Federal protections cover authentic intimate images, digitally altered images, and AI-generated deepfakes. Covered platforms must offer a removal process. After a valid request, the platform must remove the reported content and make reasonable efforts to remove known identical copies within 48 hours. This applies to the covered platform receiving the request; it cannot guarantee that every copy disappears from the internet. [1, 2, 3]",
        tips: [
          "Use the platform's official reporting option or help center.",
          "Choose the closest reason: nonconsensual intimate image, sexual exploitation, or AI-generated sexual content.",
          "Save the confirmation and note the exact time the platform received your request.",
          "A trusted person can report on your behalf with your permission.",
        ],
      },
      {
        heading: "Escalate when the platform does not act",
        body: "Report the platform at TakeItDown.ftc.gov if it does not remove the image and known identical copies within 48 hours, has no removal process, has a broken reporting system, or requires an account before accepting a request. The FTC portal records a platform-compliance complaint; it does not remove the image itself. [2, 3]",
        tips: [
          "For an adult depicted in the image, StopNCII.org can create a digital fingerprint to help participating platforms detect copies.",
          "If the person was under 18 when the image was taken, use NCMEC's Take It Down service and, when appropriate, the CyberTipline.",
          "These hashing tools create a digital fingerprint without requiring the image itself to leave the device.",
          "For threats or blackmail, preserve the messages, stop responding when safe, and report the conduct to law enforcement.",
        ],
      },
    ],
    sources: [
      {
        org: "Federal Trade Commission",
        title: "Image-Based Abuse: What To Know and Do",
        url: "https://consumer.ftc.gov/articles/image-based-abuse-what-know-and-do",
        note: "Published May 19, 2026. Trauma-informed response steps and help resources.",
      },
      {
        org: "Federal Trade Commission",
        title: "What will the FTC's enforcement of the TAKE IT DOWN Act mean for you?",
        url: "https://consumer.ftc.gov/consumer-alerts/2026/05/what-will-ftcs-enforcement-take-it-down-act-mean-you",
        note: "Published May 19, 2026. Coverage, the 48-hour rule, and FTC reporting.",
      },
      {
        org: "Federal Trade Commission",
        title: "Complying With the Take It Down Act",
        url: "https://www.ftc.gov/business-guidance/resources/complying-take-it-down-act",
        note: "Published May 8, 2026. Platform notice-and-removal requirements.",
      },
    ],
    quiz: [
      {
        q: "Someone posts an AI-generated intimate image that falsely depicts you. What should you do first?",
        options: ["Pay the person to remove it", "Publicly repost it to explain that it is fake", "Report it to the platform and save the request confirmation", "Wait to see whether it spreads"],
        answer: 2,
        explain: "Federal protections include AI-generated deepfakes. Reporting promptly starts the platform's 48-hour response period.",
      },
      {
        q: "What information is useful to preserve without spreading the image?",
        options: ["The URL, username, timestamps, threats, and report confirmation", "Copies forwarded to several friends", "A public repost with the account tagged", "Only the person's display name"],
        answer: 0,
        explain: "URLs, account details, dates, threats, and case numbers support a report without redistributing the intimate image.",
      },
      {
        q: "A covered platform has not acted 48 hours after receiving a valid removal request. What is the next step?",
        options: ["Create a new account and post the image there", "Report the platform at TakeItDown.ftc.gov", "Pay anyone who promises instant removal", "Delete your evidence and start again"],
        answer: 1,
        explain: "TakeItDown.ftc.gov accepts reports about platforms that miss the deadline or fail to provide a working removal process.",
      },
      {
        q: "Someone threatens to share an intimate image unless you pay. Which response is safest?",
        options: ["Pay quickly before the deadline", "Send another image to show cooperation", "Preserve the threat, stop responding when safe, and seek trusted or official help", "Give them access to your account so they can delete it"],
        answer: 2,
        explain: "Paying or giving more access can deepen the abuse. Preserve the threat and bring in trusted support and law enforcement when appropriate.",
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
          "Prefer passkeys or security keys where offered; an authenticator app next; SMS still beats password-only.",
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
  "device-code-phishing",
  "accounts",
  "shield-accounts",
  "ai-phishing",
  "ai-agents-guardrails",
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
  "image-based-abuse-response",
];

/** Why each lesson matters right now — shown with the earned badge. */
const LESSON_URGENCY: Record<string, string> = {
  "safe-browsing":
    "Scams are the single most common way people lose money online. Fake bank, delivery, toll, tax, job, romance, and tech-support messages arrive every week, and AI now makes them read and sound convincing. Learning to stop, leave the message, and verify another way protects you more than any setting on your phone.",
  "device-code-phishing":
    "A genuine sign-in page is not proof that a request is safe. Device-code phishing can turn one code entry into an authorized criminal session, giving an attacker time to read email, study financial relationships, and prepare convincing fraud. Only approve device sign-ins you started yourself.",
  accounts:
    "Unique. Layered. Recoverable. Your email is the master key to almost everything else — whoever controls it can reset your other passwords. Turning on multifactor authentication and using unique, long passwords from a password manager blocks the overwhelming majority of account takeovers, and a single reused password from an old breach is all an attacker needs.",
  "shield-accounts":
    "A login can be strong while the recovery process is weak. Old recovery phone numbers, forgotten sessions, stale connected apps, and dormant accounts are how takeovers actually happen — and each one takes a minute to fix.",
  "ai-phishing":
    "A familiar name, logo, voice, or photo is no longer proof of identity. Cloned voices and deepfaked video are already being used to request urgent payments, gift cards, crypto, and verification codes. Verifying money and sensitive information through a number you look up yourself is what stops these losses.",
  "ai-agents-guardrails":
    "An AI agent can act with every permission you give it. Narrow access, human approval, activity checks, and prompt revocation keep one task from becoming broad exposure of your messages, money, files, or accounts.",
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
  "image-based-abuse-response":
    "Image-based abuse can involve a real image, an altered image, or an AI-generated deepfake, and none of it is the victim's fault. Knowing how to report safely, preserve only essential information, start the 48-hour removal process, and escalate a platform failure gives people a clear path forward when they need it most.",
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