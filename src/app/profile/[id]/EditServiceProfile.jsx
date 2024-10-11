"use client"
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import http_request from '../../../../http-request'
import { useRouter } from 'next/navigation';
import { ToastMessage } from '@/app/components/common/Toastify';

const EditServiceCenter = (props) => {
    const {userData}=props
    
    const [captchaQuestion, setCaptchaQuestion] = useState('');
    const [captchaAnswer, setCaptchaAnswer] = useState(0);
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();

    const EditServiceProfile = async (reqdata) => {
        try {
            
            setLoading(true)
            let response = await http_request.patch(`/editService/${userData?._id}`, reqdata)
            const { data } = response
            localStorage.setItem('userInfo', JSON.stringify(reqdata));
            ToastMessage(data)
            setLoading(false)
          router.push(`/dashboard`)
        }
        catch (err) {
            setLoading(false)
            ToastMessage(err?.response?.data)

            console.log(err);
        }

    }

    const onSubmit = data => {
        if (parseInt(data.captcha) !== captchaAnswer) {
            alert('CAPTCHA answer is incorrect');
            generateCaptcha();
        } else {
            EditServiceProfile(data)
        }

    };


    useEffect(() => {
        generateCaptcha();
        setValue('name', userData.name);
        setValue('email', userData.email);
        setValue('password', userData.password);
        setValue('contact', userData.contact);
        setValue('address', userData.address);
        setValue('agreement', userData.agreement);
        setValue('city', userData.city);
        setValue('contactPersonName', userData.contactPersonName);
        setValue('averageTurnaroundTime', userData.averageTurnaroundTime);
        setValue('contactPersonPosition', userData.contactPersonPosition);
        setValue('country', userData.country);
        setValue('insuranceCoverage', userData.insuranceCoverage);
        setValue('numberOfTechnicians', userData.numberOfTechnicians);
        setValue('operatingHours', userData.operatingHours);
        setValue('postalCode', userData.postalCode);
        setValue('privacyPolicy', userData.privacyPolicy);
        setValue('registrationNumber', userData.registrationNumber);
        setValue('serviceCenterName', userData.serviceCenterName);
        setValue('serviceCenterType', userData.serviceCenterType);
        setValue('state', userData.state);
        setValue('streetAddress', userData.streetAddress);
        setValue('technicianCertifications', userData.technicianCertifications);
        setValue('tin', userData.tin);
        setValue('yearsInOperation', userData.yearsInOperation);
        setValue('username', userData.username);
        setValue('insuranceCoverage', userData.insuranceCoverage);
        setValue('privacyPolicy', userData.privacyPolicy);
        // setValue('serviceCategories', userData.serviceCategories);
        setValue('brandsSupported', userData?.brandsSupported?.map(option => option?.value));
        // Object.keys(userData).forEach(key => {
        //     setValue(key, userData[key]);
        // });
        const mappedBrands = userData?.brandsSupported?.map(brand => ({ value: brand, label: brand })) || [];
        // const mappedCategories = userData?.serviceCategories?.map(category => ({ value: category, label: category })) || [];

        setSelectedBrands(mappedBrands);
        // setSelectedCategories(mappedCategories);
    }, []);

    const generateCaptcha = () => {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        setCaptchaQuestion(`${num1} + ${num2} = ?`);
        setCaptchaAnswer(num1 + num2);
    };

    const password = watch('password');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);

    const handleCategoryChange = (selectedOptions) => {
        setSelectedCategories(selectedOptions || []);
        setValue('serviceCategories', selectedOptions.map(option => option.value));
    };

    const handleBrandChange = (selectedOptions) => {
        setSelectedBrands(selectedOptions || []);
        setValue('brandsSupported', selectedOptions.map(option => option.value));
    };

    const categoriesOptions = [
        { value: 'Electronics', label: 'Electronics ' },
        { value: 'Appliances', label: 'Appliances' },
        { value: 'Automotive', label: 'Automotive' },
       
    ];

    const brandsOptions = [
        { value: 'Brand1', label: 'Brand 1' },
        { value: 'Brand2', label: 'Brand 2' },
        { value: 'Brand3', label: 'Brand 3' },
        { value: 'Brand4', label: 'Brand 4' },
    ];

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
                    <option value="Authorized">Authorized</option>
                    <option value="Independent">Independent</option>
                    <option value="Franchise">Franchise</option>
                </select>
                {errors.serviceCenterType && <p className="text-red-500 text-sm mt-1">{errors.serviceCenterType.message}</p>}
            </div>
            <div>
                <label className="text-sm">Registration Number</label>
                <input {...register('registrationNumber', { required: 'Registration Number is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber.message}</p>}
            </div>
            <div>
                <label className="text-sm">Tax Identification Number  </label>
                <input {...register('tin', { required: 'Tax Identification Number is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.tin && <p className="text-red-500 text-sm mt-1">{errors.tin.message}</p>}
            </div>

            <div>
                <label className="text-sm">Contact Person Name</label>
                <input {...register('contactPersonName', { required: 'Contact Person Name is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.contactPersonName && <p className="text-red-500 text-sm mt-1">{errors.contactPersonName.message}</p>}
            </div>
            <div>
                <label className="text-sm">Contact Person Position</label>
                <input {...register('contactPersonPosition', { required: 'Contact Person Position is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.contactPersonPosition && <p className="text-red-500 text-sm mt-1">{errors.contactPersonPosition.message}</p>}
            </div>
            <div>
                <label className="text-sm">Email Address</label>
                <input {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email address' } })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label className="text-sm">Phone Number</label>
                <input {...register('contact', { required: 'Phone Number is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
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
                    <option value="India">India</option>
                    <option value="Others">Others</option>
                </select>
                {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>}
            </div>

            {/* <div >
                <label className="text-sm">Service Categories</label>
                <Select
                    isMulti
                    options={categoriesOptions}
                    value={selectedCategories}

                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleCategoryChange}
                />
          
                {errors.serviceCategories && <p className="text-red-500">{errors.serviceCategories.message}</p>}
            </div> */}

            {/* <div  >
                <label className="text-sm">Brands Supported</label>
                <Select
                    isMulti
                    options={brandsOptions}
                    value={selectedBrands}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleBrandChange}
                />
                {errors.brandsSupported && <p className="text-red-500">{errors.brandsSupported.message}</p>}
               <ul>
          {selectedBrands.map((brand, index) => (
            <li key={index}>{brand.label}</li>
          ))}
        </ul> 
            </div> */}
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
                <input {...register('averageTurnaroundTime', { required: 'Average Turnaround Time is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.averageTurnaroundTime && <p className="text-red-500 text-sm mt-1">{errors.averageTurnaroundTime.message}</p>}
            </div>
           

            <div>
                <label className="text-sm">Username</label>
                <input {...register('email', { required: 'Username is required' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <label className="text-sm">Password</label>
                <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            {/* <div>
                <label className="text-sm">Confirm Password</label>
                <input type="password" {...register('confirmPassword', { required: 'Confirm Password is required', validate: value => value === password || 'Passwords do not match' })} className="w-full border border-gray-300 rounded px-3 py-1 focus:outline-none focus:border-blue-500" />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div> */}

            <div className='  '>
              <div >  <label className="text-sm">Upload Business License</label></div>
                <input type="file" {...register('businessLicense')} />
            </div>
            <div className=' '>
            <div >  <label className="text-sm">Upload Tax Document</label></div>
                <input type="file" {...register('taxDocument')} />
            </div>
            <div className='md:col-span-2'>
            <div >   <label className="text-sm">Upload Certification Documents</label></div>
                <input type="file" {...register('certificationDocuments')} />
            </div>
            <div className='flex   items-center '>
                <input type="checkbox" {...register('insuranceCoverage')} />

                <label className="text-sm ms-2">Insurance Coverage</label>
            </div>
            <div >
            <label className="flex items-center mt-5  md:col-span-2">
                <input type="checkbox" {...register('agreement', { required: 'You must accept the terms and conditions' })} className="mr-2" />
                <span className="text-sm">I agree to the Terms and Conditions</span>
            </label>
            {errors.agreement && <p className="text-red-500 text-sm mt-1">{errors.agreement.message}</p>}
            </div>
            <div>
            <label className="flex items-center mt-5 md:col-span-2">
                <input type="checkbox" {...register('privacyPolicy', { required: 'You must accept the privacy policy' })} className="mr-2" />
                <span className="text-sm">I agree to the Privacy Policy</span>
            </label>
            {errors.privacyPolicy && <p className="text-red-500 text-sm mt-1">{errors.privacyPolicy.message}</p>}
            </div>
            <div>
                <label htmlFor="captcha" className="block text-sm font-medium leading-6 text-gray-900">
                    {captchaQuestion}
                </label>
                <div className="mt-2">
                    <input
                        id="captcha"
                        name="captcha"
                        type="text"
                        required
                        {...register('captcha', { required: 'CAPTCHA is required' })}
                        className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.captcha ? 'border-red-500' : ''}`}
                    />
                </div>
                {errors.captcha && <p className="text-red-500 text-sm mt-1">{errors.captcha.message}</p>}
            </div>
            <button  disabled={loading}  onClick={handleSubmit(onSubmit)} type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
    );
};

export default EditServiceCenter;
