import React from 'react';

const TruckListEntry = (props) => {
  return (
    <div className="truck-entry">
      <p>{props.truck.applicant}</p>
      <p>distance: {props.truck.distance}</p>
    </div>
  )
}

export default TruckListEntry;
