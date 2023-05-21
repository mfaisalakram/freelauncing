import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setToast } from '../../store/actions/toast';
const PrivateRouter = ({ render: render, setToast, auth, ...rest }) => {
  if (auth.isAuthenticated === false) {
    setToast([
      { msg: 'Unauthorized request! please Login here', type: 'error' },
    ]);
  }

  console.log('auth', auth);
  console.log(auth.isAuthenticated);
  return (
    <Route
      {...rest}
      render={(props) =>
        auth.isAuthenticated === false ? <Redirect to="login" /> : render(props)
      }
    />
  );
};
PrivateRouter.prototype = {
  auth: PropTypes.object.isRequired,
};
const mapStatetoProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStatetoProps, { setToast })(PrivateRouter);
