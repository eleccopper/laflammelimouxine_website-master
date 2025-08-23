import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../Button';
import Div from '../Div';
import './post.scss';
import Spacing from "../Spacing";
import { getBestImageUrl } from '../../utils/images';
import { withCloudinaryTransform } from '../../utils/images';

export default function PostStyle2({ thumb, title, subtitle, date, category, categoryHref, href }) {
    const rawSrc = typeof thumb === "string" ? thumb : getBestImageUrl(thumb, 1200);
    const imgSrc = withCloudinaryTransform(rawSrc, { width: 1200 });
    return (
        <Div className="cs-post cs-style2">
            <h2 className="cs-post_title">
                <Link to={href}>{title}</Link>
            </h2>
            <Link to={href} className="cs-post_thumb cs-radius_15">
                <img src={imgSrc} alt="Post" className="w-100 cs-radius_15"/>
            </Link>
            <Div className="cs-post_info">
                <Div className="cs-post_meta cs-style1 cs-ternary_color cs-semi_bold cs-primary_font">
                    <Link to={categoryHref} className="cs-post_avatar">
                        {category}
                    </Link>
                </Div>
                <Div className="cs-post_sub_title">{subtitle}</Div>
                <Button btnLink={href} btnText="Voir plus" variant="cs-post-button"/>
                <Spacing lg="50" md="80" />
            </Div>
        </Div>
    );
}
