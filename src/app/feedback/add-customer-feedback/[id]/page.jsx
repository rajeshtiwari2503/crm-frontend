"use client"
import React, { useEffect, useState } from 'react';
 
import http_request from '../../../../../http-request'; // adjust path
 
import { ReactLoader } from '@/app/components/common/Loading';
import AddFeedback from '../../addFeedback';
import { useRouter } from 'next/navigation';

const CustomerFeedbackPage = ({ params }) => {
    const router = useRouter();
    const  complaintId  = params.id;
    const [complaintData, setComplaintData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchComplaint = async () => {
        try {
            setLoading(true);
            const response = await http_request.get(`/getComplaintById/${complaintId}`);
            setComplaintData(response.data);
        } catch (err) {
            setLoading(false);
            console.error('Error fetching complaint:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (complaintId) {
            fetchComplaint();
        }
    }, [complaintId]);

    const handleClose = () => {
        // Redirect or show success message
        router.push('/');
    };



    

    return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
  <div className="max-w-3xl mx-auto md:min-h-[560px] bg-white rounded-2xl shadow-lg p-3 md:p-8">
    
    {/* Logo + Header */}
    <div className="text-center mb-6">
      <img
        src="/logo.png"
        alt="Company Logo"
        className="h-12 sm:h-14 mx-auto mb-4 rounded-md"
      />
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
        Customer Feedback
      </h2>
      <p className="text-sm sm:text-base text-gray-600 mt-2">
        We're always looking to improve. Please take a moment to provide feedback about your recent service.
      </p>
    </div>

    {/* Loader or Form */}
    <div className="mt-6">
      {loading===true ? (
        <div className="  flex justify-center items-center h-[350px] md:h-[300px]">
          <ReactLoader />
          {/* <p className="mt-4 text-sm text-gray-500">Loading complaint details...</p> */}
        </div>
      ) : (
        <>
          {!complaintData ? (
            <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-center">
              <p>No complaint found. Please check the link or try again.</p>
            </div>
          ) : (
            <AddFeedback
              existingFeedback={null}
              RefreshData={() => {}}
              onClose={handleClose}
              complaints={complaintData}
            />
          )}
        </>
      )}
    </div>
  </div>
</div>


    );
};

export default CustomerFeedbackPage;
