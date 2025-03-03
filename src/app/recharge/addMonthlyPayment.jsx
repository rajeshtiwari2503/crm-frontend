import { ToastMessage } from '@/app/components/common/Toastify';
import React, { useEffect, useState } from 'react';
import http_request from '../../../http-request'
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AddMonthlyPayment = ({ userData, brandData, existingRecharge, RefreshData, onClose }) => {
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [loadind, setLoading] = useState(false)
    // console.log(brandData);

    useEffect(() => {
        setValue("amount", brandData?.crmPrice)
    }, [])
    const AddMonthlyPayment = async (data) => {

        try {
            const date = new Date();
            date.setMonth(date.getMonth() - 1);
            const previousMonth = date.toLocaleString('default', { month: 'long' });

            setLoading(true);
            const endpoint = '/addRecharge';
            const reqData = {
                amount: -(data?.amount),
                brandName: brandData ? brandData?.brandName : userData?.brandName,
                brandId: brandData ? brandData?._id : userData?._id,

                description: `Monthly Payment Added for ${previousMonth}`
            };
          
            const response =   await http_request.post(endpoint, reqData);
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

        AddMonthlyPayment(data)


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
                            readOnly
                            {...register('amount', { required: 'Amount is required' })}
                            className={`mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.amount ? 'border-red-500' : ''}`}
                        />
                        {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
                    </div>


                </div>

                <div className="mt-4">
                    <button type="submit" disabled={loadind} className="ms-3 flex cursor-pointer rounded-lg p-3   border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                        {loadind ? "Submiting...." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMonthlyPayment;
