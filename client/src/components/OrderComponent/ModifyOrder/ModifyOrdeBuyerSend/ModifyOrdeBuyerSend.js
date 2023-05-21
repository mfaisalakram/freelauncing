import * as types from '../../../constants/constants';

import React from 'react';
import MessageTemplate from '../../MessageTemplate/MessageTemplate';
import './ModifyOrdeBuyerSend.css';
const ModifyOrdeBuyerSend = (props) => {
  let btns = '';

  if (props.chat.status === 'send') {
    btns = (
      <button
        className="btn btn-success"
        onClick={() =>
          props.withdraw({
            id: props.chat.id,
            request: types.WITHDRAW_MODIFY_ORDER,
          })
        }
      >
        Withdraw your Request
      </button>
    );
  } else if (props.chat.status === 'withdraw') {
    btns = <button>Request was withdrawn by you</button>;
  } else {
    btns = (
      <button>{props.chat.seller_username} Responded To Your Request</button>
    );
  }

  return (
    <div className="ModifyOrdeBuyerSend">
      <div className="top">
        <img src="" alt="" />

        <h4>Order Request</h4>
        <p>you started an issue is:</p>
        <p>
          <strong>{props.chat.title}</strong>
        </p>
      </div>
      <MessageTemplate
        image={props.image}
        username="Me"
        message={props.chat.description}
      />
      <div className="extend-table-outer">
        <p className="info">
          <strong>You Requested to Modified the order.</strong>
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
                <td>Order Modified</td>
                <td>{props.chat.time} days</td>
                <td>${props.chat.amount}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="button-box">{btns}</div>
      </div>
    </div>
  );
};

export default ModifyOrdeBuyerSend;
