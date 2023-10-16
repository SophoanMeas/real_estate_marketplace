import React from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col'>
        <img src={currentUser.avatar} alt='avatar'  className='rounded-full mt-2 h-24 w-24 object-cover cursor-pointer self-center'/>
      <div className='mt-10 flex flex-col gap-3'>
      <input type='text' placeholder='username' id='username' className='border p-2 rounded-lg'></input>
      <input type='text' placeholder='email ' id='email' className='border p-2 rounded-lg'></input>
      <input type='text' placeholder='password' id='password' className='border p-2 rounded-lg'></input>
      <button className= 'text-white primary-button rounded-lg p-3 uppercase hover:opacity-80 disabled:opacity-80'>update</button>
      </div>
      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer'>Delete Account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  );
}
