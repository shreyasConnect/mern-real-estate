import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import 'font-awesome/css/font-awesome.min.css';
import OAuth from '../components/OAuth';


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]:
        e.target.value,
    });
  };


  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.status === 200) {
        toast.success("Sign in success!");
        setTimeout(() => {
          navigate("/");
        }, 2500);
      }
      else if (res.status === 401) {
        toast.error(data);
      }
      else if (res.status === 404) {
        toast.error(data);
      }
    }
    catch (error) {
      setError(error.message);
    }

  }
  return (
    <div className='p-3 max-w-md mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='Username / E-mail' className='border p-3 rounded-lg' id='usernameOrEmail' onChange={handleChange} required />
        <div style={{ position: 'relative' }} >
          <input type={showPassword ? 'text' : 'password'} placeholder='Password' className='border p-3 rounded-lg w-full' id='password' onChange={handleChange} required />
          <span
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
          >
            {showPassword ? <i className=" fa fa-solid fa-eye" /> : <i className=" fa fa-solid fa-eye-slash" />}
          </span>
        </div>


        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign In</button>
        <p style={{ 'textAlign': 'center' }}>OR</p>
        <OAuth />
        <Toaster />
      </form >
      <div className='flex gap-2 mt-5'>
        <p>Don't have an account? </p>
        <Link to='/sign-up' className='text-blue-700 hover:underline'>Sign Up</Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div >
  )
}
