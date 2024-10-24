"use client"
import Sidenav from '@/app/components/Sidenav'
import React, { useEffect, useState } from 'react'
import http_request from "../../../../../../http-request";
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';

const WarrantyDetails = ({ params }) => {

    const router = useRouter()

    const [warranty, setWarranty] = useState({})
    const [brand, setBrand] = useState({})

    useEffect(() => {
        getWarranty()
        
    }, [ ]);
    useEffect(() => {
        
        if (warranty) {
            getBrandById(warranty?.brandId)
        }
    }, [warranty]);
    const getWarranty = async () => {
        try {
            let response = await http_request.get(`/getProductWarranty/${params?.id}`)
            let { data } = response
            setWarranty(data);

        }
        catch (err) {
            console.log(err)
        }
    }
    const getBrandById = async (brandId) => {
        try {
            let response = await http_request.get(`/getBrandBy/${brandId}`)
            let { data } = response
            setBrand(data);
        }
        catch (err) {
            console.log(err)
        }
    }

    console.log(brand);

    const handleEdit = (id) => {
        router.push(`/product/sparepart/edit/${id}`)
    }

    const printRecords = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Warranty Records</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
        printWindow.document.write('.record { margin-bottom: 20px; }');
        printWindow.document.write('.record img { width: 120px; height: 120px; }');
        printWindow.document.write('.container { display: flex; flex-wrap: wrap;   }');
        printWindow.document.write('.item { flex: 1 1 calc(33.333% - 20px); box-sizing: border-box;margin-top: 20px; }');
        printWindow.document.write('@media print { .page-break { page-break-before: always; } }');
        printWindow.document.write('</style></head><body>');

        // printWindow.document.write('<h1>Warranty Information</h1>');
        // printWindow.document.write('<div><strong>Brand Name:</strong> ' + warranty?.brandName + '</div>');
        // printWindow.document.write('<div><strong>Part Name:</strong> ' + warranty?.productName + '</div>');
        // printWindow.document.write('<div><strong>Warranty In Days:</strong> ' + warranty?.warrantyInDays + '</div>');
        // printWindow.document.write('<div><strong>Year:</strong> ' + warranty?.year + '</div>');
        // printWindow.document.write('<div><strong>Created At:</strong> ' + new Date(warranty?.createdAt).toLocaleString() + '</div>');
        // printWindow.document.write('<div><strong>Updated At:</strong> ' + new Date(warranty?.updatedAt).toLocaleString() + '</div>');

        // printWindow.document.write('<h2>Generated QR Codes</h2>');
        let records = warranty?.records || [];
        let rowsPerPage = 4;
        let itemsPerRow = 3;

        for (let i = 0; i < records.length; i += rowsPerPage * itemsPerRow) {
            printWindow.document.write('<div class="container">');
            for (let j = i; j < i + rowsPerPage * itemsPerRow && j < records.length; j++) {
                let item = records[j];
                printWindow.document.write('<div class="item">');
                printWindow.document.write('<div class="record">');
                printWindow.document.write('<div class="record">');
                printWindow.document.write('<div class="text-12">'+ item?.productName + ' </div>');
                // printWindow.document.write('<div class="text-12">  is powered by SERVICE GO</div>');
                printWindow.document.write('</div>');
 
                // printWindow.document.write('<div><img src="' + (brand?.brandLogo ? brand?.brandLogo : '/Logo.png') + '" alt="Company Logo" /></div>');

                printWindow.document.write('<div class="record"><img src="' + item?.qrCodes[0]?.qrCodeUrl + '" alt="QR Code" width="70" height="70"/></div>');
                // printWindow.document.write('<div class="text-12">Talk or Whatsapp</div>');
                // printWindow.document.write('<div class="font-bold text-12">+91 9649149196</div>');
                // printWindow.document.write('<div class="text-12">(10 AM - 6 PM)</div>');
                // printWindow.document.write('<div class="text-12">All Working Days</div>');
                // printWindow.document.write('<div class="text-12">Be ready with your  </div>');
                // printWindow.document.write('<div class="text-12">  Product Unique code No.,</div>');
                // printWindow.document.write('<div class="text-12">  Address & Pincode</div>');
                printWindow.document.write('<div class="font-bold text-12 record">Unique Code: ' + item?.uniqueId + '</div>');
                printWindow.document.write('</div>');
                printWindow.document.write('</div>');
            }
            printWindow.document.write('</div>');

            if (i + rowsPerPage * itemsPerRow < records.length) {
                printWindow.document.write('<div class="page-break"></div>');
            }
        }

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }


    return (
        <Sidenav>

            {!warranty ?
                <div className='h-[400px] flex justify-center items-center'>
                    <ReactLoader />
                </div>
                :
                <>
                    <div className='flex justify-between items-center mb-3'>
                        <div className='font-bold text-2xl'>Warranty Information</div>
                        {/* <div onClick={() => handleEdit(warranty?._id)} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
              <Edit style={{ color: "white" }} />
              <div className=' ml-2 '>Edit Sparepart</div>
            </div> */}
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-5'>
                        <div className='font-bold mt-5'>Brand Name</div>
                        <div>{warranty?.brandName}</div>
                        <div className='font-bold'>Part Name</div>
                        <div>{warranty?.productName}</div>
                        <div className='font-bold'>Warranty In Days</div>
                        <div>{warranty?.warrantyInDays}</div>
                        <div className='font-bold'>Year</div>
                        <div>{warranty?.year}</div>
                        <div className='font-bold'>Created At</div>
                        <div>{new Date(warranty?.createdAt).toLocaleString()}</div>
                        <div className='font-bold'>Updated At</div>
                        <div>{new Date(warranty?.updatedAt).toLocaleString()}</div>
                    </div>
                    <button onClick={printRecords} className='mt-5 p-2 bg-blue-500 text-white rounded'>
                        Print Records
                    </button>
                    <div className='font-bold mt-5'>Generated QR codes</div>
                    <div className=' grid md:grid-cols-4 sm:grid-cols-1 gap-4'>
                        {warranty?.records?.map((item, i) => (
                            <div key={i} className='mt-3 flex justify-center items-center'>
                                <div className=' mb-5 '>
                                    <div className='  mt-3 mb-3 font-bold text-[12px]'>Generate QR Code warranty is powered by SERVICE GO</div>
                                    {/* <div>{warranty?.brandLogo}</div> */}
                                    <div className='flex justify-center items-center'>
                                        <img src={brand?.brandLogo?brand?.brandLogo:"/Logo.png"} alt="image" width={100} height={100} />
                                    </div>
                                    {/* <div className='font-bold'>Part Name</div>
                                    <div>{warranty?.productName}</div> */}
                                    <div className='font-bold'> </div>
                                    <div className='flex justify-center items-center mt-3'>
                                        <img src={item?.qrCodes[0]?.qrCodeUrl} alt="image" width={80} height={80} />
                                    </div>
                                    <div className='text-[12px]'> Talk or Whatsapp</div>
                                    <div className='font-bold text-[12px]'> +91 9649149196</div>
                                    <div className='text-[12px]'> (10 AM - 6 PM) </div>
                                    <div className='text-[12px]'> All Working Days </div>
                                    <div className='text-[12px]'> Be ready with your Product Unique code No. ,Address & Pincode</div>
                                    <div className='font-bold text-[12px]'>Unique Code :{item?.uniqueId} </div>
                                    {/* <div>{warranty?.warrantyInDays}</div> */}
                                    {/* <div className='font-bold'>Year</div>
                                    <div>{warranty?.year}</div> */}
                                </div>
                            </div>
                        ))}
                    </div>

                </>
            }
        </Sidenav>
    )
}

export default WarrantyDetails
