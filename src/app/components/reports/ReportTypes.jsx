 
import React from 'react';
import Select from 'react-select';

const ReportTypeSelector = ({ reportType, setReportType }) => {
  const options = [
    { value: 'USER', label: 'USER' },
    { value: 'COMPLAINT', label: 'COMPLAINT' },
    // Add more options as needed
  ];

  return (
    <Select
      value={options.find(option => option.value === reportType)}
      onChange={selectedOption => setReportType(selectedOption.value)}
      options={options}
    />
  );
};

export default ReportTypeSelector;
