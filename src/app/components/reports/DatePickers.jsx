 
import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ startDate, endDate, setStartDate, setEndDate }) => {
  return (
    <div>
      {/* <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
      <DatePicker selected={endDate} onChange={date => setEndDate(date)} /> */}
      <div className="  grid grid-cols-2 md:grid-cols-4">
        <div>
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="start-date">
        Start Date
      </label>
      <DatePicker
        id="start-date"
        selected={startDate}
        onChange={date => setStartDate(date)}
        className="block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      </div>
      <div>
      <label className="block text-gray-700 text-sm font-bold   mb-2" htmlFor="end-date">
        End Date
      </label>  
      <DatePicker
        id="end-date"
        selected={endDate}
        onChange={date => setEndDate(date)}
        className="block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      </div>
    </div>
    </div>
  );
};

export default DateRangePicker;
