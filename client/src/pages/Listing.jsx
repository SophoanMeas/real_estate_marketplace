import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectFade, EffectCoverflow, Navigation, Pagination } from 'swiper/modules';

import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';

export default function Listing() {
  //   SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getListing/${params.listingId}`);
        const data = await res.json();
        console.log(data);
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      <div className='text-center my-7 text-2xl'>
        {loading && <p>Loading...</p>}
        {error && <p className='text-red-700'>Something went wrong!</p>}
      </div>
      {listing && !loading && !error && (
        <>
        <div className='w-[600px'>
        <Swiper
        effect={'coverflow'}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={'auto'}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className="mySwiper"
      >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='md:h-[350px] lg:h-[550px] h-[500px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          </div>
          <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10'>
            <FaShare
              className='text-green-500'
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
              Link copied!
            </p>
          )}
          <div className='flex flex-col max-w-4xl mx-auto p-3 mt-6 gap-4'>
            <p className='text-2xl font-semibold'>
              {listing.title} - ${' '}
              {listing.offer
                ? listing.discountPrice.toLocaleString('eng-US')
                : listing.regularPrice.toLocaleString('eng-US')}
              {listing.type === 'rent' && ' /month'}
            </p>
            <p className='flex items-center mt-6 gap-2 text-slate-600 text-mx'>
              <FaMapMarkerAlt className='text-green-700' /> {listing.address}
            </p>

            <div className='select-none flex gap-4'>
              <p className='bg-red-900 text-md shadow-2xl w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}{' '}
              </p>
              {listing.offer && (
                <p className='relative overflow-hidden text-md bg-green-900 shadow-2xl w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                  <div className='ribbon bg-red-500 text-sm whitespace-no-wrap px-4'>
                    sale
                  </div>
                  -${listing.regularPrice - listing.discountPrice}
                </p>
              )}
            </div>
            <p className='text-slate-800 mt-3'>
              <span className='font-semibold text-black'>Description - </span>{' '}
              {listing.description}
            </p>
            <ul className='select-none mt-5 mb-5 text-green-900 font-semibold text-lg flex items-center gap-4 sm:gap-6 flex-wrap'>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBed className='text-3xl' />
                <span> </span>
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaBath className='text-3xl' />
                <span> </span>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaChair className='text-3xl' />
                <span> </span>
                {listing.furnished ? 'Furnished' : 'Unfurnished'}
              </li>
              <li className='flex items-center gap-1 whitespace-nowrap'>
                <FaParking className='text-3xl' />
                <span> </span>
                {listing.parking ? 'Parking spot' : 'No Parking'}
              </li>
            </ul>
          </div>
        </>
      )}
    </main>
  );
}
