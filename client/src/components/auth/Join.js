import React, { useState, useEffect, Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Join.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { connect } from 'react-redux';
import { startLoading, registerUser } from '../../store/actions/auth';
import Spinner from '../layout/Spinner';
import eaglanceSpinner from '../../img/25.gif';
import tick from '../../img/tick.png';
import { setToast } from '../../store/actions/toast';
import cross from '../../img/cross.png';
import querySearch from 'stringquery';
const Join = (props) => {
  const { register, handleSubmit, errors, reset } = useForm(); // initialize the hook
  const [erroremail, seterroremail] = useState({ msg: '', show: false });
  const [formData, setformData] = useState({
    email: '',
    emailVerified: false,
  });
  const [usernameChecking, setusernameChecking] = useState('empty');

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

  const { emailVerified, email } = formData;

  useEffect(() => {
    if (getKeyvalue('fname')) {
      reset({ fname: getKeyvalue('fname'), lname: getKeyvalue('lname') });
      setformData({
        ...formData,
        emailVerified: true,
        email: getKeyvalue('email'),
      });

      props.setToast([{ msg: 'Set username and Password', type: 'info' }]);
    }
  }, []);
  const onBackClick = (e) => {
    setformData({
      ...formData,
      emailVerified: false,
    });
    console.log(email);
  };

  const onChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
    seterroremail({
      msg: '',
      show: false,
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();

    await axios
      .get('http://localhost:5000/api/auth/checkemail/' + email)
      .then((response) => {
        console.log(response);

        if (response.data.found) {
          seterroremail({
            msg: '*user already exists',
            show: true,
          });
        }

        setformData({
          ...formData,
          emailVerified: !response.data.found,
        });
      })
      .catch((err) => {});
  };

  const checkUsername = async (username) => {
    let x = '';
    x = await axios.get(
      'http://localhost:5000/api/auth/checkusername/' + username
    );

    if (x.data.found) {
      return 'found';
    }
    return 'notfound';
  };

  const onTypingUsername = async (e) => {
    // e.preventDefault();

    let exp = /^(?=.{6,18}$)(?![0-9_])(?!.*[_.]{2})[a-zA-Z0-9_]+(?<![_])$/;

    // console.log(e.target.p.test(e.target.value));
    if (exp.test(e.target.value)) {
      delete errors.username;
      //   console.log("xx",await checkUsername(e.target.value));
      setusernameChecking(await checkUsername(e.target.value));
      delete errors.username;
    } else {
      if (e.target.value === '') delete errors.username;
      else errors.username = 's';
      setusernameChecking('');
    }
  };

  let loadingHtml = <div></div>;

  if (usernameChecking === 'loading') {
    loadingHtml = <img src={eaglanceSpinner} className="checking" alt="" />;
  } else if (usernameChecking === 'found') {
    loadingHtml = <img src={cross} className="checking" alt="" />;
  } else if (usernameChecking === 'notfound') {
    loadingHtml = <img src={tick} className="checking" alt="" />;
  }
  const onSubmit = async (data) => {
    console.log(data);
    if (data.password === data.comfirmPassword) {
      props.setToast([
        { msg: 'Password and confirm password not match', type: 'error' },
      ]);
    } else if ((await checkUsername(data.username)) === 'found') {
      props.setToast([
        { msg: 'user already register with this username', type: 'error' },
      ]);
    } else {
      props.registerUser({
        fname: data.fname,
        lname: data.lname,
        email: email,
        password: data.password,
        username: data.username,
      });
    }
  };

  let html = (
    <form className="form" onSubmit={(e) => onSubmitEmail(e)}>
      {erroremail.show && <p className="errorMessage">{erroremail.msg}</p>}
      <div className="form-group">
        <input
          type="email"
          placeholder="Email Address"
          name="email"
          value={email}
          onChange={(e) => onChange(e)}
          //autoComplete="off"
          className="inputs form-control"
        />
      </div>

      <input
        type="submit"
        className="btn  btn-primary form-control theme1-button login-button"
        value="Continue"
        // style={{ backgroundColor: '#FBBD6B' }}
      />
    </form>
  );
  if (emailVerified) {
    html = (
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" />
        <input type="hidden" />
        <div className="form-group username-div">
          <input
            type="text"
            placeholder="Username"
            name="username"
            ref={register({
              pattern:
                /^(?=.{3,18}$)(?![0-9_])(?!.*[_.]{2})[a-zA-Z0-9_]+(?<![_])$/,
              required: true,
            })}
            autoComplete="off"
            onChange={onTypingUsername}
            className={[
              'inputs',
              'form-control',
              errors.username && ' input-danger',
            ].join(' ')}
            required
          />
          {console.log(errors)}

          {errors.username && (
            <p className="error-para">
              <span className="steric-red"></span>username alpha numeric and
              underscore. cannot start with number and underscore. cannot end
              with underscore
            </p>
          )}
          {loadingHtml}
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            ref={register({
              pattern: /^[A-Za-z ]+$/i,
              required: true,
              minLength: 3,
              maxLength: 15,
            })}
            //   value={fname}
            autoComplete="off"
            className={[
              'inputs',
              'form-control',
              errors.fname && ' input-danger',
            ].join(' ')}
            //        onChange={e => onChange(e)}
            name="fname"
            required
          />
          {errors.fname && (
            <p className="error-para">
              <span className="steric-red"></span>Fisrt name only allowed alpha
              Alphabets
            </p>
          )}
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Last Name"
            // value={lname}
            ref={register({
              pattern: /^[A-Za-z ]+$/i,
              required: true,
              minLength: 3,
              maxLength: 15,
            })}
            required
            autoComplete="off"
            className={[
              'inputs',
              'form-control',
              errors.lname && ' input-danger',
            ].join(' ')}
            //onChange={e => onChange(e)}
            name="lname"
          />
          {errors.lname && (
            <p className="error-para">
              <span className="steric-red"></span>last name only allowed alpha
              Alphabets and min 3 characters
            </p>
          )}
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
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
              errors.password && ' input-danger',
            ].join(' ')}
            //      onChange={e => onChange(e)}
            required
            name="password"
          />
          {errors.password && (
            <p className="error-para">
              <span className="steric-red"></span>Please enter a password at
              least 8 character and contain At least one uppercase.At least one
              lower case.At least one special character.
            </p>
          )}
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            //  value={confirmpassword}
            ref={register({
              pattern:
                /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
              required: true,
            })}
            required
            autoComplete="off"
            className={[
              'inputs',
              'form-control',
              errors.confirmpassword && ' input-danger',
            ].join(' ')}
            // onChange={e => onChange(e)}
            name="confirmpassword"
          />
          {errors.confirmpassword && (
            <p className="error-para">
              <span className="steric-red"></span>Please enter a comfirm
              password at least 8 character and contain At least one
              uppercase.At least one lower case.At least one special character.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn  btn-primary form-control  login-button"
        >
          Join Now
        </button>
        <br />

        <p
          type="button"
          className="back-join"
          onClick={(e) => onBackClick(e)}
          style={{ marginTop: '10px', padding: '5px', pointer: 'cursor' }}
        >
          back
        </p>
      </form>
    );
  }
  return (
    <Fragment>
      {console.log(formData)}
      {props.loading ? (
        <Spinner />
      ) : (
        <section className="container">
          <div className="row">
            <div className="col-md-12">
              <div id="Join">
                <h1 className="large text-primary text-center">
                  Join Alphawork
                </h1>

                {html}

                <div className="seperator-login">
                  <p className="or text-center">Or</p>
                </div>

                <div className="socialLogin">
                  {/*                   
                  <button type="button" className="apple-signing-button">
                    <span className="fit-icon" style={{width: "18px",height: "18px"}}>
                      <svg
                        width="16"
                        height="18"
                        viewBox="0 0 16 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.6442 9.51027C12.6362 8.03572 13.3031 6.92277 14.6531 6.10313C13.8978 5.02232 12.7567 4.42768 11.25 4.31116C9.82366 4.19866 8.26473 5.14286 7.6942 5.14286C7.09152 5.14286 5.70938 4.35134 4.62455 4.35134C2.38259 4.3875 0 6.13929 0 9.70313C0 10.7558 0.192857 11.8433 0.578571 12.9656C1.09286 14.4402 2.94911 18.0563 4.88571 17.996C5.89821 17.9719 6.61339 17.2768 7.93125 17.2768C9.20893 17.2768 9.87187 17.996 11.0009 17.996C12.9536 17.9679 14.633 14.6813 15.1232 13.2027C12.5036 11.9692 12.6442 9.58661 12.6442 9.51027ZM10.3701 2.91295C11.467 1.61116 11.3665 0.425893 11.3344 0C10.3661 0.05625 9.24509 0.658929 8.60625 1.40223C7.90313 2.19777 7.48929 3.18214 7.57768 4.29107C8.62634 4.37143 9.58259 3.83304 10.3701 2.91295Z"
                          fill="#ffffff"
                        ></path>
                      </svg>
                    </span>
                    <p>Continue with Apple</p>
                  </button>
                 */}
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
                  Already a member?{' '}
                  <Link to="/login">
                    {' '}
                    <span className="register-login-button">login</span>{' '}
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
export default connect(mapStatetoProps, {
  startLoading,
  registerUser,
  setToast,
})(Join);
