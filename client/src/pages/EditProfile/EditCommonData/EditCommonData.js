import React from 'react'

const EditCommonData = () => {
    return (
        
        <div className="job-box">
        <div className="job-header">
          <h4>Edit your Profile</h4>
        </div>
        <form method="post" id="addform">

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="title" className="form-control" placeholder="Name" value="" />
          </div>

          <div className="form-group">
            <label>Profession</label>
            <input type="text" name="title" className="form-control" placeholder="Profession e.g Wordpress Developer" value="" />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input type="text" name="title" className="form-control" placeholder="Location e.g Nairobi, Kenya" value="" />
          </div>

          <div className="form-group">
            <label>Hourly Rate</label>
            <input type="text" name="title" className="form-control" placeholder="Hourly Rate e.g $20/hr" value="" />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <p>
              <a href="#" className="selected">HTML5</a>
              <a href="#" className="selected">CSS3</a>
              <a href="#" className="selected">Bootstrap</a>
              <a href="#" className="selected">PHP</a>
              <a href="#" className="unselected">Wordpress</a>
              <a href="#" className="unselected">Angular JS</a>
            </p>
          </div>

          <div className="form-group">
            <label>About</label>
            <textarea className="form-control" rows="5" placeholder="Provide a more detailed description about yourself."></textarea>
          </div>

          <button className="kafe-btn kafe-btn-mint-small full-width">Submit</button>
        </form>
      </div>



    )
}

export default EditCommonData
