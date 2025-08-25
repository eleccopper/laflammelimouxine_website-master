// Import des éléments nécessaires depuis React et le fichier de style
import React from 'react';
import { Link } from 'react-router-dom';
import Div from '../Div';
import './product.scss';

// Composant Produit
export default function ProductCard({ href, src, title, subtitle, variant }) {
  return (
      <div className="product-container">
        <Div className="cs-portfolio_title_above">{title}</Div>
        <Link
            to={href}
            className={`cs-portfolio cs-bg ${variant ? variant : 'cs-style1'}`}
        >
          <>
            <Div className="cs-portfolio_hover" />
            <Div
                className="cs-portfolio_bg cs-bg"
                style={{ backgroundImage: `url("${src}")` }}
            />
            <Div className="cs-portfolio_info">
              <Div className="cs-portfolio_info_bg cs-accent_bg" />
              <Div className="cs-portfolio_text">
                <h2 className="cs-portfolio_title">{title}</h2>
                {subtitle && <Div className="cs-portfolio_subtitle">{subtitle}</Div>}
              </Div>
            </Div>
          </>
        </Link>
      </div>
  );
}
