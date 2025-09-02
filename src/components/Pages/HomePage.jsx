import React, { useEffect } from 'react';
import Div from '../Div';
import Hero from '../Hero';
import Hero5 from '../Hero/Hero5';
import LogoList from '../LogoList';
import MovingText from '../MovingText';
import Spacing from '../Spacing';
import { pageTitle } from '../../helper';
import SectionHeading from '../SectionHeading';
import ServiceList from '../ServiceList';

export default function MarketingAgencyHome() {
  pageTitle('Accueil');
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const heroSocialLinks = [
    {
      name: 'Linkedin',
      links: 'https://www.linkedin.com/in/la-flamme-limouxine-6218b5218/?originalSubdomain=fr',
    },
    {
      name: 'Facebook',
      links: 'https://www.facebook.com/laflammelimouxine',
    },
  ];

  return (
    <>
      {/* Start Hero Section */}
      <Hero5
        title="La Flamme Limouxine"
        subtitle="Vente, installation, entretien et dépannage de solutions énergétiques dans le secteur de l'Occitanie."
        btnLink="contact"
        btnText="Nous contacter"
        socialLinksHeading="Suis nous"
        heroSocialLinks={heroSocialLinks}
        className="cs-center_col"
      />
      {/* End Hero Section */}


      {/* Start Services Section */}
      <Spacing lg="145" md="80" />
      <Div className="container">
        <SectionHeading
          title="Nos services"
          subtitle="Services"
          variant="cs-style1 text-center"
        />
        <Spacing lg="70" md="45" />
        <ServiceList />
      </Div>
      {/* End Services Section */}

      <Spacing lg="120" md="50" />
      <Div className="container">
        <h2 className="cs-font_20 cs-m0 cs-line_height_4">
          Entreprise <strong>RGE Qualibois</strong>, La Flamme Limouxine vend, installe, entretient et dépanne
          les appareils de chauffage <strong>bois &amp; granulés</strong> (et solutions de climatisation).
        </h2>
        <p style={{ marginTop: 12 }} className="cs-m0 cs-line_height_4">
          Nous intervenons dans un rayon d’environ <strong>50&nbsp;km autour de Limoux</strong> : Limoux, 
          <strong> Carcassonne</strong>, <strong> Castelnaudary</strong>, <strong> Quillan</strong>, 
          <strong> Mirepoix</strong>, <strong> Bram</strong>, <strong> Couiza</strong>, 
          <strong> Espéraza</strong>, <strong> Alet-les-Bains</strong>, <strong> Chalabre</strong>, 
          <strong> Lézignan-Corbières</strong>… Contactez‑nous pour vérifier votre commune.
        </p>
      </Div>


      {/* Start MovingText Section */}
      <Spacing lg="125" md="70" />
      <MovingText text="Nos partenaires réputés mondialement" />
      <Spacing lg="100" md="70" />
      {/* End MovingText Section */}

      {/* Start LogoList Section */}
      <Div className="container">
        <LogoList />
      </Div>
      <Spacing lg="130" md="80" />
      {/* End LogoList Section */}

        <Div className="cs-google_map">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2913.8621130634433!2d2.2254321986985675!3d43.086394158707854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12afcd5b7658ca65%3A0x83fb1df70881ad99!2sLa%20Flamme%20Limouxine!5e0!3m2!1sen!2sfr!4v1701859661139!5m2!1sen!2sfr"
                allowFullScreen
                title="Google Map"
            />
        </Div>
    </>


  );


}
