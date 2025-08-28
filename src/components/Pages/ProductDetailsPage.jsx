import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { pageTitle } from '../../helper';
import Cta from '../Cta';
import PageHeading from '../PageHeading';
import Div from '../Div';
import SectionHeading from '../SectionHeading';
import Spacing from '../Spacing';

import config from '../../config/config';
import { getBestImageUrl } from '../../utils/images';

export default function ProductDetailsPage() {
    const { slug } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const strapiUrl = config.strapiUrl;

    // Normalize Strapi entities (v4/v5) to a flat shape
    const normalize = (item) => (item?.attributes ? { id: item.id, ...item.attributes } : item);

    // Helpers to read common fields regardless of shape (v4/v5 or legacy)
    const pick = (obj, keys = []) => {
        for (const k of keys) {
            if (obj && obj[k] !== undefined && obj[k] !== null && obj[k] !== "") return obj[k];
        }
        return undefined;
    };

    const getType = (p) => pick(p || {}, ["type", "Type", "productType"]);
    const getBrand = (p) => pick(p || {}, ["brand", "Brand", "marque"]);
    const getPowerKw = (p) => {
        const raw = pick(p || {}, ["power_kw", "powerKw", "puissance", "puissance_kw"]);
        if (raw === undefined) return undefined;
        const n = typeof raw === "string" ? Number(raw.replace(",", ".")) : Number(raw);
        return Number.isFinite(n) ? n : undefined;
    };

    // Unified main image resolver: get the best image candidate from productDetails
    const getMainMedia = (p) => (
        p?.image ||
        p?.cover ||
        p?.attributes?.image ||
        p?.attributes?.cover ||
        null
    );

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const API = strapiUrl;
                const requestedPath = `/products/${slug}`;

                // 1) Try by href
                let res = await fetch(`${API}/products?filters[href][$eq]=${encodeURIComponent(requestedPath)}&populate=*`);
                let json = await res.json();

                // 2) Fallback by slug
                if (!json?.data?.length) {
                    res = await fetch(`${API}/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`);
                    json = await res.json();
                }

                // 3) Fallback by id/documentId (compatibility)
                if (!json?.data?.length) {
                    res = await fetch(`${API}/products/${encodeURIComponent(slug)}?populate=*`);
                    json = await res.json();
                    // Single entity style { data: {...} }
                    if (json?.data) {
                        setProductDetails(normalize(json.data));
                        return;
                    }
                }

                if (json?.data?.length) {
                    setProductDetails(normalize(json.data[0]));
                }
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
        window.scrollTo(0, 0);
        pageTitle('Product Details');
    }, [slug, strapiUrl]);

    const getCategoriesText = (product) => {
        // Strapi nested (v4/v5): product.categories.data[*].attributes.name
        const nested = product?.categories?.data?.map((c) => c?.attributes?.name).filter(Boolean);
        if (nested?.length) return nested.join(', ');

        // Flattened arrays
        const flatArr = product?.categories?.map((c) => c?.name).filter(Boolean);
        if (flatArr?.length) return flatArr.join(', ');

        // Single category variants
        const singleNested = product?.category?.data?.attributes?.name;
        if (singleNested) return singleNested;
        const singleFlat = product?.category?.name;
        if (singleFlat) return singleFlat;

        return 'Aucune catégorie';
    };

    return (
        <>
            {productDetails && (
                <PageHeading
                    title={productDetails.title}
                    bgSrc="../images/productsdetails_hero_bg.jpg"
                    pageLinkText={slug}
                />
            )}

            <Spacing lg='150' md='80' />

            <Div className="container">
                {productDetails && (
                    <>
                        <Div className="row">
                            <Div className="col-lg-6">
                                <img
                                    src={getBestImageUrl(getMainMedia(productDetails), 1200)}
                                    alt={productDetails?.title || 'Product Details'}
                                    className="cs-radius_15 w-100"
                                />
                            </Div>

                            <Div className="col-lg-6">
                                <SectionHeading
                                    title={productDetails.title}
                                    subtitle={productDetails.subtitle}
                                />
                                <Spacing lg='40' md='20' />
                                <div
                                  className="richtext"
                                  dangerouslySetInnerHTML={{ __html: productDetails.description }}
                                />
                            </Div>
                        </Div>

                        <Spacing lg='40' md='20' />

                        <Div className="row">
                            <Div className="col-lg-6">
                                <h2 className='cs-font_30 cs-font_26_sm cs-m0'>Informations du produit -</h2>
                                <Spacing lg='20' md='10' />

                                <Div>
                                    <h3 className='cs-accent_color cs-font_22 cs-font_18_sm cs-m0'>Catégorie(s):</h3>
                                    <p className='cs-m0'>
                                        {getCategoriesText(productDetails)}
                                    </p>
                                </Div>

                                <Spacing lg='20' md='10' />
                                <Div>
                                    <h3 className='cs-accent_color cs-font_22 cs-font_18_sm cs-m0'>Type :</h3>
                                    <p className='cs-m0'>
                                        {getType(productDetails) ? labelizeType(getType(productDetails)) : '—'}
                                    </p>
                                </Div>

                                <Spacing lg='12' md='8' />
                                <Div>
                                    <h3 className='cs-accent_color cs-font_22 cs-font_18_sm cs-m0'>Marque :</h3>
                                    <p className='cs-m0'>
                                        {getBrand(productDetails) || '—'}
                                    </p>
                                </Div>

                                <Spacing lg='12' md='8' />
                                <Div>
                                    <h3 className='cs-accent_color cs-font_22 cs-font_18_sm cs-m0'>Puissance (kW) :</h3>
                                    <p className='cs-m0'>
                                        {(() => { const v = getPowerKw(productDetails); return v !== undefined ? v : '—'; })()}
                                    </p>
                                </Div>

                            </Div>
                        </Div>

                        <Spacing lg='40' md='20' />

                    </>
                )}
            </Div>

            <Spacing lg='145' md='80' />

            <Cta title='04 68 20 07 05' bgSrc="/images/cta_bg.jpeg" variant='rounded-0' />
        </>
    );
}

function labelizeType(t) {
    if (!t) return '';
    const s = String(t).toLowerCase();
    switch (s) {
        case 'air': return 'Air';
        case 'canalisable': return 'Canalisable';
        case 'etanche': return 'Étanche';
        case 'hydro': return 'Hydro';
        default: return t;
    }
}
