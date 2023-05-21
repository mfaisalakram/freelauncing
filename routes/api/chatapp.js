const express = require('express');
const config = require('config');
const request = require('request');
const router = express.Router();
const auth = require('../../middleware/auth');
const Chat = require('../../models/Chat');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');
const connection = require('../../config/dbMySQL');
var dateFormat = require('dateformat');
const mongoose = require('mongoose');
var day = dateFormat(new Date(), 'yyyy-mm-dd h:MM:ss');
const fs = require('fs');

router.post('/add-message', [auth], async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    // console.log(req.body);
    const { msg, receiver, type, attachment, offerData } = req.body;

    let previousChat = await Chat.findOne({
      $or: [
        { participant1: req.user.username, participant2: receiver },
        { participant2: req.user.username, participant1: receiver },
      ],
    });

    // console.log(previousChat);

    if (previousChat) {
      console.log('addmessage');
      let data = {
        text: msg,
        sender: req.user.username,
        seen: false,
        type: type,
      };

      if (type === 'attachment') {
        console.log(attachment);
        data = {
          ...data,
          type: type,
          attachment: [attachment],
        };
      } else if (type === 'offer') {
        data = {
          type: 'offer',
          sender: req.user.username,
          seen: false,
          Offer: [{ ...offerData, status: 'send' }],
        };
      } else {
      }
      previousChat.messages.push(data);
      // console.log(data);

      await previousChat.save();
    } else {
      let profile = new Chat({
        messages: [
          {
            text: msg,
            sender: req.user.username,
            seen: false,
          },
        ],
        participant1: req.user.username,
        participant2: receiver,
      });

      await profile.save();
    }
    return res.status(200).json({ msg: 'send message Success' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'server error', error: error });
  }
});

router.post('/offer-reject/', [auth], async (req, res) => {
  console.log('get-meessage');

  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const receiver = req.body.seller;
    const msgId = req.body.offerId;
    let previousChat = await Chat.findOne({
      $or: [
        { participant1: req.user.username, participant2: receiver },
        { participant2: req.user.username, participant1: receiver },
      ],
    });

    if (previousChat) {
      previousChat.messages = previousChat.messages.filter((msg) => {
        if (msg.id === msgId) {
          let x = [...msg.Offer];
          x[0].status = 'reject';

          return x;
        }
        return msg;
      });

      await previousChat.save();

      return res.json({ found: true, chatdata: previousChat });
    } else {
      return res.json({ found: false, chatdata: { messages: [] } });
    }

    // if (profile) {
    //   profile = await Profile.findOneAndUpdate(
    //     { user: req.user },
    //     { $set: profileFields },
    //     { new: true }
    //   );

    //   return res.json(profile);
    // }
    // profile = new Profile(profileFields);

    // return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, error: true });
  }
});

router.post('/offer-accept/', [auth], async (req, res) => {
  console.log('get-meessage');

  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const receiver = req.body.seller;
    const msgId = req.body.offerId;
    let previousChat = await Chat.findOne({
      $or: [
        { participant1: req.user.username, participant2: receiver },
        { participant2: req.user.username, participant1: receiver },
      ],
    });

    if (previousChat) {
      previousChat.messages = previousChat.messages.filter((msg) => {
        if (msg.id === msgId) {
          let x = [...msg.Offer];
          x[0].status = 'accept';

          return x;
        }
        return msg;
      });

      await previousChat.save();

      return res.json({ found: true, chatdata: previousChat });
    } else {
      return res.json({ found: false, chatdata: { messages: [] } });
    }

    // if (profile) {
    //   profile = await Profile.findOneAndUpdate(
    //     { user: req.user },
    //     { $set: profileFields },
    //     { new: true }
    //   );

    //   return res.json(profile);
    // }
    // profile = new Profile(profileFields);

    // return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, error: true });
  }
});

router.post('/offer-withdraw/', [auth], async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    const receiver = req.body.buyer;
    const msgId = req.body.offerId;
    let previousChat = await Chat.findOne({
      $or: [
        { participant1: req.user.username, participant2: receiver },
        { participant2: req.user.username, participant1: receiver },
      ],
    });

    if (previousChat) {
      previousChat.messages = previousChat.messages.filter((msg) => {
        if (msg.id === msgId) {
          let x = [...msg.Offer];
          x[0].status = 'withdraw';
          return x;
        }
        return msg;
      });

      await previousChat.save();

      return res.json({ found: true, chatdata: previousChat });
    } else {
      return res.json({ found: false, chatdata: { messages: [] } });
    }

    // if (profile) {
    //   profile = await Profile.findOneAndUpdate(
    //     { user: req.user },
    //     { $set: profileFields },
    //     { new: true }
    //   );

    //   return res.json(profile);
    // }
    // profile = new Profile(profileFields);

    // return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, error: true });
  }
});

router.get('/get-messages/:receiver', [auth], async (req, res) => {
  console.log('get-meessage');

  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    // console.log(req.body);
    const receiver = req.params.receiver;

    let previousChat = await Chat.findOne({
      $or: [
        { participant1: req.user.username, participant2: receiver },
        { participant2: req.user.username, participant1: receiver },
      ],
    });

    // console.log(previousChat);
    if (previousChat) {
      // previousChat.messages= previousChat.messages.map(msg=>{
      //          return {
      //            ...msg,
      //            seen:true
      //          }
      // });

      // await previousChat.save();

      return res.json({ found: true, chatdata: previousChat });
    } else {
      return res.json({ found: false, chatdata: { messages: [] } });
    }

    // if (profile) {
    //   profile = await Profile.findOneAndUpdate(
    //     { user: req.user },
    //     { $set: profileFields },
    //     { new: true }
    //   );

    //   return res.json(profile);
    // }
    // profile = new Profile(profileFields);

    // return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'server error', error: error });
  }
});

router.get('/get-chat-userData', [auth], async (req, res) => {
  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    let previousChat = await Chat.find({
      $or: [
        { participant1: req.user.username },
        { participant2: req.user.username },
      ],
    }).select(
      '-_id -__v -messages._id  -messages.Offer -messages.attachment -messages.seen'
    );

    if (previousChat) {
      let users = [];
      let newChat = [];
      previousChat = previousChat.map((chat) => {
        let c = { ...chat._doc };
        c.messages = chat.messages[chat.messages.length - 1];
        if (
          c.messages.sender === req.user.username &&
          c.messages.sender === c.participant1
        ) {
          c.receiverUsername = c.participant2;
        } else {
          c.receiverUsername = c.participant1;
        }
        users.push("'" + c.receiverUsername + "'");
        const obj = new Object();
        obj[c.receiverUsername] = c;
        newChat.push(obj);
        return c;
      });

      // console.log(newChat);

      users = users.join(',');
      let sql =
        "select username,profile_image from users where username='" +
        req.user.username +
        "'";
      if (users) {
        sql =
          'select username,profile_image from users where username in (' +
          users +
          ')';
      }

      console.log(sql);
      connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        if (results.length > 0) {
          console.log(results);

          let newChat = [];
          results.map((image) => {
            previousChat.map((c) => {
              if (c.receiverUsername === image.username) {
                newChat.push({
                  ...c,
                  image: image.profile_image,
                });
              }
            });
          });

          console.log(newChat);

          return res.status(200).json({ found: true, chatdata: newChat });
        } else {
          return res.status(200).send({ found: false, chatdata: [] });
        }
      });

      //   // console.log(previousChat);
      //   res.json({ found: true, chatdata: previousChat });
      // } else {
      //   res.json({ found: false, chatdata: [] });
      // }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, error: true });
  }
});

router.get('/get-unseen-messages/:receiver', [auth], async (req, res) => {
  console.log('add unseen - message');

  try {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }

    // console.log(req.body);
    const receiver = req.params.receiver;

    //  .aggregate([
    //     { $match: { seen: true } },
    //     { $group: { _id: "$cust_id", total: { $sum: "$amount" } } }
    //  ])

    let previousChat = await Chat.findOne({
      $or: [
        { participant1: req.user.username, participant2: receiver },
        { participant2: req.user.username, participant1: receiver },
      ],
    });

    //  previousChat=previousChat.messages.filter(msg=>{
    //    msg.seen=false;
    //  })

    // let previousChat= await Chat.aggregate([{ $match:{$or: [
    //   { participant1: req.user.username,participant2: receiver},
    //   { participant2: req.user.username,participant1: receiver}
    // ]}}, {
    //     $unwind:'$messages'},
    //     {$match:{'messages.seen':false}},
    //     {$group:{
    //       _id:'$_id',
    //       messages:{
    //         $push:'$messages.text'
    //         }
    //     }}]);

    // console.log(previousChat);

    // let previousChat = await Chat.findOne({
    //   $or: [
    //     { participant1: req.user.username,participant2: receiver},
    //     { participant2: req.user.username,participant1: receiver}
    //   ]
    // });

    // console.log(previousChat);

    if (previousChat) {
      return res.json({
        found: true,
        chatdata: { messages: previousChat.messages },
      });
    } else {
      return res.json({ found: false, chatdata: [] });
    }

    // if (profile) {
    //   profile = await Profile.findOneAndUpdate(
    //     { user: req.user },
    //     { $set: profileFields },
    //     { new: true }
    //   );

    //   return res.json(profile);
    // }
    // profile = new Profile(profileFields);

    // return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'server error', error: error.message });
  }
});

module.exports = router;
