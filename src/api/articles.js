

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
 *   cover: { url, formats? },
 *   tags: string[],
 *   source, sourceId, sourceUrl
 * }
 */

const BASE_URL =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_STRAPI_URL) ||
  "";

/** Ensure we have a base URL without trailing slash */
function getApiBase() {
  const b = BASE_URL || "";
  if (!b) return "";
  return b.endsWith("/") ? b.slice(0, -1) : b;
}

/** Small helper to build nested Strapi query strings */
function buildQS(params = {}) {
  const sp = new URLSearchParams();

  const append = (key, val) => {
    if (val === undefined || val === null || val === "") return;
    if (Array.isArray(val)) {
      // encode arrays as repeated keys (works with [$in] etc.)
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
  const api = getApiBase();
  const url = `${api}${path}`;
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
    throw err;
  }
  return res.json();
}

/** Normalize Strapi v4 entity to flat article */
function normalizeArticle(entity) {
  if (!entity) return null;
  // Strapi v4: { id, attributes: { ... } }
  const id = entity.id;
  const a = entity.attributes || entity;

  // cover (media)
  let cover = null;
  const cov = a.cover?.data;
  if (cov) {
    const ca = cov.attributes || {};
    cover = {
      url: ca.url || null,
      formats: ca.formats || null,
      mime: ca.mime || null,
      width: ca.width,
      height: ca.height,
      alt: ca.alternativeText || a.title || "",
    };
  }

  // tags may be repeatable text or a relation; handle simple array
  const tags = Array.isArray(a.tags)
    ? a.tags
    : Array.isArray(a.tags?.data)
    ? a.tags.data.map((t) => (t.attributes?.name || t.attributes?.title || t.id))
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
    source: a.source || "manual",
    sourceId: a.sourceId || null,
    sourceUrl: a.sourceUrl || null,
  };
}

/**
 * Fetch paginated list of articles
 * @param {Object} opts
 * @param {number} opts.page
 * @param {number} opts.pageSize
 * @param {string} opts.sort - e.g. 'publishedAt:desc'
 * @param {string} [opts.search] - fulltext (optional)
 * @param {string[]|string} [opts.tags] - filter by tags (if present)
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
    populate: {
      cover: "*",
      tags: "true",
    },
    sort,
    pagination: { page, pageSize },
    ...(search
      ? {
          "filters[$or][0][title][$containsi]": search,
          "filters[$or][1][excerpt][$containsi]": search,
          "filters[$or][2][content][$containsi]": search,
        }
      : {}),
    ...(tags
      ? {
          "filters[tags][$in]": Array.isArray(tags) ? tags : [tags],
        }
      : {}),
  });

  const data = await http(`/api/articles${qs}`);
  const items = Array.isArray(data?.data) ? data.data.map(normalizeArticle) : [];
  const pagination = data?.meta?.pagination || { page, pageSize, pageCount: 1, total: items.length };

  return { items, pagination };
}

/**
 * Fetch one article by slug
 * @param {string} slug
 */
export async function fetchActualiteBySlug(slug) {
  const qs = buildQS({
    populate: {
      cover: "*",
      tags: "true",
    },
    "filters[slug][$eq]": slug,
    publicationState: "live",
  }); 

  const data = await http(`/api/articles${qs}`);
  const items = Array.isArray(data?.data) ? data.data.map(normalizeArticle) : [];
  return items[0] || null;
}