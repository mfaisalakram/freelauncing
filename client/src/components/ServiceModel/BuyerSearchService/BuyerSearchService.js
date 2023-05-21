import React from 'react';
import './BuyerSearchService.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import Slider from 'react-slick';
const BuyerSearchService = (props) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  return (
    <div className="BuyerSearchService" style={props.style}>
      <div className="Slider-dev">
        {props.viewService ? (
          <Slider {...settings}>
            {props.serviceData.images &&
              props.serviceData.images.split(',').map((image) => {
                return (
                  <div className="slide">
                    <img
                      src={image}
                      alt="Cover Photo"
                      width="100%"
                      height="130px"
                    ></img>
                  </div>
                );
              })}
          </Slider>
        ) : (
          <Slider {...settings}>
            {props.serviceData.images &&
              props.serviceData.images.split('@').map((image) => {
                return (
                  <div className="slide">
                    <img
                      src={image}
                      alt="Cover Photo"
                      width="100%"
                      height="130px"
                    ></img>
                  </div>
                );
              })}
          </Slider>
        )}
      </div>
      <div className="after-slider">
        <div className="seller-data">
          <img src={props.serviceData.profile_image} alt="" />
          <div>
            <span className="username">{props.serviceData.username}</span>
          </div>
        </div>
        <div className="service-data">
          <a
            href={
              '/' +
              props.serviceData.username +
              '/service/' +
              props.serviceData.url_title
            }
          >
            {' '}
            <h4>{props.serviceData.title}</h4>
          </a>
        </div>
        <div className="divider"></div>
        <div className="price-and-option">
          <div className="options">
            <i className="fa fa-bars bar"></i>
            <i className="fa fa-heart heart"></i>
          </div>
          <div className="price">
            <h4>
              Starting At <span>${props.serviceData.price}</span>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerSearchService;
