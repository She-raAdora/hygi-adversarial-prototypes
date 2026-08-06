export type GlossaryEntry = {
  slug: string;
  term: string;
  short?: string;
  aliases?: string[];
  definition: string;
  category: GlossaryCategory;
};

export type GlossaryCategory =
  | "Scams and manipulation"
  | "Passwords and account protection"
  | "Devices and harmful software"
  | "Privacy and personal information"
  | "Internet and communication safety"
  | "AI and synthetic media"
  | "Hygi. behavioral terms";

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  "Scams and manipulation",
  "Passwords and account protection",
  "Devices and harmful software",
  "Privacy and personal information",
  "Internet and communication safety",
  "AI and synthetic media",
  "Hygi. behavioral terms",
];

function slugify(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function entry(
  category: GlossaryCategory,
  term: string,
  definition: string,
  extras?: { aliases?: string[]; short?: string },
): GlossaryEntry {
  return {
    slug: slugify(term),
    term,
    definition,
    category,
    aliases: extras?.aliases,
    short: extras?.short,
  };
}

export const glossary: GlossaryEntry[] = [
  // Scams and manipulation
  entry(
    "Scams and manipulation",
    "Phishing",
    "A deceptive email or message designed to make you click, share information, send money, or give account access.",
  ),
  entry(
    "Scams and manipulation",
    "Smishing",
    "Phishing conducted through text messages or messaging apps.",
  ),
  entry(
    "Scams and manipulation",
    "Vishing",
    "Phishing conducted through telephone or voice calls.",
  ),
  entry(
    "Scams and manipulation",
    "Social engineering",
    "Manipulating a person into revealing information or taking an unsafe action.",
  ),
  entry(
    "Scams and manipulation",
    "Impersonation scam",
    "A scam in which someone pretends to be a trusted person, company, bank, employer, or government agency.",
  ),
  entry(
    "Scams and manipulation",
    "Spoofing",
    "Making a phone number, email address, website, or sender name appear legitimate or familiar.",
  ),
  entry(
    "Scams and manipulation",
    "Urgency tactic",
    "Pressure to act immediately so that you do not stop and verify.",
  ),
  entry(
    "Scams and manipulation",
    "Verification",
    "Confirming a request through a separate, trusted method.",
  ),
  entry(
    "Scams and manipulation",
    "Suspicious link",
    "A link whose destination, sender, wording, or context may be deceptive.",
  ),
  entry(
    "Scams and manipulation",
    "QR-code scam",
    "A scam that uses a QR code to direct someone to a fraudulent site or payment request.",
    { aliases: ["quishing", "QR code scam"] },
  ),

  // Passwords and account protection
  entry(
    "Passwords and account protection",
    "Password manager",
    "A protected tool that creates, stores, and fills unique passwords.",
  ),
  entry(
    "Passwords and account protection",
    "Multifactor authentication",
    "Account protection requiring more than one form of proof that you are the authorized user.",
    { aliases: ["MFA"] },
  ),
  entry(
    "Passwords and account protection",
    "Two-factor authentication",
    "A form of MFA that uses two authentication methods.",
    { aliases: ["2FA"] },
  ),
  entry(
    "Passwords and account protection",
    "Passkey",
    "A sign-in method that uses the security of your device instead of a traditional password.",
  ),
  entry(
    "Passwords and account protection",
    "Authenticator app",
    "An app that generates or approves sign-in codes.",
  ),
  entry(
    "Passwords and account protection",
    "Verification code",
    "A temporary code used to confirm a login, payment, or identity.",
  ),
  entry(
    "Passwords and account protection",
    "One-time password",
    "A temporary sign-in code that should generally never be shared with another person.",
    { aliases: ["OTP"] },
  ),
  entry(
    "Passwords and account protection",
    "Recovery code",
    "A backup code used when a normal MFA method is unavailable.",
  ),
  entry(
    "Passwords and account protection",
    "Security key",
    "A physical device used to verify account access.",
  ),
  entry(
    "Passwords and account protection",
    "Account recovery",
    "The process of regaining access to an account after losing credentials or experiencing a compromise.",
  ),
  entry(
    "Passwords and account protection",
    "Compromised account",
    "An account that an unauthorized person may have accessed or controlled.",
  ),
  entry(
    "Passwords and account protection",
    "Credential stuffing",
    "Using stolen usernames and passwords from one breach to try to enter other accounts.",
  ),
  entry(
    "Passwords and account protection",
    "Password reuse",
    "Using the same or similar password for multiple accounts.",
  ),

  // Devices and harmful software
  entry(
    "Devices and harmful software",
    "Malware",
    "Software designed to damage, spy on, disrupt, or gain unauthorized access to a device.",
  ),
  entry(
    "Devices and harmful software",
    "Ransomware",
    "Malware that locks or encrypts information and demands payment.",
  ),
  entry(
    "Devices and harmful software",
    "Spyware",
    "Software that secretly collects information about a person or device.",
  ),
  entry(
    "Devices and harmful software",
    "Virus",
    "Malicious software that can copy itself or spread between files and devices.",
  ),
  entry(
    "Devices and harmful software",
    "Software update",
    "A change that may repair security weaknesses, fix problems, or add features.",
  ),
  entry(
    "Devices and harmful software",
    "Security patch",
    "An update specifically intended to fix a security vulnerability.",
  ),
  entry(
    "Devices and harmful software",
    "Automatic updates",
    "A setting that allows security and software updates to install with little or no user action.",
  ),
  entry(
    "Devices and harmful software",
    "App permissions",
    "The access an app receives to features such as location, contacts, photos, camera, or microphone.",
  ),
  entry(
    "Devices and harmful software",
    "Supported device or software",
    "A product that still receives security updates from its manufacturer.",
  ),
  entry(
    "Devices and harmful software",
    "Factory reset",
    "Returning a device to its original settings and usually erasing personal information.",
  ),

  // Privacy and personal information
  entry(
    "Privacy and personal information",
    "Personal information",
    "Information that identifies or can be connected to a person.",
  ),
  entry(
    "Privacy and personal information",
    "Sensitive information",
    "Information that could cause greater harm if exposed, such as financial, health, identity, or login information.",
  ),
  entry(
    "Privacy and personal information",
    "Digital footprint",
    "The information about a person that exists because of their online activities.",
  ),
  entry(
    "Privacy and personal information",
    "Metadata",
    "Information attached to a file, photo, or message, such as time, location, device, or author.",
  ),
  entry(
    "Privacy and personal information",
    "Location services",
    "Device features that allow apps to determine or estimate where you are.",
  ),
  entry(
    "Privacy and personal information",
    "Doxxing",
    "Publishing someone's private or identifying information without permission, often to threaten or harass them.",
  ),
  entry(
    "Privacy and personal information",
    "Data broker",
    "A company that collects, combines, and sells information about people.",
  ),
  entry(
    "Privacy and personal information",
    "Tracking",
    "Collecting information about a person's online behavior across websites, apps, or devices.",
  ),
  entry(
    "Privacy and personal information",
    "Cookie",
    "A small file a website stores to remember activity, preferences, or tracking information.",
  ),
  entry(
    "Privacy and personal information",
    "Privacy settings",
    "Controls that determine what information is collected, shared, or visible to others.",
  ),
  entry(
    "Privacy and personal information",
    "Data breach",
    "An incident in which protected or private information is accessed, exposed, stolen, or lost.",
  ),

  // Internet and communication safety
  entry(
    "Internet and communication safety",
    "HTTPS",
    "A protected connection between your browser and a website. It encrypts the connection but does not prove that the website itself is trustworthy.",
  ),
  entry(
    "Internet and communication safety",
    "Encryption",
    "Converting information into a protected form that unauthorized people cannot easily read.",
  ),
  entry(
    "Internet and communication safety",
    "End-to-end encryption",
    "Communication protection intended to allow only the sender and intended recipient to read the content.",
  ),
  entry(
    "Internet and communication safety",
    "Public Wi-Fi",
    "A shared wireless network in a public place, such as an airport, cafe, or hotel.",
  ),
  entry(
    "Internet and communication safety",
    "Router",
    "The device that connects a home or office network to the internet.",
  ),
  entry(
    "Internet and communication safety",
    "Firmware",
    "Software built into hardware such as routers, cameras, and smart devices.",
  ),
  entry(
    "Internet and communication safety",
    "Virtual private network",
    "A service that encrypts internet traffic between a device and the VPN provider. It does not make someone anonymous or protect against every scam.",
    { aliases: ["VPN"] },
  ),
  entry(
    "Internet and communication safety",
    "Cloud storage",
    "Saving files on an internet-based service rather than only on a local device.",
  ),
  entry(
    "Internet and communication safety",
    "Backup",
    "An additional copy of information that can be restored if the original is lost, damaged, or encrypted.",
  ),

  // AI and synthetic media
  entry(
    "AI and synthetic media",
    "Deepfake",
    "Artificially generated or altered video, audio, or imagery made to resemble a real person or event.",
  ),
  entry(
    "AI and synthetic media",
    "Voice cloning",
    "Using technology to imitate a person's voice.",
  ),
  entry(
    "AI and synthetic media",
    "Synthetic media",
    "Audio, images, video, or text created or substantially changed using technology.",
  ),
  entry(
    "AI and synthetic media",
    "AI-generated content",
    "Material created partly or fully by an artificial-intelligence system.",
  ),
  entry(
    "AI and synthetic media",
    "AI hallucination",
    "A confident-sounding AI response containing inaccurate or invented information.",
  ),
  entry(
    "AI and synthetic media",
    "Bot",
    "An automated account or program that performs actions or communicates online.",
  ),
  entry(
    "AI and synthetic media",
    "AI chatbot",
    "Software that generates conversational responses to user prompts.",
  ),
  entry(
    "AI and synthetic media",
    "Manipulated media",
    "Real media that has been edited, removed from context, or misleadingly presented.",
  ),
  entry(
    "AI and synthetic media",
    "Reverse-image search",
    "A method of searching for where an image has previously appeared online.",
  ),
  entry(
    "AI and synthetic media",
    "Content provenance",
    "Information about where digital content came from and how it may have been created or edited.",
  ),

  // Hygi. behavioral terms
  entry(
    "Hygi. behavioral terms",
    "Pause-and-verify",
    "Stopping before acting and confirming a request through a trusted second method.",
  ),
  entry(
    "Hygi. behavioral terms",
    "Trusted channel",
    "A communication method independently known to belong to the person or organization.",
  ),
  entry(
    "Hygi. behavioral terms",
    "Emotional trigger",
    "Fear, excitement, affection, shame, or urgency used to influence a decision.",
  ),
  entry(
    "Hygi. behavioral terms",
    "Digital boundary",
    "A personal rule that limits unwanted access, contact, tracking, pressure, or disclosure.",
  ),
  entry(
    "Hygi. behavioral terms",
    "Risk signal",
    "A clue suggesting that a message, request, account, or situation may be unsafe.",
  ),
  entry(
    "Hygi. behavioral terms",
    "Protective friction",
    "A deliberate extra step that slows an important decision and helps prevent mistakes.",
  ),
  entry(
    "Hygi. behavioral terms",
    "Recovery plan",
    "A prepared set of actions for responding to account theft, scams, lost devices, or exposed information.",
  ),
];

export const glossaryBySlug = new Map(glossary.map((g) => [g.slug, g]));

const lookupIndex = new Map<string, GlossaryEntry>();
for (const g of glossary) {
  lookupIndex.set(g.term.toLowerCase(), g);
  lookupIndex.set(g.slug, g);
  for (const alias of g.aliases ?? []) {
    lookupIndex.set(alias.toLowerCase(), g);
    lookupIndex.set(slugify(alias), g);
  }
}

/** Find a glossary entry by term, alias, or slug (case-insensitive). */
export function findGlossaryEntry(key: string): GlossaryEntry | undefined {
  return lookupIndex.get(key.toLowerCase()) ?? lookupIndex.get(slugify(key));
}
