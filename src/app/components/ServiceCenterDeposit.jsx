import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import http_request from "../../../http-request"
import { Modal, Box, TextField, Button, Typography } from "@mui/material";
import { ToastMessage } from "./common/Toastify";

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
    const [depositId, setDepositId] = useState(null);
    const [depositData, setDepositData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [refresh, setRefresh] = useState(false);


    useEffect(() => {

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
            setDepositId(data)
            setDepositData(data);
        } catch (err) {
            console.error('Failed to fetch user data:', err);
        }
    };

    console.log("depo", depositData);

    const onSubmit = async (req) => {

        try {
            setLoading(true);
            const formData = new FormData();
            Object.keys(req).forEach((key) => formData.append(key, req[key]));
            if (selectedImage) {
                formData.append("image", selectedImage);
            }

            const response = depositId ?
                await http_request.post(`/editServiceCenterDeposit/${userData?._id}`, formData)
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
    const totalPayAmount = depositData?.reduce((total, deposit) => total + deposit.payAmount, 0);
    return (
        <><div className="mt-5" >
            <div className="flex justify-between items-center">  
                <div>
                   
                    <p className="text-lg font-medium">Total Pay Amount: {totalPayAmount}</p>
                </div>
                <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpen(true)}
                      
                >
                   
                    {depositId ? "Edit Deposit" : "Add Deposit"}
                </Button>
                </div>
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
                        <Button type="submit" fullWidth variant="contained" color="primary" disabled={loading}>
                            {loading ? "Saving..." : "Submit"}
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
        </>
    );
};

export default ServiceCenterDepositForm;
