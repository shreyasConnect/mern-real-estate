// import { createContext, useContext, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { io } from "socket.io-client";

// export const Context = createContext();

// export const ContextProvider = ({ children }) => {
//     const { currentUser } = useSelector((state) => state.user)
//     const [formData, setFormData] = useState({
//         imageURLs: [],
//         name: '',
//         description: '',
//         address: '',
//         type: 'rent',
//         bedrooms: 1,
//         bathrooms: 1,
//         regularPrice: 0,
//         discountedPrice: 0,
//         offer: false,
//         parking: false,
//         furnished: false,
//     });
//     const [premiumMember, setPremiumMember] = useState(false);
//     const handlePremium = async () => {
//         if (!currentUser || !currentUser._id) {
//             console.log("User not logged in or ID missing");
//             return;
//         }
//         try {
//             console.log("prem hit")
//             const res = await fetch(`/api/payment/premium/${currentUser._id}`, {
//             });
//             const data = await res.json();
//             console.log("object")
//             if (res.status === 200) {
//                 setPremiumMember(true);
//             }
//             else if (res.status == 500) {
//                 console.log(data)
//             }
//         }
//         catch (error) {
//             console.log(error)
//         }
//     }

//     useEffect(() => {

//         handlePremium();
//     }, [currentUser]);
//     const [socket, setSocket] = useState(null);

//     useEffect(() => {
//         setSocket(io("localhost:4000"));
//     }, []);

//     useEffect(() => {
//         currentUser && socket?.emit("newUser", currentUser.id);
//     }, [currentUser, socket]);


//     return (
//         <Context.Provider value={{
//             formData, setFormData,
//             premiumMember, setPremiumMember,
//             handlePremium,
//             socket

//         }}>
//             {children}
//         </Context.Provider>
//     )
// }

// // export const UseData = () => {
// //     return useContext(Context);
// // }

// export default ContextProvider;


import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

// Create CombinedContext
export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user);

    // Notification state and functions
    const [number, setNumber] = useState(0);

    const fetchNotifications = async () => {
        try {
            const response = await fetch('/api/users/notification');
            const data = await response.json();
            setNumber(data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const decreaseNotification = () => {
        setNumber((prev) => Math.max(0, prev - 1));
    };

    const resetNotification = () => {
        setNumber(0);
    };

    // Premium membership state and functions
    const [premiumMember, setPremiumMember] = useState(false);

    const handlePremium = async () => {
        if (!currentUser || !currentUser._id) {
            console.log("User not logged in or ID missing");
            return;
        }
        try {
            const res = await fetch(`/api/payment/premium/${currentUser._id}`);
            const data = await res.json();
            if (res.status === 200) {
                setPremiumMember(true);
            } else if (res.status === 500) {
                console.log(data);
            }
        } catch (error) {
            console.log(error);
        }
    };



    // Socket state
    const [socket, setSocket] = useState(null);
    const [onlineUser, setOnlineUser] = useState([]);

    useEffect(() => {
        handlePremium();
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            const socket = io("http://localhost:3000", {
                query: {
                    userId: currentUser?._id,
                }
            })
            socket.on("getOnlineUsers", (users) => {
                setOnlineUser(users)
            });
            setSocket(socket);
            return () => socket.close();
        } else {
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [currentUser]);

    return (
        <Context.Provider
            value={{
                // Notification-related state and functions
                number,
                fetchNotifications,
                decreaseNotification,
                resetNotification,
                // Premium membership state and functions
                premiumMember,
                setPremiumMember,
                handlePremium,

                // Socket state
                socket, onlineUser
            }}
        >
            {children}
        </Context.Provider>
    );
};

// Custom hook to use CombinedContext
export const useCombinedContext = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error(
            "useCombinedContext must be used within a ContextProvider"
        );
    }
    return context;
};

export default ContextProvider;
