import React, { Fragment, useEffect, useState } from 'react';

import axios from '../../axios-server';
import './ViewOffer.css';

const ViewOffer = (props) => {
  const [serviceData, setserviceData] = useState({
    offerDetails: {},
  });

  console.log('service', serviceData);
  // get servie data from server
  const getServiceData = async () => {
    let id = '';
    let sellerID = '';
    const path = props.location.pathname.split('/');
    if (path.length === 4) {
      sellerID = path[2];
      id = path[3];
    }

    await axios
      .post('/api/service/get-offer-data/', {
        offerId: id,
        seller: sellerID,
      })
      .then((response) => {
        console.log(response);
        console.log(response.data);
        if (response.data.found) {
          const data = response.data.data;
          setserviceData({
            ...data,
            image: data.images.split(',')[0],
          });
        }
      })
      .catch((err) => {});
  };

  const createPaymentSession = () => {
    let id = '';
    let sellerID = '';
    const path = props.location.pathname.split('/');
    if (path.length === 4) {
      sellerID = path[2];
      id = path[3];
    }
    axios
      .post('/api/service/create-session-id/', {
        offerId: id,
        seller: sellerID,
      })
      .then((response) => {
        if (response.data.found) {
          window.location.href =
            '/payments/new?PaymentSessionID=' + response.data.sessionID;
        }
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getServiceData();
  }, []);

  return (
    <Fragment>
      {console.log(serviceData)}
      <div className="ViewOffer">
        <section className="container dashboard section-padding">
          <div className="row">
            <div className="col-lg-8 col-sm-8 col-md-8">
              <div className="row">
                <div className="col-sm-12">
                  <h3>Order Details</h3>

                  <div className="serviceData">
                    <div className="row">
                      <div className="col-sm-4">
                        <img src={serviceData.image} width="100%" alt="" />
                      </div>
                      <div className="col-sm-8">
                        <h3>{serviceData.title}</h3>
                      </div>
                      <div className="col-sm-12">
                        <hr />
                        <h4>Offer description</h4>
                        <p className="p-1">
                          {serviceData.offerDetails.description}
                        </p>
                        <hr />
                      </div>
                      <div className="col-sm-8">
                        <h4>Offer Includes</h4>
                        <div className="row includes-offer">
                          <div className="col-sm-6">
                            <p>
                              {serviceData.offerDetails.DeliveryTime} Days
                              Delivery
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-4 col-md-4">
              <div className="nav-container service-packages">
                <label htmlFor="package-tab-1">Summery</label>
              </div>

              <div className="content service-content">
                <div className="package-content">
                  <div className="details-box">
                    <p className="l">Subtotal</p>
                    <p className="r">{serviceData.offerDetails.amount}$</p>
                  </div>

                  <div className="details-box">
                    <p className="l">Service Fee</p>
                    <p className="r">{'2$'}</p>
                  </div>
                  <hr />
                  <div className="details-box">
                    <p className="l">Total</p>
                    <p className="r">
                      {parseFloat(serviceData.offerDetails.amount) + 2}$
                    </p>
                  </div>
                  <div className="details-box">
                    <p className="l">Delivery Time</p>
                    <p className="r">
                      {serviceData.offerDetails.DeliveryTime} Days
                    </p>
                  </div>
                  <hr />

                  <button
                    href=""
                    className="btn form-control contact-seller-button"
                    onClick={(e) => createPaymentSession()}
                  >
                    Continue to Checkout
                  </button>
                </div>
                {/* <footer>
                                <button className="fit-button fit-button-color-green fit-button-fill-full fit-button-size-medium co-white btn-continue bg-co-green-700" type="submit">Continue<span> (₨37,461)</span>
                                </button>
                                <button className="btn-compare-packages">Compare Packages</button>
                            </footer> */}
              </div>
            </div>{' '}
            <div className="col-md-12">
              <div className="other-service"></div>
            </div>
          </div>{' '}
          {/* end of row div */}
        </section>
      </div>
    </Fragment>
  );
};

export default ViewOffer;
