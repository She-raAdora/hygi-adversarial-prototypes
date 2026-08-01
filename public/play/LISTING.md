# Google Play listing copy — Hygi.

App name: Hygi. — Digital Hygiene

Short description (78 chars):
15 short lessons on digital hygiene. Quiz yourself, earn badges, stay safer.

Full description:
Hygi. turns digital hygiene into 15 short, readable lessons — each with a pop quiz
at the end. Pass the quiz and you earn a badge. Finish all 15 and you earn the
Digital Hygiene Champion trophy.

What you learn:
- Protecting personal information and auditing your digital footprint
- Strong passwords, MFA, and locking down accounts
- Safe browsing, scams, and AI-powered phishing (deepfakes, voice clones, BEC)
- Securing phones, workstations, public computers, and networked devices
- Ransomware defence, backups, and protecting sensitive work
- Recognising online harassment and staying safe in public life

Why people like it:
- No account required. Every lesson, quiz, and badge is free and open.
- Progress stays on your device — quiz answers are never uploaded.
- Answer review after every quiz explains why the right answer is right.
- Share your badges as an image card in landscape, square, or portrait.
- Works offline-friendly on the home screen, and analytics only run if you opt in.

Lesson content is based on public cybersecurity and digital safety guidance from
Dartmouth College, Caltech, Cal Poly, and Harvard University. Hygi. is not
affiliated with or endorsed by those institutions.

Brought to you by NorthBridge.

Category: Education
Contact email: builtstrong1@outlook.com
Privacy policy: https://digitalhygiene.app/privacy
Account deletion URL: https://digitalhygiene.app/delete-account
Contains ads: No
In-app purchases: No

## Data safety answers
- Collects data: Yes — approximate analytics (page views, quiz completions) and
  email address for staff accounts only.
- Shared with third parties: Google Analytics (analytics purpose only).
- Encrypted in transit: Yes.
- Users can request deletion: Yes — in-app (Account settings) and via
  https://digitalhygiene.app/delete-account.
- Data collection optional: Yes — analytics require explicit opt-in.

## Content rating (IARC questionnaire answers)
- Category: Reference, News, or Educational
- Violence / sexuality / profanity / controlled substances: None
- Gambling or simulated gambling: None
- Users can interact / share content / share location: No
- Digital purchases: No
- Ads: No
- Expected rating: Everyone / PEGI 3

## Target audience & content
- Target age groups: 13-15, 16-17, 18+ (not designed for children under 13)
- Appeals to children: No
- Ads or in-app purchases shown to children: N/A (none in the app)

## Additional declarations
- Advertising ID: Not used. Google Analytics is used for aggregate web
  measurement only, and only after explicit in-app consent.
- Government app: No
- Financial features: None
- Health features: None
- News app: No
- COVID-19 contact tracing: No
- Data deletion: In-app (Account settings) plus the public URL
  https://digitalhygiene.app/delete-account
- Login credentials for review: Not required — all lessons, quizzes, and badges
  are usable with no account. Accounts exist only for internal staff analytics
  pages (/insights, /admin).

## Packaging steps (Trusted Web Activity via Bubblewrap)
1. `npm i -g @bubblewrap/cli`
2. `bubblewrap init --manifest https://digitalhygiene.app/manifest.webmanifest`
   (or copy `public/play/twa-manifest.json` into an empty folder as
   `twa-manifest.json` and run `bubblewrap update`)
3. `bubblewrap build` -> produces `app-release-bundle.aab`
4. Upload the .aab to Play Console. Under Release > Setup > App signing, copy
   the **SHA-256 certificate fingerprint** of the app signing key.
5. Back in this project run:
   `node scripts/set-assetlinks-fingerprint.mjs <SHA-256>`
   then publish. This writes /.well-known/assetlinks.json, which is what
   removes the browser URL bar from the installed app.
6. Verify with
   https://developers.google.com/digital-asset-links/tools/generator
