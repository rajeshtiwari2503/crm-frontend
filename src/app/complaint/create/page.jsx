
"use client"
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request'
import Sidenav from '@/app/components/Sidenav'
import { ToastMessage } from '@/app/components/common/Toastify';
import { useRouter } from 'next/navigation';


const AddComplaint = () => {

  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, getValues } = useForm();

  const RegiterComplaint = async (reqdata) => {
    try {
      setLoading(true)

      let response = await http_request.post('/createComplaint', reqdata)
      const { data } = response
      ToastMessage(data)
      setLoading(false)
      router.push("/complaint/allComplaint")
    }
    catch (err) {
      setLoading(false)
      ToastMessage(err.response.data)

      console.log(err);
    }

  }

  const onSubmit = (data) => {
    RegiterComplaint(data)
  };

  const [selectedOption, setSelectedOption] = useState('');

  const handleSelectChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];
  return (
    <>

      <Sidenav >
        <div className=" ">
          <div  >
            <h2 className=" text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Create a new complaint
            </h2>

            <form className="mt-3 grid md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-3" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Brand  Name
                </label>
                <select
                  className="block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={selectedOption}
                  onChange={handleSelectChange}
                >
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Product Category
                </label>
                <select
                  className="block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={selectedOption}
                  onChange={handleSelectChange}
                >
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Product Name
                </label>
                <select
                  className="block mt-1 p-3 w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={selectedOption}
                  onChange={handleSelectChange}
                >
                  {options.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="customerName" className="block text-sm font-medium leading-6 text-gray-900">
                 Customer Name
                </label>
                <div className="mt-1">
                  <input
                    id="customerName"
                    name="customerName"
                    type="text"
                    autoComplete="customerEmail"
                    required
                    {...register('customerName', { required: 'Name is required', minLength: { value: 3, message: 'Name must be at least 3 characters long' } })}
                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.customerName ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
              </div>
              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium leading-6 text-gray-900">
                Customer Email  
                </label>
                <div className="mt-1">
                  <input
                    id="customerEmail"
                    name="customerEmail"
                    type="customerEmail"
                    autoComplete="customerEmail"
                    required
                    {...register('customerEmail', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.customerEmail ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>}
              </div>
              <div>
                <label htmlFor="customerMobile" className="block text-sm font-medium leading-6 text-gray-900">
                Customer Contact No.
                </label>
                <div className="mt-1">
                  <input
                    id="customerMobile"
                    name="customerMobile"
                    type="number"
                    autoComplete="tel"
                    required

                    {...register('customerMobile', { required: 'Contact number is required', pattern: { value: /^\d{10}$/, message: 'Contact No. must be at least 10 characters long' } })}
                    className={`block p-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.customerMobile ? 'border-red-500' : ''
                      }`}

                  />
                </div>
                {(errors.customerMobile) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.customerMobile ? errors.customerMobile.message : 'Contact number is required'}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium leading-6 text-gray-900">
                Zip
                </label>
                <div className="mt-1">
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    autoComplete="tel"
                    required

                    {...register('zipCode', { required: 'zipCode number is required',    message: 'zipCode must be at least 10 characters long'  })}
                    className={`block p-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.zipCode ? 'border-red-500' : ''
                      }`}

                  />
                </div>
                {(errors.zipCode) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.zipCode ? errors.zipCode.message : 'zipCode is required'}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="address1" className="block text-sm font-medium leading-6 text-gray-900">
               Address1
                </label>
                <div className="mt-1">
                  <input
                    id="address1"
                    name="address1"
                    type="text"
                    autoComplete="text"
                    required

                    {...register('address1', { required: 'address1 is required',  message: 'address1 must be at least 10 characters long'  })}
                    className={`block p-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.address1 ? 'border-red-500' : ''
                      }`}

                  />
                </div>
                {(errors.address1) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address1 ? errors.address1.message : 'address1 is required'}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="address1" className="block text-sm font-medium leading-6 text-gray-900">
               Address2
                </label>
                <div className="mt-1">
                  <input
                    id="address2"
                    name="address2"
                    type="text"
                    autoComplete="text"
                    required

                    {...register('address2', { required: 'address2 is required',  message: 'address2 must be at least 10 characters long'  })}
                    className={`block p-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.address2 ? 'border-red-500' : ''
                      }`}

                  />
                </div>
                {(errors.address2) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address2 ? errors.address2.message : 'address2 is required'}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="listOfArea" className="block text-sm font-medium leading-6 text-gray-900">
               List Of Area
                </label>
                <div className="mt-1">
                  <input
                    id="listOfArea"
                    name="listOfArea"
                    type="text"
                    autoComplete="tel"
                    required

                    {...register('listOfArea', { required: 'listOfArea is required',  message:'listOfArea must be at least 10 characters long' } )}
                    className={`block p-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.listOfArea ? 'border-red-500' : ''
                      }`}

                  />
                </div>
                {(errors.listOfArea) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.listOfArea ? errors.listOfArea.message : 'listOfArea is required'}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                State
                </label>
                <div className="mt-1">
                  <input
                    id="state"
                    name="state"
                    type="text"
                    autoComplete="tel"
                    required

                    {...register('state', { required: 'state is required',   message: 'state must be at least 10 characters long'  })}
                    className={`block p-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.state ? 'border-red-500' : ''
                      }`}

                  />
                </div>
                {(errors.state) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.state ? errors.state.message : 'state is required'}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="district" className="block text-sm font-medium leading-6 text-gray-900">
              District
                </label>
                <div className="mt-1">
                  <input
                    id="district"
                    name="district"
                    type="district"
                    autoComplete="tel"
                    required

                    {...register('district', { required: 'district is required',  message: 'district must be at least 10 characters long' })}
                    className={`block p-3  w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.district ? 'border-red-500' : ''
                      }`}

                  />
                </div>
                {(errors.district) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.district ? errors.district.message : 'district is required'}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
              City
                </label>
                <div className="mt-1">
                  <input
                    id="city"
                    name="city"
                    type="text"
                    autoComplete="tel"
                    required
                    {...register('city', { required: 'city is required', minLength: { value: 3, message: 'city must be at least 3 characters long' } })}
                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.city ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
               Locality
                </label>
                <div className="mt-1">
                  <input
                    id="locality"
                    name="locality"
                    type="text"
                    autoComplete="tel"
                    required
                    {...register('locality', { required: 'Locality is required', minLength: { value: 3, message: 'Locality must be at least 3 characters long' } })}
                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.locality ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.locality && <p className="text-red-500 text-sm mt-1">{errors.locality.message}</p>}
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
               Landmark
                </label>
                <div className="mt-1">
                  <input
                    id="Lankmark"
                    name="landmark"
                    type="text"
                    autoComplete="tel"
                    required
                    {...register('landmark', { required: 'Landmark is required', minLength: { value: 3, message: 'Landmark must be at least 3 characters long' } })}
                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.landmark ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.landmark && <p className="text-red-500 text-sm mt-1">{errors.landmark.message}</p>}
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
               Nature of Complaint
                </label>
                <div className="mt-1">
                  <input
                    id="complaintNature"
                    name="complaintNature"
                    type="text"
                    autoComplete="tel"
                    required
                    {...register('complaintNature', { required: 'Complaint Nature is required', minLength: { value: 3, message: 'Complaint Nature must be at least 3 characters long' } })}
                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.complaintNature ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.complaintNature && <p className="text-red-500 text-sm mt-1">{errors.complaintNature.message}</p>}
              </div>
              <div>
                <label htmlFor="contact" className="block text-sm font-medium leading-6 text-gray-900">
               Complaint Details
                </label>
                <div className="mt-1">
                  <input
                    id="complaintDetails"
                    name="complaintDetails"
                    type="text"
                    autoComplete="tel"
                    required

                    {...register('complaintDetails', { required: 'Complaint Details is required', minLength: { value: 3, message: 'Complaint Details be at least 3 characters long' } })}
                    className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.complaintDetails ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.complaintDetails && <p className="text-red-500 text-sm mt-1">{errors.complaintDetails.message}</p>}
              </div>
            </form>
            <div className='mt-5  '>
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit(onSubmit)}
                className="flex   justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>


      </Sidenav>
    </>

  )
}

export default AddComplaint





