import React from 'react'
import { NavLink } from 'react-router-dom'

import Icon from './ui/Icon/Icon'
import {
 homePath, lostMessages, foundMessages,
} from '../utils/routes'

import '../styles/footer.css'

const Footer = () => (
  <div className="footer-wrapper">
    <div className="footer-logo">
      <img src="../src/assets/images/logo.svg" alt="Propets logo" />
    </div>
    <div className="footer-contacts">
      <div className="footer-contacts--socials">
        <Icon type="fab" name="facebook" />
        <Icon type="fab" name="instagram" />
      </div>
      <div className="footer-contacts--address">
        1600 Amphitheatre Pkwy Mountain View, CA 94043, USA
      </div>
    </div>
    <div className="footer-links">
      <ul>
        <li>
          <NavLink to={lostMessages} className="footer-activelink">
            <div className="footer-links--marker">
              <Icon type="fa" name="search" />
            </div>
            <div className="footer-links--text">
              Lost
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={homePath} className="footer-activelink">
            <div className="footer-links--marker">
              <Icon type="fa" name="hotel" />
            </div>
            <div className="footer-links--text">
              Hotels
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={foundMessages} className="footer-activelink">
            <div className="footer-links--marker">
              <Icon type="fa" name="paw" />
            </div>
            <div className="footer-links--text">
              Found
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={homePath} className="footer-activelink">
            <div className="footer-links--marker">
              <Icon type="fa" name="walking" />
            </div>
            <div className="footer-links--text">
              Walking
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={homePath} className="footer-activelink">
            <div className="footer-links--marker">
              <Icon type="fa" name="stethoscope" />
            </div>
            <div className="footer-links--text">
              VetHelp
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to={homePath} className="footer-activelink">
            <div className="footer-links--marker">
              <Icon type="fa" name="dog" />
            </div>
            <div className="footer-links--text">
              Fostering
            </div>
          </NavLink>
        </li>
      </ul>
    </div>
  </div>
  )


export default Footer
