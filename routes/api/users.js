const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravator = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth.js');
const config = require('config');
const connection = require('../../config/dbMySQL');
var fs = require('fs-extra');
const nodemailer = require('nodemailer');

//  @route  POST api/users
//  @desc   Register users
//  @access Public

router.post(
  '/',
  [
    check('fname', 'first name is required').not().isEmpty(),
    check('lname', 'last name is required').not().isEmpty(),
    check('username', 'username is required').not().isEmpty(),
    check('email', 'please included a valid email').isEmail(),
    check('password', 'Enter a password with 6 or more characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const error = validationResult(req);

    try {
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      const { fname, lname, email, password, username } = req.body;
      const sql1 = 'select id from users where email=? or username=?';

      // encryping password
      const salt = await bcrypt.genSalt(10);
      let pass = await bcrypt.hash(password, salt);
      let profileImage = 'imagePlaceholder.jpg';

      // ${__dirname}/client/public/assets/uploads/attachments/messages
      let path = `./client/public/assets/uploads/users/` + username;

      fs.access(path, function (err) {
        if (err && err.code === 'ENOENT') {
          fs.mkdir(path);

          fs.access(path + `/serviceImages`, function (err) {
            if (err && err.code === 'ENOENT') {
              fs.mkdir(path + `/serviceImages`);
            } else {
              return;
            }
          });

          fs.access(path + `/profileImages`, function (err) {
            if (err && err.code === 'ENOENT') {
              fs.mkdir(path + `/profileImages`);

              fs.copyFile(
                `./client/public/assets/uploads/imagePlaceholder.jpg`,
                path + `/profileImages` + '/imagePlaceholder.jpg',
                (err) => {}
              );
            } else {
              return;
            }
          });
        } else {
        }
      });

      connection.query(sql1, [email, email], async (error, results, fields) => {
        if (error) return res.json({ register: false });
        if (results.length > 0) {
          return res.json({ register: false });
        } else {
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mail.testing4clients@gmail.com', // generated ethereal user
              pass: 'mailtestingforclients', // generated ethereal password
            },
          });

          let code = Math.floor(100000 + Math.random() * 900000);
          // send mail with defined transport object
          // let info = await transporter.sendMail({
          //   from: '"Eaglance lnc." <mail.testing4clients@gmail.com>', // sender address
          //   to: email, // list of receivers
          //   subject: 'Eaglance - Email Verification', // Subject line
          //   html: 'verification Code: ' + code, // html body
          // });

          const sql =
            "insert into users(fname,lname,email,password,username,created_date,account_type,profile_image,verification_code) values(?,?,?,?,?,now(),'buyer',?,?)";
          connection.query(
            sql,
            [fname, lname, email, pass, username, profileImage, code],
            async function (error, results, fields) {
              //   if (error) throw error;
              console.log(results);
              if (results.affectedRows === 1) {
                console.log(results);
                const sql =
                  'insert into buyer_finance_details(personal_balance,user_id) values(0,?)';
                connection.query(
                  sql,
                  [results.insertId],
                  async function (error, results, fields) {
                    return res.json({ register: true });
                  }
                );
              } else {
                return res.json({ register: false });
              }
            }
          );
        }
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).sent('Server error');
    }
  }
);

router.post('/resend-code', [auth], async (req, res) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mail.testing4clients@gmail.com', // generated ethereal user
      pass: 'mailtestingforclients', // generated ethereal password
    },
  });

  console.log(req.user);
  let code = Math.floor(100000 + Math.random() * 900000);
  // send mail with defined transport object
  // let info = await transporter.sendMail({
  //   from: '"Eaglance lnc." <mail.testing4clients@gmail.com>', // sender address
  //   to: req.user.email, // list of receivers
  //   subject: 'Eaglance - Email Verification', // Subject line
  //   html: 'verification Code: ' + code, // html body
  // });

  let sql = 'update users set verification_code=? where email=?';
  connection.query(
    sql,
    [code, req.user.email],
    async function (error, results, fields) {
      return res.json({ send: true });
    }
  );
});
router.post('/forget-password-code', async (req, res) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mail.testing4clients@gmail.com', // generated ethereal user
      pass: 'mailtestingforclients', // generated ethereal password
    },
  });

  let code = Math.floor(100000 + Math.random() * 900000);
  // send mail with defined transport object
  // let info = await transporter.sendMail({
  //   from: '"Eaglance lnc." <mail.testing4clients@gmail.com>', // sender address
  //   to: req.body.email, // list of receivers
  //   subject: 'Eaglance - Forget Password', // Subject line
  //   html: 'verification Code: ' + code, // html body
  // });

  var date = new Date();
  let sql = 'update users set forget_code=? and expirytime=? where email=?';
  connection.query(
    sql,
    [code, date, req.body.email],
    async function (error, results, fields) {
      return res.json({ send: true });
    }
  );
});

router.post('/check-code/:code', [auth], async (req, res) => {
  // create reusable transporter object using the default SMTP transport
  let code = req.params.code;
  let sql = 'select verification_code from users  where email=?';
  connection.query(
    sql,
    [req.user.email],
    async function (error, results, fields) {
      if (results.length > 0) {
        if (results[0].verification_code === code) {
          let sql1 = 'update users set account_status=?  where email=?';
          connection.query(
            sql1,
            ['active', req.user.email],
            function (error, results, fields) {
              console.log('sssss', results);
              return res.json({ found: true });
            }
          );
        } else {
          return res.json({ found: false });
        }
      }
    }
  );
});

router.post('/check-forget-code/:code/:email', async (req, res) => {
  // create reusable transporter object using the default SMTP transport
  let code = req.params.code;
  let sql = 'select forget_code from users  where email=?';
  connection.query(
    sql,
    [req.params.email],
    async function (error, results, fields) {
      if (results.length > 0) {
        if (results[0].forget_code === code) {
          return res.json({ found: true });
        } else {
          return res.json({ found: false });
        }
      }
    }
  );
});

router.get('/userdata', [auth], (req, res) => {
  console.log('/userdata hit from backend');
  try {
    connection.query(
      "select id,username,lname,fname,email,profile_image,account_type,account_status from users where id='" +
        req.user.id +
        "'",
      function (error, results) {
        if (error) throw error;
        if (results.length > 0) {
          return res
            .status(200)
            .json({ ...results[0], current_type: req.user.current_type });
        } else {
          return res.status(200).send(null);
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

router.get('/all-users', (req, res) => {
  console.log(req);
  const sql = 'select id,username,lname,fname,email,profile_image from users';
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;

    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(200).send(null);
    }
  });
});

router.get('/check-userData/:username', (req, res) => {
  console.log(req);

  connection.query(
    "select id,username,lname,fname,email,profile_image from users where username='" +
      req.params.username +
      "'",
    function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        return res.status(200).json({ found: true, userData: results[0] });
      } else {
        return res.status(200).send({ found: false, userData: null });
      }
    }
  );
});

module.exports = router;
