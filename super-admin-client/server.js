const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');
const app = express();
connectDB();

app.use(express.json({ extended: false }));
app.use(cors()); // Use this after the variable declaration
const authRoutes = require('./routes/api/auth');
const userRoutes = require('./routes/api/users');
const servicesRoutes = require('./routes/api/services');
const paymentRoutes = require('./routes/api/payment');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/payment', paymentRoutes);

app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/profile', require('./routes/api/profile'));

const PORT = process.env.PORT || 4500;
app.listen(PORT, () => console.log(`server is starting ${PORT}`));
