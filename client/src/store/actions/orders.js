import * as atypes from './types';
import axios from '../../axios-server';
import { setToast } from './toast';

export const getOrders = (type, history) => async (dispatch) => {
  const config = {
    headers: {
      'Contetnt-Type': 'application/json',
    },
    withCredentials: true,
  };
  let t = type;
  if (type === 'late') {
    t = 'active';
  }
  await axios
    .get('/api/orders/by-status/' + t)
    .then((response) => {
      if (response.data.error) {
      } else {
        if (response.data.found === true) {
          let data = response.data.data;
          console.log(type);
          if (type === 'late') {
            var date1 = new Date();

            data = data.filter((d) => {
              var deliveryDate = new Date(d.order_datetime);
              deliveryDate.setDate(deliveryDate.getDate() + d.delivery_time);
              if (deliveryDate < date1) return d;
            });
          }

          dispatch({
            type: atypes.GET_ORDERS,
            payload: data,
          });
        } else {
          dispatch({
            type: atypes.GET_ORDERS,
            payload: [],
          });
        }
      }
    })
    .catch((err) => {});
};

export const getBuyerOrders = (type, history) => async (dispatch) => {
  const config = {
    headers: {
      'Contetnt-Type': 'application/json',
    },
    withCredentials: true,
  };
  let t = type;
  if (type === 'late') {
    t = 'active';
  }
  await axios
    .get('/api/orders/by-status/buyer/' + t)
    .then((response) => {
      if (response.data.error) {
      } else {
        if (response.data.found === true) {
          let data = response.data.data;
          console.log(type);
          if (type === 'late') {
            var date1 = new Date();

            data = data.filter((d) => {
              var deliveryDate = new Date(d.order_datetime);
              deliveryDate.setDate(deliveryDate.getDate() + d.delivery_time);
              if (deliveryDate < date1) return d;
            });
          }

          dispatch({
            type: atypes.GET_ORDERS,
            payload: data,
          });
        } else {
          dispatch({
            type: atypes.GET_ORDERS,
            payload: [],
          });
        }
      }
    })
    .catch((err) => {});
};
