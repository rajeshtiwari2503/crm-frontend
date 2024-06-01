"use client"
import React  from 'react';
 
const ServiceProfile = (props) => {
  
    const {userData} =    props 

    return (
       
             <div className='flex justify-center'>
                        <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4">
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
                            <div className='text-1xl font-semibold'>serviceCenterType :</div>
                            <div className='text-lg font-medium'>
                                {
                             userData?.serviceCategories?.map((item,i)=>
                                <div>{item} { " "} </div>
                            )
                             }
                            </div>
                            <div className='text-1xl font-semibold'>brandsSupported :</div>
                            <div className='text-lg font-medium'>
                                {
                             userData?.brandsSupported?.map((item,i)=>
                                <div>{item} { " "} </div>
                            )
                             }
                            </div>
                            <div className='text-1xl font-semibold'>Status :</div>
                            <div className='text-lg font-medium'>{userData?.status === 'ACTIVE' ? "ACTIVE" : "INACTIVE"}</div>
                            <div className='text-1xl font-semibold'>insuranceCoverage :</div>
                            <div className='text-lg font-medium'>{userData?.insuranceCoverage===true ? "TRUE" : "FALSE"}</div>
                            <div className='text-1xl font-semibold'>agreement :</div>
                            <div className='text-lg font-medium'>{userData?.agreement===true ? "TRUE" : "FALSE"}</div>
                            
                        </div>
                    </div>
              
    
    );
};

export default ServiceProfile;
