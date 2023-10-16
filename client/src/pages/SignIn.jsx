import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice.js';
import OAuth from '../components/OAuth.jsx';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success == false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='max-w-lg mx-auto mt-10 p-4 bg-indigo-300 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <h1 className='text-xl text-center font-semibold my-5'>Sign In</h1>
        <label className='block text-sm font-medium'>Your email</label>
        <div className="relative mb-3">
        <input
          onChange={handleChange}
          type='email'
          name='email'
          id='email'
          className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
          placeholder='name@company.com'
          required
        ></input>
        </div>
        <label className='block text-sm font-medium'>Your password</label>
        <input
          onChange={handleChange}
          type='password'
          name='password'
          id='password'
          className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
          placeholder="••••••••"
          required
        ></input>
        <label className='block text-sm font-medium'>Confirm password</label>
        <input
          onChange={handleChange}
          type='password'
          name='ConfirmPassword'
          id='ConfirmPassword'
          className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
          placeholder="••••••••"
          required
        ></input>
        <div className="flex items-start">
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" >
                </input>
                </div>
                <label className="ml-2 text-sm font-medium text-gray-90">Remember me</label>
            </div>
            <a href="#" className="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500">Lost Password?</a>
        </div>
        <button
          disabled={loading}
          className='primary-button w-full text-white rounded-lg py-2.5 mt-10  uppercase hover:opacity-80 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
         <p>Not registered?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Create account</span>
        </Link>
      </div>
       {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
