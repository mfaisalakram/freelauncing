import React, { Fragment, useEffect, useState } from 'react';
import image3 from '../../../src/img/2020-11-02 7-28-53-1i will do design something  interesting for you.png';
import './SellerDashboard.css';
import { loadUser, startLoading, logout } from '../../store/actions/auth';

import { connect } from 'react-redux';
import axios from 'axios';

const SellerDashboard = (props) => {
  const [orderList, setOrderList] = useState([]);

  const getAllOrderApi = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post('/api/orders/by-status/active', config)
      .then((response) => {
        if (response?.data?.found === true) {
          setOrderList(response?.data?.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getAllOrderApi();
  }, []);
  return (
    <Fragment>
      <container>
        <div className="row">
          <div className="col-lg-4 col-sm-5 col-md-6">
            <div className="SellerProfileDiv">
              <img
                src={
                  '/assets/uploads/users/' +
                  props.user.username +
                  '/profileImages/' +
                  props.user.profile_image
                }
                className="DashboardProfileImage"
                alt={`${props.user.username} Profile Image`}
              />

              <h4 style={{ textAlign: 'center' }}>
                <span>
                  <strong>
                    {props.user.fname} {props.user.lname}{' '}
                  </strong>
                  <i
                    className="fa fa-star rating-star"
                    style={{ paddingLeft: '10px' }}
                  ></i>
                </span>
              </h4>

              <div className="SellerProfileMenu">
                <div className="row">
                  <div className="col-lg-6">
                    <div>
                      <strong>Response Time</strong>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="OuterBar">
                      <div className="InnerBar"> </div>
                    </div>
                  </div>

                  <div className="col-lg-2">
                    <div></div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    <div>
                      <strong>Delievery on Time</strong>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="OuterBar">
                      <div className="InnerBar"> </div>
                    </div>
                  </div>

                  <div className="col-lg-2">
                    <div></div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6">
                    <div>
                      <strong>Order Completion</strong>
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="OuterBar">
                      <div className="InnerBar"> </div>
                    </div>
                  </div>

                  <div className="col-lg-2">
                    <div></div>
                  </div>
                </div>
                <hr />

                <div className="row">
                  <div className="col-lg-8">
                    <span>
                      <strong>Earned in January</strong>
                    </span>
                  </div>
                  <div className="col-lg-4">
                    <p>$2000</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-8">
                    <span>
                      <strong>Response Time</strong>
                    </span>
                  </div>
                  <div className="col-lg-4">
                    <p>1Hrs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>{' '}
          {/*End of left side div */}
          <div className="col-lg-8 col-sm-7 col-md-6">
            <div className="ActiveOrderRow">
              <div className="row">
                <div className="col-lg-6">
                  <span>
                    <p>
                      <strong>Active Orders: -1 ($480)</strong>
                    </p>
                  </span>
                </div>

                <div className="col-lg-6 ">
                  <div className="ActiveOrderDropDown">
                    <li className="dropdown" style={{ listStyle: 'none' }}>
                      <a
                        href="#"
                        className="dropdown-toggle"
                        data-toggle="dropdown"
                        aria-expanded="false"
                      >
                        All Orders<b className="caret"></b>
                      </a>
                      <ul className="dropdown-menu">
                        <li>
                          <a href="index.html">Home #1</a>
                        </li>
                        <li>
                          <a href="index-2.html">Home #2</a>
                        </li>
                        <li>
                          <a href="index-3.html">Home #3</a>
                        </li>
                      </ul>
                    </li>
                  </div>
                </div>
              </div>
            </div>{' '}
            <div className="ActiveOrderDescription">
              <div className="row">
                <div className="col-lg-4">
                  <span>
                    <img
                      src={image3}
                      style={{
                        width: '30%',
                        padding: '5px 3px 5px 3px',
                        borderRadius: '2px',
                      }}
                    ></img>
                    <img
                      src={
                        'https://pps.whatsapp.net/v/t61.24694-24/291076649_581874260186733_6833089010006658180_n.jpg?ccb=11-4&oh=01_AVy3Nl8hrRixo3fSmeHCRc11puuU6k4TmN8zws1EO_2ZAQ&oe=63117172'
                      }
                      style={{
                        width: '20%',
                        padding: '5px 3px 5px 9px',
                        borderRadius: '50%',
                      }}
                    ></img>
                    <span style={{ paddingLeft: '10px' }}>
                      <strong>Ali Sher</strong>
                    </span>
                  </span>
                </div>

                <div className="col-lg-2">
                  <div style={{ marginTop: '8px' }}>
                    <div>
                      <strong style={{ color: 'green' }}>Price:</strong>
                    </div>
                    <div>
                      <strong>$45</strong>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2">
                  <div style={{ marginTop: '8px' }}>
                    <div>
                      <strong style={{ color: 'green' }}>Due In:</strong>
                    </div>
                    <div>
                      <strong>16d,15h</strong>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2">
                  <div style={{ marginTop: '8px' }}>
                    <div>
                      <strong style={{ color: 'green' }}>Status</strong>
                    </div>
                    <div
                      style={{
                        border: '1px solid black',
                        borderRadius: '9px',
                        backgroundColor: 'purple',
                        color: 'white',
                        textAlign: 'center',
                        cursor: 'context-menu',
                      }}
                    >
                      <text>In Progress</text>
                    </div>
                  </div>
                </div>

                <div className="col-lg-2">
                  <div style={{ marginTop: '20px' }}>
                    <h5>
                      <strong
                        style={{
                          color: 'green',
                          paddingLeft: '45px',
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </strong>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          </div>{' '}
        </div>
      </container>
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  user: state.auth.user,
});

export default connect(mapStatetoProps, { loadUser, startLoading, logout })(
  SellerDashboard
);
