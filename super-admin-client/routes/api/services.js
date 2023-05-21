const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../../models/User');
const gravator = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const connection = require('../../config/dbMySQL');

// Api for getting  records from database
router.get('/service-management', (req, res) => {
  connection.query(
    'select * from seller_services',
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

// Api for updating services status from database
router.put('/service-management', (req, res) => {
  connection.query(
    "update seller_services SET status='" +
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

//Api for select user from statustype { through dropdown}
router.post('/service-status', (req, res) => {
  let sql = 'select * from seller_services';
  if (req.body.type != '') {
    sql = "select * from seller_services where status='" + req.body.type + "' ";
  }
  connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    return res.status(200).json(results);
  });
});

//Api for select user from name
router.post('/search-name', (req, res) => {
  connection.query(
    "select * from seller_services where id='" + req.body.id + "'",
    function (error, results, fields) {
      if (error) throw error;
      return res.status(200).json(results);
    }
  );
});

router.get('/services-report', (req, res) => {
  connection.query(
    'SELECT  sr.id,sr.description,sr.url,sr.report_by,srt.name,ss.title, GROUP_CONCAT(si.image_path) FROM services_report sr INNER JOIN services_report_types srt ON srt.report_id=sr.report_id  INNER JOIN seller_services ss ON  ss.id=sr.service_id INNER JOIN services_images si ON si.service_id=sr.service_id GROUP BY sr.id',
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

router.put('/service-report', (req, res) => {
  connection.query(
    'update services_report SET status=? where id=?',
    [req.body.type, req.body.id],
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
