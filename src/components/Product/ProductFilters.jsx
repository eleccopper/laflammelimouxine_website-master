import React, { useMemo, useState, useEffect } from "react";

/**
 * ProductFilters
 * ---------------
 * Controlled component for product catalog filtering.
 *
 * Props:
 * - value: {
 *     category: string|null,
 *     type: string[],           // e.g. ["air","canalisable"]
 *     brand: string[],          // e.g. ["MCZ","Rika"]
 *     powerMin: number|null,    // kW
 *     powerMax: number|null
 *   }
 * - onChange: (next) => void
 * - categories?: Array<{ label: string, value: string }>
 * - types?: string[]           // ["air","canalisable","etanche","hydro"]
 * - brands?: string[]          // ["MCZ","Rika","Edilkamin","Autre"]
 * - powerRange?: { min: number, max: number, step?: number }
 */

const DEFAULT_CATEGORIES = [
  { label: "Tous", value: "" },
  { label: "Poêles à granulés", value: "5" },
  { label: "Poêles à bois", value: "11" },
  { label: "Cuisinière à bois", value: "36" },
  { label: "Insert à bois", value: "38" },
  { label: "Insert à granulés", value: "41" },
  { label: "Cheminée à bois", value: "43" },
  { label: "Chaudière à bois", value: "47" },
  { label: "Chaudière à granulés", value: "49" },
  { label: "Pompe à chaleur", value: "51" },
  { label: "Cimatisation", value: "53" }
];

const DEFAULT_TYPES = ["air", "canalisable", "etanche", "hydro"];
const DEFAULT_BRANDS = [
  "MCZ",
  "EDILKAMIN",
  "Herz",
  "HARGASNER",
  "STOVAX GAZO",
  "ROCAL",
  "LACUNZA",
  "SCAN",
  "ILD",
  "GODIN",
  "BECAFIRE",
  "COLOR AND FIRE",
  "MORSO",
  "JACOBUS",
  "TURBO FONTE",
  "EXTRA FLAMME  NORDICA",
  "ARTENSE",
  "EMBER",
  "NEOCUBE",
  "DEMANINCOR",
  "WECOS",
  "JIDE",
  "jeremias",
  "ice srtream"
];

export default function ProductFilters({
  value,
  onChange,
  categories = DEFAULT_CATEGORIES,
  types = DEFAULT_TYPES,
  brands = DEFAULT_BRANDS,
  powerRange = { min: 0, max: 20, step: 0.5 },
}) {
  const v = useMemo(() => normalizeValue(value), [value]);

  // Local "draft" state: user edits don't apply until "Appliquer"
  const [draft, setDraft] = useState(v);
  useEffect(() => {
    // Keep local draft in sync if parent value changes externally
    setDraft(v);
  }, [v]);

  // Update only the local draft
  const set = (patch) => setDraft((prev) => ({ ...prev, ...patch }));

  const toggleIn = (key, item) => {
    const arr = new Set((draft && draft[key]) || []);
    if (arr.has(item)) arr.delete(item);
    else arr.add(item);
    set({ [key]: Array.from(arr) });
  };

  const handleNumber = (key, raw) => {
    if (raw === "" || raw === null || raw === undefined) return set({ [key]: null });
    const num = Number(raw);
    if (Number.isNaN(num)) return;
    set({ [key]: num });
  };

  const reset = () => {
    const empty = {
      category: null,
      type: [],
      brand: [],
      powerMin: null,
      powerMax: null,
    };
    setDraft(empty);
    onChange(empty);
  };

  const applyFilters = () => onChange(normalizeValue(draft));

  return (
    <form className="lfl-filters" onSubmit={(e) => e.preventDefault()} aria-label="Filtres produits">
      <div className="lfl-filters__row">
        {/* Category */}
        <div className="lfl-filter lfl-filter--category">
          <label htmlFor="filter-category" className="lfl-filter__label">Catégorie</label>
          <select
            id="filter-category"
            className="lfl-filter__select"
            value={draft.category ?? ""}
            onChange={(e) => set({ category: e.target.value || null })}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Type (multi) */}
        <fieldset className="lfl-filter lfl-filter--type">
          <legend className="lfl-filter__label">Type</legend>
          <div className="lfl-filter__group">
            {types.map((t) => (
              <label key={t} className="lfl-check">
                <input
                  type="checkbox"
                  checked={draft.type.includes(t)}
                  onChange={() => toggleIn("type", t)}
                />
                <span className="lfl-check__text">{labelizeType(t)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Brand (multi) */}
        <fieldset className="lfl-filter lfl-filter--brand">
          <legend className="lfl-filter__label">Marque</legend>
          <div className="lfl-filter__group">
            {brands.map((b) => (
              <label key={b} className="lfl-check">
                <input
                  type="checkbox"
                  checked={draft.brand.includes(b)}
                  onChange={() => toggleIn("brand", b)}
                />
                <span className="lfl-check__text">{b}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Power range */}
        <fieldset className="lfl-filter lfl-filter--power">
          <legend className="lfl-filter__label">Puissance (kW)</legend>
          <div className="lfl-filter__range">
            <label className="lfl-number">
              <span>Min</span>
              <input
                type="number"
                inputMode="decimal"
                min={powerRange.min}
                max={powerRange.max}
                step={powerRange.step ?? 0.5}
                value={draft.powerMin ?? ""}
                onChange={(e) => handleNumber("powerMin", e.target.value)}
                placeholder={String(powerRange.min)}
                aria-label="Puissance minimale en kilowatts"
              />
            </label>
            <span className="lfl-range-sep">–</span>
            <label className="lfl-number">
              <span>Max</span>
              <input
                type="number"
                inputMode="decimal"
                min={powerRange.min}
                max={powerRange.max}
                step={powerRange.step ?? 0.5}
                value={draft.powerMax ?? ""}
                onChange={(e) => handleNumber("powerMax", e.target.value)}
                placeholder={String(powerRange.max)}
                aria-label="Puissance maximale en kilowatts"
              />
            </label>
          </div>
        </fieldset>

        {/* Reset and Apply */}
        <div className="lfl-filter lfl-filter--actions">
          <button type="button" className="lfl-btn lfl-btn--reset" onClick={reset} aria-label="Réinitialiser les filtres">
            Réinitialiser
          </button>
          <button type="button" className="lfl-btn lfl-btn--apply" onClick={applyFilters} aria-label="Appliquer les filtres">
            Appliquer les filtres
          </button>
        </div>
      </div>

      {/* Minimal inline styles (scoped by className prefix) */}
      <style>{`
        .lfl-filters { display: block; margin: 1rem 0 1.25rem; padding: .75rem; border-radius: 8px; background: #fafafa; border: 1px solid #eee; }
        .lfl-filters__row { display: grid; grid-template-columns: repeat(12, 1fr); gap: .75rem; align-items: start; }
        .lfl-filter { display: block; }
        .lfl-filter--category { grid-column: span 3; min-width: 180px; }
        .lfl-filter--type { grid-column: span 3; }
        .lfl-filter--brand { grid-column: span 3; }
        .lfl-filter--power { grid-column: span 2; }
        .lfl-filter--actions { grid-column: span 1; display: flex; align-items: end; }
        .lfl-filter--actions { gap:.5rem; flex-wrap:wrap; }
        @media (max-width: 980px) {
          .lfl-filter--category, .lfl-filter--type, .lfl-filter--brand, .lfl-filter--power, .lfl-filter--actions { grid-column: span 12; }
        }
        .lfl-filter__label { display:block; font-weight:600; margin: 0 0 .35rem; font-size:.95rem; }
        .lfl-filter__select { width:100%; padding:.5rem .6rem; border:1px solid #ddd; border-radius:6px; background:#fff; }
        .lfl-filter__group { display:flex; flex-wrap:wrap; gap:.5rem .75rem; }
        .lfl-check { display:inline-flex; align-items:center; gap:.4rem; padding:.25rem .4rem; border:1px solid #e7e7e7; border-radius:6px; background:#fff; cursor:pointer; user-select:none; }
        .lfl-check input { accent-color:#111; }
        .lfl-number { display:flex; flex-direction:column; gap:.25rem; }
        .lfl-number input { width:100%; padding:.45rem .55rem; border:1px solid #ddd; border-radius:6px; }
        .lfl-range-sep { align-self:center; padding: 0 .25rem; }
        .lfl-btn { appearance:none; border:none; cursor:pointer; font-weight:600; }
        .lfl-btn--reset { padding:.55rem .8rem; border-radius:6px; background:#f1f1f1; border:1px solid #e1e1e1; }
        .lfl-btn--reset:hover { background:#e9e9e9; }
        .lfl-btn--apply { padding:.55rem .8rem; border-radius:6px; background:#111; color:#fff; }
        .lfl-btn--apply:hover { background:#333; }
      `}</style>
    </form>
  );
}

function normalizeValue(v) {
  return {
    category: v?.category ?? null,
    type: Array.isArray(v?.type) ? v.type : [],
    brand: Array.isArray(v?.brand) ? v.brand : [],
    powerMin: v?.powerMin ?? null,
    powerMax: v?.powerMax ?? null,
  };
}

function labelizeType(t) {
  switch (t) {
    case "air": return "Air";
    case "canalisable": return "Canalisable";
    case "etanche": return "Étanche";
    case "hydro": return "Hydro";
    default: return t;
  }
}

/**
 * Normalized access helpers to read product fields despite API shape differences
 */
function getCategoryId(product) {
  // Support several shapes: product.category.id, product.categorie.id, product.attributes.category.data.id
  const p = product || {};
  const direct = p.category?.id || p.categorie?.id || p.categoryId || p.categorieId;
  const attrRel = p.attributes?.category?.data?.id || p.attributes?.categorie?.data?.id;
  return direct ?? attrRel ?? null;
}

function getTypeArray(product) {
  const t = product?.type || product?.attributes?.type || product?.attributes?.Type;
  if (!t) return [];
  return Array.isArray(t) ? t : [String(t)];
}

function getBrand(product) {
  return (
    product?.brand ||
    product?.marque ||
    product?.attributes?.brand ||
    product?.attributes?.marque ||
    null
  );
}

function getPower(product) {
  const v =
    product?.powerKw ??
    product?.power ??
    product?.puissance ??
    product?.attributes?.powerKw ??
    product?.attributes?.power ??
    product?.attributes?.puissance ??
    null;
  return typeof v === "number" ? v : v != null ? Number(v) : null;
}

/**
 * Public helper: test if a product matches the current filters
 * Usage: products.filter(p => productMatchesFilters(p, filters))
 */
export function productMatchesFilters(product, filters) {
  const f = normalizeValue(filters);

  // Category (by id string/number)
  if (f.category && String(getCategoryId(product)) !== String(f.category)) {
    return false;
  }

  // Type (at least one selected must match). Filter values are lowercased.
  if (f.type.length) {
    const prodTypes = getTypeArray(product).map((x) => String(x).toLowerCase());
    const ok = f.type.some((val) => prodTypes.includes(String(val).toLowerCase()));
    if (!ok) return false;
  }

  // Brand (at least one). Case-insensitive.
  if (f.brand.length) {
    const b = getBrand(product);
    const prodBrand = b ? String(b).toLowerCase() : "";
    const ok = f.brand.some((val) => prodBrand === String(val).toLowerCase());
    if (!ok) return false;
  }

  // Power min/max
  const pwr = getPower(product);
  if (f.powerMin != null && pwr != null && pwr < f.powerMin) return false;
  if (f.powerMax != null && pwr != null && pwr > f.powerMax) return false;

  return true;
}

// Also export the lists so the parent can import them if needed
export const FILTER_CATEGORIES = DEFAULT_CATEGORIES;
export const FILTER_BRANDS = DEFAULT_BRANDS;
export const FILTER_TYPES = DEFAULT_TYPES;
