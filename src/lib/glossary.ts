export type GlossaryEntry = {
  slug: string;
  term: string;
  short?: string;
  aliases?: string[];
  /** "What it means" — the plain-language definition. */
  definition: string;
  /** A concrete, everyday example. */
  example: string;
  /** The action a reader should take. */
  todo: string;
  /** The one caution that prevents the common mistake. */
  important: string;
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

type Parts = {
  definition: string;
  example: string;
  todo: string;
  important: string;
  aliases?: string[];
  short?: string;
};

function entry(category: GlossaryCategory, term: string, parts: Parts): GlossaryEntry {
  return {
    slug: slugify(term),
    term,
    definition: parts.definition,
    example: parts.example,
    todo: parts.todo,
    important: parts.important,
    category,
    aliases: parts.aliases,
    short: parts.short,
  };
}

export const glossary: GlossaryEntry[] = [
  // Scams and manipulation
  entry("Scams and manipulation", "Phishing", {
    definition:
      "A deceptive email or message designed to make you click, share information, send money, or give account access.",
    example: "An “unpaid delivery fee” text with a link to a page that looks like the post office.",
    todo: "Don't tap links in unexpected messages — open the company's app or type its address yourself.",
    important: "Real companies never ask for your password or a login code by message.",
  }),
  entry("Scams and manipulation", "Smishing", {
    definition: "Phishing conducted through text messages or messaging apps.",
    example: "A text claiming your bank card is locked, with a shortened link to “unlock” it.",
    todo: "Delete it and call the number printed on the back of your card instead.",
    important: "A familiar sender name or number can be faked, so it proves nothing.",
  }),
  entry("Scams and manipulation", "Vishing", {
    definition: "Phishing conducted through telephone or voice calls.",
    example:
      "A caller claiming to be “tech support” who asks you to install remote-access software.",
    todo: "Hang up and call the organization back on a number you look up yourself.",
    important: "No legitimate company asks for remote control of your device out of the blue.",
  }),
  entry("Scams and manipulation", "Social engineering", {
    definition: "Manipulating a person into revealing information or taking an unsafe action.",
    example: "Someone posing as a new coworker who needs a shared password “quickly”.",
    todo: "Verify who you are talking to through a channel you already trust before acting.",
    important: "Pressure plus secrecy is the pattern to watch for, whatever the story.",
  }),
  entry("Scams and manipulation", "Impersonation scam", {
    definition:
      "A scam in which someone pretends to be a trusted person, company, bank, employer, or government agency.",
    example: "“Mom, I lost my phone — this is my new number, can you help me pay something?”",
    todo: "Contact the real person or company on their known number before sending anything.",
    important: "Requests for gift cards, wire transfers, or crypto are almost always fraud.",
  }),
  entry("Scams and manipulation", "Spoofing", {
    definition:
      "Making a phone number, email address, website, or sender name appear legitimate or familiar.",
    example: "Caller ID showing your bank's real customer-service number during a scam call.",
    todo: "Treat caller ID, sender names, and reply addresses as unverified and check separately.",
    important: "Seeing the correct name or number is not evidence that the contact is real.",
  }),
  entry("Scams and manipulation", "Urgency tactic", {
    definition: "Pressure to act immediately so that you do not stop and verify.",
    example: "“Your account will be closed in 30 minutes unless you confirm now.”",
    todo: "Give yourself five minutes and one verification call before doing anything.",
    important: "Genuine organizations always leave you time to check.",
  }),
  entry("Scams and manipulation", "Verification", {
    definition: "Confirming a request through a separate, trusted method.",
    example: "Calling the number on the back of your card instead of the one in the message.",
    todo: "Save official phone numbers and app logins now, before you need them.",
    important: "Never verify using contact details supplied in the suspicious message itself.",
  }),
  entry("Scams and manipulation", "Suspicious link", {
    definition: "A link whose destination, sender, wording, or context may be deceptive.",
    example: "A login page at “paypa1-secure.com” instead of the real domain.",
    todo: "Long-press or hover to preview the real destination before opening it.",
    important: "Shortened links and QR codes hide where you are actually going.",
  }),
  entry("Scams and manipulation", "QR-code scam", {
    definition:
      "A scam that uses a QR code to direct someone to a fraudulent site or payment request.",
    example: "A sticker placed over the genuine QR code on a parking meter.",
    todo: "Prefer typing the official address or using the official app to pay.",
    important: "Read the address preview before continuing, and never pay via a QR you didn't expect.",
    aliases: ["quishing", "QR code scam"],
  }),

  // Passwords and account protection
  entry("Passwords and account protection", "Password manager", {
    definition: "A protected tool that creates, stores, and fills unique passwords.",
    example: "The manager generating and filling a 20-character password you never have to recall.",
    todo: "Set one up and move your email, banking, and cloud passwords into it first.",
    important: "Protect it with one strong passphrase plus MFA, and never share that passphrase.",
  }),
  entry("Passwords and account protection", "Multifactor authentication", {
    definition:
      "A login method requiring more than one kind of proof that you are the authorized user.",
    example: "Entering your password and then approving the login through an authenticator app.",
    todo: "Turn it on first for your email, financial, social-media, and cloud accounts.",
    important: "Never give an unexpected login code to someone who contacts you.",
    aliases: ["MFA"],
  }),
  entry("Passwords and account protection", "Two-factor authentication", {
    definition: "A form of MFA that uses two authentication methods.",
    example: "Your password plus a rotating six-digit code from an app.",
    todo: "Choose an app or security key over text-message codes when the site offers both.",
    important: "Text-message codes can be stolen through SIM-swap fraud.",
    aliases: ["2FA"],
  }),
  entry("Passwords and account protection", "Passkey", {
    definition:
      "A sign-in method that uses the security of your device instead of a traditional password.",
    example: "Signing in with your fingerprint or face instead of typing anything.",
    todo: "Enable passkeys wherever they are offered, starting with your email account.",
    important: "Keep a device lock and a backup sign-in method in case you lose the device.",
  }),
  entry("Passwords and account protection", "Authenticator app", {
    definition: "An app that generates or approves sign-in codes.",
    example: "A six-digit code that changes every thirty seconds.",
    todo: "Install one, then enable its backup so a lost phone doesn't lock you out.",
    important: "No support agent ever needs you to read a code from this app aloud.",
  }),
  entry("Passwords and account protection", "Verification code", {
    definition: "A temporary code used to confirm a login, payment, or identity.",
    example: "“Your verification code is 481920.”",
    todo: "Only enter a code on a page or app you opened yourself.",
    important: "A code you didn't request means someone has your password — change it now.",
  }),
  entry("Passwords and account protection", "One-time password", {
    definition:
      "A temporary sign-in code that should generally never be shared with another person.",
    example: "A code texted to you while paying online.",
    todo: "Use it immediately, then let it expire.",
    important: "Never read it out to anyone, including someone claiming to be support.",
    aliases: ["OTP"],
  }),
  entry("Passwords and account protection", "Recovery code", {
    definition: "A backup code used when a normal MFA method is unavailable.",
    example: "The list of ten one-use codes shown when you first switch on MFA.",
    todo: "Save them in your password manager or print them and store them somewhere safe.",
    important: "They work like passwords, so never email them or store them in shared albums.",
  }),
  entry("Passwords and account protection", "Security key", {
    definition: "A physical device used to verify account access.",
    example: "A small USB or tap-to-approve key you use when signing in.",
    todo: "Register two keys: one for daily use and one kept in a safe place.",
    important: "This is the strongest anti-phishing option, but keep the spare separate.",
  }),
  entry("Passwords and account protection", "Account recovery", {
    definition:
      "The process of regaining access to an account after losing credentials or experiencing a compromise.",
    example: "Using a backup email address to get back into a locked account.",
    todo: "Check that the recovery email and phone number on your key accounts are current.",
    important: "Attackers target recovery options first, so protect them as carefully as passwords.",
  }),
  entry("Passwords and account protection", "Compromised account", {
    definition: "An account that an unauthorized person may have accessed or controlled.",
    example: "Messages in your sent folder that you never wrote.",
    todo: "From a trusted device, change the password, sign out all sessions, and turn on MFA.",
    important: "Also check for new email forwarding rules and connected apps left behind.",
  }),
  entry("Passwords and account protection", "Credential stuffing", {
    definition:
      "Using stolen usernames and passwords from one breach to try to enter other accounts.",
    example: "An old leaked password still unlocking your shopping account years later.",
    todo: "Give every account its own unique password.",
    important: "One reused password can expose dozens of accounts at once.",
  }),
  entry("Passwords and account protection", "Password reuse", {
    definition: "Using the same or similar password for multiple accounts.",
    example: "The same password on your email and on an old forum that was breached.",
    todo: "Replace reused passwords on email, banking, and cloud storage first.",
    important: "Adding a “1” or “!” to the end does not make it a different password.",
  }),

  // Devices and harmful software
  entry("Devices and harmful software", "Malware", {
    definition:
      "Software designed to damage, spy on, disrupt, or gain unauthorized access to a device.",
    example: "A “free video player” download that quietly installs something else.",
    todo: "Install apps only from official stores and keep automatic updates switched on.",
    important: "Pop-ups warning that your device is infected are usually the scam itself.",
  }),
  entry("Devices and harmful software", "Ransomware", {
    definition: "Malware that locks or encrypts information and demands payment.",
    example: "Your files renamed and a payment note left on the screen.",
    todo: "Keep a backup that is disconnected or version-protected so you can restore instead of pay.",
    important: "Paying often does not return your files — disconnect and report it.",
  }),
  entry("Devices and harmful software", "Spyware", {
    definition: "Software that secretly collects information about a person or device.",
    example: "An app logging what you type or where you go without telling you.",
    todo: "Review installed apps and their permissions, and remove anything you don't use.",
    important: "Sudden battery drain, heat, or data use can be an early signal.",
  }),
  entry("Devices and harmful software", "Virus", {
    definition: "Malicious software that can copy itself or spread between files and devices.",
    example: "An unexpected attachment that infects shared documents once opened.",
    todo: "Keep built-in protection enabled and don't open attachments you weren't expecting.",
    important: "A document asking you to “enable content or macros” is a red flag.",
  }),
  entry("Devices and harmful software", "Software update", {
    definition: "A change that may repair security weaknesses, fix problems, or add features.",
    example: "Your phone or laptop offering a new system version.",
    todo: "Install it promptly, or switch on automatic updates so you don't have to decide.",
    important: "Only update from system settings or the official store — never from a pop-up link.",
  }),
  entry("Devices and harmful software", "Security patch", {
    definition: "An update specifically intended to fix a security vulnerability.",
    example: "An emergency browser update released after a flaw is found.",
    todo: "Restart your device when it asks, so the patch actually takes effect.",
    important: "Publicly known flaws are exploited within days, so don't postpone these.",
  }),
  entry("Devices and harmful software", "Automatic updates", {
    definition:
      "A setting that allows security and software updates to install with little or no user action.",
    example: "Your phone updating overnight while it charges.",
    todo: "Enable it for the operating system, your browser, and your apps.",
    important: "Check occasionally that it really ran — silent failures are common.",
  }),
  entry("Devices and harmful software", "App permissions", {
    definition:
      "The access an app receives to features such as location, contacts, photos, camera, or microphone.",
    example: "A flashlight app asking to read your contacts.",
    todo: "Review permissions and set location to “while using the app”.",
    important: "Grant only what the app genuinely needs to do its job.",
  }),
  entry("Devices and harmful software", "Supported device or software", {
    definition: "A product that still receives security updates from its manufacturer.",
    example: "An older phone that no longer gets any system updates.",
    todo: "Check the vendor's support end date before buying or keeping a device.",
    important: "An unsupported device stays vulnerable forever, no matter how careful you are.",
  }),
  entry("Devices and harmful software", "Factory reset", {
    definition: "Returning a device to its original settings and usually erasing personal information.",
    example: "Wiping a phone before you sell or recycle it.",
    todo: "Back up first, then sign out of your accounts and reset.",
    important: "Remove the device from your account (such as Find My) or the new owner can't use it.",
  }),

  // Privacy and personal information
  entry("Privacy and personal information", "Personal information", {
    definition: "Information that identifies or can be connected to a person.",
    example: "Your full name together with your birthdate and home address.",
    todo: "Share only the minimum a form actually requires.",
    important: "Small details combined are enough for identity theft.",
  }),
  entry("Privacy and personal information", "Sensitive information", {
    definition:
      "Information that could cause greater harm if exposed, such as financial, health, identity, or login information.",
    example: "Your national ID number, medical records, or banking logins.",
    todo: "Keep it in an encrypted place and never send it by plain email or text.",
    important: "Legitimate organizations don't ask for full ID numbers or passwords by message.",
  }),
  entry("Privacy and personal information", "Digital footprint", {
    definition: "The information about a person that exists because of their online activities.",
    example: "Old posts, forum accounts, and profiles still public years later.",
    todo: "Search your own name and clean up or lock down what you find.",
    important: "Deleting something doesn't remove copies, screenshots, or archives.",
  }),
  entry("Privacy and personal information", "Metadata", {
    definition:
      "Information attached to a file, photo, or message, such as time, location, device, or author.",
    example: "A holiday photo that also carries the GPS coordinates of your home.",
    todo: "Turn off location tagging in your camera and strip metadata before sharing.",
    important: "Metadata can reveal where you live even when the picture doesn't.",
  }),
  entry("Privacy and personal information", "Location services", {
    definition: "Device features that allow apps to determine or estimate where you are.",
    example: "A weather app set to track your location “always”.",
    todo: "Set apps to “while using” or off, and turn off precise location where it isn't needed.",
    important: "A continuous location history reveals your home, work, and daily routine.",
  }),
  entry("Privacy and personal information", "Doxxing", {
    definition:
      "Publishing someone's private or identifying information without permission, often to threaten or harass them.",
    example: "Someone posting your home address in a harassment thread.",
    todo: "Lock down profiles, remove address details, and screenshot everything as evidence.",
    important: "Report it to the platform and to police rather than engaging with the harasser.",
  }),
  entry("Privacy and personal information", "Data broker", {
    definition: "A company that collects, combines, and sells information about people.",
    example: "A people-search site listing your address and relatives.",
    todo: "Send opt-out or removal requests to the largest brokers.",
    important: "Repeat it yearly — listings tend to reappear from new sources.",
  }),
  entry("Privacy and personal information", "Tracking", {
    definition:
      "Collecting information about a person's online behavior across websites, apps, or devices.",
    example: "Ads for a product following you from site to site.",
    todo: "Turn on your browser's tracking protection and limit ad tracking on your phone.",
    important: "The same profiles are also used to make scams feel personal and believable.",
  }),
  entry("Privacy and personal information", "Cookie", {
    definition: "A small file a website stores to remember activity, preferences, or tracking information.",
    example: "The file that keeps you signed in when you return to a site.",
    todo: "Reject non-essential cookies and clear them from time to time.",
    important: "On a shared computer, signing out matters more than clearing cookies.",
  }),
  entry("Privacy and personal information", "Privacy settings", {
    definition: "Controls that determine what information is collected, shared, or visible to others.",
    example: "Setting a social profile so only friends can see your posts.",
    todo: "Review them after every major app redesign or update.",
    important: "Updates sometimes reset choices back to more public defaults.",
  }),
  entry("Privacy and personal information", "Data breach", {
    definition:
      "An incident in which protected or private information is accessed, exposed, stolen, or lost.",
    example: "A service emailing to say your password was exposed.",
    todo: "Change that password immediately, and anywhere you reused it, then enable MFA.",
    important: "Watch for “breach support” scams that arrive right after the news.",
  }),

  // Internet and communication safety
  entry("Internet and communication safety", "HTTPS", {
    definition:
      "A protected connection between your browser and a website. It encrypts the connection but does not prove that the website itself is trustworthy.",
    example: "The padlock and “https://” shown in your address bar.",
    todo: "Read the domain spelling carefully, not just the padlock.",
    important: "Scam sites use HTTPS too — the padlock is not a trust badge.",
  }),
  entry("Internet and communication safety", "Encryption", {
    definition:
      "Converting information into a protected form that unauthorized people cannot easily read.",
    example: "The storage on your locked phone, unreadable without the passcode.",
    todo: "Turn on device encryption and use a passcode or biometric lock.",
    important: "Encryption won't help if someone learns your account password.",
  }),
  entry("Internet and communication safety", "End-to-end encryption", {
    definition:
      "Communication protection intended to allow only the sender and intended recipient to read the content.",
    example: "Messages in an app where even the provider cannot read them.",
    todo: "Use an end-to-end encrypted app for sensitive conversations.",
    important: "Screenshots and unencrypted backups can still expose the content.",
  }),
  entry("Internet and communication safety", "Public Wi-Fi", {
    definition: "A shared wireless network in a public place, such as an airport, cafe, or hotel.",
    example: "An open “Airport_Free_WiFi” network with no password.",
    todo: "Use your phone's hotspot or mobile data for banking and other sensitive tasks.",
    important: "Attackers can create networks with convincing names, so don't trust the name alone.",
  }),
  entry("Internet and communication safety", "Router", {
    definition: "The device that connects a home or office network to the internet.",
    example: "The box your internet provider installed.",
    todo: "Change its default admin password and keep its updates current.",
    important: "Put visitors and smart devices on a separate guest network.",
  }),
  entry("Internet and communication safety", "Firmware", {
    definition: "Software built into hardware such as routers, cameras, and smart devices.",
    example: "A router update that closes a newly discovered flaw.",
    todo: "Enable automatic firmware updates, or check for them every few months.",
    important: "A smart device that no longer gets firmware updates should be replaced.",
  }),
  entry("Internet and communication safety", "Virtual private network", {
    definition:
      "A service that encrypts internet traffic between a device and the VPN provider. It does not make someone anonymous or protect against every scam.",
    example: "Turning one on before using hotel Wi-Fi.",
    todo: "Pick a reputable paid provider and use it when you're on networks you don't control.",
    important: "Free VPNs often sell your browsing data, and no VPN stops phishing.",
    aliases: ["VPN"],
  }),
  entry("Internet and communication safety", "Cloud storage", {
    definition: "Saving files on an internet-based service rather than only on a local device.",
    example: "Photos syncing automatically from your phone.",
    todo: "Protect the account with a unique password plus MFA, and review your sharing links.",
    important: "Syncing is not a backup — a deletion or infection syncs everywhere too.",
  }),
  entry("Internet and communication safety", "Backup", {
    definition:
      "An additional copy of information that can be restored if the original is lost, damaged, or encrypted.",
    example: "An external drive copy plus a cloud copy of your photos.",
    todo: "Keep one copy disconnected, and test restoring a single file so you know it works.",
    important: "Ransomware encrypts backups that stay permanently connected.",
  }),

  // AI and synthetic media
  entry("AI and synthetic media", "Deepfake", {
    definition:
      "Artificially generated or altered video, audio, or imagery made to resemble a real person or event.",
    example: "A video call “from an executive” approving an urgent payment.",
    todo: "Confirm any money or access request by calling the person on a number you already have.",
    important: "Video and voice are no longer proof of who you are talking to.",
  }),
  entry("AI and synthetic media", "Voice cloning", {
    definition: "Using technology to imitate a person's voice.",
    example: "A distressed “grandchild” asking you to send money right away.",
    todo: "Agree on a family code word to use in real emergencies.",
    important: "A few seconds of public audio is enough to copy someone's voice.",
  }),
  entry("AI and synthetic media", "Synthetic media", {
    definition:
      "Audio, images, video, or text created or substantially changed using technology.",
    example: "An invented news photograph of an event that never happened.",
    todo: "Check whether reliable outlets report the same thing before believing or sharing it.",
    important: "Emotional content spreads fastest, and gets checked last.",
  }),
  entry("AI and synthetic media", "AI-generated content", {
    definition: "Material created partly or fully by an artificial-intelligence system.",
    example: "Dozens of glowing product reviews written in the same voice.",
    todo: "Look for a named source, author, and date before trusting it.",
    important: "Fluent, confident writing is not evidence of accuracy.",
  }),
  entry("AI and synthetic media", "AI hallucination", {
    definition: "A confident-sounding AI response containing inaccurate or invented information.",
    example: "A chatbot citing a law, study, or link that doesn't exist.",
    todo: "Verify facts, figures, links, and any medical, legal, or financial advice elsewhere.",
    important: "Never paste passwords or sensitive personal data into a chatbot.",
  }),
  entry("AI and synthetic media", "Bot", {
    definition: "An automated account or program that performs actions or communicates online.",
    example: "An account posting the same reply under hundreds of posts.",
    todo: "Check an account's age, history, and followers before trusting it.",
    important: "Bots are used to amplify scams, especially investment offers.",
  }),
  entry("AI and synthetic media", "AI chatbot", {
    definition: "Software that generates conversational responses to user prompts.",
    example: "A support assistant answering questions on a website.",
    todo: "Treat its answer as a helpful draft, not as an authority.",
    important: "Assume anything you type into it may be stored or reviewed.",
  }),
  entry("AI and synthetic media", "Manipulated media", {
    definition: "Real media that has been edited, removed from context, or misleadingly presented.",
    example: "A clip cut so the moments before and after change its meaning.",
    todo: "Find the full original before you share it.",
    important: "Genuine footage can still mislead, so context matters as much as authenticity.",
  }),
  entry("AI and synthetic media", "Reverse-image search", {
    definition: "A method of searching for where an image has previously appeared online.",
    example: "Finding a dating-profile photo on a modelling or stock-photo site.",
    todo: "Search suspicious profile photos and dramatic news images.",
    important: "An image reused elsewhere under another name is a strong scam signal.",
  }),
  entry("AI and synthetic media", "Content provenance", {
    definition:
      "Information about where digital content came from and how it may have been created or edited.",
    example: "An image carrying an embedded label showing it was AI-generated.",
    todo: "Prefer platforms and outlets that publish provenance labels.",
    important: "A missing label doesn't prove content is authentic.",
  }),

  // Hygi. behavioral terms
  entry("Hygi. behavioral terms", "Pause-and-verify", {
    definition: "Stopping before acting and confirming a request through a trusted second method.",
    example: "Hanging up on a “bank” call and dialling your bank yourself.",
    todo: "Build in a short pause for any request involving money, codes, or access.",
    important: "Almost every scam fails the moment you slow it down.",
  }),
  entry("Hygi. behavioral terms", "Trusted channel", {
    definition: "A communication method independently known to belong to the person or organization.",
    example: "The number printed on the back of your bank card.",
    todo: "Save official contacts and app logins before you ever need them.",
    important: "Never use contact details supplied inside the suspicious message.",
  }),
  entry("Hygi. behavioral terms", "Emotional trigger", {
    definition: "Fear, excitement, affection, shame, or urgency used to influence a decision.",
    example: "“Your account will be deleted today” or “you've won, claim within the hour”.",
    todo: "Notice the feeling first, then re-read the message calmly before responding.",
    important: "The emotion is the attack — not the story wrapped around it.",
  }),
  entry("Hygi. behavioral terms", "Digital boundary", {
    definition:
      "A personal rule that limits unwanted access, contact, tracking, pressure, or disclosure.",
    example: "Not answering unknown numbers, and never discussing money by text.",
    todo: "Write down two or three rules you'll keep, and tell your family about them.",
    important: "You never owe anyone an instant reply.",
  }),
  entry("Hygi. behavioral terms", "Risk signal", {
    definition: "A clue suggesting that a message, request, account, or situation may be unsafe.",
    example: "A payment request that arrives from a slightly different email address.",
    todo: "Keep a short list of your personal warning signs and act on them.",
    important: "One clear signal is reason enough to stop and check.",
  }),
  entry("Hygi. behavioral terms", "Protective friction", {
    definition: "A deliberate extra step that slows an important decision and helps prevent mistakes.",
    example: "A personal 24-hour rule before any large transfer.",
    todo: "Add one deliberate delay to decisions involving money or account access.",
    important: "Scammers depend on speed, so friction is protection rather than inconvenience.",
  }),
  entry("Hygi. behavioral terms", "Recovery plan", {
    definition:
      "A prepared set of actions for responding to account theft, scams, lost devices, or exposed information.",
    example: "Written steps plus saved bank and platform support numbers.",
    todo: "Write it now and keep a copy offline where you can reach it without your phone.",
    important: "The first hour after a compromise matters most, so don't improvise it.",
  }),
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