// src/components/ReportDisplayArea.js
import React from 'react';
// import { Bar } from 'react-chartjs-2';

const ReportDisplayArea = ({ reportData }) => {
  const chartData = {
    labels: reportData.labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: reportData.data,
        backgroundColor: 'rgba(75,192,192,0.4)',
      },
    ],
  };

  return (
    <div>
      <h2>Report Summary</h2>
      <p>{reportData.summary}</p>
      <h2>Detailed Data</h2>
      <pre>{JSON.stringify(reportData.details, null, 2)}</pre>
      <h2>Visualizations</h2>
      {/* <Bar data={chartData} /> */}
      <div>
        <button>Download PDF</button>
        <button>Download Excel</button>
        <button>Download CSV</button>
        <button>Email Report</button>
      </div>
    </div>
  );
};

export default ReportDisplayArea;
