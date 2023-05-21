import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUser, startLoading } from '../../store/actions/auth';
import { setToast } from '../../store/actions/toast';
import { addService } from '../../store/actions/services';
import './AddService.css';
import axios from 'axios';
import CKEditor from 'ckeditor4-react';
import { useToasts } from 'react-toast-notifications';
const AddService = (props) => {
  const [images, setimages] = useState([]);
  const [categories, setcategories] = useState([]);
  const [subcategories, setsubcategories] = useState([]);
  const [servicetypes, setservicetypes] = useState([]);
  const [titleError, settitleError] = useState(false);

  const { addToast } = useToasts();

  useEffect(() => {
    axios
      .get(props.baseUrl + '/api/raw/categories')
      .then((response) => {
        // console.log(response);

        if (response.data.found) {
          let data = response.data.data;
          data.unshift({ cat_id: '', cat_name: 'Select Category' });
          setcategories(response.data.data);
        }

        props.toasts.map((t) => {
          addToast('fgdfgdf', {
            appearance: 'warning',
            autoDismiss: true,
          });
          return;
        });
      })
      .catch((err) => {});
  }, []);

  const [formdata, setformdata] = useState({
    title: '',
    category: '',
    subcategory: '',
    serviceType: '',
    searchTags: '',
    price: '10',
    Delivery: '1',
    descriptions: '',
    images: [],
  });

  const {
    title,
    category,
    subcategory,
    serviceType,
    searchTags,
    price,
    Delivery,
    descriptions,
  } = formdata;

  const onInputChange = (e) => {
    let add = true;
    settitleError(false);
    if (e.target.name === 'category') {
      if (e.target.value !== '') {
        axios
          .get(props.baseUrl + '/api/raw/' + e.target.value + '/subcategories')
          .then((response) => {
            if (response.data.found) {
              let data = response.data.data;
              data.unshift({
                sub_cat_id: '',
                subcat_name: 'Select Sub Category',
              });
              setsubcategories(response.data.data);
            } else {
              setsubcategories([]);
            }
          })
          .catch((err) => {});
      } else {
        setsubcategories([]);
      }
    }
    if (e.target.name === 'subcategory') {
      if (e.target.value !== '') {
        axios
          .get(props.baseUrl + '/api/raw/' + e.target.value + '/servicetypes')
          .then((response) => {
            console.log(response);

            if (response.data.found) {
              let data = response.data.data;
              data.unshift({ ser_id: '', ser_name: 'Select Service Type' });
              setservicetypes(response.data.data);
            } else {
              setservicetypes([]);
            }

            // setformData({
            //   ...formData,
            //   emailVerified: !response.data.found
            // });
          })
          .catch((err) => {});
      } else {
        setservicetypes([]);
      }
    } else if (e.target.name === 'title') {
      var regexp = new RegExp(/^[a-zA-Z0-9 ]+$/);
      console.log(regexp.test(e.target.value));
      if (e.target.value.trim().length > 100) {
        add = false;
      }
      if (!regexp.test(e.target.value)) {
        settitleError(true);
      }
    }

    if (add === true) {
      setformdata({
        ...formdata,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleChange = (event, index) => {
    if (event.target.files[0] !== undefined) {
      let imgs = [...images];
      imgs[index] = URL.createObjectURL(event.target.files[0]);

      const fileReader = new FileReader();
      fileReader.readAsDataURL(event.target.files[0]);
      fileReader.onload = (e) => {
        let i = [...formdata.images];
        i[index] = e.target.result;
        setimages(imgs);
        setformdata({
          ...formdata,
          images: i,
        });
      };
    }
  };

  const onformSubmit = (e) => {
    e.preventDefault();

    props.addService(formdata, props.history, false);
  };

  const onCloseImage = (e, index) => {
    let imgs = [...images];
    imgs.splice(index, 1);

    let i = [...formdata.images];
    i.splice(index, 1);
    setimages(imgs);
    setformdata({
      ...formdata,
      images: i,
    });
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
  };

  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'red' }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: 'block', background: 'green' }}
        onClick={onClick}
      />
    );
  }

  const onEditorChange = (evt) => {
    setformdata({
      ...formdata,
      description: evt.editor.getData(),
    });
  };
  return (
    <Fragment>
      <div className="AddService" id="overview">
        <div className="container">
          <div className="row">
            <div className="col-sm-1 col-md-1 "></div>
            <div className="col-sm-8 col-md-8">
              <div className="job-box">
                <div className="job-header">
                  <h4>Add New Service</h4>
                </div>
                <form
                  method="post"
                  id="addform"
                  onSubmit={onformSubmit}
                  encType="multipart/form-data"
                >
                  <div className="form-group">
                    <label>Title</label>
                    <textarea
                      type="text"
                      requried
                      name="title"
                      className="form-control service-title"
                      placeholder="Title of service you will provide..."
                      value={title}
                      onChange={onInputChange}
                    ></textarea>
                    <p className="text-right">{title.trim().length}/100</p>
                    {titleError && (
                      <p style={{ color: 'red' }}>
                        Max character 100.Only number, letters and comma allowed
                      </p>
                    )}
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={category}
                        onChange={onInputChange}
                        name="category"
                        className="form-control category"
                      >
                        {categories.map((op) => {
                          return (
                            <option value={op.cat_id}>{op.cat_name}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-6 job-sec">
                    <div className="form-group">
                      <label>Sub Category</label>
                      <select
                        requried
                        value={subcategory}
                        name="subcategory"
                        onChange={onInputChange}
                        className="form-control"
                      >
                        {subcategories.map((op) => {
                          return (
                            <option value={op.sub_cat_id}>
                              {op.subcat_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-6 job-sec ">
                    <div className="form-group">
                      <label>Service Type</label>
                      <select
                        value={serviceType}
                        name="serviceType"
                        onChange={onInputChange}
                        className="form-control"
                      >
                        {servicetypes.map((op) => {
                          return (
                            <option value={op.ser_id}>{op.ser_name}</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div id="searchtags" className="col-lg-12 job-sec">
                    <div className="form-group">
                      <label>Search Tags</label>
                      <textarea
                        type="text"
                        className="form-control search-tags"
                        placeholder=""
                        name="searchTags"
                        value={searchTags}
                        onChange={onInputChange}
                      >
                        {searchTags}
                      </textarea>
                    </div>
                  </div>

                  <div id="priceAnDdelivery" className="col-lg-6 ">
                    <div className="form-group">
                      <label>Price</label>
                      <select
                        type="text"
                        name="price"
                        value={price}
                        className="form-control price"
                        onChange={onInputChange}
                      >
                        <option value={10}>${10}</option>
                        {[...new Array(198)].map((ele, index) => {
                          return (
                            <option value={(index + 3) * 5}>
                              ${(index + 3) * 5}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-6 job-sec">
                    <div className="form-group">
                      <label>Delivery Time</label>

                      <select
                        value={Delivery}
                        name="Delivery"
                        onChange={onInputChange}
                        className="form-control"
                      >
                        {<option value={1}>1 day</option>}

                        {[...new Array(29)].map((ele, index) => {
                          return (
                            <option value={index + 2}>{index + 2} day</option>
                          );
                        })}
                      </select>
                    </div>
                  </div>

                  <div id="gallery" className="col-lg-12 job-sec">
                    <div className="form-group">
                      <label>Service Images</label>
                      <div className="row">
                        <div className="col-md-4">
                          <div className="image-dropzone">
                            <span>Primary Image</span>

                            <div className="img-dev">
                              {formdata.images.length === 1 && (
                                <div
                                  className="closeimage"
                                  onClick={(e) => {
                                    onCloseImage(e, 0);
                                  }}
                                >
                                  x
                                </div>
                              )}
                              <img
                                src={formdata.images[0]}
                                className="preview-img"
                                alt=""
                              />
                            </div>
                            <label>
                              <span>Browse</span>
                              <input
                                type="file"
                                className="form-control image"
                                onChange={(e) => handleChange(e, 0)}
                              />
                            </label>
                          </div>
                        </div>
                        {formdata.images.length >= 1 && (
                          <div className="col-md-4">
                            <div className="image-dropzone">
                              <span>secondary Image</span>

                              <div className="img-dev">
                                {formdata.images.length === 2 && (
                                  <div
                                    className="closeimage"
                                    onClick={(e) => {
                                      onCloseImage(e, 1);
                                    }}
                                  >
                                    x
                                  </div>
                                )}
                                <img
                                  src={formdata.images[1]}
                                  className="preview-img"
                                  alt=""
                                />
                              </div>

                              <label>
                                <span>Browse</span>
                                <input
                                  type="file"
                                  className="form-control image"
                                  onChange={(e) => handleChange(e, 1)}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                        {formdata.images.length >= 2 && (
                          <div className="col-md-4">
                            <div className="image-dropzone">
                              <span>3rd Image</span>

                              <div className="img-dev">
                                {formdata.images.length === 3 && (
                                  <div
                                    className="closeimage"
                                    onClick={(e) => {
                                      onCloseImage(e, 0);
                                    }}
                                  >
                                    x
                                  </div>
                                )}

                                <img
                                  src={formdata.images[2]}
                                  className="preview-img"
                                  alt=""
                                />
                              </div>

                              <label>
                                <span>Browse</span>
                                <input
                                  type="file"
                                  className="form-control image"
                                  onChange={(e) => handleChange(e, 2)}
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div id="description" className="col-lg-12 job-sec">
                    <div className="form-group">
                      <label>Description</label>
                      <CKEditor
                        placeholder="Provide a more detailed description of your job to get better proposals."
                        data={descriptions}
                        config={{
                          toolbarGroups: [
                            {
                              name: 'document',
                              groups: ['document', 'doctools'],
                            },

                            '/',
                            { name: 'basicstyles', groups: ['basicstyles'] },
                            { name: 'paragraph', groups: ['list', 'blocks'] },

                            '/',
                            { name: 'styles', groups: ['styles'] },
                            { name: 'colors', groups: ['colors'] },
                          ],
                        }}
                        removeButtons="About,Maximize,ShowBlocks,BGColor,TextColor,Image,Flash,Table,HorizontalRule,Iframe,Anchor,Unlink,Link,BidiLtr,BidiRtl,Language,Outdent,CopyFormatting,RemoveFormat,Superscript,Subscript,Strike,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Scayt,SelectAll,Find,Undo,Redo,Copy,Cut,Replace,Paste,PasteText,PasteFromWord,Print,Preview,ExportPdf,NewPage,Save,Source,Templates,Indent,CreateDiv,PageBreak,SpecialChar"
                        onChange={onEditorChange}
                      />
                    </div>
                  </div>
                  {titleError ? (
                    <button
                      disabled
                      className="kafe-btn kafe-btn-mint-small full-width"
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      className="kafe-btn kafe-btn-mint-small full-width"
                      style={{ backgroundColor: '#F7BE6D' }}
                    >
                      Submit
                    </button>
                  )}
                </form>
              </div>
            </div>
            <div className="col-sm-3 col-md-3">
              <div className="sidebar-fixed-outer">
                <div className="sidebar-fixed">
                  <ul className="sidebar-menu" data-widget="tree">
                    <li>
                      <a href="#overview">
                        <i className="fa fa-user"></i> <span>Overview</span>
                      </a>
                    </li>
                    <li>
                      <a href="#searchtags">
                        <i className="fa fa-tag"></i> <span>Search Tags</span>
                      </a>
                    </li>
                    <li>
                      <a href="#priceAnDdelivery">
                        <i className="fa fa-dollar"></i>
                        <span>Price and Delivery</span>
                      </a>
                    </li>
                    <li>
                      <a href="#gallery">
                        <i className="fa fa-image"></i> <span>Gallery</span>
                      </a>
                    </li>

                    <li>
                      <a href="#description">
                        <i className="fa fa-info"></i> <span>Description</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  toasts: state.toasts,
});

export default connect(mapStatetoProps, {
  loadUser,
  startLoading,
  addService,
  setToast,
})(AddService);
