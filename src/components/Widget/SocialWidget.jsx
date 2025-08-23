import React from 'react'
import { Icon } from '@iconify/react';
import Div from '../Div';

export default function SocialWidget() {
  return (
    <Div className="cs-social_btns cs-style1">
      <a href='https://www.linkedin.com/in/la-flamme-limouxine-6218b5218/' className="cs-center">
        <Icon icon="fa6-brands:linkedin-in" />
      </a>
      <a href='https://www.facebook.com/laflammelimouxine/' className="cs-center">
        <Icon icon="fa6-brands:facebook" />               
      </a>
    </Div>
  )
}