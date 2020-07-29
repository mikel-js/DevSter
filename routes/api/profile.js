const express = require('express')
const axios = require('axios');
const router = express.Router()
const config = require('config')
const request = require('request')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')


router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }
    res.json(profile)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server error')
  }
})

// @route Get api/profile
// @desc Create or update user profile
// @access Private
router.post('/', [auth, [
  check('status', 'Status is required').not().isEmpty(),
  check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const {
    company,
    location,
    website,
    bio,
    skills,
    status,
    githubusername,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook
  } = req.body
  //  Build profile object
  const profileFields = {}
  profileFields.user = req.user.id
  if (company) profileFields.company = company
  if (website) profileFields.website = website
  if (location) profileFields.location = location
  if (bio) profileFields.bio = bio
  if (status) profileFields.status = status
  if (githubusername) profileFields.githubusername = githubusername
  if (skills) {
    profileFields.skills = skills.split(',').map(skill => skill.trim())
  }
  // Build social object
  profileFields.social = {}
  if (youtube) profileFields.social.youtube = youtube
  if (twitter) profileFields.social.twitter = twitter
  if (facebook) profileFields.social.facebook = facebook
  if (linkedin) profileFields.social.linkedin = linkedin
  if (instagram) profileFields.social.instagram = instagram

  try {
    let profile = await Profile.findOne({ user: req.user.id })

    if (profile) {
      // update
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      )
      return res.json(profile)
    }
    // create
    profile = new Profile(profileFields)

    await profile.save()
    res.json(profile)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route Get api/profile
// @desc Get all profile
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route Get api/profile
// @desc Get all profile
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    res.json(profiles)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route Get api/profile/user/:user_id
// @desc Get profile by userid
// @access Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).json({ msg: 'User not found' })
    }
    res.json(profile)
  } catch (e) {
    console.error(e.message)
    // the id is valid but user not found
    if (e.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'User not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route Delete api/profile
// @desc Delete profile, user and posts
// @access private
router.delete('/', auth, async (req, res) => {
  try {
    // Remove user posts
    await Post.deleteMany({ user: req.user.id })

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id })
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id })
    res.json({ msg: 'User deleted' })
  } catch (e) {
    console.error(e.message)
    // the id is valid but user not found
    if (e.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'User not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route post api/profile/experience
// @desc add experience
// @access private
router.put('/experience', [auth, [
  check('title', 'Title is required').not().isEmpty(),
  check('company', 'Company is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body

  const newExp = {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    // unshift is like push, but add on the beginning
    profile.experience.unshift(newExp)
    await profile.save()
    res.json(profile)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route Delete api/profile/experience/:exp_id
// @desc Delete experience
// @access private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    profile.experience = profile.experience.filter((exp) => {
      return exp._id.toString() !== req.params.exp_id
    })
    await profile.save()
    return res.status(200).json(profile);
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route post api/profile/education
// @desc add education
// @access private
router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of study is required').not().isEmpty(),
  check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body

  const newEdu = {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  }
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    // unshift is like push, but add on the beginning
    profile.education.unshift(newEdu)
    await profile.save()
    res.json(profile)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route Delete api/profile/education/:edu_id
// @desc Delete education
// @access private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    profile.education = profile.education.filter((edu) => {
      return edu._id.toString() !== req.params.edu_id
    })

    await profile.save()
    return res.status(200).json(profile);

  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route Get api/profile/github/:username
// @desc get user repos from github
// @access public

router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${config.get('githubToken')}`
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: 'No Github profile found' });
  }
});
module.exports = router