/* eslint-disable react/prop-types */
import React from 'react'
import { withRouter } from 'react-router-dom'


import '../styles/rightsidebar.css'
import { lostMessages, foundMessages } from '../utils/routes'

const RightSideBar = (props) => {
  const { location } = props
  const path = location.pathname

  return (
    <div className={(path === lostMessages || path === foundMessages) ? 'rightside-search-wrapper' : 'rightside-wrapper'}>
      RightBar
    </div>
  )
}

export default withRouter(RightSideBar)
