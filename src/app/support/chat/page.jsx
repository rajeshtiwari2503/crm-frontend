"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ToastMessage } from '@/app/components/common/Toastify'
import http_request from '../../../../http-request'
import { Toaster } from 'react-hot-toast';

const Chat = () => {

    const router = useRouter()
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

        try {
            let response = await http_request.get(`/getAllChatTicket`)
            let { data } = response;
            setChatMessages(data)

        } catch (error) {
            console.error('Error fetching chat messages:', error);
        }
    };

    const sendMessageRequest = async () => {
        const storedValue = localStorage.getItem("user");
        const userType = JSON.parse(storedValue)
        localStorage.setItem("userTickId",userType?.user?._id)
        const data = { userId: userType?.user?._id, userName: userType?.user?.name }
        const chat = chatMessages?.find((item) => item?.userId === userType?.user?._id)
        if (chat) {
            router.push("/support/chat/messages")
        }
        else {
            try {
                await http_request.post('/addChatTicket', data);
                setMessage('');
                ToastMessage(data)
       
                router.push("/support/chat/messages")
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };
    const handleChat = (id) => {
        localStorage.setItem("userTickId",id)
        router.push("/support/chat/messages")
    }
    console.log(chatMessages);
    return (
        <Sidenav >
            <>
                <Toaster />

                {value?.user?.role === "ADMIN" ?
                    <div>
                        {chatMessages?.map((item, i) => (
                            <div onClick={() =>handleChat(item?.userId)} className='w-[300px] cursor-pointer bg-blue-400 text-lg rounded-md p-3 mt-5 flex items-center' key={i}>
                                <div className='flex justify-center items-center bg-white font-bold rounded-full w-[50px] h-[50px]'>{i + 1}</div>
                                <div className='text-black ms-5 font-bold'>{item?.userName}</div>
                            </div>
                        ))}
                    </div>
                    : <div>
                        <div onClick={() => sendMessageRequest()} className='w-[350px] cursor-pointer font-bold text-xl bg-yellow-200 rounded-md p-2 '>Create Chat with Support Team</div>
                    </div>
                }
            </>
        </Sidenav>
    )
}

export default Chat