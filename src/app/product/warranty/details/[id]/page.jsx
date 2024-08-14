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

    useEffect(() => {
        getWarranty()

    }, []);

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

    const handleEdit = (id) => {
        router.push(`/product/sparepart/edit/${id}`)
    }

    const printRecords = () => {
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Print Warranty Records</title>');
        printWindow.document.write('<style>');
        printWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
        printWindow.document.write('.record { margin-bottom: 20px; }');
        printWindow.document.write('.record img { width: 200px; height: 200px; }');
        printWindow.document.write('.container { display: flex; flex-wrap: wrap; gap: 20px; }');
        printWindow.document.write('.item { flex: 1 1 calc(33.333% - 20px); box-sizing: border-box;margin-top: 45px; }');
        printWindow.document.write('@media print { .page-break { page-break-before: always; } }');
        printWindow.document.write('</style></head><body>');
    
        // printWindow.document.write('<h1>Warranty Information</h1>');
        // printWindow.document.write('<div><strong>Brand Name:</strong> ' + warranty?.brandName + '</div>');
        // printWindow.document.write('<div><strong>Part Name:</strong> ' + warranty?.productName + '</div>');
        // printWindow.document.write('<div><strong>Warranty In Days:</strong> ' + warranty?.warrantyInDays + '</div>');
        // printWindow.document.write('<div><strong>Year:</strong> ' + warranty?.year + '</div>');
        // printWindow.document.write('<div><strong>Created At:</strong> ' + new Date(warranty?.createdAt).toLocaleString() + '</div>');
        // printWindow.document.write('<div><strong>Updated At:</strong> ' + new Date(warranty?.updatedAt).toLocaleString() + '</div>');
    
        printWindow.document.write('<h2>Generated QR Codes</h2>');
        let records = warranty?.records || [];
        let rowsPerPage = 3;
        let itemsPerRow = 3;
        
        for (let i = 0; i < records.length; i += rowsPerPage * itemsPerRow) {
            printWindow.document.write('<div class="container">');
            for (let j = i; j < i + rowsPerPage * itemsPerRow && j < records.length; j++) {
                let item = records[j];
                printWindow.document.write('<div class="item">');
                printWindow.document.write('<div class="record"><strong>QR Code ' + (j + 1) + ':</strong></div>');
                printWindow.document.write('<div><strong>Brand Name:</strong> ' + warranty?.brandName + '</div>');
                printWindow.document.write('<div><strong>Part Name:</strong> ' + warranty?.productName + '</div>');
                printWindow.document.write('<img src="' + item?.qrCodes[0]?.qrCodeUrl + '" alt="QR Code" />');
                printWindow.document.write('<div><strong>Warranty In Days:</strong> ' + warranty?.warrantyInDays + '</div>');
                printWindow.document.write('<div><strong>Year:</strong> ' + warranty?.year + '</div>');
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
                    <div className=' grid md:grid-cols-3 sm:grid-cols-1 gap-4'>
                        {warranty?.records?.map((item, i) => (
                            <div key={i} className='mt-3 flex justify-center items-center'>
                                <div className=' mb-5 text-center'>
                                    <div className='font-bold mt-5'>Brand Name</div>
                                    <div>{warranty?.brandName}</div>
                                    <div className='font-bold'>Part Name</div>
                                    <div>{warranty?.productName}</div>
                                    <div className='font-bold'>QR Code</div>
                                    <div>
                                        <img src={item?.qrCodes[0]?.qrCodeUrl} alt="image" width={200} height={200} />
                                    </div>
                                    <div className='font-bold'>Warranty In Days</div>
                                    <div>{warranty?.warrantyInDays}</div>
                                    <div className='font-bold'>Year</div>
                                    <div>{warranty?.year}</div>
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
