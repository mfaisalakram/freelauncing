const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
// const Note = require("../../models/Note");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const connection = require('../../config/dbMySQL');
const GooleStrategy = require('passport-google-oauth20').Strategy;
// const appleSignin = require("apple-signin");
// const keys = require("../../config/keys");
let baseUrl = 'http://localhost:3000';
let baseUrlserver = 'http://localhost:5000';

if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://eaglance.com';
  baseUrlserver = 'http://eaglance.com';
}

router.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GooleStrategy(
    {
      clientID:
        '716920478883-s0m38nllraunqtabgn250eb34ng7iul9.apps.googleusercontent.com',
      clientSecret: 'N4hktkxaG4zhoZmQ4PyTqzAw',
      callbackURL: baseUrlserver + '/auth/google/callback',
      proxy: true,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

// facebook auth setup
passport.use(
  new FacebookStrategy(
    {
      clientID: '1021944031605809',
      clientSecret: '71c46de46916b560bd0d8f9e8d55e278',
      callbackURL: baseUrlserver + '/auth/facebook/callback',
      profileFields: [
        'id',
        'displayName',
        'email',
        'birthday',
        'friends',
        'first_name',
        'last_name',
        'middle_name',
        'gender',
        'link',
      ],
    },

    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

//++++++++++++++++++++++++++++++++++++ APIS ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//  @route  Get api/auth/google
//  @desc   load user from Google
//  @access Public

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

//  @route  Get api/auth/facebook
//  @desc   load user from Google
//  @access Public

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    authType: 'rerequest',
    scope: ['email', 'public_profile'],
  })
);

//  @route  Get api/auth/facebook/callback
//  @desc    callback api from facebook
//  @access Public

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    scope: ['email', 'public_profile'],
    failureRedirect: '/',
  }),
  function (req, res, next) {
    connection.query(
      "select id,username,fname,lname,email,account_type from users where email='" +
        req.user.emails[0].value +
        "'",
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
              email: results[0].email,
              account_status: results[0].account_status,
              account_types: results[0].account_type,
              current_type: currentType,
            },
          };

          const token = jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 36000,
          });

          return res.redirect(baseUrl + '?token=' + token);
        } else {
          return res.redirect(
            baseUrl +
              '/join?fname=' +
              req.user._json.first_name +
              '&lname=' +
              req.user._json.last_name +
              '&email=' +
              req.user._json.email
          );
        }
      }
    );
  }
);

//  @route  Get api/auth/google/callback
//  @desc   Callback url from google auth
//  @access Public

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  connection.query(
    "select id,username,fname,lname,email,account_type from users where email='" +
      req.user.emails[0].value +
      "'",
    function (error, results, fields) {
      if (error) throw error;
      if (results.length > 0) {
        // req.session.user = results[0];

        let currentType = 'buyer';
        if (results[0].account_type.includes('seller')) {
          currentType = 'seller';
        }

        const payload = {
          user: {
            id: results[0].id,
            username: results[0].username,
            email: results[0].email,
            account_status: results[0].account_status,
            account_types: results[0].account_type,
            current_type: currentType,
          },
        };

        const token = jwt.sign(payload, config.get('jwtSecret'), {
          expiresIn: 36000,
        });

        return res.redirect(baseUrl + '?token=' + token);
      } else {
        return res.redirect(
          baseUrl +
            '/join?fname=' +
            req.user._json.given_name +
            '&lname=' +
            req.user._json.family_name +
            '&email=' +
            req.user._json.email
        );
      }
    }
  );
});

module.exports = router;
