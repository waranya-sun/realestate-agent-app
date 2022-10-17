import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import Spinner from './Spinner';
import paintYellow from '../assets/paintYellow.png';

// To enable the modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Slider() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];
      querySnap.forEach(doc => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        });
      });

      setListings(listings);
      setLoading(false);
    };

    fetchListings();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  // If no listings
  if (listings.length === 0) {
    return <></>;
  }

  return (
    <>
      <Swiper slidesPerView={1} pagination={{ clickable: true }}>
        {listings.map(({ id, data }) => (
          <SwiperSlide
            key={id}
            onClick={() => navigate(`/category/${data.type}/${id}`)}
          >
            {/* It is actually the Background Image */}
            <div
              className='swiper-style'
              style={{
                background: `url(${data.imageUrls[0]}) center no-repeat`,
                // backgroundSize: 'cover',
                // height: '60rem',
                // width: '100%',
              }}
            >
              ,
              <img
                src={paintYellow}
                alt='new listings this week'
                className='paintYellow'
              />
              {/* <p>{data.name}</p>
              <p>
                {data.discountedPrice ?? data.regularPrice}
                {data.type === 'rent' && ' / month'}
              </p> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

export default Slider;
