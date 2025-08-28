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

/** Permissive URL schema */
const urlLoose = z
  .string()
  .regex(/^(https?:\/\/|\/|#).*/i, "Must be https://, /path, or #hash")
  .optional();

/** Normalize links to {text, href} */
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

/** Coerce string | string[] | undefined -> string[] */
const toStringArray = z.preprocess((v) => {
  if (v == null || v === "") return [];
  if (Array.isArray(v)) return v;
  return [String(v)];
}, z.array(z.string()).default([]));

/** Projects collection */
const projects = defineCollection({
  type: "content",
  schema: z
    .object({
      title: z.string(),
      shortDescription: z.string(),
      longDetails: z.string().optional(),
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

      // Detail page hero
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

      // 🔧 Accept string or array for legacy entries
      collaborators: toStringArray,

      links: linksNormalized,
      order: z.number().optional(),
    })
    .passthrough(),
});

/** Team collection */
const team = defineCollection({
  type: "content",
  schema: z
    .object({
      prefix: z.string().optional(),
      name: z.string(),
      role: z.string().optional(),
      photo: z.string().optional(),
      email: z.string().email().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),

      // Homepage toggle
      showOnHome: z.boolean().default(true),

      order: numberLoose,

      // 🔧 Accept string or array for legacy entries
      linkedProjects: toStringArray,
      linkedPublications: toStringArray,

      longSummary: z.string().optional(),
      body: z.string().optional(),
      title: z.string().optional(),
    })
    .passthrough(),
});

/** Publications */
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
      linkedProjects: toStringArray,
    })
    .passthrough(),
});

/** Resources */
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

/** Media */
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
