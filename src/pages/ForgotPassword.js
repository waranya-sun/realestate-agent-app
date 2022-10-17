import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  async function handleOnSubmit(e) {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Email was sent');
    } catch (error) {
      toast.error('Could not send reset email');
    }
  }

  return (
    <div className='layout-page'>
      <h1 className='heading-page'>Forgot Password</h1>
      <form onSubmit={handleOnSubmit} className='layout-form'>
        <input
          className='emailInput'
          type='email'
          value={email}
          placeholder='Email'
          onChange={e => {
            setEmail(e.target.value);
          }}
        />
        <button type='submit' className='primary-btn'>
          Send Reset Link
        </button>
        {/* <Link to='/sign-in'>Sign In</Link> */}
      </form>
    </div>
  );
}

export default ForgotPassword;
