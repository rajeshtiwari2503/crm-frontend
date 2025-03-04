import { ToastMessage } from '@/app/components/common/Toastify';
import React, { useState } from 'react';
import http_request from '../../../http-request'
import { useForm } from 'react-hook-form';
import axios from 'axios';

const RechargeForm = ({ userData, brandData, existingRecharge, RefreshData, onClose }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loadind, setLoading] = useState(false)
  // console.log(brandData);

  const AddRecharge = async (data) => {

    try {
      setLoading(true);
      const endpoint = existingRecharge?._id ? `/editProductWarranty/${existingRecharge._id}` : '/addRecharge';
      const reqData = {
        amount: data?.amount,
        brandName: brandData ? brandData?.brandName : userData?.brandName,
        brandId: brandData ? brandData?._id : userData?._id,
        description: "Recharge Added "
      };

      const response = existingRecharge?._id ? await http_request.patch(endpoint, data) : await http_request.post(endpoint, reqData);
      const { data: responseData } = response;
      ToastMessage(responseData);
      setLoading(false);
      RefreshData(responseData);
      onClose(true);
    } catch (err) {
      setLoading(false);
      ToastMessage(err?._message);
      // onClose(true);
      console.log(err);
    }
  };
  const AddBrandRecharge = async (data) => {
    try {
      setLoading(true);
      const endpoint = "/addRechargeByBrand";
      const formData = new FormData();
  
      // GST Calculation (Assuming 18%)
      const gstPercentage = 18;
      const gstAmount = (data?.amount * gstPercentage) / 100;
      const amountWithoutGST = data?.amount - gstAmount;
  
      // Description with amount & GST details
      const description = `Recharge Added | Amount Total :₹${data?.amount} , Add in wallet Amount : ₹${amountWithoutGST.toFixed(2)}, GST: ₹${gstAmount.toFixed(2)}`;
  
      // Append data to FormData
      formData.append("amount", amountWithoutGST.toFixed(2)); // Store amount after GST deduction
      formData.append("gstAmount", gstAmount.toFixed(2)); // Store GST separately
      formData.append("brandName", brandData ? brandData?.brandName : userData?.brandName);
      formData.append("brandId", brandData ? brandData?._id : userData?._id);
      formData.append("description", description); // Store updated description
  
      // Append file (payment screenshot)
      if (data?.paymentImage?.[0]) {
        formData.append("paymentImage", data.paymentImage[0]);
      }
  // console.log("amountWithoutGST",amountWithoutGST);
  // console.log("gstAmount",gstAmount);
  // console.log("description",description);
  
  
      const response = await http_request.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const { data: responseData } = response;
      ToastMessage(responseData);
      setLoading(false);
      RefreshData(responseData);
      onClose(true);
    } catch (err) {
      setLoading(false);
      ToastMessage(err?._message);
      console.log(err);
    }
  };
  
  

  const onSubmit = (data) => {
    if (userData?.role === "BRAND") {
      // brandPayment(data)
      AddBrandRecharge(data)
    } else {
      AddRecharge(data)
    }

    // console.log(data);


  };

  const brandPayment = async (row) => {
    try {
      const userInfo = localStorage.getItem("user");
      const userDataReq = JSON.parse(userInfo)
      const userD = userDataReq?.user?._id
      let response = await http_request.post("/payment", { amount: +(row?.amount) });
      let { data } = response;
      const options = {
        key: "rzp_live_4uXy7FSuag8Sap", // Enter the Key ID generated from the Dashboard
        amount: +amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Servsy", //your business name
        description: "Payment for order",
        image: "/Logo.png",
        order_id: data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (orderDetails) {
          try {
            const amount = +(row?.amount)

            let response = await axios.post("https://lybleycrmserver-production.up.railway.app/paymentVerificationForBrand", { response: orderDetails, userD, amount });
            let { data } = response;
            if (data?.status === true) {
              ToastMessage(data)

              RefreshData(data);
              onClose(true);
            }

          } catch (err) {
            console.log(err);
          }
        },
        prefill: {
          name: userDataReq?.user?.brandName, //your customer's name
          email: userDataReq?.user?.email,
          contact: userDataReq?.user?.contactPersonPhoneNumber
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          color: "#3399cc"
        }
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      console.log(err);
    }
  }


  return (
    // <div className="max-w-4xl mx-auto">
    //     <form onSubmit={handleSubmit(onSubmit)} className="">
    //         <div className="grid grid-cols-1   gap-4">

    //             <div>
    //                 <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
    //                 <input
    //                     id="amount"
    //                     type="number"
    //                     {...register('amount', { required: 'Amount is required' })}
    //                     className={`mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.amount ? 'border-red-500' : ''}`}
    //                 />
    //                 {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
    //             </div>
    //             {/* <div>
    //                 <label htmlFor="firstTen" className="block text-sm font-medium text-gray-700">1 - 10 KM</label>
    //                 <input
    //                     id="firstTen"
    //                     type="text"
    //                     {...register('firstTen', { required: 'First Ten is required' })}
    //                     className={`mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.firstTen ? 'border-red-500' : ''}`}
    //                 />
    //                 {errors.firstTen && <p className="text-red-500 text-sm">{errors.firstTen.message}</p>}
    //             </div>
    //             <div>
    //                 <label htmlFor="afterTen" className="block text-sm font-medium text-gray-700">10 - 100 KM</label>
    //                 <input
    //                     id="afterTen"
    //                     type="text"
    //                     {...register('afterTen', { required: 'After Ten is required' })}
    //                     className={`mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.afterTen ? 'border-red-500' : ''}`}
    //                 />
    //                 {errors.afterTen && <p className="text-red-500 text-sm">{errors.afterTen.message}</p>}
    //             </div>  */}

    //         </div>

    //         <div className="mt-4">
    //             <button type="submit" disabled={loadind}className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
    //                 Submit
    //             </button>
    //         </div>
    //     </form>
    // </div>
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="grid grid-cols-1 gap-2">


          {/* UPI Payment Section */}
          <div className=" ">
            {/* <p className="text-lg font-semibold text-gray-700">Scan & Pay via UPI</p> */}

            {/* QR Code Image */}
            <div className="flex justify-center items-center  ">
              <img
                src="/qrImageServsy.jpeg"
                alt="QR Code"
                className="w-[50%] h-[50%] rounded-lg shadow-xl border-4 border-gray-300 bg-white p-2"
              />
            </div>


            {/* UPI ID */}
            <p className="mt-2 text-center text-gray-700 font-medium">
              UPI ID: <span className="text-indigo-600 font-bold">9953889657@ybl</span>
            </p>
          </div>
          {/* Amount Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount</label>
            <input
              id="amount"
              type="number"
              {...register('amount', { required: 'Amount is required' })}
              className={`mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${errors.amount ? 'border-red-500' : ''}`}
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>
          {/* Payment Image Upload Field */}
          <div>
            <label htmlFor="paymentImage" className="block text-sm font-medium text-gray-700">Upload Payment Screenshot</label>
            <input
              id="paymentImage"
              type="file"
              accept="image/*"
              {...register('paymentImage', { required: 'Payment screenshot is required' })}
              className="mt-1 block w-[300px] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {errors.paymentImage && <p className="text-red-500 text-sm">{errors.paymentImage.message}</p>}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-4">
          <button type="submit" disabled={loadind} className="px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
            {loadind?"Submiting....": "Submit"}
          </button>
        </div>
      </form>
    </div>

  );
};

export default RechargeForm;
