import React, { useState, Fragment, useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../store/actions/auth";
import { addExperience } from "../../store/actions/profile";
import { withRouter, Link } from "react-router-dom";

const AddExperience = ({ addExperience, history }) => {
  const [formData, setFromData] = useState({
    title: "",
    company: "",
    location: "",
    from: "",
    description: "",
    to: "",
    current: false
  });
  const [toDataDisbled, toggleDisabled] = useState(false);
  const onChange = e =>
    setFromData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    addExperience(formData, history);
  };
  const { title, company, location, from, description, to, current } = formData;
  return (
    <Fragment>
      <h1 className="large text-primary">Add An Experience</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={e => onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            value={title}
            onChange={e => onChange(e)}
            placeholder="* Job Title"
            name="title"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={company}
            onChange={e => onChange(e)}
            placeholder="* Company"
            name="company"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            value={location}
            onChange={e => onChange(e)}
            placeholder="Location"
            name="location"
          />
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
            Current Job
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
        <textarea
          name="description"
          cols="30"
          rows="5"
          value={description}
          onChange={e => onChange(e)}
          placeholder="Program Description"
        >
          {description}
        </textarea>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back ex
        </Link>
      </form>
    </Fragment>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired
};

export default connect(null, { addExperience })(withRouter(AddExperience));
