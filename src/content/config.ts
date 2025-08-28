// src/content/config.ts
import { defineCollection, z } from "astro:content";

/**
 * Permissive URL schema:
 * - Absolute URLs: https://...
 * - Site-relative paths: /path
 * - Hash anchors: #section
 */
const urlSchema = z.union([
  z.string().url(),
  z.string().startsWith("/"),
  z.string().startsWith("#"),
]);

/**
 * Link union with basic shape used across collections.
 */
const link = z.object({
  text: z.string(),
  href: urlSchema,
});

/** Projects collection */
const projects = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare `slug` here; Astro reserves it.

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

      // Hero configuration for detail page
      heroImage: z.string().optional(),

      // NOTE: includes "aside" to support existing content
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

      // Collaborators (by partner slug)
      collaborators: z.array(z.string()).default([]),

      // Links shown on project pages
      links: z.array(link).default([]),

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
      // Do NOT declare `slug` here; Astro reserves it.
      prefix: z.string().optional(),
      name: z.string(),
      role: z.string().optional(),
      photo: z.string().optional(),
      email: z.string().email().optional(),
      linkedin: z.string().url().optional(),
      website: z.string().url().optional(),

      // ⚠️ Robust to CMS writing "" or "3" for order:
      order: z.preprocess(
        (v) =>
          v === "" || v == null
            ? undefined
            : typeof v === "string"
            ? Number(v)
            : v,
        z.number().optional()
      ),

      // Relations by slug/filename
      linkedProjects: z.array(z.string()).default([]),
      linkedPublications: z.array(z.string()).default([]),

      // Optional markdown body
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
      // Do NOT declare `slug` here; Astro reserves it.
      title: z.string(),
      description: z.string().optional(),
      year: z.number().optional(),
      authors: z.array(z.string()).optional(),
      url: z.string().url().optional(),
      order: z.number().optional(),
    })
    .passthrough(),
});

/** Resources collection */
const resources = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare `slug` here; Astro reserves it.
      title: z.string(),
      oneLine: z.string(),
      summary: z.string().optional(),
      order: z.number().optional(),
      links: z.array(link).default([]),
    })
    .passthrough(),
});

/** Partners collection */
const partners = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare `slug` here; Astro reserves it.
      name: z.string(),
      logo: z.string(), // /uploads/...
      url: z.string().url().optional(),

      // ⚠️ Same robustness for partners just in case
      order: z.preprocess(
        (v) =>
          v === "" || v == null
            ? undefined
            : typeof v === "string"
            ? Number(v)
            : v,
        z.number().optional()
      ),
    })
    .passthrough(),
});

/** General media collection */
const media = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare `slug` here; Astro reserves it.
      title: z.string(),
      image: z.string(), // /uploads/...
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
