"use client"
import React, { useEffect, useState } from 'react';
 
 

const ServiceProfile = (props) => {
  
    const {userData} =    props

    console.log('userData', userData);

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
                            <div className='text-1xl font-semibold'>postalCode :</div>
                            <div className='text-lg font-medium'>{userData?.postalCode}</div> 
                            <div className='text-1xl font-semibold'>Address :</div>
                            <div className='text-lg font-medium'>{userData?.streetAddress}</div>
                            <div className='text-1xl font-semibold'>Address :</div>
                            <div className='text-lg font-medium'>{userData?.streetAddress}</div>
                            <div className='text-1xl font-semibold'>Address :</div>
                            <div className='text-lg font-medium'>{userData?.streetAddress}</div>
                            <div className='text-1xl font-semibold'>Address :</div>
                            <div className='text-lg font-medium'>{userData?.streetAddress}</div>
                            <div className='text-1xl font-semibold'>Status :</div>
                            <div className='text-lg font-medium'>{userData?.status === 'ACTIVE' ? "ACTIVE" : "INACTIVE"}</div>
                            <div className='text-1xl font-semibold'>Accept Terms & Conditions :</div>
                            <div className='text-lg font-medium'>{userData?.acceptTerms ? "TRUE" : "FALSE"}</div>
                          
                        </div>
                    </div>
              
    
    );
};

export default ServiceProfile;
