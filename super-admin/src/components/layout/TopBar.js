import React from 'react'
import {logout} from '../../store/actions/auth';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
const TopBar = (props) => {
    return (
        
        <div className="cui__layout__header">
          <div className="cui__topbar">
            <div className="mr-4">
              <a href="javascript: void(0);" className="mr-2">
                <i
                  className="dropdown-toggle-icon fe fe-home"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Dashboard Alpha"
                ></i>
              </a>
              <a href="javascript: void(0);" className="mr-2">
                <i
                  className="dropdown-toggle-icon fe fe-home"
                  data-toggle="tooltip"
                  data-placement="bottom"
                  title="Dashboard Beta"
                ></i>
              </a>
              <span className="dropdown">
                <a
                  href="#"
                  className="dropdown-toggle text-nowrap"
                  data-toggle="dropdown"
                  aria-expanded="false"
                  data-offset="0,15"
                >
                  <i
                    className="dropdown-toggle-icon fe fe-star"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Bookmarks"
                  ></i>
                </a>
                <div className="dropdown-menu" role="menu">
                  <div className="card-body p-1 cui__topbar__favs">
                    <div className="px-2 pb-2 pt-0">
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Find pages..."
                      />
                    </div>
                    <div className="kit__customScroll height-200">
                      <div className="px-2 pb-2">
                        <a
                          href="dashboards-alpha.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon cui__topbar__favs__setIconActive">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-home"></i>
                            Dashboard Alpha
                          </span>
                        </a>
                        <a
                          href="dashboards-beta.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon cui__topbar__favs__setIconActive">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-home"></i>
                            Dashboard Beta
                          </span>
                        </a>
                        <a
                          href="dashboards-gamma.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-home"></i>
                            Dashboard Gamma
                          </span>
                        </a>
                        <a
                          href="dashboards-crypto.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-home"></i>
                            Dashboard Crypto
                          </span>
                        </a>
                        <a
                          href="apps-profile.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-database"></i>
                            Profile
                          </span>
                        </a>
                        <a
                          href="apps-calendar.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-database"></i>
                            Calendar
                          </span>
                        </a>
                        <a
                          href="apps-gallery.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-database"></i>
                            Gallery
                          </span>
                        </a>
                        <a
                          href="apps-messaging.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-database"></i>
                            Messaging
                          </span>
                        </a>
                        <a
                          href="apps-mail.html"
                          className="cui__topbar__favs__link"
                        >
                          <div className="cui__topbar__favs__setIcon">
                            <i className="fe fe-star"></i>
                          </div>
                          <span>
                            <i className="mr-2 fe fe-database"></i>
                            Mail
                          </span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
            </div>
            <div className="mr-auto">
              <div className="cui__topbar__search">
                <i className="fe fe-search"></i>
                <input
                  type="text"
                  id="livesearch__input"
                  placeholder="Type to search..."
                />
              </div>
              <div className="cui__topbar__livesearch">
                <button
                  className="cui__topbar__livesearch__close"
                  type="button"
                >
                  <i className="icmn-cross"></i>
                </button>
                <div className="container-fluid">
                  <div className="cui__topbar__livesearch__wrapper">
                    <input
                      type="text"
                      id="livesearch__input__inner"
                      className="cui__topbar__livesearch__input"
                      placeholder="Type to search..."
                    />
                    <ul className="cui__topbar__livesearch__options">
                      <li className="cui__topbar__livesearch__option">
                        <label className="kit__utils__control kit__utils__control__checkbox">
                          <input type="checkbox" checked="checked" />
                          <span className="kit__utils__control__indicator"></span>
                          Search within page
                        </label>
                      </li>
                      <li className="cui__topbar__livesearch__option">
                        Press enter to search
                      </li>
                    </ul>
                    <div className="cui__topbar__livesearch__results">
                      <div className="cui__topbar__livesearch__results__title">
                        <span>Pages Search Results</span>
                      </div>
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="cui__topbar__livesearch__result__content">
                            <div
                              className="cui__topbar__livesearch__result__thumb"
                              style={{
                                backgroundImage:
                                  "url('../../components/kit/core/img/content/photos/1.jpg')"
                              }}
                            >
                              #1
                            </div>
                            <div className="cui__topbar__livesearch__result">
                              <div className="cui__topbar__livesearch__result__text">
                                Samsung Galaxy A50 4GB/64GB
                              </div>
                              <div className="cui__topbar__livesearch__result__source">
                                In some partition
                              </div>
                            </div>
                          </div>
                          <div className="cui__topbar__livesearch__result__content">
                            <div
                              className="cui__topbar__livesearch__result__thumb"
                              style={{
                                backgroundImage:
                                  "url('../../components/kit/core/img/content/photos/2.jpg')"
                              }}
                            >
                              KF
                            </div>
                            <div className="cui__topbar__livesearch__result">
                              <div className="cui__topbar__livesearch__result__text">
                                Apple iPhone 11 64GB
                              </div>
                              <div className="cui__topbar__livesearch__result__source">
                                In some partition
                              </div>
                            </div>
                          </div>
                          <div className="cui__topbar__livesearch__result__content">
                            <div
                              className="cui__topbar__livesearch__result__thumb"
                              style={{
                                backgroundImage:
                                  "url('../../components/kit/core/img/content/photos/3.jpg')"
                              }}
                            >
                              GF
                            </div>
                            <div className="cui__topbar__livesearch__result">
                              <div className="cui__topbar__livesearch__result__text">
                                Samsung Galaxy A51 SM-A515F/DS 4GB/64GB
                              </div>
                              <div className="cui__topbar__livesearch__result__source">
                                In some partition
                              </div>
                            </div>
                          </div>
                          <div className="cui__topbar__livesearch__result__content">
                            <div
                              className="cui__topbar__livesearch__result__thumb"
                              style={{
                                backgroundImage:
                                  "url('../../components/kit/core/img/content/photos/4.jpg')"
                              }}
                            >
                              GF
                            </div>
                            <div className="cui__topbar__livesearch__result">
                              <div className="cui__topbar__livesearch__result__text">
                                Xiaomi Redmi 8 4GB/64GB
                              </div>
                              <div className="cui__topbar__livesearch__result__source">
                                In some partition
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="cui__topbar__livesearch__result__content">
                            <div className="cui__topbar__livesearch__result__thumb">
                              01
                            </div>
                            <div className="cui__topbar__livesearch__result">
                              <div className="cui__topbar__livesearch__result__text">
                                White Case
                              </div>
                              <div className="cui__topbar__livesearch__result__source">
                                In some partition
                              </div>
                            </div>
                          </div>
                          <div className="cui__topbar__livesearch__result__content">
                            <div className="cui__topbar__livesearch__result__thumb">
                              02
                            </div>
                            <div className="cui__topbar__livesearch__result">
                              <div className="cui__topbar__livesearch__result__text">
                                Blue Case
                              </div>
                              <div className="cui__topbar__livesearch__result__source">
                                In some partition
                              </div>
                            </div>
                          </div>
                          <div className="cui__topbar__livesearch__result__content">
                            <div className="cui__topbar__livesearch__result__thumb">
                              03
                            </div>
                            <div className="cui__topbar__livesearch__result">
                              <div className="cui__topbar__livesearch__result__text">
                                Green Case
                              </div>
                              <div className="cui__topbar__livesearch__result__source">
                                In some partition
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dropdown mr-4 d-none d-md-block">
              <a
                href="#"
                className="dropdown-toggle text-nowrap"
                data-toggle="dropdown"
                aria-expanded="false"
                data-offset="0,15"
              >
                <i className="dropdown-toggle-icon fe fe-folder"></i>
                <span className="dropdown-toggle-text d-none d-xl-inline">
                  Issues History
                </span>
              </a>
              <div className="dropdown-menu" role="menu">
                <a className="dropdown-item" href="javascript:void(0)">
                  Current search
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  Search for issues
                </a>
                <div className="dropdown-divider"></div>
                <div className="dropdown-header">Opened</div>
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="fe fe-check-circle mr-2"></i> CLNUI-253 Project
                  implemen...
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="fe fe-check-circle mr-2"></i> CLNUI-234 Active
                  history iss...
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="fe fe-check-circle mr-2"></i> CLNUI-424 Ionicons
                  intergrat...
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  More...
                </a>
                <div className="dropdown-header">Filters</div>
                <a className="dropdown-item" href="javascript:void(0)">
                  My open issues
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  Reported by me
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="dropdown-icon fe fe-settings"></i>
                  Settings
                </a>
              </div>
            </div>
            <div className="dropdown mb-0 mr-auto d-xl-block d-none">
              <a
                href="#"
                className="dropdown-toggle text-nowrap"
                data-toggle="dropdown"
                aria-expanded="false"
                data-offset="0,15"
              >
                <i className="dropdown-toggle-icon fe fe-database"></i>
                <span className="dropdown-toggle-text">Project Management</span>
              </a>
              <div className="dropdown-menu" role="menu">
                <div className="dropdown-header">Active</div>
                <a className="dropdown-item" href="javascript:void(0)">
                  Project Management
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  User Inetrface Development
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  Documentation
                </a>
                <div className="dropdown-header">Inactive</div>
                <a className="dropdown-item" href="javascript:void(0)">
                  Marketing
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="dropdown-icon fe fe-settings"></i>
                  Settings
                </a>
              </div>
            </div>
            <div className="dropdown mr-4 d-none d-sm-block">
              <a
                href="#"
                className="dropdown-toggle text-nowrap"
                data-toggle="dropdown"
                data-offset="5,15"
              >
                <span className="dropdown-toggle-text">EN</span>
              </a>
              <div className="dropdown-menu dropdown-menu-right" role="menu">
                <a className="dropdown-item " href="javascript:void(0)">
                  <span className="text-uppercase font-size-12 mr-1">EN</span>
                  English
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  <span className="text-uppercase font-size-12 mr-1">FR</span>
                  French
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  <span className="text-uppercase font-size-12 mr-1">RU</span>
                  Русский
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  <span className="text-uppercase font-size-12 mr-1">CN</span>
                  简体中文
                </a>
              </div>
            </div>
            <div className="cui__topbar__actionsDropdown dropdown mr-4 d-none d-sm-block">
              <a
                href="#"
                className="dropdown-toggle text-nowrap"
                data-toggle="dropdown"
                aria-expanded="false"
                data-offset="0,15"
              >
                <i className="dropdown-toggle-icon fe fe-bell"></i>
              </a>
              <div
                className="cui__topbar__actionsDropdownMenu dropdown-menu dropdown-menu-right"
                role="menu"
              >
                <div style={{ width: "350px" }}>
                  <div className="card-header card-header-flex">
                    <ul className="nav nav-tabs nav-tabs-line nav-tabs-line-bold nav-tabs-noborder nav-tabs-stretched">
                      <li className="nav-item">
                        <a
                          href="#tab-alert-content"
                          className="nav-link active"
                          id="tab-alert"
                          role="button"
                          data-toggle="tab"
                        >
                          Alerts
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#tab-events-content"
                          className="nav-link"
                          id="tab-events"
                          role="button"
                          data-toggle="tab"
                        >
                          Events
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          href="#tab-actions-content"
                          className="nav-link"
                          id="tab-actions"
                          role="button"
                          data-toggle="tab"
                        >
                          Actions
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="card-body">
                    <div className="tab-content">
                      <div
                        className="tab-pane fade show active"
                        id="tab-alert-content"
                        role="tabpanel"
                        aria-labelledby="tab-alert-content"
                      >
                        <div className="height-300 kit__customScroll">
                          <ul className="list-unstyled">
                            <li className="mb-3">
                              <div className="d-flex align-items-baseline">
                                <p className="kit__l2__title">
                                  Update Status:
                                  <strong className="text-black">New</strong>
                                </p>
                                <span className="kit__l2__span">5 min ago</span>
                              </div>
                              <p className="kit__l2__content text-muted">
                                Mary has approved your quote.
                              </p>
                            </li>
                            <li className="mb-3">
                              <div className="d-flex align-items-baseline">
                                <p className="kit__l2__title">
                                  Update Status:
                                  <strong className="text-danger">
                                    Rejected
                                  </strong>
                                </p>
                                <span className="kit__l2__span">
                                  15 min ago
                                </span>
                              </div>
                              <p className="kit__l2__content text-muted">
                                Mary has declined your quote.
                              </p>
                            </li>
                            <li className="mb-3">
                              <div className="d-flex align-items-baseline">
                                <p className="kit__l2__title">
                                  Payment Received:
                                  <strong className="text-black">
                                    $5,467.00
                                  </strong>
                                </p>
                                <span className="kit__l2__span">
                                  15 min ago
                                </span>
                              </div>
                              <p className="kit__l2__content text-muted">
                                GOOGLE, LLC AUTOMATED PAYMENTS PAYMENT
                              </p>
                            </li>
                            <li className="mb-3">
                              <div className="d-flex align-items-baseline">
                                <p className="kit__l2__title">
                                  Notification:
                                  <strong className="text-danger">
                                    Access Denied
                                  </strong>
                                </p>
                                <span className="kit__l2__span">
                                  5 Hours ago
                                </span>
                              </div>
                              <p className="kit__l2__content text-muted">
                                The system prevent login to your account
                              </p>
                            </li>
                            <li className="mb-3">
                              <div className="d-flex align-items-baseline">
                                <p className="kit__l2__title">
                                  Payment Received:
                                  <strong className="text-black">
                                    $55,829.00
                                  </strong>
                                </p>
                                <span className="kit__l2__span">1 day ago</span>
                              </div>
                              <p className="kit__l2__content text-muted">
                                GOOGLE, LLC AUTOMATED PAYMENTS PAYMENT
                              </p>
                            </li>
                            <li className="mb-3">
                              <div className="d-flex align-items-baseline">
                                <p className="kit__l2__title">
                                  Notification:
                                  <strong className="text-danger">
                                    Access Denied
                                  </strong>
                                </p>
                                <span className="kit__l2__span">
                                  5 Hours ago
                                </span>
                              </div>
                              <p className="kit__l2__content text-muted">
                                The system prevent login to your account
                              </p>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="tab-events-content"
                        role="tabpanel"
                        aria-labelledby="tab-alert-content"
                      >
                        <div className="text-center py-4 bg-light rounded">
                          No Events Today
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="tab-actions-content"
                        role="tabpanel"
                        aria-labelledby="tab-alert-content"
                      >
                        <div className="text-center py-4 bg-light rounded">
                          No Actions Today
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dropdown">
              <a
                href="#"
                className="dropdown-toggle text-nowrap"
                data-toggle="dropdown"
                aria-expanded="false"
                data-offset="5,15"
              >
                <img
                  className="dropdown-toggle-avatar"
                  src="../../components/kit/core/img/avatars/avatar-2.png"
                  alt="User avatar"
                />
              </a>
              <div className="dropdown-menu dropdown-menu-right" role="menu">
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="dropdown-icon fe fe-user"></i>
                  Profile
                </a>
                <div className="dropdown-divider"></div>
                <div className="dropdown-header">Home</div>
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="dropdown-icon fe fe-chevron-right"></i>
                  System Dashboard
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="dropdown-icon fe fe-chevron-right"></i>
                  User Boards
                </a>
                <a className="dropdown-item" href="javascript:void(0)">
                  <i className="dropdown-icon fe fe-chevron-right"></i>
                  Issue Navigator
                  <span className="badge badge-success font-size-11 ml-2">
                    25 New
                  </span>
                </a>
                <div className="dropdown-divider"></div>
                <Link to="#!" onClick={props.logout}>  <i className="dropdown-icon fe fe-log-out"></i> Logout</Link>

                {/* <a className="dropdown-item" href="">
                 Logout
                </a> */}
              </div>
            </div>
          </div>
        </div>
       
       
    )
}

const mapStatetoProps=state=>{
  return({
   auth:state.auth
})
}

export default connect(mapStatetoProps,{logout})(TopBar);
