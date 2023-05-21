import React, { Fragment } from 'react'
import SideBar from "./SideBar";
import TopBar from "./TopBar";
import Footer from "./Footer";
import StyleKit from "./StyleKit";
import SupportKit from "./SupportKit";
import PathBar from "./PathBar";

const Layout = (props) => {



    return (
        <Fragment>
            <div className="initial__loading"></div>
            <div className="cui__layout cui__layout--hasSider">
                {/* <SupportKit /> */}
                {/* <StyleKit /> */}
                <SideBar />
                <div className="cui__menuLeft__backdrop"></div>
                <div className="cui__layout">
                    <TopBar />
                    <div className="cui__layout__content">
                        {/* <PathBar /> */}
                        <div className="cui__utils__content">
                          {props.children}
                        </div>
                    </div>

                    <Footer />
                </div>
            </div>


        </Fragment>
    )
}

export default Layout
