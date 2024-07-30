import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import 'font-awesome/css/font-awesome.min.css';
import OAuth from '../components/OAuth';


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const renderTick = (condition) => {
    return !condition ? <i className="fa fa-spinner fa-spin" style={{ color: '#da1010', }} /> : <i className=" fa fa-solid fa-check" style={{ color: '#63E6BE', }} />;
  };

  const length = (password) => {
    if (password.length >= 6) {
      return true;
    }
    return false;
  }

  const uppercase = (password) => {
    if (/[A-Z]/.test(password)) {
      return true;
    }
    return false;
  }

  const digit = () => {
    if (/\d/.test(password)) {
      return true;
    }
    return false;
  }

  const special = () => {
    if (/[@$!%*?&]/.test(password)) {
      return true;
    }
    return false;
  }


  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    setFormData({
      ...formData,
      [e.target.id]:
        e.target.value,
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);

  };

  const isButtonDisabled = !password || !confirmPassword || (password !== confirmPassword) || !length(password) || !uppercase(password) || !special(password) || !digit(password);

  const hideUl = () => {
    return length(password) && uppercase(password) && special(password) && digit(password);
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
      setLoading(true);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });


      const data = await res.json();
      if (res.status === 201) {
        setLoading(false);
        toast.success(data);
        setTimeout(() => {
          navigate("/sign-in");
        }, 2500);
      }
      else if (res.status === 409) {
        setLoading(false);
        toast.error(data)
      }
    }
    catch (error) {
      setLoading(false);
      setError(error.message);
    }

  }
  return (
    <div className='p-3 max-w-md mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input type='text' placeholder='Name' className='border p-3 rounded-lg' id='name' onChange={handleChange} required />
        <input type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' onChange={handleChange} required />
        <input type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' onChange={handleChange} required />
        <div style={{ position: 'relative' }} >
          <input type={showPassword ? 'text' : 'password'} placeholder='Password' className='border p-3 rounded-lg w-full' id='password' onChange={handlePasswordChange} required />
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


        {!hideUl() && (
          <div>
            <ul >
              <li>{renderTick(length(password))} Minimum 6 characters</li>
              <li>{renderTick(uppercase(password))} Minimum one uppercase letter</li>
              <li>{renderTick(digit(password))} Minimum one digit</li>
              <li>{renderTick(special(password))} Minimum one special character</li>
            </ul>
          </div>
        )

        }
        <div style={{ position: 'relative' }}>
          <input type={showConfirmPassword ? 'text' : 'password'} placeholder='Confirm Password' className='border p-3 rounded-lg w-full' id='cpassword' onChange={handleConfirmPasswordChange} required />
          <span
            onClick={toggleConfirmPasswordVisibility}
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              cursor: 'pointer',
            }}
          >
            {showConfirmPassword ? <i className=" fa fa-solid fa-eye" /> : <i className=" fa fa-solid fa-eye-slash" />}
          </span>
        </div>

        <button disabled={isButtonDisabled} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>Sign Up</button>
        <p style={{ 'textAlign': 'center' }}>OR</p>
        <OAuth />
        <Toaster />
      </form >
      <div className='flex gap-2 mt-5'>
        <p>Have an account? </p>
        <Link to='/sign-in' className='text-blue-700 hover:underline'>Sign In</Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div >
  )
}
