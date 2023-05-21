import React from 'react';
import { BsCodeSlash } from 'react-icons/bs';
import { IoEyeOutline, IoCalendarClearOutline } from 'react-icons/io5';
import { FaRegEdit } from 'react-icons/fa';
import { TbSpeakerphone } from 'react-icons/tb';
import { AiOutlineTool } from 'react-icons/ai';
import { GiInjustice } from 'react-icons/gi';
import './HomeCategorySection.css';
const HomeCategorySection = () => {
  return (
    <div className="tr-category section-padding">
      <div className="container">
        <div className="section-title">
          <h1>Browse services By Category</h1>
        </div>
        <div className="row">
          <div className="category-list tr-list">
            <div className="col-lg-3">
              <div className="category-box">
                <a href="hire.html">
                  <span className="icon">
                    <BsCodeSlash className="category-icon" />
                  </span>
                  <span className="category-title">
                    Web & Mobile Development
                  </span>
                  <span className="category-quantity">(1298)</span>
                </a>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="category-box">
                <a href="hire.html">
                  <span className="icon">
                    <IoEyeOutline className="category-icon" />
                  </span>
                  <span className="category-title">
                    Design, Arts & Multimedia
                  </span>
                  <span className="category-quantity">(76212)</span>
                </a>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="category-box">
                <a href="hire.html">
                  <span className="icon">
                    <FaRegEdit className="category-icon" />
                  </span>
                  <span className="category-title">Writing & Translation</span>
                  <span className="category-quantity">(212)</span>
                </a>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="category-box">
                <a href="hire.html">
                  <span className="icon">
                    <IoEyeOutline className="category-icon" />
                  </span>
                  <span className="category-title">Admin Support</span>
                  <span className="category-quantity">(972)</span>
                </a>
              </div>
            </div>
          </div>
          <div className="category-list tr-list">
            <div className="col-lg-3">
              <div className="category-box">
                <a href="hire.html">
                  <span className="icon">
                    <IoCalendarClearOutline className="category-icon" />
                  </span>
                  <span className="category-title">Management & Finance</span>
                  <span className="category-quantity">(1298)</span>
                </a>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="category-box">
                <a href="hire.html">
                  <span className="icon">
                    <TbSpeakerphone className="category-icon" />
                  </span>
                  <span className="category-title">Sales & Marketing</span>
                  <span className="category-quantity">(76212)</span>
                </a>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="category-box">
                <a href="hire.html">
                  <span className="icon">
                    <AiOutlineTool className="category-icon" />
                  </span>
                  <span className="category-title">
                    Engineering & Architecture
                  </span>
                  <span className="category-quantity">(1298)</span>
                </a>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="category-box">
                <a href="hire.html">
                  <span className="icon">
                    <GiInjustice className="category-icon" />
                  </span>
                  <span className="category-title">Legal</span>
                  <span className="category-quantity">(76212)</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCategorySection;
