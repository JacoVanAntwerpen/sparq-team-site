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
const urlSchema = z.union([
  z.string().url(),
  z.string().startsWith("/"),
  z.string().startsWith("#"),
]);

/** Generic strict link (used where content has been consistent) */
const link = z.object({
  text: z.string(),
  href: urlSchema,
});

/** ---------- Tolerant links normalisation (strings/partials → {text, href}) ---------- */
const linksNormalized = z.preprocess(
  (raw) => {
    if (raw == null) return undefined;
    if (!Array.isArray(raw)) return undefined;

    const cleaned = raw
      .filter((item) => item != null && item !== "") // drop null/empty-string items
      .map((item) => {
        if (typeof item === "string") {
          const s = item.trim();
          if (!s) return null;
          return { text: s, href: s };
        }
        if (typeof item === "object") {
          // Accept common loose shapes and alias keys
          const href = (item as any).href ?? (item as any).url ?? (item as any).link ?? "";
          const text = (item as any).text ?? (href || "").toString();
          const hrefStr = typeof href === "string" ? href.trim() : "";
          const textStr = typeof text === "string" ? text.trim() : "";

          if (!hrefStr) return null; // no usable href -> drop
          return {
            text: textStr || hrefStr,
            href: hrefStr,
          };
        }
        return null;
      })
      .filter(Boolean);

    return cleaned.length ? cleaned : undefined;
  },
  // After preprocess, validate as strict array of required text/href strings
  z
    .array(
      z.object({
        text: z.string().min(1),
        href: z.string().min(1),
      })
    )
    .optional()
);

/** ---------------- Collections ---------------- */

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

      // Collaborators (by partner slug)
      collaborators: z.array(z.string()).default([]),

      // ✅ Tolerant links accepting legacy values; normalised to {text, href}
      links: linksNormalized,

      // Ordering for lists (optional)
      order: z.number().optional(),
    })
    .passthrough(),
});

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

      // Robust to "", "3", 3:
      order: numberLoose,

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

const publications = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare "slug"; Astro provides entry.slug.

      title: z.string(),
      description: z.string().optional(),
      year: z.number().optional(),
      authors: z.array(z.string()).optional(),

      // Relaxed to accept legacy non-URL strings; "" -> undefined
      url: z.preprocess((v) => (v === "" ? undefined : v), z.string().optional()),

      order: z.number().optional(),
    })
    .passthrough(),
});

const resources = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare "slug"; Astro provides entry.slug.

      title: z.string(),
      oneLine: z.string(),
      summary: z.string().optional(),
      order: z.number().optional(),

      // ✅ Make Resources tolerant just like Projects
      links: linksNormalized,
    })
    .passthrough(),
});

const partners = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare "slug"; Astro provides entry.slug.

      name: z.string(),
      logo: z.string(),
      url: z.string().url().optional(),
      order: numberLoose,
    })
    .passthrough(),
});

const media = defineCollection({
  type: "content",
  schema: z
    .object({
      // Do NOT declare "slug"; Astro provides entry.slug.

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
