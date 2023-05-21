import React, { useState, useEffect, useRef } from 'react';
import ReceiverMSGTemplate from '../ReceiverMSGTemplate/ReceiverMSGTemplate';
import SenderMSGTemplate from '../SenderMSGTemplate/SenderMSGTemplate';
import axios from '../../../axios-server';
import { withRouter } from 'react-router';
import './ChatBox.css';
import { connect } from 'react-redux';
import { startLoading, loginUser } from '../../../store/actions/auth';

import ScrollToBottom, { useScrollToBottom } from 'react-scroll-to-bottom';
import SenderAttachmentTemplate from '../SenderAttachmentTemplate/SenderAttachmentTemplate';
import ReceiverAttachmentTemplate from '../ReceiverAttachmentTemplate/ReceiverAttachmentTemplate';
import SenderCustomOfferTemplate from '../SenderCustomOfferTemplate/SenderCustomOfferTemplate';
import Modal from 'react-bootstrap/Modal';
import { setToast } from '../../../store/actions/toast';
import ReceiverCustomOfferTemplate from '../ReceiverCustomOfferTemplate/ReceiverCustomOfferTemplate';
import moment from 'moment';
import imgPlaceholder from '../../../img/imageplaceholder.png';
import chatConversationImg from '../../../img/chat.png';
// const socket = openSocket("http://localhost:5000");
const ChatBox = (props) => {
  const [file, setFile] = useState(''); // storing the uploaded file    // storing the recived file from backend
  const [progress, setProgess] = useState(0); // progess bar
  const [modelshow, setmodelshow] = useState(false);
  const [errorx, setErrorx] = useState(false);
  const [titleError, settitleError] = useState(false);

  const [modelSerivesData, setmodelSerivesData] = useState([]);
  const [steps, setsteps] = useState(1);
  const [customOfferData, setcustomOfferData] = useState({
    serviceData: {},
    amount: 10,
    DeliveryTime: 1,
    description: '',
  });
  const [error, seterror] = useState({
    show: false,
    type: '',
    msg: '',
  });
  const [chatUsers, setchatUsers] = useState([]);
  const showModel = () => {
    setmodelshow(true);
    axios
      .get('/api/service/get-user-services/' + props.auth.user.username)
      .then((res) => {
        // console.log(res.data.data);
        setmodelSerivesData(res.data.data[0]);
      });
    setsteps(1);
  };
  const hideModel = () => {
    setmodelshow(false);
  };

  const scrollToBottom = useScrollToBottom();
  const [message, setmessage] = useState({
    msg: '',
    type: 'plain',
    receiver: '',
  });
  const [chatData, setchatData] = useState({
    username: '',
    profile_image: '',
  });

  const getReceiverUsername = async () => {
    let path = props.location.pathname.split('/');

    if (path.length === 3) {
      await axios.get('/api/users/check-userData/' + path[2]).then((res) => {
        if (res.data.found) {
          setuserData(res.data.userData);
        } else {
          setuserData({
            username: '',
            profile_image: '',
          });
          // window.location.href = "/messages";
        }
      });
    }
  };
  const [userData, setuserData] = useState({
    username: '',
    profile_image: '',
  });

  useEffect(() => {
    getReceiverUsername();
  }, []);
  useEffect(() => {
    if (userData.username !== '') {
      let interval = setInterval(() => {
        axios
          .get('/api/chatapp/get-unseen-messages/' + userData.username)
          .then((res) => {
            if (res.data.chatdata.messages) {
              let unseen = [...res.data.chatdata.messages];
              // if(unseen){
              let new1 = [...unseen];
              setchatData(new1);
              // }
            }
          });

        // console.log("send request");
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [userData.username]);
  useEffect(() => {
    axios
      .get('/api/chatapp/get-chat-userData')
      .then((res) => {
        setchatUsers(res.data.chatdata);
      })
      .catch((error) => {});

    if (userData.username !== '') {
      axios
        .get('/api/chatapp/get-messages/' + userData.username)
        .then((res) => {
          setchatData(res.data.chatdata.messages);
        })
        .catch((error) => {});
    }
  }, [userData.username]);

  const sendOffer = () => {
    settitleError(false);

    if (customOfferData.description) {
      console.log('SendOffer##########');
      if (
        customOfferData.description.trim().length >= 20 &&
        customOfferData.description.trim().length < 1200 &&
        customOfferData.amount !== '' &&
        customOfferData.deliveryTime !== ''
      ) {
        setmessage({
          ...message,
          type: 'offer',
        });

        sendMessage('', true);
        hideModel();
      } else {
        settitleError(false);
      }
    } else {
      settitleError(false);
    }
  };
  const sendMessage = (filepath = '', offer = false) => {
    // console.log(userData.username);
    setmessage({
      ...message,
      receiver: userData.username,
    });

    // console.log(message);

    // let chatdata = [...chatData];
    // let data={

    //   time: new Date().toString(),
    //   text: message.msg,
    //   image: "/assets/img/users/1.jpg",
    //   sender: props.auth.user.userData.username

    // }
    // chatdata.push(data);

    // console.log(socket.connected)

    // socket.emit("broadcast-message", {
    //   time:data.time,
    //   text:data.text,
    //   sender:props.auth.user.userData.username
    // });
    // setchatData(chatdata);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    let data = {
      msg: message.msg,
      receiver: userData.username,
      time: new Date().toString(),
      type: 'plain',
    };
    // when clicked by send offer function
    if (offer === true) {
      data = {
        ...data,
        offerData: {
          DeliveryTime: customOfferData.DeliveryTime,
          amount: customOfferData.amount,
          description: customOfferData.description,
          serviceId: customOfferData.serviceData.serviceId,
          title: customOfferData.serviceData.title,
        },
        type: 'offer',
      };
    } else if (message.type === 'attachment') {
      data = {
        ...data,
        attachment: {
          ...message.attachment,
          path: filepath,
        },
        type: 'attachment',
      };
    }

    axios
      .post(props.baseUrl + '/api/chatapp/add-message', data, config)
      .then((response) => {})
      .catch((err) => {});

    setmessage({
      ...message,
      msg: '',
      type: 'plain',
    });
  };

  const uploadFile = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file); // appending file
      await axios
        .post('http://localhost:5000/upload', formData, {
          onUploadProgress: (ProgressEvent) => {
            let progress =
              Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100) +
              '%';
            setProgess(progress);
          },
        })
        .then((res) => {
          // console.log(res);

          sendMessage(res.data.path);
        })
        .catch((err) => console.log(err));
    } else {
      sendMessage();
    }
  };

  const onAttachmentChange = (event) => {
    setProgess(0);
    const file = event.target.files[0]; // accesing file
    // console.log(file);
    setFile(file); // storing file

    if (event.target.files[0] !== undefined) {
      setmessage({
        ...message,
        type: 'attachment',
        attachment: {
          name: file.name,
          size: file.size,
        },
      });
    }
  };

  const onServiceClick = (e, i) => {
    setcustomOfferData({
      serviceData: {
        title: modelSerivesData[i].title,
        image: modelSerivesData[i].images,
        serviceId: modelSerivesData[i].serviceId,
      },
    });
    setsteps(2);
  };
  const onInputChange = (e) => {
    if (e.target.name === 'amount' && e.target.value > 1000) {
      //  props.setToast([{msg:"you can only send custom offer with max 1000$",type:"warning"}]);
      seterror({
        msg: 'you can only send custom offer with max 1000$',
        type: 'warning',
        show: true,
      });
    } else {
      setcustomOfferData({
        ...customOfferData,
        [e.target.name]: e.target.value,
      });
      seterror({ ...error, show: false });
    }
  };

  let modalBody = <div></div>;
  let modalFooter = <div></div>;

  if (steps === 1) {
    modalBody = modelSerivesData ? (
      modelSerivesData.map((service, i) => {
        return (
          <div
            className="custom-offer-service-view"
            onClick={(e) => onServiceClick(e, i)}
          >
            <img
              src={service.images.split(',')[0]}
              className="service-image"
              alt="service image"
            />
            <h3>{service.title}</h3>
          </div>
        );
      })
    ) : (
      <div>
        <h3>No service Found</h3>
      </div>
    );
  } else {
    // console.log(customOfferData.serviceData);
    modalBody = (
      <div className="custom-offer-2-box">
        <h4>{customOfferData.serviceData.title}</h4>
        <div className="servie-image-box">
          <img
            src={customOfferData.serviceData.image.split(',')[0]}
            alt="Service Image"
          />
          <textarea
            name="description"
            value={customOfferData.description}
            onChange={onInputChange}
            placeholder="Describe Your Offer"
            id=""
            required
          >
            {customOfferData.description}
          </textarea>
          {customOfferData.description && (
            <p className="text-right">
              {customOfferData.description.trim().length}/1200
            </p>
          )}
          {titleError && (
            <p style={{ color: 'red' }}>please fill all the required fields</p>
          )}
        </div>
        <hr />
        <div className="row">
          <div className="col-sm-6 col-md-6">
            <div className="form-group">
              <label>Amount</label>

              <input
                type="number"
                className="form-control"
                name="amount"
                onChange={onInputChange}
                min="10"
                required
                value={customOfferData.amount}
                placeholder="max 1000$"
              />
              {error.show && <p style={{ color: 'red' }}>{error.msg}</p>}
            </div>
          </div>
          <div className="col-md-6 col-sm-6">
            <div className="form-group">
              <label>Delivery Time</label>

              <select
                value={customOfferData.deliveryTime}
                name="DeliveryTime"
                onChange={onInputChange}
                className="form-control"
                required
              >
                {<option value={1}>1 day</option>}

                {[...new Array(29)].map((ele, index) => {
                  return <option value={index + 2}>{index + 2} day</option>;
                })}
              </select>
            </div>
          </div>
        </div>
      </div>
    );

    modalFooter = (
      <div>
        <button className="btn btn-warning " onClick={() => setsteps(1)}>
          Back
        </button>

        {titleError ? (
          <button disabled className="btn btn-success " onClick={sendOffer}>
            Submit Offer
          </button>
        ) : (
          <button className="btn btn-success " onClick={sendOffer}>
            Submit Offer
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container ChatBox">
      <Modal animation={false} show={modelshow}>
        <Modal.Header>
          <h3>Create A Custom Offer</h3>{' '}
          <button className="close-offer" onClick={hideModel}>
            x
          </button>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>{modalFooter}</Modal.Footer>
      </Modal>

      <div className="row">
        <div className="col-sm-4 col-md-3">
          <ul className="sidebar-menu tree" data-widget="tree">
            <h4>All conversations</h4>
            <hr />
            {chatUsers.length > 0 && chatUsers !== undefined ? (
              chatUsers.map((user) => {
                return (
                  <li
                    className="list-chat-user-box"
                    onClick={(e) => {
                      window.location.href =
                        '/messages/' + user.receiverUsername;
                      setchatData({
                        ...chatData,
                        username: user.receiverUsername,
                        profile_image: user.image,
                      });
                    }}
                  >
                    <div className="chat-user-box">
                      <img
                        src={
                          user.image === undefined
                            ? imgPlaceholder
                            : '/assets/uploads/users/' +
                              user.receiverUsername +
                              '/profileImages/' +
                              user.image
                        }
                        alt=""
                      />
                      <div className="message-info">
                        <div className="inner">
                          <p className="username">{user.receiverUsername}</p>{' '}
                          <br />
                          <p className="lastmessage">{user.messages.text}</p>
                          <small className="lastdate pull-right">
                            {moment(user.messages.time).format(
                              'MMM D YY, h:mm a'
                            )}
                          </small>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li>No Conversation Found</li>
            )}
          </ul>
        </div>

        <div className="col-sm-8 col-md-9">
          {userData.username !== '' ? (
            <div className="conversation-box">
              <div className="conversation-header">
                <div className="user-message-details">
                  <div className="user-message-img">
                    <img
                      src={
                        '/assets/uploads/users/' +
                        userData.username +
                        '/profileImages/' +
                        userData.profile_image
                      }
                      className="img-responsive img-circle header-chat-image"
                      alt=""
                    />
                  </div>
                  <div className="user-message-info">
                    <h4>{userData.username}</h4>
                    {/* <p>Online</p> */}
                  </div>
                </div>
              </div>

              <div>
                {console.log('user', userData.username)}
                <ScrollToBottom className="conversation-container">
                  {/* <div className="conversation-container"> */}
                  {chatData.length > 0 ? (
                    chatData.map((msg) => {
                      if (props.isAuthenticated) {
                        if (msg.sender === props.auth.user.username) {
                          if (msg.type === 'attachment') {
                            return (
                              <SenderAttachmentTemplate
                                time={moment(msg.time).format(
                                  'MMM D YYYY, h:mm a'
                                )}
                                message={msg.text}
                                image={
                                  '/assets/uploads/users/' +
                                  props.auth.user.username +
                                  '/profileImages/' +
                                  props.auth.user.profile_image
                                }
                                sender="me"
                                attachment={msg.attachment[0]}
                              />
                            );
                          } else if (msg.type === 'offer') {
                            return (
                              <SenderCustomOfferTemplate
                                offerId={msg._id}
                                time={moment(msg.time).format(
                                  'MMM D YYYY, h:mm a'
                                )}
                                message={msg.text}
                                sender="me"
                                image={
                                  '/assets/uploads/users/' +
                                  props.auth.user.username +
                                  '/profileImages/' +
                                  props.auth.user.profile_image
                                }
                                offer={msg.Offer[0]}
                                buyer={userData.username}
                              />
                            );
                          } else {
                            return (
                              <SenderMSGTemplate
                                time={moment(msg.time).format(
                                  'MMM D YYYY, h:mm a'
                                )}
                                message={msg.text}
                                sender="me"
                                image={
                                  '/assets/uploads/users/' +
                                  props.auth.user.username +
                                  '/profileImages/' +
                                  props.auth.user.profile_image
                                }
                              />
                            );
                          }
                        } else {
                          if (msg.type === 'attachment') {
                            return (
                              <ReceiverAttachmentTemplate
                                time={moment(msg.time).format(
                                  'MMM D YYYY, h:mm a'
                                )}
                                sender={userData.username}
                                message={msg.text}
                                image={
                                  '/assets/uploads/users/' +
                                  userData.username +
                                  '/profileImages/' +
                                  userData.profile_image
                                }
                                attachment={msg.attachment[0]}
                              />
                            );
                          } else if (msg.type === 'offer') {
                            return (
                              <ReceiverCustomOfferTemplate
                                offerId={msg._id}
                                time={moment(msg.time).format(
                                  'MMM D YYYY, h:mm a'
                                )}
                                message={msg.text}
                                sender={userData.username}
                                image={
                                  '/assets/uploads/users/' +
                                  userData.username +
                                  '/profileImages/' +
                                  userData.profile_image
                                }
                                offer={msg.Offer[0]}
                                seller={userData.username}
                              />
                            );
                          } else {
                            return (
                              <ReceiverMSGTemplate
                                time={moment(msg.time).format(
                                  'MMM D YYYY, h:mm a'
                                )}
                                sender={userData.username}
                                message={msg.text}
                                image={
                                  '/assets/uploads/users/' +
                                  userData.username +
                                  '/profileImages/' +
                                  userData.profile_image
                                }
                              />
                            );
                          }
                        }
                      }
                    })
                  ) : (
                    <span></span>
                  )}
                </ScrollToBottom>
                <div className="type_messages">
                  <div className="input-field">
                    <textarea
                      value={message.msg}
                      onChange={(e) =>
                        setmessage({ ...message, msg: e.target.value })
                      }
                      placeholder={'Type something here...'}
                    ></textarea>
                    <span className="imoji">
                      <label htmlFor="attachment">
                        <i className="fa fa-paperclip"></i>
                        <input
                          type="file"
                          name="attachment"
                          onChange={(e) => onAttachmentChange(e)}
                          id="attachment"
                        />
                      </label>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={(e) => {
                          uploadFile();
                          scrollToBottom();
                        }}
                      >
                        Send
                      </button>
                    </span>
                  </div>

                  {props.loading === false && props.isAuthenticated ? (
                    props.auth.user.current_type === 'seller' ? (
                      <button
                        type="button"
                        className="btn eaglance-outline-btn"
                        onClick={showModel}
                      >
                        Create Custom Offer
                      </button>
                    ) : (
                      ''
                    )
                  ) : (
                    ''
                  )}

                  {/* {progress} */}
                </div>
              </div>
            </div>
          ) : (
            <div className="conversation-box">
              <ScrollToBottom className="conversation-container">
                <div style={{ marginTop: '70px', textAlign: 'center' }}>
                  <img src={chatConversationImg} alt="" width="30%" />
                  <h1 style={{ textAlign: 'center' }}>
                    Select user to start conversation
                  </h1>
                </div>
              </ScrollToBottom>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const mapStatetoProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.loading,
  auth: state.auth,
});
export default connect(mapStatetoProps, { startLoading, loginUser, setToast })(
  withRouter(ChatBox)
);
