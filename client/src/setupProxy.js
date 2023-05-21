const proxy = require("http-proxy-middleware");

// This proxy redirects requests to /api endpoints to
// the Express server running on port 3001.
module.exports = function(app) {
 
let baseUrl="http://localhost:5000";



// if(process.env.NODE_ENV== "production"){

//  let baseUrl="http://eaglance.com";

// }
  app.use(proxy('/auth/google', { target: baseUrl+'/' }));
  app.use(proxy('/auth/facebook', { target: baseUrl+'/' }));

  app.use(proxy('/auth/social/callback/:token', { target: baseUrl+'/auth/social/callback/:token' }));
  app.use(proxy('/api/auth/checkemail/:email', { target: baseUrl+'/api/auth/checkemail/:email' }));

  // app.use(proxy('', { target: baseUrl+'/' }));

  app.use(proxy('/api/*', { target: baseUrl+'/' }));




};