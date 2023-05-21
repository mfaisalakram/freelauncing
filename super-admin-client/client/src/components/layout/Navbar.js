import React from "react";
import {Link} from 'react-router-dom'
import {logout} from '../../store/actions/auth';
import {connect} from 'react-redux';
const Navbar = ({auth,logout}) => {

  let links=(

    <ul>
      <li>
      <Link to="/profiles">Developers</Link>
    </li>
      <li>
      <Link to="/dashboard">Dashboard</Link>
    </li>
    <li>
      <Link to="#!" onClick={logout}>Logout</Link>
    </li>
  </ul>
  );
if(!auth.isAuthenticated){
  links=(
    <ul>
    <li>
      <Link to="/profiles">Developers</Link>
    </li>
    <li>
      <Link to="/register">Register</Link>
    </li>
    <li>
      <Link to="/login">Login</Link>
    </li>
  </ul>

  );
}

  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>
     {links}
    </nav>
  );
};
const mapStatetoProps=state=>{
  return({
   auth:state.auth
})
}
export default connect(mapStatetoProps,{logout})(Navbar);
