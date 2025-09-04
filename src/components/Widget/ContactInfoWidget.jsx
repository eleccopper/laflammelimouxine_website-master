import React from 'react'
import { Icon } from '@iconify/react';

export default function ContactInfoWidget({withIcon, title}) {
  return (
    <>
      {title && <h2 className="cs-widget_title">{title}</h2>}
      <ul className="cs-menu_widget cs-style1 cs-mp0">
        <li>
          <span className='cs-accent_color'><Icon icon="material-symbols:add-call-rounded" /></span>
          04 68 20 07 05
        </li>
        <li>
          <span className='cs-accent_color'><Icon icon="mdi:envelope" /></span>
          Lundi au samedi
          10h - 12h30 / 13h30 - 18h
        </li>
        <li>
          <span className='cs-accent_color'><Icon icon="mdi:map-marker" /></span>
          27 Chem. de la Plaine, 11250 Rouffiac-d'Aude
        </li>
      </ul>
    </>
  )
}
