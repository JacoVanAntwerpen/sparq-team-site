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
  schema: z
    .object({
      title: z.string(),
      shortDescription: z.string(),
      longDetails: z.string().optional(),
      content: z.any().optional(),

      featured: z.boolean().default(false),

      // Tile image for cards
      tileImage: z.string().optional(),
      tileImageAlt: z.string().optional(),

      // Hero configuration for detail page
      heroImage: z.string().optional(),
      // includes "aside" so prior content validates
      heroLayout: z.enum(["standard", "wide", "edge", "none", "aside"]).default("standard"),
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

      // Attachments and external links
      files: z.array(fileRef).default([]),
      links: z.array(link).default([]),

      // Partner relationships (by slug/filename)
      partners: z.array(z.string()).default([]),
    })
    .passthrough(), // allow unknown keys (e.g., legacy fields)
});

const team = defineCollection({
  type: "content",
  schema: z
    .object({
      // ❌ no 'slug' here
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
      title: z.string().optional(), // compatibility
    })
    .passthrough(),
});

const publications = defineCollection({
  type: "content",
  schema: z
    .object({
      // ❌ no 'slug' here
      title: z.string(),
      authors: z.array(z.string()).default([]),
      year: z.number(),
      venue: z.string().optional(),
      doi: z.string().url().optional(),
      url: z.string().url().optional(),
      abstract: z.string().optional(),
      heroImage: z.string().optional(),
      links: z.array(link).default([]),
      files: z.array(fileRef).default([]),
    })
    .passthrough(),
});

const resources = defineCollection({
  type: "content",
  schema: z
    .object({
      // ❌ no 'slug' here
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

const partners = defineCollection({
  type: "content",
  schema: z
    .object({
      // ❌ no 'slug' here
      name: z.string(),
      logo: z.string(), // /uploads/...
      url: z.string().url().optional(),
      order: z.number().optional(),
    })
    .passthrough(),
});

const media = defineCollection({
  type: "content",
  schema: z
    .object({
      // ❌ no 'slug' here
      title: z.string(),
      image: z.string(),
      alt: z.string().optional(),
      credit: z.string().optional(),
      creditUrl: z.string().url().optional(),
    })
    .passthrough(),
});

export const collections = { projects, team, publications, resources, partners, media };
