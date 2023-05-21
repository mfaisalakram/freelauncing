import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { loadUser, startLoading } from '../../store/actions/auth';
import { setToast } from '../../store/actions/toast';
import { addService } from '../../store/actions/services';
import './EditProfile.css';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';

import {
  bounce,
  fadeInUp,
  fadeIn,
  rotateInUpRight,
  flipInY,
  fadeInDown,
} from 'react-animations';
import Radium, { StyleRoot } from 'radium';
import axios from '../../axios-server';
import Cropper from 'react-easy-crop';
import { Slider } from '@material-ui/core';
import getCroppedImg from './cropImage';

const EditProfile = (props) => {
  const [passformdata, setpassformdata] = useState({
    currentPass: '',
    newPass: '',
    confirmPass: '',
  });
  const [Skillformdata, setSkillformdata] = useState({
    select2: {},
    level: 'Beginner',
  });
  const [seletedTag, setseletedTag] = useState('common');
  const [commonFromData, setcommonFromData] = useState({
    fname: '',
    lname: '',
    story: '',
    about: '',
  });
  const [imageFromData, setimageFromData] = useState({
    image: '',
  });
  const [cropping, setcropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [skills, setskills] = useState([]);
  const [allskills, setsallskills] = useState([]);
  const [editing, setediting] = useState({
    e: false,
    index: -1,
    level: 'Beginner',
  });
  const [disable, setdisable] = useState(true);
  useEffect(() => {
    loadCommonData();
  }, []);
  useEffect(() => {
    if (!props.loading && props.userData) {
      // console.log(props.loading,props.userData);
      console.log(props.userData.username);
      setimageFromData({
        ...imageFromData,
        image:
          'assets/uploads/users/' +
          props.userData.username +
          '/profileImages/' +
          props.userData.profile_image,
      });
    }
  }, [props.loading]);
  useEffect(() => {
    if (seletedTag === 'common') loadCommonData();
    else if (seletedTag === 'profileImage') {
    } else if (seletedTag === 'skills') {
      axios.get(props.baseUrl + '/api/profile/all-skills').then((response) => {
        if (response.data.done) {
          let sss = [];
          response.data.data.map((s) => {
            sss.push({ text: s.name, id: s.id });
          });
          setsallskills(sss);
        } else {
          console.log('f');
        }
      });

      axios.get(props.baseUrl + '/api/profile/skills').then((response) => {
        if (response.data.done) {
          setskills(response.data.data);
          setdisable(true);
        } else {
        }
      });
    }
  }, [seletedTag]);
  useEffect(() => {
    if (skills !== []) setdisable(false);
  }, [skills]);
  const { fname, lname, story, about } = commonFromData;

  const onPassInputChange = (e) => {
    setpassformdata({
      ...passformdata,
      [e.target.name]: e.target.value,
    });
  };
  const onCropComplete = useCallback((croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  const showCroppedImage = useCallback(async () => {
    try {
      console.log('ff', croppedAreaPixels);
      const croppedImage = await getCroppedImg(
        imageFromData.image,
        croppedAreaPixels,
        rotation
      );
      const fileReader = new FileReader();
      fileReader.readAsDataURL(croppedImage);

      fileReader.onload = async (e) => {
        console.log(e.target.result);
        console.log(croppedImage);
        setimageFromData({ ...imageFromData, image: e.target.result });
        setcropping(false);
        setRotation(0);
        // setZoom(1);
        // setCrop({ x: 0, y: 0 });
        // setCroppedAreaPixels(null);
      };
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);
  const loadCommonData = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post(props.baseUrl + '/api/profile/common', commonFromData, config)
      .then((response) => {
        if (response.data.done) {
          setcommonFromData(response.data.data);
        } else {
        }
      });
  };

  const onSkillEdit = (e, index, id) => {
    let s = skills.filter((x, i) => {
      if (i === index) {
        return x;
      }
    });
    console.log(skills);

    setediting({ e: true, index: index, level: s[0].expert_level });
  };
  const onEditComplete = (e, index) => {
    setediting({ e: false, index: -1 });
    let s = [...skills];
    s = s.map((x, i) => {
      if (i === index) {
        return {
          ...x,
          expert_level: editing.level,
        };
      }
      return x;
    });

    setskills(s);

    //   console.log(index);
    //   setSkillformdata({
    //    select2:{
    //      id
    //    }
    //   })
    //  console.log(s.splice(index,1));
    //   setskills(s);
  };
  const onCommonFormSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post(
        props.baseUrl + '/api/profile/update/common',
        commonFromData,
        config
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.done) {
          props.setToast([{ msg: response.data.msg, type: 'success' }]);
        } else {
          let res = response.data.error.map((data) => {
            return {
              ...data,
              type: 'error',
            };
          });
          props.setToast(res);
        }
      });
  };
  const onPasswordFormSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post(
        props.baseUrl + '/api/profile/update/password',
        passformdata,
        config
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.done) {
          props.setToast([{ msg: response.data.msg, type: 'success' }]);
          setpassformdata({
            currentPass: '',
            newPass: '',
            confirmPass: '',
          });
        } else {
          let res = response.data.error.map((data) => {
            return {
              ...data,
              type: 'error',
            };
          });
          props.setToast(res);
        }
      });
  };
  const onProfilePhotoFormSubmit = async (e) => {
    e.preventDefault();

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios
      .post(
        props.baseUrl + '/api/profile/update/profileImage',
        { image: imageFromData.image },

        config
      )
      .then((response) => {
        console.log(response.data);
        if (response.data.done) {
          props.setToast([{ msg: response.data.msg, type: 'success' }]);
          props.loadUser();
        } else {
          let res = response.data.error.map((data) => {
            return {
              ...data,
              type: 'error',
            };
          });

          props.setToast(res);
        }
      });
  };
  const { currentPass, newPass, confirmPass } = passformdata;
  const styles = {
    bounce: {
      animation: 'x 1s',
      animationName: Radium.keyframes(bounce, 'bounce'),
    },
    fadeInUp: {
      animation: 'x 1s',
      animationName: Radium.keyframes(fadeInUp, 'fadeInUp'),
    },
    fadeInUp1: {
      animation: 'x 1s',
      animationName: Radium.keyframes(fadeInUp, 'fadeInUp'),
    },
    fadeInDown: {
      animation: 'x 1s',
      animationName: Radium.keyframes(fadeInDown, 'fadeInDown'),
    },
    fadeIn: {
      animation: 'x 1s',
      animationName: Radium.keyframes(fadeIn, 'fadeInUp'),
    },
    rotateInUpRight: {
      animation: 'x 1s',
      animationName: Radium.keyframes(rotateInUpRight, 'rotateInUpRight'),
    },
    flipInY: {
      animation: 'x 1s',
      animationName: Radium.keyframes(flipInY, 'flipInY'),
    },
  };
  const onInputChangeCommon = (e) => {
    setcommonFromData({
      ...commonFromData,
      [e.target.name]: e.target.value,
    });
  };
  const handleChange = (event) => {
    if (event.target.files[0] !== undefined) {
      setcropping(true);
      let imgs = imageFromData.image;
      imgs = URL.createObjectURL(event.target.files[0]);

      const fileReader = new FileReader();
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onload = (e) => {
        let i = '';
        i = e.target.result;

        setimageFromData({
          ...imageFromData,
          image: i,
        });
      };

      // });

      // fileReader.onerror((error)=>{
      //   reject(error);

      // });
      // })

      // }
    }
  };
  const removeSkill = (e, index) => {
    let skills_temp = [...skills];
    let ss = [...allskills];
    let t = skills_temp.splice(index, 1)[0];
    ss.push({ id: t.indexOf, text: t.name });
    setsallskills(ss);
    setskills(skills_temp);
  };
  const onSelectOption = (e) => {
    setSkillformdata({
      ...Skillformdata,
      select2: {
        id: e.params.data.id,
        name: e.params.data.text,
      },
    });
  };
  const onAddSkillFormSubmit = (e) => {
    e.preventDefault();
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    axios
      .post(
        props.baseUrl + '/api/profile/update/skills',
        { skills: skills },
        config
      )
      .then((response) => {
        if (response.data.done) {
          // setcommonFromData(response.data.data);
        } else {
        }
      });
    setdisable(true);
  };
  const onSkillAddForm = (e) => {
    e.preventDefault();

    if (Object.keys(Skillformdata.select2).length !== 0) {
      let skills_temp = [...skills];
      let ss = [...allskills];
      console.log(Skillformdata);
      skills_temp.push({
        id: Skillformdata.select2.id,
        name: Skillformdata.select2.name,
        expert_level: Skillformdata.level,
      });
      ss = ss.filter(function (e) {
        return e.id !== parseInt(Skillformdata.select2.id);
      });
      setsallskills(ss);
      setskills(skills_temp);
      setSkillformdata({ select2: {}, level: 'Beginner' });
    } else {
      props.setToast([
        { msg: 'Please select Skill from menu', type: 'warning' },
      ]);
    }
  };

  let html = <div></div>;
  if (seletedTag === 'common') {
    html = (
      <StyleRoot>
        <div className="job-box" style={styles.fadeIn}>
          <div className="job-header">
            <h4>Edit your Profile</h4>
          </div>
          <form
            method="post"
            id="addform"
            onSubmit={(e) => {
              onCommonFormSubmit(e);
            }}
          >
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="fname"
                onChange={(e) => onInputChangeCommon(e)}
                className="form-control"
                placeholder="Enter your first name e.g Aftab"
                value={fname}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="lname"
                onChange={(e) => onInputChangeCommon(e)}
                className="form-control"
                placeholder="Enter your last name e.g Falak"
                value={lname}
              />
            </div>

            <div className="form-group">
              <label>What's your story in line?</label>
              <input
                type="text"
                name="story"
                onChange={(e) => onInputChangeCommon(e)}
                className="form-control"
                placeholder="e.g Customer satisfaction is my first priority"
                value={story}
              />
            </div>

            <div className="form-group">
              <label>About</label>
              <textarea
                name="about"
                className="form-control"
                onChange={(e) => onInputChangeCommon(e)}
                rows="5"
                value={about}
                placeholder="Provide a more detailed description about yourself."
              ></textarea>
            </div>

            <button className="kafe-btn kafe-btn-mint-small full-width">
              Save
            </button>
          </form>
        </div>
      </StyleRoot>
    );
  } else if (seletedTag === 'profileImage') {
    html = (
      <StyleRoot>
        <div>
          <form action="" onSubmit={onProfilePhotoFormSubmit}>
            <div className="button-box" style={styles.fadeIn}>
              {cropping && (
                <div className="image-cropper">
                  <div className="crop-container">
                    <Cropper
                      image={imageFromData.image}
                      crop={crop}
                      rotation={rotation}
                      zoom={zoom}
                      aspect={4 / 4}
                      onCropChange={setCrop}
                      onRotationChange={setRotation}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                    />
                  </div>
                  <div className="controls">
                    <div className="row">
                      <div className="col-md-6 col-lg-6 col-sm-6 slider-xx">
                        <i>Zoom</i>
                        <div className="slider-x">
                          <Slider
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e, zoom) => setZoom(zoom)}
                            classes={{ container: 'slider' }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6 col-sm-6 slider-xx">
                        <i>Rotate</i>
                        <div className="slider-x">
                          <Slider
                            value={rotation}
                            min={0}
                            max={360}
                            step={1}
                            aria-labelledby="Rotation"
                            classes={{ container: 'slider' }}
                            onChange={(e, rotation) => setRotation(rotation)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={showCroppedImage}
                  >
                    Crop
                  </button>
                  <hr />
                </div>
              )}
              <div className="change-photo">
                <div className="user-image">
                  <img
                    src={imageFromData.image}
                    alt="Image"
                    className="img-responsive"
                  />
                </div>
                <div className="upload-photo">
                  <label
                    className="kafe-btn kafe-btn-danger-small"
                    htmlFor="upload-photo"
                  >
                    <input
                      id="upload-photo"
                      type="file"
                      onChange={(e) => handleChange(e)}
                    />
                    Change Photo
                  </label>
                  <h4 className="max-size">Max 5 MB</h4>
                </div>
              </div>
              <div className="box-footer">
                <button
                  type="submit"
                  // disabled={cropping}
                  className="btn btn-success full-width"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </StyleRoot>
    );
  } else if (seletedTag === 'changePassword') {
    html = (
      <StyleRoot>
        <div>
          <div className="job-box" style={styles.fadeIn}>
            <div className="job-header">
              <h4>Change your Password</h4>
            </div>
            <form method="post" id="addform" onSubmit={onPasswordFormSubmit}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Current Password"
                  name="currentPass"
                  onChange={(e) => onPassInputChange(e)}
                  value={currentPass}
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="text"
                  className="form-control"
                  name="newPass"
                  onChange={(e) => onPassInputChange(e)}
                  value={newPass}
                  placeholder="New Password"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Confirm Password"
                  name="confirmPass"
                  onChange={(e) => onPassInputChange(e)}
                  value={confirmPass}
                />
              </div>

              <button className="kafe-btn kafe-btn-mint-small full-width">
                Submit
              </button>
            </form>
          </div>
        </div>
      </StyleRoot>
    );
  } else if (seletedTag === 'skills') {
    html = (
      <StyleRoot>
        {console.log(editing)}
        <div>
          <div className="job-box" style={styles.fadeIn}>
            <div className="job-header">
              <h4>Add/Remove Skills</h4>
            </div>

            <div>
              {skills.map((skill, i) => {
                return (
                  <div className="skill-box" key={i}>
                    {editing.e === true && editing.index === i ? (
                      <div>
                        <span className="skill-name">{skill.name}</span>
                        <span
                          className="close-skill"
                          style={{ float: 'right' }}
                          onClick={(e) => onEditComplete(e, i)}
                        >
                          <i className="fa fa-check"></i>
                        </span>

                        <div>
                          <hr />

                          <select
                            className="form-control"
                            value={editing.level}
                            onChange={(e) =>
                              setediting({
                                ...editing,
                                level: e.target.value,
                              })
                            }
                            name=""
                            id=""
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                            <option value="Pro">Pro</option>
                          </select>
                          {/* <small>{skill.expert_level}</small> */}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="skill-name">{skill.name}</span>
                        <span
                          className="close-skill"
                          onClick={(e) => removeSkill(e, i)}
                        >
                          <i className="fa fa-close"></i>
                        </span>
                        <span
                          className="close-skill"
                          onClick={(e) => onSkillEdit(e, i, skill.skill_id)}
                        >
                          <i className="fa fa-edit"></i>
                        </span>
                        <div>
                          <small>{skill.expert_level}</small>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <hr />

              <div className="job-header">
                <h4>Add Skills</h4>
              </div>
              <div className="add-skill-box">
                <form
                  onSubmit={(e) => {
                    onSkillAddForm(e);
                  }}
                >
                  <Select2
                    className="form-control"
                    data={allskills}
                    value={Skillformdata.select2.id}
                    onSelect={onSelectOption}
                    options={{
                      placeholder: 'Search Skills',
                    }}
                  />
                  <br />
                  <br />
                  <select
                    className="form-control"
                    value={Skillformdata.level}
                    onChange={(e) =>
                      setSkillformdata({
                        ...Skillformdata,
                        level: e.target.value,
                      })
                    }
                    name=""
                    id=""
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                    <option value="Pro">Pro</option>
                  </select>
                  <br />
                  <br />
                  <button type="submit" className="btn btn-danger form-control">
                    Add
                  </button>
                </form>
              </div>
              <hr />

              <form action="" onSubmit={onAddSkillFormSubmit}>
                <button
                  disabled={disable}
                  className="btn btn-success form-control text-light"
                >
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </StyleRoot>
    );
  }

  return (
    <Fragment>
      <div className="EditProfile" id="overview">
        <div className="container">
          <div className="row">
            <div className="col-sm-4 col-md-3">
              <ul className="sidebar-menu" data-widget="tree">
                <li
                  className={seletedTag === 'common' ? 'active' : ''}
                  onClick={(e) => {
                    setseletedTag('common');
                  }}
                >
                  <a>
                    <i className="fa fa-user"></i> <span>Edit Profile</span>
                  </a>
                </li>
                <li
                  className={seletedTag === 'profileImage' ? 'active' : ''}
                  onClick={(e) => {
                    setseletedTag('profileImage');
                  }}
                >
                  <a>
                    <i className="fa fa-image"></i>{' '}
                    <span>Change Profile Image</span>
                  </a>
                </li>
                <li
                  className={seletedTag === 'changePassword' ? 'active' : ''}
                  onClick={(e) => {
                    setseletedTag('changePassword');
                  }}
                >
                  <a>
                    <i className="fa fa-lock"></i> <span>Change Password</span>
                  </a>
                </li>
              </ul>

              <ul className="sidebar-menu" data-widget="tree">
                <li
                  className={seletedTag === 'skills' ? 'active' : ''}
                  onClick={(e) => {
                    setseletedTag('skills');
                  }}
                >
                  <a>
                    <i className="fa fa-user"></i> <span>Edit Skills</span>
                  </a>
                </li>
                <li
                  className={seletedTag === 'education' ? 'active' : ''}
                  onClick={(e) => {
                    setseletedTag('education');
                  }}
                >
                  <a>
                    <i className="fa fa-image"></i> <span>Edit Education</span>
                  </a>
                </li>
                <li
                  className={seletedTag === 'certification' ? 'active' : ''}
                  onClick={(e) => {
                    setseletedTag('certification');
                  }}
                >
                  <a>
                    <i className="fa fa-lock"></i>{' '}
                    <span>Edit Certifications</span>
                  </a>
                </li>
              </ul>
              {/* 
              <ul className="sidebar-menu" data-widget="tree">
                <li className="treeview">
                  <a href="#">
                    <i className="fa fa-exchange"></i> <span>Wallet</span>
                    <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right"></i>
                    </span>
                  </a>
                  <ul className="treeview-menu">
                    <li>
                      <a href="deposits.html">
                        <i className="fa fa-circle-o"></i> Deposits
                      </a>
                    </li>
                    <li>
                      <a href="withdrawals.html">
                        <i className="fa fa-circle-o"></i> Withdrawals
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="payment_method.html">
                    <i className="fa fa-dot-circle-o"></i>{" "}
                    <span>Payment Method</span>
                  </a>
                </li>
                <li>
                  <a href="membership.html">
                    <i className="fa fa-credit-card"></i>{" "}
                    <span>Membership</span>
                  </a>
                </li>
              </ul>
         
          */}
            </div>

            <div className="col-sm-8 col-md-9">{html}</div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  userData: state.auth.user,
  loading: state.auth.loading,
  toasts: state.toasts,
});

export default connect(mapStatetoProps, {
  loadUser,
  startLoading,
  addService,
  setToast,
})(EditProfile);
