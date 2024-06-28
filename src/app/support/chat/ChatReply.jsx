"use client"
import React, { useState, useEffect } from 'react';
import http_request from '../../../../http-request'
import { ToastMessage } from '@/app/components/common/Toastify';


const ChatReply = () => {

    const [message, setMessage] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [value, setValue] = useState(null);


    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        const userType = JSON.parse(storedValue)
        setValue(userType)
        fetchChatMessages();
    }, []);

    const fetchChatMessages = async () => {
        const storedValue = localStorage.getItem("user");
        const userType = JSON.parse(storedValue)
        try {
            let response = await http_request.get(`/getChatTicketByUserId/${userType?.user?._id}`)
            let { data } = response;
            setChatMessages(data)
            ToastMessage(data)
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const sendMessage = async (id,name) => {
        
        const userId = id;
        const userName = name;
        try {
            value?.user?.role === "ADMIN" ?
                await http_request.post('/sendMessage/admin', { userId, message })
                : await http_request.post('/sendMessage/user', { userId, userName, message });
            setMessage('');
            fetchChatMessages()
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };

    return (
        <div>
            <div className="max-w-1xl mx-auto my-4 p-4 bg-gray-200 rounded-lg shadow-md">
                <div className='font-bold text-md '>Chat Message</div>
                <div className="flex flex-col overflow-y-auto h-96">
                    <div className="flex justify-between mt-3 space-x-4">
                        <div className=' '>
                            <div className="bg-green-400 rounded-md px-2 w-[130px] text-white font-bold">Support Team</div>
                            <div className="mt-3 space-y-2">
                                {chatMessages?.adminMessage?.map((msg, index) => (
                                    <div className='flex'>
                                        <div key={index} className="inline-block p-2 bg-green-300 rounded-lg">
                                            <p className="text-sm">{msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className='  '>
                            <div className="bg-blue-400 rounded-md px-2 w-[50px] text-white font-bold ml-5">You</div>
                            <div className="mt-3 space-y-2">
                                {chatMessages?.userMessage?.map((msg, index) => (
                                    <div className='flex'>
                                        <div key={index} className="inline-block p-2 bg-blue-200 rounded-lg self-end">
                                            <p className="text-sm">{msg}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex mt-4">
                    <input
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button
                        onClick={()=>sendMessage(chatMessages?.userId,chatMessages?.userName)}
                        className="ml-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Send
                    </button>
                </div>
            </div>

        </div>

    );
};

export default ChatReply;
