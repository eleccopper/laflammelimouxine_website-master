import { absoluteMediaUrl } from './strapiUrl';

// src/utils/images.js
// Utility helpers to select the best image URL from Strapi/Cloudinary
// and avoid blurry thumbnails by preferring larger formats.

/**
 * Normalize any Strapi media field shape into a simple media object
 * that contains { url, formats? }. Handles:
 *  - string URL
 *  - flattened media (url, formats)
 *  - nested v4/v5 { data: { attributes: { ... } } }
 *  - arrays (takes the first element)
 */
const normalizeMedia = (input) => {
  if (!input) return null;

  // If an array of media is passed, use the first one
  if (Array.isArray(input)) {
    return normalizeMedia(input[0]);
  }

  // If a plain string is passed, treat it as the url
  if (typeof input === 'string') {
    return { url: input };
  }

  // Strapi nested shape: { data: {...} } or { data: [{...}] }
  if (input?.data) {
    const node = Array.isArray(input.data) ? input.data[0] : input.data;
    const attrs = node?.attributes || node;
    if (attrs) return attrs;
  }

  // Some responses flatten directly to attributes-like object
  if (input?.attributes) return input.attributes;

  // Otherwise assume it's already a media object
  return input;
};

/**
 * Pick the best image URL available from a Strapi media field.
 * Supports both nested (v4/v5) and flattened objects.
 *
 * @param {object|string|array} img  Strapi media (string URL, object, or array)
 * @param {number} wantWidth         Target display width in px (default 1200)
 * @returns {string}                 Absolute best URL to use
 */
export const getBestImageUrl = (img, wantWidth = 1200) => {
  const media = normalizeMedia(img);
  if (!media) return '';

  const formats = media.formats || {};
  const candidates = [
    { w: 1600, u: formats.large?.url },
    { w: 1200, u: formats.xlarge?.url }, // in case a custom size exists
    { w: 1000, u: formats.medium?.url },
    { w: 600,  u: formats.small?.url },
    { w: 245,  u: formats.thumbnail?.url },
  ].filter((c) => !!c.u);

  // Sort by width ascending and choose the smallest >= wantWidth,
  // else fallback to the largest available format
  const sorted = candidates.sort((a, b) => a.w - b.w);
  const picked = sorted.find((c) => c.w >= wantWidth) || sorted[sorted.length - 1];

  let url = picked?.u || media.url || '';
  if (!url) return '';

  // If relative, convert to absolute using backend URL
  if (!/^https?:\/\//i.test(url)) {
    url = absoluteMediaUrl(url);
  }
  return url;
};

/**
 * Optionally apply Cloudinary transformations if the URL is a Cloudinary URL.
 * Example: width=1200, auto format/quality -> w_1200,f_auto,q_auto
 * If the URL is not Cloudinary, returns the original.
 *
 * @param {string} url    Original image URL
 * @param {object} opts   { width?: number, quality?: string | 'auto', format?: string | 'auto' }
 * @returns {string}
 */
export const withCloudinaryTransform = (url, opts = {}) => {
  if (!url || typeof url !== 'string') return '';
  const isCloudinary = /res\.cloudinary\.com\//.test(url);
  if (!isCloudinary) return url;

  const { width, quality = 'auto', format = 'auto' } = opts;

  // Cloudinary URL structure: https://res.cloudinary.com/<cloud>/image/upload/<transformations>/v.../path
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const parts = [];
  if (width) parts.push(`w_${width}`);
  if (format) parts.push(`f_${format}`);
  if (quality) parts.push(`q_${quality}`);
  const transform = parts.join(',');

  const before = url.slice(0, idx + marker.length);
  const after = url.slice(idx + marker.length);

  if (!transform) return url;
  return `${before}${transform}/${after}`;
};

// Default export for convenience
export default {
  getBestImageUrl,
  withCloudinaryTransform,
};