import React from "react";
import './SenderMSGTemplate.css'
const SenderMSGTemplate = ({ message, time, image,sender }) => {
  return (
    <div className="SenderMSGTemplate">
    <div className="convo-box pull-right">
      <div className="convo-area convo-area-sender">
        <div className="convo-message">
        <h4 className="text-right"><strong>{sender}</strong></h4>
          <span>{message}</span>
        </div>
        <span>{time}</span>
      </div>
      <div className="convo-img">
        <img src={image} alt="" className="img-responsive img-circle" />
      </div>
    </div>
    </div>

  );
};

export default SenderMSGTemplate;
