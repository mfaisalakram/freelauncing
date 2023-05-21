const express = require('express');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const Chat = require('../../models/Chat');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/dbMySQL');
const PaymentSession = require('../../models/PaymentSessions');
var dateFormat = require('dateformat');
const Stripe = require('stripe');
const stripe = Stripe('sk_test_R10Qnz7v0YC19OD7v54ve3UO00A3dxDiHU');
const request = require('request');

var day = dateFormat(new Date(), 'yyyy-mm-dd h:MM:ss');
const fs = require('fs-extra');
const client_baseUrl = 'http://localhost:3000';

router.post('/create-checkout-session', [auth], async (req, res) => {
  const sessionId = req.query.id;
  const data = await PaymentSession.findOne({ _id: sessionId });
  console.log(data);
  const seller = data.seller;
  const msgId = data.offerId;
  console.log(seller);
  let previousChat = await Chat.findOne({
    $or: [
      { participant1: req.user.username, participant2: seller },
      { participant2: req.user.username, participant1: seller },
    ],
  });

  let offerData;
  if (previousChat) {
    offerData = previousChat.messages.filter((msg) => {
      if (msg.id === msgId) {
        offerData = msg;
        return msg;
      }
    });
  }

  const serviceId = offerData[0].Offer[0]['serviceId'];
  const sql =
    "select ss.id,group_concat('/assets/uploads/users/',u.username,'/serviceImages/',si.image_path)  as images ,ss.title,ss.url_title from seller_services ss inner join services_images si on ss.id=si.service_id inner join users u on u.id=ss.user_id where ss.status='active'  and ss.id='" +
    serviceId +
    "';select bfd.personal_balance from  buyer_finance_details bfd where bfd.user_id='" +
    req.user.id +
    "';select amount,service_fee_in_percent from buyer_order_fee_fixed";
  connection.query(sql, async (error, results, fields) => {
    if (error) {
      console.log(error.message);
    }

    results[0][0]['offerDetails'] = offerData[0].Offer[0];
    results[0][0]['personal_balance'] = results[1][0].personal_balance;
    let sum = 0;
    if (results[2][0].amount >= results[0][0]['offerDetails'].amount) {
      sum =
        results[0][0]['offerDetails'].amount *
        (results[2][0].service_fee_in_percent / 100);
    }
    if (results[2][0].amount < results[0][0]['offerDetails'].amount) {
      sum = results[2][0].amount * (results[2][0].service_fee_in_percent / 100);
      let remaing = results[0][0]['offerDetails'].amount - results[2][0].amount;
      sum = sum + remaing * (results[2][1].service_fee_in_percent / 100);
    }

    results[0][0]['serviceFee'] = sum;
    results[0][0]['showPaymentMethod'] = true;
    if (
      results[0][0]['personal_balance'] >= results[0][0]['offerDetails'].amount
    ) {
      results[0][0]['showPaymentMethod'] = false;
    }
    results[0][0]['total'] =
      parseFloat(results[0][0]['offerDetails'].amount) +
      parseFloat(results[0][0]['serviceFee']);
    results[0][0]['remaining'] =
      parseFloat(results[0][0]['total']) - results[0][0]['personal_balance'];
    const title = results[0][0]['title'];
    const amount = parseInt(
      parseFloat(results[0][0]['remaining']).toFixed(2) * 100
    );
    // console.log(amount);
    const session = await stripe.checkout.sessions.create({
      success_url:
        'http://localhost:5000/api/payments/get-session-details?id={CHECKOUT_SESSION_ID}&paysessionID=' +
        req.query.id,
      cancel_url: 'https://example.com/cancel',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: amount,
            product_data: {
              name: title,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
    });
    console.log(session);
    return res.json({ id: session.id });
  });
});

router.get('/get-session-details', async (req, res) => {
  const id = req.query.id;
  sessionID = req.query.paysessionID;

  let data = await stripe.checkout.sessions.retrieve(id);

  const payment_ID = data.payment_intent;
  data = await stripe.paymentIntents.retrieve(payment_ID);
  //  return res.json(data)

  const amount_from_card = data.amount;
  const capture_method = data.capture_method;
  const amount_refunded = data.charges.data[0].amount_refunded;
  const balance_transaction = data.charges.data[0].balance_transaction;
  const country = data.charges.data[0].billing_details.address.country;

  const calculated_statement_descriptor =
    data.charges.data[0].calculated_statement_descriptor;

  const captured = data.charges.data[0].captured;
  const created = data.charges.data[0].created;
  const currency = data.charges.data[0].currency;
  const customer = data.charges.data[0].customer;
  const paid = data.charges.data[0].paid;
  const status = data.charges.data[0].status;
  const payment_type = data.payment_method_types[0];

  data = await PaymentSession.findOne({ _id: sessionID });
  const seller = data.seller;
  const buyer = data.buyer;
  const msgId = data.offerId;

  let previousChat = await Chat.findOne({
    $or: [
      { participant1: buyer, participant2: seller },
      { participant2: buyer, participant1: seller },
    ],
  });
  let offerData;
  if (previousChat) {
    offerData = previousChat.messages.filter((msg) => {
      if (msg.id === msgId) {
        offerData = msg;
        return msg;
      }
    });
  }
  const serviceId = offerData[0].Offer[0]['serviceId'];
  // const actualAmount = offerData[0].Offer[0]["amount"]
  const data1 = offerData[0].Offer[0];

  let resData = { ...data._doc, serviceID: serviceId, ...data1._doc };

  const sellerUsername = resData.seller;
  const buyerUsername = resData.buyer;
  const serviceID = resData.serviceID;
  const offerID = resData.offerId; // we will use as order id
  const DeliveryTime = resData.DeliveryTime; // we will use as order id
  // const amount = resData.amount; // we will use as order id

  sql =
    "insert into order_details(order_id,seller_username,buyer_username,order_datetime,payment_id,service_id,status) values(?,?,?,now(),?,?,'active');insert into order_updation_stack(order_id,order_status,remarks,initiated_by,delivery_time,update_datetime,amount) values(?,'active',?,'buyer',?,now(),?)";

  console.log('amount form carg===========================', amount_from_card);
  connection.query(
    sql,
    [
      offerID,
      sellerUsername,
      buyerUsername,
      payment_ID,
      serviceID,
      offerID,
      buyerUsername,
      DeliveryTime,
      amount_from_card / 100,
    ],
    async (error, results, fields) => {
      if (error) {
        // console.log("yes");
        // return  res.redirect(client_baseUrl+"?error=Dublicate Order:you cannot place order multiply time on a single offer");
        console.log(error.message);
      }

      // return  res.redirect(client_baseUrl+"?error=order dublicate");

      // return res.send(results);
      //   body = ["sessionID" => request.getQueryParam('id')];
      //   token = request.getHeader('x-auth-token');
      //   r = client.request('POST', 'http://localhost:5000/api/chatapp/offer-accept', [
      //       'form_params' => body,
      //       'headers' => [
      //           "x-auth-token" => token,
      //       ],
      //   ]);

      sql = "select id from users where username='buyerUsername'";
      // results= db.query(sql);

      connection.query(sql, [buyerUsername], async (error, results, fields) => {
        if (error) {
          console.log(error.message);
        }

        const amount_from_personal_balance = 0;
        const userID = data.id;
        const orderID = offerID;

        const values = 'values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        sql =
          'INSERT INTO `payment_details`(`payment_id`, `amount_from_card`, `captured_method`, `amount_from_personal_balance`, `amount_refunded`, `balance_transation`, `country`, `calculated_statement_descriptor`, `captured`, `created`, `currency`, `customer`, `paid`, `order_id`, `user_id`, `payment_type`) ' +
          values;

        connection.query(
          sql,
          [
            payment_ID,
            amount_from_card,
            capture_method,
            amount_from_personal_balance,
            amount_refunded,
            balance_transaction,
            country,
            calculated_statement_descriptor,
            captured,
            created,
            currency,
            customer,
            paid,
            orderID,
            userID,
            payment_type,
          ],
          async (error, results, fields) => {
            if (error) {
              console.log(error.message);
            }

            return res.redirect(
              client_baseUrl + '/users/' + sellerUsername + '/orders/' + offerID
            );
          }
        );

        // return $response.withJson($resData).withStatus(200);
      });
    }
  );
});

module.exports = router;
