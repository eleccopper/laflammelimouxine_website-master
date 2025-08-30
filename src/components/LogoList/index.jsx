import React from 'react'
import Div from '../Div'
import './logolist.scss'

export default function LogoList() {
  const partnerLogos = [
    {
      src: '/images/partner_1.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_2.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_3.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_4.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_5.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_6.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_7.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_8.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_9.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_10.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_11.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_12.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_13.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_14.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_15.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_16.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_17.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_18.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_19.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_20.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_21.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_22.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_23.png',
      alt:'Partner'
    },
    {
      src: '/images/partner_24.png',
      alt:'Partner'
    },

  ]
  return (
    <Div className="cs-partner_logo_wrap">
      {partnerLogos.map((partnerLogo, index)=><div className="cs-partner_logo" key={index}><img src={partnerLogo.src} alt={partnerLogo.alt} /></div>)}
    </Div>
  )
}
