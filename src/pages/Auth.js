/* eslint-disable react/prop-types */
import React, { useState } from 'react'

import { withRouter } from 'react-router-dom'

import RegistreForm from '../components/RegisterForm'
import LoginForm from '../components/LoginForm'
import LandingHeader from '../components/LandingHeader'

import '../styles/auth.css'
import Icon from '../components/ui/Icon/Icon'
import { rootPath } from '../utils/routes'

const Auth = (props) => {
  const [isRegistered, setIsRegistered] = useState(false)
  const loginHandleClick = () => {
    setIsRegistered(true)
  }

  const registerHandleClick = () => {
    setIsRegistered(false)
  }

  const onCancel = () => {
    const { history } = props
    history.push(rootPath)
  }

  return (
    <>
      <div className="auth-whitebg" />
      <div className="auth-wrapper">
        <div className="auth-window">
          <div className="auth-window-header">
            <div className="auth-window-logo">
              <img src="../src/assets/images/logo_green.svg" alt="ProPETS" />
            </div>
            <Icon type="fa" name="times" onClick={onCancel} />
          </div>
          <div className="auth-window-helper">Welcome! Please sign in / sign up to continue</div>
          <div className="form-control">
            <div
              className={isRegistered ? 'form-control-button-active' : 'form-control-button'}
              onClick={registerHandleClick}
              onKeyDown={registerHandleClick}
              role="button"
              tabIndex="0"
            >
              <div>sign up</div>
            </div>
            <div
              className={isRegistered ? 'form-control-button' : 'form-control-button-active'}
              onClick={loginHandleClick}
              onKeyDown={loginHandleClick}
              role="button"
              tabIndex="0"
            >
              <div>sign in</div>
            </div>
          </div>
          <div className="form-wrapper">
            {isRegistered ? <LoginForm /> : <RegistreForm />}
          </div>
        </div>
      </div>
      <LandingHeader />
      <div className="welcome-block">
        <div className="welcome-block--text">
          <div className="welcome-block--text--greeting">
            <p>Welcome to your</p>
            <p className="welcome-block--acent">pawfessional</p>
            <p>community</p>
          </div>
          <div className="welcome-block--text--btn">
            <div className="welcome-block--text--btnlost">
              <p>I lost my pet!</p>
              <img src="/images/search.svg" alt="" />
            </div>
            <div className="welcome-block--text--btnfound">
              <p>I found a pet!</p>
            </div>
          </div>
          <div className="welcome-block--text--join">
            I’m okay, just want to
            {' '}
            <span className="welcome-block--acent">JOIN</span>
            {' '}
            the pawsome
            community!
          </div>
        </div>
        <div className="welcome-block--image">
          <img src="/images/welcome_img.png" alt="" />
        </div>
      </div>
    </>

  )
}

export default withRouter(Auth)
