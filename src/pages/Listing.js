import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import { BsShareFill } from 'react-icons/bs';

// To enable the modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {
    async function fetchLising() {
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    }
    fetchLising();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listing.imageUrls.map((url, idx) => (
          <SwiperSlide key={idx}>
            <div
              className='swiper-style'
              style={{
                background: `url(${listing.imageUrls[idx]}) center no-repeat`,
                // backgroundSize: 'cover',
                // height: '60rem',
                // width: '100%',
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div
        className='share-icon-div'
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => {
            setShareLinkCopied(false);
          }, 2000);
        }}
      >
        <BsShareFill className='share-icon' />
      </div>
      {shareLinkCopied && <p className='linkCopied'>Link Copied!</p>}
      <div className='listing-details-div'>
        <p style={{ fontWeight: 'bold' }}>
          {/* {listing.name} - $ */}
          {listing.location} - $
          {listing.offer
            ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        </p>
        {/* <p>{listing.location}</p> */}
        <div className='showDiscount'>
          <div>
            <span className='for-rent'>
              For {listing.type === 'rent' ? 'Rent' : 'Sale'}
            </span>
          </div>
          <div>
            {listing.offer && (
              <span className='discounted'>
                $
                {(listing.regularPrice - listing.discountedPrice)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
                discount
              </span>
            )}
          </div>
        </div>

        <ul style={{ listStyle: 'none' }}>
          <li>
            {listing.bedrooms > 1
              ? `${listing.bedrooms} Bedrooms`
              : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1
              ? `${listing.bathrooms} Bathrooms`
              : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>
        <h5 style={{ marginTop: '3rem' }}>Location</h5>
        <div>
          <MapContainer
            className='map-style'
            // style={{ height: '300px', width: '100%' }}
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>
        {auth.currentUser?.uid !== listing.userRef && (
          // We passed the Listing name and location via URL, so that we can pre-filled the email with these.
          <Link
            className='contact-landlord-link'
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
          >
            Contact Landlord
          </Link>
        )}
      </div>
    </>
  );
}

export default Listing;
