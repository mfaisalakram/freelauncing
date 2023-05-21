import React from "react";
import AttachmentFileTemplate from "../AttachmentFileTemplate/AttachmentFileTemplate";
import MessageTemplate from "../MessageTemplate/MessageTemplate";
import "./DeliveryTemplate.css";
const DeliveryTemplate = ({icon,image,chat }) => {
  return (
    <div className="DeliveryTemplate">
      <div>
        <img src={icon} width="100px" alt=""/>
        <h3>HERE'S YOUR DELIVERY!</h3>
        <p>This order will be marked as complete in 3 days.</p>
      </div>
      <div className="DeliveryTemplate-msg">
        <MessageTemplate
          message={chat.description}
          username="Me"
          image={image}
        />

        <div className="delivery-files">
          <p className="title">Delivery Files</p>
          <AttachmentFileTemplate chat={chat} />
        </div>
      </div>
    </div>
  );
};

export default DeliveryTemplate;
