"use client"
import React, { useState } from 'react';
import http_request from "../../../http-request"
import { ReactLoader } from './common/Loading';
import ServicePincodes from './ServicePincodes';
import AddSupportedBrands from '../user/service/details/[id]/AddSupportedBrands';
import AddCategory from '../user/service/details/[id]/AddCategory';
import ServiceCenterDepositForm from './ServiceCenterDeposit';
import { Toaster } from 'react-hot-toast';
import { ToastMessage } from './common/Toastify';

const ServiceProfile = (props) => {

  const [loading, setLoading] = useState(false)
  const [uploadedGstImage, setUploadedGstImage] = useState(null);
  const [uploadedProofImage, setUploadedProofImage] = useState(null);
  const [uploadedDocImage, setUploadedDocImage] = useState(null);
  const [uploadedQrCode, setUploadedQrCode] = useState(null);
   const [UPIid, setUPIid] = useState("");

  const { userData } = props
  const uploadGst = async (img) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("gstCertificate", uploadedGstImage);
      let response = await http_request.patch(`/uploadCenterGstCertificate/${userData?._id}`, formData);
      let { data } = response;
      props?.RefreshData(data)
      window.location.reload();
      ToastMessage(data);
      setUploadedGstImage(null)
      setLoading(false)

    } catch (err) {
      setLoading(false)

      console.log(err);
    }
  }
  const uploadQrCode = async (img) => {
    try {
      setLoading(true)
      const formData = new FormData();
      formData.append("qrCode", uploadedQrCode);
      let response = await http_request.patch(`/uploadCenterQrCode/${userData?._id}`, formData);
      let { data } = response;
      props?.RefreshData(data)
      window.location.reload();
      ToastMessage(data);
      setUploadedQrCode(null)
      setLoading(false)

    } catch (err) {
      setLoading(false)

      console.log(err);
    }
  }
  const uploadUPIid = async ( ) => {
  try {
    setLoading(true);

    const response = await http_request.patch(
      `/uploadCenterUPIid/${userData?._id}`,
      { UPIid: UPIid } // Send UPI ID as JSON
    );

    const { data } = response;
    console.log("data",data);
    
    props?.RefreshData(data);
    ToastMessage(data);
    setLoading(false);
  } catch (err) {
    console.error(err);
    setLoading(false);
  }
};

  const handleFileChangeQrCode = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedQrCode(file);

    }
  };
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
      window.location.reload();
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
      window.location.reload();
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
      <Toaster />
      {loading === true ? <ReactLoader />
        :
        <div className="md:m-5 m-0 grid md:grid-cols-4 sm:grid-cols-2 grid-cols-2 mt-5 gap-1">

          <div className=' md:text-1xl text-sm font-bold'>Created : </div>
          <div className=' md:text-1xl text-sm  '>{new Date(userData?.createdAt).toLocaleString()}</div>
          <div className=' md:text-1xl text-sm font-bold'>Updated :</div>
          <div className=' md:text-1xl text-sm  '>{new Date(userData?.updatedAt).toLocaleString()}</div>
          <div className=' md:text-1xl text-sm font-semibold'>Service Center Name :</div>
          <div className='md:text-1xl text-sm  '>{userData?.serviceCenterName}</div>

          <div className=' md:text-1xl text-sm font-semibold'>Contact :</div>
          <div className='md:text-1xl text-sm  '>{userData?.contact}</div>
          <div className=' md:text-1xl text-sm font-semibold  '>Email :</div>
          <div className='md:text-1xl text-sm md:col-span-1 col-span-2 '>{userData?.email}</div>
          <div className=' md:text-1xl text-sm font-semibold'>Password :</div>
          <div className='md:text-1xl text-sm '>{userData?.password}</div>
          <div className=' md:text-1xl text-sm font-semibold'>Address :</div>
          <div className='md:text-1xl text-sm   '>{userData?.streetAddress}</div>
          <div className=' md:text-1xl text-sm font-semibold'>City :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.city}</div>
          <div className=' md:text-1xl text-sm font-semibold'>State :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.state}</div>
          <div className=' md:text-1xl text-sm font-semibold'>country :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.country}</div>
          <div className=' md:text-1xl text-sm font-semibold'>postalCode :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.postalCode}</div>
          <div className=' md:text-1xl text-sm font-semibold'>Tin :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.tin}</div>
          <div className=' md:text-1xl text-sm font-semibold'>contactPersonName :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.contactPersonName}</div>
          <div className=' md:text-1xl text-sm font-semibold'>contactPersonPosition :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.contactPersonPosition}</div>
          <div className=' md:text-1xl text-sm font-semibold'>insuranceCoverage :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.insuranceCoverage}</div>
          <div className=' md:text-1xl text-sm font-semibold'>numberOfTechnicians :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.numberOfTechnicians}</div>
          <div className=' md:text-1xl text-sm font-semibold'>operatingHours :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.operatingHours}</div>
          <div className=' md:text-1xl text-sm font-semibold'>serviceCenterType :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.serviceCenterType}</div>


          <div className=' md:text-1xl text-sm font-semibold'>Status :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.status === 'ACTIVE' ? "ACTIVE" : "INACTIVE"}</div>
          <div className=' md:text-1xl text-sm font-semibold'>insuranceCoverage :</div>
          <div className=' md:text-1xl text-sm   '>{userData?.insuranceCoverage === true ? "TRUE" : "FALSE"}</div>
          <div className=' md:text-1xl text-sm font-semibold '>agreement :</div>
          <div className=' md:text-1xl text-sm    md:col-span-3'>{userData?.agreement === true ? "TRUE" : "FALSE"}</div>
          {/* <div className='md: md:col-span-2 col-span-1'>
                <label className="text-sm">Upload GST CERTIFICATE</label>
                <input type="file" {...register('businessLicense')} />
            </div>
            <div className='md: md:col-span-2 col-span-1'>
                <label className="text-sm">Upload Identity Proof</label>
                <input type="file" {...register('taxDocument')} />
            </div>
            <div className='md: md:col-span-2 col-span-1'>
                <label className="text-sm">Upload Certification Documents</label>
                <input type="file" {...register('certificationDocuments')} />
            </div> */}
          <div className="mb-4 md:col-span-3 flex gap-4 items-center mt-4">
            <label className="block text-gray-700 font-medium mb-2">UPI_ID</label>
            <div>{userData?.UPIid}  </div>
            <input
              type="text"
              value={UPIid}
              onChange={(e) => setUPIid(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="example@upi"
              required
            />
          </div>
          <div className="mb-4 mt-4 md:text-end">
            <button
            onClick={() => uploadUPIid( )}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Upload UPI 
            </button>
          </div>
          <div className=' md:text-1xl text-sm font-semibold mt-5'>Paymemt Qr Code :</div>
          <div className=' md:text-1xl text-sm  mt-5 '>
            <img
              src={userData?.qrCode}
              height="100px"
              width="100px"
              className='m-2'
              alt=''
            />
          </div>
          <div className='dz-message flex items-center justify-center'>

            <div className=''>
              {
                uploadedQrCode ?
                  <img
                    src={URL.createObjectURL(uploadedQrCode)}
                    height="100px"
                    width="100px"
                    className='m-2'
                    alt=''
                  /> :
                  ""
              }
              <input
                id='filesize'
                onChange={handleFileChangeQrCode}
                name="file"
                type="file"
                accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff, .mp4, .webm, .mp3, .wav, .ogg, .glb"
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
              />
            </div>
          </div>
          <div className="flex items-center  md:ms-8  justify-center">
            <button
              onClick={uploadQrCode}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Qr Code
            </button>
          </div>
          <div className=' md:text-1xl text-sm font-semibold'>Gst Certificate :</div>
          <div className=' md:text-1xl text-sm   '>
            <img
              src={userData?.gstCertificate}
              height="100px"
              width="100px"
              className='m-2'
              alt=''
            />
          </div>
          <div className='dz-message flex items-center justify-center'>

            <div className=''>
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
          <div className="flex items-center  md:ms-8  justify-center">
            <button
              onClick={uploadGst}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Gst Certificate
            </button>
          </div>
          <div className=' md:text-1xl text-sm font-semibold'>Identity Proof :</div>
          <div className=' md:text-1xl text-sm   '>
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
          <div className="flex items-center  md:ms-8  justify-center">
            <button
              onClick={uploadProof}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Identity Proof
            </button>
          </div>
          <div className=' md:text-1xl text-sm font-semibold'> Document Certificate :</div>
          <div className=' md:text-1xl text-sm   '>
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
          <div className="flex items-center  md:ms-8  justify-center">
            <button
              onClick={uploadDoc}
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Upload Document Certificate
            </button>
          </div>
          <div className=' md:text-1xl text-sm font-semibold mt-5'>ServiceCategories :</div>
          <div className=' md:text-1xl text-sm  mt-5 '>
            {
              userData?.serviceCategories?.map((item, i) =>
                <div className="font-bold" key={i}>{i + 1}. {item?.label}   </div>
              )
            }
          </div>
          <div className=' md:text-1xl text-sm font-semibold mt-5'>BrandsSupported :</div>
          <div className=' md:text-1xl text-sm  mt-5 '>
            {
              userData?.brandsSupported?.map((item, i) =>
                <div className="font-bold" key={i}>{i + 1}. {item?.label}   </div>
              )
            }
          </div>
          <div className=' md:col-span-2 col-span-2'>
            {props?.admin?.user?.role === "ADMIN" ? <AddCategory serviceCenterId={userData?._id} existingCategories={userData?.serviceCategories} RefreshData={props?.RefreshData} />

              : ""
            }
          </div>
          <div className=' md:col-span-2 col-span-2'>
            {props?.admin?.user?.role === "ADMIN" ?
              <AddSupportedBrands serviceCenterId={userData?._id} existingBrands={userData?.brandsSupported} RefreshData={props?.RefreshData} />

              : ""
            }
          </div>
          <div className=' md:col-span-2 col-span-2 mt-5 mb-5'  >
            <ServicePincodes userId={userData?._id} pincode={userData?.pincodeSupported} RefreshData={props?.RefreshData} />
          </div>
          {/* <div className='md:col-span-2 col-span-2 md:m-5 border p-4  mb-5 '>
            <div className='text-md font-bold mb-4'>Pincodes Supported</div>
            <div className="  overflow-x-auto whitespace-nowrap">
              {userData?.pincodeSupported?.map((item, i) =>

                <div key={i} className=' '>
                  <div >{item}</div>
                </div>
              )}
            </div>

          </div> */}
        </div>

      }


      <div className=' md:col-span-2 col-span-2'  >
        <ServiceCenterDepositForm userData={userData} RefreshData={props?.RefreshData} />
      </div>

    </div>


  );
};

export default ServiceProfile;


