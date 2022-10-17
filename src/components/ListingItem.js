import React from 'react';
import { Link } from 'react-router-dom';
import { IoBed } from 'react-icons/io5';
import { FaShower } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import { AiTwotoneDelete } from 'react-icons/ai';

function ListingItem({ listing, id, onEdit, onDelete }) {
  function handleDeleteBtn() {
    onDelete(listing.id, listing.name);
  }
  return (
    <li className='listing-item-list'>
      <Link
        to={`/category/${listing.type}/${id}`}
        className='listing-item-link'
      >
        <div>
          <img className='listing-item-img' src={listing.imageUrls[0]} />
        </div>

        <div className='listing-item-details'>
          <p>{listing.location}</p>
          {/* <p>{listing.name}</p> */}
          <p>
            <span className='listing-item-price'>
              $
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : listing.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              {listing.type === 'rent' && ' / Month'}
            </span>
          </p>
          <div className='room-details'>
            <div className='room-detail'>
              <IoBed className='list-item-icon' />
              {listing.bedrooms > 1
                ? `${listing.bedrooms} Bedrooms`
                : '1 Bedroom'}
            </div>
            <div>
              <FaShower className='list-item-icon' />
              {listing.bathrooms > 1
                ? `${listing.bathrooms} Bathrooms`
                : '1 Bathroom'}
            </div>
          </div>
        </div>
      </Link>
      <div className='edit-delete-btns'>
        {onEdit && (
          // <button type='button' >
          <FaEdit className='danger-btn' onClick={() => onEdit(id)} />
          // </button>
        )}
        {onDelete && (
          <AiTwotoneDelete className='danger-btn' onClick={handleDeleteBtn} />
        )}
      </div>
    </li>
  );
}

export default ListingItem;
