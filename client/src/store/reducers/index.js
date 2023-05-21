import { combineReducers } from "redux";
import alertReducer from "./alert";
import serviceReducer from "./services";
import toastReducer from "./toast";
import authReducer from "./auth";
import orderReducer from "./orders";



export default combineReducers({
  alerts: alertReducer,
  toasts: toastReducer,
  services: serviceReducer,
  auth: authReducer,
  orders: orderReducer,
});



