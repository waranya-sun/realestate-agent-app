import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// Because we want to update the firestore database as well
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import googleIcon from '../assets/googleIcon.svg';

function OAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  async function handleGoogleBtn() {
    try {
      // Creating variable auth, which we always do when we are dealing with Auth
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check for user
      // Get a reference to the document, because we want to put the user in the database(in case of sign-up I guess)
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      // If user doesn't exist, create a user
      if (!docSnap.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        });
      }
      navigate('/');
    } catch (error) {
      toast.error('Could not authorize with Google');
    }
  }

  return (
    <div className='layout-form'>
      <p
        style={{
          textAlign: 'center',
          fontSize: '1.5rem',
        }}
      >
        Or
      </p>
      <div className='google-form' onClick={handleGoogleBtn}>
        <img src={googleIcon} className='google-icon' />
        <span style={{ cursor: 'default' }}>
          Sign {location.pathname === '/sign-in' ? 'In' : 'Up'} with Google
        </span>
      </div>
      {/* <button onClick={handleGoogleBtn}>G</button> */}
    </div>
  );
}

export default OAuth;
