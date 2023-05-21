import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Forget.css';
import axios from '../../axios-server';
import { connect } from 'react-redux';
import { setToast } from '../../store/actions/toast';
import {
  startLoading,
  loginUser,
  resetPassword,
} from '../../store/actions/auth';
import Spinner from '../layout/Spinner';
import { useForm } from 'react-hook-form';
import querySearch from 'stringquery';
const Forget = (props) => {
  const { register, handleSubmit, errors, reset } = useForm(); // initialize the hook
  const [Step, setStep] = useState('login');
  const [html, sethtml] = useState(<div></div>);
  const [loadingx, setLoadingX] = useState(true);
  const [erroremail, seterroremail] = useState({ msg: '', show: false });
  const [sending, setsending] = useState('nothing');
  const [code, setcode] = useState('');
  const [formData, setformData] = useState({
    newPassword: '@Ftab0306',
    email: 'aftabfalak956@gmail.com',
    confirmPassword: '@Ftab0306',
  });
  const getKeyvalue = (k) => {
    const search = props.location.search;
    const query = querySearch(decodeURI(search));

    let stringQuery = [];
    let found = false;

    if (Object.keys(query).length > 0) {
      Object.keys(query).map((key) => {
        if (k === key) {
          found = true;
          stringQuery = query[key];
        }
      });
      if (found) {
        return stringQuery;
      } else {
        return '';
      }
    } else {
      return '';
    }
  };

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

  const { newPassword, confirmPassword, email } = formData;

  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
    seterroremail({
      msg: '',
      show: false,
    });
  };

  const onSubmit = async (data) => {
    if (data.newPassword != data.confirmPassword) {
      props.setToast([
        { msg: 'New password and confirm password not match', type: 'error' },
      ]);
    } else {
      console.log('edfsd');
      props.resetPassword({
        newPassword: newPassword,
        confirmPassword: confirmPassword,
        token: getKeyvalue('code'),
      });
    }
  };

  useEffect(() => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios
      .post('/api/auth/is-expired-link', { token: getKeyvalue('code') }, config)
      .then((response) => {
        setLoadingX(false);
        if (response.data.found === false) {
          sethtml(<h3>Expried/Invalid Link</h3>);
        } else {
          sethtml(
            <div>
              <h3 className="large text-primary text-center">
                Create new passoword
              </h3>
              <form className="form" onSubmit={handleSubmit(onSubmit)}>
                {erroremail.show && (
                  <p className="errorMessage">{erroremail.msg}</p>
                )}

                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    //   value={password}
                    ref={register({
                      pattern:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                      required: true,
                    })}
                    autoComplete="off"
                    className={[
                      'inputs',
                      'form-control',
                      errors.newPassword && ' input-danger',
                    ].join(' ')}
                    required
                    name="newPassword"
                  />
                  {errors.newPassword && (
                    <p className="error-para">
                      <span className="steric-red"></span>
                      <ul className="passErrors">
                        <li>Password at least 8 character</li>
                        <li>Contain at least one uppercase letter</li>
                        <li>Contain at least one lowercase letter</li>
                        <li>Contain at least one special character</li>
                      </ul>
                    </p>
                  )}
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Enter Comfirm Password"
                    //   value={password}
                    ref={register({
                      pattern:
                        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
                      required: true,
                    })}
                    autoComplete="off"
                    className={[
                      'inputs',
                      'form-control',
                      errors.confirmPassword && ' input-danger',
                    ].join(' ')}
                    required
                    name="confirmPassword"
                  />
                  {errors.confirmPassword && (
                    <p className="error-para">
                      <span className="steric-red"></span>{' '}
                      <ul className="passErrors">
                        <li>Password at least 8 character</li>
                        <li>Contain at least one uppercase letter</li>
                        <li>Contain at least one lowercase letter</li>
                        <li>Contain at least one special character</li>
                      </ul>
                    </p>
                  )}
                </div>

                <input
                  type="submit"
                  className="btn  btn-primary form-control theme1-button login-button"
                  value="Submit"
                />
              </form>
            </div>
          );
        }
      });
  }, []);

  return (
    <Fragment>
      {props.loading ? (
        <Spinner cls="abs" />
      ) : (
        <section className="container">
          <div className="row">
            <div className="col-md-12">
              <div id="login">
                {loadingx === true ? <Spinner /> : html}
                <div className="seperator-login"></div>
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
export default connect(mapStatetoProps, {
  startLoading,
  loginUser,
  setToast,
  resetPassword,
})(Forget);
