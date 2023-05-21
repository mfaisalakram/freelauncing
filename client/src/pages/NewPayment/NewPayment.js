import React, { Fragment, useEffect, useState } from 'react';

import axios from '../../axios-server';
import './NewPayment.css';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_JTYjJnkleR80a5sndukOEEzD');

const NewPayment = (props) => {
  const [serviceData, setserviceData] = useState({
    offerDetails: {},
  });

  const [servicefeeFetched, setservicefeeFetched] = useState([]);

  // const calculateServiceFee = (amount) => {
  //   if (servicefeeFetched.length > 0) {
  //     let sum = amount * (servicefeeFetched[0].service_fee_in_percent / 100);
  //     if (servicefeeFetched[0].amount > amount) {
  //       let remaing = amount - servicefeeFetched[0].amount;
  //       sum =
  //         sum + remaing * (servicefeeFetched[1].service_fee_in_percent / 100);
  //     }
  //     return sum;
  //   }
  //   return 0;
  // };

  const getServiceFeeServer = async () => {
    await await axios
      .get('/api/service/get-service-fee-data')
      .then((response) => {
        if (response.data.found) {
          setservicefeeFetched(response.data.data);
        }
      })
      .catch((err) => {});
  };
  console.log('service', serviceData);
  // get servie data from server
  const getServiceData = async () => {
    console.log(props.location);
    let sessionID = '';
    const path = props.location.search.replace('?PaymentSessionID=', '');
    sessionID = path;

    await axios
      .post('/api/service/get-session-data', {
        sessionID: sessionID,
      })
      .then((response) => {
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

  useEffect(() => {
    getServiceData();
    getServiceFeeServer();

    // console.log("cube",cube(2,6));
  }, []);

  const handleClick = async (event) => {
    // Get Stripe.js instance
    event.preventDefault();
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    let sessionID = '';
    const path = props.location.search.replace('?PaymentSessionID=', '');
    sessionID = path;
    const response = await fetch(
      'http://localhost:5000/api/payments/create-checkout-session?id=' + path,
      {
        method: 'POST',
        body: { id: path },
        headers: {
          'x-auth-token': localStorage.getItem('userToken'),
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log(response);
    const session = await response.json();
    console.log(session);

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };
  return (
    <Fragment>
      <div className="NewPayment">
        <section className="container dashboard section-padding">
          <div className="row">
            <div className="col-lg-8 col-sm-8 col-md-8">
              <div className="row">
                <div className="col-sm-12">
                  <div className="serviceData">
                    <div className="personal-balance">
                      <div className="row">
                        <div className="col-sm-4">
                          <h4>Personal Balance</h4>
                        </div>
                        <div className="col-sm-8">
                          <h4 className="pull-right">
                            ${serviceData.personal_balance}
                          </h4>
                        </div>
                        <div className="col-sm-12">
                          <hr />
                        </div>
                      </div>
                    </div>

                    <div className="remaining-balance">
                      <div className="row">
                        <div className="col-sm-4">
                          <h4>Remaining Payment</h4>
                        </div>
                        <div className="col-sm-8">
                          <h4 className="pull-right">
                            ${parseFloat(serviceData.remaining).toFixed(2)}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-sm-12">
                      <button onClick={(e) => handleClick(e)}>Checkout</button>
                    </div>
                    <div className="col-sm-8"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-sm-4 col-md-4">
              <div className="content service-content">
                <div className="row service-preview">
                  <div className="col-sm-3">
                    <img
                      src={serviceData.image}
                      width="100%"
                      alt="service Image"
                    />
                  </div>
                  <div className="col-sm-9">
                    <h4>{serviceData.title}</h4>
                  </div>
                </div>
                <hr />
                <div className="details-box">
                  <div className="l">
                    <p>{'short description'}</p>
                  </div>
                  <p className="r">{serviceData.offerDetails.amount}$</p>

                  <div className="row includes-offer te">
                    <div className="col-sm-12">
                      <p>
                        {serviceData.offerDetails.DeliveryTime} Days Delivery
                      </p>
                    </div>
                  </div>
                </div>

                <hr />
                <div className="package-content">
                  <div className="details-box">
                    <p className="l">Service Fee</p>
                    <p className="r">
                      ${parseFloat(serviceData.serviceFee).toFixed(2)}
                    </p>
                  </div>
                  <hr />

                  <div className="details-box">
                    <h4 className="l">
                      <strong>Total</strong>{' '}
                    </h4>
                    <h4 className="r">
                      <strong>${serviceData.total}$</strong>{' '}
                    </h4>
                  </div>
                  <div className="details-box">
                    <p className="l">Delivery Time</p>
                    <p className="r">
                      {serviceData.offerDetails.DeliveryTime} Days
                    </p>
                  </div>

                  <hr />

                  <div className="details-box">
                    <p className="l">Personal Balance</p>
                    <p className="r">${serviceData.personal_balance}</p>
                  </div>
                  <div className="details-box">
                    <h4 className="l">
                      <strong>Remaining Payment</strong>{' '}
                    </h4>
                    <h4 className="r">
                      <strong>
                        ${parseFloat(serviceData.remaining).toFixed(2)}
                      </strong>{' '}
                    </h4>
                  </div>
                  <button
                    onClick={handleClick}
                    className="btn form-control contact-seller-button"
                  >
                    Comfirm & pay
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

export default NewPayment;
