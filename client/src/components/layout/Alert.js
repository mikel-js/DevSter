import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

// yung props.alerts galing sa baba, don sa mapStateToProps.
// const Alert = props.alerts => {
const Alert = ({ alerts }) => {
  return (
    <div>
      {
        alerts !== null && alerts.length > 0 && alerts.map(alert => (
          <div key={alert.id} className={`alert alert-${alert.alertType}`}>{alert.msg}
          </div>
        ))
      }
    </div>
  )
}

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
}

// we want to map the redux state(setAlert) so if there is a redux state, we can use it as props here.
// Also, in reducers/index.js we have alert, so it is the name of the state. that is why we use props.alert
const mapStateToProps = state => ({
  alerts: state.alert
})

export default connect(mapStateToProps)(Alert)
