 
import React from 'react';

const CustomerSection = () => (
  <section className="py-16 bg-gray-100" id="customers">
      <div className="bg-white p-8">
      {/* Headline */}
      <h1 className="text-3xl font-bold text-center mb-8">For Customers</h1>

      {/* Brief Description */}
      <div className="text-gray-700 mb-12">
        <p>
          Managing after-sales service requests can be a daunting task, but with our platform, it becomes a breeze. Our goal is to simplify the process for you, ensuring that you receive the support you need, when you need it. Whether your product is within warranty or beyond, our comprehensive service portal is designed to handle all your service needs efficiently. With real-time tracking and user-friendly interfaces, you’ll always be in the loop regarding the status of your service requests.
        </p>
      </div>

      {/* Key Features */}
      <div className="space-y-12">
        {/* Submit Service Requests */}
        <div className="flex items-start space-x-4">
          <img src="path/to/icon1.png" alt="Submit Service Request" className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">1. Submit Service Requests</h2>
            <p className="text-gray-700">
              Our intuitive service request submission form allows you to quickly log any issues you’re experiencing with your products. Simply provide the necessary details, including product information and a description of the problem, and submit your request.
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600">
              <li>Navigate to the "Submit Service Request" page.</li>
              <li>Fill out the form with product details, including model number, purchase date, and warranty status.</li>
              <li>Describe the issue you’re facing, attach any relevant images or documents, and submit the request.</li>
              <li>Receive a confirmation notification with your service ticket ID.</li>
            </ul>
          </div>
        </div>

        {/* Track Your Requests */}
        <div className="flex items-start space-x-4">
          <img src="path/to/icon2.png" alt="Track Your Requests" className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">2. Track Your Requests</h2>
            <p className="text-gray-700">
              Keep track of your service requests in real-time through our platform. You can easily check the status of your request, see which technician is assigned, and get estimated completion times. This feature ensures transparency and keeps you informed every step of the way.
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600">
              <li>Log in to your account and go to the "Track Service Requests" section.</li>
              <li>Enter your service ticket ID or browse through your list of submitted requests.</li>
              <li>View the current status, notes from the service center, and any updates.</li>
            </ul>
          </div>
        </div>

        {/* After-Warranty Service */}
        <div className="flex items-start space-x-4">
          <img src="path/to/icon3.png" alt="After-Warranty Service" className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">3. After-Warranty Service</h2>
            <p className="text-gray-700">
              Our commitment to service doesn't end with the warranty period. For products that are out of warranty, we offer reliable after-warranty service options. This ensures that you continue to receive support and maintenance for your products, extending their lifespan and performance.
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600">
              <li>Navigate to the "After-Warranty Service" page.</li>
              <li>Select your product and provide details of the issue.</li>
              <li>Choose from the available service options and submit your request.</li>
              <li>Receive a quote for the service and approve it to proceed.</li>
            </ul>
          </div>
        </div>

        {/* Provide Feedback */}
        <div className="flex items-start space-x-4">
          <img src="path/to/icon4.png" alt="Provide Feedback" className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">4. Provide Feedback</h2>
            <p className="text-gray-700">
              Your feedback is invaluable to us. After your service request is completed, we encourage you to provide feedback on your experience. This helps us continually improve our services and ensure that we meet your expectations.
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600">
              <li>After your service request is completed, you will receive a feedback form.</li>
              <li>Rate your experience and provide comments on the service quality.</li>
              <li>Submit your feedback to help us improve.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700">
          Submit Your First Request
        </button>
      </div>
    </div>
  </section>
);

export default CustomerSection;
