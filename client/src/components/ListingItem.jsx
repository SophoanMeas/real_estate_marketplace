import React from 'react';
import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

export default function ListingItem({ listing }) {
  return (
    <div className='bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[280px]'>
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt='listing cover'
          className='h-[320px] sm:h-[220px] w-fill object-cover hover:scale-105 transition-scale duration-200'
        ></img>
        <div className='p-3 flex flex-col gap-2 w-full'>
          <p className='text-lg font-semibold text-slate-700 truncate'>
            {listing.title}
          </p>
          <div className='flex items-center gap-1'>
            <MdLocationOn size={20} className='text-green-700' />
            <p className='truncate text-sm text-gray-600'>{listing.address}</p>
          </div>
          <p className='text-sm text-gray-600 line-clamp-4'>
            {listing.description}
          </p>
          <p className='text-slate-500 mt-2 font-semibold'>
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString('eng-us')
              : listing.regularPrice.toLocaleString('eng-us')}
            {listing.type === 'rent' && ' /month'}
            <div className='text-slate-700 flex gap-3 mt-1'>
              <div className='font-bold text-sm'>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </div>
              <div className='font-bold text-sm'>
                {listing.bedrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </div>
            </div>
          </p>
        </div>
      </Link>
    </div>
  );
}
