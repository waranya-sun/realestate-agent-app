import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsPerson } from 'react-icons/bs';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

function Navbar() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, user => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });
  }, [loggedIn]);

  function handleSignOutBtn() {
    auth.signOut();
    navigate('/');
  }

  return (
    <nav className='navbar'>
      <div className='logo' onClick={() => navigate('/')}>
        <span className='neon-yellow'>W</span>S.
      </div>
      {loggedIn ? (
        <div className='login'>
          <BsPerson className='login-icon' />{' '}
          <span className='login-text' onClick={handleSignOutBtn}>
            Logout
          </span>
        </div>
      ) : (
        <div className='login'>
          <BsPerson className='login-icon' />{' '}
          <span className='login-text' onClick={() => navigate('/sign-in')}>
            Login
          </span>{' '}
          /{' '}
          <span className='register-text' onClick={() => navigate('/sign-up')}>
            Register
          </span>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
