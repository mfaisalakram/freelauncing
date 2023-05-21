import React, { Fragment, useEffect, useState } from 'react';
import './ViewService.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import BuyerSearchService from '../../components/ServiceModel/BuyerSearchService/BuyerSearchService';
import Spinner from '../../components/layout/Spinner';
import { connect } from 'react-redux';
import axios from '../../axios-server';
import { loadUser, startLoading } from '../../store/actions/auth';
import { setToast } from '../../store/actions/toast';

const ViewService = (props) => {
  const [serviceData, setserviceData] = useState([]);
  const [serviceLoading, setserviceLoading] = useState(true);

  // get servie data from server
  const getServiceData = () => {
    let title = '';
    let username = '';
    setserviceLoading(true);
    const path = props.location.pathname.split('/');
    if (path.length === 4) {
      title = path[3];
      username = path[1];
    }

    axios
      .get(props.baseUrl + '/api/service/' + username + '/' + title)
      .then((response) => {
        if (response.data.found) {
          const data = response.data.data[0];
          let images = [];

          // loop on images
          data.images.split(',').forEach(async (ele) => {
            images.push(ele);
          });
          setserviceLoading(false);
          setserviceData({
            ...data,
            images: images,
          });
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getServiceData();
  }, []);

  let username = '';
  if (props.isAuthenticated) {
    username = props.user.username;
  }
  return (
    <Fragment>
      <div className="ViewService">
        <section className="container dashboard section-padding">
          {serviceLoading ? (
            <Spinner />
          ) : (
            <div className="row">
              <div className="col-lg-8 col-sm-8 col-md-8">
                <ul className="sidebar-menu" data-widget="tree">
                  <nav className="breadcrumbs text-body-2">
                    <a href="/categories/programming-tech?source=gig_category_link">
                      {serviceData.cat_name}
                    </a>{' '}
                    &nbsp;&lt; &nbsp;
                    <a href="/categories/programming-tech/web-programming-services?source=gig_sub_category_link">
                      {serviceData.subcat_name}
                    </a>
                    &nbsp;&lt;&nbsp;
                    <a href="/categories/programming-tech/web-programming-services/web-application?source=gig_nested_sub_category_link">
                      Web Application
                    </a>
                  </nav>
                  <h1 className="service-title">{serviceData.title}</h1>

                  <div className="seller-overview">
                    <div className="user-profile-image">
                      <label
                        className="profile-pict"
                        htmlFor="profile_image_7189610686952"
                        style={{
                          width: '32px',
                          height: '32px',
                          fontSize: '1em',
                        }}
                      >
                        <img
                          src={serviceData.profile_image}
                          className="profile-pict-img"
                          alt="freelancer"
                          style={{ width: '32px' }}
                        />
                      </label>

                      <span className="profile-name">
                        <span className="user-status spanTag1">
                          <a
                            href={'/' + serviceData.username}
                            className="seller-link"
                          >
                            {serviceData.username}
                          </a>
                        </span>
                        <span
                          data-hint="Completed at least 10 orders on time with a minimum 4.7 rating"
                          className="seller-level hint hint--top spanTag2"
                        >
                          {/* Level 1 Seller */}
                        </span>
                      </span>
                    </div>

                    <div className="user-info">
                      <span className="user-info-rating">
                        <div className="star-rating-s15-wrapper">
                          <span className="star-rating-s15 rate-10"></span>
                        </div>
                        <span className="total-rating-out-five spanTag1"></span>
                      </span>
                    </div>
                  </div>
                </ul>
                <div>
                  <Carousel>
                    {serviceData.images &&
                      serviceData.images.map((image) => {
                        return <img src={image} />;
                      })}
                  </Carousel>
                </div>
                {/* end of left carousel div */}
                <div className="gig-description">
                  <header>
                    <h2
                      className="section-title"
                      style={{
                        paddingLeft: '50px',
                        fontWeight: 'bolder',
                      }}
                    >
                      About This Service
                    </h2>
                  </header>

                  <div className="description-wrapper">
                    <div
                      className="description-content contentdescription"
                      dangerouslySetInnerHTML={{
                        __html: serviceData.description,
                      }}
                    ></div>

                    <h2
                      className="section-title"
                      style={{
                        paddingLeft: '50px',
                        fontWeight: 'bolder',
                      }}
                    >
                      About The Seller
                    </h2>
                  </div>
                </div>
                <div
                  className="col-lg-12 top-sec"
                  style={{
                    paddingLeft: '0px',
                  }}
                >
                  <div
                    className="seller-short"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '20px',
                      paddingLeft: '50px',
                    }}
                  >
                    <div className="image-div-large">
                      <img
                        src={serviceData.profile_image}
                        className="img-circle img-thumbnail"
                        alt="Image"
                      />
                    </div>
                    <div className="seller-short-data">
                      <h3>{serviceData.fname + ' ' + serviceData.lname}</h3>
                      <p className="story">{serviceData.story}</p>
                    </div>
                  </div>
                  <div className="stats-desc statdesc">
                    <div className="row">
                      <div className="col-md-6 col-sm-6">
                        <div className="single-stat-box">
                          <p className="head">From</p>
                          <div className="body">Pakistan</div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div className="single-stat-box">
                          <p className="head">Member since</p>
                          <div className="body">Oct 2017</div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div className="single-stat-box">
                          <p className="head">Avg. response time</p>
                          <div className="body">1 hour</div>
                        </div>
                      </div>
                      <div className="col-md-6 col-sm-6">
                        <div className="single-stat-box">
                          <p className="head">Last delivery</p>
                          <div className="body">1 month</div>
                        </div>
                      </div>
                    </div>

                    <article className="seller-desc">
                      <div className="inner">{serviceData.about}</div>
                    </article>
                  </div>{' '}
                  {/*end of slider div */}
                  <div className="card-casrousel">
                    <div className="reviewpage">
                      <header>
                        <div className="reviewpage-headerdetails"></div>
                      </header>
                    </div>
                  </div>
                </div>{' '}
                {/* end of top-sec */}
              </div>{' '}
              {/* end of left div */}
              <div className="col-lg-4 col-sm-4 col-md-4">
                <div className="nav-container service-packages">
                  <label htmlFor="package-tab-1">package</label>
                </div>

                <div className="content service-content">
                  <div className="package-content">
                    <header>
                      <h4>
                        <strong>
                          {/* <b className="title">SILVER</b> */}
                          <span className="price">
                            Service price is starting from ${serviceData.price}
                          </span>
                        </strong>
                      </h4>
                      {/* <p>
                      single page application with up to 5 components, small
                      application in nodejs and react
                    </p> */}
                    </header>
                    <article>
                      <b className="delivery">
                        {serviceData.delivery_time}{' '}
                        {serviceData.delivery_time === 1 ? ' day' : ' days'}{' '}
                        Delivery
                      </b>
                      <br />
                      <br />
                    </article>

                    {username === serviceData.username ? (
                      <a
                        href={'/services/edit/' + serviceData.url_title}
                        className="btn form-control contact-seller-button"
                      >
                        Edit Service
                      </a>
                    ) : (
                      <a
                        href={'/messages/' + serviceData.username}
                        className="btn form-control contact-seller-button"
                      >
                        Contact Seller
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="other-service">
                  <div className="row">
                    <div className="col-md-12">
                      <h2>
                        More services from{' '}
                        <a href={'/' + serviceData.username}>
                          {serviceData.username}
                        </a>
                      </h2>
                    </div>
                    {serviceData.otherServices &&
                      serviceData.otherServices.map((service) => {
                        return (
                          <div className="col-md-3 col-sm-3">
                            <BuyerSearchService
                              serviceData={service}
                              viewService={true}
                              style={{ marginTop: '20px' }}
                            />
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  toasts: state.toasts,
});

export default connect(mapStatetoProps, {
  loadUser,
  startLoading,
  setToast,
})(ViewService);
