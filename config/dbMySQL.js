var mysql = require('mysql');

// var connectionPool = mysql.createPool({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'alphawork_db',
//   port: '3306'
// });

// let connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'alphawork_db',
//   port: '3306',
//   multipleStatements: true
// });

// if(process.env.NODE_ENV== "production"){

// createPool(...);

let connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3307,
  database: 'alphawork_db',
  connectionLimit: 10,
  multipleStatements: true,
});
// let  connection = mysql.createPool({
//   host     : 'us-cdbr-east-02.cleardb.com',
//   user     : 'b23e4d503703fb',
//   password : '6ab3e370',
//   database : 'heroku_80ce74c8036a1fb',
//   connectionLimit : 10,
//   multipleStatements: true
// });

// }

// connection.connect(function(err) {
//   if (err) {
//     return console.error('error: ' + err.message);
//   }

//   console.log('Connected to the MySQL server 1.');
// });

module.exports = connection;
// exports.getConnection = function(callback) {
//   connectionPool.getConnection(function(err, conn) {
//     if(err) {
//       return callback(err);
//     }
//     callback(err, conn);
//   });
// };
