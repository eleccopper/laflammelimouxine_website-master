import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Div from '../Div';
import './servicelist.scss';

export default function ServiceList() {
  const serviceData = [
    {
      title: 'Vente',
      subtitle:
        'La Flamme Limouxine propose la vente de solutions de chauffage bois (bûches et granulés) et de climatisation performante, adaptées à vos besoins.',
      imgUrl: '/images/service_7.jpg',
      href: '/services',
    },
    {
      title: 'Installation',
      subtitle:
        'La Flamme Limouxine assure l’installation professionnelle de poêles, chaudières bois et systèmes de climatisation, alliant confort et efficacité énergétique.',
      imgUrl: '/images/service_8.jpg',
      href: '/services',
    },
    {
      title: 'Entretien',
      subtitle:
        'Nous réalisons l’entretien complet de vos appareils de chauffage bois et de vos équipements de climatisation, pour garantir sécurité, performance et longévité.',
      imgUrl: '/images/service_9.jpg',
      href: '/services',
    },
    {
      title: 'Dépannage',
      subtitle:
        'Notre équipe intervient rapidement pour le dépannage de vos systèmes de chauffage bois et de climatisation, afin de rétablir votre confort sans délai.',
      imgUrl: '/images/service_10.jpeg',
      href: '/services',
    },
  ];
  const [active, setActive] = useState(0);
  const handelActive = index => {
    setActive(index);
  };
  return (
    <Div className="cs-iconbox_3_list">
      {serviceData.map((item, index) => (
        <Div
          className={`cs-hover_tab ${active === index ? 'active' : ''}`}
          key={index}
          onMouseEnter={() => handelActive(index)}
        >
          <Link to={item.href} className="cs-iconbox cs-style3">
            <>
              <Div className="cs-image_layer cs-style1 cs-size_md">
                <Div className="cs-image_layer_in">
                  <img
                    src={item.imgUrl}
                    alt="Thumb"
                    className="w-100 cs-radius_15"
                  />
                </Div>
              </Div>
              <span className="cs-iconbox_icon cs-center">
                <svg
                  width={30}
                  height={29}
                  viewBox="0 0 30 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M29.3803 3.05172C29.4089 1.94752 28.537 1.02921 27.4328 1.00062L9.43879 0.534749C8.33459 0.506159 7.41628 1.37811 7.38769 2.48231C7.35911 3.58651 8.23106 4.50482 9.33526 4.53341L25.3299 4.94752L24.9158 20.9422C24.8872 22.0464 25.7592 22.9647 26.8634 22.9933C27.9676 23.0218 28.8859 22.1499 28.9144 21.0457L29.3803 3.05172ZM3.37714 28.5502L28.7581 4.4503L26.0039 1.54961L0.622863 25.6495L3.37714 28.5502Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <Div className="cs-iconbox_in">
                <h2 className="cs-iconbox_title">{item.title}</h2>
                <Div className="cs-iconbox_subtitle">{item.subtitle}</Div>
              </Div>
            </>
          </Link>
        </Div>
      ))}
    </Div>
  );
}
