 
import React from 'react';

const ServiceCenterSection = () => (
    <div className="container mx-auto px-4 py-8">
    <header className="text-center mb-12">
      <h1 className="text-4xl font-bold mb-4">For Service Centers</h1>
      <p className="text-lg text-gray-700">
        Streamline your operations and enhance service quality with our comprehensive platform designed specifically for service centers. Our solution simplifies task management, ensuring that you can efficiently handle service requests, update ticket statuses, order necessary parts, and mark requests as completed. By centralizing these processes, we help service centers improve response times, reduce administrative overhead, and enhance customer satisfaction. Join our network to experience a seamless, integrated approach to after-sales service management.
      </p>
    </header>

    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold">1. Manage Assigned Tickets</h3>
        <p className="text-gray-700">
          Easily manage all your assigned service tickets from a single dashboard. Our platform provides a clear overview of all active tickets, allowing you to prioritize and organize tasks effectively. Stay on top of your workload and ensure that no ticket is overlooked.
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>Log in to your service center account.</li>
          <li>Access the "Assigned Tickets" section from the dashboard.</li>
          <li>View a list of all active tickets, sorted by priority or due date.</li>
          <li>Filter and search for specific tickets based on criteria like customer name, ticket ID, or issue type.</li>
        </ul>
        {/* Include workflow diagrams and screenshots as needed */}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold">2. Update Ticket Status</h3>
        <p className="text-gray-700">
          Keep customers and brands informed by regularly updating the status of service tickets. Whether a ticket is being processed, awaiting parts, or completed, timely updates ensure transparency and build trust. This feature allows for real-time status changes, ensuring accurate and up-to-date information.
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>Select a specific ticket from the "Assigned Tickets" list.</li>
          <li>Navigate to the ticket details page.</li>
          <li>Update the status (e.g., In Progress, Awaiting Parts, Completed).</li>
          <li>Save the changes and automatically notify the customer and brand.</li>
        </ul>
        {/* Include screenshots of the ticket details page with status update options */}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold">3. Order Parts</h3>
        <p className="text-gray-700">
          Simplify the parts ordering process with our integrated system. When specific parts are needed to complete a service request, you can easily place an order through the platform. Track the status of your orders and receive notifications when parts are shipped and delivered.
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>Identify the required parts from the ticket details page.</li>
          <li>Access the "Order Parts" section.</li>
          <li>Fill out the parts order form with necessary details such as part numbers and quantities.</li>
          <li>Submit the order and receive a confirmation notification.</li>
          <li>Track the order status through the platform until parts are received.</li>
        </ul>
        {/* Include workflow diagrams illustrating the parts ordering process */}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold">4. Complete Service Requests</h3>
        <p className="text-gray-700">
          Once the service task is finished, mark the ticket as completed. This feature ensures that all relevant parties are notified, and the ticket is closed in the system. It also allows for the collection of feedback from the customer, ensuring continuous improvement.
        </p>
        <ul className="list-disc list-inside mt-4">
          <li>Open the completed service ticket from the "Assigned Tickets" list.</li>
          <li>Verify that all tasks related to the ticket have been completed.</li>
          <li>Mark the ticket as "Completed" in the system.</li>
          <li>Notify the customer and brand, prompting them to provide feedback.</li>
        </ul>
        {/* Include screenshots of the completion confirmation page and feedback collection form */}
      </div>
    </section>

    <section className="text-center">
      <h2 className="text-2xl font-semibold mb-4">Join Our Network</h2>
      <p className="text-lg text-gray-700 mb-6">
        Encourage service centers to take the next step with a prominent call to action button. This button should link directly to the sign-up or demo request page, making it easy for service centers to join your network and start streamlining their operations with your platform.
      </p>
      <a href="/signup" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
        Sign Up Now
      </a>
    </section>
  </div>
);

export default ServiceCenterSection;
