import React, { useState, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Login.css';
import { connect } from 'react-redux';
import { loginUser, startLoading } from '../../../store/actions/auth';
import Spinner from '../../layout/Spinner';

const Login = ({ isAuthenticated, loginUser, loading, startLoading }) => {
  const [formData, setformData] = useState({
    email: '',
    password: '',
  });
  const { email, password } = formData;
  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    startLoading();
    // loginUser(email, password);
    window.location.assign('http://localhost:3001/dashboard');
  };

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <Fragment>
      {loading ? (
        <Spinner />
      ) : (
        <div className="cui__utils__content">
          <div className="cui__auth__authContainer">
            <div className="cui__auth__topbar">
              <div className="cui__auth__logoContainer"></div>
            </div>
            <div className="cui__auth__containerInner">
              <div className="text-center mb-5">
                <h1 className="mb-5 px-3">
                  <strong>
                    Welcome to AlphaWork <small>(Super Admin Panel)</small>
                  </strong>
                </h1>
              </div>
              <div className="card cui__auth__boxContainer">
                <div className="text-dark font-size-24 mb-4">
                  <strong>Sign in to your account</strong>
                </div>
                <form action="#" className="mb-4" onSubmit={(e) => onSubmit(e)}>
                  <div className="form-group mb-4">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email Address"
                      name="email"
                      value={email}
                      onChange={(e) => onChange(e)}
                      required
                    />
                  </div>
                  <div className="form-group mb-4">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => onChange(e)}
                      name="password"
                      required
                    />
                  </div>
                  <button className="btn btn-primary text-center w-100">
                    <strong>Log In</strong>
                  </button>
                </form>
                <a
                  href="auth-forgot-password.html"
                  className="kit__utils__link font-size-16"
                >
                  Forgot password?
                </a>
              </div>
              <div className="text-center pt-2 mb-auto">
                <span className="mr-2">Don't have an account?</span>
                <a
                  href="auth-register.html"
                  className="kit__utils__link font-size-16"
                >
                  Sign up
                </a>
              </div>
            </div>
            <div className="mt-auto pb-5 pt-5">
              <ul className="cui__auth__footerNav list-unstyled d-flex mb-0 flex-wrap justify-content-center">
                <li className="list-inline-item">
                  <a href="javascript: void(0);">Terms of Use</a>
                </li>
                <li className="list-inline-item">
                  <a href="javascript: void(0);">Compliance</a>
                </li>
                <li className="list-inline-item">
                  <a href="javascript: void(0);">Support</a>
                </li>
                <li className="list-inline-item">
                  <a href="javascript: void(0);">Contacts</a>
                </li>
              </ul>
              <div className="text-center">
                Copyright © 2017-2020 Mdtk Soft |
                <a
                  href="https://www.mediatec.org/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});
export default connect(mapStatetoProps, { loginUser, startLoading })(Login);
