import Link from 'next/link'
import React from 'react'

const Thankyou = () => {
    return (
        <div className="bg-gray-100 flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <div className="flex justify-center items-center">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mt-4">Thank you for your feedback!</h2>
                <p className="text-gray-600 mt-2">We appreciate your input and will use it to improve our services.</p>
                <Link href="/" className="mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200">
                    Back to Home
                </Link>
            </div>
        </div>
    )
}

export default Thankyou