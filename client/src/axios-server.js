import axios from 'axios';
let baseUrl = 'http://localhost:5000';
// if(process.env.NODE_ENV== "production"){
//  let baseUrl="http://alphawork.com";
// }

const instance = axios.create({
  baseURL: baseUrl,
});

if (localStorage.userToken) {
  instance.defaults.headers.common['x-auth-token'] = localStorage.userToken;
} else {
  delete instance.defaults.headers.common['x-auth-token'];
}

export default instance;
