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

export default function ProductsPage() {
    pageTitle('Produits');
    const [active, setActive] = useState('all');
    const [itemShow, setItemShow] = useState(6);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const strapiUrl = config.strapiUrl;

    useEffect(() => {
        fetch(`${strapiUrl}/api/products?populate=*`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setProducts(data.data);
                } else {
                    console.error('Data from API is not an array:', data);
                }
            })
            .catch(error => console.error('Error fetching products:', error));

        fetch(`${strapiUrl}/api/categories?populate=*`)
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

    const filteredProducts = products.filter(product => {
        if (active === 'all') {
            return true;
        } else {
            if (product.categories?.data) {
                return product.categories.data.some(category => category.name === active);
            } else if (product.categories) {
                return product.categories.some(category => category.name === active);
            } else if (product.category?.data?.name) {
                return product.category.data.name === active;
            } else if (product.category?.name) {
                return product.category.name === active;
            }
            return false;
        }
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
                            {categories.map(category => (
                                <li
                                    className={active === category.name ? 'active' : ''}
                                    key={category.id}
                                    onClick={() => setActive(category.name)}
                                >
                                    <span>{category.name}</span>
                                </li>
                            ))}
                        </ul>
                    </Div>
                </Div>
                <Spacing lg="90" md="45" />
                <Div className="row">
                    {filteredProducts
                        .slice(0, itemShow)
                        .map((product, index) => {
                            const productId = getProductId(product);
                            
                            return (
                                <Div
                                    className="col-lg-4 col-md-6"
                                    key={productId || index}
                                >
                                    <Product
                                        title={product.title || 'Sans titre'}
                                        subtitle={product.subtitle || ''}
                                        href={`/products/${productId}`}
                                        src={product.image?.formats?.thumbnail?.url || product.image?.url || ''}
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
