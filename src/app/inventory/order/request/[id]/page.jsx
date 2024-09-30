"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from "../../../../../../http-request";
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';
import { useForm } from 'react-hook-form';
const OrderRequest = ({ params }) => {

    const router = useRouter()
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
    const [complaint, setComplaint] = useState({})
    const [selectedSparepart, setSelectedSparepart] = useState('');

    const [sparepart, setSparepart] = useState([])
    const [serviceCenter, setServiceCenter] = useState([])
    const [brands, setBrands] = useState([])
    const [value, setUserValue] = React.useState(null);

    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setUserValue(JSON.parse(storedValue));
        }
        GetComplaint()
        getAllSparepart()
        getAllServiceCenter()
        getAllBrand()
    }, [])



    const getAllSparepart = async () => {
        try {
            let response = await http_request.get("/getAllSparePart")
            let { data } = response;

            setSparepart(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    const getAllServiceCenter = async () => {
        try {
            let response = await http_request.get("/getAllService")
            let { data } = response;

            setServiceCenter(data)
        }
        catch (err) {
            console.log(err);
        }
    }
    const getAllBrand = async () => {
        try {
            let response = await http_request.get("/getAllBrand")
            let { data } = response;

            setBrands(data)
        }
        catch (err) {
            console.log(err);
        }
    }

    const filterSparepart = sparepart?.filter((f) =>
        f?.products?.some((product) => product?.productId === complaint?.productId)
      );
      
    // console.log(filterSparepart);

    const GetComplaint = async () => {
        try {
            let response = await http_request.get(`/getComplaintById/${params?.id}`)
            let { data } = response
            setComplaint(data);
        }
        catch (err) {
            console.log(err)


        }
    }
    const handleEdit = (id) => {
        router.push(`/product/Order/edit/${id}`)
    }
    const partOrder = async (data) => {
        console.log(data);
        
        // try {
        //     let response = await http_request.post(`/addOrder`, data);
        //     let { data: responseData } = response;
        //     ToastMessage(responseData);
        // } catch (err) {
        //     console.log(err);
        // }
    };
    const handleSparepartChange = (event) => {

        const selectedId = event.target.value;
        const selectedpart = sparepart?.find(part => part._id === selectedId);
        const selectedBrand = brands?.find(brand => brand._id === complaint?.brandId);
        const selectedService = serviceCenter?.find(center => center._id === complaint?.assignServiceCenterId);
        // console.log(selectedBrand);
        // console.log(selectedService);

        setSelectedSparepart(selectedId);
        setValue('sparepartId', selectedpart?._id);
        setValue('partName', selectedpart?.partName);
        setValue('partNumber', selectedpart?.partNo);
        setValue('breadth', selectedpart?.breadth);
        setValue('length', selectedpart?.length);
        setValue('weight', selectedpart?.weight);
        setValue('height', 1);
        setValue('bestPrice', selectedpart?.bestPrice);

        setValue("brandAddress", selectedBrand?.streetAddress);
        setValue("brandPincode", selectedBrand?.postalCode);
        setValue("brandContact", selectedBrand?.contactPersonPhoneNumber);
        setValue('brandId', selectedBrand?._id);
        setValue('brand', selectedBrand?.brandName);

        setValue('serviceCenterAddress', selectedService?.streetAddress);
        setValue('serviceCenterPincode', selectedService?.postalCode);
        setValue('serviceCenterId', selectedService?._id);
        setValue("serviceContact", selectedService?.contact);
        setValue('serviceCenter', selectedService?.serviceCenterName);



    };
    return (
        <Sidenav>

            {!complaint ? <div className='h-[400px] flex justify-center items-center'> <ReactLoader /></div>
                :
                <>
                    <div className='flex justify-between items-center mb-3'>
                        <div className='font-bold text-2xl'>Order Information</div>

                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-5'>
                        <div className='font-bold'>Part Name</div>
                        <div>{complaint?.productName}</div>
                        <div className='font-bold'>Part No. </div>
                        <div>{complaint?.serialNo}</div>
                        {/* <div className='font-bold'>quantity  </div>
            <div>{complaint?.quantity}</div> */}
                        <div className='font-bold'>Service Center Name  </div>
                        <div>{complaint?.assignServiceCenter}</div>
                        <div className='font-bold'>Brand Name  </div>
                        <div>{complaint?.productBrand}</div>
                        <div className='font-bold'>comments  </div>
                        <div>{complaint?.errorMessages}</div>

                        {/* <div className='font-bold'>Send To  </div>
            <div>{complaint?.supplierInformation?.name}</div>
            <div className='font-bold'>contact  </div>
            <div>{complaint?.supplierInformation?.contact}</div>
            <div className='font-bold'>address  </div>
            <div>{complaint?.supplierInformation?.address}</div> */}

                        <div className='font-bold'>status  </div>
                        <div>{complaint?.status}</div>
                        <div className='font-bold'>createdAt  </div>
                        <div>{new Date(complaint?.createdAt).toLocaleString()}</div>
                        <div className='font-bold'>updatedAt  </div>
                        <div>{new Date(complaint?.updatedAt).toLocaleString()}</div>

                    </div>

                    <div>
                        <div className='flex justify-center items-center mt-10 mb-5'>
                            <div className='font-bold text-2xl text-center'>Order  </div>

                        </div>
                        <form onSubmit={handleSubmit(partOrder)} className="max-w-lg mx-auto grid grid-cols-1 gap-3 md:grid-cols-2  bg-white shadow-md rounded-md p-3">


                            <div className='mt-1'>
                                <label id="service-center-label" className="mb-1 block text-sm font-medium text-black ">
                                    Sparepart Name
                                </label>

                                <select
                                    id="service-center-label"
                                    value={selectedSparepart}
                                    onChange={handleSparepartChange}
                                    className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                    <option value="" disabled>Select Sparepart</option>
                                    {filterSparepart?.map((center) => (
                                        <option key={center.id} value={center._id}>
                                            {center.partName}
                                        </option>
                                    ))}
                                </select>

                            </div>
                            {/* <div>
                                <label className="block text-gray-700  ">Part Name</label>
                                <input {...register('partName')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                {errors.partName && <p className="text-red-500 text-sm mt-1">{errors.partName.message}</p>}
                            </div> */}

                            <div>
                                <label className="block text-gray-700 ">Part Number/Model Number</label>
                                <input {...register('partNumber')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                {errors.partNumber && <p className="text-red-500 text-sm mt-1">{errors.partNumber.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 ">Brand Name</label>
                                <input {...register('brand')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                            </div>
                            <div>
                                <label className="block text-gray-700 ">Quantity</label>
                                <input {...register('quantity', { valueAsNumber: true })} type="number" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
                            </div>




                            <div className='col-span-2 mb-4'>
                                <label className="block text-gray-700 ">Comments/Notes</label>
                                <textarea {...register('comments')} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                                {errors.comments && <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>}
                            </div>


                            <button type="submit" className="w-full py-2  px-4 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Create Order</button>

                        </form>
                    </div>
                </>
            }
        </Sidenav>
    )
}

export default OrderRequest