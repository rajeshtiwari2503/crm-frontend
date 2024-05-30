 
import React from 'react';
import { useForm } from 'react-hook-form';

const ServiceCenterSignUpForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = data => {
    console.log(data);
  };

  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-4 gap-3">     
      <div className="mb-4">
          <label className="block mb-1">Service Center Name</label>
          <input {...register('serviceCenterName', { required: 'Service Center Name is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.serviceCenterName && <p className="text-red-500 text-sm mt-1">{errors.serviceCenterName.message}</p>}
        </div>
        <div className="mb-2">
          <label className="block mb-1">Service Center Type</label>
          <select {...register('serviceCenterType', { required: 'Service Center Type is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500">
            <option value="">Select...</option>
            <option value="Type1">Type 1</option>
            <option value="Type2">Type 2</option>
          </select>
          {errors.serviceCenterType && <p className="text-red-500 text-sm mt-1">{errors.serviceCenterType.message}</p>}
        </div>
        <div>
          <label className="text-sm">Registration Number</label>
          <input {...register('registrationNumber', { required: 'Registration Number is required' })}className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>}
        </div>
        <div>
          <label className="text-sm">Tax Identification Number  </label>
          <input {...register('tin', { required: 'Tax Identification Number is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.tin && <p className="text-red-500 text-sm mt-1">{errors.tin.message}</p>}
        </div>       
      
        <div>
          <label className="text-sm">Contact Person Name</label>
          <input {...register('contactPersonName', { required: 'Contact Person Name is required' })}  className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.contactPersonName && <p className="text-red-500 text-sm mt-1">{errors.contactPersonName.message}</p>}
        </div>
        <div>
          <label className="text-sm">Contact Person Position</label>
          <input {...register('contactPersonPosition', { required: 'Contact Person Position is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.contactPersonPosition && <p className="text-red-500 text-sm mt-1">{errors.contactPersonPosition.message}</p>}
        </div>
        <div>
          <label className="text-sm">Email Address</label>
          <input {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' } })}  className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm">Phone Number</label>
          <input {...register('phoneNumber', { required: 'Phone Number is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
        </div>
            
        <div>
          <label className="text-sm">Street Address</label>
          <input {...register('streetAddress', { required: 'Street Address is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.streetAddress && <p className="text-red-500 text-sm mt-1">{errors.streetAddress.message}</p>}
        </div>
        <div>
          <label className="text-sm">City</label>
          <input {...register('city', { required: 'City is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <label className="text-sm">State/Province</label>
          <input {...register('state', { required: 'State/Province is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
        </div>
        <div>
          <label className="text-sm">Postal Code</label>
          <input {...register('postalCode', { required: 'Postal Code is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode.message}</p>}
        </div>
        <div>
          <label className="text-sm">Country</label>
          <select {...register('country', { required: 'Country is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" >
            <option value="">Select...</option>
            <option value="Country1">Country 1</option>
            <option value="Country2">Country 2</option>
          </select>
          {errors.country && <p  className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
        </div>
       
        <div>
          <label className="text-sm">Service Categories</label>
          <input {...register('serviceCategories', { required: 'Service Categories are required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.serviceCategories && <p className="text-red-500 text-sm mt-1">{errors.serviceCategories.message}</p>}
        </div>
        <div>
          <label className="text-sm">Brands Supported</label>
          <input {...register('brandsSupported', { required: 'Brands Supported are required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.brandsSupported && <p className="text-red-500 text-sm mt-1">{errors.brandsSupported.message}</p>}
        </div>
        <div>
          <label className="text-sm">Technician Certifications</label>
          <input {...register('technicianCertifications', { required: 'Technician Certifications are required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.technicianCertifications && <p className="text-red-500 text-sm mt-1">{errors.technicianCertifications.message}</p>}
        </div>
        <div>
          <label className="text-sm">Operating Hours</label>
          <input {...register('operatingHours', { required: 'Operating Hours are required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.operatingHours && <p className="text-red-500 text-sm mt-1">{errors.operatingHours.message}</p>}
        </div>
       
        <div>
          <label className="text-sm">Years in Operation</label>
          <input {...register('yearsInOperation', { required: 'Years in Operation are required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.yearsInOperation && <p className="text-red-500 text-sm mt-1">{errors.yearsInOperation.message}</p>}
        </div>
        <div>
          <label className="text-sm">Number of Technicians</label>
          <input {...register('numberOfTechnicians', { required: 'Number of Technicians are required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.numberOfTechnicians && <p className="text-red-500 text-sm mt-1">{errors.numberOfTechnicians.message}</p>}
        </div>
        <div>
          <label className="text-sm">Average Turnaround Time</label>
          <input {...register('averageTurnaroundTime', { required: 'Average Turnaround Time is required' })}className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.averageTurnaroundTime && <p className="text-red-500 text-sm mt-1">{errors.averageTurnaroundTime.message}</p>}
        </div>
        <div className='flex justify-between items-center me-5'>
          <input type="checkbox" {...register('insuranceCoverage')} />

          <label className="text-sm">Insurance Coverage</label>
        </div>
       
        <div>
          <label className="text-sm">Username</label>
          <input {...register('username', { required: 'Username is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"/>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="text-sm">Confirm Password</label>
          <input type="password" {...register('confirmPassword', { required: 'Confirm Password is required', validate: value => value === password || 'Passwords do not match' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500"/>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
       
        <div className='md:col-span-2'>
          <label className="text-sm">Upload Business License</label>
          <input type="file" {...register('businessLicense')} />
        </div>
        <div className='md:col-span-2'>
          <label className="text-sm">Upload Tax Document</label>
          <input type="file" {...register('taxDocument')} />
        </div>
        <div className='md:col-span-2'>
          <label className="text-sm">Upload Certification Documents</label>
          <input type="file" {...register('certificationDocuments')} />
        </div>
       
        <label className="flex items-center mb-2 md:col-span-2">
          <input type="checkbox" {...register('agreement', { required: 'You must accept the terms and conditions' })} className="mr-2" />
          <span className="text-sm">I agree to the Terms and Conditions</span>
        </label>
        {errors.agreement && <p className="text-red-500 text-sm mt-1">{errors.agreement.message}</p>}
        <label className="flex items-center md:col-span-2">
          <input type="checkbox" {...register('privacyPolicy', { required: 'You must accept the privacy policy' })} className="mr-2" />
          <span className="text-sm">I agree to the Privacy Policy</span>
        </label>
        {errors.privacyPolicy && <p className="text-red-500 text-sm mt-1">{errors.privacyPolicy.message}</p>}
       

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
    </form>
  );
};

export default ServiceCenterSignUpForm;
 