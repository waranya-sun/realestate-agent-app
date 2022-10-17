import React, { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
// Not from the firestore because this is storage
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';

function EditLising() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);

  //Redirect if listing is not user's
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error('You cannot edit that listing');
      navigate('/');
    }
  });

  // Sets useRef to logged-in user
  useEffect(() => {
    // Then we get the callback with a potential user
    onAuthStateChanged(auth, user => {
      if (user) {
        setFormData({ ...formData, userRef: user.uid });
      } else {
        navigate('/sign-in');
      }
    });
  }, []);

  // Fetch listing to edit
  useEffect(() => {
    setLoading(true);
    async function fetchListing() {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({ ...docSnap.data(), address: docSnap.data().location });
        setLoading(false);
      } else {
        navigate('/');
        toast.error('Listing does not exist');
      }
    }

    fetchListing();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  async function handleSubmitForm(e) {
    e.preventDefault();
    console.log(formData);
    setLoading(true);
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error('Discounted price needs to be less than regular price');
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('Max 6 images');
      return;
    }

    let location;
    let geolocation = {};

    if (geolocationEnabled) {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDhi68kpwR1hfr4Vmuu2rDYcgKb_ry-vX0`
      );

      const data = await response.json();
      console.log(data);
      geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
      geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;
      location =
        data.status === 'ZERO_RESULTS'
          ? undefined
          : data.results[0]?.formatted_address;

      if (location === undefined || location.includes('undefined')) {
        setLoading(false);
        toast.error('Please enter a correct address');
        return;
      }
    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // Store a image in firebase
    const storeImage = async image => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

        const storageRef = ref(storage, 'images/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          'state_changed',
          snapshot => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          error => {
            reject(error);
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    // Promise.all will resolve multiple promises
    const imageUrls = await Promise.all(
      [...images].map(image => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Images not upload');
      return;
    });

    // An object that we're going to send to the database which we want to add other stuffs as well
    const formDataCopy = {
      ...formData,
      imageUrls,
      geolocation,
      timestamp: serverTimestamp(),
    };

    formDataCopy.location = address;
    delete formDataCopy.images;
    delete formDataCopy.address;
    !formDataCopy.offer && delete formDataCopy.discountedPrice;

    // Now we want to update listing
    const docRef = doc(db, 'listings', params.listingId);
    await updateDoc(docRef, formDataCopy);

    setLoading(false);

    toast.success('Listing saved');

    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  function handleOnChangeElements(e) {
    // Because the boolean value will come as the "String",
    // we need to set it back to  be "Boolean"
    let boolean = null;

    if (e.target.value === 'true') {
      boolean = true;
    }

    if (e.target.value === 'false') {
      boolean = false;
    }

    // For text/boolean/number
    if (!e.target.files) {
      setFormData(prevState => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }

    // For files
    // This will be an array of files (we can have multiple files)
    if (e.target.files) {
      setFormData(prevState => ({
        ...prevState,
        images: e.target.files,
      }));
    }
  }

  // return (
  //   <>
  //     <h1>Edit a Listing</h1>
  //     <form onSubmit={handleSubmitForm}>
  //       <div>
  //         <label>Sell / Rent</label>
  //         <button
  //           id='type'
  //           type='button'
  //           value='sale'
  //           onClick={handleOnChangeElements}
  //           className={type === 'sale' ? 'activeBtn' : ''}
  //         >
  //           Sell
  //         </button>
  //         <button
  //           id='type'
  //           type='button'
  //           value='rent'
  //           onClick={handleOnChangeElements}
  //           className={type === 'rent' ? 'activeBtn' : ''}
  //         >
  //           Rent
  //         </button>
  //       </div>

  //       <div>
  //         <label htmlFor='name'>Name</label>
  //         <input
  //           id='name'
  //           type='text'
  //           value={name}
  //           onChange={handleOnChangeElements}
  //           maxLength='32'
  //           minLength='10'
  //           required
  //         />
  //       </div>

  //       <div>
  //         <label htmlFor='bedrooms'>Bedrooms</label>
  //         <input
  //           id='bedrooms'
  //           type='number'
  //           value={bedrooms}
  //           onChange={handleOnChangeElements}
  //           min='1'
  //           max='50'
  //           required
  //         />
  //       </div>
  //       <div>
  //         <label htmlFor='bathrooms'>Bathrooms</label>
  //         <input
  //           id='bathrooms'
  //           type='number'
  //           value={bathrooms}
  //           onChange={handleOnChangeElements}
  //           min='1'
  //           max='50'
  //           required
  //         />
  //       </div>
  //       <div>
  //         <label htmlFor='parking'>Parking spot</label>
  //         <button
  //           id='parking'
  //           type='button'
  //           value={true}
  //           onClick={handleOnChangeElements}
  //           className={parking === true ? 'activeBtn' : ''}
  //         >
  //           Yes
  //         </button>
  //         <button
  //           id='parking'
  //           type='button'
  //           value={false}
  //           onClick={handleOnChangeElements}
  //           className={!parking && parking !== null ? 'activeBtn' : ''}
  //         >
  //           No
  //         </button>
  //       </div>
  //       <div>
  //         <label htmlFor='furnished'>Furnished</label>
  //         <button
  //           id='furnished'
  //           type='button'
  //           value={true}
  //           onClick={handleOnChangeElements}
  //           className={furnished ? 'activeBtn' : ''}
  //         >
  //           Yes
  //         </button>
  //         <button
  //           id='furnished'
  //           type='button'
  //           value={false}
  //           onClick={handleOnChangeElements}
  //           className={!furnished && furnished !== null ? 'activeBtn' : ''}
  //         >
  //           No
  //         </button>
  //       </div>
  //       <div>
  //         <label htmlFor='address'>Address</label>
  //         <input
  //           id='address'
  //           type='text'
  //           value={address}
  //           onChange={handleOnChangeElements}
  //           required
  //         />

  //         {!geolocationEnabled && (
  //           <>
  //             <br />
  //             <label htmlFor='latitude'>Latitude</label>
  //             <input
  //               id='latitude'
  //               type='number'
  //               value={latitude}
  //               onChange={handleOnChangeElements}
  //               required
  //             />
  //             <br />
  //             <label htmlFor='longitude'>Longitude</label>
  //             <input
  //               id='longitude'
  //               type='number'
  //               value={longitude}
  //               onChange={handleOnChangeElements}
  //               required
  //             />
  //           </>
  //         )}
  //       </div>
  //       <div>
  //         <label htmlFor='offer'>Offer</label>
  //         <button
  //           id='offer'
  //           type='button'
  //           value={true}
  //           onClick={handleOnChangeElements}
  //           className={offer ? 'activeBtn' : ''}
  //         >
  //           Yes
  //         </button>
  //         <button
  //           id='offer'
  //           type='button'
  //           value={false}
  //           onClick={handleOnChangeElements}
  //           className={!offer && offer !== null ? 'activeBtn' : ''}
  //         >
  //           No
  //         </button>
  //       </div>
  //       <div>
  //         <label htmlFor='regularPrice'>Regular Price</label>
  //         <input
  //           id='regularPrice'
  //           type='number'
  //           value={regularPrice}
  //           onChange={handleOnChangeElements}
  //           min='50'
  //           max='10000000000'
  //           required
  //         />
  //         {type === 'rent' && <p>$ / Month</p>}
  //       </div>
  //       {offer && (
  //         <>
  //           <div>
  //             <label htmlFor='discountedPrice'>Discounted Price</label>
  //             <input
  //               id='discountedPrice'
  //               type='number'
  //               value={discountedPrice}
  //               onChange={handleOnChangeElements}
  //               min='50'
  //               max='10000000000'
  //               required={offer}
  //             />
  //           </div>
  //         </>
  //       )}
  //       <div>
  //         <label>Images</label>
  //         <p>The first image will be the cover (max. 6)</p>
  //         <input
  //           id='images'
  //           type='file'
  //           onChange={handleOnChangeElements}
  //           max='6'
  //           accept='.jpg, .png, .jpeg'
  //           multiple
  //           required
  //         />
  //       </div>
  //       <div>
  //         <button type='submit'>Edit Listing</button>
  //       </div>
  //     </form>
  //   </>
  // );
  return (
    <div className='layout-page'>
      <h1 className='heading-page'>Edit a Listing</h1>
      <form className='layout-form' onSubmit={handleSubmitForm}>
        <div className='form-field'>
          <label className='form-label'>Sell / Rent</label>
          <div className='form-buttons'>
            <button
              id='type'
              type='button'
              value='sale'
              onClick={handleOnChangeElements}
              className={type === 'sale' ? 'form-button-active' : 'form-button'}
            >
              Sell
            </button>
            <button
              id='type'
              type='button'
              value='rent'
              onClick={handleOnChangeElements}
              className={type === 'rent' ? 'form-button-active' : 'form-button'}
            >
              Rent
            </button>
          </div>
        </div>

        {/* <div>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            value={name}
            onChange={handleOnChangeElements}
            maxLength='32'
            minLength='10'
            required
          />
        </div> */}

        <div className='form-field'>
          <label htmlFor='bedrooms' className='form-label'>
            Bedrooms
          </label>
          <input
            id='bedrooms'
            type='number'
            value={bedrooms}
            onChange={handleOnChangeElements}
            min='1'
            max='50'
            required
            className='form-bedroom'
          />
        </div>
        <div className='form-field'>
          <label htmlFor='bathrooms' className='form-label'>
            Bathrooms
          </label>
          <input
            id='bathrooms'
            type='number'
            value={bathrooms}
            onChange={handleOnChangeElements}
            min='1'
            max='50'
            required
            className='form-bathroom'
          />
        </div>
        <div className='form-field'>
          <label htmlFor='parking' className='form-label'>
            Parking spot
          </label>
          <div className='form-buttons'>
            <button
              id='parking'
              type='button'
              value={true}
              onClick={handleOnChangeElements}
              className={
                parking === true ? 'form-button-active' : 'form-button'
              }
            >
              Yes
            </button>
            <button
              id='parking'
              type='button'
              value={false}
              onClick={handleOnChangeElements}
              className={
                !parking && parking !== null
                  ? 'form-button-active'
                  : 'form-button'
              }
            >
              No
            </button>
          </div>
        </div>
        <div className='form-field'>
          <label htmlFor='furnished' className='form-label'>
            Furnished
          </label>
          <div className='form-buttons'>
            <button
              id='furnished'
              type='button'
              value={true}
              onClick={handleOnChangeElements}
              className={furnished ? 'form-button-active' : 'form-button'}
            >
              Yes
            </button>
            <button
              id='furnished'
              type='button'
              value={false}
              onClick={handleOnChangeElements}
              className={
                !furnished && furnished !== null
                  ? 'form-button-active'
                  : 'form-button'
              }
            >
              No
            </button>
          </div>
        </div>
        <div className='form-field'>
          <label htmlFor='address' className='form-label'>
            Address
          </label>
          <div>
            <textarea
              id='address'
              type='text'
              cols='30'
              rows='5'
              value={address}
              onChange={handleOnChangeElements}
              required
              className='form-textarea'
            />
          </div>

          {!geolocationEnabled && (
            <>
              <br />
              <label htmlFor='latitude'>Latitude</label>
              <input
                id='latitude'
                type='number'
                value={latitude}
                onChange={handleOnChangeElements}
                required
              />
              <br />
              <label htmlFor='longitude'>Longitude</label>
              <input
                id='longitude'
                type='number'
                value={longitude}
                onChange={handleOnChangeElements}
                required
              />
            </>
          )}
        </div>
        <div className='form-field'>
          <label htmlFor='offer' className='form-label'>
            Offer
          </label>
          <div className='form-buttons'>
            <button
              id='offer'
              type='button'
              value={true}
              onClick={handleOnChangeElements}
              className={offer ? 'form-button-active' : 'form-button'}
            >
              Yes
            </button>
            <button
              id='offer'
              type='button'
              value={false}
              onClick={handleOnChangeElements}
              className={
                !offer && offer !== null ? 'form-button-active' : 'form-button'
              }
            >
              No
            </button>
          </div>
        </div>
        <div className='form-field'>
          <label htmlFor='regularPrice' className='form-label'>
            Regular Price {type === 'rent' && '( per Month)'}
          </label>
          <input
            id='regularPrice'
            type='number'
            value={regularPrice}
            onChange={handleOnChangeElements}
            min='50'
            max='10000000000'
            required
            className='form-regular-price'
          />
        </div>
        {offer && (
          <>
            <div className='form-field'>
              <label htmlFor='discountedPrice' className='form-label'>
                Discounted Price
              </label>

              <input
                id='discountedPrice'
                type='number'
                value={discountedPrice}
                onChange={handleOnChangeElements}
                min='50'
                max='10000000000'
                required={offer}
                className='form-discounted-price'
              />
            </div>
          </>
        )}
        <div className='form-field'>
          <label className='form-label'>Images</label>
          <p style={{ fontSize: '1.3rem', margin: '6px 0' }}>
            * The first image will be the cover (
            <span style={{ fontWeight: 'bold' }}>max. 6</span>)
          </p>
          <input
            id='images'
            type='file'
            onChange={handleOnChangeElements}
            max='6'
            accept='.jpg, .png, .jpeg'
            multiple
            required
            className='form-input-file'
          />
        </div>
        <div className='form-field'>
          <button type='submit' className='primary-btn'>
            Edit Listing
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditLising;

// AIzaSyDhi68kpwR1hfr4Vmuu2rDYcgKb_ry-vX0
