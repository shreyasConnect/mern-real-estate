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
        const handleShowListings = async () => {
            try {
                const res = await fetch(`/api/user/listings/${currentUser._id}`);
                const data = await res.json();
                console.log("Data", data);
                if (res.ok) {
                    toast.success("Listings fetched successfully!");
                    setUserListings(data);
                }
                else if (res.status === 500) {
                    toast.error("Something went wrong!");
                }
            } catch (error) {
                console.log("An error occured: ", error);
                toast.error("Unable to fetch listings. Please check your connection.");
            }
        };
        handleShowListings();
    }, []);



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


                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        {userListings.map((listing) => (
                            <div key={listing._id} className="flex gap-5 p-5 bg-white shadow-md rounded-md  hover:bg-amber-100 hover:shadow-xl transition-shadow">
                                <Link to={`/${listing._id}`} className="flex-2 h-48 hidden md:block">
                                    <img className="w-full h-full object-cover rounded-md" src={listing.imageURLs[0]} alt={listing.name} />
                                </Link>
                                <div className="flex-3 flex flex-col justify-between gap-2">
                                    <h2 className="text-xl font-semibold text-gray-700 transition-all duration-400 hover:text-black hover:scale-105">
                                        <Link to={`/${listing.id}`}>{listing.name}</Link>
                                    </h2>
                                    <p className="text-sm flex items-center gap-1 text-gray-500">
                                        <img className="w-4 h-4" src="/pin.png" alt="Address" />
                                        <span>{listing.address}</span>
                                    </p>
                                    <p className="text-xl font-light px-2 py-1 rounded bg-yellow-200 w-max">
                                        {listing.offer ? (
                                            <>
                                                <span className="text-gray-900 dark:text-black  line-through">₹{listing.regularPrice}</span>
                                                <span className="text-red-600 dark:text-green-400 ml-2 font-bold">₹{listing.discountedPrice}</span>
                                            </>
                                        ) : (
                                            <span className="text-gray-900 dark:text-black font-bold">₹{listing.regularPrice}</span>
                                        )}
                                    </p>

                                    <div className="flex flex-col justify-between gap-2">
                                        <div className='flex flex-row justify-between gap-2'>
                                            <div className="flex gap-5 text-sm">
                                                <div className="flex items-center gap-1 bg-gray-100 p-2 rounded">
                                                    <img className="w-4 h-4" src="/bed.png" alt="Bedrooms" />
                                                    <span>{listing.bedrooms} bedroom</span>
                                                </div>
                                                <div className="flex items-center gap-1 bg-gray-100 p-2 rounded">
                                                    <img className="w-4 h-4" src="/bath.png" alt="Bathrooms" />
                                                    <span>{listing.bathrooms} bathroom</span>
                                                </div>
                                            </div>
                                            {/* <div className="flex gap-5">
                                                <div className="border border-gray-400 p-1 rounded cursor-pointer flex items-center justify-center hover:bg-gray-200">
                                                    <img className="w-4 h-4" src="/save.png" alt="Save" />
                                                </div>
                                                <div className="border border-gray-400 p-1 rounded cursor-pointer flex items-center justify-center hover:bg-gray-200">
                                                    <img className="w-4 h-4" src="/chat.png" alt="Chat" />
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="flex flex-row">
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
                            </div>

                        ))
                        }
                        <Toaster />
                    </div >
                )
            }
        </>
    )
}






