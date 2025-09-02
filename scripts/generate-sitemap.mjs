

// scripts/generate-sitemap.mjs
// Generate sitemap.xml by fetching slugs from Strapi v4 (with pagination).
// Usage examples:
//   SITE_URL="https://laflammelimouxine.fr" STRAPI_URL="https://cms.laflammelimouxine.fr" node scripts/generate-sitemap.mjs
//   SITE_URL="https://laflammelimouxine.fr" STRAPI_URL="http://localhost:1337" STRAPI_TOKEN="<optional PAT>" node scripts/generate-sitemap.mjs

import fs from 'fs';

// ======= Configuration via ENV =======
const SITE_URL = (process.env.SITE_URL || 'https://laflammelimouxine.fr').replace(/\/$/, '');
const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

// Optional tuning
const DEFAULT_CHANGEFREQ = 'weekly';
const HOMEPAGE_PRIORITY = '0.8';
const DEFAULT_PRIORITY = '0.5';

// ======= Helpers =======
function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function withDate(d) {
  try {
    if (!d) return new Date().toISOString().slice(0, 10);
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return new Date().toISOString().slice(0, 10);
    return dt.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

async function fetchPaged(path) {
  const items = [];
  let page = 1;
  const pageSize = 100;
  while (true) {
    const url = `${STRAPI_URL}${path}${path.includes('?') ? '&' : '?'}pagination[page]=${page}&pagination[pageSize]=${pageSize}&publicationState=live`;
    const headers = { Accept: 'application/json' };
    if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`;

    const res = await fetch(url, { headers });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Strapi request failed ${res.status} ${res.statusText} on ${url} -> ${body.slice(0, 200)}...`);
    }
    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : [];
    items.push(...data);

    const meta = json?.meta?.pagination;
    if (!meta || page >= meta.pageCount) break;
    page += 1;
  }
  return items;
}

function urlTag(loc, lastmod, priority = DEFAULT_PRIORITY, changefreq = DEFAULT_CHANGEFREQ) {
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${xmlEscape(lastmod)}</lastmod>\n    <changefreq>${xmlEscape(changefreq)}</changefreq>\n    <priority>${xmlEscape(priority)}</priority>\n  </url>`;
}

async function main() {
  const sitemapUrls = new Map(); // loc -> { lastmod, priority }

  // Static pages
  const today = new Date().toISOString().slice(0, 10);
  const staticRoutes = [
    ['/', HOMEPAGE_PRIORITY],
    ['/products', DEFAULT_PRIORITY],
    ['/services', DEFAULT_PRIORITY],
    ['/actualites', DEFAULT_PRIORITY],
    ['/contact', DEFAULT_PRIORITY],
    ['/legalnotice', DEFAULT_PRIORITY],
  ];
  staticRoutes.forEach(([p, prio]) => {
    sitemapUrls.set(`${SITE_URL}${p}`, { lastmod: today, priority: prio });
  });

  // Products: /products/:slug
  try {
    const products = await fetchPaged('/api/products?fields[0]=slug&fields[1]=updatedAt');
    for (const p of products) {
      const slug = p?.attributes?.slug;
      if (!slug) continue;
      const lastmod = withDate(p?.attributes?.updatedAt);
      sitemapUrls.set(`${SITE_URL}/products/${slug}`, { lastmod, priority: DEFAULT_PRIORITY });
    }
    console.log(`[sitemap] Products: ${products.length} entries`);
  } catch (e) {
    console.warn('[sitemap] Products skipped:', e.message);
  }

  // Services: /services/:category/:slug (populate category.slug)
  try {
    const services = await fetchPaged('/api/services?fields[0]=slug&fields[1]=updatedAt&populate[category][fields][0]=slug');
    for (const s of services) {
      const slug = s?.attributes?.slug;
      const cat = s?.attributes?.category?.data?.attributes?.slug;
      if (!slug || !cat) continue;
      const lastmod = withDate(s?.attributes?.updatedAt);
      sitemapUrls.set(`${SITE_URL}/services/${cat}/${slug}`, { lastmod, priority: DEFAULT_PRIORITY });
    }
    console.log(`[sitemap] Services: ${services.length} entries`);
  } catch (e) {
    console.warn('[sitemap] Services skipped:', e.message);
  }

  // Actualités: /actualites/:slug
  try {
    const news = await fetchPaged('/api/actualites?fields[0]=slug&fields[1]=updatedAt');
    for (const n of news) {
      const slug = n?.attributes?.slug;
      if (!slug) continue;
      const lastmod = withDate(n?.attributes?.updatedAt);
      sitemapUrls.set(`${SITE_URL}/actualites/${slug}`, { lastmod, priority: DEFAULT_PRIORITY });
    }
    console.log(`[sitemap] Actualites: ${news.length} entries`);
  } catch (e) {
    console.warn('[sitemap] Actualites skipped:', e.message);
  }

  // Build XML
  const pieces = [];
  pieces.push('<?xml version="1.0" encoding="UTF-8"?>');
  pieces.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  for (const [loc, meta] of Array.from(sitemapUrls.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    pieces.push(urlTag(loc, meta.lastmod || today, meta.priority || DEFAULT_PRIORITY));
  }
  pieces.push('</urlset>\n');

  // Write file
  fs.writeFileSync('./public/sitemap.xml', pieces.join('\n'), 'utf-8');
  console.log(`[sitemap] Wrote ./public/sitemap.xml with ${sitemapUrls.size} URLs`);
}

main().catch((err) => {
  console.error('[sitemap] Generation failed:', err);
  process.exit(1);
});