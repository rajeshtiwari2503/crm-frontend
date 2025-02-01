import React from 'react';
import Select from 'react-select';

const FilterOptions = ({ filters,userValue, setFilters,userData }) => {
  const handleCheckboxChange = (category, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: {
        ...prevFilters[category],
        [value]: !prevFilters[category][value],
      },
    }));
  };

  const handleMultiSelectChange = (category, selectedOptions) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [category]: selectedOptions.map(option => option.value),
    }));
  };
//  console.log(userValue);
 
  const userTypeOptions = userValue?.user?.role==="ADMIN" ?[
    { value: 'customer', label: 'Customer' },
    { value: 'serviceCenter', label: 'Service Center' },
    { value: 'technician', label: 'Technician' },
    { value: 'brand', label: 'Brand' },
  ]
  :[
    { value: 'customer', label: 'Customer' },
    
  ]

  const statusOptions = [
    { value: 'PENDING', label: 'PENDING' },
    { value: 'ASSIGN', label: 'ASSIGN' },
    { value: 'IN PROGRESS', label: 'IN PROGRESS' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'CANCELED', label: 'CANCELED' },
    { value: 'FINAL VERIFICATION', label: 'FINAL VERIFICATION' },
  ];

  const productOptions = userData?.product?.map(product => ({
    value: product._id,
    label: product.productName,
  }));
  const countryOptions = [{
    value: "india",
    label: "India",
  },{
    value: "others",
    label: "Others",
  }
];
const stateOptions = [{
    value: "noida",
    label: "Noida",
  },{
    value: "others",
    label: "Others",
  }
];

const cityOptions = [{
    value: "noida",
    label: "Noida",
  },{
    value: "others",
    label: "Others",
  }
];

  

  const serviceCenterOptions =  userData?.services?.map(service => ({
    value: service._id,
    label: service.serviceCenterName,
  }));
  const technicianOptions =  userData?.technicians?.map(technician => ({
    value: technician._id,
    label: technician.name,
  }));
  const brand =userValue?.user?.role==="ADMIN"?userData?.brands:userData?.brands?.filter((f)=>f?._id===userValue?.user?._id)
  const brandOptions =  brand?.map(brand => ({
    value: brand._id,
    label: brand.brandName,
  }));
  

  return (
    <div>
      <h3>User Type:</h3>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 '>

      {userTypeOptions.map(option => (
       <div>

        <label   key={option.value}>
          <input
          className='mr-2'
            type="checkbox"
            checked={filters.userType?.[option.value] || false}
            onChange={() => handleCheckboxChange('userType', option.value)}
          />
          {option.label}
        </label>
      </div>
    ))}
      </div>

      <h3 className='mt-2'>Status:</h3>
      <div className='grid grid-cols-1 md:grid-cols-5 gap-4 '>

      {statusOptions.map(option => (
       <div>

        <label key={option.value}>
          <input
          className='mr-2'
            type="checkbox"
            checked={filters.status?.[option.value] || false}
            onChange={() => handleCheckboxChange('status', option.value)}
          />
          {option.label}
        </label>
        </div>
      ))}
        </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-3'>
      <div>

      <h3>Product:</h3>
      <Select
        isMulti
        options={productOptions}
        onChange={selectedOptions => handleMultiSelectChange('product', selectedOptions)}
      />
    </div>

      <div>
      <label>Country:</label>
      <Select
        options={countryOptions}
        onChange={selectedOption => setFilters(prevFilters => ({ ...prevFilters, country: selectedOption.value }))}
      />
      </div>
      <div>

      <label>State/Province:</label>
      <Select
        options={stateOptions}
        onChange={selectedOption => setFilters(prevFilters => ({ ...prevFilters, state: selectedOption.value }))}
      />
    </div>

      <div>

      <label>City:</label>
      <Select
        options={cityOptions}
        onChange={selectedOption => setFilters(prevFilters => ({ ...prevFilters, city: selectedOption.value }))}
      />
    </div>

      <div>

      <h3>Service Center:</h3>
      <Select
        isMulti
        options={serviceCenterOptions}
        onChange={selectedOptions => handleMultiSelectChange('serviceCenter', selectedOptions)}
      />
    </div>

      <div>

      <h3>Technician:</h3>
      <Select
        isMulti
        options={technicianOptions}
        onChange={selectedOptions => handleMultiSelectChange('technician', selectedOptions)}
      />
    </div>

      <div>

      <h3>Brand:</h3>
      <Select
        isMulti
        options={brandOptions}
        onChange={selectedOptions => handleMultiSelectChange('brand', selectedOptions)}
      />
    </div>
    </div>
    </div>
  );
};

export default FilterOptions;
