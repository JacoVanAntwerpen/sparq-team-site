// src/content/config.ts
import { defineCollection, z } from "astro:content";

const urlSchema = z.union([
  z.string().url(),
  z.string().startsWith("/"),
  z.string().startsWith("#"),
]);

const link = z.object({
  label: z.string(),
  url: urlSchema,
});

const fileRef = z.object({
  label: z.string(),
  file: z.string(),
});

/** Content Builder blocks */
const contentBlock = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("header"),
    text: z.string(),
    level: z.enum(["h2", "h3", "h4"]).default("h2"),
  }),
  z.object({
    type: z.literal("subheader"),
    text: z.string(),
    level: z.enum(["h3", "h4"]).default("h3"),
  }),
  z.object({ type: z.literal("paragraph"), body: z.string() }), // markdown
  z.object({
    type: z.literal("list"),
    style: z.enum(["ul", "ol"]).default("ul"),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal("link"),
    label: z.string(),
    url: urlSchema,
  }),
  z.object({
    type: z.literal("file"),
    label: z.string(),
    file: z.string(),
  }),
]);

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    longDetails: z.string().optional(), // legacy fallback

    // Hero fields
    heroImage: z.string().optional(),
    heroLayout: z
      .enum(["full", "banner", "aside", "none"])
      .default("full")
      .optional(),
    heroAlt: z.string().optional(),
    heroFocal: z
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
      .default("center")
      .optional(),
    heroCaption: z.string().optional(),
    heroCredit: z.string().optional(),
    heroCreditUrl: z.string().optional(),

    tileImage: z.string().optional(),
    completed: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),

    content: z.array(contentBlock).default([]),

    files: z.array(fileRef).default([]),
    links: z.array(link).default([]),
  }),
});

const team = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    prefix: z.string().optional(),
    role: z.string().optional(),
    photo: z.string().optional(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
    website: z.string().url().optional(),
    order: z.number().optional(),
    body: z.string().optional(), // markdown body
  }),
});

const publications = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).optional(),
    year: z.number().optional(),
    venue: z.string().optional(),
    url: urlSchema.optional(),
    files: z.array(fileRef).optional(),
    body: z.string().optional(), // abstract or markdown body
  }),
});

const resources = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    oneLine: z.string(),
    summary: z.string().optional(),
    files: z.array(fileRef).default([]),
    links: z.array(link).default([]),
    citation: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { projects, team, publications, resources };
