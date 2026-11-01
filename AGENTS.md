
- Learner progress lives in localStorage and syncs to `learner_progress` via `ProgressSync` (merge on sign-in: best badge score wins, device extras win); new progress keys must be added to `EXTRA_KEYS` and dispatch `dh-progress` after writing. Why: lessons must work signed-out while accounts keep progress across devices.
