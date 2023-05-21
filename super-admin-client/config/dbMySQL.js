var mysql = require('mysql');

// var connectionPool = mysql.createPool({
//   host     : 'localhost',
//   user     : 'root',
//   password : '',
//   database : 'eaglance_db',
//   port: '3306'
// });

let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3307,
  database: 'alphawork_db',
  connectionLimit: 10,
  multipleStatements: true,
});

// connection.connect(function(err) {
//   if (err) {
//     return console.error('error: ' + err.message);
//   }

//   console.log('Connected to the MySQL server.');
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
