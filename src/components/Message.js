/* eslint-disable react/prop-types */
import React from 'react'
import { withRouter, Link } from 'react-router-dom'
import axios from 'axios'


import Image from './ui/Image/Image'


import convertTime from '../helpers/convertTime'

import '../styles/message.css'
import Icon from './ui/Icon/Icon'
import { MESSAGE_SERVER_PATH } from '../utils/externalPath'
import Modal from './ui/Modal/Modal'
import { profilePath } from '../utils/routes'

class Message extends React.Component {
  constructor(props) {
    super(props)
    const { post } = props
    this.state = {
      time: convertTime(post.postDate),
      post,
      isFavorite: false,
      isModalOpen: false,
      errorMessage: '',
      errorType: '',
      openControlMenu: false,
      activityView: false,
    }
  }

  componentDidMount() {
    const { activityFeed, post } = this.props
    if (activityFeed) {
      this.setState({
        activityView: true,
      })
    }
    const favoriteStatus = post.isFavorite
    this.setState({
      isFavorite: favoriteStatus,
    })
  }

  favoriteClick = () => {
    const { post, isFavorite } = this.state
    const { favoriteHandler } = this.props
    favoriteHandler(post)
    this.setState({
      isFavorite: !isFavorite,
    })
  }

  deleteClick = () => {
    const { post } = this.state
    const { deleteHandler } = this.props
    deleteHandler(post)
  }

  hideClick = () => {
    const { post } = this.state
    const { hideMessage } = this.props
    hideMessage(post.postId)
  }


  render() {
    const {
      post, time, isFavorite, isModalOpen, errorMessage, errorType, openControlMenu, activityView,
    } = this.state
    const {
      owner, text, postId, images,
    } = post
    const {
 hideMessage, deleteHandler, editHandler, detailHandler, favoriteHandler,
} = this.props
    return (
      <div className="message">
        <div className="post-owner">
          <Link to={{
          pathname: `${profilePath}`,
          userEmail: owner.email,
        }}>
            <Image
              src={owner.avatar !== '' ? owner.avatar : 'https://www.gravatar.com/avatar/0?d=mp'}
              alt={owner.name}
              className="post-owner-avatar"
            />
          </Link>
        </div>
        <div className="post-content">
          <div className="post-owner-name">{owner.name}</div>
          <div className="post-date">{time}</div>
          <div className="post-images">
            {(images.length !== 0 && images[0].includes('propets')) && (
              <div className="feed-postimage-container">
                <img src={images[0]} alt="" className="postimage" />
              </div>
          )}
          </div>
          <div className="post-text">
            {text.length >= 250 ? (text.substring(0, 250)) : text}
            {text.length >= 250 && <span className="post-more-link"><Link to={`/messages/${postId}`}> ... more</Link></span>}
          </div>
        </div>
        <div className="post-control">
          <div className="post-visibility">
            {!openControlMenu ? (
              <Icon
                type="fas"
                name="ellipsis-h"
                className="searchmsg-icon-control"
                onClick={() => this.setState({ openControlMenu: true })}
              />
          ) : (
            <div className="post-visibility-items">
              <Icon
                type="fa"
                name="times"
                className="icon-control-invert-btn"
                onClick={() => this.setState({ openControlMenu: false })}
              />
              {activityView ? (
                <>
                  <div className="post-visibility-item">
                    <div className="icon-control-invert">
                      <Icon
                        type="fas"
                        name="pencil-alt"
                        className="icon-control-invert"
                        // onClick={editHandler(post)}
                      />
                    </div>
                    Edit
                  </div>
                  <div className="post-visibility-item">
                    <div className="icon-control-invert">
                      <Icon
                        type="fas"
                        name="trash-alt"
                        className="icon-control-invert"
                        onClick={this.deleteClick}
                      />
                    </div>
                    Delete
                  </div>
                </>
              ) : (
                <>
                  <div className="post-visibility-item">
                    <div className="icon-control-invert">
                      <Icon
                        type="far"
                        name="eye-slash"
                        className="icon-control-invert"
                        onClick={this.hideClick}
                      />
                    </div>
                    Hide from feed
                  </div>
                  {/* <div className="post-visibility-item">
                    <div className="icon-control-invert">
                      <Icon
                        type="fa"
                        name="times"
                        className="icon-control-invert"
                        onClick={() => unfollowUser(postId)}
                      />
                    </div>
                    Unfollow
                  </div> */}
                </>
                )}
            </div>
          )}
          </div>
          {isFavorite
          ? (
            <Icon
              type="fa"
              name="star"
              className="icon-control "
              onClick={this.favoriteClick}
            />
)
          : (
            <Icon
              type="far"
              name="star"
              className="icon-control"
              onClick={this.favoriteClick}
            />
) }
        </div>
      </div>
    )
  }
}


export default withRouter(Message)