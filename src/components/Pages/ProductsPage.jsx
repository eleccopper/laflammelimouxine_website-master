import React, { useEffect, useMemo, useState } from 'react';

// Util: normalise accents / casse
function norm(v) {
  if (v == null) return '';
  return String(v)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

/**
 * ProductFilters
 * Props attendus :
 *  - value: {
 *      category: null | string,
 *      type: string[],         // ex ["Air", "Canalisable"]
 *      brand: string[],        // ex ["MCZ"]
 *      powerMin: null|number|string,
 *      powerMax: null|number|string
 *    }
 *  - onChange: (next) => void  // appelé au clic sur "Appliquer"
 *  - types?: string[]          // optionnel (défaut: Air/Canalisable/Étanche)
 *  - brands?: string[]         // optionnel (défaut: longue liste fournie)
 */
export default function ProductFilters({
  value = { category: null, type: [], brand: [], powerMin: null, powerMax: null },
  onChange = () => {},
  types,
  brands,
}) {
  // Défauts si non fournis depuis l'extérieur
  const defaultTypes = useMemo(() => types ?? ['Air', 'Canalisable', 'Étanche'], [types]);

  const defaultBrands = useMemo(
    () =>
      brands ??
      [
        'MCZ',
        'EDILKAMIN',
        'Herz',
        'HARGASNER',
        'STOVAX GAZO',
        'ROCAL',
        'LACUNZA',
        'SCAN',
        'ILD',
        'GODIN',
        'BECAFIRE',
        'COLOR AND FIRE',
        'MORSO',
        'JACOBUS',
        'TURBO FONTE',
        'EXTRA FLAMME  NORDICA',
        'ARTENSE',
        'EMBER',
        'NEOCUBE',
        'DEMANINCOR',
        'WECOS',
        'JIDE',
        'jeremias',
        'ice srtream',
      ],
    [brands]
  );

  // État local "brouillon" pour ne pas filtrer à chaque frappe
  const [draft, setDraft] = useState({
    category: value?.category ?? null,
    type: Array.isArray(value?.type) ? value.type : [],
    brand: Array.isArray(value?.brand) ? value.brand : [],
    powerMin: value?.powerMin ?? null,
    powerMax: value?.powerMax ?? null,
  });

  // Si la valeur externe change (réinit depuis la page), on resynchronise
  useEffect(() => {
    setDraft({
      category: value?.category ?? null,
      type: Array.isArray(value?.type) ? value.type : [],
      brand: Array.isArray(value?.brand) ? value.brand : [],
      powerMin: value?.powerMin ?? null,
      powerMax: value?.powerMax ?? null,
    });
  }, [value?.category, value?.type, value?.brand, value?.powerMin, value?.powerMax]);

  // Helpers mise à jour
  const toggleType = (t) => {
    setDraft((prev) => {
      const has = prev.type.some((x) => norm(x) === norm(t));
      const next = has ? prev.type.filter((x) => norm(x) !== norm(t)) : [...prev.type, t];
      return { ...prev, type: next };
    });
  };

  const onBrandChange = (e) => {
    const val = e.target.value;
    setDraft((prev) => ({ ...prev, brand: val ? [val] : [] }));
  };

  const onMinChange = (e) => {
    const v = e.target.value;
    setDraft((prev) => ({ ...prev, powerMin: v === '' ? null : v }));
  };

  const onMaxChange = (e) => {
    const v = e.target.value;
    setDraft((prev) => ({ ...prev, powerMax: v === '' ? null : v }));
  };

  const apply = () => {
    // On garantit bien la structure attendue par ProductsPage.jsx
    const next = {
      category: draft.category ?? null,
      type: Array.isArray(draft.type) ? draft.type : [],
      brand: Array.isArray(draft.brand) ? draft.brand : draft.brand ? [draft.brand] : [],
      powerMin: draft.powerMin ?? null,
      powerMax: draft.powerMax ?? null,
    };
    onChange(next);
  };

  const reset = () => {
    setDraft({ category: null, type: [], brand: [], powerMin: null, powerMax: null });
    onChange({ category: null, type: [], brand: [], powerMin: null, powerMax: null });
  };

  return (
    <div className="cs-filters_wrap">
      <div className="cs-filters_grid">
        {/* Type (checkbox) */}
        <div className="cs-filter_block">
          <label className="cs-filter_label">Type</label>
          <div className="cs-filter_checks">
            {defaultTypes.map((t) => {
              const checked = draft.type.some((x) => norm(x) === norm(t));
              return (
                <label key={t} className="cs-check">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleType(t)}
                  />
                  <span>{t}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Marque (select simple) */}
        <div className="cs-filter_block">
          <label className="cs-filter_label" htmlFor="brandSelect">
            Marque
          </label>
          <select
            id="brandSelect"
            className="cs-select"
            value={draft.brand[0] ?? ''}
            onChange={onBrandChange}
          >
            <option value="">Toutes les marques</option>
            {defaultBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Puissance */}
        <div className="cs-filter_block">
          <label className="cs-filter_label">Puissance (kW)</label>
          <div className="cs-filter_range">
            <input
              type="number"
              inputMode="decimal"
              placeholder="Min"
              className="cs-input"
              value={draft.powerMin ?? ''}
              onChange={onMinChange}
            />
            <span className="cs-range_sep">—</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="Max"
              className="cs-input"
              value={draft.powerMax ?? ''}
              onChange={onMaxChange}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="cs-filter_actions">
        <button type="button" className="cs-btn cs-btn--secondary" onClick={reset}>
          Réinitialiser
        </button>
        <button type="button" className="cs-btn" onClick={apply}>
          Appliquer les filtres
        </button>
      </div>
    </div>
  );
}
