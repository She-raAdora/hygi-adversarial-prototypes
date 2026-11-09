
- Learner progress lives in localStorage and syncs to `learner_progress` via `ProgressSync` (merge on sign-in: best badge score wins, device extras win); new progress keys must be added to `EXTRA_KEYS` and dispatch `dh-progress` after writing. Why: lessons must work signed-out while accounts keep progress across devices.
- Scope the age restriction to account creation, including OAuth; preserve email/password sign-in without clearing the saved age result. Why: shared devices must not lock existing users out or bypass the sign-up restriction.
