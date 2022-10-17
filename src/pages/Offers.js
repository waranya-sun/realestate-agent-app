import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Offers() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference to a collection, not a document
        const listingsRef = collection(db, 'listings');

        // Create a query
        // Firebase v.9 here, do a bit different
        const q = query(
          listingsRef,
          // It will be both rent and sale show together
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(5)
        );

        //Execute the query
        const querySnap = await getDocs(q);
        // Do this because we want to know what is the last index that we have fetched, then next time of fetching, it will start from here
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];
        querySnap.forEach(doc => {
          return listings.push({
            // ID will come from doc(which is the id of each record in the database) not doc.data(), it is separated
            id: doc.id,
            data: doc.data(),
          });
        });

        setListings(listings);
        setLoading(false);
      } catch (error) {
        toast.error('Could not fetch listing');
      }
    };

    fetchListings();
  }, []);

  const onFetchMoreListings = async () => {
    try {
      // Get reference to a collection, not a document
      const listingsRef = collection(db, 'listings');

      // Create a query
      // Firebase v.9 here, do a bit diffent
      const q = query(
        listingsRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        // This is important line of "Load More" function
        startAfter(lastFetchedListing),
        // This is the number that you will fetch next
        limit(5)
      );

      //Execute the query
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];
      querySnap.forEach(doc => {
        return listings.push({
          // ID will come from doc(which is the id of each record in the database) not doc.data(), it is separated
          id: doc.id,
          data: doc.data(),
        });
      });

      // Do this because we don't want it to replace the previous 10, we want to add to it
      setListings(prevState => [...prevState, ...listings]);
      setLoading(false);
    } catch (error) {
      toast.error('Could not fetch listing');
    }
  };

  return (
    <div className='layout-page'>
      <h1 className='heading-page'>
        Offers <span style={{ fontSize: '2.5rem' }}>(Rent and Sale)</span>
      </h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <ul className='no-list-style'>
            {listings.map(listing => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
              />
            ))}
          </ul>
        </>
      ) : (
        <p>There are no current offers</p>
      )}
      <br />
      <br />
      {lastFetchedListing && (
        <button
          className='load-more-btn'
          type='button'
          onClick={onFetchMoreListings}
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default Offers;
