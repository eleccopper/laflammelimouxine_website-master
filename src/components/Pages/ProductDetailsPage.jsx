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
    const params = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const strapiUrl = config.strapiUrl;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`${strapiUrl}/api/products/${params.productId}?populate=*`);
                const data = await response.json();
                console.log('Product details:', data.data);
                setProductDetails(data.data);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchProductDetails();
        window.scrollTo(0, 0);
        pageTitle('Product Details');
    }, [params.productId, strapiUrl]);

    const getCategoriesText = (product) => {
        if (product.categories?.data) {
            return product.categories.data.map(category => category.name).join(', ');
        } else if (product.categories) {
            return product.categories.map(category => category.name).join(', ');
        } else if (product.category?.data?.name) {
            return product.category.data.name;
        } else if (product.category?.name) {
            return product.category.name;
        }
        return 'Aucune catégorie';
    };

    return (
        <>
            {productDetails && (
                <PageHeading
                    title={productDetails.title}
                    bgSrc="../images/productsdetails_hero_bg.jpg"
                    pageLinkText={params.productId}
                />
            )}

            <Spacing lg='150' md='80' />

            <Div className="container">
                {productDetails && (
                    <>
                        <Div className="row">
                            <Div className="col-lg-6">
                                <img
                                    src={getBestImageUrl(productDetails.image, 1200)}
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
