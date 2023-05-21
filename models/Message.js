/*jshint esversion: 8 */

const mongoose = require("mongoose");
const Joi = require("joi");

const MessageSchema = mongoose.Schema({

  message: {
    type: String,
    require: true,
    minLength: 1,
    maxLength: 500
  },
  type: {
    type: String,
    require: true
  },
  timestamp: {
    type: String,
    require: true
  },
  senderId: {
    type: String
  },
  filePath: {
    type: String
  }
});

const Message = mongoose.model("Message", MessageSchema);

const validate = Message => {
  const schema = Joi.object({
    name: Joi.string().required(),
    message: Joi.string()
      .required()
      .min(1)
      .max(500)
      .regex(/^(?!\s*$).+/),
    channel: Joi.string().required(),
    timestamp: Joi.string().required(),
    recieverPbkHash: Joi.string(),
    senderPbkHash: Joi.string(),
    seen: Joi.boolean()
  });

  return schema.validate(Message);
};

module.exports = {
  Message,
  validate
};
