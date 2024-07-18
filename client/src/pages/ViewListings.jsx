import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';


export function ViewListings() {
    const { currentUser } = useSelector((state) => state.user);
    const [userListings, setUserListings] = useState([
        //     {
        //     imageURLs: [],
        //     name: '',
        //     description: '',
        //     address: '',
        //     type: 'rent',
        //     bedrooms: 1,
        //     bathrooms: 1,
        //     regularPrice: 0,
        //     discountedPrice: 0,
        //     offer: false,
        //     parking: false,
        //     furnished: false,
        // }
    ]);

    useEffect(() => {
        handleShowListings();
    }, []);

    const handleShowListings = async () => {
        try {
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            console.log(currentUser._id)
            const data = await res.json();
            console.log(data)
            if (res.status === 200) {
                toast.success("Listings fetched successfully!")
                setUserListings(data);
            }
            else if (res.status === 500) {
                toast.error("Something went wrong!")
            }
        } catch (error) {
            console.log("An error occured: ", error);
        }
    };

    const handleListingDelete = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (res.status === 404 || res.status === 401) {
                toast.error(data);
                return;
            }
            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId)
            );
            toast.success(data)
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h1 className='text-center m-7 text-2xl font-semibold'>
                Your Listings
            </h1>
            {
                userListings && userListings.length > 0 && (


                    <div className='flex flex-row gap-4 m-3'>
                        {userListings.map((listing) => (
                            <div
                                key={listing.id}
                                className="m-3 w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700 h-100">

                                <Link to={`/listing/${listing._id}`}>
                                    <img
                                        src={listing.imageURLs[0]}
                                        alt='listing cover'
                                        className="p-8 rounded-t-lg "

                                    />
                                </Link>

                                <div className="px-5 pb-5">

                                    <Link
                                        className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white hover:underline"
                                        to={`/listing/${listing._id}`}
                                    >
                                        <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{listing.name}</h5>
                                    </Link>
                                    <div className="flex items-center justify-between"> {listing.offer ? (
                                        <>
                                            <span className="text-3xl font-bold text-gray-900 dark:text-white line-through">₹{listing.regularPrice}</span>
                                            <span className="text-3xl font-bold text-red-600 dark:text-green-400">₹{listing.discountedPrice}</span>
                                        </>
                                    ) : (
                                        <span className="text-3xl font-bold text-gray-900 dark:text-white">₹{listing.regularPrice}</span>
                                    )}

                                    </div>
                                    <div className="m-3 flex items-center justify-between">
                                        <Link to={`/update-listing/${listing._id}`}>
                                            <button

                                                className="m-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                                            >Edit
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleListingDelete(listing._id)}
                                            className="m-3 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                                        >Delete
                                        </button>


                                    </div>
                                </div>
                            </div>

                        ))}
                        <Toaster />
                    </div>
                )
            }
        </>
    )
}






