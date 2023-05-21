import axios from 'axios';
const instance = axios.create({
  baseURL: 'http://localhost:4500',
});
export default instance;

// try {
// await axios.get('/')
// .then(response=>{
//      console.log(response.data)
// }).catch(err=>{
//  console.log(err.response);
// })

//   const axiosDefaultConfig = {
//     baseURL: 'http://localhost:3000',
//     proxy: {
//         host: 'http://localhost',
//         port:  5000,
//         protocol: 'http'
//     }
// };

// const axios = require ('axios').create(axiosDefaultConfig);
