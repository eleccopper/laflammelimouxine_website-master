import React, { useEffect, useState } from 'react';
import { pageTitle } from '../../helper';
import PageHeading from '../PageHeading';
import Pagination from '../Pagination';
import PostStyle2 from '../Post/PostStyle2';
import Div from '../Div';
import Spacing from '../Spacing';
import config from '../../config/config';

export default function ServicesPage() {
    pageTitle('Services');
    const [postData, setPostData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const strapiUrl = config.strapiUrl;

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await fetch(`${strapiUrl}/api/blog-posts?populate=image&pagination[start]=${(currentPage - 1) * itemsPerPage}&pagination[limit]=${itemsPerPage}`);
                const data = await response.json();

                if (data && data.data) {
                    setPostData(data.data);
                    const totalPosts = data.meta.pagination.total;
                    setTotalPages(Math.ceil(totalPosts / itemsPerPage));
                }
            } catch (error) {
                console.error('Error fetching blog posts:', error);
            }
        };

        fetchBlogPosts();
        window.scrollTo(0, 0);
    }, [strapiUrl, currentPage]);

    const displayedPosts = postData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            <PageHeading title="Nos services" bgSrc="/images/service_hero_bg.jpg" pageLinkText="Services" />
            <Div className="container">
                <Spacing lg="150" md="80" />
                <Div className="row">
                    {displayedPosts.map((item, index) => (
                        <Div key={index} className={`col-lg-6 mb-4 ${index % 2 === 0 ? 'order-lg-1' : ''}`}>
                            <PostStyle2
                                title={item.title}
                                thumb={`${item.image.formats.thumbnail.url}`}
                                subtitle={item.subtitle}
                                date={item.date}
                                category={item.category}
                                categoryHref="/services" 
                                href={`/services/services-details/${item.documentId}`}
                            />
                        </Div>
                    ))}
                </Div>
                <Spacing lg="60" md="40" />
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
                />
                <Spacing lg="150" md="80" />
            </Div>
        </>
    );
}
