import React from 'react'
import { NavLink } from 'react-router-dom'

import Icon from './ui/Icon/Icon'
import { authPath } from '../utils/routes'

const LandingFooter = () => (
  <div className="landing-footer-wrapper">
    <div className="landing-footer-logo">
      <img src="../src/assets/images/logo.svg" alt="Propets logo" />
    </div>
    <div className="landing-footer-contacts">
      <div className="landing-footer-contacts--socials">
        <Icon type="fab" name="facebook" />
        <Icon type="fab" name="instagram" />
      </div>
      <div className="landing-footer-contacts--address">
        1600 Amphitheatre Pkwy Mountain View, CA 94043, USA
      </div>
    </div>
    <div className="landing-footer-links">
      <ul>
        <li>
          <NavLink to={authPath} className="footer-activelink">
            <div className="landing-footer-links--marker">
              <Icon type="fa" name="search" />
            </div>
            <div className="landing-footer-links--text">
              Lost
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={authPath} className="footer-activelink">
            <div className="landing-footer-links--marker">
              <Icon type="fa" name="hotel" />
            </div>
            <div className="landing-footer-links--text">
              Hotels
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={authPath} className="footer-activelink">
            <div className="landing-footer-links--marker">
              <Icon type="fa" name="paw" />
            </div>
            <div className="landing-footer-links--text">
              Found
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={authPath} className="footer-activelink">
            <div className="landing-footer-links--marker">
              <Icon type="fa" name="walking" />
            </div>
            <div className="landing-footer-links--text">
              Walking
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={authPath} className="footer-activelink">
            <div className="landing-footer-links--marker">
              <Icon type="fa" name="stethoscope" />
            </div>
            <div className="landing-footer-links--text">
              VetHelp
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={authPath} className="footer-activelink">
            <div className="landing-footer-links--marker">
              <Icon type="fa" name="dog" />
            </div>
            <div className="landing-footer-links--text">
              Fostering
            </div>
          </NavLink>
        </li>
      </ul>
    </div>
  </div>
  )


export default LandingFooter
