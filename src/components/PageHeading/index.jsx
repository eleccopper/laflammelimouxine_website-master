import React from 'react';
import { Link } from 'react-router-dom';
import Div from '../Div';
import './index.css';

export default function PageHeading({ title, bgSrc, pageLinkText }) {
  return (
    <Div
      className="cs-page_heading cs-style1 cs-center text-center cs-bg"
      style={{ backgroundImage: `url(${bgSrc})`, position: 'relative', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', pointerEvents: 'none', zIndex: 0 }}></div>
      <Div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <Div className="cs-page_heading_in">
          <Div className="cs-page_heading_logo">
            <img src="/images/logo_flamme.png" alt="Logo Flamme" />
          </Div>
          <h1 className="cs-page_title cs-font_50 cs-white_color" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)', display: 'inline-block', padding: '8px 14px', borderRadius: '10px' }}>{title}</h1>
          <ol className="breadcrumb text-uppercase">
            <li className="breadcrumb-item">
              <Link to="/">Accueil</Link>
            </li>
            <li className="breadcrumb-item active">{pageLinkText}</li>
          </ol>
        </Div>
      </Div>
    </Div>
  );
}
