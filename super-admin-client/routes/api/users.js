const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravator = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require('../../config/dbMySQL');

router.get('/all-users', (req, res) => {
  connection.query('select * from users', function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(200).send(null);
    }
  });
});

router.get('/all-users', (req, res) => {
  // console.log(req);
  connection.query('select * from users', function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(200).send(null);
    }
  });
});

router.put('/all-users', (req, res) => {
  connection.query(
    "update users SET account_status='" +
      req.body.type +
      "' where id='" +
      req.body.id +
      "'",

    function (error, results, fields) {
      if (error) throw error;
      return res.status(200).json(results);
    }
  );
});

router.post('/get-user-type', (req, res) => {
  connection.query(
    "select * from users where account_status='" + req.body.type + "' ",
    function (error, results, fields) {
      if (error) throw error;
      return res.status(200).json(results);
    }
  );
});

router.post('/get-user-byname', (req, res) => {
  connection.query(
    "select * from users where fname like '%" + req.body.fname + "%' ",
    function (error, results, fields) {
      if (error) throw error;
      return res.status(200).json(results);
    }
  );
});

module.exports = router;
