import * as atypes from './types';
import axios from '../../axios-server';
import { setToast } from './toast';

export const addService = (formData, history, edit) => async (dispatch) => {
  const config = {
    headers: {
      'Contetnt-Type': 'multipart/form-data',
    },
  };

  await axios
    .post('/api/service', formData, config)
    .then((response) => {
      if (response.data.error) {
        let res = response.data.error.map((data) => {
          return {
            ...data,
            type: 'error',
          };
        });
        dispatch(setToast(res));
      } else {
        if (response.data.done) {
          dispatch(
            setToast([{ msg: 'Service added successfully', type: 'success' }])
          );
          history.push('/services');
        } else {
          dispatch(setToast([{ msg: response.data.msg, type: 'error' }]));
        }
      }
    })
    .catch((err) => {});
};

export const editService = (formData, history, edit) => async (dispatch) => {
  const config = {
    headers: {
      'Contetnt-Type': 'multipart/form-data',
    },
  };

  await axios
    .post('/api/service/edit', formData, config)
    .then((response) => {
      if (response.data.error) {
        let res = response.data.error.map((data) => {
          return {
            ...data,
            type: 'error',
          };
        });
        dispatch(setToast(res));
      } else {
        if (response.data.done) {
          dispatch(
            setToast([{ msg: 'Service updated successfully', type: 'success' }])
          );
          history.push('/services');
        } else {
          dispatch(setToast([{ msg: response.data.msg, type: 'error' }]));
        }
      }
    })
    .catch((err) => {});
};

export const getServices = (type, history) => async (dispatch) => {
  const config = {
    headers: {
      'Contetnt-Type': 'application/json',
    },
    withCredentials: true,
  };

  await axios
    .get('/api/service/user/services/' + type)
    .then((response) => {
      if (response.data.error) {
      } else {
        if (response.data.found === true) {
          dispatch({
            type: atypes.GET_SERVICES,
            payload: response.data.data,
          });
        } else {
          dispatch({
            type: atypes.GET_SERVICES,
            payload: [],
          });
        }
      }
    })
    .catch((err) => {});
};
