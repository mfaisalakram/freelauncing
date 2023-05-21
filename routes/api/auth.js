const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require('../../config/dbMySQL');
const nodemailer = require('nodemailer');
const { date } = require('joi');
//  @route  Get api/auth
//  @desc   load user
//  @access Public

const baseUrl = 'http://localhost:3000';
router.get('/', auth, (req, res) => {
  try {
    try {
      connection.query(
        "select id,username,fname,lname,email,profile_image from users where id='" +
          req.user +
          "'",
        function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            return res.status(200).json(results[0]);
          } else {
            return res.status(200).json(null);
          }
        }
      );
    } catch (error) {
      console.log(error.message);
      return res.status(500).send('server error ' + error.message);
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

//  @route  Get api/auth/checkemail
//  @desc   lsoad user
//  @access Public

router.get('/checkemail/:email', (req, res, next) => {
  try {
    connection.query(
      "select * from users where email='" + req.params.email + "'",
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
          return res.status(200).json({ found: true });
        } else {
          return res.status(200).json({ found: false });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

router.post('/send-reset-link', async (req, res, next) => {
  try {
    connection.query(
      "select * from users where email='" + req.body.email + "'",
      async (error, results, fields) => {
        if (error) throw error;

        if (results.length > 0) {
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'mail.testing4clients@gmail.com', // generated ethereal user
              pass: 'mailtestingforclients', // generated ethereal password
            },
          });

          let code = Math.floor(100000 + Math.random() * 900000);
          const payload = {
            user: {
              email: results[0].email,
              code: code,
              time: new Date(),
            },
          };
          const token = jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000,
          });

          // send mail with defined transport object
          // let info = await transporter.sendMail({
          //   from: '"AlphaWork lnc." <mail.testing4clients@gmail.com>', // sender address
          //   to: req.body.email, // list of receivers
          //   subject: 'AlphaWork - Forget Password', // Subject line
          //   html:
          //     "<h3>forget password link: <a href='" +
          //     baseUrl +
          //     '/reset?code=' +
          //     token +
          //     "'>click here</a></h3> <h2>Or</h2> <h3> click or Copy paste this URL to your browser</h3>" +
          //     baseUrl +
          //     '/reset?code=' +
          //     token +
          //     '', // html body
          // });

          let sql = 'update users set forget_code=?,expirytime=? where email=?';

          connection.query(
            sql,
            [token, new Date(), req.body.email],
            function (error, results, fields) {
              // return res.json({ send: true });
            }
          );

          return res.status(200).json({ send: true });
        } else {
          return res.status(200).json({ send: false });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

router.post('/is-expired-link/', async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.body.token, config.get('jwtSecret'));

    if (decoded.user) {
      console.log(decoded.user.email, req.body.token);
      connection.query(
        'select * from users where email=? and forget_code=? AND expirytime >= DATE_SUB(NOW(), INTERVAL 1 HOUR)',
        [decoded.user.email, req.body.token],
        async (error, results, fields) => {
          if (error) throw error;
          if (results.length > 0) {
            return res.status(200).json({ found: true });
          } else {
            return res.status(200).json({ found: false, outer: false });
          }
        }
      );
    } else {
      return res.status(200).json({ found: false, monstouter: false });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

router.post('/reset-password/', async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    let pass = await bcrypt.hash(req.body.newPassword, salt);
    const decoded = jwt.verify(req.body.token, config.get('jwtSecret'));
    console.log('============================');
    console.log(decoded);
    if (decoded.user) {
      console.log(decoded.user.email, req.body.token);
      //
      connection.query(
        'select * from users where email=? and forget_code=? AND expirytime >= DATE_SUB(NOW(), INTERVAL 1 HOUR)',
        [decoded.user.email, req.body.token],
        async (error, results, fields) => {
          if (error) throw error;
          if (results.length > 0) {
            connection.query(
              "update users set password=?,forget_code='mmmmmmmmmmmmmmmmm' where email=?",
              [pass, decoded.user.email],
              async (error, results, fields) => {
                if (error) throw error;
                console.log(results);
                if (results.affectedRows > 0) {
                  return res.status(200).json({ found: true });
                } else {
                  return res.status(200).json({ found: false });
                }
              }
            );
          } else {
            return res.status(200).json({ found: false, outer: false });
          }
        }
      );
    } else {
      return res.status(200).json({ found: false, monstouter: false });
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

//  @route  Get api/auth/checkemail
//  @desc   checking username
//  @access Public

router.get('/checkusername/:username', (req, res, next) => {
  try {
    connection.query(
      "select * from users where username='" + req.params.username + "'",
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
          return res.status(200).json({ found: true });
        } else {
          return res.status(200).json({ found: false });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

// GET /logout
router.get('/logout', function (req, res, next) {
  console.log(req.seesion);
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        // return res.redirect('/');
      }
    });
  }
});

// post login user
// post api/auth

router.post(
  '/',
  [
    check('email', 'please included a valid email').exists(),
    check('password', 'password should exists').exists(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    const { email, password } = req.body;

    try {
      connection.query(
        'select id,username,email,fname,lname,account_type,password from users where (email=? or username=?)',
        [email, email],
        async function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
            const isMatch = await bcrypt.compare(password, results[0].password);

            console.log(isMatch);
            if (!isMatch) {
              return res.status(200).json({ found: false, token: null });
            } else {
              console.log(isMatch);
              console.log(results);
              let currentType = 'buyer';
              if (results[0].account_type.includes('seller')) {
                currentType = 'seller';
              }
              const payload = {
                user: {
                  id: results[0].id,
                  username: results[0].username,
                  email: results[0].email,
                  account_types: results[0].account_type,
                  current_type: currentType,
                },
              };
              const token = jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 36000,
              });

              return res.status(200).json({ found: true, token: token });
            }
          } else {
            return res.status(200).json({ found: false, token: null });
          }
        }
      );
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

// post login user
// post api/auth

router.get('/switch-to-buying', [auth], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    connection.query(
      'select id,username,email,fname,lname,account_type from users where username=?',
      [req.user.username],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          let currentType = 'buyer';
          // if (results[0].account_type.includes("seller")) {
          //   currentType = "seller";
          // }
          const payload = {
            user: {
              id: results[0].id,
              username: results[0].username,
              account_types: results[0].account_type,
              current_type: currentType,
            },
          };
          const token = jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000,
          });

          return res.status(200).json({ found: true, token: token });
        } else {
          return res.status(200).json({ found: false, null: null });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

// post login user
// post api/auth

router.get('/switch-to-selling', [auth], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    connection.query(
      'select id,username,email,fname,lname,account_type from users where username=?',
      [req.user.username],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          let currentType = 'buyer';
          if (results[0].account_type.includes('seller')) {
            currentType = 'seller';
          }
          const payload = {
            user: {
              id: results[0].id,
              username: results[0].username,
              account_types: results[0].account_type,
              current_type: currentType,
            },
          };
          const token = jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000,
          });

          return res.status(200).json({ found: true, token: token });
        } else {
          return res.status(200).json({ found: false, null: null });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

router.post('/aggrement-selling-on-eaglance', [auth], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    connection.query(
      'select id,username,email,fname,lname,account_type from users where username=?',
      [req.user.username],
      function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
          let currentType = 'buyer';
          const payload = {
            user: {
              id: results[0].id,
              username: results[0].username,
              account_types: results[0].account_type,
              current_type: currentType,
            },
          };
          if (results[0].account_type.includes('seller')) {
            return res.status(200).json({ found: false, null: null });
          } else {
            connection.query(
              "update users set account_type='buyer,seller' where username=?",
              [req.user.username],
              function (error, results, fields) {
                currentType = 'seller';
                payload.current_type = currentType;
                const token = jwt.sign(payload, config.get('jwtSecret'), {
                  expiresIn: 36000,
                });
                return res.status(200).json({ found: true, token: token });
              }
            );
          }
        } else {
          return res.status(200).json({ found: false, null: null });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
