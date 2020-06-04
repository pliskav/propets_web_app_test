import React from 'react'
import { NavLink } from 'react-router-dom'
import { rootPath, homePath, authPath } from '../utils/routes'
import '../styles/landing.css'

const LandingHeader = () => (
  <div className="landing-header">
    <div className="landing-header--logo">
      <NavLink to={(rootPath, homePath)} exact>
        <img src="../src/assets/images/logo.svg" alt="ProPETS logo" />
      </NavLink>
    </div>
    <div className="landing-header--button">
      <NavLink to={authPath} exact className="header-activelink">
        <div className="landing-header--btntxt">Sign</div>
      </NavLink>
    </div>
  </div>
  )


export default LandingHeader
