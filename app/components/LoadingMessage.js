import React from 'react';

const LoadingMessage = (props) => {

  const empty = <span></span>;

  const spinner = (
    <div className="loading-container">
      <div className="loader"></div>
      <div className="loader-message">{props.message}</div>
    </div>
  );

  return props.message ? spinner : empty;
}

export default LoadingMessage;
