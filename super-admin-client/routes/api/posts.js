const express = require('express');
const config = require('config');
const request = require('request');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');
const { check, validationResult } = require('express-validator');

//  @route  GET api/posts
//  @desc   Create a post
//  @access Private

router.post(
  '/',
  [auth, [check('text', 'Text is requried').not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const user = await User.findById(req.user, (err, user) => {}).select(
        '-password'
      );

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user,
      });
      const post = await newPost.save();
      return res.json(post);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error');
    }

    return res.send('post route');
  }
);

//  @route  GET api/posts
//  @desc   get all posts
//  @access Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    return res.json(posts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//  @route  GET api/posts/:id
//  @desc   get post by id
//  @access Private

router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    return res.status(500).send('server error');
  }
});

//  @route  Delete api/posts/:id
//  @desc   delete post by id
//  @access Private

router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    if (post.user.toString() !== req.user) {
      return res.status(404).json({ msg: 'user not authorized' });
    }
    await post.remove();
    return res.send('post remove');
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    return res.status(500).send('server error');
  }
});

//  @route  PUT api/posts/:id
//  @desc   like post by id
//  @access Private

router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user).length > 0
    ) {
      return res.status(400).json({ msg: 'post Already Like' });
    }
    post.likes.unshift({ user: req.user });
    await post.save();
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    return res.status(500).send('server error');
  }
});

//  @route  PUT api/posts/:id
//  @desc   unlike post by id
//  @access Private

router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }

    if (
      post.likes.filter((like) => like.user.toString() === req.user).length ===
      0
    ) {
      return res.status(400).json({ msg: 'post has not like post yet' });
    }

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user);
    post.likes.splice(removeIndex, 1);
    await post.save();
    return res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    return res.status(500).send('server error');
  }
});

//  @route  Post api/posts/comments/:id
//  @desc   cooment on a post
//  @access Private

router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is requried').not().isEmpty()]],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ error: error.array() });
    }
    try {
      const user = await User.findById(req.user).select('-password');
      const post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({ msg: 'post not found' });
      }

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user,
      };
      post.comments.unshift(newComment);
      await post.save();
      return res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      return res.status(500).send('server error');
    }
  }
);

//  @route  Delete api/posts/comment/:id/:comment_id
//  @desc   delete comment post by id
//  @access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'post not found' });
    }
    // put out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    //   make sure comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment not exists' });
    }
    // check user
    if (comment.user.toString() !== req.user) {
      return res.status(401).json({ msg: 'User not Authorized' });
    }

    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user);
    post.comments.splice(removeIndex, 1);
    await post.save();
    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post not found' });
    }
    return res.status(500).send('server error');
  }
});

module.exports = router;
