export function absoluteMediaUrl(path) {
  const base = (process.env.REACT_APP_STRAPI_URL || "").replace(/\/+$/, "");
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
