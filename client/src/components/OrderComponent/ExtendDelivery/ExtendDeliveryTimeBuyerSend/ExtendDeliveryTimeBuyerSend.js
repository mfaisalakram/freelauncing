import { Button } from '@material-ui/core';
import React from 'react';
import MessageTemplate from '../../MessageTemplate/MessageTemplate';
import './ExtendDeliveryTimeBuyerSend.css';
import * as types from '../../../constants/constants';

const ExtendDeliveryTimeBuyerSend = (props) => {
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
        withdraw your request
      </button>
    );
  } else if (props.chat.status === 'withdraw') {
    btns = <button>Request was withdrawn by you</button>;
  } else {
    btns = (
      <button>{props.chat.seller_username} Responded To your Request</button>
    );
  }

  return (
    <div className="ExtendDeliveryTimeBuyerSend">
      <div className="top">
        <img src="" alt="" />

        <h4>Order Request</h4>
        <p>Seller started an issue is:</p>
        {/* <p>
          <strong>{props.chat.title}</strong>
        </p> */}
      </div>
      <MessageTemplate
        image={props.image}
        username={props.chat.seller_username}
        message={props.chat.description}
      />
      <div className="extend-table-outer">
        <p className="info">
          <strong>You Offer to Extend the delivery time.</strong>
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
                <td>Delivery Extended</td>
                <td>
                  {props.chat.time} {props.chat.time === 1 ? ' days' : ' days'}
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

export default ExtendDeliveryTimeBuyerSend;
