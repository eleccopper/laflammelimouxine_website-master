// utils to build correct URLs for Strapi API and media assets.
// IMPORTANT:
// - REACT_APP_STRAPI_URL should point to the API base and MAY include "/api"
//   e.g. "https://lfl-back-73da1a8c4e08.herokuapp.com/api"
// - Media files are served WITHOUT "/api" ("/uploads/...").
//   So we derive an ASSETS_BASE that strips a trailing "/api".

const RAW_STRAPI_URL =
  (process.env.REACT_APP_STRAPI_URL || "https://lfl-back-73da1a8c4e08.herokuapp.com/api").replace(
    /\/+$/,
    ""
  );

// Base for API calls (may include "/api")
export const API_BASE = RAW_STRAPI_URL;

// Base for media assets (must NOT include "/api")
export const ASSETS_BASE = API_BASE.replace(/\/api$/, "");

/**
 * Return an absolute URL for a Strapi media path.
 * Accepts:
 *  - absolute URLs (returned as-is)
 *  - relative paths like "/uploads/xxx.jpg" or "uploads/xxx.jpg"
 */
export function absoluteMediaUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${ASSETS_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

/**
 * Return an absolute API URL for a given path.
 * Example: absoluteApiUrl("/articles?populate[image]=*")
 * NOTE: Do NOT pass a path that already contains "/api" in front.
 */
export function absoluteApiUrl(path = "") {
  const clean = String(path || "");
  if (!clean) return API_BASE;
  return `${API_BASE}${clean.startsWith("/") ? "" : "/"}${clean}`;
}