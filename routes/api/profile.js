const express = require('express');
const config = require('config');
const request = require('request');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/dbMySQL');
var dateFormat = require('dateformat');

var day = dateFormat(new Date(), 'yyyy-mm-dd h:MM:ss');
const fs = require('fs');

//  @route  Post api/profile//update/common
//  @desc   update common data in profile
//  @access Private

router.post(
  '/update/common',
  [
    [
      check('fname', 'First Name is requried')
        .not()
        .isEmpty()
        .isAlpha()
        .withMessage('First Name must be alphabetic.'),

      check('lname', 'Last Name is requried')
        .not()
        .isEmpty()
        .isAlpha()
        .withMessage('First Name must be alphabetic.'),
      check('story', 'Story is requried').not().isEmpty(),
      check('about', 'About is requried').not().isEmpty(),
    ],
    auth,
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error.array());
      return res.json({ error: error.array() });
    }

    try {
      const { fname, lname, story, about } = req.body;

      const sql =
        "update users set fname='" +
        fname +
        "',lname='" +
        lname +
        "',story='" +
        story +
        "',about='" +
        about +
        "' where id ='" +
        req.user.id +
        "'";

      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        if (results.affectedRows === 1) {
          const insertid = results.insertId;

          return res.json({
            done: true,
            msg: 'Profile updated Successfully',
          });
        } else {
          return res.json({
            done: false,
            msg: 'Server error! please contact to support for help',
          });
        }
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error', err.message);
    }
  }
);

//  @route  Get api/profile/skills
//  @desc   get seller skills in profile
//  @access Private

router.get('/skills', [auth], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.array());
    return res.json({ error: error.array() });
  }
  console.log(res.body);
  try {
    const sql =
      "select ss.expert_level,ss.skill_id as id,sgs.name from seller_skills ss inner join seller_general_skills sgs on sgs.id=ss.skill_id inner join users u on u.id= ss.user_id  where u.id ='" +
      req.user.id +
      "'";

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        return res.json({
          done: true,
          data: results,
        });
      } else {
        return res.json({
          done: false,
          data: [],
        });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error', err.message);
  }
});

//  @route  Post api/profile/update/skills
//  @desc   skills data in profile
//  @access Private

router.post(
  '/update/skills',
  [[check('skills', 'Skills are requried').not().isEmpty()], auth],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error.array());
      return res.json({ error: error.array() });
    }
    console.log(res.body);
    try {
      const { skills } = req.body;

      let sql = 'delete from seller_skills where user_id=14';

      const values = skills
        .map((s) => {
          return '(' + req.user.id + ',' + s.id + ",'" + s.expert_level + "')";
        })
        .join(',');

      console.log(values);
      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        sql =
          'insert into seller_skills(user_id,skill_id,expert_level) values ' +
          values;

        console.log(sql);
        connection.query(sql, function (error, results, fields) {
          if (error) {
            console.log(error.message);
          }
          console.log(results);

          if (results.affectedRows > 0) {
            return res.json({
              done: true,
              msg: 'Skills updated Successfully',
            });
          } else {
            return res.json({
              done: false,
              msg: 'Server error! please contact to support for help',
            });
          }
        });
      });
    } catch (err) {
      console.error(err.message);
      return res.status.json({ msg: err.message, type: 'error' });
    }
  }
);

//  @route  Get api/profile/all-skills
//  @desc   get seller skills in profile
//  @access Private
router.get('/all-skills', [auth], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.array());
    return res.json({ error: error.array() });
  }

  try {
    const sql =
      "SELECT sgs.id,sgs.name FROM seller_general_skills sgs WHERE sgs.`id` NOT IN(SELECT skill_id FROM seller_skills WHERE user_id ='" +
      req.user.id +
      "' )";

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length > 0) {
        return res.json({
          done: true,
          data: results,
        });
      } else {
        return res.json({
          done: false,
          data: [],
        });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error', err.message);
  }
});

//  @route  Post api/profile//update/password
//  @desc   update password data in profile
//  @access Private

router.post(
  '/update/password',
  [
    [
      check(
        'currentPass',
        'Please enter a Current password  at least 8 character and contain At least one uppercase.At least one lower case.At least one special character.'
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
      check(
        'newPass',
        'Please enter a New password  at least 8 character and contain At least one uppercase.At least one lower case.At least one special character.'
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
      check(
        'confirmPass',
        'Please enter a Confirm password  at least 8 character and contain At least one uppercase.At least one lower case.At least one special character.'
      ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
    ],
    auth,
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error.array());
      return res.json({ error: error.array() });
    }

    try {
      const { confirmPass, newPass, currentPass } = req.body;

      if (newPass != confirmPass) {
        return res.json({
          error: [{ msg: 'New password and comfirm password not match' }],
        });
      }

      connection.query(
        "select password from users where id='" + req.user.id + "'",
        function (error, results, fields) {
          if (error) {
            console.log(error.message);
          }

          if (results.length > 0) {
            if (currentPass === results[0].password) {
              const sql =
                "update users set password='" +
                newPass +
                "' where id ='" +
                req.user.id +
                "'";

              connection.query(sql, function (error, results, fields) {
                if (error) {
                  console.log(error.message);
                }

                if (results.affectedRows === 1) {
                  const insertid = results.insertId;

                  return res.json({
                    done: true,
                    msg: 'Password is updated Successfully',
                  });
                } else {
                  return res.json({
                    done: false,
                    msg: 'Server error! please contact to support for help',
                  });
                }
              });
            } else {
              return res.json({
                error: [{ msg: 'current password not match' }],
              });
            }
          }
        }
      );
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error', err.message);
    }
  }
);

//  @route  Post api/profile/update/profileImage
//  @desc   update common data in profile
//  @access Private

router.post(
  '/update/profileImage',
  [[check('image', 'Profile image is requried').not().isEmpty()], auth],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      console.log(error.array());
      return res.json({ error: error.array() });
    }
    // console.log(res.body);
    try {
      const { image } = req.body;

      // console.log(image);

      let base64Image = image.split(';base64,').pop();

      // Buffer.from(image).toString('base64')

      let imagesName =
        dateFormat(new Date(), 'yyyy-mm-dd h-MM-ss') +
        '-' +
        req.user.username +
        '.png';

      let path = './client/public/assets/uploads/users/' + req.user.username;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);

        path += '/profileImages/';
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
      }

      path =
        '../../../client/public/assets/uploads/users/' +
        req.user.username +
        '/profileImages/';
      fs.writeFile(
        __dirname + path + imagesName,
        base64Image,
        { encoding: 'base64' },
        function (err) {
          if (err) console.log(err);
          console.log('File created');
        }
      );

      const sql =
        "update users set profile_image='" +
        imagesName +
        "' where id ='" +
        req.user.id +
        "'";

      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log(error.message);
        }

        if (results.affectedRows === 1) {
          const insertid = results.insertId;

          return res.json({
            done: true,
            msg: 'Profile updated Successfully',
          });
        } else {
          return res.json({
            done: false,
            msg: 'Server error! please contact to support for help',
          });
        }
      });
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error', err.message);
    }
  }
);

//  @route  Post api/profile/common
//  @desc   update common data in profile
//  @access Private

router.post('/common', [auth], async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error.array());
    return res.json({ error: error.array() });
  }

  try {
    const sql =
      "select fname,lname,story,about from users  where id ='" +
      req.user.id +
      "'";

    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log(error.message);
      }

      if (results.length === 1) {
        return res.json({
          done: true,
          data: results[0],
        });
      } else {
        return res.json({
          done: false,
          msg: 'Server error! please contact to support for help',
        });
      }
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error', err.message);
  }
});

module.exports = router;
