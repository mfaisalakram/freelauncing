import React from "react";
import "./SenderAttachmentTemplate.css";
import attachmentImg from "../../../img/attachment.png";
const SenderAttachmentTemplate = ({ message, time, image, attachment,sender }) => {

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
  return (
    <div className="SenderAttachmentTemplate">
      <div className="convo-box pull-right">
        <div className="convo-area convo-area-sender">
          <div className="convo-message">
             <h4 className="text-right"><strong>{sender}</strong></h4>
            <span>
              <img src={attachmentImg} className="fileattachment" alt="attachment" />
              <div className="filedata">
              <p className="filename">{attachment.name}</p>
              <p className="filesize">{formatBytes(attachment.size)} 
              
              <a href={"/"+attachment.path} className="btn btn-default pull-right" download={attachment.name}> <i className="fa fa-download"></i></a>
               </p>
              </div>
             
              <hr/>
              <p>{message}</p>
            </span>
           
          </div>
          <span>{time}</span>
        </div>
        <div className="convo-img">
          <img src={image} alt="" className="img-responsive img-circle" />
        </div>
      </div>
    </div>
  );
};

export default SenderAttachmentTemplate;
