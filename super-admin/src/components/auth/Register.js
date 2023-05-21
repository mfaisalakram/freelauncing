import React, { useState  } from "react";
import { Link,Redirect } from "react-router-dom";
import axios from "axios";
import {connect} from 'react-redux'
import {setAlert} from '../../store/actions/alert'
import {register, loadUser} from '../../store/actions/auth'
const Register = ({setAlert,register,isAuthenticated}) => {
  const [formData, setformData] = useState({
    name: "Aftab ",
    email: "agtab@gmail.com",
    password: "123456",
    password2: "123456"
  });
  const { name, email, password, password2 } = formData;
  const onChange = e => {
    setformData({ ...formData, [e.target.name]: e.target.value });
   

  };
  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      setAlert("password not match","danger");
      console.log("password not match");
    } else {
      register({name,email,password})
      console.log("password match");
      const newUser = {
        name,
        email,
        password
      };

      try {
        const config = {
          headers: {
            "Content-Type": "application/json"
          }
        };
        const body = JSON.stringify(newUser);
        const res = await axios.post("api/users", body, config);
        console.log(res.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  if(isAuthenticated){
    return (
      <Redirect to="/"/>
    )
  }
  return (
    <section className="container">
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            value={name}
            onChange={e => onChange(e)}
            placeholder="Name"
            name="name"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={e => onChange(e)}
            placeholder="Email Address"
            name="email"
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  );
};
const mapStatetoProps=state=>({
  isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStatetoProps,{setAlert,register,loadUser})(Register);
