import React, { Fragment } from 'react'

const StyleKit = () => {
    return (
      <Fragment>
          
        <div className="cui__sidebar kit__customScroll">
          <div className="cui__sidebar__inner">
            <a
              href="javascript: void(0);"
              className="cui__sidebar__close cui__sidebar__actionToggle fe fe-x-circle"
            ></a>
            <h5>
              <strong>Theme Settings</strong>
            </h5>
            <div
              className="cui__utils__line"
              style={{ marginTop: "25px", marginBottom: "30px" }}
            ></div>
            <div className="cui__sidebar__type">
              <div className="cui__sidebar__type__title">
                <span>Application Name</span>
              </div>
              <div className="cui__sidebar__type__items">
                <input
                  id="appName"
                  className="form-control"
                  value="Clean UI Pro"
                />
              </div>
            </div>
            <div className="cui__sidebar__item hideIfMenuTop">
              <div className="cui__sidebar__label">Left Menu: Collapsed</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__menuLeft--toggled"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item hideIfMenuTop">
              <div className="cui__sidebar__label">Left Menu: Unfixed</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__menuLeft--unfixed"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item hideIfMenuTop">
              <div className="cui__sidebar__label">Left Menu: Shadow</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__menuLeft--shadow"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">Menu: Color</div>
              <div className="cui__sidebar__container">
                <div className="cui__sidebar__select" to="body">
                  <div className="cui__sidebar__select__item cui__sidebar__select__item--white cui__sidebar__select__item--active"></div>
                  <div
                    className="cui__sidebar__select__item cui__sidebar__select__item--gray"
                    setting="cui__menuLeft--gray cui__menuTop--gray"
                  ></div>
                  <div
                    className="cui__sidebar__select__item cui__sidebar__select__item--black"
                    setting="cui__menuLeft--dark cui__menuTop--dark"
                  ></div>
                </div>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">Auth: Background</div>
              <div className="cui__sidebar__container">
                <div className="cui__sidebar__select" to="body">
                  <div className="cui__sidebar__select__item cui__sidebar__select__item--white cui__sidebar__select__item--active"></div>
                  <div
                    className="cui__sidebar__select__item cui__sidebar__select__item--gray"
                    setting="cui__auth--gray"
                  ></div>
                  <div
                    className="cui__sidebar__select__item cui__sidebar__select__item--img"
                    setting="cui__auth--img"
                  ></div>
                </div>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">Topbar: Fixed</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__topbar--fixed"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">Topbar: Gray Background</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__topbar--gray"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">App: Content Max-Width</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__layout--contentMaxWidth"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">App: Max-Width</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__layout--appMaxWidth"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">App: Gray background</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__layout--grayBackground"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">Cards: Squared Borders</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__layout--squaredBorders"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">Cards: Shadow</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__layout--cardsShadow"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
            <div className="cui__sidebar__item">
              <div className="cui__sidebar__label">Cards: Borderless</div>
              <div className="cui__sidebar__container">
                <label className="cui__sidebar__switch">
                  <input
                    type="checkbox"
                    to="body"
                    setting="cui__layout--borderless"
                  />
                  <span className="cui__sidebar__switch__slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <a
          href="javascript: void(0);"
          style={{ bottom: "calc(50% + 120px)" }}
          className="cui__sidebar__toggleButton cui__sidebar__actionToggle"
          data-toggle="tooltip"
          data-placement="left"
          title="Settings"
        >
          <i className="fe fe-settings"></i>
        </a>
        <a
          href="javascript: void(0);"
          style={{ bottom: "calc(50% + 60px)" }}
          className="cui__sidebar__toggleButton cui__sidebar__actionToggleTheme"
          data-toggle="tooltip"
          data-placement="left"
          title="Switch Dark / Light Theme"
        >
          <i className=" fe fe-moon cui__sidebar__on"></i>
          <i className="fe fe-sun cui__sidebar__off"></i>
        </a>
        <a
          href="javascript: void(0);"
          style={{ bottom: "calc(50%)" }}
          className="cui__sidebar__toggleButton color reset"
          data-toggle="tooltip"
          data-placement="left"
          title="Set Primary Color"
        >
          <button type="button" id="resetColor" tabindex="0">
            <i className="fe fe-x-circle"></i>
          </button>
          <input type="color" id="colorPicker" value="#4b7cf3" />
          <i className="fe fe-package"></i>
        </a>
        <a
          href="https://docs.cleanuitemplate.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ bottom: "calc(50% - 60px)" }}
          className="cui__sidebar__toggleButton"
          data-toggle="tooltip"
          data-placement="left"
          title="Documentation"
        >
          <i className=" fe fe-book-open"></i>
        </a>
      
      </Fragment>
    )
}

export default StyleKit
