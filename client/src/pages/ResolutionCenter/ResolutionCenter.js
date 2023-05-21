import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ResolutionCenter.css';
import axios from '../../axios-server';
import * as types from '../../components/constants/constants';

const ResolutionCenter = (props) => {
  const [option, setoption] = useState({
    option: '',
    optionData: [],
    selectedSub: '',
  });

  const getOrderId = () => {
    let order_id = '';
    const path = props.location.pathname.split('/');
    if (path.length === 3) {
      order_id = path[2];
    }
    return order_id;
  };

  const sendRequestWithData = (data = {}) => {
    const order_id = getOrderId();
    axios
      .post('/api/orders/handle-requests/', {
        ...formData,
        order_id: order_id,
        ...data,
      })
      .then((res) => {
        props.history.goBack();
      });
  };

  const [steps, setsteps] = useState(1);

  const onSubmitFormExtend = (e) => {
    let order_id = '';
    const path = props.location.pathname.split('/');
    if (path.length === 3) {
      order_id = path[2];
    }
    axios
      .post('/api/orders/send-extend-order/', {
        ...formData,
        order_id: order_id,
      })
      .then((res) => {
        props.history.goBack();
      });
  };

  const onSubmitFormCancel = (e) => {
    let order_id = '';
    const path = props.location.pathname.split('/');
    if (path.length === 3) {
      order_id = path[2];
    }
    axios
      .post('/api/orders/send-cancel-order/', {
        ...formData,
        order_id: order_id,
      })
      .then((res) => {
        props.history.goBack();
      });
  };

  const [formData, setformData] = useState({
    amount: '',
    delivery_time: 1,
    title: '',
    description: '',
    selectedSub: '',
  });
  const onOptionClick = (op) => {
    axios.get('/api/orders/get-sub-question/' + op).then((res) => {
      setoption({
        option: op,
        optionData: res.data.data,
      });
    });
  };

  const onSubOptionClick = (id) => {
    setoption({
      ...option,
      selectedSub: id,
    });
    setformData({
      ...formData,
      selectedSub: id,
    });
  };

  let html = '';
  if (steps === 1) {
    html = (
      <div>
        <h4>what can we help you do?</h4>
        <div className="options">
          <p
            onClick={(e) => {
              onOptionClick('modify');
              setsteps(2);
            }}
            className="Q"
          >
            Modify the order
          </p>
          <p
            onClick={(e) => {
              onOptionClick(types.EXTEND);
              setsteps(2);
            }}
            className="Q"
          >
            Extend the delivery Time
          </p>
          <p
            onClick={(e) => {
              onOptionClick(types.CANCEL);
              setsteps(2);
            }}
            className="Q"
          >
            Ask the buyer to cancel this order
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="container ResolutionCenter">
        <div className="row">
          <div className="col-sm-9">
            <div>
              <h3>Resolution Center</h3>
              <p>
                Welcome here you can work things out and resolve issues
                regarding your orders
              </p>
            </div>

            {html}

            {steps === 2 && (
              <div>
                <h3>Can you give more details on why?</h3>

                {option.optionData.map((o) => {
                  return (
                    <p
                      className="subQ"
                      onClick={(e) => {
                        onSubOptionClick(o.id);
                        setsteps(3);
                      }}
                    >
                      {o.sub_question}
                    </p>
                  );
                })}

                <button
                  onClick={(e) => setsteps(1)}
                  className="btn btn-warning"
                >
                  Back
                </button>
              </div>
            )}
            {console.log(option.option)}
            {steps === 3 && option.option === types.MODIFY && (
              <div>
                <h2>Modify the order</h2>

                <div>
                  <form action="">
                    <div className="row">
                      <div className="col-sm-12">
                        <input
                          className="form-control in"
                          placeholder="Title"
                          type="title"
                          name="title"
                          value={formData.title}
                          autoComplete="off"
                          onChange={(e) =>
                            setformData({
                              ...formData,
                              [e.target.name]: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-sm-6">
                        <div className="row">
                          <div className="col-sm-4">
                            <span>For an extra</span>
                          </div>
                          <div className="col-sm-8">
                            <input
                              type="number"
                              min="0"
                              placeholder="$10"
                              name="amount"
                              autoComplete="off"
                              onChange={(e) =>
                                setformData({
                                  ...formData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              className="form-control in"
                              value={formData.price}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="row">
                          <div className="col-sm-4">
                            {' '}
                            <span>Delivery Time</span>
                          </div>
                          <div className="col-sm-8">
                            {' '}
                            <select
                              value={formData.delivery_time}
                              name="delivery_time"
                              onChange={(e) =>
                                setformData({
                                  ...formData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              className="form-control in"
                            >
                              {<option value={1}>1 day</option>}

                              {[...new Array(29)].map((ele, index) => {
                                return (
                                  <option value={index + 2}>
                                    {index + 2} day
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <textarea
                          name="description"
                          placeholder="describe to buyer why are you doing"
                          className="form-control"
                          id=""
                          onChange={(e) =>
                            setformData({
                              ...formData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          cols="30"
                          rows="10"
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>

                <button
                  type="button"
                  onClick={(e) => setsteps(2)}
                  className="btn btn-warning"
                >
                  Back
                </button>
                <button
                  className="btn btn-success pull-right"
                  onClick={() =>
                    sendRequestWithData({
                      request: types.SEND_MODIFY_ORDER,
                      ...formData,
                    })
                  }
                >
                  Submit
                </button>
              </div>
            )}

            {steps === 3 && option.option === types.CANCEL && (
              <div>
                <h2>Cancel the Order</h2>
                <h4>you can ask the buyer to cancel the order</h4>
                <div>
                  <form action="">
                    <div className="row">
                      <div className="col-sm-12">
                        <h3>
                          Explain to the buyer why you would like to cancel this
                          order
                        </h3>
                        <textarea
                          name="description"
                          placeholder="describe to buyer why are you doing"
                          className="form-control"
                          id=""
                          onChange={(e) =>
                            setformData({
                              ...formData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          cols="30"
                          rows="10"
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>

                <button
                  type="button"
                  onClick={(e) => setsteps(2)}
                  className="btn btn-warning"
                >
                  Back
                </button>
                <button
                  className="btn btn-success pull-right"
                  onClick={() =>
                    sendRequestWithData({ request: types.SEND_CANCEL_ORDER })
                  }
                >
                  Submit
                </button>
              </div>
            )}
            {steps === 3 && option.option === types.EXTEND && (
              <div>
                <h2>Extend Delivery time request</h2>
                <h4>Ask buper to extend delivery Time</h4>
                <div>
                  <form action="">
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="row">
                          <div className="col-sm-4">
                            {' '}
                            <span>Delivery Time</span>
                          </div>
                          <div className="col-sm-8">
                            {' '}
                            <select
                              value={formData.delivery_time}
                              name="delivery_time"
                              onChange={(e) =>
                                setformData({
                                  ...formData,
                                  [e.target.name]: e.target.value,
                                })
                              }
                              className="form-control in"
                            >
                              {<option value={1}>1 day</option>}

                              {[...new Array(29)].map((ele, index) => {
                                return (
                                  <option value={index + 2}>
                                    {index + 2} day
                                  </option>
                                );
                              })}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col-sm-6"></div>
                      <div className="col-sm-12">
                        <textarea
                          name="description"
                          placeholder="describe to buyer why are you doing"
                          className="form-control"
                          id=""
                          onChange={(e) =>
                            setformData({
                              ...formData,
                              [e.target.name]: e.target.value,
                            })
                          }
                          cols="30"
                          rows="10"
                        ></textarea>
                      </div>
                    </div>
                  </form>
                </div>
                <button
                  type="button"
                  onClick={(e) => setsteps(2)}
                  className="btn btn-warning"
                >
                  Back
                </button>
                <button
                  className="btn btn-success pull-right"
                  onClick={() =>
                    sendRequestWithData({ request: types.SEND_EXTEND_ORDER })
                  }
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResolutionCenter;
