import axios from "axios";
const setAuthToken=token => {

  if (localStorage.token) {
    axios.defaults.headers.common["x-auth-token"] = localStorage.userToken;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
