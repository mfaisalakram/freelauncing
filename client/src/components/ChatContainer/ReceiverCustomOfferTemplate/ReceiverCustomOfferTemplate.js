import React, { useState, useEffect } from 'react';
import './ReceiverCustomOfferTemplate.css';
import axios from '../../../axios-server';
const ReceiverCustomOfferTemplate = ({
  message,
  time,
  image,
  offer,
  offerId,
  seller,
  sender,
}) => {
  console.log(offerId);
  const [status, setstatus] = useState(offer.status);

  useEffect(() => {}, []);

  const onDeclineOffer = () => {
    let data = {
      offerId: offerId,
      seller: seller,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    axios
      .post('/api/chatapp/offer-reject', data, config)
      .then((res) => {
        setstatus('reject');
      })
      .catch((err) => {});
  };

  let btn;
  if (status === 'send') {
    btn = (
      <div>
        <a
          className="btn btn-success pull-right"
          href={'/view-offer-details/' + seller + '/' + offerId}
        >
          Review Offer
        </a>{' '}
        <button className="btn btn-danger" onClick={onDeclineOffer}>
          decline
        </button>
      </div>
    );
  } else if (status === 'reject') {
    btn = <h4 className=" pull-right">Offer declined by you</h4>;
  } else if (status === 'accept') {
    btn = (
      <div>
        <p className=" pull-right">Order Started</p>
        <button className="btn btn-default">View Order</button>
      </div>
    );
  } else if (status === 'withdraw') {
    btn = (
      <div>
        <p className=" pull-right">Offer is withdraw by seller</p>
      </div>
    );
  }

  return (
    <div className="ReceiverCustomOfferTemplate">
      {console.log(offerId)}
      <div className="convo-box convo-left">
        <div className="convo-area convo-area-sender">
          <div className="convo-message">
            <h4 className="text-left">
              <strong>{sender}</strong>
            </h4>
            {/* <i style={{float:"right"}}>{time}</i> */}
            <div className="custom-offer-box">
              <div>
                <h3>{offer.title}</h3>
                <span className="price">{offer.amount}$</span>
              </div>
              <hr />
              <div>{offer.description}</div>
              <hr />
              <div>
                <h3>Your Offer Includes</h3>
                <div>
                  {' '}
                  <span>
                    <i className="fa fa-time"></i> {offer.DeliveryTime} Day
                    Delivery{' '}
                  </span>
                </div>
              </div>
              <hr />
              <div>{btn}</div>
            </div>
          </div>
        </div>
        <div className="convo-img">
          <img src={image} alt="" className="img-responsive img-circle" />
        </div>
      </div>
    </div>
  );
};

export default ReceiverCustomOfferTemplate;
