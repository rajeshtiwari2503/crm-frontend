import React from 'react';

const HowItWorks = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-lg text-gray-700">
          Follow our simple step-by-step guide to understand how our platform works and how you can get the best service experience.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">1. Submit Your Request</h2>
        <p className="text-gray-700 mb-4">
          Customers, brands, or service centers start by submitting a service request through our platform. This can be done via our user-friendly web portal or mobile app. The request form captures all necessary details, including product information, issue description, and contact information.
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Log in to your account.</li>
          <li>Navigate to the "Submit Service Request" page.</li>
          <li>Fill out the request form with the required information.</li>
          <li>Submit the form and receive a confirmation notification.</li>
        </ol>
        <div className="mt-6">
          {/* Insert an illustration or screenshot of the service request form */}
          <img src="/images/service-request-form.png" alt="Service Request Form" className="mx-auto" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">2. Automatic Assignment</h2>
        <p className="text-gray-700 mb-4">
          Once a service request is submitted, our system automatically assigns it to the appropriate service center based on factors like location, service center capabilities, and current workload. This ensures that each request is handled by the best possible team without delays.
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>The system evaluates the service request details.</li>
          <li>It matches the request with an available and suitable service center.</li>
          <li>The service center is notified of the new assignment.</li>
        </ol>
        <div className="mt-6">
          {/* Insert a workflow diagram showing the assignment process */}
          <img src="/images/assignment-process.png" alt="Automatic Assignment Process" className="mx-auto" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">3. Real-Time Tracking</h2>
        <p className="text-gray-700 mb-4">
          Customers and brands can track the status of their service requests in real-time through the platform. Updates are provided at each stage of the process, from assignment to completion, ensuring transparency and keeping all parties informed.
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Log in to your account.</li>
          <li>Navigate to the "Track Service Request" page.</li>
          <li>Enter your ticket ID to view the current status and progress updates.</li>
          <li>Receive notifications for any status changes.</li>
        </ol>
        <div className="mt-6">
          {/* Insert an infographic or screenshot showing the tracking interface */}
          <img src="/images/tracking-interface.png" alt="Real-Time Tracking Interface" className="mx-auto" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">4. Service Completion</h2>
        <p className="text-gray-700 mb-4">
          Once the service is completed, the service center marks the request as resolved. The customer receives a notification and can verify the service. This step also involves collecting feedback to ensure quality and customer satisfaction.
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>The service center completes the required work.</li>
          <li>They update the ticket status to "Completed".</li>
          <li>The customer is notified of the completion.</li>
          <li>The customer confirms the service and provides feedback.</li>
        </ol>
        <div className="mt-6">
          {/* Insert an illustration of the completion notification and feedback form */}
          <img src="/images/completion-feedback.png" alt="Service Completion and Feedback" className="mx-auto" />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">5. Continuous Improvement</h2>
        <p className="text-gray-700 mb-4">
          Feedback collected from customers is analyzed to identify areas for improvement. Brands and service centers use this data to enhance their service quality, streamline operations, and ensure a better customer experience in the future.
        </p>
        <ol className="list-decimal list-inside space-y-2 mb-4">
          <li>Collect feedback from customers after service completion.</li>
          <li>Analyze feedback to identify trends and areas for improvement.</li>
          <li>Implement changes based on insights gathered from feedback.</li>
          <li>Monitor the impact of changes and continue to refine processes.</li>
        </ol>
        <div className="mt-6">
          {/* Insert charts or graphs showing feedback analysis and improvement metrics */}
          <img src="/images/feedback-analysis.png" alt="Feedback Analysis and Continuous Improvement" className="mx-auto" />
        </div>
      </section>

    </div>
  );
};

export default HowItWorks;
