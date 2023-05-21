import * as atypes from './types';
import uuid from 'uuid';

export const setToast =
  (toasts, options = {}) =>
  (dispath) => {
    // const id = uuid.v4();

    const data = {
      type: atypes.SET_TOAST,
      payload: [...toasts],
    };

    dispath(data);
  };
