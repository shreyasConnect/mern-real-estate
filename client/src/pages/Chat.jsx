// import { useContext, useEffect, useRef, useState } from "react";
// import { format } from "timeago.js";
// import { Context } from "../NewContext";
// import toast from "react-hot-toast";

export default function Chat({ chats }) {
//     const [chat, setChat] = useState(null);
//     const { currentUser } = useContext(Context)
//     const { socket } = useContext(Context)
//     const { decreaseNotification } = useContext(Context)

//     const messageEndRef = useRef();

//     const decrease = decreaseNotification((state) => state.decrease);

//     useEffect(() => {
//         messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
//     }, [chat]);

//     const handleOpenChat = async (id, receiver) => {
//         try {
//             const response = await fetch(`/api/chats/${id}`);

//             if (!response.ok) {
//                 toast.error("Failed to fetch chat data");
//             }

//             const data = await response.json();

//             if (!data.seenBy.includes(currentUser.id)) {
//                 decrease();
//             }

//             setChat({ ...data, receiver });
//         } catch (err) {
//             console.log(err);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         const formData = new FormData(e.target);
//         const text = formData.get("text");

//         if (!text) return;
//         try {
//             const response = await fetch(`/api/messages/${chat.id}`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ text }),
//             });

//             if (!response.ok) {
//                 toast.error("Failed to send message");
//             }

//             const data = await response.json();

//             setChat((prev) => ({
//                 ...prev,
//                 messages: [...prev.messages, data],
//             }));

//             e.target.reset();

//             socket.emit("sendMessage", {
//                 receiverId: chat.receiver.id,
//                 data,
//             });
//         }
//         catch (err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         const read = async () => {
//             try {
//                 const response = await fetch(`/api/chats/read/${chat.id}`, {
//                     method: "PUT",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                 });

//                 if (!response.ok) {
//                     toast.error("Failed to mark chat as read");
//                 }

//                 // Optionally, handle success response
//                 console.log("Chat marked as read");
//             }
//             catch (err) {
//                 console.log(err);
//             }
//         };

//         if (chat && socket) {
//             socket.on("getMessage", (data) => {
//                 if (chat.id === data.chatId) {
//                     setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
//                     read();
//                 }
//             });
//         }
//         return () => {
//             socket.off("getMessage");
//         };
//     }, [socket, chat]);

//     return (
//         <div className="h-full flex flex-col">
//             <div className="flex-1 flex flex-col gap-5 overflow-y-scroll p-4">
//                 <h1 className="font-light text-xl">Messages</h1>
//                 {chats?.map((c) => (
//                     <div
//                         className={`p-5 rounded-lg flex items-center gap-5 cursor-pointer ${c.seenBy.includes(currentUser.id) || chat?.id === c.id
//                             ? "bg-white"
//                             : "bg-yellow-200"
//                             }`}
//                         key={c.id}
//                         onClick={() => handleOpenChat(c.id, c.receiver)}
//                     >
//                         <img
//                             src={c.receiver.avatar || "/noavatar.jpg"}
//                             alt=""
//                             className="w-10 h-10 rounded-full object-cover"
//                         />
//                         <div>
//                             <span className="font-bold">{c.receiver.username}</span>
//                             <p>{c.lastMessage}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//             {chat && (
//                 <div className="flex-1 bg-white flex flex-col justify-between">
//                     <div className="flex items-center justify-between bg-yellow-200 p-4 font-bold">
//                         <div className="flex items-center gap-5">
//                             <img
//                                 src={chat.receiver.avatar || "/noavatar.jpg"}
//                                 alt=""
//                                 className="w-8 h-8 rounded-full object-cover"
//                             />
//                             {chat.receiver.username}
//                         </div>
//                         <span
//                             className="cursor-pointer text-lg font-bold"
//                             onClick={() => setChat(null)}
//                         >
//                             X
//                         </span>
//                     </div>
//                     <div className="flex-1 overflow-y-scroll p-5 flex flex-col gap-5">
//                         {chat.messages.map((message) => (
//                             <div
//                                 className={`w-1/2 ${message.userId === currentUser.id
//                                     ? "self-end text-right"
//                                     : "self-start text-left"
//                                     }`}
//                                 key={message.id}
//                             >
//                                 <p>{message.text}</p>
//                                 <span className="text-xs bg-yellow-100 p-1 rounded">
//                                     {format(message.createdAt)}
//                                 </span>
//                             </div>
//                         ))}
//                         <div ref={messageEndRef}></div>
//                     </div>
//                     <form
//                         onSubmit={handleSubmit}
//                         className="border-t-2 border-yellow-200 h-16 flex items-center justify-between px-4"
//                     >
//                         <textarea
//                             name="text"
//                             className="flex-1 h-full border-none p-4 resize-none"
//                             placeholder="Type a message..."
//                         ></textarea>
//                         <button className="flex-1 bg-yellow-200 h-full border-none cursor-pointer">
//                             Send
//                         </button>
//                     </form>
//                 </div>
//             )}
//         </div>
    // );
}

