import React, { useState } from "react";
import { Chart } from "react-google-charts";

export default function App() {
  const [timeInterval, setTimeInterval] = useState("yearly");

  const handleTabClick = (interval) => {
    setTimeInterval(interval);
  };

  const getData = () => {
    if (timeInterval === "monthly") {
      return [
        ["Month", "Sales", "Expenses"],
        ["Jan", 200, 100],
        ["Feb", 300, 150],
        ["Mar", 400, 200],
        ["Apr", 500, 250],
        ["May", 600, 300],
        ["Jun", 700, 350],
      ];
    } else {
      return [
        ["Year", "Sales", "Expenses"],
        ["2013", 1000, 400],
        ["2014", 1170, 460],
        ["2015", 660, 1120],
        ["2016", 1030, 540],
      ];
    }
  };

  const options = {
    title: "Company Performance",
    hAxis: { title: timeInterval === "yearly" ? "Year" : "Month", titleTextStyle: { color: "#333" } },
    vAxis: { minValue: 0 },
    chartArea: { width: "50%", height: "70%" },
  };

  return (
    <div>
      <div>
        <button
          onClick={() => handleTabClick("yearly")}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
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
        chartType="AreaChart"
        width="100%"
        height="400px"
        data={getData()}
        options={options}
      />
    </div>
  );
}
