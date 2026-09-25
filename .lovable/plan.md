# Abuse-related backlink monitoring

## What will change
- Add a separate abuse-risk classifier for referring domains and anchor text, alongside the existing general spam score.
- Flag language associated with image-based abuse, non-consensual imagery, deepfakes, blackmail, exploitation, and related harmful content, while keeping explicit reasons visible for review.
- Add abuse-specific summary counts, scores, and flagged domain/anchor lists to the Backlinks dashboard.
- Create distinct abuse alerts for newly seen domains and anchors, with their own threshold and on/off setting.
- Keep the existing trusted-source list applicable to both general spam and abuse alerts.

## Technical details
- Extend backlink risk results with `abuseScore`, `abuseLevel`, and abuse reasons for each domain and anchor, plus a profile-level abuse score.
- Add an alert category so general-risk and abuse alerts can coexist for the same domain or anchor without replacing each other.
- Add abuse alert settings to the existing settings row and apply them during snapshot capture.
- Update the admin alert feed to label and filter abuse alerts clearly.
- Apply a database migration with grants, row-level security compatibility, defaults, and updated uniqueness for categorized alerts.

## Verification
- Test classifier behavior with abuse-related and ordinary examples.
- Confirm snapshot capture can create separate general-risk and abuse alerts.
- Confirm the dashboard displays abuse scores, reasons, settings, and alert labels.
- Check the authenticated Backlinks page for browser and build errors.
