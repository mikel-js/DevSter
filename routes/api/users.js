const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')


// @route Get api/users
// @desc register user
// @access Public
router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password should be 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { name, email, password } = req.body

  try {
    // See if user exists
    let user = await User.findOne({ email: email })
    if (user) {
      return res.status(400).json({
        errors: [{
          msg:
            'User already exists'
        }]
      })
    }
    // Get users gravatar size, rating, default
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    })
    user = new User({
      name: name,
      email,
      avatar,
      password
    })
    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt)
    await user.save()
    // Return jsonwebtoken to access protected route, so you can only edit your profile
    const payload = {
      user: {
        id: user.id
      }
    }
    jwt.sign(payload, config.get('jwtSecret'), {
      expiresIn: 360000
    }, (err, token) => {
      if (err) throw err;
      res.json({ token: token })
    })
  } catch (e) {
    console.log(e.message)
    res.status(500).send('Server error')
  }
})

module.exports = router