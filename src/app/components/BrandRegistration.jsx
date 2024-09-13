
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-select';
import { ToastMessage } from './common/Toastify';
import http_request from '../../../http-request'
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ReactLoader } from './common/Loading';

const BrandSignUpForm = () => {
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(0);

  const [pincode, setPincode] = useState('');
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();

  const Regiter = async (reqdata) => {
    try {
 
      setLoading(true)
      let response = await http_request.post(`/brandRegistration`, reqdata)
      const { data } = response
      localStorage.setItem('userInfo', JSON.stringify(reqdata));
      ToastMessage(data)
      setLoading(false)
      router.push("/sign_in")
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
      Regiter(data)
    }

  };


  useEffect(() => {
    generateCaptcha();
    getAllCategories()
  }, []);

  const getAllCategories = async () => {
    let response = await http_request.get("/getAllProductCategory")
    let { data } = response;

    setCategories(data)
  }
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion(`${num1} + ${num2} = ?`);
    setCaptchaAnswer(num1 + num2);
  };

  const password = watch('password');
  const [selectedCategories, setSelectedCategories] = useState([]);


  const handleIndustryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
    setValue('industry', selectedOptions.map(option => option.value));
  };



  const industryOptions = [
    { value: 'Electronics', label: 'Electronics ' },
    { value: 'Appliances', label: 'Appliances' },
    { value: 'Automotive', label: 'Automotive' },

  ];
  useEffect(() => {
    if (pincode.length === 6) { // Ensure the pincode is valid (assuming 6 digits)
      fetchLocation();
    }
  }, [pincode]);

  const fetchLocation = async () => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      if (response.data && response.data[0].Status === 'Success') {

        const [details] = response.data;

        const { District, State, Country } = details.PostOffice[0];
        setLocation({ District, State });
        setValue('postalCode', pincode);
        setValue('state', State);
        setValue('city', District);
        setValue('country', Country);
        setError('')
        return response.data[0].PostOffice[0]; // Return the location details
      } else {
        setError('No location found for the provided pincode.');
        return null;
      }
    } catch (error) {
      setError('Error fetching location details.');
      console.error(error);
      return null;
    }
  };
 

  const handleCategoryChange = (selectedOptions) => {
    setValue('serviceCategories', selectedOptions);
    // setValue('serviceCategories', selectedOptions.map(option => option.value));
  };
  return (
    <>
      {loading === true ? <ReactLoader />
        :
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-4 gap-3">
          <div className="mb-1">
            <label className=" text-sm block mb-1">Brand Name</label>
            <input
              type="text"
              {...register('brandName', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.brandName && <span className="text-red-500">Brand Name is required</span>}
          </div>
          <div className="mb-1">
            <label className=" text-sm block mb-1">Brand ID</label>
            <input
              type="text"
              {...register('brandID', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.brandID && <span className="text-red-500">Brand ID is required</span>}
          </div>
          <div className="mb-1 md:col-span-2">
            <label className=" text-sm block mb-1">Brand Description</label>
            <textarea
              {...register('brandDescription', { required: true })}
              className="w-full ps-2  border border-gray-300 rounded-md"
            ></textarea>
            {errors.brandDescription && <span className="text-red-500">Brand Description is required</span>}
          </div>
          <div >
            <label className="text-sm">Service Categories</label>
            <Select
              isMulti
              options={categories.map((category) => ({
                value: category._id, 
                label: category.categoryName
              }))}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleCategoryChange}
            />

            {errors.serviceCategories && <p className="text-red-500">{errors.serviceCategories.message}</p>}
          </div>

          <div className="mb-1">
            <label className=" text-sm block mb-1">Contact Person Name</label>
            <input
              type="text"
              {...register('contactPersonName', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.contactPersonName && <span className="text-red-500">Contact Person Name is required</span>}
          </div>
          <div className="mb-1">
            <label className=" text-sm block mb-1">Contact Person Email</label>
            <input
              type="email"
              {...register('contactPersonEmail', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.contactPersonEmail && <span className="text-red-500">Contact Person Email is required</span>}
          </div>
          <div className="mb-1">
            <label className=" text-sm block mb-1">  Contact</label>
            <input
              type="tel"
              {...register('contactPersonPhoneNumber', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.contactPersonPhoneNumber && <span className="text-red-500">Contact Person Phone Number is required</span>}
          </div>


          <div className="mb-1">
            <label className=" text-sm block mb-1">Street Address</label>
            <input
              type="text"
              {...register('streetAddress', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.streetAddress && <span className="text-red-500">Street Address is required</span>}
          </div>
          <div className="mb-1">
            <label className=" text-sm block mb-1">Postal/ZIP Code</label>
            {/* <input
          type="text"
          {...register('postalCode', { required: true })}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        {errors.postalCode && <span className="text-red-500">Postal/ZIP Code is required</span>}
      </div> */}
            <input
              name="pincode"
              type="number"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter pincode"
              className="border p-2 mb-4 w-full"
            />
            {error && <p className="text-red-500 mt-1">{error}</p>}
          </div>
          <div className="mb-1">
            <label className=" text-sm block mb-1">City</label>
            <input
              type="text"
              {...register('city', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.city && <span className="text-red-500">City is required</span>}
          </div>
          <div className="mb-1">
            <label className=" text-sm block mb-1">State/Province</label>
            <input
              type="text"
              {...register('state', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.state && <span className="text-red-500">State/Province is required</span>}
          </div>

          <div className="mb-1">
            <label className=" text-sm block mb-1">Country</label>
            <select
              {...register('country', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
              <option value="Others">Others</option>
              {/* Add more options as needed */}
            </select>
            {errors.country && <span className="text-red-500">Country is required</span>}
          </div>


          <div className="mb-1">
            <label className=" text-sm block mb-1">Email Id</label>
            <input
              type="text"
              {...register('email', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.email && <span className="text-red-500">Username is required</span>}
          </div>
          <div className="mb-1">
            <label className=" text-sm block mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.password && <span className="text-red-500">Password is required</span>}
          </div>
          <div className="mb-1">
            <label className=" text-sm block mb-1">Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword', { required: true })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {errors.confirmPassword && <span className="text-red-500">Confirm Password is required</span>}
          </div>


          <div className="mb-1">
            <label className=" text-sm block mb-1">Website URL</label>
            <input
              type="url"
              {...register('websiteURL')}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* <div >
        <label className="text-sm">Service Categories</label>
        <Select
          isMulti
          options={industryOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          onChange={handleIndustryChange}
        />

        {errors.industry && <p className="text-red-500">{errors.industry.message}</p>}
      </div> */}

          {/* <div  >
        <label className="text-sm">Company Size</label>
        <select
          {...register('companySize', { required: true })}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Company Size</option>
          <option value="1-10">1-10</option>
          <option value="11-50">11-50</option>
         
        </select>
        {errors.companySize && <p className="text-red-500">{errors.companySize.message}</p>}

      </div> */}
          <label className="flex items-center mb-2 md:col-span-2">
            <input type="checkbox" {...register('termsAndConditions', { required: 'You must accept the terms and conditions' })} className="mr-2" />
            <span className="text-sm">I agree to the Terms and Conditions</span>
          </label>
          {errors.agreement && <p className="text-red-500 text-sm mt-1">{errors.agreement.message}</p>}
          <label className="flex items-center md:col-span-2">
            <input type="checkbox" {...register('privacyPolicy', { required: 'You must accept the privacy policy' })} className="mr-2" />
            <span className="text-sm">I agree to the Privacy Policy</span>
          </label>
          {errors.privacyPolicy && <p className="text-red-500 text-sm mt-1">{errors.privacyPolicy.message}</p>}

          <div className='md:col-span-2'>
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
          <button disabled={loading} onClick={handleSubmit(onSubmit)} type="submit" className="bg-blue-500 text-white p-2 rounded">Submit</button>
        </form>
      }
    </>

  );
};

export default BrandSignUpForm;
