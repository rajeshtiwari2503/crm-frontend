 
import React from 'react';

const VisualizationOptions = ({ includeCharts, setIncludeCharts }) => {
  return (
    <label>
      <input
      className='mr-2'
        type="checkbox"
        checked={includeCharts}
        onChange={() => setIncludeCharts(prev => !prev)}
      />
      Include Charts/Graphs
    </label>
  );
};

export default VisualizationOptions;
