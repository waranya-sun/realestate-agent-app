import React from 'react';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import OAuth from '../components/OAuth';
import eyeIcon from '../assets/eyeIcon.svg';
import eyeHiddenIcon from '../assets/eyeHiddenIcon.svg';

function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;

  const navigate = useNavigate();

  function handleOnChange(e) {
    // Put a set of parentheses here, so we can return an object
    setFormData(prevState => ({ ...prevState, [e.target.id]: e.target.value }));
  }

  async function handleOnSubmit(e) {
    e.preventDefault();

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        navigate('/');
      }
    } catch (error) {
      toast.error('Bad User Credentials');
    }
  }

  return (
    <div className='layout-page'>
      <h1 className='heading-page'>Welcome Back!</h1>
      <form onSubmit={handleOnSubmit} className='layout-form'>
        <div className='demoAccount'>
          <p>Email : agent@mail.com</p>
          <p>Password : demo_demo</p>
        </div>
        <input
          id='email'
          type='email'
          placeholder='Email'
          value={email}
          onChange={e => handleOnChange(e)}
          className='emailInput'
        />
        {/* <input
          id='password'
          type={showPassword === true ? 'text' : 'password'}
          placeholder='Password'
          value={password}
          onChange={e => handleOnChange(e)}
          className='passwordInput'
        />
        <span onClick={() => setShowPassword(prevState => !prevState)}>
          Show Password?
        </span> */}

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
            src={showPassword ? eyeIcon : eyeHiddenIcon}
            onClick={() => setShowPassword(prevState => !prevState)}
          />
        </div>

        <button type='submit' className='primary-btn'>
          Sign In
        </button>
        <br />
        <Link to='/forgot-password' className='forgot-password'>
          Forgot Password
        </Link>
      </form>

      {/* Google OAuth*/}
      <OAuth />
    </div>
  );
}

export default SignIn;
