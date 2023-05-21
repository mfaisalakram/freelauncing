const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravator = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require('../../config/dbMySQL');
// api for fetching payment details from database table payment_details
router.get('/payment-method', (req, res) => {
  connection.query(
    'select * from payment_details',
    function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0) {
        console.log(results);
        return res.status(200).json(results);
      } else {
        return res.status(200).send(null);
      }
    }
  );
});

module.exports = router;
