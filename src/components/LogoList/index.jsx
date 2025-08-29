import React from 'react'
import Div from '../Div'
import './logolist.scss'

export default function LogoList() {
  // Génère automatiquement /images/partner_1.png → /images/partner_25.png
  const partnerLogos = Array.from({ length: 25 }, (_, i) => ({
    src: `/images/partner_${i + 1}.png`,
    alt: `Partenaire ${i + 1}`,
  }));

  return (
    <Div className="cs-partner_logo_wrap" role="list" aria-label="Nos partenaires">
      {partnerLogos.map((partnerLogo, index) => (
        <div className="cs-partner_logo" role="listitem" key={index}>
          <img src={partnerLogo.src} alt={partnerLogo.alt} loading="lazy" />
        </div>
      ))}
    </Div>
  )
}
