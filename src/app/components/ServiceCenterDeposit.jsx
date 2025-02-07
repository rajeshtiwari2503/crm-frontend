import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import http_request from "../../../http-request"
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { ToastMessage } from "./common/Toastify";
import { Edit } from "@mui/icons-material";

const ServiceCenterDepositForm = ({ userData }) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [editTrue, setEditTrue] = useState(false);
    const [depositId, setDepositId] = useState(null);
    const [adminData, setAdminData] = useState(null);
    const [depositData, setDepositData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {
        const storedValue = localStorage.getItem("user");
        if (storedValue) {
            setAdminData(JSON.parse(storedValue));
        }
        getServiceCenterAllDeposit();
        if (userData) {
            setValue("serviceCenterId", userData?._id)
            setValue("serviceCenterName", userData?.serviceCenterName)
        }
    }, [userData, refresh]);

    const getServiceCenterAllDeposit = async () => {
        try {

            const response = await http_request.get(`/getServiceCenterAllDeposit/${userData?._id}`);
            const { data } = response;
            // setDepositId(data)
            setDepositData(data);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    };



    const onSubmit = async (req) => {

        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(req).forEach((key) => formData.append(key, req[key]));
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const response = depositId ?
                await http_request.patch(`/editServiceCenterDeposit/${userData?._id}`, formData)
                : await http_request.post(`/addServiceCenterDeposit`, formData)
            const { data } = response
            setRefresh(data)
            setOpen(false);
            setLoading(false);
            ToastMessage(data)
        } catch (error) {
            console.error("Error saving deposit", error);
            setLoading(false);
        }

    };

    const handleEdit = (item) => {
        setEditTrue(true)
        setDepositId(item?._id)
        setValue("serviceCenterId", item?._id)
        setValue("serviceCenterName", item?.serviceCenterName)
        setValue("payAmount", item?.payAmount)
        setValue("paymentType", item?.paymentType)
        setValue("paymentDate", item?.paymentDate)
        setValue("image", item?.image)
    }
    const totalPayAmount = depositData?.reduce((total, deposit) => total + deposit.payAmount, 0);
    console.log(depositData);

    return (
        <><div className="p-5 bg-white shadow-md rounded-lg" >
            <div className="flex justify-between items-center">
                <div>

                    <p className="text-lg font-medium">Total Pay Amount: <span className="font-bold p-2 bg-slate-400 rounded-md">{totalPayAmount}</span></p>
                </div>
                <div>
                    {adminData?.user?.role === "ADMIN" ?
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            onClick={() => setOpen(true)}

                        >

                            {editTrue ? "Edit Deposit" : "Add Deposit"}
                        </button>
                        : ""
                    }
                </div>
            </div>

            <div className="overflow-x-auto ">
                <table className="min-w-full mt-10 table-auto text-xs">
                    {depositData?.length > 0 && <thead className="bg-gray-100">
                        <tr>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700">Service Center</th>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700">Payment Type</th>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700">Amount</th>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700">Payment Date</th>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700">Image</th>
                            <th className="px-2 py-2 text-left font-semibold text-gray-700">Action</th>
                        </tr>
                    </thead>
                    }
                    <tbody>
                        {depositData?.map((item, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="px-2 py-2 text-xs text-gray-600">{item?.serviceCenterName}</td>
                                <td className="px-2 py-2 text-xs text-gray-600">{item?.paymentType}</td>
                                <td className="px-2 py-2 text-xs text-gray-600">{item?.payAmount}</td>
                                <td className="px-2 py-2 text-xs text-gray-600">{item?.paymentDate}</td>
                                <td className="px-2 py-2 text-xs">
                                    <a href={item?.image} target="_blank" rel="noopener noreferrer">
                                        <img
                                            src={item?.image}
                                            alt="Payment receipt"
                                            className="w-16 h-16 object-cover rounded cursor-pointer"
                                        />
                                    </a>
                                </td>
                                <td className="px-2 py-2 text-xs text-gray-600">
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
                                    >
                                        <Edit />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96">
                    <Typography variant="h6" gutterBottom>
                        {depositId ? "Edit Deposit" : "Add Deposit"}
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <TextField
                            fullWidth
                            label="Service Center ID"
                            {...register("serviceCenterId", { required: "Service Center ID is required" })}
                            error={!!errors.userId}
                            helperText={errors.userId?.message}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Service Center Name"
                            {...register("serviceCenterName", { required: "Service Center Name is required" })}
                            error={!!errors.userName}
                            helperText={errors.userName?.message}
                            InputProps={{
                                readOnly: true
                            }}
                        />

                        <TextField fullWidth type="number" label="Payment Amount" {...register("payAmount", { required: "Payment Amount is required" })} error={!!errors.payAmount} helperText={errors.payAmount?.message} />
                        <TextField fullWidth label="Payment Type" {...register("paymentType", { required: "Payment Type is required" })} error={!!errors.paymentType} helperText={errors.paymentType?.message} />
                        <TextField fullWidth type="date" {...register("paymentDate", { required: "Payment Date is required" })} error={!!errors.paymentDate} helperText={errors.paymentDate?.message} />
                        <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 text-white rounded-md transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Submit"}
                        </button>
                    </form>
                </Box>
            </Modal>
        </div>
        </>
    );
};

export default ServiceCenterDepositForm;
