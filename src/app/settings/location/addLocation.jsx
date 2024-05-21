import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';

const AddLocation = ({ existingLocation, RefreshData, onClose }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const AddProductCategory = async (data) => {
        try {
            setLoading(true);
            const endpoint = existingLocation?._id ? `/editLocation/${existingLocation._id}` : '/addLocation';
            const response = existingLocation?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, data);
            const { data: responseData } = response;
            ToastMessage(responseData);
            setLoading(false);
            RefreshData(responseData);
            onClose(true);
        } catch (err) {
            setLoading(false);
            ToastMessage(err?._message);
            onClose(true);
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        AddProductCategory(data);
    };

    
    React.useEffect(() => {
        if (existingLocation) {
            setValue('stateName', existingLocation.stateName);
            setValue('zone', existingLocation.zone);
        }
    }, [existingLocation, setValue]);

    return (
        <div>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                <div className='w-[400px]'>
                    <label htmlFor="stateName" className="block text-sm font-medium leading-6 text-gray-900">
                    State Name
                    </label>
                    <div className="mt-2">
                        <input
                            id="stateName"
                            name="stateName"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('stateName', { required: 'State Name is required', minLength: { value: 3, message: 'State Name must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.stateName ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.stateName && <p className="text-red-500 text-sm mt-1">{errors.stateName.message}</p>}
                </div>
                <div className=' '>
                    <label htmlFor="zone" className="block text-sm font-medium leading-6 text-gray-900">
                    Zone
                    </label>
                    <div className="mt-2">
                        <input
                            id="zone"
                            name="zone"
                            type="text"
                            autoComplete="off"
                            required
                            {...register('zone', { required: 'zone is required', minLength: { value: 3, message: 'zone must be at least 3 characters long' } })}
                            className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.zone ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.zone && <p className="text-red-500 text-sm mt-1">{errors.zone.message}</p>}
                </div>
                <div className='flex justify-between mt-8'>
                    <Button variant="outlined" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                        Cancel
                    </Button>
                    {existingLocation?._id ? (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Update
                        </Button>
                    ) : (
                        <Button disabled={loading} variant="outlined" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                            Add Location
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddLocation;
