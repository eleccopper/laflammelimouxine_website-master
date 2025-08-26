import { absoluteMediaUrl } from './strapiUrl';

// src/utils/images.js
// Utility helpers to select the best image URL from Strapi/Cloudinary
// and avoid blurry thumbnails by preferring larger formats.

/**
 * Pick the best image URL available from a Strapi media field.
 * Supports both nested (v4/v5) and flattened objects.
 *
 * @param {object} img        Strapi media object (may be nested under img.data.attributes)
 * @param {number} wantWidth  Target display width in px (default 1200)
 * @returns {string}          Best URL to use
 */
export const getBestImageUrl = (img, wantWidth = 1200) => {
  if (!img) return '';

  // Support both flattened media (img.url, img.formats) and nested (img.data.attributes)
  const media = img?.data?.attributes ? img.data.attributes : img;
  if (!media) return '';

  const formats = media.formats || {};
  const candidates = [
    { w: 1600, u: formats.large?.url },
    { w: 1000, u: formats.medium?.url },
    { w: 600,  u: formats.small?.url },
    { w: 245,  u: formats.thumbnail?.url },
  ].filter((c) => c.u);

  // Prefer the smallest format that is >= wantWidth, otherwise fallback to the largest available
  // Sort candidates by width ascending
  const sorted = [...candidates].sort((a, b) => a.w - b.w);
  // Find the smallest available format larger than wantWidth
  const best = sorted.find((c) => c.w >= wantWidth) || sorted[sorted.length - 1];
  return best?.u || media.url || '';
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
  // Insert transformations right after '/upload/'
  const marker = '/upload/';
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const parts = [];
  if (width) parts.push(`w_${width}`);
  if (format) parts.push(`f_${format}`);
  if (quality) parts.push(`q_${quality}`);
  const transform = parts.join(',');

  // If there are already transformations, append ours at the beginning
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