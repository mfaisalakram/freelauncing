import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { BsCalendar3 } from 'react-icons/bs';
import { ImPageBreak } from 'react-icons/im';

import h6 from './Images/slide6.jpg';
import $ from 'jquery';
import './HomeBanner.css';

const HomeBanner = () => {
  const backImage = h6;
  const [search, setSearch] = useState('');

  useEffect(() => {
    localStorage.setItem('x', 0);

    $('.backimages').fadeIn('slow');
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    window.location.href = '/services/search?keyword=' + search;
  };

  return (
    <div>
      <section className="tr-banner section-before bg-image">
        <div className="container">
          <div
            className="backimages"
            style={{
              backgroundImage: 'url(' + backImage + ')',
              transition: 'opacity 2s ease-in-out',
            }}
          ></div>
          <div className="banner-content text-center">
            <h2>Find the best Freelancers Services</h2>
            <h3>Getting a job done has never been easy.</h3>

            <form className="form-horizontal" onSubmit={onSubmit}>
              <div className="col-md-10 no-padd">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="What do you need to get done?"
                    className="form-control"
                    name="search"
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ boxShadow: '1px 1px 4px #F7BE6D' }}
                  />
                </div>
              </div>
              <div className="col-md-2 no-padd">
                <div className="input-group">
                  <button
                    type="submit"
                    style={{
                      padding: '15px',
                      fontWeight: 500,
                      border: '2px solid #F7BE6D',
                    }}
                    className="full-width eaglance-outline-btn"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>

            <div className="row hidden-xs">
              <div className="col-lg-4 col-sm-6">
                <div className="features">
                  <span className="fa-stack fa-3x">
                    <ImPageBreak
                      style={{
                        backgroundColor: '#ffff',
                        color: '#F7BE6D',
                        borderRadius: '50%',
                        padding: '5px',
                      }}
                    />
                  </span>
                  <p>Find Freelance Service</p>
                </div>
              </div>

              <div className="col-lg-4 col-sm-6">
                <div className="features">
                  <span className="fa-stack fa-3x">
                    {/* <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-users fa-stack-1x fa-inverse"></i> */}
                    <BsCalendar3
                      style={{
                        backgroundColor: '#ffff',
                        color: '#F7BE6D',
                        borderRadius: '50%',
                        padding: '5px',
                      }}
                    />
                  </span>
                  <p>Get Offer in minutes</p>
                </div>
              </div>
              <div className="col-lg-4 col-sm-6">
                <div className="features">
                  <span className="fa-stack fa-3x">
                    {/* <i className="fa fa-circle fa-stack-2x"></i>
                    <i className="fa fa-users fa-stack-1x fa-inverse"></i> */}
                    <FaUsers
                      style={{
                        backgroundColor: '#ffff',
                        color: '#F7BE6D',
                        borderRadius: '50%',
                        padding: '5px',
                      }}
                    />
                  </span>
                  <p>Choose your freelancer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeBanner;
