import React from "react";
import attachmentImg from "../../../img/attachment.png";
import './ReceiverAttachmentTemplate.css'
const ReceiverAttachmentTemplate = ({ message, image, time ,attachment,sender}) => {
 
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
 
 
  return (
    <div className="ReceiverAttachmentTemplate">
    <div className="convo-box convo-left">
      <div className="convo-area convo-left">
        <div className="convo-message">
        <h4 className="text-left"><strong>{sender}</strong></h4>
          <p> <img src={attachmentImg} className="fileattachment" alt="attachment" />
              <div className="filedata">
              <p className="filename">{attachment.name}</p>
              <p className="filesize">{formatBytes(attachment.size)} 
              
              <a href={"/"+attachment.path} className="btn btn-default pull-right" download={attachment.name}><i className="fa fa-download"></i></a>
               </p>
              </div>
             
              <hr/>
              <p>{message}</p></p>
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

export default ReceiverAttachmentTemplate;

