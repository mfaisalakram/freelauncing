import React from 'react';
import MessageTemplate from '../../MessageTemplate/MessageTemplate';
import * as types from '../../../constants/constants';

import './CancelOrderSellerSend.css';
const CancelOrderSellerSend = (props) => {
  let btns = '';

  if (props.chat.status === 'send') {
    btns = (
      <button
        className="btn btn-success"
        onClick={() =>
          props.request({
            id: props.chat.id,
            request: types.WITHDRAW_CANCEL_ORDER,
          })
        }
      >
        Withdraw your Request
      </button>
    );
  } else if (props.chat.status === 'withdraw') {
    btns = <button>Request was withdraw by you</button>;
  } else {
    btns = (
      <button>{props.chat.buyer_username} Responded To Your Request</button>
    );
  }

  return (
    <div className="CancelOrderSellerSend">
      <div className="top">
        <img src="" alt="" />

        <h4> Order Dispute</h4>
        <p>you started and issue is:</p>
        <p>
          <strong>{props.sub_title}</strong>
        </p>
      </div>
      <MessageTemplate
        image={props.image}
        username="Me"
        message={props.chat.description}
      />
      <div className="extend-table-outer">
        <p className="info">
          <strong>You requested to cancel this order.</strong>
        </p>

        <div className="button-box">{btns}</div>
      </div>
    </div>
  );
};

export default CancelOrderSellerSend;
