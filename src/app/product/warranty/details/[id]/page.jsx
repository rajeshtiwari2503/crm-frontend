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
    const [loading, setLoading] = useState();

    const [search, setSearch] = useState([]);

    const [uniqueId, setUniqueId] = useState("");
    const [result, setResult] = useState(null);

    const [error, setError] = useState("");

    const handleSearch = async () => {
        if (!uniqueId.trim()) {
            setError("Unique ID is required.");
            return;
        }

        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await http_request.get(
                `/getProductWarrantyByUniqueId/${uniqueId}`
            );
            const { data } = response;

            const filterWarranty = data?.records?.filter((f) => f?.uniqueId === uniqueId)
            // console.log("filterWarranty",filterWarranty);
            setSearch(data)
            setResult(filterWarranty);
            if (data) {
                getBrandById(filterWarranty?.brandId)
            }
            // setWarranty(data)
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError("Warranty not found.");
            } else {
                setError("An error occurred while fetching the warranty.");
            }
        } finally {
            setLoading(false);
        }
    };


    // console.log("result" ,result);

    useEffect(() => {
        getWarranty()

    }, []);
    useEffect(() => {

        if (warranty) {


            getBrandById(warranty?.brandId)
        }
    }, [warranty]);
    const getWarranty = async () => {
        try {
            setLoading(true)
            let response = await http_request.get(`/getProductWarranty/${params?.id}`)
            let { data } = response
            setWarranty(data);
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            setLoading(false)

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

    // console.log("search",search);
    const filtRecord = search?.records?.length > 0 ? {
        records: result, brandId: search?.brandId
        , brandName: search?.brandName, numberOfGenerate: search?.numberOfGenerate, warrantyInDays: search?.warrantyInDays, createdAt: search?.createdAt,
        updatedAt: search?.updatedAt,
    } : warranty
    //  console.log("filtRecord",filtRecord);
    // console.log(brand);

    const handleEdit = (id) => {
        router.push(`/product/sparepart/edit/${id}`)
    }


    const printA4Records = () => {
        const logoUrl = brand?.brandLogo || "/Logo.png"; // Dynamically determine the logo URL
        const printWindow = window.open('', '', 'height=600,width=800');

        printWindow.document.write('<html><head><title>Print Warranty Records</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            .container {
                display: grid;
                grid-template-columns: repeat(3, 1fr); /* Three columns */
                gap: 30px;
            }
            .item {
                box-sizing: border-box;
                border: 1px solid #ddd;
                padding: 10px;
                text-align: center;
                background-color: #f9f9f9;
                border-radius: 5px;
            }
                 .item2 {
                box-sizing: border-box;
                border: 1px solid #ddd;
                padding: 10px;
                text-align: center;
                background-color: #f9f9f9;
                border-radius: 5px;
                margin-top:20px;
            }
            .record img {
                width: 120px;
                height: 120px;
                object-fit: contain;
            }
                
            .text-12 {
                font-size: 10px;
                margin: 4px 0;
            }
            .font-bold {
                font-weight: bold;
            }
            .recordCenter2 {
                 text-align: center;
                  margin-top:40px;
            }
                  .recordCenter {
                 text-align: center;
            }
            @media print {
                .page-break {
                    page-break-before: always;
                }
            }
        `);
        printWindow.document.write('</style></head><body>');

        const records = warranty?.records || [];
        const itemsPerPage = 9; // Three rows * three columns

        for (let i = 0; i < records.length; i += itemsPerPage) {
            printWindow.document.write('<div class="container">');
            for (let j = i; j < i + itemsPerPage && j < records.length; j++) {
                const item = records[j];
                printWindow.document.write(`
                    <div>
                    <div class="item">
                        <div class="record">
                            <div class="text-12">QR Code Warranty Powered by Servsy.in</div>
                            <div class="text-12">${warranty?.productName || 'Product Name'}</div>
                        </div>
                        <div>
                            <img src="${logoUrl}" alt="Company Logo" width="50" height="50" />
                        </div>
                        <div>
                            <img src="${item?.qrCodes?.[0]?.qrCodeUrl || '/placeholder.png'}" alt="QR Code" width="50" height="50" />
                        </div>
                        <div class="text-12">Call or WhatsApp</div>
                        <div class="font-bold text-12">+91 ${brand?.tollfree}</div>
                        <div class="text-12">(10 AM - 6 PM)</div>
                        <div class="text-12">Monday to Saturday</div>
                        <div class="text-12">Be ready with your</div>
                        <div class="text-12">Product Bill & Unique Code No.,</div>
                        <div class="text-12">Address & Pincode</div>
                        <div class="font-bold text-12 recordCenter">Unique Code: ${item?.uniqueId || 'N/A'}</div>
                    </div>
                      <!-- 
                    <div class="item2">
                        
                        
                        <div>
                            <img src="${item?.qrCodes?.[0]?.qrCodeUrl || '/placeholder.png'}" alt="QR Code" width="120" height="120" />
                        </div>
                        
                        <div class="font-bold text-12 recordCenter">Unique Code: ${item?.uniqueId || 'N/A'}</div>
                    </div>
                       -->
                    </div>
                `);
            }
            printWindow.document.write('</div>');

            if (i + itemsPerPage < records.length) {
                printWindow.document.write('<div class="page-break"></div>');
            }
        }

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };


    const print5_11CmRecords1 = () => {
        const logoUrl = brand?.brandLogo || "/Logo.png"; // Dynamically determine the logo URL
        const printWindow = window.open('', '', 'height=600,width=800');

        printWindow.document.write('<html><head><title>Print Warranty Records</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            @page {
                size: 5cm 11cm; /* Set page size */
                margin: 0; /* Remove default margins */
            }
            body {
                font-family: Arial, sans-serif;
                margin: 0; /* Ensure no margins */
                padding: 0; /* Ensure no padding */
                width: 5cm;
                height: 11cm;
                box-sizing: border-box;
            }
            .record-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                border: 1px solid #ddd; /* Optional for preview, remove for cleaner output */
                background-color: #f9f9f9;
                box-sizing: border-box;
            }
            .record img {
                width: 100px;
                height: 100px;
                object-fit: contain;
            }
            .text-12 {
                font-size: 10px;
                margin: 4px 0;
                text-align: center;
            }
            .font-bold {
                font-weight: bold;
            }
            .recordCenter {
                text-align: center;
            }
            .page-break {
                page-break-before: always;
            }
        `);
        printWindow.document.write('</style></head><body>');

        const records = warranty?.records || [];

        records.forEach((item, index) => {
            if (index > 0) {
                printWindow.document.write('<div class="page-break"></div>');
            }
            printWindow.document.write(`
                <div class="record-container">
                    <div class="record">
                        <div class="text-12">QR Code Warranty Powered by Servsy.in</div>
                        <div class="text-12">${warranty?.productName || 'Product Name'}</div>
                        <div>
                            <img src="${logoUrl}" alt="Company Logo" />
                        </div>
                        <div>
                            <img src="${item?.qrCodes?.[0]?.qrCodeUrl || '/placeholder.png'}" alt="QR Code" />
                        </div>
                        <div class="text-12">Call or WhatsApp</div>
                        <div class="font-bold text-12">+91 ${brand?.tollfree}</div>
                        <div class="text-12">(10 AM - 6 PM)</div>
                        <div class="text-12">Monday to Saturday</div>
                        <div class="text-12">Be ready with your</div>
                        <div class="text-12">Product Bill & Unique Code No.,</div>
                        <div class="text-12">Address & Pincode</div>
                        <div class="font-bold text-12 recordCenter">Unique Code: ${item?.uniqueId || 'N/A'}</div>
                    </div>
                </div>
            `);
        });

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };
    const print5_11CmRecords2 = () => {
        const logoUrl = brand?.brandLogo || "/Logo.png"; // Dynamically determine the logo URL
        const printWindow = window.open('', '', 'height=700,width=1100');

        printWindow.document.write('<html><head><title>Print Warranty Records</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
            @page {
                size: 7cm 11cm; /* Set exact page size */
                margin: 0; /* Remove default margins */
            }
            body {
                font-family: Arial, sans-serif;
                margin: 0; /* Ensure no margins */
                padding: 0; /* Ensure no padding */
                width: 7cm;
                height: 11cm;
                box-sizing: border-box;
            }
            .record-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 10px;
                box-sizing: border-box;
            }
            .logo-and-qr {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .logo-and-qr img {
                margin: 10px 0; /* Add spacing between logo and QR code */
            }
            .record img {
                width: 100px;
                height: 100px;
                object-fit: contain;
            }
            .text-12 {
                font-size: 10px;
                margin: 4px 0;
                text-align: center;
            }
            .font-bold {
                font-weight: bold;
            }
            .recordCenter {
                text-align: center;
            }
            .page-break {
                page-break-before: always;
            }
        `);
        printWindow.document.write('</style></head><body>');

        const records = warranty?.records || [];

        records.forEach((item, index) => {
            if (index > 0) {
                printWindow.document.write('<div class="page-break"></div>');
            }
            printWindow.document.write(`
                <div class="record-container">
                    <div class="text-12">QR Code Warranty Powered by Servsy.in</div>
                    <div class="text-12">${warranty?.productName || 'Product Name'}</div>
                    <div class="logo-and-qr">
                        <img src="${logoUrl}" alt="Company Logo" width="50" height="50" />
                        <img src="${item?.qrCodes?.[0]?.qrCodeUrl || '/placeholder.png'}" alt="QR Code" width="100" height="100" />
                    </div>
                    <div class="text-12">Call or WhatsApp</div>
                    <div class="font-bold text-12">+91 ${brand?.tollfree}</div>
                    <div class="text-12">(10 AM - 6 PM)</div>
                    <div class="text-12">Monday to Saturday</div>
                    <div class="text-12">Be ready with your</div>
                    <div class="text-12">Product Bill & Unique Code No.,</div>
                    <div class="text-12">Address & Pincode</div>
                    <div class="font-bold text-12 recordCenter">Unique Code: ${item?.uniqueId || 'N/A'}</div>
                </div>
            `);
        });

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    const print5_11CmRecords = () => {
        const logoUrl = brand?.brandLogo || "/Logo.png"; // Dynamically determine the logo URL
        const printWindow = window.open('', '', 'height=700,width=1100');

        printWindow.document.write('<html><head><title>Print Warranty Records</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
      @page {
    size: 4cm 9cm; /* Exact page size */
    margin: 0; /* Remove all margins */
}

body {
    font-family: Arial, sans-serif;
    margin: 0; /* Remove body margin */
    padding: 3px; /* Remove body padding */
    
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Space out content */
    align-items: center;
    box-sizing: border-box;
}

.record-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Adjust content spacing */
    align-items: center;
    padding: 3px; /* Ensure no padding */
    margin: 0; /* Ensure no margin */
    box-sizing: border-box;
}
.item1 {
 box-sizing: border-box;
                border: 1px solid #ddd;
                padding: 5px;
                text-align: center;
                background-color: #f9f9f9;
                border-radius: 5px;}
.logo-and-qr img {
    width: 1cm; /* Scaled to fit the space */
    height: 1cm;
    object-fit: contain;
    margin-top:3px;
    margin-bottom:3px;
}

.text-12 {
    font-size: 9px; /* Adjusted font size */
      font-weight: bold;
    text-align: center;
}

.font-bold {
    font-weight: bold;
}

.item2 {
 box-sizing: border-box;
                border: 1px solid #ddd;
                padding: 5px;
                text-align: center;
                background-color: #f9f9f9;
                border-radius: 5px;
                margin:5px;
    text-align: center;
    align-items: center;
     
}

.page-break {
    page-break-before: always;
}


        `);
        printWindow.document.write('</style></head><body>');

        const records = filtRecord?.records || [];

        records.forEach((item, index) => {
            if (index > 0) {
                printWindow.document.write('<div class="page-break"></div>');
            }
            printWindow.document.write(`
                <div class="record-container">
                <div class="item1">
                    <div class="text-12">QR Code Warranty Powered by Servsy.in</div>
                    <div class="text-12">${filtRecord?.productName || 'Product Name'}</div>
                    <div class="logo-and-qr">
                        <img src="${logoUrl}" alt="Company Logo" width="40" height="40" />
                        <img src="${item?.qrCodes?.[0]?.qrCodeUrl || '/placeholder.png'}" alt="QR Code" width="40" height="40" />
                        
                    </div>
                     
                    <div class="text-12">Call or WhatsApp</div>
                    <div class="font-bold text-12">+91 ${brand?.tollfree}</div>
                    <div class="text-12">(10 AM - 6 PM)</div>
                    <div class="text-12">Monday to Saturday</div>
                    <div class="text-12">Be ready with your</div>
                    <div class="text-12">Product Bill & Unique Code No.,</div>
                    <div class="text-12">Address & Pincode</div>
                    <div class="font-bold text-12 recordCenter">  ${item?.uniqueId || 'N/A'}</div>
                    </div>
                    <!-- Add item2 section at the bottom -->
                    <div class="item2">
                        <div  >
                            <img src="${item?.qrCodes?.[0]?.qrCodeUrl || '/placeholder.png'}" alt="QR Code" width="100" height="100" />
                        </div>
                        <div class="font-bold text-12 recordCenter">  ${item?.uniqueId || 'N/A'}</div>
                    </div>
                </div>
            `);
        });

        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };



    return (
        <Sidenav>

            {loading === true ?
                <div className='h-[400px] flex justify-center items-center'>
                    <ReactLoader />
                </div>
                :
                <>
                    <div className="  flex items-center mb-4 justify-center bg-gray-100">
                        <div className="bg-white p-6 grid grid-cols-1 md:grid-cols-3 rounded-2xl shadow-md my-4 items-center gap-5 ">
                            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                                Search Warranty QR
                            </h1>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">
                                    Unique ID
                                </label>
                                <input
                                    type="text"
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    value={uniqueId}
                                    onChange={(e) => setUniqueId(e.target.value)}
                                    placeholder="Enter Unique ID"
                                />
                                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                            </div>

                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                            >
                                {loading ? "Searching..." : "Search"}
                            </button>
                        </div>
                    </div>
                    <div className='flex justify-between items-center mb-3'>
                        <div className='font-bold text-2xl'>Warranty Information</div>
                        {/* <div onClick={() => handleEdit(warranty?._id)} className='flex bg-[#0284c7] hover:bg-[#5396b9] hover:text-black rounded-md p-2 cursor-pointer text-white justify-between items-center '>
              <Edit style={{ color: "white" }} />
              <div className=' ml-2 '>Edit Sparepart</div>
            </div> */}
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-5'>
                        <div className='font-bold mt-5'>Brand Name</div>
                        <div>{filtRecord?.brandName ? filtRecord?.brandName : warranty?.brandName}</div>
                        {/* <div className='font-bold'>Part Name</div>
                        <div> 
                        {filtRecord?.productName?filtRecord?.productName:warranty?.productName}
                        </div> */}
                        <div className='font-bold'>Warranty In Days</div>
                        <div>
                            {filtRecord?.warrantyInDays ? filtRecord?.warrantyInDays : warranty?.warrantyInDays}

                        </div>
                        <div className='font-bold'>Year</div>
                        <div>
                            {filtRecord?.year ? filtRecord?.year : warranty?.year}
                        </div>
                        <div className='font-bold'>Created At</div>
                        <div>{new Date(filtRecord?.createdAt ? filtRecord?.createdAt : warranty?.createdAt).toLocaleString()}</div>
                        <div className='font-bold'>Updated At</div>
                        <div>{new Date(filtRecord?.updatedAt ? filtRecord?.updatedAt : warranty?.updatedAt).toLocaleString()}</div>
                    </div>
                    {brand?._id === "67bd89f4ee5adb6d9ee17ce7" ?
                        <button onClick={printA4Records} className='mt-5 p-2 bg-blue-500 text-white rounded'>
                            Print Records 
                            {/* A4 */}
                        </button>
                        : <button onClick={print5_11CmRecords} className='mt-5 p-2 bg-blue-500 text-white rounded'>
                            Print Records
                        </button>
                    }
                    <div className='font-bold mt-5'>Generated QR codes</div>
                    <div className=' grid md:grid-cols-4 sm:grid-cols-1 gap-4'>
                        {filtRecord?.records?.map((item, i) => (
                            <div key={i} className='mt-3 flex justify-center items-center'>
                                <div className=' mb-5 '>
                                    <div className='  mt-3 mb-3 font-bold text-[12px]'>  QR Code warranty is powered by Servsy.in</div>
                                    {/* <div>{warranty?.brandLogo}</div> */}
                                    <div className='flex justify-center items-center'>
                                        <img src={brand?.brandLogo ? brand?.brandLogo : "/Logo.png"} alt="image" width={100} height={100} />
                                    </div>
                                    {/* <div className='font-bold'>Part Name</div>
                                    <div>{warranty?.productName}</div> */}
                                    <div className='font-bold'> </div>
                                    <div className='flex justify-center items-center mt-3'>
                                        <img src={item?.qrCodes[0]?.qrCodeUrl} alt="image" width={80} height={80} />
                                    </div>
                                    <div className='text-[12px]'> Call or Whatsapp</div>
                                    <div className='font-bold text-[12px]'> +91 {brand.tollfree}</div>
                                    <div className='text-[12px]'> (10 AM - 6 PM) </div>
                                    <div className='text-[12px]'> Monday to Saturday </div>
                                    <div className='text-[12px]'> Be ready with your Product Bill & Unique code No. ,Address & Pincode</div>
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
