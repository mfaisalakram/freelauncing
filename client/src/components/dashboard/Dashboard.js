import React, { useEffect, Fragment } from "react";
import { connect } from "react-redux";
import {Link} from 'react-router-dom'
import { getUserProfile} from "../../store/actions/profile";
import { deleteAccount} from "../../store/actions/auth";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import DashboardActions from './DashboardActions'
import Experience from './Experience';
import Education from './Education';
const Dashboard = ({ getUserProfile, auth, profile:{profile,loading},deleteAccount }) => {
  useEffect(() => {
    getUserProfile();
  }, []);
  
  return loading && profile===null? <Spinner /> :
  <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
          <i className="fas fa user"></i>
          Welcome {auth.user && auth.user.name}
      </p>
      {profile!==null? 
      (<Fragment> 
          <DashboardActions />
          <Experience experience={profile.experience} />
          <Education  education={profile.education}/>

          <div className='my-2'>
            <button className="btn btn-danger" onClick={()=>deleteAccount()}>
              <i className="fas fa-user-minus">Delete my Account</i>
            </button>
          </div>
      </Fragment>)
      :
      (<Fragment>
          <p>you have not yet setup a profile,please add some info</p>
          <Link to='/create-profile' className="btn btn-primary my-1">Create Profile</ Link>
      </Fragment>)
    }
  </Fragment>;
};
Dashboard.prototype = {
  getUserProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});
export default connect(mapStateToProps, { getUserProfile,deleteAccount })(Dashboard);
