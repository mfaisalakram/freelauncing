const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
var cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');

const { v4: uuid } = require('uuid');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var dateFormat = require('dateformat');
const auth = require('./middleware/auth');
const fs = require('fs');
var day = dateFormat(new Date(), 'yyyy-mm-dd h:MM:ss');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

// Middlewares
app.use(morgan('tiny'));
// app.use(express.json());
app.use(cors());
app.use(fileUpload());
// file upload api
app.post('/upload', (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: 'file is not found' });
  }
  // accessing the file
  const myFile = req.files.file;

  let fileName =
    dateFormat(new Date(), 'yyyy-mm-dd h-MM-ss') + '-' + myFile.name;

  var dir = `${__dirname}/client/public/assets/uploads/attachments/messages`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  //  mv() method places the file inside public directory
  myFile.mv(
    `${__dirname}/client/public/assets/uploads/attachments/messages/${fileName}`,
    function (err) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ msg: 'Error occured', type: err.message });
      }
      // returing the response with file path and name
      return res.send({
        name: myFile.name,
        path: 'assets/uploads/attachments/messages/' + fileName,
      });
    }
  );
});
app.post('/project-delivery/upload', [auth], (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: 'file is not found' });
  }
  // accessing the file
  const myFile = req.files.file;

  let fileName =
    dateFormat(new Date(), 'yyyy-mm-dd h-MM-ss') + '-' + myFile.name;

  var dir = `${__dirname}/client/public/assets/uploads/users/${req.user.username}/deliveries`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  //  mv() method places the file inside public directory
  myFile.mv(
    `${__dirname}/client/public/assets/uploads/users/${req.user.username}/deliveries/${fileName}`,
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ uploaded: false });
      }
      return res.send({ uploaded: true, fileName: fileName });
    }
  );
});

app.get('/send-mail', async (req, res) => {});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '150mb' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is starting ${PORT}`));

connectDB();

const authRoutes = require('./routes/api/auth');
const userRoutes = require('./routes/api/users');
const profileRoutes = require('./routes/api/profile');
const servicesRoutes = require('./routes/api/services');
const socialaAuthRoutes = require('./routes/api/socialAuth');
const rawRoutes = require('./routes/api/raw');
const paymentRoutes = require('./routes/api/payments');

app.use(express.static(path.join(__dirname, '/client/build')));

// Routes

const chat = require('./routes/api/chatapp');
const orderRoutes = require('./routes/api/orders');

app.use('/api/chatapp/', chat);

app.get('/user-agent', function (req, res) {
  return res.send(req.useragent);
});

app.use('/auth', socialaAuthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/service', servicesRoutes);
app.use('/api/raw', rawRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

const stripe = require('stripe')('sk_test_R10Qnz7v0YC19OD7v54ve3UO00A3dxDiHU');

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'https://example.com/success',
    cancel_url: 'https://example.com/cancel',
  });

  return res.json({ id: session.id });
});

app.get('*', (req, res) => {
  app.use(express.static('client/bulid'));
  return res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

// npm i nodemon concurrently -D
// npm i request mongoose jsonwebtoken http-proxy-middleware gravatar express-validator express cors config bcryptjs
