const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb://faisalakram:faisalakram@cluster0-shard-00-00.v4htb.mongodb.net:27017,cluster0-shard-00-01.v4htb.mongodb.net:27017,cluster0-shard-00-02.v4htb.mongodb.net:27017/?ssl=true&replicaSet=atlas-of5238-shard-0&authSource=admin&retryWrites=true&w=majority',
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      }
    );
    console.log('mongoDB is connected Faisal');
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};
module.exports = connectDB;
