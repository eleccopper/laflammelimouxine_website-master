import React from 'react';
import Div from '../Div';
import ContactInfoWidget from '../Widget/ContactInfoWidget';
import MenuWidget from '../Widget/MenuWidget';
import SocialWidget from '../Widget/SocialWidget';
import TextWidget from '../Widget/TextWidget';
import './footer.scss';
import { useState } from 'react';

export default function Footer() {
  const copyrightLinks = [
    {
      title: 'Mentions légales',
      href: '/legalnotice'
    }
  ];

  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContentVisibility = () => {
    setIsContentVisible(!isContentVisible);
  };

  return (
      <footer className="cs-fooer">
        <Div className="cs-fooer_main" style={{ display: isContentVisible ? 'block' : 'none' }}>
          <Div className="container">
            <Div className="row">
              <Div className="col-lg-8 col-sm-6">
                <Div className="cs-footer_item">
                  <TextWidget
                      logoSrc="/images/logo.png"
                      logoAlt="Logo"
                      text="Vente, installation, entretien et dépannage de chauffage bois et granulé à Limoux"
                  />
                  <SocialWidget />
                </Div>
              </Div>
              <Div className="col-lg-4 col-sm-6">
                <Div className="cs-footer_item">
                  <ContactInfoWidget title="Nous contacter" />
                </Div>
              </Div>
            </Div>
          </Div>
        </Div>

        {/* Footer inférieur */}
        <Div className="cs-bottom_footer">
          <Div className="cs-bottom_footer_left">
            <Div className="cs-copyright">Copyright © La Flamme Limouxine.</Div>
          </Div>
          <Div className="toggle-button" onClick={toggleContentVisibility}>
            {isContentVisible ? 'Masquer' : 'Afficher plus'}
          </Div>
          <Div className="cs-bottom_footer_right">
            <MenuWidget menuItems={copyrightLinks} variant="cs-style2" />

          </Div>
        </Div>
      </footer>
  );
}
