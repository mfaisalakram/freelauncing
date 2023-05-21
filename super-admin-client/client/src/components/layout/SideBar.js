import React from 'react';
import { Link } from 'react-router-dom';
const SideBar = () => {
  return (
    <div className="cui__menuLeft">
      <div className="cui__menuLeft__mobileTrigger">
        <span></span>
      </div>
      <div className="cui__menuLeft__trigger"></div>
      <div className="cui__menuLeft__outer">
        <div className="cui__menuLeft__logo__container">
          <div className="cui__menuLeft__logo">
            <div className="cui__menuLeft__logo__name">AlphaWork</div>
          </div>
        </div>
        <div className="cui__menuLeft__scroll kit__customScroll">
          <ul className="cui__menuLeft__navigation">
            <li className="cui__menuLeft__category">
              <strong> Dashboard</strong>
            </li>
            <li className="cui__menuLeft__item cui__menuLeft__submenu">
              <span className="cui__menuLeft__item__link">
                <span className="cui__menuLeft__item__title">Management</span>
                <span className="badge badge-success ml-2">4</span>
                <i className="cui__menuLeft__item__icon fe fe-home"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
