// import React, { useEffect, useState } from 'react';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// import http_request from '.././../../http-request';
// import ComplaintList from '../components/reports/ComplaintList';
// import DownloadExcel from '../components/DownLoadExcel';

// const BrandReport = (props) => {
//     const [startDate, setStartDate] = useState(null);
//     const [endDate, setEndDate] = useState(null);
//     const [complaints, setComplaints] = useState([]);
//     const [filteredComplaints, setFilteredComplaints] = useState([]);
//     const [selectedStatuses, setSelectedStatuses] = useState([]); // Multi-select status filter
//     // const [product, setProduct] = useState('');
//     // const [location, setLocation] = useState('');

//     const statusOptions = ["PENDING", "PART PENDING", "ASSIGN", "IN PROGRESS", "COMPLETED", "CANCELED", "FINAL VERIFICATION"];

//     useEffect(() => {
//         fetchComplaints();
//     }, []);

//     const fetchComplaints = async () => {
//         try {
//             const response = await http_request.get('/getAllComplaint');
//             const dealerComplaints = props?.userData?.role === "BRAND" ? response?.data?.filter((item) => item?.brandId === props?.userData?._id)
//                 : response?.data?.filter((item) => item?.brandId === props?.userData?.brandId)
//             setComplaints(dealerComplaints);
//             // setFilteredComplaints(dealerComplaints);
//         } catch (error) {
//             console.error('Error fetching complaints:', error);
//         }
//     };

//     // Handle checkbox change for multi-select status
//     const handleStatusChange = (status) => {
//         setSelectedStatuses((prev) =>
//             prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
//         );
//     };
//     // console.log(complaints);

//     const applyFilters = () => {
//         let filtered = complaints;


//         if (startDate && endDate) {
//             filtered = filtered.filter(complaint => {
//                 const complaintDate = new Date(complaint.createdAt);
//                 return complaintDate >= startDate && complaintDate <= endDate;
//             });
//         }

//         if (selectedStatuses.length > 0) {
//             filtered = filtered.filter(complaint => selectedStatuses.includes(complaint.status));
//         }




//         setFilteredComplaints(filtered);
//     };

//     return (
//         <div className="container mx-auto p-2">
//             <h2 className="text-2xl font-semibold mb-2">Complaint Filter and Reports</h2>

//             {/* Filter Options Section */}
//             <div className="flex flex-wrap gap-4 mb-5">
//                 <div className="mt-5">
//                     <label className='pe-5'>Start Date:</label>
//                     <DatePicker
//                         selected={startDate}
//                         onChange={date => setStartDate(date)}
//                         selectsStart
//                         startDate={startDate}
//                         endDate={endDate}
//                         className="block p-3 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-600"
//                         placeholderText="Select start date"
//                     />
//                 </div>

//                 <div className="mt-5">
//                     <label className='pe-5'>End Date:</label>
//                     <DatePicker
//                         selected={endDate}
//                         onChange={date => setEndDate(date)}
//                         selectsEnd
//                         startDate={startDate}
//                         endDate={endDate}
//                         minDate={startDate}
//                         className="block p-3 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-600"
//                         placeholderText="Select end date"
//                     />
//                 </div>

//                 {/* Multi-Select Status Checkboxes */}
//                 <div className="mt-5">
//                     <label className="block font-medium mb-3">Status:</label>
//                     <div className="flex flex-wrap gap-3">
//                         {statusOptions.map((status) => (
//                             <label key={status} className="flex items-center space-x-2">
//                                 <input
//                                     type="checkbox"
//                                     className="rounded border-gray-300 focus:ring-indigo-500"
//                                     checked={selectedStatuses.includes(status)}
//                                     onChange={() => handleStatusChange(status)}
//                                 />
//                                 <span>{status}</span>
//                             </label>
//                         ))}
//                     </div>
//                 </div>

//                 {/* <div className="mt-5">
//                     <label>Product Name:</label>
//                     <input
//                         type="text"
//                         className="block p-3 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-600"
//                         placeholder="Enter product name"
//                         value={product}
//                         onChange={(e) => setProduct(e.target.value)}
//                     />
//                 </div>

//                 <div className="mt-5">
//                     <label>Location:</label>
//                     <input
//                         type="text"
//                         className="block p-3 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-600"
//                         placeholder="Enter location"
//                         value={location}
//                         onChange={(e) => setLocation(e.target.value)}
//                     />
//                 </div> */}
//             </div>

//             <div className="flex">
//                 <button
//                     className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//                     onClick={applyFilters}
//                 >
//                     Apply Filters
//                 </button>
//                 <div className="ml-5">
//                     {filteredComplaints.length > 0 &&
//                         //      <DownloadExcel   data={filteredComplaints} fileName="ComplaintsList" 
//                         // fieldsToInclude={[ 
//                         //   "complaintId",
//                         //   "productBrand",   
//                         //   "categoryName",
//                         //   "subCategoryName",
//                         //  "productName",
//                         //   "modelNo",
//                         //   "warrantyStatus",
//                         //   "userName",
//                         //   "fullName",
//                         //   "phoneNumber",
//                         //   "serviceAddress",
//                         //   "detailedDescription",
//                         //   "status",
//                         //   "state",
//                         //   "district",
//                         //   "pincode",
//                         //   "serialNo",
//                         //   "purchaseDate",
//                         //   "assignServiceCenter", 
//                         //   "paymentBrand",  
//                         //   "updatedAt",
//                         //   "createdAt",
//                         //   ]}
//                         // />  
//                         <DownloadExcel 
//                         data={filteredComplaints.map(complaint => ({
//                           ...complaint,
//                           sndStatus: complaint.updateComments?.map(comment => 
//                             `${comment.changes?.sndStatus || ""} (${comment.updatedAt})`
//                           ).join(", ") || "" ,// Join all statuses with timestamps, separated by a comma
//                           comments: complaint.updateHistory?.map(update => 
//                             update.changes?.comments ? `${update.changes.comments} (${update.updatedAt})` : ""
//                           ).filter(comment => comment !== "").join(" | ") || "" // Concatenate non-empty comments with timestamps
//                         }))} 
//                         fileName="ComplaintsList" 
//                         fieldsToInclude={[ 
//                           "complaintId",
//                           "productBrand",   
//                           "categoryName",
//                           "subCategoryName",
//                           "productName",
//                           "modelNo",
//                           "warrantyStatus",
//                           "userName",
//                           "fullName",
//                           "phoneNumber",
//                           "serviceAddress",
//                           "detailedDescription",
//                           "status",
//                           "state",
//                           "district",
//                           "pincode",
//                           "serialNo",
//                           "purchaseDate",
//                           "assignServiceCenter", 
//                           "paymentBrand",
                        
//                           "updatedAt",
//                           "createdAt",
//                           "sndStatus", // Include concatenated status with timestamps  
//                             "comments",
                         
//                         ]}
//                       />
                      

//                     }
//                 </div>
//             </div>

//             <div className="mt-8">
//                 {filteredComplaints.length > 0 ? (
//                     <ComplaintList data={filteredComplaints} />
//                 ) : (
//                     <p className="text-gray-500">No complaints found based on the selected filters.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BrandReport;

import React, {  useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import http_request from "../../../http-request";
import ComplaintList from "../components/reports/ComplaintList";
import DownloadExcel from "../components/DownLoadExcel";

const BrandReport = (props) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [loading, setLoading] = useState(false);
    
  const statusOptions = [
    "PENDING", "PART PENDING", "ASSIGN", "IN PROGRESS","CUSTOMER SIDE PENDING",
     "FINAL VERIFICATION" ,"COMPLETED","CANCELED"
  ];

 

  const fetchComplaints = async () => {
    try {
        
        setLoading(true)
      // const requestData = {
      //   userData: props?.userData,
      //   startDate: startDate ? startDate.toISOString() : null,
      //   endDate: endDate ? endDate.toISOString() : null,
      //   selectedStatuses
      // };
  // Utility to format date as YYYY-MM-DD (no timezone shift)
    const formatDateWithoutTimezone = (date) => {
      const local = new Date(date);
      const year = local.getFullYear();
      const month = String(local.getMonth() + 1).padStart(2, "0");
      const day = String(local.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const requestData = {
      userData: props?.userData,
      startDate: startDate ? formatDateWithoutTimezone(startDate) : null,
      endDate: endDate ? formatDateWithoutTimezone(endDate) : null,
      selectedStatuses,
    };
      const response = await http_request.post("/getFilteredComplaintsByBrand", requestData);
      setFilteredComplaints(response.data);
      setLoading(false)
    } catch (error) {
        setLoading(false)
      console.error("Error fetching complaints:", error);
    }
  };

  const handleStatusChange = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  return (
    <div className="container mx-auto p-2">
      <h2 className="text-2xl font-semibold mb-2">Complaint Filter and Reports</h2>

      {/* Filter Options */}
      <div className="flex flex-wrap gap-4 mb-5">
        <div className="mt-5">
          <label className="pe-5">Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="block p-3 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            placeholderText="Select start date"
          />
        </div>

        <div className="mt-5">
          <label className="pe-5">End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="block p-3 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-indigo-600"
            placeholderText="Select end date"
          />
        </div>

        {/* Multi-Select Status Checkboxes */}
        <div className="mt-5">
          <label className="block font-medium mb-3">Status:</label>
          <div className="flex flex-wrap gap-3">
            {statusOptions.map((status) => (
              <label key={status} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 focus:ring-indigo-500"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />
                <span>{status}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Filters */}
      <div className="flex justify-between items-center">
        <div>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          onClick={()=>fetchComplaints()}
        >
         {loading?"Filtering.....": "Apply Filters"}
        </button>
        </div>
        <div className="ml-5">
          {filteredComplaints.length > 0 && (
            <DownloadExcel
              data={filteredComplaints.map((complaint) => ({
                ...complaint,
                sndStatus:
                  complaint.updateComments
                    ?.map((comment) => `${comment.changes?.sndStatus || ""} (${comment.updatedAt})`)
                    .join(", ") || "",
                comments:
                  complaint.updateHistory
                    ?.map((update) =>
                      update.changes?.comments
                        ? `${update.changes.comments} (${update.updatedAt})`
                        : ""
                    )
                    .filter((comment) => comment !== "")
                    .join(" | ") || "",
              }))}
              fileName="ComplaintsList"
              fieldsToInclude={[
                "complaintId",
                "productBrand",
                "categoryName",
                "subCategoryName",
                "productName",
                "modelNo",
                "warrantyStatus",
                "userName",
                "fullName",
                "phoneNumber",
                "serviceAddress",
                "detailedDescription",
                "status",
                "state",
                "district",
                "pincode",
                "serialNo",
                "purchaseDate",
                "assignServiceCenter",
                "paymentBrand",
                "updatedAt",
                "createdAt",
                "sndStatus",
                "comments",
              ]}
            />
          )}
        </div>
      </div>

      {/* Complaint List */}
      <div className="mt-8">
        {filteredComplaints.length > 0 ? (
          <ComplaintList data={filteredComplaints} />
        ) : (
          <p className="text-gray-500">No complaints found based on the selected filters.</p>
        )}
      </div>
    </div>
  );
};

export default BrandReport;
