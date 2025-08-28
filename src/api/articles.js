import { STRAPI_URL } from "../config/config";

/**
 * Articles (Actualités) API helpers
 * ---------------------------------
 * Strapi v4+ JSON API – public read (no auth needed if Public role has find/findOne).
 *
 * Exports:
 *  - fetchActualites({ page=1, pageSize=10, sort='publishedAt:desc', search, tags })
 *  - fetchActualiteBySlug(slug)
 *
 * Normalizes the Strapi response to a flat shape:
 * {
 *   id, slug, title, excerpt, content, publishedAt,
 *   cover: { url, formats?, mime?, width?, height?, alt? },
 *   tags: string[],
 *   source, sourceId, sourceUrl
 * }
 */

function apiBase() {
  const b = (STRAPI_URL || "").trim();
  if (!b) return "";
  return b.endsWith("/") ? b.slice(0, -1) : b;
}

/** Build nested Strapi query strings safely */
function buildQS(params = {}) {
  const sp = new URLSearchParams();

  const append = (key, val) => {
    if (val === undefined || val === null || val === "") return;
    if (Array.isArray(val)) {
      val.forEach((v) => append(key, v));
    } else if (typeof val === "object") {
      Object.entries(val).forEach(([k, v]) => append(`${key}[${k}]`, v));
    } else {
      sp.append(key, String(val));
    }
  };

  Object.entries(params).forEach(([k, v]) => append(k, v));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

/** Basic fetch wrapper with graceful errors */
async function http(path, init) {
  const api = apiBase();
  const url = `${api}${path.startsWith('/') ? path : '/' + path}`;
  const res = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init && init.headers),
    },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    const err = new Error(`HTTP ${res.status} – ${res.statusText}`);
    err.status = res.status;
    err.body = text;
    // Log pour debug sans casser l'UI
    console.error("Articles API error:", { url, status: res.status, body: text });
    throw err;
  }
  return res.json();
}

/** Normalize Strapi v4 entity to flat article */
function pickFirstMedia(media) {
  if (!media) return null;
  // Strapi: media.data peut être objet (single) ou tableau
  const m = Array.isArray(media.data) ? media.data[0] : media.data;
  if (!m || !m.attributes) return null;
  const a = m.attributes;
  return {
    url: a.url || null,
    formats: a.formats || null,
    mime: a.mime || null,
    width: a.width,
    height: a.height,
    alt: a.alternativeText || a.name || "",
  };
}

function normalizeArticle(entity) {
  if (!entity) return null;
  const id = entity.id;
  const a = entity.attributes || entity;

  // cover (media)
  const cover = pickFirstMedia(a.cover);

  // tags: string[] ou relation → on renvoie un tableau de strings
  const tags = Array.isArray(a.tags)
    ? a.tags
    : Array.isArray(a.tags?.data)
    ? a.tags.data.map((t) => t.attributes?.name || t.attributes?.title || `${t.id}`)
    : [];

  return {
    id,
    slug: a.slug || null,
    title: a.title || "",
    excerpt: a.excerpt || "",
    content: a.content || "",
    publishedAt: a.publishedAt || a.updatedAt || a.createdAt || null,
    cover,
    tags,
    source: a.source || "Manuel",
    sourceId: a.sourceId || null,
    sourceUrl: a.sourceUrl || null,
  };
}

/**
 * Fetch paginated list of articles
 */
export async function fetchActualites(opts = {}) {
  const {
    page = 1,
    pageSize = 10,
    sort = "publishedAt:desc",
    search,
    tags,
  } = opts;

  const qs = buildQS({
    populate: { cover: "*" },
    sort,
    pagination: { page, pageSize },
    ...(search
      ? {
          "filters[$or][0][title][$containsi]": search,
          "filters[$or][1][excerpt][$containsi]": search,
          "filters[$or][2][content][$containsi]": search,
        }
      : {}),
    // tags filter removed as per instructions
  });

  const data = await http(`/api/articles${qs}`);
  const items = Array.isArray(data?.data) ? data.data.map(normalizeArticle) : [];
  const pagination = data?.meta?.pagination || { page, pageSize, pageCount: 1, total: items.length };
  return { items, pagination };
}

/**
 * Fetch one article by slug
 */
export async function fetchActualiteBySlug(slug) {
  const qs = buildQS({
    populate: { cover: "*" },
    "filters[slug][$eq]": slug,
    publicationState: "live",
  });

  const data = await http(`/api/articles${qs}`);
  const items = Array.isArray(data?.data) ? data.data.map(normalizeArticle) : [];
  return items[0] || null;
}