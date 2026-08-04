import { useEffect, useState } from "react";

import { trackExperimentView } from "./analytics";
import {
  HOME_CTA_VARIANTS,
  getHomeCtaVariantId,
  homeCtaVariant,
  type HomeCtaVariant,
} from "./experiments";

/**
 * Resolves the visitor's homepage CTA variant after hydration and records one
 * impression per mount. The control renders on the server and during the first
 * paint so markup matches and SEO/crawlers always see the same page.
 */
export function useHomeCtaVariant(): HomeCtaVariant {
  const [variant, setVariant] = useState<HomeCtaVariant>(
    () => HOME_CTA_VARIANTS[0] as HomeCtaVariant,
  );

  useEffect(() => {
    const resolved = homeCtaVariant(getHomeCtaVariantId());
    setVariant(resolved);
    trackExperimentView(resolved.id, resolved.placement);
  }, []);

  return variant;
}
