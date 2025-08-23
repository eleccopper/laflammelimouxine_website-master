import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { pageTitle } from '../../helper';
import Cta from '../Cta';
import PageHeading from '../PageHeading';
import Div from '../Div';
import Spacing from '../Spacing';
import config from '../../config/config';

export default function ServicesDetailsPage() {
  const [blogData, setBlogData] = useState(null);
  const params = useParams();
  const strapiUrl = config.strapiUrl;

  pageTitle('Blog Details');

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`${strapiUrl}/api/blog-posts/${params.id}?populate=*`);
        const data = await response.json();
  
        if (data && data.data) {
          setBlogData(data.data);
        } else {
          console.error('Invalid API response:', data);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    };
  
    fetchBlogPost();
    window.scrollTo(0, 0);
  }, [params.id, strapiUrl]);

  if (!blogData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <PageHeading
          title={blogData?.title}
          bgSrc='/images/blog_hero_bg.jpeg'
          pageLinkText={params.id}
      />
      <Spacing lg='150' md='80'/>
      <Div className="container">
        <Div className="row justify-content-center align-items-center">
          <Div className="col-lg-8">
            <Div className="cs-post cs-style2">
              <Div className="cs-post_thumb cs-radius_15">
                {blogData?.image?.formats?.medium?.url && (
                  <img
                      src={blogData?.image?.formats?.medium?.url}
                      alt={blogData?.attributes?.image?.alternativeText || 'Post image'}
                      className="w-100 cs-radius_15"
                  />
                )}
              </Div>
              <Div className="cs-post_info">
                <Div className="cs-post_meta cs-style1 cs-ternary_color cs-semi_bold cs-primary_font">
                  <Link to={`/blog/${blogData?.category}`} className="cs-post_avatar">
                    {blogData?.category}
                  </Link>
                </Div>
                <h2 className="cs-post_title">{blogData?.title}</h2>
                <p>{blogData?.content}</p>
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
