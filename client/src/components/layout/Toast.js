import React, { useEffect } from 'react';
import { useToasts } from 'react-toast-notifications';
import { connect } from 'react-redux';
const Toast = (props) => {
  const { addToast } = useToasts();

  // console.log(props.toasts);
  useEffect(() => {
    if (props.toasts.length > 0) {
      props.toasts.map((t) => {
        addToast(t.msg, {
          appearance: t.type,
          autoDismiss: true,
        });

        return;
      });
    }
  }, [props.toasts]);

  return <div>{/*  */}</div>;
};

const mapStatetoprops = (state) => ({
  toasts: state.toasts,
});

export default connect(mapStatetoprops)(Toast);
