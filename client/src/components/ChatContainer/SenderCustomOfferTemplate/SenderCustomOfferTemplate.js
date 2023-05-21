import React, { useState } from 'react';
import './SenderCustomOfferTemplate.css';
import axios from '../../../axios-server';

const SenderCustomOfferTemplate = ({
  message,
  time,
  image,
  offer,
  offerId,
  buyer,
  sender,
}) => {
  const [status, setstatus] = useState(offer.status);

  const onwithdrawOffer = () => {
    let data = {
      offerId: offerId,
      buyer: buyer,
    };
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    axios
      .post('/api/chatapp/offer-withdraw', data, config)
      .then((res) => {
        setstatus('withdraw');
      })
      .catch((err) => {});
  };
  let btn;
  if (status === 'send') {
    btn = (
      <button className="btn btn-success pull-right" onClick={onwithdrawOffer}>
        Withdraw Offer
      </button>
    );
  } else if (status === 'reject') {
    btn = <h4 className=" pull-right">Offer Rejected</h4>;
  } else if (status === 'withdraw') {
    btn = <h4 className=" pull-right">you withdraw your offer</h4>;
  }

  return (
    <div className="SenderCustomOfferTemplate">
      {console.log(offer)}
      <div className="convo-box pull-right">
        <div className="convo-area convo-area-sender">
          <div className="convo-message">
            <h4 className="text-right">
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

export default SenderCustomOfferTemplate;
