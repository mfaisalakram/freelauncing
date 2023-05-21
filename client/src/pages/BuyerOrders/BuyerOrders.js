import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-server';
import Spinner from '../../components/layout/Spinner';
import { loadUser, startLoading } from '../../store/actions/auth';
import { setToast } from '../../store/actions/toast';
import { getBuyerOrders } from '../../store/actions/orders';
import { Link } from 'react-router-dom';
import './BuyerOrders.css';
// import $ from "jquery";
import Model from '../../components/layout/Model';
const BuyerOrders = (props) => {
  const [counts, setCounts] = useState({});
  const [active, setActive] = useState('active');
  const [selectedId, setselectedId] = useState(-1);

  useEffect(() => {
    props.getBuyerOrders('active', props.history);
    getCount();
  }, []);

  console.log(props.orders);
  function duration(t0, t1) {
    let d = t1 - t0;
    let weekdays = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
    let days = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
    let hours = Math.floor(d / 1000 / 60 / 60 - weekdays * 7 * 24 - days * 24);
    let minutes = Math.floor(
      d / 1000 / 60 - weekdays * 7 * 24 * 60 - days * 24 * 60 - hours * 60
    );
    let seconds = Math.floor(
      d / 1000 -
        weekdays * 7 * 24 * 60 * 60 -
        days * 24 * 60 * 60 -
        hours * 60 * 60 -
        minutes * 60
    );
    let milliseconds = Math.floor(
      d -
        weekdays * 7 * 24 * 60 * 60 * 1000 -
        days * 24 * 60 * 60 * 1000 -
        hours * 60 * 60 * 1000 -
        minutes * 60 * 1000 -
        seconds * 1000
    );
    let t = {};
    ['weekdays', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach(
      (q) => {
        if (eval(q) > 0) {
          t[q] = eval(q);
        }
      }
    );
    return t;
  }
  const getCount = () => {
    axios
      .get('http://localhost:5000/api/service/user/services/count')
      .then((response) => {
        if (response.data.error) {
        } else {
          if (response.data.found === true) {
            setCounts(response.data.data);
            console.log(response.data.data);
          }
        }
      })
      .catch((err) => {});
  };
  const onServiceTagClick = (e, tag) => {
    props.getBuyerOrders(tag, props.history);
    setActive(tag);
  };

  const onPauseService = async (e, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post('http://localhost:5000/api/service/pause', { id: id }, config)
      .then((response) => {
        console.log(response.data);

        props.getServices(active, props.history);
        getCount();
        props.setToast([response.data]);
      })
      .catch((err) => {});
  };
  const onActivateService = async (e, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post('http://localhost:5000/api/service/active', { id: id }, config)
      .then((response) => {
        console.log(response.data);

        props.getServices(active, props.history);
        getCount();
        props.setToast([response.data]);
      })
      .catch((err) => {});
  };

  const onDeleteService = async (e, id) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    await axios
      .post('http://localhost:5000/api/service/delete', { id: id }, config)
      .then((response) => {
        console.log(response.data);

        props.getServices(active, props.history);
        getCount();
        props.setToast([response.data]);
      })
      .catch((err) => {});
  };

  let html = <Spinner />;
  if (props.loadingOrders === false) {
    console.log(active);
    if (active === 'active') {
      html = (
        <div className="tableOuter">
          {/* <div>
            <span>Active Orders</span>
            <select name="" id="" className="filter-options">
              <option value="7">last 7 days</option>
              <option value="14">last 14 days</option>
              <option value="30">last 30 days</option>
              <option value="60">last 60 days </option>
            </select>
          </div> */}
          <table className="table ">
            <thead>
              <tr>
                <th>Order</th>

                <th>Due in</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {props.orders &&
                props.orders.map((order, key) => {
                  var date1 = new Date();
                  var deliveryDate = new Date(order.order_datetime);
                  deliveryDate.setDate(
                    deliveryDate.getDate() + order.delivery_time
                  );

                  let dateData = duration(date1, deliveryDate);
                  let late = date1 > deliveryDate;

                  return (
                    <tr key={key}>
                      <td>
                        <div className="service-tag">
                          <span>
                            <Link
                              to={
                                '/users/' +
                                order.seller_username +
                                '/orders/' +
                                order.order_id
                              }
                            >
                              {order.title}
                            </Link>
                          </span>
                        </div>
                      </td>
                      <td>
                        {late && '- '}
                        {dateData.days === undefined
                          ? ''
                          : dateData.days + ' days '}{' '}
                        {dateData.minutes === undefined
                          ? ''
                          : dateData.minutes + ' minutes '}
                        {dateData.seconds === undefined
                          ? ''
                          : dateData.seconds + ' seconds'}
                        {late && ' '}
                        {late && (
                          <span className="btn btn-sm btn-danger">late</span>
                        )}
                      </td>
                      <td>
                        <strong>${order.amount}</strong>{' '}
                      </td>

                      <td>
                        <button className="btn btn-sm p-0 btn-success">
                          {order.order_status}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      );
    } else if (active === 'late') {
      html = (
        <div className="tableOuter">
          <div>
            <span>Active BuyerOrders</span>
            <select name="" id="" className="filter-options">
              <option value="7">last 7 days</option>
              <option value="14">last 14 days</option>
              <option value="30">last 30 days</option>
              <option value="60">last 60 days </option>
            </select>
          </div>
          <table className="table ">
            <thead>
              <tr>
                {/* <th>Order ID</th> */}
                <th>Buyer</th>
                <th>Service</th>
                <th>Due On</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {props.orders &&
                props.orders.map((order, key) => {
                  var date1 = new Date();
                  var deliveryDate = new Date(order.order_datetime);
                  deliveryDate.setDate(
                    deliveryDate.getDate() + order.delivery_time
                  );

                  let dateData = duration(date1, deliveryDate);

                  return (
                    <tr key={key}>
                      <td>
                        <img
                          className="image-circle"
                          src={order.buyer_profile_photo}
                          alt=""
                        />{' '}
                        <Link to={'/users/' + order.buyer_username}>
                          {order.buyer_username}
                        </Link>
                      </td>
                      <td>
                        <div className="service-tag">
                          <span>
                            {' '}
                            <Link to={order.service_url}>{order.title}</Link>
                          </span>
                        </div>
                      </td>
                      <td>
                        -{' '}
                        {dateData.days === undefined
                          ? ''
                          : dateData.days + ' days '}{' '}
                        {dateData.minutes === undefined
                          ? ''
                          : dateData.minutes + ' minutes '}
                        {dateData.seconds === undefined
                          ? ''
                          : dateData.seconds + ' seconds'}
                      </td>
                      <td>${order.amount}</td>
                      <td>${order.amount}</td>
                      <td>
                        <span className="btn btn-sm btn-danger">Late</span>
                      </td>
                      {/*                   
                  <td>
                    <div className="service-options">
                      <div className="option-menu btn-group btn">
                        {active != "denied" && (
                          <a href={"/aftabfalak/"+service.url_title} className="btn btn-success" title="view Service">
                            <i className="fa fa-eye"></i>
                          </a>
                        )}
                        {active != "denied" && (
                          <a
                            href={"/services/edit/" + service.url_title}
                            className="btn btn-default"
                            title="Edit Service"
                          >
                            <i className="fa fa-edit"></i>
                          </a>
                        )}

                        {active === "paused" && (
                          <button
                            title="Activate Service"
                            data-toggle="modal"
                            data-target="#active"
                            onClick={e => setselectedId(service.id)}
                            className="btn btn-warning"
                          >
                            <i className="fa fa-play"></i>
                          </button>
                        )}

                        {active === "active" && (
                          <button
                            title="Pause Service"
                            data-toggle="modal"
                            data-target="#pause"
                            onClick={e => setselectedId(service.id)}
                            className="btn btn-warning"
                          >
                            <i className="fa fa-pause"></i>
                          </button>
                        )}

                        <button
                          data-toggle="modal"
                          data-target="#delete"
                          title="Delete Service"
                          onClick={e => setselectedId(service.id)}
                          className="btn btn-danger"
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </td>
               
                */}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      );
    } else if (active === 'delivered') {
      html = (
        <div className="tableOuter">
          <div>
            <span>Active Orders</span>
            <select name="" id="" className="filter-options">
              <option value="7">last 7 days</option>
              <option value="14">last 14 days</option>
              <option value="30">last 30 days</option>
              <option value="60">last 60 days </option>
            </select>
          </div>
          <table className="table ">
            <thead>
              <tr>
                {/* <th>Order ID</th> */}
                <th>Buyer</th>
                <th>Service</th>
                <th>Due On</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {props.orders &&
                props.orders.map((order, key) => {
                  var date1 = new Date();
                  var deliveryDate = new Date(order.order_datetime);
                  deliveryDate.setDate(
                    deliveryDate.getDate() + order.delivery_time
                  );

                  let dateData = duration(date1, deliveryDate);

                  return (
                    <tr key={key}>
                      <td>
                        <img
                          className="image-circle"
                          src={order.buyer_profile_photo}
                          alt=""
                        />{' '}
                        <Link to={'/users/' + order.buyer_username}>
                          {order.buyer_username}
                        </Link>
                      </td>
                      <td>
                        <div className="service-tag">
                          <span>
                            {' '}
                            <Link to={order.service_url}>{order.title}</Link>
                          </span>
                        </div>
                      </td>
                      <td>
                        -{' '}
                        {dateData.days === undefined
                          ? ''
                          : dateData.days + ' days '}{' '}
                        {dateData.minutes === undefined
                          ? ''
                          : dateData.minutes + ' minutes '}
                        {dateData.seconds === undefined
                          ? ''
                          : dateData.seconds + ' seconds'}
                      </td>
                      <td>${order.amount}</td>
                      <td>${order.amount}</td>
                      <td>
                        <span className="btn btn-sm btn-danger">Late</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      );
    } else if (active === 'completed') {
      html = (
        <div className="tableOuter">
          <div>
            <span>Completed Orders</span>
            <select name="" id="" className="filter-options">
              <option value="7">last 7 days</option>
              <option value="14">last 14 days</option>
              <option value="30">last 30 days</option>
              <option value="60">last 60 days </option>
            </select>
          </div>
          <table className="table ">
            <thead>
              <tr>
                {/* <th>Order ID</th> */}
                <th>Buyer</th>
                <th>Service</th>
                <th>Due On</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {props.orders &&
                props.orders.map((order, key) => {
                  var date1 = new Date();
                  var deliveryDate = new Date(order.order_datetime);
                  deliveryDate.setDate(
                    deliveryDate.getDate() + order.delivery_time
                  );

                  let dateData = duration(date1, deliveryDate);

                  return (
                    <tr key={key}>
                      <td>
                        {/* <img
                          className="image-circle"
                          src={order.buyer_profile_photo}
                          alt=""
                        />{' '} */}
                        <Link to={'/users/' + order.buyer_username}>
                          {order.buyer_username}
                        </Link>
                      </td>
                      <td>
                        <div className="service-tag">
                          <span>
                            {' '}
                            <Link to={order.service_url}>{order.title}</Link>
                            <Link
                              to={
                                '/users/' +
                                order.seller_username +
                                '/manage_orders/' +
                                order.order_id
                              }
                            >
                              {' '}
                              view order
                            </Link>
                          </span>
                        </div>
                      </td>
                      <td>
                        -{' '}
                        {dateData.days === undefined
                          ? ''
                          : dateData.days + ' days '}{' '}
                        {dateData.minutes === undefined
                          ? ''
                          : dateData.minutes + ' minutes '}
                        {dateData.seconds === undefined
                          ? ''
                          : dateData.seconds + ' seconds'}
                      </td>
                      <td>${order.amount}</td>
                      <td>${order.amount}</td>
                      <td>
                        <span className="btn btn-sm btn-danger">Late</span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      );
    } else if (active === 'cancelled') {
      html = (
        <div className="tableOuter">
          <div>
            <span>Cancelled Orders</span>
            <select name="" id="" className="filter-options">
              <option value="7">last 7 days</option>
              <option value="14">last 14 days</option>
              <option value="30">last 30 days</option>
              <option value="60">last 60 days </option>
            </select>
          </div>
          <table className="table ">
            <thead>
              <tr>
                {/* <th>Order ID</th> */}
                <th>Buyer</th>
                <th>Service</th>
                <th>Due On</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {props.orders &&
                props.orders.map((order, key) => {
                  var date1 = new Date();
                  var deliveryDate = new Date(order.order_datetime);
                  deliveryDate.setDate(
                    deliveryDate.getDate() + order.delivery_time
                  );

                  let dateData = duration(date1, deliveryDate);

                  return (
                    <tr key={key}>
                      <td>
                        <img
                          className="image-circle"
                          src={order.buyer_profile_photo}
                          alt=""
                        />{' '}
                        <Link to={'/users/' + order.buyer_username}>
                          {order.buyer_username}
                        </Link>
                      </td>
                      <td>
                        <div className="service-tag">
                          <span>
                            {' '}
                            <Link to={order.service_url}>{order.title}</Link>
                          </span>
                        </div>
                      </td>
                      <td>
                        -{' '}
                        {dateData.days === undefined
                          ? ''
                          : dateData.days + ' days '}{' '}
                        {dateData.minutes === undefined
                          ? ''
                          : dateData.minutes + ' minutes '}
                        {dateData.seconds === undefined
                          ? ''
                          : dateData.seconds + ' seconds'}
                      </td>
                      <td>${order.amount}</td>
                      <td>
                        <span className="btn btn-sm btn-default">
                          Cancelled
                        </span>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      );
    }
  }

  return (
    <div className="BuyerOrders">
      {console.log(selectedId)}
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h2>Manage Orders</h2>
          </div>
          <div className="col-md-12">
            <div>
              <div className="servicesTypeButtons">
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'active');
                  }}
                  style={active === 'active' ? { fontWeight: '600' } : {}}
                >
                  Active
                  {counts.active && (
                    <span className="service-count">{counts.active}</span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'awaitingMyReview');
                  }}
                  style={
                    active === 'awaitingMyReview' ? { fontWeight: '600' } : {}
                  }
                >
                  Awaiting My Review
                  {counts.awaitingMyReview && (
                    <span className="service-count">
                      {counts.awaitingMyReview}
                    </span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'delivered');
                  }}
                  style={active === 'delivered' ? { fontWeight: '600' } : {}}
                >
                  Delivered
                  {counts.delivered && (
                    <span className="service-count">{counts.delivered}</span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'completed');
                  }}
                  style={active === 'completed' ? { fontWeight: '600' } : {}}
                >
                  Completed
                  {counts.completed && (
                    <span className="service-count">{counts.completed}</span>
                  )}
                </span>
                <span
                  onClick={(e) => {
                    onServiceTagClick(e, 'cancelled');
                  }}
                  style={active === 'cancelled' ? { fontWeight: '600' } : {}}
                >
                  Cancelled
                  {counts.cancelled && (
                    <span className="service-count">{counts.cancelled}</span>
                  )}
                </span>
              </div>
            </div>

            <div></div>

            {html}
          </div>
        </div>
      </div>

      <Model
        modelID="pause"
        title="Pause Service"
        content={<h4>Are your sure you want to pause this service ?</h4>}
        action={(e) => onPauseService(e, selectedId)}
      />

      <Model
        modelID="delete"
        title="Delete Service"
        content={<h4>Are your sure you want to delete this service ?</h4>}
        action={(e) => onDeleteService(e, selectedId)}
      />

      <Model
        modelID="active"
        title="Activate Service"
        content={<h4>Are your sure you want to Activate this service ?</h4>}
        action={(e) => onActivateService(e, selectedId)}
      />

      <Model
        modelID="pause"
        title="pause Service"
        content={<h4>Are your sure you want to Pause this service ?</h4>}
        action={(e) => onPauseService(e, selectedId)}
      />
    </div>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  orders: state.orders.orders,
  loadingOrders: state.orders.loading,
});
export default connect(mapStatetoProps, {
  loadUser,
  startLoading,
  getBuyerOrders,
  setToast,
})(BuyerOrders);
