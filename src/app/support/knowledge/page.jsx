import Sidenav from '@/app/components/Sidenav'
import React from 'react'

const Knowledge = () => {
    return (
        <Sidenav>
          <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Knowledge Page</h1>
            <div className="bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Welcome to Servsy Inc. Knowledge Hub</h2>
                <p className="text-lg mb-4">
                    Lybley India Pvt. Ltd. is committed to delivering exceptional services and innovative solutions to meet the diverse needs of our customers. Our expertise spans across various domains, including technology, customer support, and after-sales services.
                </p>
                <h3 className="text-xl font-semibold mb-2">Our Expertise</h3>
                <ul className="list-disc list-inside mb-4">
                    <li>Comprehensive after-sales service management</li>
                    <li>Advanced technical support solutions</li>
                    <li>Customer relationship management</li>
                    <li>Innovative product solutions and support</li>
                </ul>
                <h3 className="text-xl font-semibold mb-2">Latest Articles and Insights</h3>
                <p className="text-lg mb-4">
                    Stay updated with the latest trends, insights, and articles from our team of experts. Our knowledge hub provides valuable information to help you stay ahead in the industry.
                </p>
                <ul className="list-disc list-inside mb-4">
                    <li><a href="#" className="text-blue-500 hover:underline">Improving Customer Experience through Technology</a></li>
                    <li><a href="#" className="text-blue-500 hover:underline">Top 5 After-Sales Service Strategies for 2024</a></li>
                    <li><a href="#" className="text-blue-500 hover:underline">How to Manage Technical Support Efficiently</a></li>
                    <li><a href="#" className="text-blue-500 hover:underline">Innovative Solutions for Customer Relationship Management</a></li>
                </ul>
                <h3 className="text-xl font-semibold mb-2">Contact Our Experts</h3>
                <p className="text-lg mb-4">
                    Have questions or need assistance? Our team of experts is here to help. <a href="/contact" className="text-blue-500 hover:underline">Contact us</a> for more information.
                </p>
            </div>
        </div>
        </Sidenav>
    )
}

export default Knowledge