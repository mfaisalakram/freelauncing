import React from "react";
import { Link } from "react-router-dom";
import './MessageTemplate.css'
const MessageTemplate = ({ username, image, message }) => {
  return (
    <div className="MessageTemplate">
      
        <img src={image} alt="user" />
     
      <div className="text">
        <p className="username">
          <Link to={"/user/" + username}></Link>
          {username}
        </p>
        <p className="message">{message}</p>
      </div>

    </div>
  );
};

export default MessageTemplate;
