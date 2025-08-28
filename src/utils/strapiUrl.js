export function absoluteMediaUrl(path) {
  const base = (process.env.REACT_APP_STRAPI_URL || "").replace(/\/+$/, "");
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function absoluteApiUrl(path) {
  const base = (process.env.REACT_APP_STRAPI_URL || "").replace(/\/+$/, "");
  if (!path) return `${base}/api`;
  return `${base}/api${path.startsWith("/") ? "" : "/"}${path}`;
}
