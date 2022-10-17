import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference to a collection, not a document
        const listingsRef = collection(db, 'listings');

        // Create a query
        // Firebase v.9 here, do a bit diffent
        const q = query(
          listingsRef,
          where('type', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          // Initial limit in useEffect
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

  // Pagination / Load More
  const onFetchMoreListings = async () => {
    try {
      // Get reference to a collection, not a document
      const listingsRef = collection(db, 'listings');

      // Create a query
      // Firebase v.9 here, do a bit diffent
      const q = query(
        listingsRef,
        where('type', '==', params.categoryName),
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
      <h1 className='heading-page'>For {params.categoryName}</h1>
      {loading ? (
        <Spinner />
      ) : listings && listings.length > 0 ? (
        <>
          <ul>
            {listings.map(listing => (
              <ListingItem
                key={listing.id}
                listing={listing.data}
                id={listing.id}
              />
            ))}
          </ul>
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
        </>
      ) : (
        <p style={{ fontSize: '1.8rem' }}>
          <span style={{ color: 'red' }}>* </span>No listing for{' '}
          {params.categoryName}
        </p>
      )}
    </div>
  );
}

export default Category;
