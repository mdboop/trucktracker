import React from 'react';

import scrubber from './utils/dataScrub';

import TruckListEntry from './components/TruckListEntry';

const TruckList = (props) => {
  const trucks = _.uniqBy(props.trucks, 'applicant')
    .map((truck, i) => <TruckListEntry truck={truck} key={i} /> );

  return <section className="truck-list">{trucks}</section>;

}

export default TruckList;
