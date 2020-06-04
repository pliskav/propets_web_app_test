import React from 'react'
import { NavLink } from 'react-router-dom'

import {
 favoritesPath,
 lostMessages,
 foundMessages,
 rootPath,
} from '../utils/routes'
import User from './User'

import '../styles/navbar.css'
import Icon from './ui/Icon/Icon'

const Navbar = () => {
  const logoutHandler = () => {
    localStorage.removeItem('X-Authorization')
    localStorage.removeItem('X-User')
  }
  return (
    <div className="sidebar-wrapper">
      <div className="navigation">
        <NavLink to={rootPath} exact className="nav-item" activeClassName="nav-item-active">
          <div className="item-content">
            <Icon type="fa" name="home" />
            <div className="navitem-innertext">Home</div>
          </div>
        </NavLink>
        <NavLink to={lostMessages} className="nav-item" activeClassName="nav-item-active">
          <div className="item-content">
            <Icon type="fa" name="search" />
            <div className="navitem-innertext">Lost</div>
          </div>

        </NavLink>
        <NavLink to={foundMessages} className="nav-item" activeClassName="nav-item-active">
          <div className="item-content">
            <Icon type="fa" name="paw" />
            <div className="navitem-innertext">Found</div>
          </div>

        </NavLink>
        <NavLink to={favoritesPath} className="nav-item" activeClassName="nav-item-active">
          <div className="item-content">
            <Icon type="fa" name="star" />
            <div className="navitem-innertext">Favorites</div>
          </div>

        </NavLink>
      </div>

      <div className="navigation-logout">
        <User />
        <div className="logout-wrapper">
          <NavLink to={rootPath} className="logout-item">
            <Icon type="fa" name="sign-out-alt" />
            <div className="navitem-innertext" onClick={logoutHandler} onKeyDown={logoutHandler} role="button" tabIndex="0">Logout</div>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Navbar