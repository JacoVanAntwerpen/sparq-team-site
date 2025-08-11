// src/content/config.ts
import { defineCollection, z } from "astro:content";

// Accept absolute URLs, site-relative paths, or anchors
const urlSchema = z.union([
  z.string().url(),            // https://example.com
  z.string().startsWith("/"),  // /relative/path
  z.string().startsWith("#"),  // #anchor
]);

const link = z.object({
  label: z.string(),
  url: urlSchema,
});

const fileRef = z.object({
  label: z.string(),
  file: z.string(), // path in /public/uploads or absolute
});

// TEAM
const team = defineCollection({
  type: "content",
  schema: z.object({
    prefix: z.string().optional(), // Dr., Prof., etc.
    name: z.string(),
    title: z.string(), // job title / role
    shortSummary: z.string().max(200),
    longSummary: z.string().optional(), // can also use body markdown
    email: z.string().email().optional(),
    linkedin: urlSchema.optional(),
    headshot: z.string().optional(), // /uploads/<file>
    linkedProjects: z.array(z.string()).default([]), // slugs of projects
    linkedPublications: z.array(z.string()).default([]), // slugs of publications
    order: z.number().default(999),
    initials: z.string().optional(), // fallback avatar
  }),
});

// PROJECTS
const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    shortDescription: z.string().max(240),
    longDetails: z.string().optional(), // can also use body markdown
    links: z.array(link).default([]),
    files: z.array(fileRef).default([]),
    heroImage: z.string().optional(),
    tileImage: z.string().optional(),
    completed: z.string().optional(), // ISO date (YYYY-MM-DD)
    featured: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

// PUBLICATIONS
const publications = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    heroImage: z.string().optional(),
    abstract: z.string().optional(), // or body
    url: urlSchema, // usually absolute, but allow relative if needed
    authors: z.array(z.string()).default([]),
    linkedProjects: z.array(z.string()).default([]),
    year: z.number().optional(),
  }),
});

// RESOURCES (tools & resources)
const resources = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    oneLine: z.string(),
    summary: z.string().optional(), // or body
    files: z.array(fileRef).default([]),
    links: z.array(link).default([]),
    citation: z.string().optional(),
    image: z.string().optional(),
  }),
});

export const collections = { team, projects, publications, resources };
