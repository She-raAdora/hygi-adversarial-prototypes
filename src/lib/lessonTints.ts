/**
 * Per-lesson accent tints so every lesson icon / badge stays colorful even
 * before it is earned or unlocked, and no two neighbours look alike.
 *
 * Hues are spread around the wheel with an offset step so adjacent lessons —
 * and lessons that reuse the same emoji — land on clearly different colors.
 */
const HUE_STEP = 137; // golden-angle-ish: maximises separation across the list

export function lessonHue(index: number) {
  return (index * HUE_STEP + 190) % 360;
}

/** Soft, saturated gradient used as the icon tile background. */
export function lessonTint(index: number, earned: boolean) {
  const h = lessonHue(index);
  return earned
    ? `linear-gradient(135deg, oklch(0.62 0.16 ${h}), oklch(0.8 0.15 ${(h + 28) % 360}))`
    : `linear-gradient(135deg, oklch(0.86 0.1 ${h}), oklch(0.94 0.07 ${(h + 28) % 360}))`;
}

export function lessonTintShadow(index: number) {
  return `0 0 30px oklch(0.75 0.14 ${lessonHue(index)} / 0.35)`;
}
