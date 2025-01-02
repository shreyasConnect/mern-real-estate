import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import MessageContainer from '../components/MessageContainer.jsx';

export default function Chat() {

    const [selectedUser, setSelectedUser] = useState(null);
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const handelUserSelect = (user) => {
        setSelectedUser(user);
        setIsSidebarVisible(true);
    }
    const handelShowSidebar = () => {
        setIsSidebarVisible(true);
        setSelectedUser(null);
    }
    return (

        <div className="flex h-[89.7vh]">
            {/* Sidebar (30% width) */}
            <div
                className={`${isSidebarVisible ? 'w-[30%] mx-0.5' : ''
                    }  `}
            >
                <Sidebar onSelectUser={handelUserSelect} />
            </div>
            <div
                className={`${selectedUser ? 'w-[70%] mx-0.5' : 'w-[70%] mx-0.5'
                    }  `}
            >
                <MessageContainer onBackUser={handelShowSidebar} />
            </div>
            {/* <div className={` ${selectedUser ? 'w-[70%] mx-' : 'hidden'}`}></div>
            <div className={`flex-auto ${selectedUser ? 'w-[70%]' : ''}  }`}>
                <MessageContainer onBackUser={handelShowSidebar} />
            </div> */}
        </div>
    );
};

