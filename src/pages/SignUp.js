import React from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import OAuth from '../components/OAuth';
import eyeIcon from '../assets/eyeIcon.svg';
import eyeHiddenIcon from '../assets/eyeHiddenIcon.svg';

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { name, email, password } = formData;

  const navigate = useNavigate();

  function handleOnChange(e) {
    // Put a set of parentheses here, so we can return an object
    setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
  }

  async function handleOnSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      // Register the user with this function
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Get the actual user info, which we gonna use it for the database
      const user = userCredential.user;
      updateProfile(auth.currentUser, {
        displayName: name,
      });

      // Because we don't want to change the form data state
      const formDataCopy = { ...formData };
      // Because we don't want the password to get submitted to the database
      delete formDataCopy.password;
      formDataCopy.timestamp = serverTimestamp();

      // users is the name of collection and user means user ID
      await setDoc(doc(db, 'users', user.uid), formDataCopy);

      // Redirective
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong with registration');
    }
  }

  return (
    <div className='layout-page'>
      <h1 className='heading-page'>Sign Up</h1>
      <form className='layout-form' onSubmit={handleOnSubmit}>
        <input
          id='name'
          type='text'
          placeholder='Username'
          value={name}
          onChange={handleOnChange}
          className='usernameInput'
        />
        <input
          id='email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={handleOnChange}
          className='emailInput'
        />
        <div className='eyeIcon'>
          <input
            id='password'
            type={showPassword === true ? 'text' : 'password'}
            placeholder='Password'
            value={password}
            onChange={handleOnChange}
            className='passwordInput'
          />
          <img
            className='eyeIconBtn'
            src={showPassword ? eyeHiddenIcon : eyeIcon}
            onClick={() => setShowPassword(prevState => !prevState)}
          />
        </div>

        <button type='submit' className='primary-btn'>
          Sign Up
        </button>
      </form>
      {/* Google OAuth*/}
      {/* And We want to add the user to the database as well, add to Firestore */}
      <OAuth />
    </div>
  );
}

export default SignUp;
