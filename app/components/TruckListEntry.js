import React from 'react';

const TruckListEntry = (props) => {
  const classType = props.closingSoon ? "truck-entry closing-soon" : "truck-entry";
  return (
    <div className={classType}>
      <p>{props.truck.applicant}</p>
      { props.truck.distance ? <p>distance: {props.truck.distance}</p> : <p>-</p> }
    </div>
  )
}

export default TruckListEntry;
