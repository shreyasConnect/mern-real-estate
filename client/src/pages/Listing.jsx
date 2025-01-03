import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import CustomCarousel from '../components/Slider';
import { Context } from '../NewContext';
import { useNavigate } from 'react-router-dom';
import userConversation from '../Zustand/useConversation';
// import Chat from './Chat';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    const [userDetails, setUserDetails] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const { premiumMember } = useContext(Context);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();
    const navigate = useNavigate();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();
                console.log(data);
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    const handleClick = async () => {
        try {
            console.log("object")
            const res = await fetch(`/api/user/get/${listing.userRef}`);
            const data = await res.json();

            if (res.status != 200) {
                setError(true);
                setLoading(false);
                return;
            }
            setUserDetails(data);
            setSelectedConversation(data);
            setSetSelectedUserId(data._id);
            setNewMessageUsers('')
            navigate('/chat', { state: { selectedUser: data } });

        } catch (error) {
            console.log('Error fetching user details:', error);
        }
    };




    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && (
                <p className='text-center my-7 text-2xl'>Something went wrong!</p>
            )}
            {listing && !loading && !error && (
                <div className='w-full h-auto'>
                    <div className="font-sans max-w-full flex justify-center items-center flex-col">
                        <CustomCarousel>
                            {listing.imageURLs.map((url, index) => (
                                <img key={index} src={url} alt={`Slide ${index}`} />
                            ))}
                        </CustomCarousel>

                    </div>
                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare
                            className='text-slate-500'
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                setCopied(true);
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}
                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <p className='text-2xl font-semibold'>
                            {listing.name} - ₹{' '}
                            {listing.offer
                                ? listing.discountedPrice
                                : listing.regularPrice}
                            {listing.type === 'rent' && ' / month'}
                        </p>
                        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                            <FaMapMarkerAlt className='text-green-700' />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                    {(+listing.regularPrice - +listing.discountedPrice) / 100}% OFF
                                </p>
                            )}
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds `
                                    : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {premiumMember && currentUser && listing.userRef !== currentUser._id && (
                            <button
                                className='bg-green-700 text-white p-2 rounded-md'
                                onClick={() =>
                                    handleClick({
                                        _id: listing.userRef
                                        // username: listing.userRef.username,
                                        // avatar: listing.userRef.avatar,
                                    })
                                }
                            >
                                Contact
                            </button>
                        )}

                    </div>
                </div>
            )
            }
        </main >
    );
}

