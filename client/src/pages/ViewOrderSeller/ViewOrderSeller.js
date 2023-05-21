import React, { Fragment, useEffect, useState } from 'react';
import image from '../../img/imageplaceholder.png';
import axios from '../../axios-server';
import { Link } from 'react-router-dom';
import './ViewOrderSeller.css';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import OrderStep from '../../components/OrderComponent/OrderStep/OrderStep';
import MessageTemplate from '../../components/OrderComponent/MessageTemplate/MessageTemplate';
import DeliveryTemplate from '../../components/OrderComponent/DeliveryTemplate/DeliveryTemplate';
import * as types from '../../components/constants/constants';

import OrderStartd from '../../img/order-started.svg';
import OrderDelivery from '../../img/order-delivery.png';

import { connect } from 'react-redux';
import { setToast } from '../../store/actions/toast';

import ModifyOrderSellerSend from '../../components/OrderComponent/ModifyOrder/ModifyOrderSellerSend/ModifyOrderSellerSend';
import ModifyOrderSellerReceive from '../../components/OrderComponent/ModifyOrder/ModifyOrderSellerReceive/ModifyOrderSellerReceive';

import ModelDelivery from '../../components/OrderComponent/ModelDelivery/ModelDelivery';
import ExtendDeliverTimeSellerSend from '../../components/OrderComponent/ExtendDelivery/ExtendDeliverTimeSellerSend/ExtendDeliverTimeSellerSend';
import ExtendDeliverTimeSellerReceive from '../../components/OrderComponent/ExtendDelivery/ExtendDeliverTimeSellerReceive/ExtendDeliverTimeSellerReceive';
import CancelOrderSellerSend from '../../components/OrderComponent/CancelOrder/CancelOrderSellerSend/CancelOrderSellerSend';
import CancelOrderSellerReceive from '../../components/OrderComponent/CancelOrder/CancelOrderSellerReceive/CancelOrderSellerReceive';

const ViewOrderSeller = (props) => {
  const [orderData, setorderData] = useState([]);
  const [chatData, setchatData] = useState([]);
  const [updateStackData, setupdateStackData] = useState([]);
  const [message, setmessage] = useState({
    msg: '',
    order_id: '',
    buyer_usernam: '',
    type: 'plain',
    attachments: [],
  });
  const [open, setOpen] = useState(false);
  const [files, setfiles] = useState({
    attachments: [],
    progresses: [],
    uploaded: [],
    fileNames: [],
  });

  const [description, setdescription] = useState('');
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getOrderId = () => {
    let order_id = '';
    const path = props.location.pathname.split('/');
    if (path.length === 5) {
      order_id = path[4];
    }
    return order_id;
  };

  const sendRequestWithData = (data = {}) => {
    const order_id = getOrderId();
    axios
      .post('/api/orders/handle-requests/', {
        order_id: order_id,
        ...data,
      })
      .then((res) => {
        window.location.reload();
      });
  };

  // get servie data from server
  const getorderData = async () => {
    let title = '';
    let orderID = '';
    const path = props.location.pathname.split('/');
    if (path.length === 5) {
      title = path[4];
      orderID = path[4];
    }

    await axios
      .get(props.baseUrl + '/api/orders/order-by-id/' + orderID)
      .then((response) => {
        if (response.data.found) {
          const data = response.data.data.orderData[0];
          console.log(response.data.data);
          setorderData({
            ...data,
          });
          setchatData(response.data.data.chatData);
          setupdateStackData(response.data.data.orderStack);
        }
      })
      .catch((err) => {});
  };

  const sendMessage = (e) => {
    let orderID = '';
    const path = props.location.pathname.split('/');
    if (path.length === 5) {
      orderID = path[4];
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let data = {
      message_content: message.msg,
      buyer_username: orderData.buyer_username,
      order_id: orderID,
      type: 'plain',
    };

    axios
      .post(props.baseUrl + '/api/orders/add-message', data, config)
      .then((response) => {})
      .catch((err) => {});

    setmessage({
      ...message,
      msg: '',
      type: 'plain',
    });
  };

  const uploadFiles = async () => {
    files.attachments.map((file, index) => {
      const formData = new FormData();
      formData.append('file', file); // appending file
      let filess = { ...files };
      axios
        .post('/project-delivery/upload', formData, {
          onUploadProgress: (ProgressEvent) => {
            let progress =
              Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
              '%';

            // console.log("1", files);
            filess.progresses[index] = progress;
            // console.log("2", filess);
            setfiles(filess);
            // console.log(index, progress);
          },
        })
        .then((res) => {
          console.log(res);
          // console.log("1", files);
          filess.uploaded[index] = true;
          // console.log("2", filess);
          setfiles(filess);
          // console.log(index, progress);
          // sendMessage(res.data.path);
        })
        .catch((err) => console.log(err));
    });
  };

  const deliverWork = () => {
    let orderID = '';
    const path = props.location.pathname.split('/');
    if (path.length === 5) {
      orderID = path[4];
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const attachments = files.fileNames.join(',');

    const data = {
      order_id: orderID,
      description: description,
      attachments: attachments,
    };

    axios.post('/api/orders/send-order-delivery/', data, config).then((res) => {
      setfiles({
        attachments: [...files.attachments],
        progresses: [...files.progresses],
        uploaded: [...files.uploaded],
        fileNames: [...files.fileNames],
      });
      setdescription('');
      handleClose();
      props.setToast([{ msg: 'you just delivery you work', type: 'success' }]);

      //  props.history.goBack();
    });
  };
  const removeFile = (file, index) => {
    let filess = { ...files };
    filess.uploaded.splice(index, 1);
    filess.attachments.splice(index, 1);
    filess.progresses.splice(index, 1);
    filess.fileNames.splice(index, 1);
    setfiles(filess);
  };

  const uploadFile = async (file, index) => {
    const formData = new FormData();
    formData.append('file', file); // appending file
    let filess = { ...files };
    axios
      .post('/project-delivery/upload', formData, {
        onUploadProgress: (ProgressEvent) => {
          let progress =
            Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
            '%';
          filess.progresses[index] = progress;
          setfiles(filess);
        },
      })
      .then((res) => {
        filess.uploaded[index] = true;
        filess.fileNames[index] = res.data.fileName;
        console.log(res.data);
        setfiles(filess);
      })
      .catch((err) => console.log(err));
  };

  const onAttachmentChange = (event) => {
    const max = 3;
    const maxfilesize = 8589934592;
    // const maxfilesize = 858993;
    let currentFile = 0;
    // setProgess(0);
    if (files.attachments) {
      files.attachments.map((file) => {
        currentFile += parseInt(file.size);
      });
    }

    console.log('++++++++++++++++++++', currentFile);
    if (event.target.files[0] != undefined) {
      const filesx = [...event.target.files]; // accesing file

      filesx.map((file) => {
        currentFile += parseInt(file.size);
      });

      console.log('----------------------------', currentFile);

      if (
        files.attachments.length + filesx.length <= max &&
        currentFile <= maxfilesize
      ) {
        let files_temp = {
          attachments: [...files.attachments],
          progresses: [...files.progresses],
          uploaded: [...files.uploaded],
          fileNames: [...files.fileNames],
        };

        filesx.map((file, index) => {
          files_temp.attachments.push(file);
          files_temp.progresses.push(0);
          files_temp.uploaded.push(false);
          files_temp.fileNames.push('');
        });
        setfiles(files_temp);
        // uploadFile(file);
      } else {
        if (
          currentFile > maxfilesize &&
          files.attachments.length + filesx.length > max
        ) {
          props.setToast([
            { msg: 'Max 1GB file size Allow (Total)', type: 'warning' },
            { msg: 'max ' + max + ' files allowed', type: 'warning' },
          ]);
        } else if (currentFile > maxfilesize) {
          props.setToast([
            { msg: 'Max 1GB file size Allow (Total)', type: 'warning' },
          ]);
        } else if (files.attachments.length + filesx.length > max) {
          props.setToast([
            { msg: 'Max ' + max + ' files allowed', type: 'warning' },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    getorderData();
    // console.log("cube",cube(2,6));
  }, []);

  let orderID = '';
  const path = props.location.pathname.split('/');
  if (path.length === 5) {
    orderID = path[4];
  }

  return (
    <Fragment>
      <div className="ViewOrderSeller">
        {console.log(files)}
        <section className="container section-padding">
          {props.auth.loading === false ? (
            <div className="row">
              <div className="col-lg-9 col-sm-9 col-md-9">
                <div className="order-page">
                  <div className="row">
                    <div className="col-md-9">
                      <h2>
                        Order #{orderData.order_id}{' '}
                        <Link to={'' + orderData.service_url}>
                          <small className="view-service">view service</small>
                        </Link>
                      </h2>
                      <p>
                        Buyer:{' '}
                        <Link
                          className="username"
                          to={'/buyers/' + orderData.buyer_username}
                        >
                          {orderData.buyer_username}
                        </Link>{' '}
                        {/*<span className="history">(<Link to="/buyer/">view history</Link>)</span>*/}{' '}
                        |{' '}
                        <span className="date">{orderData.order_datetime}</span>
                      </p>
                    </div>
                    <div className="col-md-3">
                      <h2 className="pull-right">
                        $
                        {parseFloat(
                          updateStackData.total
                            ? updateStackData.total.t_amount
                            : 0
                        ).toFixed(2)}
                      </h2>
                    </div>
                    <div className="col-sm-12">
                      <hr />
                    </div>

                    <div className="col-sm-12">
                      <div>{orderData.offer_description}</div>
                    </div>
                    <div className="col-sm-12">
                      <hr />
                    </div>
                    <div className="col-sm-12">
                      <table className="table table-stripped">
                        <thead>
                          <tr>
                            <th>item</th>
                            <th>Duration</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>{orderData.title}</td>
                            <td>{orderData.delivery_time} day</td>
                            <td>${parseFloat(orderData.amount).toFixed(2)}</td>
                          </tr>
                          {updateStackData.data &&
                            updateStackData.data.map((stack) => {
                              // if(stack.order_status="active")
                              return (
                                <tr>
                                  <td>
                                    {stack.order_status === 'extended'
                                      ? 'Order Extended'
                                      : 'Order Modified'}
                                  </td>
                                  <td>
                                    {stack.delivery_time}{' '}
                                    {stack.delivery_time === 1
                                      ? ' day'
                                      : ' days'}
                                  </td>
                                  <td>
                                    {stack.amount === 0
                                      ? 'No Change'
                                      : '$' + stack.amount}{' '}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td></td>
                            <td>
                              <strong>
                                {' '}
                                Total:{' '}
                                {updateStackData.total
                                  ? updateStackData.total.t_time === 1
                                    ? updateStackData.total.t_time + ' day'
                                    : updateStackData.total.t_time + ' days'
                                  : 'N/A'}
                              </strong>
                            </td>
                            <td>
                              <strong>
                                {' '}
                                Total: $
                                {parseFloat(
                                  updateStackData.total
                                    ? updateStackData.total.t_amount
                                    : 0
                                ).toFixed(2)}
                              </strong>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="order-page mt-top">
                  <div className="row">
                    <OrderStep
                      image={OrderStartd}
                      heading="Order Started"
                      description={
                        <div>
                          <span>The order countdown is now ticking</span>
                          <br />
                          <span>
                            Don't waste your time reading this message
                          </span>
                        </div>
                      }
                    />

                    <div className="col-sm-12">
                      <hr />
                    </div>
                  </div>
                </div>

                <div className="order-page mt-top">
                  {chatData.map((chat) => {
                    if (chat.sender_username === props.auth.user.username) {
                      if (chat.message_type === types.ORDER_MSG_PLAIN) {
                        return (
                          <Fragment>
                            <MessageTemplate
                              message={chat.message_content}
                              username="Me"
                              image={
                                '/assets/uploads/users/' +
                                props.auth.user.username +
                                '/profileImages/' +
                                props.auth.user.profile_image
                              }
                            />
                            <hr />
                          </Fragment>
                        );
                      } else if (chat.message_type === types.ORDER_MSG_EXTEND) {
                        return (
                          <Fragment>
                            <ExtendDeliverTimeSellerSend
                              request={sendRequestWithData}
                              chat={chat}
                              image={
                                '/assets/uploads/users/' +
                                props.auth.user.username +
                                '/profileImages/' +
                                props.auth.user.profile_image
                              }
                            />
                            <hr />
                          </Fragment>
                        );
                      } else if (chat.message_type === types.ORDER_MSG_CANCEL) {
                        return (
                          <Fragment>
                            <CancelOrderSellerSend
                              request={sendRequestWithData}
                              chat={chat}
                              image={
                                '/assets/uploads/users/' +
                                props.auth.user.username +
                                '/profileImages/' +
                                props.auth.user.profile_image
                              }
                            />
                            <hr />
                          </Fragment>
                        );
                      } else if (chat.message_type === types.ORDER_MSG_MODIFY) {
                        return (
                          <Fragment>
                            <ModifyOrderSellerSend
                              chat={chat}
                              image={
                                '/assets/uploads/users/' +
                                props.auth.user.username +
                                '/profileImages/' +
                                props.auth.user.profile_image
                              }
                              request={sendRequestWithData}
                            />
                            <hr />
                          </Fragment>
                        );
                      } else if (
                        chat.message_type === types.ORDER_MSG_DELIVER
                      ) {
                        return (
                          <Fragment>
                            <DeliveryTemplate
                              chat={chat}
                              icon={OrderDelivery}
                              image={
                                '/assets/uploads/users/' +
                                props.auth.user.username +
                                '/profileImages/' +
                                props.auth.user.profile_image
                              }
                            />
                            <hr />
                          </Fragment>
                        );
                      }
                    } else {
                      if (chat.message_type === types.ORDER_MSG_PLAIN) {
                        return (
                          <Fragment>
                            <MessageTemplate
                              message={chat.message_content}
                              username="Me"
                              image={
                                '/assets/uploads/users/' +
                                chat.buyer_username +
                                '/profileImages/' +
                                chat.profile_image
                              }
                            />
                            <hr />
                          </Fragment>
                        );
                      } else if (chat.message_type === types.ORDER_MSG_MODIFY) {
                        return (
                          <Fragment>
                            <ModifyOrderSellerReceive
                              request={sendRequestWithData}
                              chat={chat}
                              image={
                                '/assets/uploads/users/' +
                                chat.buyer_username +
                                '/profileImages/' +
                                chat.profile_image
                              }
                            />
                            <hr />
                          </Fragment>
                        );
                      } else if (chat.message_type === types.ORDER_MSG_EXTEND) {
                        return (
                          <Fragment>
                            <ExtendDeliverTimeSellerReceive
                              request={sendRequestWithData}
                              chat={chat}
                              image={
                                '/assets/uploads/users/' +
                                chat.buyer_username +
                                '/profileImages/' +
                                chat.profile_image
                              }
                            />
                            <hr />
                          </Fragment>
                        );
                      } else if (chat.message_type === types.ORDER_MSG_EXTEND) {
                        return (
                          <Fragment>
                            <CancelOrderSellerReceive
                              request={sendRequestWithData}
                              chat={chat}
                              image={
                                '/assets/uploads/users/' +
                                chat.buyer_username +
                                '/profileImages/' +
                                chat.profile_image
                              }
                            />
                            <hr />
                          </Fragment>
                        );
                      }
                    }
                  })}

                  <div>
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="delivery-box">
                          <button
                            className="btn btn-danger"
                            onClick={handleOpen}
                          >
                            Deliver your work
                          </button>

                          <ModelDelivery
                            open={open}
                            onAttachmentChange={onAttachmentChange}
                            files={files}
                            handleClose={handleClose}
                            uploadFile={uploadFile}
                            removeFile={removeFile}
                            description={description}
                            setdescription={setdescription}
                            deliverWork={deliverWork}
                          />
                          <h4>Or</h4>
                          <p>
                            Contact with your buyer{' '}
                            <strong>{orderData.buyer_username}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="col-sm-9">
                        <textarea
                          name="message"
                          className="form-control"
                          placeholder="Type message here...."
                          id=""
                          value={message.msg}
                          cols="30"
                          rows="4"
                          onChange={(e) =>
                            setmessage({ ...message, msg: e.target.value })
                          }
                        ></textarea>
                      </div>
                      <div className="col-sm-3">
                        <button
                          type="button"
                          className="btn btn-success form-control"
                          onClick={(e) => sendMessage(e)}
                        >
                          <i className="fa fa-paper-plane"></i> Send
                        </button>
                        <br />
                        <br />
                        <button className="btn btn-warning form-control ">
                          <i className="fa fa-paperclip"></i> attachments
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-sm-3 col-md-3">
                <div className="resolution-center">
                  <h3>Need to change and cancel the order?</h3>
                  <Link
                    className="btn btn-success form-control"
                    to={'/resolution-center/' + orderID}
                  >
                    Visit the resolution Center
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            ''
          )}
        </section>
      </div>
    </Fragment>
  );
};

const mapStatetoProps = (state) => ({
  auth: state.auth,
});
export default connect(mapStatetoProps, {
  setToast,
})(ViewOrderSeller);
