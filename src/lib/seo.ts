/** Absolute social preview image shared by every public route. */
export const OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/87cf0ff7-cc52-415f-b7ba-f9cf8a6fd547";

/** og:image + twitter:image meta entries for a route's head(). */
export const socialImageMeta = [
  { property: "og:image", content: OG_IMAGE },
  { property: "og:image:alt", content: "Hygi — digital and cyber hygiene lessons" },
  { name: "twitter:image", content: OG_IMAGE },
  { name: "twitter:card", content: "summary_large_image" },
] as const;
