import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from "react-slick";
import { useSelector } from 'react-redux';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
    FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';
import CustomCarousel from '../components/Slider';

// https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

export default function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);
    const params = useParams();
    const { currentUser } = useSelector((state) => state.user);
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

    console.log(listing);

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && (
                <p className='text-center my-7 text-2xl'>Something went wrong!</p>
            )}
            {listing && !loading && !error && (
                <div className='w-full h-auto'>
                    <div class="font-sans max-w-full flex justify-center items-center flex-col">
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
                        {currentUser && listing.userRef !== currentUser._id && !contact && (
                            <button
                                onClick={() => setContact(true)}
                                className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'
                            >
                                Contact landlord
                            </button>
                        )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </div>
            )
            }
        </main >
    );
}

