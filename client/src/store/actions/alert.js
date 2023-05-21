import * as atypes from "../actions/types";
import uuid from "uuid";



// setAlert("system error",'danger');

export const setAlert = (msg, alertType,timeout=5000) => dispath => {
  const id = uuid.v4();

  const data={
    type: atypes.SET_ALERT,
    payload: {
      msg: msg,
      alertType: alertType,
      id: id
    }
  };

  dispath(data);


  setTimeout(()=>dispath({ type: atypes.REMOVE_ALERT, payload:{"id":id}})
   , timeout);


   
};
