import { defineCollection, z } from "astro:content";

/** Helper: tolerant number that accepts "", "3", 3 -> number | undefined */
const numberLoose = z.preprocess(
  (v) =>
    v === "" || v == null
      ? undefined
      : typeof v === "string"
      ? Number(v)
      : v,
  z.number().optional()
);

/**
 * Permissive URL schema (kept for places where you want real URLs):
 * - Absolute (https://...), site-relative (/path), or hash (#id)
 */
const urlLoose = z
  .string()
  .regex(
    /^(https?:\/\/|\/|#).*/i,
    "Must be an absolute URL (https://…), a site-relative path (/path), or a hash (#id)"
  )
  .optional();

/** Normalized link object { text, href } with tolerant href */
const linksNormalized = z
  .array(
    z
      .object({
        label: z.string().optional(),
        text: z.string().optional(),
        url: urlLoose,
        href: urlLoose,
      })
      .transform((v) => {
        const text = v.label ?? v.text ?? "";
        const href = v.href ?? v.url ?? "";
        return { text, href };
      })
  )
  .default([]);

/** Projects collection */
const projects = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare "slug"; Astro provides entry.slug.

      title: z.string(),
      shortDescription: z.string(),

      // Optional long-form markdown fallback if you don't use the builder
      longDetails: z.string().optional(),

      // Content builder (kept permissive for your existing blocks)
      content: z.any().optional(),

      featured: z.boolean().default(false),

      // Card imagery
      tileImage: z.string().optional(),
      tileImageAlt: z.string().optional(),
      tileImageFocus: z
        .enum([
          "center",
          "top",
          "bottom",
          "left",
          "right",
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
        ])
        .default("center"),

      // Detail page hero (kept as before)
      heroImage: z.string().optional(),
      heroLayout: z
        .enum(["standard", "wide", "edge", "none", "aside"])
        .default("standard"),
      heroFocalPoint: z
        .enum([
          "center",
          "top",
          "bottom",
          "left",
          "right",
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
        ])
        .default("center"),

      // Collaborators (by partner slug) — optional, array of strings
      collaborators: z.array(z.string()).default([]),

      // Links normalized to {text, href}
      links: linksNormalized,

      // Ordering for lists (optional)
      order: z.number().optional(),
    })
    .passthrough(),
});

/** Team collection */
const team = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare "slug"; Astro provides entry.slug.

      prefix: z.string().optional(),
      name: z.string(),
      role: z.string().optional(),
      photo: z.string().optional(),
      email: z.string().email().optional(),

      // Strict URLs here; we can loosen later if you encounter empty strings.
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),

      // Toggle: show this person on the homepage team section
      showOnHome: z.boolean().default(true),

      // Robust to "", "3", 3:
      order: numberLoose,

      // Relations by slug/filename
      linkedProjects: z.array(z.string()).default([]),
      linkedPublications: z.array(z.string()).default([]),

      // Optional summary and markdown body
      longSummary: z.string().optional(),
      body: z.string().optional(),

      // Compatibility (some entries may have used `title`)
      title: z.string().optional(),
    })
    .passthrough(),
});

/** Publications collection */
const publications = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      authors: z.array(z.string()).default([]),
      year: numberLoose,
      venue: z.string().optional(),
      doi: z.string().optional(),
      url: urlLoose,
      pdf: urlLoose,
      image: z.string().optional(),
      order: numberLoose,
      // Optional relations
      linkedProjects: z.array(z.string()).default([]),
    })
    .passthrough(),
});

/** Resources collection */
const resources = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      url: urlLoose,
      image: z.string().optional(),
      desc: z.string().optional(),
      order: numberLoose,
    })
    .passthrough(),
});

/** Partners (Collaborators & Affiliates) */
const partners = defineCollection({
  type: "content",
  schema: z
    .object({
      name: z.string(),
      url: urlLoose,
      logo: z.string().optional(),
      affiliate: z.boolean().optional().default(false),
      order: numberLoose,
    })
    .passthrough(),
});

/** Generic media bucket */
const media = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      image: z.string(),
      alt: z.string().optional(),
      credit: z.string().optional(),
      creditUrl: z.string().url().optional(),
    })
    .passthrough(),
});

export const collections = {
  projects,
  team,
  publications,
  resources,
  partners,
  media,
};
