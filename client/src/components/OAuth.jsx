import React, { useState } from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, phot: result.user.photoURL })
            });

            const data = await res.json();
            if (res.status === 200) {
                toast.success("Sign in success!")
                setTimeout(() => {
                    navigate("/");
                }, 2500);
            }
            else if (res.status === 409) {
                toast.error(data);
            }
        }
        catch (error) {
            setError(error.message);
        }
    }

    return (<>
        <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Continue with google</button>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
    </>
    )
}
