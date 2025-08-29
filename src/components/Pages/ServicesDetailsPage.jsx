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
    const fetchService = async () => {
      try {
        let data;
        // 1) SEO route: fetch by slug or by title guess
        if (slug) {
          let res = await fetch(
            `${strapiUrl}/blog-posts?filters[slug][$eq]=${encodeURIComponent(slug)}&populate[image]=true&populate[cover]=true&publicationState=live`
          );
          let json = await res.json();
          if (!res.ok) {
            throw new Error(`HTTP ${res.status} – ${json?.error?.message || 'Bad Request'}`);
          }
          if (json?.data?.length) {
            data = json.data[0];
          } else {
            // Fallback: try matching by title reconstructed from slug
            const titleGuess = decodeURIComponent(slug).replace(/-/g, ' ');
            res = await fetch(
              `${strapiUrl}/blog-posts?filters[title][$containsi]=${encodeURIComponent(titleGuess)}&populate[image]=true&populate[cover]=true&publicationState=live`
            );
            json = await res.json();
            if (!res.ok) {
              throw new Error(`HTTP ${res.status} – ${json?.error?.message || 'Bad Request'}`);
            }
            if (json?.data?.length) data = json.data[0];
          }
        }
        // 2) Legacy route by id
        if (!data && id) {
          const res = await fetch(
            `${strapiUrl}/blog-posts/${encodeURIComponent(id)}?populate[image]=true&populate[cover]=true&publicationState=live`
          );
          const json = await res.json();
          if (!res.ok) {
            throw new Error(`HTTP ${res.status} – ${json?.error?.message || 'Bad Request'}`);
          }
          if (json?.data) data = json.data;
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

  return (
    <>
      <PageHeading
          title={blogData?.title}
          bgSrc='/images/blog_hero_bg.jpeg'
          pageLinkText={`${category || 'services'} / ${slug || id}`}
      />
      <Spacing lg='150' md='80'/>
      <Div className="container">
        <Div className="row justify-content-center align-items-center">
          <Div className="col-lg-8">
            <Div className="cs-post cs-style2">
              <Div className="cs-post_thumb cs-radius_15">
                {(blogData?.image || blogData?.image?.data) && (
                  <img
                    src={getBestImageUrl(blogData.image, 1200)}
                    alt={blogData?.image?.alternativeText || blogData?.image?.data?.attributes?.alternativeText || blogData?.title || 'Service image'}
                    className="w-100 cs-radius_15"
                    loading="lazy"
                  />
                )}
              </Div>
              <Div className="cs-post_info">
                <Div className="cs-post_meta cs-style1 cs-ternary_color cs-semi_bold cs-primary_font">
                  <Link to={`/services/${makeSlug(blogData?.category)}`} className="cs-post_avatar">
                    {blogData?.category}
                  </Link>
                </Div>
                <h2 className="cs-post_title">{blogData?.title}</h2>
                <div className="richtext" dangerouslySetInnerHTML={{ __html: blogData?.content || '' }} />
              </Div>
            </Div>
          </Div>
        </Div>
      </Div>
      <Spacing lg='150' md='80'/>
      <Div className="container text-center">
        <Cta
            title='Discutons et <br />construisons <i>ensemble</i>'
            btnText='Nous contacter'
            btnLink='/contact'
            bgSrc='/images/cta_bg.jpeg'
        />
      </Div>
    </>
  );
}
