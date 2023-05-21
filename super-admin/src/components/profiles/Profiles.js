import React, { Fragment,useEffect } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux';
import {getProfiles} from '../../store/actions/profile';
import ProfileItem from '../profiles/ProfileItem'
import Spinner from '../layout/Spinner'
const Profiles = ({profile:{profiles,loading},getProfiles})=> {
    useEffect(() => {
      getProfiles();
    }, [])
    return <Fragment>

       {loading==true?<Spinner/>:
        <Fragment>
            <h2 className="large primary-text">Developers</h2>
            <p className="lead">
                <i className="fab connectdevlop"></i>Browse and connect with develops
            </p>
            <div className="profiles">
                {
                profiles.length>0?
                profiles.map(profile=>(
                    <ProfileItem key={profile._id} profile={profile} />
                ))
                :
                <h1>No Profile found</h1>
                }
         </div>
        </Fragment>
        
                }

        </Fragment>
}

Profiles.propTypes = {
  getProfiles:PropTypes.func.isRequired,
  profile:PropTypes.object.isRequired,
}
const mapStatetoProps=state=>({
    profile:state.profile
});
export default connect(mapStatetoProps,{getProfiles})(Profiles);
