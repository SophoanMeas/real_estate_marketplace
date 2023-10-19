import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OAuth from '../components/OAuth';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success == false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/sign-in');
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className='max-w-lg mx-auto mt-10 p-4 bg-indigo-300 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <h1 className='text-xl text-center font-semibold my-5'>Sign Up</h1>
        <label className='block text-sm font-medium'>Username</label>
        <div className='relative mb-3'>
          <input
            onChange={handleChange}
            type='username'
            name='username'
            id='username'
            className='bg-gray-50 border pl-2 text-sm rounded-full hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
            placeholder='username'
            required
          ></input>
        </div>
        <label className='block text-sm font-medium'>Your email</label>
        <input
          onChange={handleChange}
          type='email'
          name='email'
          id='email'
          className='bg-gray-50 border pl-2 text-sm rounded-full hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
          placeholder='name@company.com'
          required
        ></input>
        <label className='block text-sm font-medium'>Your password</label>
        <input
          onChange={handleChange}
          type='password'
          name='password'
          id='password'
          className='bg-gray-50 border pl-2 text-sm rounded-lg hover:border-sky-500 focus:border-sky-500 block w-full p-2.5'
          placeholder='••••••••'
          required
        ></input>
        <button
          disabled={loading}
          className='primary-button py-2.5 mt-10 uppercase hover:opacity-80 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth />
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
