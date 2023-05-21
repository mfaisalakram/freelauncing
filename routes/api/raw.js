const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require('../../config/dbMySQL');

//  @route  Get api/raw/categories
//  @desc   load user
//  @access Public

router.get('/categories', (req, res, next) => {
  try {
    connection.query(
      'select cat_id,cat_name from business_categories where status=1',
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
          return res.status(200).json({ found: true, data: results });
        } else {
          return res.status(200).json({ found: false, data: null });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

//  @route  Get api/raw/:id/subcategories
//  @desc   load user
//  @access Public

router.get('/:cat_id/subcategories', (req, res, next) => {
  try {
    const sql =
      "select sub_cat_id,subcat_name from sub_categories where status=1 and cat_id='" +
      req.params.cat_id +
      "'";
    connection.query(sql, function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        return res.status(200).json({ found: true, data: results });
      } else {
        return res.status(200).json({ found: false, data: null, sql: sql });
      }
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

router.get('/:subcat_id/servicetypes', (req, res, next) => {
  try {
    connection.query(
      "select ser_id,ser_name from service_types where status=1 and subcat_id='" +
        req.params.subcat_id +
        "'",
      function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
          return res.status(200).json({ found: true, data: results });
        } else {
          return res.status(200).json({ found: false, data: null });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('server error ' + error.message);
  }
});

//  @route  Get api/auth/checkemail
//  @desc   load user
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
    check('email', 'please included a valid email').isEmail(),
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
        "select id,username,email,fname,lname from users where email='" +
          email +
          "' and password='" +
          password +
          "'",
        function (error, results, fields) {
          if (error) throw error;

          if (results.length > 0) {
            return res.status(200).json({ found: true, user: results[0] });
          } else {
            return res.status(200).json({ found: false, user: null });
          }
        }
      );
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
