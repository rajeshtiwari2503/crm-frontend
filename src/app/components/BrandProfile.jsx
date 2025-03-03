"use client"
import React, { useState } from 'react';
import { ToastMessage } from './common/Toastify';
import http_request from "../../../http-request"
import { ReactLoader } from './common/Loading';
import { Toaster } from 'react-hot-toast';
import Recharge from '../recharge/page';
import TermsEditor from './BrandTermsCondition';
const BrandProfile = (props) => {

    const { userData, RefreshData } = props

    const [uploadedImage, setUploadedImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadBrandLogo = async (img) => {
        try {
            setLoading(true)
            const formData = new FormData();
            formData.append("brandLogo", uploadedImage);
            let response = await http_request.patch(`/uploadBrandLogo/${userData?._id}`, formData);
            let { data } = response;
            props?.RefreshData(data)
            ToastMessage(data);
            setUploadedImage(null)
            setLoading(false)

        } catch (err) {
            setLoading(false)

            console.log(err);
        }
    }
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadedImage(file);

        }
    };
    return (
        <>
           <div className=" max-w-screen overflow-x-hidden p-3">
  <Toaster />
  {loading ? (
    <ReactLoader />
  ) : (
    <div className="  grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-2">
      {/* Created & Updated Date */}
      <div className="text-lg font-bold">Created:</div>
      <div className="text-lg font-medium">
        {userData?.createdAt ? new Date(userData.createdAt).toLocaleString() : "N/A"}
      </div>

      <div className="text-lg font-bold">Updated:</div>
      <div className="text-lg font-medium">
        {userData?.updatedAt ? new Date(userData.updatedAt).toLocaleString() : "N/A"}
      </div>

      {/* Brand Details */}
      <div className="text-lg font-semibold">Brand Name:</div>
      <div className="text-lg font-medium">{userData?.brandName || "N/A"}</div>

      <div className="text-lg font-semibold">Email:</div>
      <div className="text-lg font-medium">{userData?.email || "N/A"}</div>

      <div className="text-lg font-semibold">Password:</div>
      <div className="text-lg font-medium">{userData?.password || "N/A"}</div>

      <div className="text-lg font-semibold">Brand Logo:</div>
      <div>
        {userData?.brandLogo ? (
          <img
            src={userData.brandLogo}
            alt="Brand Logo"
            className="m-2 w-24 h-24 object-cover rounded-md"
          />
        ) : (
          "No Logo Available"
        )}
      </div>

      {/* Upload Logo */}
      <div className="dz-message flex items-center justify-center">
        {uploadedImage && (
          <img
            src={URL.createObjectURL(uploadedImage)}
            alt="Uploaded Preview"
            className="m-2 w-24 h-24 object-cover rounded-md"
          />
        )}
        <input
          id="filesize"
          onChange={handleFileChange}
          name="file"
          type="file"
          accept="image/*, video/*, audio/*, .glb"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
          file:rounded-full file:border-0 file:text-sm file:font-semibold 
          file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
        />
      </div>

      <div className="flex items-center ms-8 justify-between">
        <button
          onClick={uploadBrandLogo}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Upload Logo
        </button>
      </div>

      {/* Website & Description */}
      <div className="text-lg font-semibold">Website URL:</div>
      <div className="text-lg font-medium">{userData?.websiteURL || "N/A"}</div>

      <div className="text-lg font-semibold">Brand Description:</div>
      <div className="text-lg col-span-3 font-medium">{userData?.brandDescription || "N/A"}</div>

      {/* Address */}
      <div className="text-lg font-semibold">Address:</div>
      <div className="text-lg font-medium">{userData?.streetAddress || "N/A"}</div>

      <div className="text-lg font-semibold">City:</div>
      <div className="text-lg font-medium">{userData?.city || "N/A"}</div>

      <div className="text-lg font-semibold">State:</div>
      <div className="text-lg font-medium">{userData?.state || "N/A"}</div>

      <div className="text-lg font-semibold">Country:</div>
      <div className="text-lg font-medium">{userData?.country || "N/A"}</div>

      <div className="text-lg font-semibold">Postal Code:</div>
      <div className="text-lg font-medium">{userData?.postalCode || "N/A"}</div>

      {/* Contact Details */}
      <div className="text-lg font-semibold">Contact Person:</div>
      <div className="text-lg font-medium">{userData?.contactPersonName || "N/A"}</div>

      <div className="text-lg font-semibold">Contact Person Phone:</div>
      <div className="text-lg font-medium">{userData?.contactPersonPhoneNumber || "N/A"}</div>

      {/* Company Details */}
      <div className="text-lg font-semibold">Company Size:</div>
      <div className="text-lg font-medium">{userData?.companySize || "N/A"}</div>

      {/* Service Categories */}
      <div className="text-lg font-semibold">Service Categories:</div>
      <div className="text-lg">
        {userData?.serviceCategories?.length ? (
          userData.serviceCategories.map((item, i) => (
            <div className="font-medium" key={i}>
              {i + 1}. {item.label}
            </div>
          ))
        ) : (
          "No Categories Assigned"
        )}
      </div>

      {/* Additional Info */}
      <div className="text-lg font-semibold">Toll-Free:</div>
      <div className="text-lg font-medium">{userData?.tollfree || "N/A"}</div>

      <div className="text-lg font-semibold">Status:</div>
      <div className="text-lg font-medium">{userData?.status === "ACTIVE" ? "ACTIVE" : "INACTIVE"}</div>

      <div className="text-lg font-semibold">Terms & Conditions:</div>
      <div className="text-lg font-medium">{userData?.termsAndConditions ? "Accepted" : "Not Accepted"}</div>

      <div className="text-lg font-semibold">Privacy Policy:</div>
      <div className="text-lg font-medium">{userData?.privacyPolicy ? "Accepted" : "Not Accepted"}</div>

      {/* Pricing Details */}
      <h2 className="text-xl font-bold leading-9 tracking-tight text-gray-900 mt-4 col-span-4">
        Pricing Details
      </h2>
       
        {[
          { label: "Base Price", value: userData?.basePrice },
          { label: "Per KM Price", value: userData?.kmPrice },
          { label: "CRM Price", value: userData?.crmPrice },
         
          { label: "In-City Price", value: userData?.inCityPrice },
          { label: "Out-City Price", value: userData?.outCityPrice },
          { label: "SHA Price", value: userData?.shaPrice },
          { label: "BHA Price", value: userData?.bhaPrice },
        ].map((item, index) => (
          <React.Fragment key={index}>
            <div className="text-lg font-semibold">{item.label}:</div>
            <div className="text-lg font-medium">{item.value || "N/A"}</div>
          </React.Fragment>
        ))}
      </div>
    
  )}
</div>

            <div className="my-8">
                <h2 className="text-xl font-semibold mb-2">Warranty Terms & Conditions</h2>
                <div
                    className="p-4 border rounded bg-gray-50"
                    dangerouslySetInnerHTML={{ __html: userData?.warrantyCondition }}
                />
            </div>
            <TermsEditor brandId={userData?._id} warrantyCondition={userData?.warrantyCondition} RefreshData={props?.RefreshData} />

        </>
    );
};

export default BrandProfile;
