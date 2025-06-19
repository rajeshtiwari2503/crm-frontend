// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import http_request from '../../../../http-request';
// import { Button } from '@mui/material';
// import { ToastMessage } from '@/app/components/common/Toastify';

// const AddStock = ({ existingStock, RefreshData, onClose, products }) => {

//     const [loading, setLoading] = useState(false);
//     const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
//     const [selectPart, setSelectedPart] = useState("")
//     const AddStockData = async (data) => {
//         try {
//             setLoading(true);

//             const reqData = {
//                 ...data,
//             };

//             const endpoint = existingStock?._id ? `/editStock/${existingStock._id}` : '/AddStock';
//             const response = existingStock?._id ? await http_request.patch(endpoint, reqData) : await http_request.post(endpoint, reqData);
//             const { data: responseData } = response;
//             ToastMessage(responseData);
//             setLoading(false);
//             RefreshData(responseData);
//             onClose(true);
//         } catch (err) {
//             setLoading(false);
//             ToastMessage(err?._message);
//             onClose(true);
//             console.log(err);
//         }
//     };

//     const onSubmit = (data) => {
//         AddStockData(data);
//     };

//     useEffect(() => {
//         if (existingStock) {
//             setSelectedPart(existingStock?.partName)
//             setValue('sparepartName', existingStock?.partName);
//             setValue('freshStock', existingStock?.freshStock);
//         }
//     }, [existingStock, setValue]);

//     const handleChangeBrand = (id) => {

//         const selectedBrand = products?.find(brand => brand._id === id);

//         setSelectedPart(selectedBrand?.partName)
//         if (selectedBrand) {
//             setValue('brandName', selectedBrand?.brandName);
//             setValue('brandId', selectedBrand?.brandId);
//             setValue('sparepartId', selectedBrand?._id);
//             setValue('sparepartName', selectedBrand?.partName);
//         }

//     }

//     return (
//         <div>
//             <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>


//                 <div className='w-[400px]  '>
//                     <label htmlFor="sparepartName" className="block text-sm font-medium leading-6 text-gray-900">
//                         Sparepart
//                     </label>
//                     <div className="mt-2">
//                         <select
//                             id="sparepartName"
//                             name="sparepartName"
//                             // value={selectPart}
//                             onChange={(e) => handleChangeBrand(e.target.value)}

//                             // {...register('productBrand' )}
//                             className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productBrand ? 'border-red-500' : ''}`}
//                         >
//                             <option value="">Select a Sparepart</option>
//                             {products?.map((spare) => (
//                                 <option key={spare._id} value={spare._id}>
//                                     {spare.partName}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     {errors.productBrand && <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>}
//                 </div>

//                 <div className='w-[400px]'>
//                     <label htmlFor="serialNo" className="block text-sm font-medium leading-6 text-gray-900">
//                         Stock Quantity
//                     </label>
//                     <div className="mt-2">
//                         <input
//                             id="freshStock"
//                             name="freshStock"
//                             type="number"
//                             autoComplete="off"
//                             {...register('freshStock', { required: '  BrandStock Quantity is required' })}
//                             className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.freshStock ? 'border-red-500' : ''}`}
//                         />
//                         {errors.freshStock && <p className="text-red-500 text-sm mt-1">{errors.freshStock.message}</p>}
//                     </div>
//                 </div>


//                 <div className='flex justify-between mt-8'>
//                     <Button variant="contained" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
//                         Cancel
//                     </Button>
//                     {existingStock?._id ? (
//                         <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
//                             Update
//                         </Button>
//                     ) : (
//                         <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
//                             Add Product
//                         </Button>
//                     )}
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default AddStock;
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import http_request from '../../../../http-request';
import { Button } from '@mui/material';
import { ToastMessage } from '@/app/components/common/Toastify';
import { ReactLoader } from '@/app/components/common/Loading';

const AddStock = ({ existingStock, RefreshData, onClose, products, stockData }) => { // Added stockData prop for existing stocks

    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
    const [selectPart, setSelectedPart] = useState("");
    const [availableProducts, setAvailableProducts] = useState([]); // New state to store available products
    const [selectedBrand, setSelectedBrand] = useState('');
// console.log("products",products);

    const AddStockData = async (data) => {
        try {
            setLoading(true);

            const reqData = {
                ...data,
            };

            const endpoint = existingStock?._id ? `/editStock/${existingStock._id}` : '/AddStock';
            const response = existingStock?._id ? await http_request.patch(endpoint, reqData) : await http_request.post(endpoint, reqData);
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
        // console.log("data",data);

        AddStockData(data);
    };

    useEffect(() => {
        if (existingStock) {
            setSelectedPart(existingStock?.partName);
            setValue('sparepartName', existingStock?.partName);
            setValue('freshStock', existingStock?.freshStock);
        }

        // Filter products to show only those that are not already in stock
        const filterAvailableProducts = products?.filter(product => {
            return !stockData?.some(stock => stock.sparepartId === product._id);
        });

        setAvailableProducts(filterAvailableProducts);

    }, [existingStock, products, stockData, setValue]);

    const handleChangeBrand = (id) => {
        const selectedBrand = availableProducts?.find(brand => brand._id === id);
        setSelectedPart(selectedBrand?.partName);
        if (selectedBrand) {
            setValue('brandName', selectedBrand?.brandName);
            setValue('brandId', selectedBrand?.brandId);
            setValue('sparepartId', selectedBrand?._id);
            setValue('sparepartName', selectedBrand?.partName);
        }
    }
    const handleBrandSelect = (brandName) => {
        setSelectedBrand(brandName);

        // Filter spare parts that match selected brand
        const filtered = products?.filter(
            product => product.brandName === brandName 
        );

        setAvailableProducts(filtered);
    };

    return (
        <div>
            {loading === true ? <div className='w-[400px]  '><ReactLoader /></div>
                : <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-[400px]">
                        <label htmlFor="productBrand" className="block text-sm font-medium leading-6 text-gray-900">
                            Product Brand
                        </label>

                        <div className="mt-2">
                            <select
                                id="productBrand"
                                name="productBrand"
                                onChange={(e) => handleBrandSelect(e.target.value)}
                                className={`block p-3 w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors?.productBrand ? 'border-red-500' : ''
                                    }`}
                            >
                                <option value="">Select a Brand</option>
                                {Array.from(new Set(products?.map(item => item.brandName))).map(brand => (
                                    <option key={brand} value={brand}>
                                        {brand}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {errors?.productBrand && (
                            <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>
                        )}
                    </div>


                    <div className='w-[400px]'>
                        <label htmlFor="sparepartName" className="block text-sm font-medium leading-6 text-gray-900">
                            Sparepart
                        </label>
                        <div className="mt-2">
                            <select
                                id="sparepartName"
                                name="sparepartName"
                                onChange={(e) => {
                                    const selectedSpare = availableProducts?.find(spare => spare._id === e.target.value);
                                    if (selectedSpare) {
                                        setValue('sparepartId', selectedSpare._id);
                                        setValue('sparepartName', selectedSpare.partName);
                                        setValue('brandId', selectedSpare.brandId);
                                        setValue('brandName', selectedSpare.brandName);
                                    }
                                }}
                                className={`block p-3 w-full rounded-md border border-gray-300 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.productBrand ? 'border-red-500' : ''}`}
                            >
                                <option value="">Select a Sparepart</option>
                                {availableProducts?.map((spare) => (
                                    <option key={spare._id} value={spare._id}>
                                        {spare.partName}
                                    </option>
                                ))}
                            </select>

                        </div>
                        {errors.productBrand && <p className="text-red-500 text-sm mt-1">{errors.productBrand.message}</p>}
                    </div>

                    <div className='w-[400px]'>
                        <label htmlFor="serialNo" className="block text-sm font-medium leading-6 text-gray-900">
                            Stock Quantity
                        </label>
                        <div className="mt-2">
                            <input
                                id="freshStock"
                                name="freshStock"
                                type="number"
                                autoComplete="off"
                                {...register('freshStock', { required: '  Stock Quantity is required' })}
                                className={`block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors.freshStock ? 'border-red-500' : ''}`}
                            />
                            {errors.freshStock && <p className="text-red-500 text-sm mt-1">{errors.freshStock.message}</p>}
                        </div>
                    </div>

                    <div className='flex justify-between mt-8'>
                        <Button variant="contained" onClick={() => onClose(true)} className='hover:bg-[#fe3f49] hover:text-white' color="error">
                            Cancel
                        </Button>
                        {existingStock?._id ? (
                            <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                                Update Stock
                            </Button>
                        ) : (
                            <Button disabled={loading} variant="contained" className='hover:bg-[#2e7d32] hover:text-white' color="success" type="submit">
                                Add Stock
                            </Button>
                        )}
                    </div>
                </form>}
        </div>
    );
};

export default AddStock;
