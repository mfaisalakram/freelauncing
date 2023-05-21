import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from 'react-redux'
const PrivateRouter = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        !isAuthenticated && !loading ? (
          <Redirect to="/login" />
          // console.log("dfdfsf")
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};
PrivateRouter.prototype={
    auth:PropTypes.object.isRequired
}
const mapStatetoProps=state=>({
   auth:state.auth
})
export default connect(mapStatetoProps)(PrivateRouter);
