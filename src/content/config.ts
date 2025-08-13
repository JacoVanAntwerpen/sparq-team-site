// src/content/config.ts
import { defineCollection, z } from "astro:content";

/** URLs can be absolute, site-relative, or anchors */
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

/** Content Builder blocks (typed / discriminated) */
const headerBlock = z.object({
  type: z.literal("header"),
  text: z.string(),
  level: z.enum(["h2", "h3", "h4"]).default("h2"),
});

const subheaderBlock = z.object({
  type: z.literal("subheader"),
  text: z.string(),
  level: z.enum(["h3", "h4"]).default("h3"),
});

const paragraphBlock = z.object({
  type: z.literal("paragraph"),
  body: z.string(), // markdown allowed
});

const listBlock = z.object({
  type: z.literal("list"),
  style: z.enum(["ul", "ol"]).default("ul"),
  items: z.array(z.string()),
});

const linkBlock = z.object({
  type: z.literal("link"),
  label: z.string(),
  url: urlSchema,
});

const fileBlock = z.object({
  type: z.literal("file"),
  label: z.string(),
  file: z.string(),
});

const contentBlock = z.discriminatedUnion("type", [
  headerBlock,
  subheaderBlock,
  paragraphBlock,
  listBlock,
  linkBlock,
  fileBlock,
]);

/** Collections */
const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    longDetails: z.string().optional(), // legacy fallback
    heroImage: z.string().optional(),
    tileImage: z.string().optional(),
    completed: z.string().optional(),
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
    // Builder blocks
    content: z.array(contentBlock).default([]),
    // Bottom-of-page sections (legacy/extra)
    files: z.array(fileRef).default([]),
    links: z.array(link).default([]),
  }),
});

const team = defineCollection({
  type: "content",
  schema: z.object({
    prefix: z.string().optional(),
    name: z.string(),
    title: z.string(),
    shortSummary: z.string(),
    longSummary: z.string().optional(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
    headshot: z.string().optional(),
    linkedProjects: z.array(z.string()).default([]),
    linkedPublications: z.array(z.string()).default([]),
    order: z.number().optional(),
    initials: z.string().optional(),
  }),
});

const publications = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    heroImage: z.string().optional(),
    abstract: z.string().optional(),
    url: urlSchema,
    authors: z.array(z.string()).default([]),
    linkedProjects: z.array(z.string()).default([]),
    year: z.number().optional(),
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

export const collections = { team, projects, publications, resources };
