import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { pageTitle } from '../../helper';
import Cta from '../Cta';
import PageHeading from '../PageHeading';
import Div from '../Div';
import Spacing from '../Spacing';
import config from '../../config/config';
import { getBestImageUrl } from '../../utils/images';

export default function ServicesDetailsPage() {
  const [blogData, setBlogData] = useState(null);
  const { category, slug, id } = useParams(); // category/slug for SEO route, id for legacy route
  const strapiUrl = config.strapiUrl;

  pageTitle('Service Details');

  // Normalize Strapi entity (v4/v5) to a flat shape
  const normalize = (item) => (item?.attributes ? { id: item.id, ...item.attributes } : item);

  const makeSlug = (s) => (s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  useEffect(() => {
    const SLUG_TO_TITLE = {
      installation: 'Installation',
      entretien: 'Entretien',
      vente: 'Vente',
      sav: 'Dépannage',
      depannage: 'Dépannage',
    };

    const fetchService = async () => {
      try {
        let data;

        // 1) On déduit un "titre attendu" à partir du slug d'URL
        const wantedTitle =
          SLUG_TO_TITLE[slug] ||
          decodeURIComponent(slug || '').replace(/-/g, ' ').trim();

        // 2) Requête PROPRE uniquement sur un champ existant : "title"
        //    -> supprime définitivement les 400 "Invalid key slug|href"
        let url =
          `${strapiUrl}/blog-posts` +
          `?filters[title][$containsi]=${encodeURIComponent(wantedTitle)}` +
          `&populate=*` +
          `&publicationState=live` +
          `&pagination[page]=1&pagination[pageSize]=1`;

        let res = await fetch(url);
        let json = await res.json();

        if (json?.data?.length) {
          data = json.data[0];
        } else if (id) {
          // 3) Fallback legacy par ID direct
          res = await fetch(`${strapiUrl}/blog-posts/${encodeURIComponent(id)}?populate=*`);
          json = await res.json();
          if (json?.data) data = json.data;
        } else {
          // 4) Fallback final : on récupère un lot et on filtre côté client
          res = await fetch(
            `${strapiUrl}/blog-posts?populate=*&publicationState=live&pagination[page]=1&pagination[pageSize]=50`
          );
          json = await res.json();
          if (Array.isArray(json?.data)) {
            data =
              json.data.find((it) =>
                (it.attributes?.title || '')
                  .toLowerCase()
                  .includes((wantedTitle || '').toLowerCase())
              ) || json.data[0];
          }
        }

        if (data) {
          setBlogData(normalize(data));
        } else {
          console.error('Service not found for slug/id:', slug || id);
        }
      } catch (error) {
        console.error('Error fetching service details:', error);
      }
    };

    fetchService();
    window.scrollTo(0, 0);
  }, [category, slug, id, strapiUrl]);

  if (!blogData) {
    return <div>Loading...</div>;
  }

  // Image robuste : accepte image OU cover (objet direct ou .data)
  const pickMedia = (m) => (m?.data ? m.data : m) || null;
  const media = pickMedia(blogData.image) || pickMedia(blogData.cover);
  const imgUrl = getBestImageUrl(media, 1200);
  const imgAlt =
    media?.attributes?.alternativeText ||
    blogData?.image?.alternativeText ||
    blogData?.cover?.alternativeText ||
    blogData?.title ||
    'Service image';

  return (
    <>
      <PageHeading
        title={blogData?.title}
        bgSrc="/images/blog_hero_bg.jpeg"
        pageLinkText={`${category || 'services'} / ${slug || id}`}
      />
      <Spacing lg="150" md="80" />
      <Div className="container">
        <Div className="row justify-content-center align-items-center">
          <Div className="col-lg-8">
            <Div className="cs-post cs-style2">
              <Div className="cs-post_thumb cs-radius_15">
                {imgUrl && (
                  <img
                    src={imgUrl}
                    alt={imgAlt}
                    className="w-100 cs-radius_15"
                    loading="lazy"
                  />
                )}
              </Div>
              <Div className="cs-post_info">
                <Div className="cs-post_meta cs-style1 cs-ternary_color cs-semi_bold cs-primary_font">
                  {blogData?.category && (
                    <Link to={`/services/${makeSlug(blogData.category)}`} className="cs-post_avatar">
                      {blogData.category}
                    </Link>
                  )}
                </Div>
                <h2 className="cs-post_title">{blogData?.title}</h2>
                <div
                  className="richtext"
                  dangerouslySetInnerHTML={{ __html: blogData?.content || '' }}
                />
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
      <Spacing lg="150" md="80" />
      <Div className="container text-center">
        <Cta
          title="Discutons et <br />construisons <i>ensemble</i>"
          btnText="Nous contacter"
          btnLink="/contact"
          bgSrc="/images/cta_bg.jpeg"
        />
      </Div>
    </>
  );
}
