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
        const storedValue = localStorage.getItem("userTickId");
        // const userType = JSON.parse(storedValue)
        try {
            let response = await http_request.get(`/getChatTicketByUserId/${storedValue}`)
            let { data } = response;
            setChatMessages(data)
            ToastMessage(data)
        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const sendMessage = async (id, name) => {

        const userId = id;
        const sender = value?.user?.role === "ADMIN" ? "admin" : "user";
        try {
            await http_request.post('/sendMessage', { userId, sender, message });
            setMessage('');
            fetchChatMessages()
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    };
    const sortedMessages = chatMessages?.messages?.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return (
        <div>
            <div className="max-w-xl mx-auto my-2 p-4 bg-gray-200 rounded-lg shadow-md">
                <div className='font-bold text-md bg-[#0284c7] rounded-md p-2 text-center'>Chat Message</div>
                <div className='flex justify-between mt-3 mb-3'>
                        <div className='bg-green-500 rounded-md font-bold p-1'>Support Team</div>
                        <div className='bg-blue-400 rounded-md font-bold p-1'>You</div>
                    </div>
                <div className="flex flex-col-reverse overflow-y-auto h-80">
                   
                <div className="mt-3 space-y-2">
                    {sortedMessages?.map((msg, index) => (
                        <div className={`flex ${msg.sender === 'user' ? 'justify-end' : ''}`} key={index}>
                            <div className={`inline-block p-2 ${msg.sender === 'user' ? 'bg-blue-200' : 'bg-green-300'} rounded-lg`}>
                                <p className="text-sm">{msg.message}</p>
                                <span className="block text-xs text-gray-500">{new Date(msg.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
                <div className="flex  justify-center  mt-5  ">
                    <div className="flex justify-center ">
                    <input
                        type="text"
                        value={message}
                        onChange={handleInputChange}
                        placeholder="Type your message..."
                        className="flex-1  px-3 py-2 rounded-lg bg-white focus:outline-none focus:ring focus:border-blue-300"
                    />
                    <button
                        onClick={() => sendMessage(chatMessages?.userId, chatMessages?.userName)}
                        className="ml-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
                    >
                        Send
                    </button>
                    </div>
                </div>
            </div>

        </div>

    );
};

export default ChatReply;
