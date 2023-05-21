const mongoose = require("mongoose");

var ChatSchema = new mongoose.Schema({
  messages: [
    {
      text: {
        type: String
      },
      seen: {
        type: Boolean,
        required: true
      },
      time: { type: Date, default: Date.now },
      sender: {
        type: String
      },
      type: {
        type: String
      },
      attachment: [
        {
          name: {
            type: String
          },
          size: {
            type: String
          },
          path: {
            type: String
          }
        }
      ],
      Offer: [
        {
          serviceId: {
            type: String
          },
          DeliveryTime: {
            type: String
          },
          amount: {
            type: String
          },
          description: {
            type: String
          },
          status: {
            type: String
          },
          title: {
            type: String
          }
        }
      ]
    }
  ],
  participant1: {
    type: String,
    max: 2000
  },
  participant2: {
    type: String,
    max: 2000
  }
});

const Chat = mongoose.model("Chat", ChatSchema);

module.exports = Chat;
