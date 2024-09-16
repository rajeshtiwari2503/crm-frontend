import { ToastMessage } from '@/app/components/common/Toastify';
import React, { useState } from 'react';
import http_request from '../../../http-request'
import { useForm } from 'react-hook-form';

const RechargeForm = ({ userData,brandData, existingRecharge, RefreshData, onClose }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [loadind, setLoading]=useState(false)
// console.log(brandData);

    const AddRecharge = async (data) => {
        
        try {
            setLoading(true);
            const endpoint = existingRecharge?._id ? `/editProductWarranty/${existingRecharge._id}` : '/addRecharge';
            const reqData = {
                amount: data?.amount,
                brandName: brandData ? brandData?.brandName : userData?.brandName,
                brandId: brandData ? brandData?._id : userData?._id,
                description:"Recharge Added "
              };
              
            const response = existingRecharge?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, reqData);
            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            RefreshData(responseData);
            onClose(true);
        } catch (err) {
            setLoading(false);
            ToastMessage(err?._message);
            // onClose(true);
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        AddRecharge(data)
        // console.log(data);
        

    };

    

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="">
                <div className="grid grid-cols-1   gap-4">
                     
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            id="amount"
                            type="number"
                            {...register('amount', { required: 'Amount is required' })}
                            className={`mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.amount ? 'border-red-500' : ''}`}
                        />
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                    </div>
                    {/* <div>
                        <label htmlFor="firstTen" className="block text-sm font-medium text-gray-700">1 - 10 KM</label>
                        <input
                            id="firstTen"
                            type="text"
                            {...register('firstTen', { required: 'First Ten is required' })}
                            className={`mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.firstTen ? 'border-red-500' : ''}`}
                        />
                        {errors.firstTen && <p className="text-red-500 text-sm">{errors.firstTen.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="afterTen" className="block text-sm font-medium text-gray-700">10 - 100 KM</label>
                        <input
                            id="afterTen"
                            type="text"
                            {...register('afterTen', { required: 'After Ten is required' })}
                            className={`mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.afterTen ? 'border-red-500' : ''}`}
                        />
                        {errors.afterTen && <p className="text-red-500 text-sm">{errors.afterTen.message}</p>}
                    </div>  */}
                    
                </div>

                <div className="mt-4">
                    <button type="submit" disabled={loadind}className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RechargeForm;
