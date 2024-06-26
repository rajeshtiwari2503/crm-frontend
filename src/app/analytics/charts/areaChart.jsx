import React, { useState } from "react";
import { Chart } from "react-google-charts";

const yearlyData = [
  ["Year", "All Complaints", "Assign", "Pending", "Complete", "Part Pending"],
  ["2019", 1000, 400, 200, 800, 300],
  ["2020", 1170, 460, 250, 900, 350],
  ["2021", 660, 1120, 300, 600, 250],
  ["2022", 1030, 540, 350, 700, 400],
];

const monthlyData = [
  ["Month", "All Complaints", "Assign", "Pending", "Complete", "Part Pending"],
  ["January", 100, 40, 20, 80, 30],
  ["February", 117, 46, 25, 90, 35],
  ["March", 66, 112, 30, 60, 25],
  ["April", 103, 54, 35, 70, 40],
];

const options = {
  title: "Complaints Overview",
  hAxis: { title: "Time", titleTextStyle: { color: "#333" } },
  vAxis: { minValue: 0 },
  chartArea: { width: "70%", height: "70%" },
  isStacked: true,
};

export default function App() {
  const [data, setData] = useState(yearlyData);

  const handleTabClick = (period) => {
    if (period === "yearly") {
      setData(yearlyData);
    } else if (period === "monthly") {
      setData(monthlyData);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => handleTabClick("yearly")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Yearly
        </button>
        <button
          onClick={() => handleTabClick("monthly")}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Monthly
        </button>
      </div>
      <Chart
        chartType="BarChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
}
