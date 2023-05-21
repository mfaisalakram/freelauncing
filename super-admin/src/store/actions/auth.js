import * as atypes from './types';
import axios from 'axios';
import { setAlert } from './alert';
import setAuthToken from '../../utills/setAuthToken';

export const logout = () => (dispatch) => {
  dispatch({
    type: atypes.LOGOUT,
  });
  dispatch({
    type: atypes.CLEAR_PROFILE,
  });
};
export const startLoading = () => (dispatch) => {
  dispatch({
    type: atypes.START_LOADING,
  });
};
export const loginUser = (email, password) => async (dispatch) => {
  await axios
    .post('/api/auth', { email, password })
    .then((response) => {
      // console.log(response.data);
      dispatch({
        type: atypes.LOGIN_SUCCESS,
        payload: response.data,
      });
      localStorage.setItem('token', response.data.token);
      console.log(localStorage);
      dispatch(setAlert('Login successfully', 'success'));
      dispatch(loadUser());
    })
    .catch((err) => {
      const error = err.response.data.error;
      dispatch({
        type: atypes.LOGIN_ERROR,
      });

      if (error) {
        error.forEach((e) => dispatch(setAlert(e.msg, 'danger')));
      }
    });
};
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  console.log('token :' + localStorage.token);

  await axios
    .get('/api/auth')
    .then((response) => {
      console.log(response.data);
      dispatch({
        type: atypes.LOAD_USER,
        payload: response.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: atypes.AUTH_ERROR,
      });
    });
};
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });
    // try {
    await axios
      .post('http://localhost:5000/api/users', body, config)
      .then((response) => {
        dispatch({
          type: atypes.REGISTER_SUCCESS,
          payload: response.data,
        });

        dispatch(setAlert('Register successfully', 'danger'));
      })
      .catch((err) => {
        const errors = err.response.data.error;
        console.log(err.response.data.error);

        if (errors) {
          errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
        }
        dispatch({
          type: atypes.REGISTER_FAIL,
        });
      });
  };
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Are you sure? This can not NOT be undone!')) {
    await axios
      .delete('/api/profile/')
      .then((response) => {
        console.log(response.data);
        dispatch({ type: atypes.CLEAR_PROFILE });
        dispatch({ type: atypes.ACCOUNT_DELETED });

        dispatch(
          setAlert('Your account has been permanently deleted ', 'success')
        );
      })
      .catch((err) => {
        const error = err.response.data.error;
        if (error) {
          error.forEach((e) => dispatch(setAlert(e.msg, 'danger')));
        }

        dispatch({
          type: atypes.PROFILE_ERROR,
          payload: {
            msg: err.response.statusText,
            status: err.response.status,
          },
        });
      });
  }
};
