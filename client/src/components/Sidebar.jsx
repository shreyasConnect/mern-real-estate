import React, { useContext, useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackSharp } from 'react-icons/io5';
import userConversation from '../Zustand/useConversation';
import { Context } from '../NewContext.jsx';
import { useSelector } from 'react-redux';

const Sidebar = ({ onSelectUser }) => {

    const navigate = useNavigate();
    const currentUser = useSelector(state => state.user.currentUser);
    const [searchInput, setSearchInput] = useState('');
    const [searchUser, setSearchuser] = useState([]);
    const [chatUser, setChatUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSetSelectedUserId] = useState(null);
    const [newMessageUsers, setNewMessageUsers] = useState('');
    const { messages, setMessage, selectedConversation, setSelectedConversation } = userConversation();
    const { onlineUser, socket } = useContext(Context);

    const nowOnline = chatUser.map((user) => (user._id));
    //chats function
    const isOnline = nowOnline.map(userId => onlineUser.includes(userId));

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            setNewMessageUsers(newMessage)
        })
        return () => socket?.off("newMessage");
    }, [socket, messages])

    //show user with u chatted
    useEffect(() => {
        const chatUserHandler = async () => {
            setLoading(true)
            try {
                const chatters = await fetch(`/api/message/currentchatters`);

                const data = await chatters.json();
                console.log(data)

                if (chatters.status != 200) {
                    setLoading(false)
                    console.log(data.message);
                }
                setLoading(false)
                setChatUser(data)
                console.log(chatUser);

            } catch (error) {
                setLoading(false)
                console.log(error);
            }
        }
        chatUserHandler()
    }, [])

    //show user from the search result
    const handelSearchSubmit = async (e) => {
        console.log("inside handelSearchSubmit");
        e.preventDefault();
        setLoading(true);


        try {
            console.log("inside try");
            const response = await fetch(`/api/message/search?search=${searchInput}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                // Handle non-200 responses
                const errorData = await response.json();
                throw new Error(errorData.message || "An error occurred");
            }

            const data = await response.json(); // Await parsing the JSON

            console.log(data);

            if (data.length === 0) {
                toast.info("User Not Found");
            } else {
                setSearchuser(data);
            }
        } catch (error) {
            console.error("Error during search:", error.message);
            toast.error("Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };


    //show which user is selected
    const handelUserClick = (user) => {
        onSelectUser(user);
        setSelectedConversation(user);
        setSetSelectedUserId(user._id);
        setNewMessageUsers('')
    }

    //back from search result
    const handSearchback = () => {
        setSearchuser([]);
        setSearchInput('')
    }


    return (
        <div className='h-full w-auto px-1'>
            <div className='flex justify-between gap-2'>
                <form onSubmit={handelSearchSubmit} className='w-auto flex items-center justify-between bg-white rounded-full '>
                    <input
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        type='text'
                        className='px-4 w-auto bg-transparent outline-none rounded-full'
                        placeholder='search user'
                    />
                    <button className='btn btn-circle bg-sky-700 hover:bg-gray-950'>
                        <FaSearch />
                    </button>
                </form>
                <img
                    onClick={() => navigate('/profile')}
                    src={currentUser.avatar}
                    className='self-center h-12 w-12 hover:scale-110 cursor-pointer' />
            </div>
            <div className='divider px-3'></div>
            {searchUser?.length > 0 ? (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {searchUser.map((user, index) => (
                                <div key={user._id}>
                                    <div
                                        onClick={() => handelUserClick(user)}
                                        className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''
                                            } `}>
                                        {/*Socket is Online*/}
                                        <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                            <div className="w-12 rounded-full">
                                                <img src={currentUser?.avatar} alt='user.img' />
                                            </div>
                                        </div>
                                        <div className='flex flex-col flex-1'>
                                            <p className='font-bold text-gray-950'>{user.username}</p>
                                        </div>
                                    </div>
                                    <div className='divider divide-solid px-3 h-[1px]'></div>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                    <div className='mt-auto px-1 py-1 flex'>
                        <button onClick={handSearchback} className='bg-white rounded-full px-2 py-1 self-center'>
                            <IoArrowBackSharp size={25} />
                        </button>

                    </div>
                </>
            ) : (
                <>
                    <div className="min-h-[70%] max-h-[80%] m overflow-y-auto scrollbar ">
                        <div className='w-auto'>
                            {chatUser.length === 0 ? (
                                <>
                                    <div className='font-bold items-center flex flex-col text-xl text-yellow-500'>
                                        <h1>Why are you Alone!!🤔</h1>
                                        <h1>Search username to chat</h1>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {chatUser.map((user, index) => (
                                        <div key={user._id}>
                                            <div
                                                onClick={() => handelUserClick(user)}
                                                className={`flex gap-3 
                                                items-center rounded 
                                                p-2 py-1 cursor-pointer
                                                ${selectedUserId === user?._id ? 'bg-sky-500' : ''
                                                    } `}>


                                                <div className={`avatar ${isOnline[index] ? 'online' : ''}`}>
                                                    <div className="w-12 rounded-full">
                                                        <img src={user.avatar} alt='user.img' />
                                                    </div>
                                                </div>
                                                <div className='flex flex-col flex-1'>
                                                    <p className='font-bold text-gray-950'>{user.username}</p>
                                                </div>
                                                <div>
                                                    {newMessageUsers.reciverId === currentUser._id && newMessageUsers.senderId === user._id ?
                                                        <div className="rounded-full bg-green-700 text-sm text-white px-[4px]">+1</div> : <></>
                                                    }
                                                </div>
                                            </div>
                                            <div className='divider divide-solid px-3 h-[1px]'></div>
                                        </div>
                                    )
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </>
            )}
        </div>
    )
}

export default Sidebar;