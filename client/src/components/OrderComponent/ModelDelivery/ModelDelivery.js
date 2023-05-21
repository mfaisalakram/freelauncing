import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import './ModelDelivery.css';
function getModalStyle() {
  return {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ModelDelivery = (props) => {
  const [isnotdeiverable, setisnoddeiverable] = useState(true);

  useEffect(() => {
    console.log(isDeliverable());
    setisnoddeiverable(isDeliverable());
  }, [props.files, props.description]);

  const [error, seterror] = useState(true);

  const isDeliverable = () => {
    if (props.files) {
      let x = props.files.progresses.filter((val) => {
        return val !== '100%';
      });
      console.log('x=>', x);

      return x.length > 0 || props.description.length < 20;
    }
    return false;
  };

  const onChangeDescription = (e) => {
    if (e.target.value.length <= 1200) {
      props.setdescription(e.target.value);
    }

    if (e.target.value.length < 20) {
      seterror(true);
    } else {
      seterror(false);
    }
  };

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className="ModelDelivery">
        <h3>Deliver your work</h3>
        <hr />
        <p>Attach your delivery files</p>
        <input
          type="file"
          multiple
          name="deliveryFiles"
          id=""
          className="attachments-input"
          onChange={props.onAttachmentChange}
        />

        <hr />
        {console.log('files', props.files)}

        {props.files &&
          props.files.attachments.map((file, index) => {
            {
              console.log(
                index,
                props.files.uploaded[index] === true ? 'done' : 'uploading'
              );
            }

            return (
              <div key={index}>
                <span>{file.name}</span> | {props.files.progresses[index]}{' '}
                {props.files.progresses[index] == '100%' ? (
                  <span>
                    {' '}
                    | <i className="fa fa-check"></i>{' '}
                  </span>
                ) : (
                  <button
                    className="btn btn-sm btn-success btnx"
                    type="button"
                    onClick={() => props.uploadFile(file, index)}
                  >
                    <i className="fa fa-upload "></i>{' '}
                  </button>
                )}
                <button className="btn btn-sm btn-danger btnx bt-close">
                  <i
                    className="fa fa-close"
                    onClick={() => props.removeFile(file, index)}
                  ></i>
                </button>
              </div>
            );
          })}

        <p>Decripe about your delivery to buyer</p>
        <textarea
          className="form-control"
          // name="deliveryDescription"
          id=""
          name="description"
          value={props.decription}
          placeholder="Describe here..."
          cols="30"
          onChange={onChangeDescription}
          rows="10"
        ></textarea>
        {error && <p className="pull-left">min 20 characters</p>}

        <p className="pull-right">{props.description.length}/1200</p>
        <hr />
        <button
          className="btn btn-success pull-right"
          onClick={props.deliverWork}
          // disabled={isnotdeiverable}
        >
          Deliver Now
        </button>
        {/* <ModelDelivery /> */}
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
};

export default ModelDelivery;
