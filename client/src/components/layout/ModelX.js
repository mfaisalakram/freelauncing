import React, { useState } from 'react';
import axios from '../../axios-server';
const ModelX = ({ action, title, user, modelID, loadUser }) => {
  const [sending, setsending] = useState('notsending');
  const [code, setcode] = useState('');
  const [verified, setverified] = useState(false);
  const [error, seterror] = useState(false);

  const resend = async () => {
    setsending('sending');
    let res = await axios.post('/api/users/resend-code');
    if (res.data.send) {
      setsending('sent');

      setTimeout(() => {
        setsending('notsending');
      }, 5000);
    }
  };

  const checkCode = async () => {
    let res = await axios.post('/api/users/check-code/' + code);
    if (res.data.found) {
      setverified(true);
      loadUser();

      setTimeout(() => {}, 5000);
    } else {
      seterror(true);
    }
  };

  let content = (
    <div>
      <h4>Verify email address</h4>
      <p>we send a verification email to the following address:</p>
      <p>
        <strong>{user && user.email}</strong>
      </p>
      <p>Please check your inbox and provide the varification code</p>
      <p>
        Verification code:{' '}
        <input
          type="text"
          name="code"
          value={code}
          onChange={(e) => {
            setcode(e.target.value);
            seterror(false);
          }}
        />
      </p>
      {error && (
        <p className="alert alert-danger">
          *Enter wrong code please check you mail carefully
        </p>
      )}
    </div>
  );

  if (verified) {
    content = (
      <div>
        <h3>Account Verified..!</h3>
      </div>
    );
  }

  return (
    <div
      className="modal "
      id={modelID}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5
              style={{ display: 'inline-block' }}
              className="modal-title"
              id="exampleModalLabel"
            >
              {title}
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{content}</div>
          <div className="modal-footer">
            {!verified && (
              <button
                type="button"
                className="btn btn-default pull-left"
                onClick={resend}
              >
                {sending === 'sending'
                  ? 'Sending'
                  : sending === 'notsending'
                  ? 'Resend code'
                  : 'Code Sent'}
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            {!verified && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={checkCode}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelX;
