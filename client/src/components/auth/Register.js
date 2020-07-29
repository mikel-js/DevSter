import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'

// redux process. yung sa baba pg pass did not match, ngsetAlert xa ng msg. from there nareceive sya ng actions/alert.js tpos pinasa sa reducer/alert.js. From reducer, marreceive sya ng component na Alert.js and ieexport sya sa App.js

// pag connect mo sa redux, mgging available na sya thru props gay ng sa register s baba

// const Register = (props) => {
const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const { name, email, password, password2 } = formData
  // e.tar
  const onDataChange = (e, attribute) => {
    setFormData({ ...formData, [attribute]: e.target.value })
  }
  const onDataSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger')
    } else {
      register({ name, email, password })
      //   const newUser = {
      //     name: name,
      //     email,
      //     password
      //   }
      //   try {
      //     const config = {
      //       headers: {
      //         'Content-Type': 'application/json'
      //       }
      //     }
      //     const body = JSON.stringify(newUser)
      //     const res = await Axios.post('/api/users', body, config)
      //     console.log(res.data)
      //   } catch (e) {
      //     console.log(e.response.data)
      //   }
      setAlert('Account Successfully Created!', 'success')
    }
  }

  if (isAuthenticated) {
    return <Redirect to='/dashboard' />
  }

  return (
    <div>
      <section className="container">
        <h1 className="large text-primary">Sign Up</h1>
        <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
        <form className="form" onSubmit={(e) => onDataSubmit(e)}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={(e) => onDataChange(e, "name")} />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onDataChange(e, "email")}
            />
            <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
          Gravatar email</small>
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              minLength="6"
              value={password}
              onChange={(e) => onDataChange(e, "password")}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              minLength="6"
              value={password2}
              onChange={(e) => onDataChange(e, "password2")}
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Register" />
        </form>
        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </section>
    </div>
  )
}

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, register })(Register)