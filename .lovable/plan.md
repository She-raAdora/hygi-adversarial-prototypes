# Admin TOTP multi-factor authentication

## Goal
Let administrators add, verify, use, and remove an authenticator-app factor from Account settings, then complete that factor when signing in.

## Changes
- Add an Account security section visible to administrators only.
- Show current authenticator status and verified factors.
- Guide enrollment with a QR code, manual setup key, and six-digit verification step.
- Allow removal with a clear confirmation; prevent abandoned unverified factors from accumulating.
- Detect when a signed-in account needs its second factor and show a focused verification screen before entering admin tools.
- Refresh the authenticated session after verification so protected admin requests use the stronger session.
- State clearly that TOTP is stronger than password-only but is not phishing-resistant; passkeys or security keys remain the phishing-resistant option.

## Verification
- Check enrollment, invalid-code feedback, successful verification, factor removal, keyboard labels, and mobile layout.
- Confirm non-admin accounts do not see admin MFA controls.
- Confirm the app builds cleanly and existing sign-in methods still work.

## Technical details
- Use the existing authentication provider's native TOTP APIs; no QR or MFA secrets are stored by Hygi.
- Keep factor secrets only in temporary page state during enrollment and never log them.
- No database schema changes are required.
