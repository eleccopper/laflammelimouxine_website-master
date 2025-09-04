import { Icon } from '@iconify/react';
import React, { useEffect, useMemo, useState } from 'react';
import { pageTitle } from '../../helper';
import Cta from '../Cta';
import PageHeading from '../PageHeading';
import Product from '../Product';
import Div from '../Div';
import SectionHeading from '../SectionHeading';
import Spacing from '../Spacing';
import config from '../../config/config';
import { getBestImageUrl } from '../../utils/images';
import ProductFilters from '../Product/ProductFilters';
import '../../styles/filters.css';

function norm(v) {
  if (v == null) return '';
  return String(v)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function toNumberLoose(v) {
  if (v == null || v === '') return NaN;
  const s = String(v).replace(',', '.').replace(/[^\d.+-]/g, '');
  const n = Number(s);
  return Number.isFinite(n) ? n : NaN;
}

export default function ProductsPage() {
  pageTitle('Produits');

  // Onglet catégorie (barre du haut) + pagination
  const [active, setActive] = useState('all');
  const [itemShow, setItemShow] = useState(9);

  // Données
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filtres avancés (venant du composant ProductFilters)
  const [filters, setFilters] = useState({
    category: null,  // optionnel si tu ajoutes un select catégorie dans ProductFilters
    type: [],        // ex: ["Air", "Canalisable", "Etanche"]
    brand: [],       // ex: ["MCZ", "Edilkamin", ...]
    powerMin: null,  // number ou string convertible
    powerMax: null,  // number ou string convertible
  });

  const strapiUrl = config.strapiUrl;

  // Toujours remonter en haut quand on arrive sur la page Produits
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch {
      window.scrollTo(0, 0);
    }
  }, []);

  // Fetch produits + catégories

  // Helper: récupère **toutes** les pages Strapi (évite la limite par défaut 25)
  async function fetchAll(strapiBaseUrl, resource, populate = '*') {
    const all = [];
    let page = 1;
    const pageSize = 100; // ajuste si besoin
    while (true) {
      const url = `${strapiBaseUrl}/${resource}?populate=${encodeURIComponent(populate)}&pagination[page]=${page}&pagination[pageSize]=${pageSize}`;
      const res = await fetch(url);
      const json = await res.json();
      const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      all.push(...data);
      const pageCount = json?.meta?.pagination?.pageCount || 1;
      if (page >= pageCount) break;
      page += 1;
    }
    return all;
  }

  useEffect(() => {
    (async () => {
      try {
        const [allProducts, allCategories] = await Promise.all([
          fetchAll(strapiUrl, 'products', '*'),
          fetchAll(strapiUrl, 'categories', '*'),
        ]);
        setProducts(allProducts);
        setCategories(allCategories);
      } catch (e) {
        console.error('Error fetching products/categories:', e);
      }
    })();
  }, [strapiUrl]);

  // Normalisation/lecture tolérante des champs d'un produit (Strapi v4/v5, champs à plat ou sous attributes)
  function pickAttr(obj, key) {
    if (!obj) return undefined;
    if (obj[key] != null) return obj[key];
    if (obj.attributes?.[key] != null) return obj.attributes[key];
    return undefined;
  }

  // Récupère tous les noms de catégories d'un produit, quel que soit le modèle
  function getAllCategoryNames(product) {
    const a = product?.attributes || product;

    // Cas 1 : relation multiple (v4/v5) => attributes.categories.data[*].attributes.name
    const nested = a?.categories?.data?.map((c) => c?.attributes?.name).filter(Boolean) || [];

    // Cas 2 : relation multiple variant "à plat"
    const flatData = product?.categories?.data?.map((c) => c?.attributes?.name || c?.name).filter(Boolean) || [];
    const flat = product?.categories?.map((c) => c?.attributes?.name || c?.name).filter(Boolean) || [];

    // Cas 3 : relation simple category / category.data
    const singleNested = a?.category?.data?.attributes?.name ? [a.category.data.attributes.name] : [];
    const singleFlat = a?.category?.name ? [a.category.name] : [];

    return [...nested, ...flatData, ...flat, ...singleNested, ...singleFlat].filter(Boolean);
  }

  // Liste filtrée (catégorie onglet + filtres avancés)
  const filteredProducts = useMemo(() => {
    const activeNorm = norm(active);
    const wantedTypes = (filters?.type ?? []).map(norm);
    const wantedBrands = (filters?.brand ?? []).map(norm);

    const min = toNumberLoose(filters?.powerMin);
    const max = toNumberLoose(filters?.powerMax);
    const hasMin = Number.isFinite(min);
    const hasMax = Number.isFinite(max);
    const hasType = wantedTypes.length > 0;
    const hasBrand = wantedBrands.length > 0;

    return (products || []).filter((p) => {
      const a = p?.attributes || p;

      // Catégorie (onglet actif)
      if (activeNorm !== 'all') {
        const names = getAllCategoryNames(p).map(norm);
        if (!names.includes(activeNorm)) return false;
      }

      // Type
      if (hasType) {
        const prodType = pickAttr(a, 'type');
        if (!prodType || !wantedTypes.includes(norm(prodType))) return false;
      }

      // Marque
      if (hasBrand) {
        const prodBrand = pickAttr(a, 'brand');
        if (!prodBrand || !wantedBrands.includes(norm(prodBrand))) return false;
      }

      // Puissance
      const kwRaw =
        pickAttr(a, 'power_kw') ??
        pickAttr(a, 'powerKw') ??
        pickAttr(a, 'puissance');

      const prodKw = toNumberLoose(kwRaw);

      if (hasMin && (!Number.isFinite(prodKw) || prodKw < min)) return false;
      if (hasMax && (!Number.isFinite(prodKw) || prodKw > max)) return false;

      return true;
    });
  }, [products, active, filters]);

  // util pour la clé de liste
  const getProductId = (product) =>
    product.documentId || product.id || product.slug || product?.attributes?.slug;

  return (
    <>
      <PageHeading
        title="Produits"
        bgSrc="images/products_hero_bg.jpg"
        pageLinkText="Produits"
      />
      <Spacing lg="145" md="80" />
      <Div className="container">
        <Div className="cs-portfolio_1_heading">
          <SectionHeading title="Catalogue" subtitle="Nos produits" />
          <Div className="cs-filter_menu cs-style1">
            <ul className="cs-mp0 cs-center">
              <li className={active === 'all' ? 'active' : ''} onClick={() => { setActive('all'); setItemShow(9); }}>
                <span>Tous</span>
              </li>
              {categories.map((category) => {
                const name = category?.attributes?.name || category?.name || '';
                const id = category?.id || name;
                return (
                  <li
                    className={active === name ? 'active' : ''}
                    key={id}
                    onClick={() => { setActive(name); setItemShow(9); }}
                  >
                    <span>{name}</span>
                  </li>
                );
              })}
            </ul>
          </Div>
        </Div>

        {/* Filtres avancés */}
        {/* <ProductFilters
          value={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setItemShow(9); // réinitialise la pagination après application des filtres
          }}
        /> */}

        <Spacing lg="40" md="20" />
        <Spacing lg="90" md="45" />

        {/* Grille produits */}
        <Div className="row">
          {filteredProducts.slice(0, itemShow).map((product, index) => {
            const productId = getProductId(product);

            const href =
              product?.attributes?.href ||
              product?.href ||
              `/products/${product?.attributes?.slug || product?.slug || productId}`;

            const title =
              product?.title || product?.attributes?.title || 'Sans titre';

            const subtitle =
              product?.subtitle || product?.attributes?.subtitle || '';

            const imageObj = product?.image || product?.attributes?.image;

            return (
              <Div className="col-lg-4 col-md-6" key={productId || index}>
                <Product
                  title={title}
                  subtitle={subtitle}
                  href={href}
                  src={getBestImageUrl(imageObj)}
                  variant="cs-style1 cs-type1"
                />
                <Spacing lg="25" md="25" />
              </Div>
            );
          })}
        </Div>

        {/* Voir plus */}
        <Div className="text-center" style={{ display: 'flex', justifyContent: 'center' }}>
          {filteredProducts.length > itemShow && (
            <>
              <Spacing lg="65" md="40" />
              <span
                className="cs-text_btn lfl-text_btn"
                onClick={() => setItemShow((n) => n + 9)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setItemShow((n) => n + 9)}
                aria-label="Voir plus de produits"
              >
                <span>Voir plus</span>
                <Icon icon="bi:arrow-right" />
              </span>
            </>
          )}
        </Div>
      </Div>

      <Spacing lg="145" md="80" />
      <Cta title="04 68 20 07 05" bgSrc="/images/cta_bg.jpeg" variant="rounded-0" />
    </>
  );
}
