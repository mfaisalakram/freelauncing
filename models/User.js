const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    require: true,
    minLength: 2,
    maxLength: 12,
  },
  userID: {
    type: String,
  },
});

let User;
try {
  User = mongoose.model('User');
} catch (error) {
  User = mongoose.model('User', userSchema);
}

module.exports = User;
