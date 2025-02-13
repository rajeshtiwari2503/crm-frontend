"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Sidenav from '@/app/components/Sidenav';
import DownloadExcel from '@/app/components/DownLoadExcel';
import http_request from "../../../../http-request"
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { useUser } from '@/app/components/UserContext';
const BulkServiceRequestForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const router = useRouter()

  const [loading,setLoading]=useState(false)

  // const BulkUpload = async (data) => {
  //   console.log(data);
  //   const formData = new FormData();
  //   formData.append('file', data.file[0]);
  //   formData.append('comments', data.comments);
  //   try {
  //     let response = await http_request.post('/bulkServiceRequests', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     }
  //     );

  //     let { data } = response
  //     ToastMessage(data)
  //     router.push("/complaint/allComplaint")
  //     // alert('File uploaded successfully');
  //   } catch (error) {
  //     console.error('Error uploading file:', error);
  //     // alert('Failed to upload file');
  //   }
  // };
const { user } = useUser(); // Get the logged-in user

const BulkUpload = async (data) => {
  // console.log(data);
  const formData = new FormData();
  formData.append("file", data.file[0]);
  formData.append("comments", data.comments);
// console.log("user?.user?.brandName",user?.user?.brandName);
// console.log("user?.user?.brandId",user?.user?.brandId);

  try {
    setLoading(true)
    // Automatically add brandId and productBrand from the user's profile
    if (user?.user?._id && user?.user?.brandName) {
      formData.append("brandId", user?.user?._id);
      formData.append("productBrand", user?.user?.brandName);
    }

    let response = await http_request.post("/bulkServiceRequests", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    let { data } = response;
    ToastMessage(data);
    
    router.push("/complaint/allComplaint");
    setLoading(false)
  } catch (error) {
    setLoading(false)
    console.error("Error uploading file:", error);
  }
};

  const onSubmit = (data) => {
    BulkUpload(data)
  };

  // const data = [
  //   ["productName", "categoryName", "brandId", "productBrand", "modelNo", "serialNo", "purchaseDate", "warrantyStatus", "issueType", "detailedDescription", "preferredServiceDate", "preferredServiceTime", "serviceLocation", "serviceAddress"],
  //   ["Product1", "Category1", "brandId", "Brand1", "Model1", "Serial1", "2024-01-01", "Status1", "Type1", "Description1", "2024-06-01", "10:00", "Location1", "Address1"],
  // ];

  const data = [
    ["complaintId","productName", "categoryName", "brandId", "productBrand", "modelNo", "serialNo", "purchaseDate", "warrantyStatus", "issueType", "detailedDescription", "preferredServiceDate", "preferredServiceTime", "serviceLocation", "serviceAddress", "pincode", "district", "state", "fullName", "emailAddress", "phoneNumber"],
    ["HE1302RO932","Product1", "Category1", "brandId", "Brand1", "Model1", "Serial1", "2024-01-01", "Status1", "Type1", "Description1", "2024-06-01", "10:00", "Location1", "Address1", "123456", "District1", "State1", "Customer1", "customer@example.com", "9876543210"],
];
  return (
    <>
      <Toaster />
      <Sidenav>
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
          <h2 className="text-2xl font-bold mb-4">Bulk Service Request Form</h2>
          <div className="mb-4">

            <DownloadExcel data={data} fileName="complaint" />

          </div>

          {/* Instructions */}
          <div className="mb-4">
            <label className="block mb-1">Instructions</label>
            <p>Please ensure the bulk request file follows the template format provided. Fill in all required fields accurately.</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block mb-1">File Upload</label>
              <input
                type="file"
                {...register('file', { required: true })}
                className="w-full p-2 border border-gray-300 rounded-md"
                accept=".csv, .xls, .xlsx"
              />
              {errors.file && <span className="text-red-500">File is required</span>}
            </div>

            {/* Template Download Link */}


            {/* Comments/Notes */}
            <div className="mb-4">
              <label className="block mb-1">Comments/Notes</label>
              <textarea
                {...register('comments', { required: true })}
                className="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
              {errors.comments && <span className="text-red-500">comments is required</span>}
            </div>

            {/* Submit Button */}
            <div className="mb-4">
              <button   disabled={loading}onClick={handleSubmit(onSubmit)} className="w-full p-2 bg-blue-500 text-white rounded-md">
                {loading?"Submitting......":"Submit"}
              </button>
            </div>

          </form>
        </div>
      </Sidenav>
    </>

  );
};

export default BulkServiceRequestForm;
