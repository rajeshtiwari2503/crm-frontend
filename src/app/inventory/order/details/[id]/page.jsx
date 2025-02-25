 "use client";
import Sidenav from '@/app/components/Sidenav';
import React, { useEffect, useState } from 'react';
import http_request from "../../../../../../http-request";
import { useRouter } from 'next/navigation';
import { Edit } from '@mui/icons-material';
import { ReactLoader } from '@/app/components/common/Loading';

const OrderDetails = ({ params }) => {
  const router = useRouter();
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    GetOrder();
  }, []);

  const GetOrder = async () => {
    try {
      let response = await http_request.get(`/getOrderById/${params?.id}`);
      let { data } = response;
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    router.push(`/product/Order/edit/${id}`);
  };

  return (
    <Sidenav>
      {!orders ? (
        <div className="h-[400px] flex justify-center items-center">
          <ReactLoader />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-3">
            <div className="font-bold text-2xl">Order Information</div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center gap-2"
              onClick={() => handleEdit(params?.id)}
            >
              <Edit fontSize="small" /> Edit Order
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {/* Order Details */}
            <div className="font-bold">Docket Number</div>
            <div>{orders?.docketNo || "N/A"}</div>
            <div className="font-bold">Tracking Link</div>
            <div>
              {orders?.trackLink ? (
                <a href={orders.trackLink} target="_blank" className="text-blue-500 underline">
                  Track Order
                </a>
              ) : (
                "N/A"
              )}
            </div>
            <div className="font-bold">Brand Name</div>
            <div>{orders?.brandName}</div>
            <div className="font-bold">Service Center</div>
            <div>{orders?.serviceCenter}</div>
            <div className="font-bold">Brand Approval</div>
            <div>{orders?.brandApproval}</div>
            <div className="font-bold">Order Status</div>
            <div>{orders?.status}</div>
            <div className="font-bold">Order Date</div>
            <div>{new Date(orders?.orderDate).toLocaleString()}</div>
            <div className="font-bold">Created At</div>
            <div>{new Date(orders?.createdAt).toLocaleString()}</div>
            <div className="font-bold">Updated At</div>
            <div>{new Date(orders?.updatedAt).toLocaleString()}</div>

            {/* Chalan Image */}
           
          </div>

          {/* Spare Parts Section */}
          {orders?.spareParts?.length > 0 && (
            <>
              <h2 className="font-bold text-xl mt-5">Spare Parts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div className="font-bold">Spare Part Name</div>
                <div className="font-bold">Quantity</div>
                <div className="font-bold">Price</div>
                <div className="font-bold">Total Price</div>

                {orders.spareParts.map((part) => (
                  <React.Fragment key={part.sparePartId}>
                    <div>{part.sparePartName}</div>
                    <div>{part.quantity}</div>
                    <div>${part.price}</div>
                    <div>${(part.quantity * part.price).toFixed(2)}</div>
                  </React.Fragment>
                ))}
              </div>
            </>
          )}
          <div>
          {orders?.chalanImage && (
              <>
                <div className="font-bold m-10 w-full ">Chalan Image</div>
                <div className=" w-full">
                  <img
                    src={orders.chalanImage}
                    alt="Chalan"
                    className="w-full   border rounded-md shadow-sm"
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}
    </Sidenav>
  );
};

export default OrderDetails;
