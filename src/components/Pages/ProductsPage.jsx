import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
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

export default function ProductsPage() {
    pageTitle('Produits');
    const [active, setActive] = useState('all');
    const [itemShow, setItemShow] = useState(6);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
      category: null,
      type: [],
      brand: [],
      powerMin: null,
      powerMax: null,
    });
    const strapiUrl = config.strapiUrl;

    useEffect(() => {
        fetch(`${strapiUrl}/products?populate=*`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setProducts(data.data);
                } else {
                    console.error('Data from API is not an array:', data);
                }
            })
            .catch(error => console.error('Error fetching products:', error));

        fetch(`${strapiUrl}/categories?populate=*`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setCategories(data.data);
                } else {
                    console.error('Categories data from API is not an array:', data);
                }
            })
            .catch(error => console.error('Error fetching categories:', error));
    }, [strapiUrl]);

    const filteredProducts = products.filter((product) => {
      if (active === 'all') return true;

      // Strapi v4/v5 nested: product.attributes.categories.data[*].attributes.name
      const nestedNames = product?.attributes?.categories?.data?.map(
        (c) => c?.attributes?.name
      );

      // Flattened variants
      const flatDataNames = product?.categories?.data?.map((c) => c?.attributes?.name || c?.name);
      const flatNames = product?.categories?.map((c) => c?.attributes?.name || c?.name);
      const singleCatNested = product?.category?.data?.attributes?.name;
      const singleCatFlat = product?.category?.name;

      const allNames = [
        ...(Array.isArray(nestedNames) ? nestedNames : []),
        ...(Array.isArray(flatDataNames) ? flatDataNames : []),
        ...(Array.isArray(flatNames) ? flatNames : []),
        ...(singleCatNested ? [singleCatNested] : []),
        ...(singleCatFlat ? [singleCatFlat] : []),
      ].filter(Boolean);

      // Filtres avancés (type / brand / puissance)
      const hasType = Array.isArray(filters.type) && filters.type.length > 0;
      const hasBrand = Array.isArray(filters.brand) && filters.brand.length > 0;
      const hasMin = typeof filters.powerMin === 'number';
      const hasMax = typeof filters.powerMax === 'number';

      const a = product?.attributes || product; // tolérant v4/v5
      const prodType = a.type || a?.attributes?.type;
      const prodBrand = a.brand || a?.attributes?.brand;
      const kwRaw = a.power_kw ?? a.powerKw ?? a.puissance; // tolérance aux noms
      const prodKw = typeof kwRaw === 'string' ? Number(kwRaw.replace(',', '.')) : Number(kwRaw);

      if (hasType && (!prodType || !filters.type.includes(String(prodType)))) return false;
      if (hasBrand && (!prodBrand || !filters.brand.includes(String(prodBrand)))) return false;
      if (hasMin && (!Number.isFinite(prodKw) || prodKw < filters.powerMin)) return false;
      if (hasMax && (!Number.isFinite(prodKw) || prodKw > filters.powerMax)) return false;

      return allNames.includes(active);
    });

    const getProductId = (product) => {
        return product.documentId || product.id || product.slug;
    };

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
                            <li className={active === 'all' ? 'active' : ''} onClick={() => setActive('all')}>
                                <span>Tous</span>
                            </li>
                            {categories.map((category) => {
                                const name = category?.attributes?.name || category?.name || '';
                                const id = category?.id || name;
                                return (
                                  <li
                                    className={active === name ? 'active' : ''}
                                    key={id}
                                    onClick={() => setActive(name)}
                                  >
                                    <span>{name}</span>
                                  </li>
                                );
                            })}
                        </ul>
                    </Div>
                </Div>
                <ProductFilters value={filters} onChange={setFilters} />
                <Spacing lg="40" md="20" />
                <Spacing lg="90" md="45" />
                <Div className="row">
                    {filteredProducts
                        .slice(0, itemShow)
                        .map((product, index) => {
                            const productId = getProductId(product);
                            const productHref =
                              product?.attributes?.href ||
                              product?.href ||
                              `/products/${product?.attributes?.slug || product?.slug || productId}`;
                            
                            return (
                                <Div
                                    className="col-lg-4 col-md-6"
                                    key={productId || index}
                                >
                                    <Product
                                      title={product?.title || product?.attributes?.title || 'Sans titre'}
                                      subtitle={product?.subtitle || product?.attributes?.subtitle || ''}
                                      href={productHref}
                                      src={getBestImageUrl(product?.image || product?.attributes?.image)}
                                      variant="cs-style1 cs-type1"
                                    />
                                    <Spacing lg="25" md="25" />
                                </Div>
                            );
                        })}
                </Div>

                <Div className="text-center">
                    {filteredProducts.length <= itemShow ? (
                        ''
                    ) : (
                        <>
                            <Spacing lg="65" md="40" />
                            <span
                                className="cs-text_btn"
                                onClick={() => setItemShow(itemShow + 6)}
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
