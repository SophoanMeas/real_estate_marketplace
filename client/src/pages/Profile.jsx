import { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(file)
  console.log(fileUploadError)

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

  return (
    <div className='max-w-2xl p-3 mx-4 sm:max-w-lg md:max-w-lg lg:max-w-lg xl:max-w-lg sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto mt-16 bg-white shadow-xl rounded-lg text-gray-900'>
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
            <span className='text-red-700'>Error image upload (image must be less than 2 mb)</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-500'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
      <div className='max-w-lg mx-auto p-4 mt-10 flex flex-col gap-3 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8'>
        <input
          type='username'
          name='username'
          id='username'
          className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
          placeholder='username'
          required
        ></input>
        <input
          type='email'
          name='email'
          id='email'
          className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
          placeholder='name@company.com'
          required
        ></input>
        <input
          type='password'
          name='password'
          id='password'
          className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
          placeholder='password'
          required
        ></input>
      </div>

      <div className='p-4 mt-5 flex flex-col max-w-lg mx-auto gap-3'>
        <button className='rounded-full bg-gray-800 hover:shadow-lg font-semibold text-white px-6 py-2 uppercase hover:opacity-80 disabled:opacity-80'>
          update
        </button>
        <button className='rounded-full bg-green-700 hover:shadow-lg font-semibold text-white px-6 py-2 uppercase hover:opacity-80 disabled:opacity-80'>
          Creating Listing
        </button>
      </div>
    </div>
  );
}
