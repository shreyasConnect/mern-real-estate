import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const Context = createContext();

export const ContextProvider = ({ children }) => {
    const { currentUser } = useSelector((state) => state.user)
    const [formData, setFormData] = useState({
        imageURLs: [],
        name: '',
        description: '',
        address: '',
        type: 'rent',
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 0,
        discountedPrice: 0,
        offer: false,
        parking: false,
        furnished: false,
    });
    const [premiumMember, setPremiumMember] = useState(false);
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

    useEffect(() => {

        handlePremium();
    }, []);

    return (
        <Context.Provider value={{
            formData, setFormData,
            premiumMember, setPremiumMember,
            handlePremium

        }}>
            {children}
        </Context.Provider>
    )
}

export const UseData = () => {
    return useContext(Context);
}

export default ContextProvider;