import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { RiUserSettingsLine } from 'react-icons/ri';

function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathNameMatchRoute = route => {
    if (route === location.pathname) {
      return true;
    }
  };

  return (
    <footer className='footer'>
      <ul className='footer-menu'>
        <li onClick={() => navigate('/')}>
          <AiOutlineHome
            fill={pathNameMatchRoute('/') ? '#daf204' : '#fff'}
            className='footer-icon'
          />
          <p>
            <span
              className={pathNameMatchRoute('/') ? 'footer-active-menu' : ''}
            >
              Home
            </span>
          </p>
        </li>
        <li onClick={() => navigate('/offer')}>
          <MdOutlineLocalOffer
            fill={pathNameMatchRoute('/offer') ? '#daf204' : '#fff'}
            className='footer-icon'
          />
          <p>
            <span
              className={
                pathNameMatchRoute('/offer') ? 'footer-active-menu' : ''
              }
            >
              Offers
            </span>
          </p>
        </li>
        <li onClick={() => navigate('/profile')}>
          <RiUserSettingsLine
            fill={pathNameMatchRoute('/profile') ? '#daf204' : '#fff'}
            className='footer-icon'
          />
          <p>
            <span
              className={
                pathNameMatchRoute('/profile') ? 'footer-active-menu' : ''
              }
            >
              Profile
            </span>
          </p>
        </li>
      </ul>
    </footer>
  );
}

export default Footer;
