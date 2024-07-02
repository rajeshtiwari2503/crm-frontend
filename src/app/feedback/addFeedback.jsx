import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import http_request from '../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';
import Rating from 'react-rating';

const AddFeedback = ({ existingFeedback, RefreshData, onClose, complaints }) => {

    
    const [loading, setLoading] = useState(false);

    const [ticket, setTicket] = useState(null);

    const { register, handleSubmit, control, formState: { errors }, reset, setValue } = useForm();

    const AddFeedback = async (data) => {
        try {
            setLoading(true);
            const endpoint = existingFeedback?._id ? `/editFeedback/${existingFeedback._id}` : '/addFeedback';
            const response = existingFeedback?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, data);
            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            // RefreshData(responseData);
            onClose(true);
        } catch (err) {
            setLoading(false);
            
            onClose(true);
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        AddFeedback(data);
        // console.log(data);
    };

    useEffect(() => {

        if (existingFeedback) {
             setTicket(existingFeedback.ticketNumber);
            setValue('ticketNumber', existingFeedback.ticketNumber);
            setValue('customerName', existingFeedback.customerName);
            setValue('emailAddress', existingFeedback.emailAddress);
            setValue('serviceDate', existingFeedback.serviceDate);
            setValue('overallsatisfaction', existingFeedback.overallsatisfaction);
            setValue('servicequality', existingFeedback.servicequality);
            setValue('timeliness', existingFeedback.timeliness);
            setValue('professionalism', existingFeedback.professionalism);
            setValue('comments', existingFeedback.comments);
            setValue('issuesFaced', existingFeedback.issuesFaced);
            setValue('recommendationLikelihood', existingFeedback.recommendationLikelihood);
            setValue('futureServiceInterest', existingFeedback.futureServiceInterest);
        }
        setValue('ticketNumber', complaints?._id);
        setValue('customerName', complaints?.fullName); 
        setValue('complaintId', complaints?._id);
        setValue('brandId', complaints?.brandId);
        setValue('userId', complaints?.userId);
        setValue('technicianId', complaints?.technicianId);
        setValue('serviceCenterId', complaints?.assignServiceCenterId);
        setValue('emailAddress', complaints?.emailAddress);
        setValue('serviceDate', new Date(complaints?.updatedAt).toLocaleDateString());
    }, [existingFeedback ]);
  
    const handleTicket = (e) => {
        const searchTerm = e.target.value;
        
        const ticket = complaints?.find((item) => item?._id ===searchTerm);
      
        if (ticket) {
            setValue('ticketNumber', ticket?._id);
            setValue('customerName', ticket?.fullName); 
            setValue('complaintId', ticket?._id);
            setValue('brandId', ticket?.brandId);
            setValue('userId', ticket?.userId);
            setValue('technicianId', ticket?.technicianId);
            setValue('serviceCenterId', ticket?.assignServiceCenterId);
            setValue('emailAddress', ticket?.emailAddress);
            setValue('serviceDate', new Date(ticket?.updatedAt).toLocaleDateString());
        }
    };

    return (
        <div>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className=" w-[400px]">
                    <label className="block">
                        Ticket Number:
                        <input
                            type="text"
                            onChange={handleTicket}
                            readOnly
                            value={ticket}
                            {...register("ticketNumber", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </label>
                    <div className='mt-2'>
                        <label className="block">
                            Service Date:
                            <input
                                type="text"
                                // value={new Date().toLocaleDateString()}
                                
                                {...register("serviceDate", { required: true })}
                                readOnly
                                className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 bg-gray-100 cursor-not-allowed"
                            />
                        </label>
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="block">
                        Customer Name:
                        <input
                            type="text"
                            {...register("customerName", { required: true })}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 bg-gray-100 cursor-not-allowed"
                        />
                    </label>
                    <label className="block">
                        Email Address:
                        <input
                            type="email"
                            {...register("emailAddress", { required: true })}
                            readOnly
                            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 bg-gray-100 cursor-not-allowed"
                        />
                    </label>
                </div>

                <div className="flex flex-col space-y-2">
                    {['Overall Satisfaction', 'Service Quality', 'Timeliness', 'Professionalism'].map(field => (
                        <div key={field}>
                            <div className='flex justify-between items-center'>
                                <label htmlFor={field.toLowerCase().replace(/\s/g, '')}>
                                    {field}:
                                </label>
                                <Controller
                                    name={field.toLowerCase().replace(/\s/g, '')}
                                    control={control}
                                    // defaultValue={0}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <Rating
                                            emptySymbol="far fa-star text-gray-300 text-2xl"
                                            fullSymbol="fas fa-star text-yellow-500 text-2xl"
                                            fractions={2}
                                            initialRating={value}
                                            onChange={onChange}
                                            ref={ref}
                                        />
                                    )}
                                />
                            </div>
                            {errors[field.toLowerCase().replace(/\s/g, '')] && <p className="text-red-500 text-sm">This field is required</p>}
                        </div>
                    ))}
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="block">
                        Comments/Suggestions:
                        <textarea
                            {...register("comments", { required: true })}
                            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                        {errors.comments && <p className="text-red-500 text-sm">This field is required</p>}
                    </label>
                    <label className="block">
                        Issues Faced:
                        <textarea
                            {...register("issuesFaced")}
                            className="mt-1 block w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ></textarea>
                    </label>
                </div>
                <div className="flex flex-col space-y-2">
                    {['recommendationLikelihood'].map((field) => (
                        <div key={field}>
                            <div className="flex justify-between items-center">
                                <label htmlFor={field}>Recommendation Likelihood:</label>
                                <Controller
                                    name={field}
                                    control={control}
                                    // defaultValue={0}
                                    rules={{ required: true }}
                                    render={({ field: { onChange, value, ref } }) => (
                                        <Rating
                                            emptySymbol="far fa-star text-gray-300 text-2xl"
                                            fullSymbol="fas fa-star text-yellow-500 text-2xl"
                                            fractions={2}
                                            initialRating={value}
                                            onChange={(newValue) => onChange(newValue)}
                                            ref={ref}
                                        />
                                    )}
                                />
                            </div>
                            {errors[field] && <p className="text-red-500 text-sm">This field is required</p>}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col space-y-2">

                    <label className="block">
                        Future Service Interest:
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="Yes"
                                    {...register("futureServiceInterest", { required: true })}
                                    className="form-radio"
                                />
                                <span className="ml-2">Yes</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    value="No"
                                    {...register("futureServiceInterest", { required: true })}
                                    className="form-radio"
                                />
                                <span className="ml-2">No</span>
                            </label>
                        </div>
                    </label>
                </div>


                <div className='flex justify-between mt-8'>
                    <Button variant="outlined" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                        Cancel
                    </Button>
                    {existingFeedback?._id ? (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Update
                        </Button>
                    ) : (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Add Feedback
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddFeedback;
