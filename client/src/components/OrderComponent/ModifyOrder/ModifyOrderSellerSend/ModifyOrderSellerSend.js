import React from 'react';
import MessageTemplate from '../../MessageTemplate/MessageTemplate';
import './ModifyOrderSellerSend.css';
import * as types from '../../../constants/constants';

const ModifyOrderSellerSend = (props) => {
  let btns = '';

  if (props.chat.status === 'send') {
    btns = (
      <button
        className="btn btn-success"
        onClick={() =>
          props.request({
            id: props.chat.id,
            request: types.WITHDRAW_MODIFY_ORDER,
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
    <div className="ModifyOrderSellerSend">
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
                <td>{props.chat.time}</td>
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

export default ModifyOrderSellerSend;
