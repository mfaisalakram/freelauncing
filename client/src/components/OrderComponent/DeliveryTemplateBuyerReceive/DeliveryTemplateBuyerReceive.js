import React from 'react';
import AttachmentFileTemplate from '../AttachmentFileTemplate/AttachmentFileTemplate';
import MessageTemplate from '../MessageTemplate/MessageTemplate';
import './DeliveryTemplateBuyerReceive.css';
const DeliveryTemplateBuyerReceive = ({
  icon,
  image,
  chat,
  declineDelivery,
  acceptDelivery,
}) => {
  return (
    <div className="DeliveryTemplateBuyerReceive">
      <div>
        <img src={icon} width="100px" alt="" />
        <h3>HERE'S YOUR DELIVERY!</h3>
        <p>This order will be marked as complete in 3 days.</p>
      </div>
      <div className="DeliveryTemplateBuyerReceive-msg">
        <MessageTemplate
          message={chat.description}
          username="Me"
          image={image}
        />
        <hr />
        <div className="delivery-files">
          <p className="title">Delivery Files</p>
          <AttachmentFileTemplate chat={chat} />
        </div>
        <hr />
        <div className="button-box text-center">
          {chat.status === 'send' ? (
            <div>
              <button
                className="btn btn-danger"
                onClick={() => declineDelivery(chat.id)}
              >
                decline
              </button>
              <button
                className="btn btn-success"
                onClick={() => acceptDelivery(chat.id)}
              >
                Accept
              </button>
            </div>
          ) : (
            <button className="btn btn-default" disabled>
              you Responded To seller Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryTemplateBuyerReceive;
