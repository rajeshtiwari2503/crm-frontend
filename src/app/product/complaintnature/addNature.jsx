import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request';
import { Button, Chip, IconButton } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import { ReactLoader } from '@/app/components/common/Loading';

const AddNature = ({ existingNature, product, RefreshData, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]); // Array to hold selected products (productId and productName)
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const AddProductCategory = async (data) => {
        try {
            const storedValue = localStorage.getItem("user");
              const userDa=JSON.parse(storedValue)
            setLoading(true);
            const reqData=userDa?.user?.role==="BRAND"?{...data,brandName:userDa?.user?.brandName,brandId:userDa?.user?._id}:data
            const endpoint = existingNature?._id ? `/editComplaintNature/${existingNature._id}` : '/addComplaintNature';
            const response = existingNature?._id ? await http_request.patch(endpoint, reqData) : await http_request.post(endpoint, reqData);
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
        const formData = { ...data, products: selectedProducts };
        AddProductCategory(formData);
    };

    useEffect(() => {
        if (existingNature) {
            setValue('nature', existingNature.nature);
            setSelectedProducts(existingNature.products || []); // Preload selected products (productId and productName)
        }
    }, [existingNature, setValue]);

    const handleProductChange = (e) => {
        const selectedProductId = e.target.value;
        const selectedProduct = product?.find(p => p._id === selectedProductId);

        // Check if the product is already selected to avoid duplicates
        if (selectedProduct && !selectedProducts.some(p => p.productId === selectedProduct._id)) {
            // Add both productId and productName to selectedProducts array
            setSelectedProducts([...selectedProducts, { productId: selectedProduct._id, productName: selectedProduct.productName }]);
        }
    };

    const handleRemoveProduct = (productId) => {
        setSelectedProducts(selectedProducts.filter(p => p.productId !== productId)); // Remove product from list
    };

    return (
        <div>
            {loading===true ?<div className='w-[400px]'> <ReactLoader /></div>
                : <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className='w-[400px]'>
                        <label htmlFor="productName" className="block text-sm font-medium leading-6 text-gray-900">
                            Select Product
                        </label>
                        <div className="mt-2">
                            <select
                                id="productName"
                                name="productName"
                                autoComplete="off"
                                onChange={handleProductChange}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                            >
                                <option value="">Select a product</option>
                                {product?.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.productName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Display selected products */}
                    <div className='mt-2'>
                        <label className="block text-sm font-medium leading-6 text-gray-900">
                            Selected Products
                        </label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {selectedProducts.map((p) => (
                                <Chip
                                    key={p.productId}
                                    label={p.productName}
                                    onDelete={() => handleRemoveProduct(p.productId)}
                                    deleteIcon={<DeleteIcon />}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                    </div>

                    <div className=''>
                        <label htmlFor="nature" className="block text-sm font-medium leading-6 text-gray-900">
                            Complaint Nature
                        </label>
                        <div className="mt-2">
                            <input
                                id="nature"
                                name="nature"
                                type="text"
                                autoComplete="off"
                                required
                                {...register('nature', { required: 'Nature is required', minLength: { value: 3, message: 'Nature must be at least 3 characters long' } })}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.nature ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {errors.nature && <p className="text-red-500 text-sm mt-1">{errors.nature.message}</p>}
                    </div>

                    <div className='flex justify-between mt-8'>
                        <Button variant="contained" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                            Cancel
                        </Button>
                        {existingNature?._id ? (
                            <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                                Update
                            </Button>
                        ) : (
                            <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                                Add Nature
                            </Button>
                        )}
                    </div>
                </form>
            }
        </div>
    );
};

export default AddNature;
