import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { loadUser, startLoading, logout } from '../../store/actions/auth';
import './Header.css';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from '../../axios-server';
import logo from '../../img/alpha.png';
// import ModalExample from "./ModeReactStrap";
import Model from '../layout/Model';
import ModelX from './ModelX';
import { Link } from 'react-router-dom';
const Header = (props) => {
  useEffect(() => {
    // props.loadUser();
  }, []);

  const SwitchtoBuying = (e) => {
    e.preventDefault();

    axios.get('/api/auth/switch-to-buying').then((res) => {
      localStorage.setItem('userToken', res.data.token);

      window.location.href = '/services/search';
    });
  };

  const SwitchtoSelling = (e) => {
    e.preventDefault();

    axios.get('/api/auth/switch-to-selling').then((res) => {
      localStorage.setItem('userToken', res.data.token);
      window.location.href = '/';
    });
  };

  let header = (
    <header className="tr-header">
      <nav className="navbar navbar-default">
        <div className="container-fluid">
          <div className="navbar-header">
            <button
              type="button"
              className="navbar-toggle collapsed"
              data-toggle="collapse"
              data-target="#navbar-collapse"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">
              <img src={logo} className="logo" width={'100%'} alt="Image" />
            </a>
          </div>

          {/* <div className="navbar-left">
       <div className="collapse navbar-collapse" id="navbar-collapse">
        <ul className="nav navbar-nav">
         <li><a href="hire.html">GoHire</a></li>
         <li><a href="work.html">GoWork</a></li>
         <li><a href="pricing.html">Pricing</a></li>
         <li><a href="how.html">How it works</a></li>
        </ul>
       </div>
      </div> */}
          <div className="navbar-right">
            <div className="collapse navbar-collapse" id="navbar-collapse">
              <ul className="nav navbar-nav">
                {/* <li>
                  <a href="business">Eaglance Business </a>
                </li>
                <li>
                  <a href="explore">Explore </a>
                </li>
                <li>
                  <a href="#">English </a>
                </li>
                <li>
                  <a href="#">$USD</a>
                </li> */}
                <li>
                  <a href="/aggrement/selling-on-eaglance">Become a Seller</a>
                </li>
                <li>
                  <a href="/login">Signin </a>
                </li>
                <li>
                  <a href="/join">Join </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );

  let verifyEmail = <div></div>;
  if (props.isAuthenticated && props.user) {
    console.log(props.user.account_type);
    if (props.user.account_type === 'banned') {
    }
    // else if (props.user.account_status === 'notverified') {
    //   verifyEmail = (
    //     <div className=" alert alert-danger verifyemail">
    //       <p>
    //         Your email is not verified yet.We send you confirmation code at{' '}
    //         <strong>{props.user.email}</strong>.
    //         <a href="#" data-toggle="modal" data-target="#confirmEmail">
    //           {' '}
    //           Enter code
    //         </a>{' '}
    //         {/* |{" "}
    //         <a data-toggle="modal" data-target="#changemail" href="#">
    //           Change email
    //         </a> */}
    //       </p>
    //     </div>
    //   );
    // }
    if (props.user.current_type === 'seller') {
      header = (
        <header className="tr-header">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle collapsed"
                  data-toggle="collapse"
                  data-target="#navbar-collapse"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">
                  <img src={logo} className="logo" alt="Image" />
                </a>
              </div>

              <div className="navbar-left">
                <div className="collapse navbar-collapse" id="navbar-collapse">
                  <ul className="nav navbar-nav">
                    <li>
                      <a href="/">Dashboard</a>
                    </li>
                    <li>
                      <a href="/messages">Messages</a>
                    </li>
                    <li>
                      <a href="/orders">Orders</a>
                    </li>
                    <li>
                      <a href="/services">Services</a>
                    </li>
                    <li>
                      <a href="/earnings">Earnings</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="navbar-right">
                <ul className="nav navbar-nav">
                  {/* <li><i className="fa fa-user"></i></li> */}
                  <li>
                    <a href="" onClick={SwitchtoBuying}>
                      Switch to Buying
                    </a>
                  </li>

                  <li className="dropdown mega-avatar">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="true"
                    >
                      <span className="avatar w-32">
                        <img
                          src={
                            '/assets/uploads/users/' +
                            props.user.username +
                            '/profileImages/' +
                            props.user.profile_image
                          }
                          className="img-resonsive img-circle"
                          width="25"
                          height="25"
                          alt="..."
                        />
                      </span>
                      {'   '}

                      <span>{props.user.fname} </span>
                    </a>
                    <div className="dropdown-menu w dropdown-menu-scale pull-right">
                      <a className="dropdown-item" href="dashboard.html">
                        <span>Dashboard</span>
                      </a>
                      <Link className="dropdown-item" to="/edit-profile">
                        <span>Profile</span>
                      </Link>
                      <Link className="dropdown-item" to="/edit-profile">
                        <span>Settings</span>
                      </Link>
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          props.logout();
                        }}
                        href="#"
                      >
                        logout
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      );
    } else {
      header = (
        <header className="tr-header">
          <nav className="navbar navbar-default">
            <div className="container-fluid">
              <div className="navbar-header">
                <button
                  type="button"
                  className="navbar-toggle collapsed"
                  data-toggle="collapse"
                  data-target="#navbar-collapse"
                >
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                </button>
                <a className="navbar-brand" href="/">
                  <img src={logo} className="logo" alt="Image" />
                </a>
              </div>

              <div className="navbar-left">
                <div className="collapse navbar-collapse" id="navbar-collapse">
                  <ul className="nav navbar-nav">
                    {/* <li>
                      <a href="/">Dashboard</a>
                    </li> */}
                  </ul>
                </div>
              </div>
              <div className="navbar-right">
                <ul className="nav navbar-nav">
                  {/* <li><i className="fa fa-user"></i></li> */}
                  <li>
                    <a href="/messages">Messages</a>
                  </li>
                  <li>
                    <a href="/my-orders">My Orders</a>
                  </li>
                  <li>
                    {props.user.account_type.includes('seller') ? (
                      <a href="" onClick={SwitchtoSelling}>
                        Switch to Selling
                      </a>
                    ) : (
                      <a href="/aggrement/selling-on-eaglance">
                        Become a Seller
                      </a>
                    )}
                  </li>

                  <li className="dropdown mega-avatar">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                      aria-expanded="true"
                    >
                      <span className="avatar w-32">
                        <img
                          src={
                            '/assets/uploads/users/' +
                            props.user.username +
                            '/profileImages/' +
                            props.user.profile_image
                          }
                          className="img-resonsive img-circle"
                          width="25"
                          height="25"
                          alt="..."
                        />
                      </span>
                      {'   '}

                      <span>{props.user.fname} </span>
                    </a>
                    <div className="dropdown-menu w dropdown-menu-scale pull-right">
                      <a className="dropdown-item" href="dashboard.html">
                        <span>Dashboard</span>
                      </a>
                      <a className="dropdown-item" href="profile.html">
                        <span>Profile</span>
                      </a>
                      <a className="dropdown-item" href="editprofile.html">
                        <span>Settings</span>
                      </a>
                      <a
                        className="dropdown-item"
                        onClick={() => {
                          props.logout();
                        }}
                        href="#"
                      >
                        logout
                      </a>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
      );
    }
  }

  return (
    <Fragment>
      {header}
      {verifyEmail}

      <ModelX
        action={null}
        loadUser={props.loadUser}
        user={props.user}
        title="Account Verification"
        modelID="confirmEmail"
      />
      <Model action={null} content={null} title="d" modelID="changemail" />

      {/* <ModalExample/> */}
      {/* <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#confirmEmail">
  Launch demo modal
</button> */}
      {/* 
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <a href="#" className="navbar-brand">
          Brand
        </a>
        <button
          type="button"
          className="navbar-toggler"
          data-toggle="collapse"
          data-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarCollapse"
        >
          <div className="navbar-nav">
            <a href="#" className="nav-item nav-link active">
              Home
            </a>
            <a href="#" className="nav-item nav-link">
              Profile
            </a>
            <div className="nav-item dropdown">
              <a
                href="#"
                className="nav-link dropdown-toggle"
                data-toggle="dropdown"
              >
                Messages
              </a>
              <div className="dropdown-menu">
                <a href="#" className="dropdown-item">
                  Inbox
                </a>
                <a href="#" className="dropdown-item">
                  Sent
                </a>
                <a href="#" className="dropdown-item">
                  Drafts
                </a>
              </div>
            </div>
          </div>
          <form className="form-inline">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search"
              />
              <div className="input-group-append">
                <button type="button" className="btn btn-secondary">
                  <i className="fa fa-search"></i>
                </button>
              </div>
            </div>
          </form>
          <div className="navbar-nav">
            <a href="#" className="nav-item nav-link">
              Login
            </a>
          </div>
        </div>
      </nav>
   */}
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  user: state.auth.user,
});
export default connect(mapStatetoProps, { loadUser, startLoading, logout })(
  Header
);
