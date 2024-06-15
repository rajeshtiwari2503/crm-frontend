"use client"
import React  from 'react';
 
const DealerProfile = (props) => {
  
    const {userData} =    props 

    return (
       
             <div className='flex justify-center'>
                        <div className="m-5 grid md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 mt-5 gap-4">
                        <div className='text-1xl font-bold'>Created :</div>
                                    <div className='text-1xl font-bold'>{new Date(userData?.createdAt).toLocaleString()}</div>
                                    <div className='text-1xl font-bold'>Updated :</div>
                                    <div className='text-1xl font-bold'>{new Date(userData?.updatedAt).toLocaleString()}</div>
                                    <div className='text-1xl font-semibold'>User Name :</div>
                                    <div className='text-lg font-medium'>{userData?.name}</div>
                                    <div className='text-1xl font-semibold'>Email :</div>
                                    <div className='text-lg font-medium'>{userData?.email}</div>
                                    <div className='text-1xl font-semibold'>Contact :</div>
                                    <div className='text-lg font-medium'>{userData?.contact}</div>
                                    <div className='text-1xl font-semibold'>Password :</div>
                                    <div className='text-lg font-medium'>{userData?.password}</div>
                                    <div className='text-1xl font-semibold'>Business Registration Number :</div>
                                    <div className='text-lg font-medium'>{userData?.businessRegistrationNumber}</div>
                                    <div className='text-1xl font-semibold'>Gst Vat Number :</div>
                                    <div className='text-lg font-medium'>{userData?.gstVatNumber}</div>
                                    <div className='text-1xl font-semibold'>Contact Person :</div>
                                    <div className='text-lg font-medium'>{userData?.contactPerson}</div>
                                    <div className='text-1xl font-semibold'>Business Address :</div>
                                    <div className='text-lg font-medium'>{userData?.businessAddress}</div>
                            <div className='text-1xl font-semibold'>Status :</div>
                            <div className='text-lg font-medium'>{userData?.status === 'ACTIVE' ? "ACTIVE" : "INACTIVE"}</div>
                            <div className='text-1xl font-semibold'>termsAndConditions :</div>
                            <div className='text-lg font-medium'>{userData?.acceptedTerms===true ? "TRUE" : "FALSE"}</div>
                            
                            
                        </div>
                    </div>
              
    
    );
};

export default DealerProfile;
