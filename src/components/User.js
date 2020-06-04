/* eslint-disable react/prop-types */
import React from 'react'
import axios from 'axios'
import { withRouter, NavLink, Link } from 'react-router-dom'
import { ACCOUNT_SERVER_PATH } from '../utils/externalPath'
import Image from './ui/Image/Image'

import '../styles/info.css'
import '../styles/navbar.css'
import { profilePath } from '../utils/routes'

class User extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      user: {},
    }
  }

  componentDidMount() {
    const xUser = localStorage.getItem('X-User')
    const header = {
      'X-Authorization': localStorage.getItem('X-Authorization'),
    }
    const url = `${ACCOUNT_SERVER_PATH}/${xUser}`
    try {
      axios({
        method: 'post',
        url,
        headers: header,
      })
      .then((response) => response.data)
      .then((data) => {
        this.setState({
          user: data,
          loaded: true,
        })
      })
    } catch (error) {
      console.log(error)
    }
  }

  handleClick = () => {
    const { history } = this.props;
    history.push(`${profilePath}`)
  }

  updateUser = (name, avatar) => {
    const { user } = this.state
    this.setState({
      user: { ...user, name, avatar },
    })
  }

  render() {
    const { user, loaded } = this.state
    return loaded && (
      <NavLink
        to={{
          pathname: `${profilePath}`,
          userEmail: user.email,
          updateInfo: this.updateUser,
        }}
        className="nav-item"
        activeClassName="nav-item-active"
      >
        <div className="info-wrapper">
          <div className="info-container">
            <div className="info-avatar">
              <Image src={user.avatar !== '' ? user.avatar : 'https://www.gravatar.com/avatar/0?d=mp'} />
            </div>
            <div
              className="info-name"
            >
              {user.name}
            </div>
          </div>
        </div>
      </NavLink>
      )
  }
}

export default User