import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import http_request from '../../../../../../http-request';
import { Toaster } from 'react-hot-toast';
import { ToastMessage } from '@/app/components/common/Toastify';

const AddCategory = ({ existingCategories = [], serviceCenterId, RefreshData }) => {
    const { control, setValue, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            serviceCategories: []
        }
    });

    const [categories, setCategories] = useState([]); // All available categories
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

    // Watch selected categories
    const selectedCategories = watch("serviceCategories", []);

    // Fetch all categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await http_request.get('/getAllProductCategory');
                setCategories(response.data);
            } catch (error) {
                setError("Error fetching categories: " + error.message);
                console.error("Error fetching categories:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Sync existing categories on mount or prop change
    useEffect(() => {
        if (existingCategories.length) {
            const formattedCategories = existingCategories.map(category => ({
                value: category.value,
                label: category.label
            }));
            reset({ serviceCategories: formattedCategories });
        }
    }, [existingCategories, reset]);

    const onSubmit = async (data) => {
        setLoadingSubmit(true);
        setError(null);
        try {
            const payload = {
                serviceCategories: data.serviceCategories.map(option => ({
                    value: option.value,
                    label: option.label
                }))
            };

            const response = await http_request.patch(`/editService/${serviceCenterId}`, payload);
            ToastMessage(response?.data)
            RefreshData(response.data);
        } catch (error) {
            setError("Error updating service center: " + error.message);
            console.error("Error updating service center:", error);
        } finally {
            setLoadingSubmit(false);
        }
    };

    // ✅ Fix: Remove only one category
    const handleRemoveCategory = (categoryToRemove) => {
        const updatedCategories = selectedCategories.filter(category => category.value !== categoryToRemove.value);
        setValue("serviceCategories", updatedCategories, { shouldValidate: true });
    };

    return (
        <div className="w-full   p-6 bg-white rounded-lg shadow-md">
            <Toaster />
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                {/* Supported Categories */}
                <div className="w-full mb-6">
                    <label className="text-lg font-semibold text-gray-700">Supported Categories</label>
                    <Controller
                        control={control}
                        name="serviceCategories"
                        render={({ field }) => (
                            <Select
                                isMulti
                                options={categories.map(category => ({
                                    value: category._id,
                                    label: category.categoryName,
                                    isDisabled: selectedCategories.some(selected => selected.value === category._id) // Disable if already selected
                                }))}
                                className="w-full"
                                classNamePrefix="select"
                                onChange={field.onChange}
                                value={selectedCategories}
                                isDisabled={loadingCategories}
                            />
                        )}
                    />
                    {loadingCategories && <p className="text-sm text-gray-500">Loading categories...</p>}
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className={`px-4 py-2 ${loadingSubmit ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition`}
                        disabled={loadingSubmit}
                    >
                        {loadingSubmit ? 'Updating...' : 'Update Categories'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCategory;
