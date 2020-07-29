const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcrypt')
const { check, validationResult } = require('express-validator')
const User = require('../../models/User')

// login user, to authenticate and get the webtoken back
// ipassword so yung mgrereturn e wla n password
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server error')
  }
})

// @route Get api/auth
// @desc authenticate user
// @access Public
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { email, password } = req.body

  try {
    // See if user exists
    let user = await User.findOne({ email: email })
    if (!user) {
      return res.status(400).json({
        errors: [{
          msg:
            'Invalid credentials'
        }]
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        errors: [{
          msg:
            'Invalid credentials'
        }]
      })
    }

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