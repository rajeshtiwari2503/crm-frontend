 
import React from 'react';

const BrandSection = () => (
  <section className="py-16" id="brands">
    <div className="bg-white p-8">
      {/* Headline */}
      <h1 className="text-3xl font-bold text-center mb-8">For Brands</h1>

      {/* Brief Description */}
      <div className="text-gray-700 mb-12">
        <p>
          Managing after-sales service efficiently is crucial for maintaining customer satisfaction and loyalty. At [Your Company Name], we provide a powerful platform tailored to meet the unique needs of brands. Our centralized system streamlines the entire after-sales service process, from handling individual service requests to processing bulk submissions. By leveraging our platform, brands can gain valuable insights from customer feedback, track service performance with detailed analytics, and ensure consistent service quality across all touchpoints. Experience a seamless, efficient, and data-driven approach to managing your after-sales services.
        </p>
      </div>

      {/* Key Features */}
      <div className="space-y-12">
        {/* Centralized Service Management */}
        <div className="flex items-start space-x-4">
          <img src="/path/to/icon1.png" alt="Centralized Service Management" className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">1. Centralized Service Management</h2>
            <p className="text-gray-700">
              Our platform consolidates all after-sales service activities into a single, user-friendly dashboard. This centralization allows brands to oversee all service requests, monitor their progress, and manage resources efficiently. With all data in one place, you can ensure that no request is overlooked and that each is handled promptly and effectively.
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600">
              <li>Log in to the brand portal.</li>
              <li>Access the centralized dashboard where all active service requests are displayed.</li>
              <li>Monitor the status of each request, assign tasks to service centers, and ensure timely resolutions.</li>
              <li>Utilize filters and search functions to quickly locate specific requests.</li>
            </ul>
          </div>
        </div>

        {/* Submit Bulk Requests */}
        <div className="flex items-start space-x-4">
          <img src="/path/to/icon2.png" alt="Submit Bulk Requests" className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">2. Submit Bulk Requests</h2>
            <p className="text-gray-700">
              Handling multiple service requests at once can be challenging. Our bulk submission feature simplifies this process, allowing you to upload multiple service requests simultaneously. This feature is particularly useful during product recalls or when dealing with batch issues, ensuring quick and efficient processing of large volumes of requests.
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600">
              <li>Navigate to the "Submit Bulk Requests" page.</li>
              <li>Download the bulk request template file.</li>
              <li>Fill in the necessary details for each service request in the template.</li>
              <li>Upload the completed file and submit.</li>
              <li>Receive a confirmation notification for all processed requests.</li>
            </ul>
          </div>
        </div>

        {/* Review Customer Feedback */}
        <div className="flex items-start space-x-4">
          <img src="/path/to/icon3.png" alt="Review Customer Feedback" className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">3. Review Customer Feedback</h2>
            <p className="text-gray-700">
              Customer feedback is a critical component of continuous improvement. Our platform allows you to collect, review, and analyze feedback from customers regarding their service experiences. By understanding their needs and concerns, you can make informed decisions to enhance service quality and address any recurring issues.
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600">
              <li>Access the "Customer Feedback" section from the dashboard.</li>
              <li>View a consolidated list of feedback entries.</li>
              <li>Filter feedback by date, service center, or specific issues.</li>
              <li>Analyze feedback trends and identify areas for improvement.</li>
            </ul>
          </div>
        </div>

        {/* Detailed Reports and Analytics */}
        <div className="flex items-start space-x-4">
          <img src="/path/to/icon4.png" alt="Detailed Reports and Analytics" className="h-12 w-12" />
          <div>
            <h2 className="text-xl font-semibold">4. Detailed Reports and Analytics</h2>
            <p className="text-gray-700">
              Data-driven insights are essential for optimizing after-sales service operations. Our platform provides detailed reports and analytics on various performance metrics, such as average resolution time, customer satisfaction scores, and service center efficiency. These insights help you identify strengths and weaknesses, enabling you to make strategic decisions to enhance overall service quality.
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600">
              <li>Navigate to the "Reports and Analytics" section of the dashboard.</li>
              <li>Select the desired report parameters (e.g., date range, service center).</li>
              <li>Generate reports to view performance metrics and trends.</li>
              <li>Export reports for further analysis or share with relevant stakeholders.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12 text-center">
        <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700">
          Optimize Your Service
        </button>
      </div>
    </div>
  </section>
);

export default BrandSection;
