import React, { useContext, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Context } from '../NewContext';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    console.log(currentUser);
    const { premiumMember } = useContext(Context);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);
    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-7xl mx-auto p-3 '>
                <div className='flex justify-between items-center w-full'>
                    {/* First div */}
                    <Link to='/'>
                        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                            <span className='text-slate-500'>Estate</span>
                            <span className='text-slate-700'>Navigator</span>
                        </h1>
                    </Link>
                    <form className='bg-slate-100 p-3 rounded-lg flex items-center' onSubmit={handleSubmit}>
                        <input
                            type='text'
                            placeholder='Search...'
                            className='bg-transparent focus:outline-none w-24 sm:w-64'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button>
                            <FaSearch className='text-slate-600' />
                        </button>
                    </form>
                    <ul className='flex gap-6'>
                        <Link to='/'><li className='hidden sm:inline text-slate-700 hover:underline'>Home</li></Link>
                        <Link to='/about'><li className='hidden sm:inline text-slate-700 hover:underline'>About</li></Link>
                        <Link to='/view-listings'><li className='hidden sm:inline text-slate-700 hover:underline'>Listings</li></Link>
                        {currentUser && premiumMember && (
                            <Link to='/chat'>
                                <li className='hidden sm:inline text-slate-700 hover:underline'>Messages</li>
                            </Link>
                        )}
                        <Link to='/profile'>
                            {currentUser ? (
                                <img
                                    className='rounded-full h-7 w-7 object-cover'
                                    src={currentUser.avatar}
                                    alt='profile'
                                />
                            ) : (
                                <li className='text-slate-700 hover:underline'>Sign in</li>
                            )}
                        </Link>
                        <div>
                            <Link to='/pricing'>
                                <button className='px-2 py-0.5 text-black bg-cyan-200 border border-white rounded-md shadow-lg hover:bg-cyan-400 hover:scale-105 transition-transform'>
                                    Pricing
                                </button>
                            </Link>
                        </div>
                    </ul>
                </div>
            </div>



        </header >
    )
}
