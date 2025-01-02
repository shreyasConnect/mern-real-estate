import React, { useEffect, useState, useRef, useContext } from 'react'
import userConversation from '../Zustand/useConversation';
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from 'react-icons/io5';
import notify from '../assets/sound/notification.mp3';
import { Context } from '../NewContext';
import { useSelector } from 'react-redux';

const MessageContainer = ({ onBackUser }) => {
    const { messages, selectedConversation, setMessage, setSelectedConversation } = userConversation();
    const { socket } = useContext(Context);
    const currentUser = useSelector(state => state.user.currentUser);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [sendData, setSnedData] = useState("")
    const lastMessageRef = useRef();

    useEffect(() => {
        socket?.on("newMessage", (newMessage) => {
            const sound = new Audio(notify);
            sound.play();
            setMessage([...messages, newMessage])
        })

        return () => socket?.off("newMessage");
    }, [socket, setMessage, messages])

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" })
        }, 100)
    }, [messages])

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                const get = await fetch(`/api/message/get/${selectedConversation?._id}`);
                const data = await get.json();
                if (data.success === false) {
                    setLoading(false);
                    console.log(data.message);
                }
                setLoading(false);
                setMessage(data);
            } catch (error) {
                setLoading(false);
                console.log(error);

            }
        }

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessage])
    console.log(messages);

    const handelMessages = (e) => {
        setSnedData(e.target.value)
    }

    const handelSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const res = await fetch(`/api/message/send/${selectedConversation?._id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: sendData })
            })
            const data = await res.json();
            if (data.status != 201) {
                setSending(false);
                console.log(data.message);
            }
            setSending(false);
            setSnedData('')
            setMessage([...messages, data])
        } catch (error) {
            setSending(false);
            console.log(error);
        }
    }

    return (
        <div className='m-0.5 border border-black rounded-lg flex flex-col p-1 w-full h-full'>
            {selectedConversation === null ? (
                <div className='flex items-center justify-center w-full h-full'>
                    <div className='px-4 text-center text-2xl text-gray-950 font-semibold flex flex-col items-center gap-2 w-full max-w-lg'>
                        <p className="text-2xl font-semibold text-black-800">Welcome, {currentUser.name}! 👋</p>
                        <p className="text-lg text-black-600 mt-1">Choose a chat to start connecting with property owners.</p>

                        <TiMessages className='text-6xl text-center' />
                    </div>
                </div>
            ) : (
                <>
                    <div className='flex flex-col md:px-2 gap-1 bg-slate-200  rounded-lg h-10 md:h-12'>
                        <div className='flex gap-2 md:justify-between items-center w-full'>
                            {/* <div className='md:hidden ml-1 self-center '>
                                <button onClick={() => onBackUser(true)} className='bg-white rounded-full px-2 py-1
                   self-center'>
                                    <IoArrowBackSharp size={25} />
                                </button>
                            </div> */}
                            <div className='flex justify-between m-1 gap-2 '>
                                <div className='self-center'>
                                    <img className='rounded-full w-6 h-6 md:w-10 md:h-10 cursor-pointer' src={selectedConversation?.avatar} />
                                </div>
                                <span className='text-gray-950 self-center text-sm md:text-xl font-bold'>
                                    {selectedConversation?.username}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* ------------------------------------------------------------------- */}
                    <div className='my-1 flex-1 overflow-auto '>
                        {loading && (
                            <div className="flex w-full h-full flex-col items-center justify-center 
                gap-4 bg-transparent">
                                <div className="loading loading-spinner"></div>
                            </div>
                        )}
                        {!loading && messages?.length === 0 && (
                            <h1 className="flex flex-col items-center text-center text-black  text-xl font-medium py-4 rounded-lg ">
                                Send a message to start a conversation
                            </h1>

                        )}
                        {!loading && messages?.length > 0 && messages?.map((message) => (
                            <div
                                className={`text-white my-2 flex ${message.senderId === currentUser._id ? 'justify-end' : 'justify-start'}`}
                                key={message?._id}
                                ref={lastMessageRef}
                            >
                                <div className={`chat-bubble p-3 rounded-lg max-w-[80%] ${message.senderId === currentUser._id ? 'bg-green-200 text-start' : 'bg-gray-200 text-start'}`}>
                                    <div className="message-text text-black">
                                        {message?.message}
                                    </div>
                                    <div className="text-end message-timestamp text-sm text-gray-600 mt-0.5">
                                        {new Date(message?.createdAt).toLocaleDateString('en-IN')} {' '}
                                        {new Date(message?.createdAt).toLocaleTimeString('en-IN', {
                                            hour: '2-digit',
                                            minute: '2-digit',

                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}


                    </div>
                    <form onSubmit={handelSubmit} className='rounded-full text-black'>
                        <div className='w-full rounded-full flex items-center bg-white'>
                            <input value={sendData} onChange={handelMessages} required id='message' type='text' placeholder='Message'
                                className='w-full bg-transparent outline-none px-4 rounded-full' />
                            <button type='submit'>
                                {sending ? <div className='loading loading-spinner'></div> :
                                    <IoSend size={25}
                                        className='text-sky-700 cursor-pointer rounded-full bg-gray-800 w-10 h-auto p-1' />
                                }
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    )
}

export default MessageContainer