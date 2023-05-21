import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Login.css';
import axios from '../../axios-server';
import { connect } from 'react-redux';
import { startLoading, loginUser } from '../../store/actions/auth';
import Spinner from '../layout/Spinner';

const Login = (props) => {
  // console.log();
  console.log(props);
  const [Step, setStep] = useState('login');

  const [erroremail, seterroremail] = useState({ msg: '', show: false });
  const [sending, setsending] = useState('nothing');
  const [code, setcode] = useState('');
  const [formData, setformData] = useState({
    email: 'aftabfalak956@gmail.com',
    password: '@Ftab0306',
  });

  const resend = async () => {
    setsending('sending');
    let res = await axios.post('/api/auth/send-reset-link/', {
      email: email,
    });
    if (res.data.send) {
      setsending('sent');
      setStep('send');
    }
  };

  const checkCode = async () => {
    let res = await axios.post('/api/users/check-code/' + code);
    if (res.data.found) {
      // setverified(true);
      // loadUser();

      setTimeout(() => {}, 5000);
    } else {
      // seterror(true);
    }
  };

  useEffect(() => {}, []);

  const { email, password } = formData;

  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
    seterroremail({
      msg: '',
      show: false,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // props.registerUser({fname:fname, lname:lname, email:email, password:password, username:username});
    props.loginUser(email, password);
  };

  if (props.isAuthenticated) {
    window.location.href = '/';
  }
  let html = (
    <div>
      {' '}
      <h2 className="large text-primary text-center">Sign in to Alphawork</h2>
      <form className="form" onSubmit={(e) => onSubmit(e)}>
        {erroremail.show && <p className="errorMessage">{erroremail.msg}</p>}
        <div className="form-group">
          <input
            type="text"
            placeholder="Email or Username"
            name="email"
            autoComplete="off"
            value={email}
            className="inputs form-control"
            onChange={(e) => onChange(e)}
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            autoComplete="off"
            className="inputs form-control"
            onChange={(e) => onChange(e)}
            name="password"
          />
        </div>

        <input
          type="submit"
          className="btn  btn-primary form-control theme1-button login-button"
          value="Login"
        />
        <br />
        <div className="forget-div" onClick={() => setStep('enterEmail')}>
          <span className="forget">forget password?</span>
        </div>
      </form>
    </div>
  );

  if (Step === 'enterEmail') {
    html = (
      <div>
        {' '}
        <h2 className="large text-primary text-center">Forget Password</h2>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          {erroremail.show && <p className="errorMessage">{erroremail.msg}</p>}
          <div className="form-group">
            <p>Enter email</p>
            <input
              type="text"
              placeholder="Email or Username"
              name="email"
              autoComplete="off"
              value={email}
              className="inputs form-control"
              onChange={(e) => onChange(e)}
              required
            />
            <br />
            <p>
              <small>We will send reset password link to your email</small>
            </p>

            {sending === 'sending' ? (
              <Spinner />
            ) : (
              <button
                type="button"
                className="btn  btn-primary form-control theme1-button login-button"
                onClick={resend}
              >
                {' '}
                {sending === 'sending'
                  ? 'Sending'
                  : sending === 'nothing'
                  ? 'Send Code'
                  : 'Code Sent'}{' '}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  } else if (Step === 'send') {
    html = (
      <div>
        {' '}
        <h2 className="large text-primary text-center">Forget Password</h2>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          {erroremail.show && <p className="errorMessage">{erroremail.msg}</p>}
          <div className="form-group">
            <p>Reset password link send to your email</p>

            <br />
            <p>
              <small>
                Please check your email, we sent you a reset password link.
              </small>
            </p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <Fragment>
      {props.loading ? (
        <Spinner cls="abs" />
      ) : (
        <section className="container">
          <div className="row">
            <div className="col-md-12">
              <div id="login">
                {html}

                <div className="seperator-login">
                  <p className="or text-center">Or</p>
                </div>

                <div className="socialLogin">
                  <a
                    href="/auth/google"
                    type="button"
                    className="google-signing-button"
                  >
                    <span
                      className="fit-icon"
                      style={{ width: '18px', height: '18px' }}
                    >
                      <svg
                        width="18"
                        height="19"
                        viewBox="0 0 18 19"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 7.84363V11.307H13.8438C13.6365 12.428 12.9994 13.373 12.0489 14.0064V16.2534H14.9562C16.6601 14.6951 17.641 12.4029 17.641 9.67839C17.641 9.04502 17.5854 8.43176 17.4792 7.84865H9V7.84363Z"
                          fill="#3E82F1"
                        ></path>
                        <path
                          d="M9.00001 14.861C6.65394 14.861 4.67192 13.2876 3.96406 11.1714H0.955627V13.4937C2.43709 16.4142 5.48091 18.4198 9.00001 18.4198C11.432 18.4198 13.4697 17.6206 14.9562 16.2533L12.0489 14.0064C11.245 14.5443 10.2135 14.861 9.00001 14.861Z"
                          fill="#32A753"
                        ></path>
                        <path
                          d="M3.96404 5.45605H0.955617C0.348876 6.66246 0 8.02972 0 9.47238C0 10.915 0.348876 12.2823 0.955617 13.4887L3.96404 11.1714C3.78202 10.6335 3.6809 10.0605 3.6809 9.47238C3.6809 8.88426 3.78202 8.31122 3.96404 7.77336V5.45605Z"
                          fill="#F9BB00"
                        ></path>
                        <path
                          d="M0.955627 5.45597L3.96406 7.77327C4.67192 5.65703 6.65394 4.08368 9.00001 4.08368C10.3197 4.08368 11.5079 4.53608 12.4382 5.42078L15.0219 2.85214C13.4646 1.40948 11.427 0.52478 9.00001 0.52478C5.48091 0.52478 2.43709 2.53043 0.955627 5.45597Z"
                          fill="#E74133"
                        ></path>
                      </svg>
                    </span>
                    <p>Continue with Google</p>
                  </a>
                  <a
                    type="button"
                    href="/auth/facebook"
                    className="facebook-signing-button"
                  >
                    <span
                      className="fit-icon"
                      style={{ width: '18px', height: '18px', fill: 'white' }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.0062 0H0.99375C0.445312 0 0 0.445312 0 0.99375V17.0062C0 17.5547 0.445312 18 0.99375 18H9V10.875H6.84844V8.25H9V6.30938C9 3.98438 10.6125 2.71875 12.6891 2.71875C13.6828 2.71875 14.7516 2.79375 15 2.82656V5.25469H13.3453C12.2156 5.25469 12 5.78906 12 6.57656V8.25H14.6906L14.3391 10.875H12V18H17.0062C17.5547 18 18 17.5547 18 17.0062V0.99375C18 0.445312 17.5547 0 17.0062 0Z"
                          fill="white"
                        ></path>
                      </svg>
                    </span>
                    <p>Continue with Facebook</p>
                  </a>
                </div>

                <div className="seperator-login"></div>
                <p className="my-1 login-bottom">
                  Not a member yet?{' '}
                  <Link to="/join">
                    {' '}
                    <span className="text-color register-login-button">
                      join now
                    </span>{' '}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
});
export default connect(mapStatetoProps, { startLoading, loginUser })(Login);
