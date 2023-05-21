import * as atypes from '../actions/types';
import uuid from 'uuid';
export const setAlert =
  (msg, alertType, timeout = 5000) =>
  (dispath) => {
    const id = uuid.v4();
    dispath({
      type: atypes.SET_ALERT,
      payload: {
        msg: msg,
        alertType: alertType,
        id: id,
      },
    });

    setTimeout(
      () => dispath({ type: atypes.REMOVE_ALERT, payload: { id: id } }),
      timeout
    );
  };
