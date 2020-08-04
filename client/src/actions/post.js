import axios from 'axios'
import { setAlert } from './alert'
import {
  GET_POSTS, GET_POST, POST_ERROR, UPDATE_LIKES, DELETE_POST, ADD_POST, ADD_COMMENT,
  REMOVE_COMMENT
} from './types'

// GET posts
export const getPosts = () => async dispatch => {
  try {
    const res = await axios.get('/api/posts',)

    dispatch({
      type: GET_POSTS,
      payload: res.data
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.data.msg, status: e.response.status }
    })
  }
}

//Get post by id
export const getPost = (id) => async dispatch => {

  try {
    const res = await axios.get(`/api/posts/${id}`,)

    dispatch({
      type: GET_POST,
      payload: res.data
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.data.msg, status: e.response.status }
    })
  }
}

// ADD post
export const addPost = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const res = await axios.post('/api/posts', formData, config)

    dispatch({
      type: ADD_POST,
      payload: res.data
    })
    dispatch(setAlert('Post Added', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Delete post
export const deletePost = (id) => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`,)

    dispatch({
      type: DELETE_POST,
      payload: id
    })
    dispatch(setAlert('Post Removed', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}


// Add like
export const addLike = (id) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`,)

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.data.msg, status: e.response.status }
    })
  }
}


// Remove Like
export const removeLike = (id) => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`,)

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    })
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.data.msg, status: e.response.status }
    })
  }
}

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  try {
    const res = await axios.post(`/api/posts/comment/${postId}`, formData, config)

    dispatch({
      type: ADD_COMMENT,
      payload: res.data
    })
    dispatch(setAlert('Comment Added', 'success'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {

  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`)

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId
    })
    dispatch(setAlert('Comment Removed', 'danger'))
  } catch (e) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status }
    })
  }
}