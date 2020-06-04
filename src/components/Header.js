/* eslint-disable react/prop-types */
import React from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import {
 rootPath, newPostPath, favoritesPath, lostMessages, foundMessages,
} from '../utils/routes'
import '../styles/header.css'
import Button from './ui/Button/Button'
import Icon from './ui/Icon/Icon'

const Header = (props) => {
  const { location } = props
  const path = location.pathname
  return (
    <div className="header">
      <div className="header--logo">
        <NavLink to={rootPath} exact>
          <img src="../src/assets/images/logo_green.svg" alt="ProPETS logo" />
        </NavLink>
      </div>
      <div className="header--button">
        {(path === rootPath || path === favoritesPath) && (
        <NavLink to={newPostPath} exact className="header-activelink">
          <Button>
            <Icon type="fa" name="plus" />
            <div className="button-innertext">Add new</div>
          </Button>
        </NavLink>
)}
        {(path === lostMessages || path === foundMessages) && (
        <div className="header-button-container">
          <NavLink to={newPostPath} exact className="header-activelink">
            <Button className="header-searchbutton">
              <Icon type="fa" name="search" />
              <div className="button-innertext">I lost my pet</div>
            </Button>
          </NavLink>
          <NavLink to={newPostPath} exact className="header-activelink">
            <Button>
              <Icon type="fa" name="paw" />
              <div className="button-innertext">I found a pet</div>
            </Button>
          </NavLink>
        </div>
)}
      </div>
    </div>
)
  }


export default withRouter(Header)
