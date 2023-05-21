import React from 'react'

const AttachmentFileTemplate = (props) => {
    return (
        <div className="AttachmentFileTemplate">
            {console.log(props.chat)}
            {props.chat&&props.chat.attachments.split(',').map(file=>{
                return(<div><a className="filename" download={file} href={ `/assets/uploads/users/${props.chat.seller_username}/deliveries/${file}`} ><i className="fa fa-paperclip"></i>{" "}{file}</a></div>)
            })}
            
            
        </div>
    )
}

export default AttachmentFileTemplate
