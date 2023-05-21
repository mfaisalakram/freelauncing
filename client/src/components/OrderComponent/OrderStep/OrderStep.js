import React from "react";
import './OrderStep.css'
const OrderStep = ({ image, heading, description }) => {
  return (
    <div className="OrderStep">
     <img src={image} alt=""/>
      <h3>{heading}</h3>
      <p>{description}</p>
    </div>
  );
};

export default OrderStep;
