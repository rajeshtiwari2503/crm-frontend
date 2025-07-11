// components/WalletPaymentSummary.jsx
import React, { useState, useEffect } from 'react';

import http_request from "../../../http-request"
import { ReactLoader } from '../components/common/Loading';
import DownloadExcel from '../components/DownLoadExcel';

const WalletPaymentSummary = ({ user }) => {
  const [summary, setSummary] = useState([]);
  const [tatReport, setTatReport] = useState({});
  // const [month, setMonth] = useState('06');
  // const [year, setYear] = useState('2025');
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, '0')); // '07' for July
  const [year, setYear] = useState(String(currentDate.getFullYear())); // '2025'

  const [sortBy, setSortBy] = useState('high');
  const [loading, setLoading] = useState(false);
  const [serviceCenterSearch, setServiceCenterSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await http_request.get(
        `/wallet-payment-summary?month=${month}&year=${year}&sortBy=${sortBy}`
      );
      const allSummaries = res.data.summary;
      const matched = user?.user?.role === "ADMIN" || user?.user?.role === "EMPLOYEE" ? allSummaries : allSummaries.filter(
        (center) => center._id === user?.user?._id
      );

      setSummary(matched);
      setTatReport(res.data.tatReport);
    } catch (err) {
      console.error("API error", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [month, year, sortBy]);

  // const totalSummary = summary.reduce(
  //   (acc, item) => {
  //     acc.totalAmount += item.totalAmount;
  //     acc.totalUnpaid += item.unpaidCount;
  //     acc.totalPaid += item.paidCount;
  //     acc.totalComplaints += item.totalComplaints;
  //     acc.totalServiceCenters += 1;
  //     return acc;
  //   },
  //   {
  //     totalAmount: 0,
  //     totalUnpaid: 0,
  //     totalPaid: 0,
  //     totalComplaints: 0,
  //     totalServiceCenters: 0
  //   }
  // );

  const totalSummary = summary.reduce(
    (acc, item) => {
      acc.totalAmount += Number(item.totalAmount) || 0;
      acc.totalUnpaid += Number(item.unpaidCount) || 0;
      acc.totalPaid += Number(item.paidCount) || 0;
      acc.totalComplaints += Number(item.totalComplaints) || 0;
      acc.totalServiceCenters += 1;
      return acc;
    },
    {
      totalAmount: 0,
      totalUnpaid: 0,
      totalPaid: 0,
      totalComplaints: 0,
      totalServiceCenters: 0
    }
  );

  // const totalSummary1 = summary.reduce(
  //   (acc, item) => {
  //     acc.totalServiceCenters++;
  //     acc.totalAmount += item.totalAmount;
  //     acc.totalComplaints += item.totalComplaints || (item.paidCount + item.unpaidCount);
  //     acc.totalPaid += item.paidCount;
  //     acc.totalUnpaid += item.unpaidCount;
  //     acc.totalPaidAmount += item.paidCount * item.averagePaymentPerComplaint;
  //     acc.totalUnpaidAmount += item.unpaidCount * item.averagePaymentPerComplaint;

  //     // ✅ Exclusive categorization of service centers:
  //     if (item.unpaidCount > 0) {
  //       // If there's at least one unpaid complaint, mark as Unpaid
  //       acc.unpaidServiceCenters++;
  //     } else if (item.paidCount > 0) {
  //       // Only if all are paid, mark as Paid
  //       acc.paidServiceCenters++;
  //     }

  //     return acc;
  //   },
  //   {
  //     totalServiceCenters: 0,
  //     totalAmount: 0,
  //     totalComplaints: 0,
  //     totalPaid: 0,
  //     totalUnpaid: 0,
  //     totalPaidAmount: 0,
  //     totalUnpaidAmount: 0,
  //     paidServiceCenters: 0,
  //     unpaidServiceCenters: 0
  //   }
  // );

  const totalSummary1 = summary.reduce(
    (acc, item) => {
      const totalCount = item.paidCount + item.unpaidCount;

      acc.totalServiceCenters++;
      acc.totalAmount += item.totalAmount;
      acc.totalComplaints += totalCount;
      acc.totalPaid += item.paidCount;
      acc.totalUnpaid += item.unpaidCount;

      const paidAmount = totalCount > 0 ? (item.totalAmount * item.paidCount) / totalCount : 0;
      const unpaidAmount = totalCount > 0 ? (item.totalAmount * item.unpaidCount) / totalCount : 0;

      acc.totalPaidAmount += paidAmount;
      acc.totalUnpaidAmount += unpaidAmount;

      // ✅ Delivery Charges (if exists)
      acc.totalDeliveryCharges += item.nonComplaintAmount || 0;

      // ✅ Spare Part Count (if exists)
      acc.totalSpareParts += item.totalNonComplaintPayments || 0;

      if (item.unpaidCount > 0) {
        acc.unpaidServiceCenters++;
      } else if (item.paidCount > 0) {
        acc.paidServiceCenters++;
      }

      return acc;
    },
    {
      totalServiceCenters: 0,
      totalAmount: 0,
      totalComplaints: 0,
      totalPaid: 0,
      totalUnpaid: 0,
      totalPaidAmount: 0,
      totalUnpaidAmount: 0,

      totalDeliveryCharges: 0,
      totalSpareParts: 0,
      paidServiceCenters: 0,
      unpaidServiceCenters: 0,
    }
  );




  // console.log("totalSummary1", totalSummary1);
  const [filter, setFilter] = useState("all");

  // const filteredSummary = summary.filter(item => {
  //   if (filter === "paid") return item.paidCount > 0;
  //   if (filter === "unpaid") return item.unpaidCount > 0;
  //   return true;
  // });
  const filteredSummary = summary.filter(item => {
    let matchesFilter = false;

    if (filter === "all") {
      matchesFilter = true; // show all service centers
    } else if (filter === "unpaid") {
      // show if any unpaid complaints exist
      matchesFilter = item.unpaidCount > 0;
    } else if (filter === "paid") {
      // show only if NO unpaid complaints AND paid complaints exist
      matchesFilter = item.unpaidCount === 0 && item.paidCount > 0;
    }

    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(serviceCenterSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const formattedData = filteredSummary.map(item => ({
    ...item,
    tat_0: item.tatReport?.["0"] ?? "",
    tat_1: item.tatReport?.["1"] ?? "",
    tat_1_2: item.tatReport?.["1-2"] ?? "",
    tat_2_3: item.tatReport?.["2-3"] ?? "",
    tat_3_4: item.tatReport?.["3-4"] ?? "",
    tat_4_5: item.tatReport?.["4-5"] ?? "",
    tat_greater_5: item.tatReport?.[">5"] ?? ""
  }));


  console.log("formattedData", formattedData);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Wallet Payment Summary</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select value={month} onChange={e => setMonth(e.target.value)} className="border p-2 rounded">
          {[...Array(12).keys()].map(m => (
            <option key={m + 1} value={String(m + 1).padStart(2, '0')}>
              {new Date(0, m).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={e => setYear(e.target.value)}
          className="border p-2 rounded"
          placeholder="Year"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="high">High Payment</option>
          <option value="low">Low Payment</option>
          <option value="alpha">A-Z</option>
        </select>
        <input
          type="text"
          value={serviceCenterSearch}
          onChange={(e) => setServiceCenterSearch(e.target.value)}
          className="border p-2 rounded"
          placeholder="Search Service Center..."
        />

        <div className="flex justify-center gap-4  ">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("paid")}
            className={`px-4 py-2 rounded ${filter === "paid" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Paid
          </button>
          <button
            onClick={() => setFilter("unpaid")}
            className={`px-4 py-2 rounded ${filter === "unpaid" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          >
            Unpaid
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center  h-[80vh]">
          <ReactLoader />
        </div>
      ) : (
        <div className=" ">
          <div className=" flex justify-center  mb-5">
            <div className="bg-white border w-full  rounded-lg shadow-md p-3  grid grid-cols-2 md:grid-cols-6 justify-center items-center gap-3 text-gray-800">


              {user?.user?.role === "SERVICE" ? ""
                : <div>
                  <h3 className="text-sm font-semibold mb-2"> Service Centers</h3>
                  <p className="text-xl font-bold">{totalSummary.totalServiceCenters}</p>
                </div>
              }
              {user?.user?.role === "SERVICE" ? ""
                :
                <div>
                  <h3 className="text-sm font-semibold mb-2">Paid Service Centers</h3>
                  <p className="text-xl font-bold">{totalSummary1.paidServiceCenters}</p>
                </div>
              }
              {user?.user?.role === "SERVICE" ? ""
                :
                <div>
                  <h3 className="text-sm font-semibold mb-2">Unpaid Service Centers</h3>
                  <p className="text-xl font-bold">{totalSummary1.unpaidServiceCenters}</p>
                </div>
              }

              <div>
                <h3 className="text-sm font-semibold mb-2">Total_Complaints</h3>
                <p className="text-xl font-bold">{totalSummary.totalComplaints}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Spareparts</h3>
                <p className="text-xl font-bold">{totalSummary1.totalSpareParts}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Delivery_Charges</h3>
                <p className="text-xl font-bold">{totalSummary1.totalDeliveryCharges}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Total Payment</h3>
                <p className="text-xl font-bold text-green-700">₹{totalSummary.totalAmount.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">  Paid Amount</h3>
                <p className="text-xl font-bold text-green-700">
                  ₹{Number(totalSummary1?.totalPaidAmount).toFixed(0).toLocaleString()}

                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">  Unpaid Amount</h3>
                <p className="text-xl font-bold text-red-700">
                  ₹{Number(totalSummary1?.totalUnpaidAmount).toFixed(0).toLocaleString()}

                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Total Paid  </h3>
                <p className="text-xl font-bold text-green-600">{totalSummary.totalPaid}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">Total Unpaid  </h3>
                <p className="text-xl font-bold text-red-600">{totalSummary.totalUnpaid}</p>
              </div>
              {user?.user?.role === "ADMIN" ?
                <div className="">
                  {formattedData.length > 0 && (
                    <DownloadExcel
                      data={formattedData}
                      fileName="Service Center PaymentList"
                      fieldsToInclude={[
                        "name",
                        "contactNo",
                        "totalAmount",
                        "unpaidCount",
                        "paidCount",
                        "totalComplaints",
                        "averagePaymentPerComplaint",
                        "totalComplaintPayments",
                        "totalNonComplaintPayments",
                        "nonComplaintAmount",
                        "tat_0",
                        "tat_1",
                        "tat_1_2",
                        "tat_2_3",
                        "tat_3_4",
                        "tat_4_5",
                        "tat_greater_5"
                      ]}
                    />


                  )}
                </div>
                : ""
              }
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-4 ">
            {filteredSummary.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm p-6
            hover:shadow-lg hover:scale-[1.03] transition-transform duration-300 ease-in-out
            flex flex-col justify-between"
                style={{ minHeight: "320px" }}
              >
                {/* Name */}
                <h2
                  className="text-xl font-semibold text-gray-900 mb-4 truncate"
                  title={item.name}
                >
                  {item.name}
                </h2>

                {/* Summary Info */}
                <div className="mb-6 text-sm text-gray-700 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">City:</span>
                    <span>{item.city}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="font-medium">State:</span>
                    <span>{item.state}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="font-medium">Contact No.:</span>
                    <span>{item.contactNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Complaints :</span>
                    <span>{item.totalComplaints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium"> Complaint Payment:</span>
                    <span  className={`font-semibold ${item.percentagePaid.toFixed(2) === "0.00" ? "text-red-600" : "text-green-600"
                        }`}>₹{item.totalAmount - item.duplicatePaymentsSum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Average Cost:</span>
                    <span>₹{Math.round(item.averagePaymentPerComplaint)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium"> Delivery Charges:</span>
                    <span> Sparepart({item?.totalNonComplaintPayments}) {item.duplicatePaymentsSum || 0}</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="font-medium">Total Payment:</span>
                    <span className="text-green-600 font-semibold">₹{item.totalAmount}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span className="font-medium">Total Payment:</span>
                    <span
                      className={`font-semibold ${item.percentagePaid.toFixed(2) === "0.00" ? "text-red-600" : "text-green-600"
                        }`}
                    >
                      ₹{item.totalAmount}
                    </span>
                  </div>

                </div>

                {/* Paid / Unpaid Summary */}
                <div className="grid grid-cols-2 gap-4 text-center mb-4">
                  <div className="bg-red-50 rounded-md p-3 border border-red-200">
                    <p className="text-sm font-semibold text-red-800">Unpaid  </p>
                    <p className="text-2xl font-bold text-red-900">{item.unpaidCount}</p>
                    <p className="text-xs text-red-700">{item.percentageUnpaid.toFixed(2)}% Unpaid</p>
                  </div>
                  <div className="bg-green-50 rounded-md p-3 border border-green-200">
                    <p className="text-sm font-semibold text-green-800">Paid  </p>
                    <p className="text-2xl font-bold text-green-900">{item.paidCount}</p>
                    <p className="text-xs text-green-700">{item.percentagePaid.toFixed(2)}% Paid</p>
                  </div>
                </div>

                {/* TAT Report */}
                <div className="text-sm text-gray-600 border-t border-gray-200 pt-3 space-y-1">
                  <p className="font-semibold text-gray-800">TAT Report (days)</p>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    {Object.entries(item.tatReport).map(([range, value]) => (
                      value !== null && (
                        <div key={range} className="flex text-sm justify-between">
                          <span>{range} Days</span>
                          <span className='font-bold'>{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      )}


    </div>
  );
};

export default WalletPaymentSummary;
