const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')

// @route Post api/posts
// @desc create a post
// @access private
router.post('/', [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  try {
    const user = await User.findById(req.user.id).select('-password')
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    })
    const post = await newPost.save()

    res.json(post)
  } catch (e) {
    console.log(500).send('Server Error')
  }

})

// @route Get api/posts
// @desc Get all post
// @access private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})


// @route Get api/posts/:id
// @desc Get post by id
// @access private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id
    )
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (e) {
    console.error(e.message)
    if (e.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})


// @route Delete api/posts/:id
// @desc Delete post by id
// @access private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    // check user, convert post.user to string and req.user.id is the one that is logged in
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    await post.remove()
    res.json({ msg: "Post deleted" })
  } catch (e) {
    console.error(e.message)
    if (e.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

// @route PUT api/posts/:id
// @desc Like a post
// @access private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //  check if the post has been liked by the user
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg: 'Post already liked' })
    }
    post.likes.unshift({ user: req.user.id })
    await post.save()

    res.json(post.likes)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route PUT api/posts/unlike/:id
// @desc UnLike a post
// @access private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    //  check if the post has been liked by the user
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg: 'Post has not yet been liked' })
    }
    post.likes = post.likes.filter((like) => {
      return like.user.toString() !== req.user.id
    })

    await post.save()
    res.json(post.likes)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route Post api/posts/comment/:id
// @desc comment on a post
// @access private
router.post('/comment/:id', [auth, [
  check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    })
  }

  try {
    const user = await User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id)

    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    }
    post.comments.unshift(newComment)

    await post.save()
    res.json(post.comments)
  } catch (e) {
    console.error(e.message)
    res.status(500).send('Server Error')
  }
})

// @route Delete api/posts/comment/:id/:comment_id
// @desc Delete comment by id
// @access private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    const comment = await post.comments.find((comment) => {
      return comment.id === req.params.comment_id
    })

    if (!comment) {
      return res.status(400).json({ msg: 'Comment does not exist' })
    }
    // check user, if he own the post. req.user.id is the logged in user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }
    post.comments = post.comments.filter((com) => {
      return com._id.toString() !== comment.id
    })

    await post.save()
    res.json({ msg: "Comment deleted" })
  } catch (e) {
    console.error(e.message)
    if (e.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).send('Server Error')
  }
})

module.exports = router


// try {

// } catch (e) {
//   console.error(e.message)
// res.status(500).send('Server Error')
// }