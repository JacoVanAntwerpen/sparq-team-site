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
 * DOI can be either a full URL or a handle like 10.1234/xyz
 */
const doiSchema = z.union([
  z.string().url(),
  z.string().regex(/^10\.\d{4,9}\/\S+$/i),
]);

/** Shared sub-schemas */
const link = z.object({
  label: z.string(),
  url: urlSchema,
});

const fileRef = z.object({
  label: z.string(),
  file: z.string(),
});

/** Projects collection */
const projects = defineCollection({
  type: "content",
  schema: z
    .object({
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

      heroCaption: z.string().optional(),
      heroCredit: z.string().optional(),
      heroCreditUrl: z.string().optional(),

      // Attachments & external links
      files: z.array(fileRef).default([]),
      links: z.array(link).default([]),

      // Partner slugs selected for this project
      partners: z.array(z.string()).default([]),
    })
    .passthrough(), // allow legacy/extra keys without failing validation
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
      order: z.number().optional(),

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
      authors: z.array(z.string()).default([]),
      year: z.number(),
      venue: z.string().optional(),

      // Accept full URL or DOI handle
      doi: doiSchema.optional(),

      // Accept absolute/relative/hash URLs
      url: urlSchema.optional(),

      abstract: z.string().optional(),
      heroImage: z.string().optional(),

      links: z.array(link).default([]),
      files: z.array(fileRef).default([]),
    })
    .passthrough(),
});

/** Tools & Resources collection */
const resources = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare `slug` here; Astro reserves it.
      title: z.string(),
      oneLine: z.string(),
      summary: z.string().optional(),
      files: z.array(fileRef).default([]),
      links: z.array(link).default([]),
      citation: z.string().optional(),
      image: z.string().optional(),
    })
    .passthrough(),
});

/** Partners & Collaborators collection */
const partners = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare `slug` here; Astro reserves it.
      name: z.string(),
      logo: z.string(), // /uploads/...
      url: z.string().url().optional(),
      order: z.number().optional(),
    })
    .passthrough(),
});

/** General Images (media) collection */
const media = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare `slug` here; Astro reserves it.
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
