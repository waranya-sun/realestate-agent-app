import React, { useState, useEffect } from 'react';
// useParams allows you the get the :(colon), to get the query-string, you have to use the useSearchParams
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';

function Contact() {
  const [message, setMessage] = useState('');
  const [landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  useEffect(() => {
    async function getLandlord() {
      const docRef = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setLandlord(docSnap.data());
      } else {
        toast.error('Could not get landload data');
      }
    }

    getLandlord();
  }, [params.landlordId]);

  return (
    <div className='layout-page'>
      <h1 className='heading-page'>Contact Landlord</h1>
      {landlord !== null && (
        <>
          <form className='layout-form'>
            <p className='sub-heading-page'>Contact : {landlord?.name}</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>Message :</p>
            <textarea
              name='message'
              id='message'
              value={message}
              onChange={e => setMessage(e.target.value)}
              className='contact-textarea'
            ></textarea>
            {/* Notice : We use the link here */}
            <a
              href={`mailto:${landlord.email}?Subject=${searchParams.get(
                'listingName'
              )}&body=${message}`}
            >
              <button type='button' className='primary-btn'>
                Send Message
              </button>
            </a>
          </form>
        </>
      )}
    </div>
  );
}

export default Contact;
