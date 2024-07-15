import { createContext, useContext, useState } from 'react';

export const Context = createContext();

export const ContextProvider = ({ children }) => {

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

    return (
        <Context.Provider value={{
            formData, setFormData,

        }}>
            {children}
        </Context.Provider>
    )
}

export const UseData = () => {
    return useContext(Context);
}

export default ContextProvider;