 
import Head from 'next/head';
import Link from 'next/link';
import CustomerSection from './CustomerSection';
import BrandSection from './BrandSection';
import ServiceCenterSection from './ServiceSection';
import Dealersection from './Dealersection';
import HowItWorks from './HowIsWork';

const Hero = () => {
  return (
    <>
      <Head>
        <title>Your Company | Home</title>
        <meta name="description" content="Simplify Your After-Sales Service Experience with our comprehensive solutions for customers, brands, and service centers." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Montserrat:wght@700&display=swap" />
      </Head>

      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center py-4 px-6">
          <h1 className="text-2xl font-bold text-blue-500">Your Company</h1>
          <nav className="space-x-4">
            <Link href="#home"   className="text-gray-700 hover:text-blue-500">Home</Link > 
            <Link href="#features"  className="text-gray-700 hover:text-blue-500">Features</Link > 
            <Link href="#how-it-works"   className="text-gray-700 hover:text-blue-500">How It Works</Link > 
            <Link href="#testimonials"   className="text-gray-700 hover:text-blue-500">Testimonials</Link > 
            <Link href="#contact-us"  className="text-gray-700 hover:text-blue-500">Contact Us</Link > 
          </nav>
          <div className="space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Login</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Sign Up</button>
          </div>
        </div>
      </header>

      <section id="hero" className="relative bg-cover bg-center h-screen" style={{ backgroundImage: "url('/path/to/your/image.jpg')" }}>
        <div className="absolute inset-0 bg-blue-600 opacity-50"></div>
        <div className="relative container mx-auto text-center text-white py-20 px-6">
          <h2 className="text-4xl font-bold mb-4">Simplify Your After-Sales Service Experience</h2>
          <p className="text-xl mb-8">Comprehensive solutions for customers, brands, and service centers.</p>
          <div className="space-x-4">
            <Link href="#get-started" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">Get Started</Link >
            <Link href="#learn-more" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">Learn More</Link >
            <Link href="#join-now" className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600">Join Now</Link >
          </div>
        </div>
      </section>

      <section id="customers" className="bg-light-blue py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">For Customers</h2>
          <p className="text-lg mb-12">Our platform helps customers manage service requests efficiently.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Submit Service Requests</h3>
              <p>Easy and quick service request submission.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Track Your Requests</h3>
              <p>Real-time tracking of your service requests.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">After-Warranty Service</h3>
              <p>Efficient management of after-warranty services.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Provide Feedback</h3>
              <p>Submit feedback to improve our services.</p>
            </div>
          </div>
          <Link href="#submit-request" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Submit Your First Request</Link >
        </div>
      </section>

      <section id="brands" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">For Brands</h2>
          <p className="text-lg mb-12">Manage after-sales services effectively and efficiently.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Centralized Service Management</h3>
              <p>Manage all service requests from one central platform.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Submit Bulk Requests</h3>
              <p>Efficiently manage multiple service requests at once.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Review Customer Feedback</h3>
              <p>Access detailed feedback to improve your services.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Detailed Reports and Analytics</h3>
              <p>Generate reports and analyze data for better decision-making.</p>
            </div>
          </div>
          <Link href="#optimize-service" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Optimize Your Service</Link >
        </div>
      </section>

      <section id="service-centers" className="bg-light-blue py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">For Service Centers</h2>
          <p className="text-lg mb-12">Manage your tasks and improve service efficiency.</p>
          <div className="flex flex-wrap justify-center space-x-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Manage Assigned Tickets</h3>
              <p>Track and manage tickets assigned to your center.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Update Ticket Status</h3>
              <p>Keep customers informed by updating ticket statuses.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Order Parts</h3>
              <p>Order necessary parts directly through the platform.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Complete Service Requests</h3>
              <p>Efficiently complete and manage service requests.</p>
            </div>
          </div>
          <Link href="#join-network" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Join Our Network</Link >
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Our Platform?</h2>
          <div className="flex flex-wrap justify-center space-x-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">User-Friendly Interface</h3>
              <p>Easy-to-use interface for a seamless experience.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
              <p>Stay updated with real-time notifications.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Secure and Reliable</h3>
              <p>Robust security measures to protect your data.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Comprehensive Support</h3>
              <p>24/7 support to assist you with any issues.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Customizable Options</h3>
              <p>Tailor the platform to fit your specific needs.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Advanced Security</h3>
              <p>State-of-the-art security features to protect your data.</p>
            </div>
          </div>
          <Link href="#learn-more" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700">Learn More About Our Features</Link >
        </div>
      </section>

      <section id="how-it-works" className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="flex flex-wrap justify-center space-x-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Submit Your Request</h3>
              <p>Start by submitting your service request.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Automatic Assignment</h3>
              <p>Requests are automatically assigned to the relevant team.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
              <p>Track the status of your request in real-time.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Service Completion</h3>
              <p>Receive notifications upon completion of your request.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-xl font-semibold mb-2">Continuous Improvement</h3>
              <p>Feedback helps us continuously improve our services.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-light-blue py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="flex flex-wrap justify-center space-x-6">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="text-lg">"A game-changer for managing after-sales service. Highly recommended!"</p>
              <p className="font-semibold mt-2">- John Doe, Customer</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="text-lg">"The centralized platform has streamlined our service management."</p>
              <p className="font-semibold mt-2">- Jane Smith, Brand Manager</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <p className="text-lg">"Efficient and effective. It’s transformed how we handle service requests."</p>
              <p className="font-semibold mt-2">- Mark Johnson, Service Center</p>
            </div>
          </div>
        </div>
      </section>

      <section id="call-to-action" className="bg-blue-600 text-white py-20 text-center">
        <h2 className="text-3xl font-bold mb-8">Ready to Enhance Your After-Sales Service?</h2>
        <p className="text-lg mb-8">Sign up and start using our platform today!</p>
        <div className="space-x-4">
          <Link href="#get-started" className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700">Get Started</Link >
          <Link href="#optimize-now" className="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800">Optimize Now</Link >
          <Link href="#join-us" className="bg-blue-700 text-white px-6 py-3 rounded-md hover:bg-blue-800">Join Us</Link >
        </div>
      </section>
<CustomerSection />
<BrandSection />
<ServiceCenterSection />
<Dealersection />
<HowItWorks />
      <footer className="bg-dark-blue text-gray-700 py-2">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Your Company. All rights reserved.</p>
          <div className="mt-2">
            <Link href="#privacy-policy" className="text-gray-700 hover:underline">Privacy Policy</Link >
            <span className="mx-2">|</span>
            <Link href="#terms-of-service" className="text-gray-700 hover:underline">Terms of Service</Link >
          </div>
        </div>
      </footer>
    </>
  );
};

export default Hero;

