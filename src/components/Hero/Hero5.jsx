import React from 'react';
import Button from '../Button';
import Div from '../Div';
import VerticalLinks from '../VerticalLinks';

export default function Hero5({
                                title,
                                subtitle,
                                btnLink,
                                btnText,
                                socialLinksHeading,
                                heroSocialLinks,
                              }) {
  const titleParts = title.split(' ');
  const leftPart = titleParts.slice(0, titleParts.length - 1).join(' ');
  const rightPart = titleParts[titleParts.length - 1];

  return (
      <Div className="cs-hero cs-style3 cs-bg cs-fixed_bg cs-shape_wrap_1" id="home">
        <Div className="cs-hero_logo">
          <img src="/images/logo_flamme.png" alt="Logo Flamme" />
        </Div>
        <Div className="container">
          <Div className="cs-hero_text">
            <h1 className="cs-hero_title text-center">
              <span style={{ color: 'white' }}>{leftPart} </span> 
              <span style={{ color: 'orange' }}>{rightPart}</span>
            </h1>
            <Button btnLink={btnLink} btnText={btnText} />
            <span className="cs-hero_subtitle text-end">{subtitle}</span>
          </Div>
        </Div>
        <VerticalLinks
            data={heroSocialLinks}
            title={socialLinksHeading}
            variant="cs-left_side"
        />
      </Div>
  );
}
