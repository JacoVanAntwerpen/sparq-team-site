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

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortDescription: z.string(),
    longDetails: z.string().optional(), // optional markdown fallback
    content: z.any().optional(),        // content builder (kept for compatibility)
    featured: z.boolean().default(false),

    // Tile image for cards
    tileImage: z.string().optional(),
    tileImageAlt: z.string().optional(),

    // Hero configuration for detail page
    heroImage: z.string().optional(),
    heroLayout: z.enum(["standard","wide","edge","none"]).default("standard"),
    heroFocalPoint: z.enum([
      "center","top","bottom","left","right",
      "top-left","top-right","bottom-left","bottom-right"
    ]).default("center"),
    heroCaption: z.string().optional(),
    heroCredit: z.string().optional(),
    heroCreditUrl: z.string().optional(),

    // Attachments and external links
    files: z.array(fileRef).default([]),
    links: z.array(link).default([]),

    // Partner relationships (by slug)
    partners: z.array(z.string()).default([]),
  }),
});

const team = defineCollection({
  type: "content",
  schema: z.object({
    slug: z.string().optional(),         // allow custom slug
    prefix: z.string().optional(),
    name: z.string(),
    role: z.string().optional(),
    photo: z.string().optional(),
    email: z.string().email().optional(),
    linkedin: z.string().url().optional(),
    website: z.string().url().optional(),
    order: z.number().optional(),
    linkedProjects: z.array(z.string()).default([]),
    linkedPublications: z.array(z.string()).default([]),
    body: z.string().optional(),
    title: z.string().optional(),        // compatibility if you used `title`
  }),
});

const publications = defineCollection({
  type: "content",
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    authors: z.array(z.string()).default([]),
    year: z.number(),
    venue: z.string().optional(),
    doi: z.string().url().optional(),
    url: z.string().url().optional(), // legacy / external landing
    abstract: z.string().optional(),
    heroImage: z.string().optional(),
    links: z.array(link).default([]),
    files: z.array(fileRef).default([]),
  }),
});

const resources = defineCollection({
  type: "content",
  schema: z.object({
    slug: z.string().optional(),
    title: z.string(),
    oneLine: z.string(),
    summary: z.string().optional(),
    files: z.array(fileRef).default([]),
    links: z.array(link).default([]),
    citation: z.string().optional(),
    image: z.string().optional(),
  }),
});

const partners = defineCollection({
  type: "content",
  schema: z.object({
    slug: z.string(),
    name: z.string(),
    logo: z.string(),           // /uploads/...
    url: z.string().url().optional(),
    order: z.number().optional(),
  }),
});

const media = defineCollection({
  type: "content",
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    image: z.string(),
    alt: z.string().optional(),
    credit: z.string().optional(),
    creditUrl: z.string().url().optional(),
  }),
});

export const collections = { projects, team, publications, resources, partners, media };
