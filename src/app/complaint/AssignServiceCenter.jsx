import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useForm } from "react-hook-form";
import { ReactLoader } from "../components/common/Loading";
import { AssignmentTurnedIn } from "@mui/icons-material";
import http_request from '../../../http-request';
import { useUser } from "../components/UserContext";
import { Toaster } from "react-hot-toast";

const AssignServiceCenterModal = ({
    complaint, RefreshData
}) => {
    const { user } = useUser()
    const userData = user?.user

    const { handleSubmit, setValue, getValues, reset } = useForm();

    // State variables
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(null);
    const [filterSer, setFilterSer] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [selectedDashboardDetails, setSelectedDashboardDetails] = useState(null);
    const [open, setOpen] = useState(false);
    const [serviceCenterData, setServiceCenter] = useState([])
    const [serviceLoading, setServiceLoading] = useState(true);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        reset();
    };

   useEffect(() => {
  if (open && complaint?._id) {
    getAllServiceCenter();
  }
}, [open, complaint?._id]);

useEffect(() => {
  if (open && complaint?._id && serviceCenterData.length > 0) {
    getServiceCenterData();
  }
}, [open, complaint?._id, serviceCenterData]);



    const getAllServiceCenter = async () => {
        try {
            setServiceLoading(true);
            let response = await http_request.get("/getAllServiceCenterAction");
            let { data } = response;
            setServiceCenter(data);
        } catch (err) {
            console.log(err);
        } finally {
            setServiceLoading(false);
        }
    };

    const handleAssignServiceCenter = async (id) => {
        setId(id);
        setOpen(true);

    };
    const getServiceCenterData = async () => {
        setId(id);
        // setOpen(true);
        setLoading(true);
        //  console.log("id",id);
        // const complaint = complaint?.find(item => item?._id === id);

        if (!complaint || !complaint.pincode) {
            console.log("Pincode not found in the complaint");
            setLoading(false);
            return;
        }

        const targetPincode = complaint.pincode.trim();
        //  console.log("targetPincode",targetPincode);
        const filteredCenters = serviceCenterData?.filter(center => {
            const supportedPincodes = [
                ...(Array.isArray(center.pincodeSupported) ? center.pincodeSupported : []),
                ...(typeof center.postalCode === 'string'
                    ? center.postalCode.split(',').map(p => p.trim())
                    : [])
            ];
            return supportedPincodes.includes(targetPincode);
        }) || [];
        //   console.log("filteredCenters",filteredCenters);

        const centersWithDetails = await Promise.all(
            filteredCenters.map(async (center) => {
                const [dashboardRes, tatRes] = await Promise.all([
                    http_request.get(`/dashboardDetailsBySeviceCenterId/${center._id}`),
                    http_request.get(`/getAllTatByServiceCenter?assignServiceCenterId=${center._id}`)
                ]);
                // console.log("TAT Response for center:", center.serviceCenterName, tatRes.data);
                return {
                    ...center,
                    dashboardDetails: dashboardRes.data.complaints || {},
                    tatMetrics: {
                        totalComplaints: tatRes?.data?.totalComplaints || 0,
                        overallTATPercentage: tatRes?.data?.overallTATPercentage || "0.00",
                        overallRTPercentage: tatRes?.data?.overallRTPercentage || "0.00",
                        overallCTPercentage: tatRes?.data?.overallCTPercentage || "0.00",
                    }
                };
            })
        );
        // console.log("centersWithDetails", centersWithDetails);

        setFilterSer(centersWithDetails);
        setLoading(false);

        if (centersWithDetails.length === 0) {
            console.log("No service centers found for the given pincode.");
        }
    };
    const handleServiceChange = (event) => {


        const selectedId = event.target.value;

        // console.log("selectedId",selectedId);

        const selectedCenter = filterSer.find(c => c._id === selectedId);
        if (selectedCenter) {
            // console.log("selectedCenter", selectedCenter);

            setSelectedDashboardDetails(selectedCenter);
        } else {
            setSelectedDashboardDetails(null);
        }
        const selectedServiceCenter = serviceCenter.find(center => center._id === selectedId);
        setSelectedService(selectedId);

        // if (selectedServiceCenter?.serviceCenterType  === "Independent") {
        setValue('status', "ASSIGN");
        // } 

        setValue('assignServiceCenterId', selectedServiceCenter?._id);
        setValue('assignServiceCenter', selectedServiceCenter?.serviceCenterName);
        setValue('serviceCenterContact', selectedServiceCenter?.contact);
        setValue('assignServiceCenterTime', new Date());

    };

    const asignCenter = async () => {
        try {
            const data = getValues();
            setLoading(true);

            const reqdata = { empId: userData._id, empName: userData.name, status: data?.status, assignServiceCenterId: data?.assignServiceCenterId, serviceCenterContact: data?.serviceCenterContact, assignServiceCenter: data?.assignServiceCenter, assignServiceCenterTime: data?.assignServiceCenterTime }
            console.log(reqdata);

            let response = await http_request.patch(`/editComplaint/${id}`, reqdata);

            let { data: responseData } = response;

            setOpen(false)

            RefreshData(responseData)
            ToastMessage(responseData);
            setLoading(false);
            setSelectedService("")
            reset()
        } catch (err) {
            setLoading(false);

            console.log(err);
        }
    };

    const serviceCenter = filterSer === "" ? serviceCenterData : filterSer

    // console.log("serviceCenter",serviceCenter);
    // console.log("filterSer",filterSer);
    // console.log("filterSer",filterSer);

    return (
        <div>
            <Toaster />
            <div

                onClick={() => handleAssignServiceCenter(complaint?._id)}
                className="rounded-md p-2 cursor-pointer bg-[#09090b] border border-gray-500 text-white hover:bg-[#ffffff] hover:text-black"
            >
                <AssignmentTurnedIn />

            </div>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Assign Service Center</DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>

                <DialogContent>
                    <form onSubmit={handleSubmit(asignCenter)}>
                        {(loading || serviceLoading) ? (
                            <div className="flex items-center justify-center">
                                <ReactLoader />
                            </div>
                        ) : filterSer?.length > 0 ? (
                            <>
                                {/* Service center select */}
                                <div className="flex justify-between gap-4 items-center mb-6">
                                    <div className="w-full md:w-[600px]">
                                        <label
                                            htmlFor="service-center-label"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Assign Service Center
                                        </label>

                                        <select
                                            id="service-center-label"
                                            value={selectedService}
                                            onChange={handleServiceChange}
                                            className="block w-full mt-1 p-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="" disabled>
                                                Select Service Center
                                            </option>
                                            {serviceCenter?.map((center) => (
                                                <option key={center._id} value={center._id}>
                                                    {center.serviceCenterName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div >
                                        <button
                                            type="submit"
                                            disabled={loading || !selectedService}
                                            className="rounded-lg px-5 py-3 mt-5 border border-gray-500 bg-[#09090b] text-white hover:bg-white hover:text-black hover:border-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Assign
                                        </button>
                                    </div>
                                </div>

                                {/* Dashboard Summary */}
                                {selectedDashboardDetails && (
                                    <div className="space-y-6">
                                        {/* TAT Performance Summary */}
                                        <div className="p-4 bg-white rounded-xl shadow text-gray-800">
                                            <h3 className="text-lg font-bold mb-2 text-gray-900">
                                                TAT Performance Summary
                                            </h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                                                {[
                                                    {
                                                        label: "TAT %",
                                                        key: "overallTATPercentage",
                                                        color: "bg-blue-100",
                                                    },
                                                    {
                                                        label: "RT %",
                                                        key: "overallRTPercentage",
                                                        color: "bg-green-100",
                                                    },
                                                    {
                                                        label: "CT %",
                                                        key: "overallCTPercentage",
                                                        color: "bg-purple-100",
                                                    },
                                                ].map((item) => (
                                                    <div
                                                        key={item.key}
                                                        className={`${item.color} p-3 rounded-lg text-center`}
                                                    >
                                                        <div className="text-sm font-medium text-gray-700">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-md font-semibold text-gray-900">
                                                            {selectedDashboardDetails.tatMetrics?.[item.key] ??
                                                                "0.00"}
                                                            %
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Service Center Dashboard Summary */}
                                        <div className="p-4 bg-white rounded-xl shadow text-gray-800">
                                            <h3 className="text-lg font-bold mb-3 text-gray-900">
                                                Service Center Dashboard Summary
                                            </h3>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
                                                {[
                                                    { label: "Total Complaints", key: "allComplaints", color: "bg-gray-100" },
                                                    { label: "Pending", key: "pending", color: "bg-yellow-100" },
                                                    { label: "Assigned", key: "assign", color: "bg-blue-100" },
                                                    { label: "In Progress", key: "inProgress", color: "bg-purple-100" },
                                                    { label: "Part Pending", key: "partPending", color: "bg-orange-100" },
                                                    { label: "More Than 5 Days", key: "moreThanFiveDays", color: "bg-red-200" },
                                                    { label: "2–5 Days", key: "twoToFiveDays", color: "bg-orange-100" },
                                                    { label: "0–1 Days", key: "zeroToOneDays", color: "bg-orange-50" },
                                                    { label: "Customer Side Pending", key: "customerSidePending", color: "bg-cyan-100" },
                                                    { label: "Scheduled", key: "schedule", color: "bg-teal-100" },
                                                    { label: "Upcoming Schedule", key: "scheduleUpcomming", color: "bg-teal-200" },
                                                    { label: "Cancelled", key: "cancel", color: "bg-red-100" },
                                                    { label: "Completed", key: "complete", color: "bg-green-100" },
                                                ].map((item) => (
                                                    <div
                                                        key={item.key}
                                                        className={`${item.color} p-3 rounded-lg text-center`}
                                                    >
                                                        <div className="text-sm font-medium text-gray-700">
                                                            {item.label}
                                                        </div>
                                                        <div className="text-md font-semibold text-gray-900">
                                                            {selectedDashboardDetails.dashboardDetails?.[item.key] ?? 0}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-center text-red-500 text-lg font-bold my-6">
                                No service centers found for this complaint’s pincode.
                            </p>
                        )}
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AssignServiceCenterModal;
