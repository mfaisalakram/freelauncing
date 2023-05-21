import * as atypes from './types';
import axios from '../../axios-server';
import { setAlert } from './alert';
import { setToast } from './toast';

export const logout = () => (dispatch) => {
  localStorage.removeItem('userToken');
  dispatch({
    type: atypes.LOGOUT,
  });
  window.location.href = '/login';
};
export const startLoading = () => (dispatch) => {
  dispatch({
    type: atypes.START_LOADING,
  });
};
export const loginUser = (email, password) => async (dispatch) => {
  await axios
    .post(
      '/api/auth',
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((response) => {
      if (response.data.found) {
        dispatch({
          type: atypes.LOGIN_SUCCESS,
          payload: response.data.token,
        });

        localStorage.setItem('userToken', response.data.token);
        dispatch(setAlert('Login successfully', 'success'));
        dispatch(loadUser());
      } else {
        dispatch({
          type: atypes.LOGIN_ERROR,
        });
        dispatch(setAlert('Invalid Credentials', 'danger'));
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: atypes.LOGIN_ERROR,
      });
    });
};

export const loadUser = () => async (dispatch) => {
  await axios
    .get('/api/users/userdata')
    .then((response) => {
      console.log(response.data);
      if (response.data.account_status === 'banned') {
        dispatch({
          type: atypes.SET_TOAST,
          payload: [
            {
              msg: 'your account is banned.please check  email for more details',
              type: 'error',
            },
          ],
        });

        setTimeout(() => {
          dispatch({ type: atypes.SET_TOAST, payload: [] });

          localStorage.removeItem('userToken');
        }, 10000);
        dispatch({
          type: atypes.AUTH_ERROR,
        });
      } else {
        dispatch({
          type: atypes.LOAD_USER,
          payload: response.data,
        });
      }

      console.log(response.data);
    })
    .catch((err) => {
      dispatch({
        type: atypes.AUTH_ERROR,
      });
    });
};

export const isEmailRegisterd = (email) => async (dispatch) => {
  await axios
    .get('/api/auth/checkemail')
    .then((response) => {
      dispatch({
        type: atypes.LOAD_USER,
        payload: response.data,
      });

      console.log(response.data);
    })
    .catch((err) => {
      dispatch({
        type: atypes.AUTH_ERROR,
      });
    });
};

export const registerUser =
  ({ fname, lname, email, password, username }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ fname, lname, email, password, username });
    // try {
    await axios
      .post('/api/users', body, config)
      .then((response) => {
        dispatch({
          type: atypes.REGISTER_SUCCESS,
          payload: response.data,
        });

        dispatch(
          setToast([
            {
              msg: 'Register successfully.Redirecting to Login page',
              type: 'success',
            },
          ])
        );
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      })
      .catch((err) => {
        // const errors = err.response.data.error;
        // // console.log(err.response.data.error);

        // if (errors) {
        //   errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        // }
        dispatch({
          type: atypes.REGISTER_FAIL,
        });
      });
  };

export const resetPassword =
  ({ newPassword, confirmPassword, token }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ newPassword, confirmPassword, token });
    // try {
    await axios
      .post('/api/auth/reset-password', body, config)
      .then((response) => {
        // dispatch({
        //   type: atypes.RESET_PASSWORD,
        //   payload: response.data
        // });

        console.log(response.data.found);
        if (response.data.found) {
          dispatch(
            setToast([
              {
                msg: 'Password reset successfully.Redirecting to Login page',
                type: 'success',
              },
            ])
          );
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          dispatch(
            setToast([
              {
                msg: 'Somthing went wrong.Password not updated.Redirecting to Login page',
                type: 'error',
              },
            ])
          );
        }
      })
      .catch((err) => {
        // dispatch({
        //   type: atypes.REGISTER_FAIL
        // });
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
