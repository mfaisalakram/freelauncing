import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUser, startLoading } from '../../store/actions/auth';
import { setToast } from '../../store/actions/toast';
import { editService } from '../../store/actions/services';
import './EditService.css';
import axios from 'axios';
import CKEditor from 'ckeditor4-react';

const EditService = (props) => {
  const [images, setimages] = useState([]);
  const [categories, setcategories] = useState([]);
  const [subcategories, setsubcategories] = useState([]);
  const [servicetypes, setservicetypes] = useState([]);
  const [titleError, settitleError] = useState(false);

  const [formdata, setformdata] = useState({
    title: '',
    category: '',
    subcategory: '',
    serviceType: '',
    searchTags: '',
    price: '10',
    Delivery: '1',
    description: '',
    images: [],
    urlTitle: '',
  });

  const {
    title,
    category,
    subcategory,
    serviceType,
    searchTags,
    price,
    Delivery,
    description,
  } = formdata;

  // first rendered
  useEffect(() => {
    getServiceData();
    getCategories();
  }, []);

  // when category change
  useEffect(() => {
    if (formdata.category !== '') getAndSetSubCategories(formdata.category);
  }, [formdata.category]);

  // when sub category change
  useEffect(() => {
    if (formdata.subcategory !== '')
      getAndSetServiceTypes(formdata.subcategory);
  }, [formdata.subcategory]);

  // get categores from server
  const getCategories = async () => {
    await axios.get(props.baseUrl + '/api/raw/categories').then((response) => {
      if (response.data.found) {
        let data = response.data.data;
        data.unshift({ cat_id: '', cat_name: 'Select Category' });
        setcategories(response.data.data);
      }
    });
  };

  // get servie data from server
  const getServiceData = async () => {
    let title = '';
    const path = props.location.pathname.split('/');
    if (path.length === 4) {
      title = path[3];
    }

    await axios
      .get(props.baseUrl + '/api/service/' + title)
      .then((response) => {
        if (response.data.found) {
          const data = response.data.data[0];

          console.log('==>', data);
          let images = [];
          // loop on images
          data.images.split(',').forEach(async (ele) => {
            await axios
              .get(window.location.origin + ele, {
                responseType: 'blob',
              })
              .then(async (res) => {
                const fileReader = new FileReader();
                await fileReader.readAsDataURL(res.data);
                fileReader.onload = async (e) => {
                  images.push(e.target.result);

                  if (images.length === data.images.split(',').length) {
                    setformdata({
                      ...formdata,
                      title: data.title,
                      serviceID: data.id,
                      category: data.cat_id,
                      subcategory: data.subcat_id,
                      serviceType: data.service_type,
                      searchTags: data.search_tags,
                      price: data.price,
                      Delivery: data.delivery_time,
                      description: data.description,
                      images: images,
                      urlTitle: data.url_title,
                    });
                  }
                };
              });
          });
        }
      })
      .catch((err) => {});
  };

  // get sub categories from server and set to states
  const getAndSetSubCategories = async (cat, reset = false) => {
    // console.log("cat",cat);

    if (reset)
      setformdata({
        ...formdata,
        serviceType: '',
        subcategory: '',
      });

    if (cat !== '') {
      await axios
        .get(props.baseUrl + '/api/raw/' + cat + '/subcategories')
        .then((response) => {
          // console.log(response);

          if (response.data.found) {
            let data = response.data.data;
            data.unshift({
              sub_cat_id: '',
              subcat_name: 'Select Sub Category',
            });
            // console.log(response.data.data);
            // return response.data.data;
            setsubcategories(response.data.data);
            setservicetypes([]);
          } else {
            setsubcategories([]);
            setservicetypes([]);
          }
        })
        .catch((err) => {});
    }
  };

  // get service types from server and set to states
  const getAndSetServiceTypes = (subcat) => {
    // setformdata({
    //   ...formdata,
    //   serviceType: "",

    // })
    axios
      .get(props.baseUrl + '/api/raw/' + subcat + '/servicetypes')
      .then((response) => {
        console.log(response);

        if (response.data.found) {
          let data = response.data.data;
          data.unshift({ ser_id: '', ser_name: 'Select Service Type' });
          setservicetypes(response.data.data);
        } else {
          setservicetypes([]);
        }
      })
      .catch((err) => {});
  };

  const onInputChange = (e) => {
    let add = true;
    settitleError(false);

    if (e.target.name === 'category') {
      if (e.target.value !== '') {
        getAndSetSubCategories(e.target.value, true);
      } else {
        setsubcategories([]);
      }
    }
    if (e.target.name === 'subcategory') {
      // console.log("you");
      if (e.target.value !== '') {
        getAndSetServiceTypes(e.target.value);
        setformdata({
          ...formdata,
          serviceType: '',
        });
      } else {
        setservicetypes([]);
        setformdata({
          ...formdata,
          serviceType: '',
        });
      }
    } else if (e.target.name === 'title') {
      var regexp = new RegExp(/^[a-zA-Z0-9 ,]+$/);
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
    props.editService(formdata, props.history, false);
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

  const onEditorChange = (evt) => {
    setformdata({
      ...formdata,
      description: evt.editor.getData(),
    });
  };
  return (
    <Fragment>
      {console.log(formdata)}
      <div className="EditService" id="overview">
        <div className="container">
          <div className="row">
            <div className="col-sm-1 col-md-1 "></div>
            <div className="col-sm-8 col-md-8">
              <div className="job-box">
                <div className="job-header">
                  <h4>Edit Service</h4>
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
                      required
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
                        required
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
                        required
                        onChange={onInputChange}
                        className="form-control"
                      >
                        {subcategories &&
                          subcategories.map((op) => {
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

                  <div id="searchtags" className="col-lg-12 job-sec p-0">
                    <div className="form-group">
                      <label>Search Tags</label>
                      <textarea
                        type="text"
                        className="form-control search-tags"
                        placeholder=""
                        name="searchTags"
                        value={searchTags}
                        onChange={onInputChange}
                      ></textarea>
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
                        data={formdata.description}
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

                  <button className="kafe-btn kafe-btn-mint-small full-width">
                    Submit
                  </button>
                </form>
              </div>
            </div>

            <div className="col-sm-3 col-md-3 ">
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
                        <i className="fa fa-lock"></i>{' '}
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
                        <i className="fa fa-lock"></i> <span>Description</span>
                      </a>
                    </li>
                  </ul>

                  {/* <ul className="sidebar-menu" data-widget="tree">
                    <li>
                      <button className="btn btn-warning form-control form-draft-button">
                        <span>Save as Draft</span>
                      </button>
                    </li>
                    <li>
                      <button className="btn btn-success form-control form-submit-button">
                        <span>Submit for verifications</span>
                      </button>
                    </li>
                  </ul> */}
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
  editService,
  setToast,
})(EditService);
