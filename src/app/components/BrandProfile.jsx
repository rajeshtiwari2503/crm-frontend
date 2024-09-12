"use client"
import React, { useState } from 'react';
import { ToastMessage } from './common/Toastify';
import http_request from "../../../http-request"
import { ReactLoader } from './common/Loading';
import { Toaster } from 'react-hot-toast';
const BrandProfile = (props) => {

    const { userData,RefreshData } = props

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

        <div className='flex justify-center'>
            <Toaster />
            {loading ? <ReactLoader/>: 
            <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4">
                <div className='text-1xl font-bold'>Created :</div>
                <div className='text-1xl font-bold'>{new Date(userData?.createdAt).toLocaleString()}</div>
                <div className='text-1xl font-bold'>Updated :</div>
                <div className='text-1xl font-bold'>{new Date(userData?.updatedAt).toLocaleString()}</div>
                <div className='text-1xl font-semibold'>Brand Name :</div>
                <div className='text-lg font-medium'>{userData?.brandName}</div>
                <div className='text-1xl font-semibold'>Email :</div>
                <div className='text-lg font-medium'>{userData?.email}</div>
                <div className='text-1xl font-semibold'>Brand Logo:</div>
                <div>
                <img
                                    src={ userData?.brandLogo}
                                    height="100px"
                                    width="100px"
                                    className='m-2'
                                    alt=''
                                />
                </div>
               
                <div className='dz-message flex items-center justify-center'>

                    <div>
                        {
                            uploadedImage ?
                                <img
                                    src={URL.createObjectURL(uploadedImage)}
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
                                                            onClick={uploadBrandLogo}
                                                                type="submit"
                                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                            >
                                                                Upload Logo
                                                            </button>
                                                        </div>
                 
                <div className='text-1xl font-semibold'>brandDescription :</div>
                <div className='text-lg font-medium'>{userData?.brandDescription}</div>
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
                {/* <div className='text-1xl font-semibold'>Tin :</div>
                            <div className='text-lg font-medium'>{userData?.tin}</div>  */}
                <div className='text-1xl font-semibold'>contactPersonName :</div>
                <div className='text-lg font-medium'>{userData?.contactPersonName}</div>
                <div className='text-1xl font-semibold'>Contact Person Phone No. :</div>
                <div className='text-lg font-medium'>{userData?.contactPersonPhoneNumber}</div>
                <div className='text-1xl font-semibold'>websiteURL :</div>
                <div className='text-lg font-medium'>{userData?.websiteURL}</div>
                <div className='text-1xl font-semibold'>companySize :</div>
                <div className='text-lg font-medium'>{userData?.companySize}</div>

                <div className='text-1xl font-semibold'>industry :</div>
                <div className='text-lg font-medium'>
                    {
                        userData?.industry?.map((item, i) =>
                            <div>{item} {" "} </div>
                        )
                    }
                </div>
                
                <div className='text-1xl font-semibold'>Status :</div>
                <div className='text-lg font-medium'>{userData?.status === 'ACTIVE' ? "ACTIVE" : "INACTIVE"}</div>
                <div className='text-1xl font-semibold'>termsAndConditions :</div>
                <div className='text-lg font-medium'>{userData?.termsAndConditions === true ? "TRUE" : "FALSE"}</div>
                <div className='text-1xl font-semibold'>privacyPolicy :</div>
                <div className='text-lg font-medium'>{userData?.privacyPolicy === true ? "TRUE" : "FALSE"}</div>

            </div>
}
        </div>


    );
};

export default BrandProfile;
