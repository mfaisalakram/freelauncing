import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addEducation } from "../../store/actions/profile";
import { withRouter,Link } from "react-router-dom";

const AddEducation = ({addEducation,history}) => {
   
   const [formData,setFromData]=useState({
    school:'',
    degree:'',
    fieldofstudy:'',
    from:'',
    description:'',
    to:'',
    current:false
    
   })
const[toDataDisbled,toggleDisabled]=useState(false)
const onChange=e=>setFromData({...formData,[e.target.name]:e.target.value})

const onSubmit=e=>{
  e.preventDefault();
  addEducation(formData,history)
}
   const{
    school,
    degree,
    fieldofstudy,
    from, 
    description,
    to,
    current,
   }=formData;  return (
    <Fragment>
      <h1 className="large text-primary">Add Your Education</h1>
      <p className="lead">
        <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc
        that you have attended
      </p>
      <small style={{ color: "red" }}>* = required field</small>
      <form className="form" onSubmit={e=>onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            value={school} onChange={e=>onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            required
            value={degree} onChange={e=>onChange(e)}
          />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Field Of Study" 
          value={fieldofstudy} onChange={e=>onChange(e)}
          name="fieldofstudy" />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input
            type="date"
            value={from}
            onChange={e => onChange(e)}
            name="from"
          />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              value={current}
              onChange={e => {
                onChange(e);
                toggleDisabled(!toDataDisbled);
              }}
              name="current"
            />{" "}
            Current School or
            Bootcamp
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            disabled={toDataDisbled}
            onChange={e => onChange(e)}
          />
        </div>
        
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            value={description} onChange={e=>onChange(e)}
            placeholder="Program Description"
   >{description}</textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {};

export default connect(null, {addEducation})(withRouter(AddEducation));
