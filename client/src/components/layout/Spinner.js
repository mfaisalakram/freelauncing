import React, { Fragment } from 'react';
// import spinner from "./spinner.js";
import './Spinner.css';
import spinner from '../../img/25.gif';
const Spinner = ({ style, cls }) => {
  let html = (
    <div className="Spinner">
      <img src={spinner} alt="" />
    </div>
  );
  if (cls === 'abs') {
    html = (
      <div className="text-center">
        <div className="back"></div>
        <div className={['Spinner', cls].join(' ')}>
          <img src={spinner} alt="" />
        </div>
      </div>
    );
  }
  return <Fragment>{html}</Fragment>;
};

export default Spinner;
