import React from 'react'

const PathBar = () => {
    return (
         
        <div className="cui__breadcrumbs">
        <div className="cui__breadcrumbs__path">
          <a href="javascript: void(0);">Home</a>
          <span>
            <span className="cui__breadcrumbs__arrow"></span>
            <span>App</span>
          </span>
          <span>
            <span className="cui__breadcrumbs__arrow"></span>
            <strong className="cui__breadcrumbs__current">
              Welcome to Clean UI Pro
            </strong>
          </span>
        </div>
      </div>


    )
}

export default PathBar
