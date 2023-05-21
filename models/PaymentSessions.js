const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const sessionSchema = mongoose.Schema({
  seller: {
    type: String
  },
  offerId:{
    type: String
  }, 
  buyer:{
    type: String
  },
  serviceID:{
    type: String
  },
  offerID:{
    type: String
  }
});

let PaymentSession;
try {
  PaymentSession = mongoose.model('PaymentSession')
} catch (error) {
  PaymentSession =  mongoose.model("PaymentSession", sessionSchema);
}



module.exports =PaymentSession;

