import React from 'react';
import MessageTemplate from '../../MessageTemplate/MessageTemplate';
import './ModifyOrderSellerReceive.css';
import * as types from '../../../constants/constants';

const ModifyOrderSellerReceive = (props) => {
  let btns = '';

  if (props.chat.status === 'send') {
    btns = (
      <div>
        <button
          className="btn btn-danger"
          onClick={() =>
            props.request({
              id: props.chat.id,
              request: types.DECLINE_MODIFY_ORDER,
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
              request: types.ACCEPT_MODIFY_ORDER,
            })
          }
        >
          Accept
        </button>
      </div>
    );
  } else if (props.chat.status === 'withdraw') {
    btns = <button>Request was withdrawn by your Buyer</button>;
  } else {
    btns = <button>you Responded To seller Request</button>;
  }

  return (
    <div className="ModifyOrderSellerReceive">
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
        username="Me"
        message={props.chat.description}
      />
      <div className="extend-table-outer">
        <p className="info">
          <strong>Buyer Offered to Modified the order.</strong>
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

export default ModifyOrderSellerReceive;
