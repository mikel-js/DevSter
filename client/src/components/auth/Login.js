import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'


const Login = (props) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',

  })

  const { email, password } = formData
  // e.tar
  const onDataChange = (e, attribute) => {
    setFormData({ ...formData, [attribute]: e.target.value })
  }
  const onDataSubmit = async (e) => {
    e.preventDefault()
    props.login(email, password)
  }
  if (props.isAuthenticated) {
    return <Redirect to='/dashboard' />
  }
  return (
    <div>
      <section className="container">
        <h1 className="large text-primary">Sign In</h1>
        <form className="form" onSubmit={(e) => onDataSubmit(e)}>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onDataChange(e, "email")}
            />
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
          <input type="submit" className="btn btn-primary" value="Sign In" />
        </form>
      </section>
      <p className="my-1">
        Don't have an account? <Link to="/register">Register Here</Link>
      </p>
    </div>
  )
}

// ung props.login s function
Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

// login on props to access login state. login below is the imported file
export default connect(mapStateToProps, { login })(Login)