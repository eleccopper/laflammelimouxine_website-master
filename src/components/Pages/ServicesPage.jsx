import React, { useEffect, useState } from 'react';
import { pageTitle } from '../../helper';
import PageHeading from '../PageHeading';
import Pagination from '../Pagination';
import PostStyle2 from '../Post/PostStyle2';
import Div from '../Div';
import Spacing from '../Spacing';
import config from '../../config/config';
import { useParams } from 'react-router-dom';

export default function ServicesPage() {
    pageTitle('Services');
    const [postData, setPostData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const strapiUrl = config.strapiUrl;
    const { category } = useParams();

    useEffect(() => {
      const fetchBlogPosts = async () => {
        try {
          const params = new URLSearchParams();
          params.set('populate', 'image');
          // pagination Strapi (page/pageSize) pour éviter les incohérences
          params.set('pagination[page]', String(currentPage));
          params.set('pagination[pageSize]', String(itemsPerPage));

          // Filtre serveur par catégorie si l'URL comporte /services/:category
          if (category) {
            params.append('filters[category][$containsi]', decodeURIComponent(category));
          }

          const response = await fetch(`${strapiUrl}/blog-posts?${params.toString()}`);
          const data = await response.json();

          if (data && Array.isArray(data.data)) {
            // Tri custom par ordre métier (Vente → Installation → Entretien → SAV)
            // mapping explicite pour tolérer majuscules/accents/variantes
            const ORDER = {
              vente: 0,
              installation: 1,
              entretien: 2,
              sav: 3,
            };

            const normalizeKey = (title) =>
              (String(title || ''))
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, ''); // supprime accents

            const sorted = [...data.data].sort((a, b) => {
              const aTitle = a?.attributes?.title || a?.title || '';
              const bTitle = b?.attributes?.title || b?.title || '';

              const aKey = normalizeKey(aTitle);
              const bKey = normalizeKey(bTitle);

              const aRank = ORDER[aKey] ?? Number.POSITIVE_INFINITY;
              const bRank = ORDER[bKey] ?? Number.POSITIVE_INFINITY;

              if (aRank === bRank) {
                // fallback stable: ID croissant pour les éléments hors liste
                return (a?.id || 0) - (b?.id || 0);
              }
              return aRank - bRank;
            });

            setPostData(sorted);
            const totalPosts = data?.meta?.pagination?.total || sorted.length;
            setTotalPages(Math.ceil(totalPosts / itemsPerPage));
          } else {
            setPostData([]);
            setTotalPages(1);
          }
        } catch (error) {
          console.error('Error fetching blog posts:', error);
        }
      };

      fetchBlogPosts();
      window.scrollTo(0, 0);
    }, [strapiUrl, currentPage, category]);

    const getItemCategoryName = (item) => (
      item?.attributes?.category ||
      item?.attributes?.categories?.data?.[0]?.attributes?.name ||
      item?.category ||
      ''
    );

    const makeSlug = (s) => (s || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9]+/g, '-')       // non-alphanum -> dashes
      .replace(/^-+|-+$/g, '');          // trim dashes

    const activeCategorySlug = category ? makeSlug(category) : null;

    const filteredPosts = activeCategorySlug
      ? postData.filter((it) => makeSlug(getItemCategoryName(it)) === activeCategorySlug)
      : postData;

    const displayedPosts = filteredPosts; // Strapi gère déjà pagination + tri; pas de re-slice côté client

    return (
        <>
            <PageHeading title="Nos services" bgSrc="/images/service_hero_bg.jpg" pageLinkText={category || 'Services'} />
            <Div className="container">
                <Spacing lg="150" md="80" />
                <Div className="row">
                    {displayedPosts.map((item, index) => (
                        <Div key={index} className={`col-lg-6 mb-4 ${index % 2 === 0 ? 'order-lg-1' : ''}`}>
                            {(() => {
                              const title = item?.attributes?.title || item?.title || '';
                              const slug = item?.attributes?.slug || makeSlug(title);
                              return (
                                <PostStyle2
                                  title={title}
                                  thumb={item?.attributes?.image || item?.image}
                                  subtitle={item?.attributes?.subtitle || item?.subtitle}
                                  date={item?.attributes?.date || item?.date}
                                  category={getItemCategoryName(item)}
                                  categoryHref={`/services/${makeSlug(getItemCategoryName(item))}`}
                                  href={`/services/${makeSlug(getItemCategoryName(item))}/${slug}`}
                                />
                              );
                            })()}
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
