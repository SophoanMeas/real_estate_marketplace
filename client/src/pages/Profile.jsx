import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from '../redux/user/userSlice';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) =>
          setFormData({ ...formData, avatar: getDownloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListings((pervData) =>
        pervData.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='max-w-2xl p-3 mx-4 sm:max-w-lg md:max-w-lg lg:max-w-lg xl:max-w-lg sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900'>
      <div className=' bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8'>
        <div className='h-32 m-5 overflow-hidden'>
          <h1 className='text-3xl pt-2 font-semibold text-center my-3'>
            Profile
          </h1>
        </div>
        <div className='mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          ></input>
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            className='object-cover h-32 cursor-pointer self-center'
            alt='avatar'
          />
        </div>
        <div className='text-center mt-2'>
          <h2 className='font-semibold'></h2>
          <p className='text-gray-500'></p>
        </div>
        <p className='mt-3 text-sm text-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-500'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <form
          onSubmit={handleSubmit}
          className='max-w-lg mx-auto p-4 mt-10 flex flex-col gap-3'
        >
          <input
            type='username'
            name='username'
            id='username'
            defaultValue={currentUser.username}
            className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
            placeholder='username'
            onChange={handleChange}
            required
          ></input>
          <input
            type='email'
            name='email'
            id='email'
            defaultValue={currentUser.email}
            className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
            placeholder='name@company.com'
            onChange={handleChange}
            required
          ></input>
          <input
            type='password'
            name='password'
            id='password'
            className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
            placeholder='password'
            onChange={handleChange}
          ></input>
          <div className=' mt-5 flex flex-col max-w-lg gap-3'>
            <button
              disabled={loading}
              className='rounded-full bg-gray-800 hover:shadow-lg font-semibold text-white px-6 py-2 uppercase hover:opacity-80 disabled:opacity-80'
            >
              {loading ? 'Loading...' : 'Update'}
            </button>
            <Link
              className='
              rounded-full
              bg-green-700
              hover:shadow-lg
              font-semibold
              text-white
              px-6
              py-2
              uppercase
              hover:opacity-80
              disabled:opacity-80 text-center'
              to='/create-listing'
            >
              Create Listing
            </Link>
          </div>
        </form>
        <div className='flex justify-between mt-2 p-3'>
          <span
            onClick={handleDeleteUser}
            className='text-red-700 cursor-pointer'
          >
            Delete Account
          </span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
            Sign out
          </span>
        </div>
        <p className='text-red-700 mt-5'>{error ? error : ''}</p>
        <p className='text-green-600 mt-5'>
          {updateSuccess ? 'user is updated successfully!' : ''}
        </p>
        <button
          onClick={handleShowListings}
          className='text-green-600 w-full pb-3'
        >
          Show Listings
        </button>
        <p>{showListingError ? 'Error showing listings' : ''}</p>
        {userListings && userListings.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h1 className='text-center mt-7 text-2xl font-semibold'>
              Your Listing
            </h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border rounded-lg p-3 flex justify-between items-center gap-4'
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-20 w-20 object-contain'
                  />
                </Link>
                <Link
                  className='flex-1 text-slate-700 font-semibold hover:underline truncate'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.title}</p>
                </Link>
                <div className='flex flex-col items-center'>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className='text-red-700 uppercase'
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
