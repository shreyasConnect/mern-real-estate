import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserStart, signOutUserSuccess, signOutUserFailure, } from '../redux/user/userSlice.js';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const [premiumMember, setPremiumMember] = useState(false);
  const { currentUser } = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
    handlePremium();
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
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handlePremium = async () => {
    try {
      console.log("prem hit")
      const res = await fetch(`/api/payment/premium/${currentUser._id}`, {
      });
      const data = await res.json();
      console.log("object")
      if (res.status === 200) {
        setPremiumMember(true);
      }
      else if (res.status == 500) {
        console.log(data)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

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
      if (res.status === 200) {
        toast.success("Details updated successfully!")
        dispatch(updateUserSuccess(data));
      }
      else if (res.status === 409) {
        toast.error(data)
        dispatch(updateUserFailure(data.message));
      }
      else if (res.status === 408) {
        toast.error(data);
        dispatch(updateUserFailure(data.message));
      }
      else if (res.status === 401) {
        toast.error(data)
        dispatch(updateUserFailure(data.message));
      }
      else if (res.status === 403) {
        toast.error(data);
        dispatch(updateUserFailure(data.message));
      }
      else {
        dispatch(updateUserFailure(data.message));
        return;
      }

    }
    catch (error) {
      dispatch(updateUserFailure(error.message));

    }
  }

  const handleDeleteuser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.status === 200) {
        console.log("hii")
        toast.success("User deleted successfully!")
        dispatch(deleteUserSuccess(data));
        navigate("/sign-in");
      } else if (res.status === 401) {
        toast.error(data)
        dispatch(deleteUserFailure(data.message));
      }
      else if (res.status === 403) {
        toast.error(data);
        dispatch(deleteUserFailure(data.message));
      }
      else {
        dispatch(deleteUserFailure(data.message));
        return;
      }
    }
    catch (error) {
      dispatch(deleteUserFailure(error.message));
      console.log("An error occured: ", error)
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (res.status === 200) {
        toast.success("Sign Out Successfully!")
        dispatch(signOutUserSuccess(data));
      }
      else {
        toast.error("Something went wrong!")
        dispatch(signOutUserFailure(data.message));
      }
    }
    catch (error) {
      dispatch(signOutUserFailure(data.message));
      console.log("An error occured: ", error);
    }
  }
  const premiumStyle = {
    boxShadow: premiumMember ? '0 0 10px 5px green' : 'none',


  }
  return (
    <div className='p-3 max-w-sm mx-auto'>

      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} hidden accept='image/*' />
        <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' style={premiumStyle} />
        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input type='text' placeholder='Username' id='username' className='border p-3 rounded-lg' defaultValue={currentUser.username} onChange={handleChange} />
        <input type='text' placeholder='Name' id='name' className='border p-3 rounded-lg' defaultValue={currentUser.name} onChange={handleChange} />
        <input type='text' placeholder='Email' id='email' className='border p-3 rounded-lg' defaultValue={currentUser.email} onChange={handleChange} />
        <input type='password' placeholder='Password' id='password' className='border p-3 rounded-lg' onChange={handleChange} />
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95' >UPDATE</button>
        <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' to={"/create-listing"}>CREATE LISTING</Link>
        <Toaster />
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteuser} className=' text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className=' text-red-700 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
