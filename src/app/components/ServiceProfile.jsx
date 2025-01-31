"use client"
import React, { useState } from 'react';
import http_request from "../../../http-request"
import { ReactLoader } from './common/Loading';
import ServicePincodes from './ServicePincodes';
import AddSupportedBrands from '../user/service/details/[id]/AddSupportedBrands';

const ServiceProfile = (props) => {

  const [loading, setLoading] = useState(false)
  const [uploadedGstImage, setUploadedGstImage] = useState(null);
  const [uploadedProofImage, setUploadedProofImage] = useState(null);
  const [uploadedDocImage, setUploadedDocImage] = useState(null);
  const { userData } = props
  const uploadGst = async (img) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("gstCertificate", uploadedGstImage);
      let response = await http_request.patch(`/uploadCenterGstCertificate/${userData?._id}`, formData);
      let { data } = response;
      props?.RefreshData(data)
      ToastMessage(data);
      setUploadedGstImage(null)
      setLoading(false)

    } catch (err) {
      setLoading(false)

      console.log(err);
    }
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedGstImage(file);

    }
  };
  const uploadProof = async (img) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("identityProof", uploadedProofImage);
      let response = await http_request.patch(`/uploadCenterIdentityProof/${userData?._id}`, formData);
      let { data } = response;
      props?.RefreshData(data)
      ToastMessage(data);
      setUploadedProofImage(null)
      setLoading(false)

    } catch (err) {
      setLoading(false)

      console.log(err);
    }
  }
  const handleFileProofChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedProofImage(file);

    }
  };
  const uploadDoc = async (img) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("certificationDocuments", uploadedDocImage);
      let response = await http_request.patch(`/uploadCenterCertificationDocuments/${userData?._id}`, formData);
      let { data } = response;
      props?.RefreshData(data)
      ToastMessage(data);
      setUploadedDocImage(null)
      setLoading(false)

    } catch (err) {
      setLoading(false)

      console.log(err);
    }
  }
  const handleFileDocChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedDocImage(file);

    }
  };
  return (

    <div className=' '>
      {loading === true ? <ReactLoader />
        : <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4">
          <div className='text-1xl font-bold'>Created :</div>
          <div className='text-1xl font-bold'>{new Date(userData?.createdAt).toLocaleString()}</div>
          <div className='text-1xl font-bold'>Updated :</div>
          <div className='text-1xl font-bold'>{new Date(userData?.updatedAt).toLocaleString()}</div>
          <div className='text-1xl font-semibold'>Service Center Name :</div>
          <div className='text-lg font-medium'>{userData?.serviceCenterName}</div>
          <div className='text-1xl font-semibold'>Email :</div>
          <div className='text-lg font-medium'>{userData?.email}</div>
          <div className='text-1xl font-semibold'>Contact :</div>
          <div className='text-lg font-medium'>{userData?.contact}</div>
          <div className='text-1xl font-semibold'>Password :</div>
          <div className='text-lg font-medium'>{userData?.password}</div>
          <div className='text-1xl font-semibold'>Address :</div>
          <div className='text-lg font-medium'>{userData?.streetAddress}</div>
          <div className='text-1xl font-semibold'>City :</div>
          <div className='text-lg font-medium'>{userData?.city}</div>
          <div className='text-1xl font-semibold'>State :</div>
          <div className='text-lg font-medium'>{userData?.state}</div>
          <div className='text-1xl font-semibold'>country :</div>
          <div className='text-lg font-medium'>{userData?.country}</div>
          <div className='text-1xl font-semibold'>postalCode :</div>
          <div className='text-lg font-medium'>{userData?.postalCode}</div>
          <div className='text-1xl font-semibold'>Tin :</div>
          <div className='text-lg font-medium'>{userData?.tin}</div>
          <div className='text-1xl font-semibold'>contactPersonName :</div>
          <div className='text-lg font-medium'>{userData?.contactPersonName}</div>
          <div className='text-1xl font-semibold'>contactPersonPosition :</div>
          <div className='text-lg font-medium'>{userData?.contactPersonPosition}</div>
          <div className='text-1xl font-semibold'>insuranceCoverage :</div>
          <div className='text-lg font-medium'>{userData?.insuranceCoverage}</div>
          <div className='text-1xl font-semibold'>numberOfTechnicians :</div>
          <div className='text-lg font-medium'>{userData?.numberOfTechnicians}</div>
          <div className='text-1xl font-semibold'>operatingHours :</div>
          <div className='text-lg font-medium'>{userData?.operatingHours}</div>
          <div className='text-1xl font-semibold'>serviceCenterType :</div>
          <div className='text-lg font-medium'>{userData?.serviceCenterType}</div>
         
         
          <div className='text-1xl font-semibold'>Status :</div>
          <div className='text-lg font-medium'>{userData?.status === 'ACTIVE' ? "ACTIVE" : "INACTIVE"}</div>
          <div className='text-1xl font-semibold'>insuranceCoverage :</div>
          <div className='text-lg font-medium'>{userData?.insuranceCoverage === true ? "TRUE" : "FALSE"}</div>
          <div className='text-1xl font-semibold'>agreement :</div>
          <div className='text-lg font-medium col-span-3'>{userData?.agreement === true ? "TRUE" : "FALSE"}</div>
          {/* <div className='md:col-span-2'>
                <label className="text-sm">Upload GST CERTIFICATE</label>
                <input type="file" {...register('businessLicense')} />
            </div>
            <div className='md:col-span-2'>
                <label className="text-sm">Upload Identity Proof</label>
                <input type="file" {...register('taxDocument')} />
            </div>
            <div className='md:col-span-2'>
                <label className="text-sm">Upload Certification Documents</label>
                <input type="file" {...register('certificationDocuments')} />
            </div> */}
          <div className='text-1xl font-semibold'>Gst Certificate :</div>
          <div className='text-lg font-medium'>
            <img
              src={userData?.gstCertificate}
              height="100px"
              width="100px"
              className='m-2'
              alt=''
            />
          </div>
          <div className='dz-message flex items-center justify-center'>

            <div>
              {
                uploadedGstImage ?
                  <img
                    src={URL.createObjectURL(uploadedGstImage)}
                    height="100px"
                    width="100px"
                    className='m-2'
                    alt=''
                  /> :
                  ""
              }
              <input
                id='filesize'
                onChange={handleFileChange}
                name="file"
                type="file"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff, .mp4, .webm, .mp3, .wav, .ogg, .glb"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </div>
          </div>
          <div className="flex items-center ms-8 justify-between">
            <button
              onClick={uploadGst}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Gst Certificate
            </button>
          </div>
          <div className='text-1xl font-semibold'>Identity Proof :</div>
          <div className='text-lg font-medium'>
            <img
              src={userData?.identityProof}
              height="100px"
              width="100px"
              className='m-2'
              alt=''
            />
          </div>
          <div className='dz-message flex items-center justify-center'>

            <div>
              {
                uploadedProofImage ?
                  <img
                    src={URL.createObjectURL(uploadedProofImage)}
                    height="100px"
                    width="100px"
                    className='m-2'
                    alt=''
                  /> :
                  ""
              }
              <input
                id='filesize'
                onChange={handleFileProofChange}
                name="file"
                type="file"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff, .mp4, .webm, .mp3, .wav, .ogg, .glb"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </div>
          </div>
          <div className="flex items-center ms-8 justify-between">
            <button
              onClick={uploadProof}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Identity Proof
            </button>
          </div>
          <div className='text-1xl font-semibold'> Document Certificate :</div>
          <div className='text-lg font-medium'>
            <img
              src={userData?.certificationDocuments}
              height="100px"
              width="100px"
              className='m-2'
              alt=''
            />
          </div>
          <div className='dz-message flex items-center justify-center'>

            <div>
              {
                uploadedDocImage ?
                  <img
                    src={URL.createObjectURL(uploadedDocImage)}
                    height="100px"
                    width="100px"
                    className='m-2'
                    alt=''
                  /> :
                  ""
              }
              <input
                id='filesize'
                onChange={handleFileDocChange}
                name="file"
                type="file"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff, .mp4, .webm, .mp3, .wav, .ogg, .glb"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </div>
          </div>
          <div className="flex items-center ms-8 justify-between">
            <button
              onClick={uploadDoc}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Document Certificate
            </button>
          </div>
          <div className='text-1xl font-semibold'>ServiceCategories :</div>
          <div className='text-lg font-medium'>
            {
              userData?.serviceCategories?.map((item, i) =>
                <div className="font-bold" key={i}>{i + 1}. {item?.label} ,  </div>
              )
            }
          </div>
          <div className='text-1xl font-semibold'>BrandsSupported :</div>
          <div className='text-lg font-medium'>
            {
              userData?.brandsSupported?.map((item, i) =>
                <div className="font-bold" key={i}>{i + 1}. {item?.label}   </div>
              )
            }
          </div>

         {props?.admin?.user?.role==="ADMIN"? <AddSupportedBrands serviceCenterId={userData?._id}existingBrands={userData?.brandsSupported} RefreshData={props?.RefreshData} />
        
        :""
          }
        </div>

      }
      <div className='w-100' >
        <ServicePincodes userId={userData?._id} pincode={userData?.pincodeSupported} RefreshData={props?.RefreshData} />
      </div>
    </div>


  );
};

export default ServiceProfile;


