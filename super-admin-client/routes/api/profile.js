const express = require('express');
const config = require('config');
const request = require('request');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');
const User = require('../../models/User');
const { check, validationResult } = require('express-validator');

//  @route  GET api/profile
//  @desc   get logged in user profile
//  @access Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user }).populate('user', [
      'name',
      'avatar',
    ]);
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }
    return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'server error', error: error });
  }
});

//  @route  Post api/profile
//  @desc   create or update profile
//  @access Private

router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is requried').not().isEmpty(),
      check('skills', 'Skills is requried').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }
      const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin,
      } = req.body;
      console.log(req.body);
      const profileFields = {};
      profileFields.user = req.user;
      if (company) profileFields.company = company;
      if (website) profileFields.website = website;
      if (location) profileFields.location = location;
      if (bio) profileFields.bio = bio;
      if (status) profileFields.status = status;
      if (githubusername) profileFields.githubusername = githubusername;
      if (skills) {
        profileFields.skills = skills.split(',').map((skill) => skill.trim());
      }
      profileFields.social = {};
      if (youtube) profileFields.social.youtube = youtube;
      if (twitter) profileFields.social.twitter = twitter;
      if (facebook) profileFields.social.facebook = facebook;
      if (linkedin) profileFields.social.linkedin = linkedin;
      if (instagram) profileFields.social.instagram = instagram;
      let profile = await Profile.findOne({ user: req.user });
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }
      profile = new Profile(profileFields);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'server error', error: error });
    }
  }
);

//  @route  GET api/profile/all
//  @desc   get all user profiles
//  @access Public

router.get('/all', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    if (!profiles) {
      return res.status(400).json({ msg: 'There is no profiles' });
    }
    return res.json(profiles);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'server error', error: error });
  }
});

//  @route  GET api/profile/user/:user_id
//  @desc   get  user profiles by id
//  @access Public

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);
    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    return res.json(profile);
  } catch (error) {
    console.log(error);
    if ((error.kind = 'ObjectId')) {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    return res.status(500).json({ msg: 'server error' });
  }
});

//  @route  Delete api/profile
//  @desc   delele profile by id
//  @access Private

router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({ user: req.user });
    await User.findOneAndRemove({ _id: req.user });
    await Post.deleteMany({ user: req.user });

    return res.json({ msg: 'User Deleted' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'server error' });
  }
});

//  @route  put api/profile/experience
//  @desc   add experience
//  @access Private

router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is requried').not().isEmpty(),
      check('company', 'company is requried').not().isEmpty(),
      check('from', 'from is requried').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const {
        title,
        company,
        website,
        location,
        from,
        to,
        current,
        description,
      } = req.body;

      const newExp = {
        title,
        company,
        website,
        location,
        from,
        to,
        current,
        description,
      };

      //   res.json(profile);
      let profile = await Profile.findOne({ user: req.user });
      if (!profile) {
        return res.status(400).json({ msg: 'Profile not Found', error: error });
      }
      profile.experience.unshift(newExp);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'server error', error: error });
    }
  }
);

//  @route  DELETE api/profile/experience/exp_id
//  @desc   delele experience by id
//  @access Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });
    const index = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    console.log(index);
    profile.experience.splice(index, 1);
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'server error' });
  }
});

//  @route  put api/profile/education
//  @desc   add education
//  @access Private

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is requried').not().isEmpty(),
      check('degree', 'Degree is requried').not().isEmpty(),
      check('fieldofstudy', 'Field of study is requried').not().isEmpty(),
      check('from', 'From is requried').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
      }

      const { school, degree, fieldofstudy, from, to, current, description } =
        req.body;

      const newEdu = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description,
      };

      console.log(newEdu);
      let profile = await Profile.findOne({ user: req.user });
      if (!profile) {
        return res.status(400).json({ msg: 'Profile not Found', error: error });
      }
      profile.education.unshift(newEdu);
      await profile.save();
      return res.json(profile);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'server error', error: error });
    }
  }
);

//  @route  DELETE api/profile/education/exp_id
//  @desc   delele education by id
//  @access Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user });
    const index = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    console.log(index);
    profile.education.splice(index, 1);
    await profile.save();
    return res.json(profile);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: 'server error' });
  }
});

//  @route  GET api/profile/github/:username
//  @desc   get repos from github
//  @access Public

router.get('/github/:username', (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientId'
      )}&client_secret=${config.get('githubSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    };

    request(options, (error, response, body) => {
      console.log(response);
      if (error) throw error;
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Github profile found' });
      }
      return res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    return res.status(500).send('server error');
  }
});

module.exports = router;
