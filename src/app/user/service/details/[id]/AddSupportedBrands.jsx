import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import http_request from '../../../../../../http-request';

const AddSupportedBrands = ({ existingBrands = [], serviceCenterId, RefreshData }) => {
    const { control, setValue, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            brandsSupported: []
        }
    });

    const [brands, setBrands] = useState([]); // All available brands
    const [loadingBrands, setLoadingBrands] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);

    // Watch selected brands
    const selectedBrands = watch("brandsSupported", []);

    // Fetch all brands
    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await http_request.get('/getAllBrand');
                setBrands(response.data);
            } catch (error) {
                setError("Error fetching brands: " + error.message);
                console.error("Error fetching brands:", error);
            } finally {
                setLoadingBrands(false);
            }
        };
        fetchBrands();
    }, []);

    // Sync existing brands on mount or prop change
    useEffect(() => {
        if (existingBrands.length) {
            const formattedBrands = existingBrands.map(brand => ({
                value: brand.value,
                label: brand.label
            }));
            // console.log("formattedBrands",formattedBrands);
            
            reset({ brandsSupported: formattedBrands });
        }
    }, [existingBrands, reset]);

    const onSubmit = async (data) => {
        setLoadingSubmit(true);
        setError(null);
        try {
            const payload = {
                brandsSupported: data.brandsSupported.map(option => ({
                    value: option.value,
                    label: option.label
                }))
            };
            // console.log("brandsSupported",data);
            
            const response = await http_request.patch(`/editService/${serviceCenterId}`, payload);
            RefreshData(response.data);
        } catch (error) {
            setError("Error updating service center: " + error.message);
            console.error("Error updating service center:", error);
        } finally {
            setLoadingSubmit(false);
        }
    };

    // ✅ Fix: Remove only one brand
    const handleRemoveBrand = (brandToRemove) => {
        // console.log("brandToRemove",brandToRemove);
        const updatedBrands = selectedBrands.filter(brand => brand.value !== brandToRemove.value);
        // console.log("updatedBrands",updatedBrands);
        
        setValue("brandsSupported", updatedBrands, { shouldValidate: true });
    };

    return (
        <div className="w-full md:w-[700px] p-6 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                {/* Supported Brands */}
                <div className="w-full mb-6">
                    <label className="text-lg   font-semibold text-gray-700">Supported Brands</label>
                    <Controller
                        control={control}
                        name="brandsSupported"
                        render={({ field }) => (
                            <Select
                                isMulti
                                options={brands.map(brand => ({
                                    value: brand._id,
                                    label: brand.brandName,
                                    isDisabled: selectedBrands.some(selected => selected.value === brand._id) // Disable if already selected
                                }))}
                                className="w-full"
                                classNamePrefix="select"
                                onChange={field.onChange}
                                value={selectedBrands}
                                isDisabled={loadingBrands}
                            />
                        )}
                    />
                    {loadingBrands && <p className="text-sm text-gray-500">Loading brands...</p>}
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>

                {/* Selected Brands Display */}
                {/* <div className="w-full mt-4">
                    <label className="text-lg font-semibold text-gray-700">Selected Brands</label>
                    <div className="flex flex-wrap gap-2">
                        {selectedBrands.map(brand => (
                            <div
                                key={brand.value}
                                className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-lg"
                            >
                                <span>{brand.label}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveBrand(brand)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div> */}

                {/* Submit Button */}
                <div className="flex justify-center mt-6">
                    <button
                        type="submit"
                        className={` px-6 py-3 ${loadingSubmit ? 'bg-gray-400' : 'bg-blue-600'} text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition`}
                        disabled={loadingSubmit}
                    >
                        {loadingSubmit ? 'Updating...' : 'Update Brands'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddSupportedBrands;
