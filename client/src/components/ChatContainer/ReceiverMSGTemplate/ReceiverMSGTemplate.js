import React from "react";

const ReceiverMSGTemplate = ({ message, image, time,sender }) => {
  return (
    <div className="convo-box convo-left">
      <div className="convo-area convo-left">
        <div className="convo-message">
        <h4 className="text-left"><strong>{sender}</strong></h4>
          <p>{message}</p>
        </div>
        <span>{time}</span>
      </div>
      <div className="convo-img">

        <img src={image} alt="" className="img-responsive img-circle" />
      </div>
    </div>
  );
};

export default ReceiverMSGTemplate;
