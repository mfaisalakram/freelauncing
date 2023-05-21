import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProfileByID } from "../../store/actions/profile";
const Profile = ({
  profile: { profile, loading },
  match,
  auth,
  getProfileByID
}) => {
  useEffect(() => {
    getProfileByID(match.params.id);
  }, [getProfileByID]);
  return (
    <Fragment>
      <Link to="/profiles" className="btn btn-light">
        Back to profiles
      </Link>
      {auth.isAuthenticated && auth.user._id === profile.user._id && (
          <Link to="/edit-profile" className="btn btn-dark">Edit Profile</Link>
        )}
    </Fragment>
  );
};

Profile.propTypes = {
  getProfileByID: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};
const mapStatetoProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(mapStatetoProps, { getProfileByID })(Profile);
