import React, { Component } from 'react';

class InputBar extends Component {
  render() {
    return (
      <div className="input-container">
        <div className="main--input--text">
          <label>
            Enter an address
            <input type="text"/>
          </label>
        </div>
        <div className="address-button">
          Find by Address
        </div>
        <div>or...</div>
        <div className="location-button">
          Get Current Location
        </div>
      </div>
    );
  }
 }

export default InputBar
