import React from 'react';
import MessageTemplate from '../../MessageTemplate/MessageTemplate';
import * as types from '../../../constants/constants';

import './ExtendDeliverTimeSellerSend.css';
const ExtendDeliverTimeSellerSend = (props) => {
  let btns = '';

  if (props.chat.status === 'send') {
    btns = (
      <button
        className="btn btn-success"
        onClick={() =>
          props.request({
            id: props.chat.id,
            request: types.WITHDRAW_EXTEND_ORDER,
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
    <div className="ExtendDeliverTimeSellerSend">
      <div className="top">
        <img src="" alt="" />

        <h4> Order Request</h4>
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
          <strong>
            You requested to extend the delivery time of the order.
          </strong>
        </p>
        <div className="info-table">
          <table className="table table-striped table-extend">
            <thead>
              <tr>
                <th>Item</th>
                <th>Duration</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Extended Delivery</td>
                <td>
                  {props.chat.time}
                  {props.chat.time === 1 ? ' day' : ' days'}
                </td>
                <td>No Change</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="button-box">{btns}</div>
      </div>
    </div>
  );
};

export default ExtendDeliverTimeSellerSend;
