import * as types from '../../../constants/constants';
import React from 'react';
import MessageTemplate from '../../MessageTemplate/MessageTemplate';
import './CancelOrderSellerReceive.css';
const CancelOrderSellerReceive = (props) => {
  let btns = '';

  if (props.chat.status === 'send') {
    btns = (
      <div>
        <button
          className="btn btn-danger"
          onClick={() =>
            props.request({
              id: props.chat.id,
              request: types.DECLINE_CANCEL_ORDER,
            })
          }
        >
          decline
        </button>
        <button
          className="btn btn-success"
          onClick={() =>
            props.request({
              id: props.chat.id,
              request: types.ACCEPT_CANCEL_ORDER,
            })
          }
        >
          Accept
        </button>
      </div>
    );
  } else if (props.chat.status === 'withdraw') {
    btns = <button>Request was withdrawn by your buyer</button>;
  } else {
    btns = <button>you Responded To Buyer Request</button>;
  }

  return (
    <div className="CancelOrderSellerReceive">
      <div className="top">
        <img src="" alt="" />

        <h4>Order Request</h4>
        <p>Buyer started an issue is:</p>
        <p>
          <strong>{props.chat.title}</strong>
        </p>
      </div>
      <MessageTemplate
        image={props.image}
        username={props.chat.seller_username}
        message={props.chat.description}
      />
      <div className="extend-table-outer">
        <p className="info">
          <strong>Buyer requested to Cancel this order.</strong>
        </p>
        <div className="button-box">{btns}</div>
      </div>
    </div>
  );
};

export default CancelOrderSellerReceive;
