import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import http_request from '.././../../http-request';
import ComplaintList from '../components/reports/ComplaintList';
import DownloadExcel from '../components/DownLoadExcel';


const Report = (props) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [reportType, setReportType] = useState('Complaints Registered');
    const [complaints, setComplaints] = useState([]);
    const [filteredComplaints, setFilteredComplaints] = useState([]);

    useEffect(() => {
        fetchComplaints();
    }, []);

    const fetchComplaints = async () => {
        try {
            const response = await http_request.get('/getAllComplaint');
            setComplaints(response.data);
            const filterIdData = response?.data?.map((item) = item?.dealerId === props?.userData?._id)
            console.log(filterIdData);
            setFilteredComplaints(filterIdData); // Initialize filtered complaints with all complaints
        } catch (error) {
            console.error('Error fetching complaints:', error);
        }
    };

    const applyFilters = () => {
        let filtered = complaints;

        // Filter by date range
        if (startDate && endDate) {
            filtered = filtered.filter(complaint => {
                const complaintDate = new Date(complaint.createdAt);
                return complaintDate >= startDate && complaintDate <= endDate;
            });
        }



        setFilteredComplaints(filtered);
    };

    const handleGenerateReport = () => {
        applyFilters();

    };

    return (
        <div className="container mx-auto p-2">
            <h2 className="text-2xl font-semibold mb-2">Complaint Filter and Reports</h2>

            {/* Date picker for selecting start and end dates */}
            <div className="flex">
                <div className="mt-5 mb-8">
                    <label>Start Date:</label>
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                        placeholderText="Select start date"
                    />
                </div>

                <div className="mb-8 mt-5 ms-5">
                    <label>End Date:</label>
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        className="block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"

                        minDate={startDate}
                        placeholderText="Select end date"
                    />
                </div>
            </div>

            <div className='flex'>
                <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    onClick={handleGenerateReport}
                >
                    Generate Report
                </button>
                <div className='ms-5'>
                    {filteredComplaints?.length > 0 ? <DownloadExcel data={filteredComplaints} fileName="ComplaintsList" /> : ""}
                </div>
            </div>
            {/* Display filtered complaints or report data */}
            <div className='mt-8'>
                {/* <h3>Filtered Complaints:</h3> */}
                {filteredComplaints?.length > 0 ?
                    <ComplaintList data={filteredComplaints} />
                    : ""}
            </div>
        </div>
    );
};

export default Report;
