import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import {
  doc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ListingItem from '../components/ListingItem';
import { BsArrowRightCircle } from 'react-icons/bs';

function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const { name, email } = formData;

  useEffect(() => {
    // We're fetching the listings that match the userRef of logged-in user
    async function fetchUserListings() {
      const listingsRef = collection(db, 'listings');
      const q = query(
        listingsRef,
        where('userRef', '==', auth.currentUser.uid),
        orderBy('timestamp', 'desc')
      );

      const querySnap = await getDocs(q);
      const listings = [];
      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setListings(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid]);

  // function handleSignOutBtn() {
  //   auth.signOut();
  //   navigate('/');
  // }

  async function handleSubmitBtn() {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update the displayName in firebase
        // Second parameter is the object that we want to update
        await updateProfile(auth.currentUser, {
          displayName: name,
        });

        // Update in the firestore, the way to update the document is we need to create a reference
        // We're creating a reference to the document
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
    } catch (error) {
      toast.error('Could not update profile details');
    }
  }

  function handleOnEdit(listingId) {
    navigate(`/edit-listing/${listingId}`);
  }

  function handleOnChange(e) {
    setFormData(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }

  async function handleOnDelete(listingId) {
    if (window.confirm('Are you sure you want to delete?')) {
      // We can do this way as well, apart from
      // const docRef = doc()
      // This way we pass it in directly
      // This will delete the document from firebase
      await deleteDoc(doc(db, 'listings', listingId));

      // So we want to update the UI as well
      const updatedListing = listings.filter(
        listing => listing.id !== listingId
      );
      setListings(updatedListing);
      toast.success('Successfully deleted listing');
    }
  }

  return (
    <div className='layout-page'>
      <h1 className='heading-page'>My Profile</h1>
      {/* <button type='button' onClick={handleSignOutBtn}>
        Sign Out
      </button> */}
      <div className='change-name'>
        <p>Personal Name</p>
        <p
          onClick={() => {
            // First when you click, this changeDetails still be "false" as the default
            changeDetails && handleSubmitBtn();
            setChangeDetails(prevState => !prevState);
          }}
        >
          <span className='change-btn'>
            {changeDetails ? 'Done' : 'Change'}
          </span>
        </p>
      </div>

      <form className='change-name-form'>
        <input
          type='text'
          id='name'
          value={name}
          onChange={handleOnChange}
          className={!changeDetails ? 'profileName' : 'profileNameActive'}
          disabled={!changeDetails}
        />
        {/* It seems like we cannot update the email through the profile, as the email is what we use as the login, which firebase probably doesn't let us change the email in the Authentication, then you don't need to update it in the firestore database */}
        {/* <label htmlFor='email'>Email : </label>
        <input
          type='email'
          id='email'
          value={email}
          onChange={handleOnChange}
        /> */}
      </form>
      <Link className='sale-rent-link-btn' to='/create-listing'>
        Sale or Rent you Home{' '}
        <BsArrowRightCircle
          style={{ position: 'relative', top: '4px', left: '6px' }}
        />
      </Link>
      {!loading && listings?.length > 0 && (
        <>
          <p className='sub-heading-page'>Your Listings</p>
          <ul className='no-list-style'>
            {listings.map(listing => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
                onEdit={() => handleOnEdit(listing.id)}
                onDelete={() => handleOnDelete(listing.id)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Profile;
