/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';


import { withRouter, Link } from 'react-router-dom';
import SearchMessageDetails from './SearchMessageDetails';
import Icon from './ui/Icon/Icon';
import Image from './ui/Image/Image';

import convertTime from '../helpers/convertTime';

import '../styles/searchMessage.css';
import Button from './ui/Button/Button';
import { SEARCH_SERVER_PATH } from '../utils/externalPath';
import Modal from './ui/Modal/Modal';

const SearchMessage = (props) => {
  const {
 post, lfpostId, deleteHandler, activityFeed, editHandler,
} = props;
  const {
    type,
    sex,
    breed,
    color,
    height,
    distFeatures,
    description,
    images,
    location,
    contacts,
    owner,
    isActive,
    startTimePost,
  } = post;

  const [showFullMessage, setShowFullMessage] = useState(false);
  const [openOwnerMenu, setOpenOwnerMenu] = useState(false);
  const [isActivePost, setIsActivePost] = useState(isActive);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [errorType, setErrorType] = useState('')
  const [showActiveInfo, setShowActiveInfo] = useState(false)

  useEffect(() => {
    if (activityFeed && !isActivePost) {
      setShowActiveInfo(true)
    }
  }, [])

  const time = convertTime(startTimePost);

  const date = new Date(Date.parse(startTimePost))

  const moreHandler = () => {
    setShowFullMessage(true);
    const { history } = props;
    history.push({
      pathname: `/search/${lfpostId}`,
      state: { post, showEditView: false },
    });
  };

  const modalCancelHandler = () => {
    setIsModalOpen(false)
  };

  const activeStatusHandler = (postid) => {
    console.log(activityFeed)
    console.log(isActive)
    console.log(activityFeed && !isActive)
    const url = `${SEARCH_SERVER_PATH}/${postid}/state`;
    const request = axios({
      method: 'put',
      url,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
    });
    request
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem('X-Authorization')
          const newToken = response.headers['x-authorization']
          localStorage.setItem('X-Authorization', newToken)
          const activeState = isActivePost
          setIsActivePost(!activeState)
          setShowActiveInfo(false)
          setOpenOwnerMenu(false)
        }
      })
      .catch((error) => {
        const { status, message, error: err } = error.response.data;
          setIsModalOpen(true)
          setErrorMessage(message)
          setErrorType(`${status}: ${err}`)
      });
  };

  return (
    <>
      {isModalOpen && (
      <Modal
        title={errorType}
        onCancel={modalCancelHandler}
        isOpen={isModalOpen}
        onSubmit={modalCancelHandler}
      >
        <div className="modalErrorText">{errorMessage}</div>
      </Modal>
        )}
      {showActiveInfo
      && (
      <div className="nonactive-post">
        The post was deactivated on
        {` ${date.getDate()} ${date.toLocaleString('en', { month: 'short' })}, ${date.getFullYear()} `}
        Click
        <span
          role="button"
          className="activity-reactivate"
          onClick={() => activeStatusHandler(lfpostId)}
          onKeyDown={() => activeStatusHandler(lfpostId)}
          tabIndex="0"
        >
          &nbsp;here&nbsp;
        </span>
        to re-activate it.
      </div>
) }
      <div className="searchmsg-wrapper">
        {!isActivePost && (
        <div className="searchmsg-inactive-cover">
          {!activityFeed && <div className="searchmsg-info">This post was deactivated</div>}
        </div>
)}
        {post.owner.email === localStorage.getItem('X-User') && (
        <div className="searchmsg-control">
          {!openOwnerMenu ? (
            <Icon
              type="fas"
              name="ellipsis-h"
              className="searchmsg-icon-control"
              onClick={() => setOpenOwnerMenu(true)}
            />
          ) : (
            <div className="searchmsg-owner-control">
              <Icon
                type="fa"
                name="times"
                className="searchmsg-icon-control-invert-btn"
                onClick={() => setOpenOwnerMenu(false)}
              />
              <div className="searchmsg-owner-control-item">
                <div className="searchmsg-icon-control-invert">
                  <Icon
                    type="fas"
                    name="pencil-alt"
                    onClick={() => editHandler(post)}
                  />
                </div>
                Edit
              </div>
              {!activityFeed && (
                <div className="searchmsg-owner-control-item">
                  <div className="searchmsg-icon-control-invert">
                    <Icon
                      type="fas"
                      name="eye-slash"
                      onClick={() => activeStatusHandler(lfpostId)}
                    />
                  </div>
                  {isActive ? 'Deactivate' : 'Activate'}
                </div>
              )}
              <div className="searchmsg-owner-control-item">
                <div className="searchmsg-icon-control-invert">
                  <Icon
                    type="fas"
                    name="trash-alt"
                    onClick={() => deleteHandler(lfpostId)}
                  />
                </div>
                Delete
              </div>
            </div>
          )}
        </div>
      )}
        <div className="searchmsg">
          {images.length > 0 && images[0].includes('http') && (
          <div className="searchmsg-imagecontainer">
            <div className="searchmsg-image">
              <img src={images[0]} alt="" />
            </div>
          </div>
        )}
          <div className="searchmsg-content">
            <div className="searchmsg-title">
              {`${type}, ${
              breed.toLowerCase() === '' || breed.toLowerCase() === 'unknown'
                ? 'unknown breed'
                : breed
            }`}
            </div>
            <div className="searchmsg-features">
              <div className="searchmsg-data">
                <div className="searchmsg-data-row">
                  <span className="searchmsg-datatype">Color: </span>
                  {color}
                </div>
                <div className="searchmsg-data-row">
                  <span className="searchmsg-datatype">Sex: </span>
                  {sex}
                </div>
                <div className="searchmsg-data-row">
                  <span className="searchmsg-datatype">Height: </span>
                  {height}
                </div>
              </div>
              <div className="searchmsg-disfeatures">
                <span className="searchmsg-datatype">Distinctive features: </span>
                {distFeatures.length > 0 ? distFeatures : 'not mentioned'}
              </div>
            </div>
            <div className="searchmsg-desc">
              <span className="searchmsg-datatype">Desciption: </span>
              {description.length > 0 ? description : 'not mentioned'}
            </div>
            <div className="searchmsg-footer">
              <div className="searchmsg-geo">
                <div className="geo-marker">
                  <Icon
                    type="fa"
                    name="map-marker"
                    className="searchmsg-geo-icon"
                  />
                </div>
                <div className="geo-address">Florentin, 27, Tel Aviv</div>
              </div>
              <div className="searchmsg-owner">
                <div className="searchmsg-owner-info">
                  <div className="seachmsg-avatar-container">
                    <div className="searchmsg-owner-avatar">
                      <Image
                        src={
                        (owner.avatar !== null && owner.avatar.includes('http'))
                          ? owner.avatar
                          : 'https://www.gravatar.com/avatar/0?d=mp'
                      }
                        alt={owner.name}
                        className="post-owner-avatar"
                      />
                    </div>
                  </div>
                  <div className="searchmsg-owner-data">
                    <div className="searchmsg-owner-name">{owner.name}</div>
                    <div className="searchmsg-date">{time}</div>
                  </div>
                </div>
                <div className="searchmsg-owner-socials">
                  <Icon
                    type="fa"
                    name="phone-square-alt"
                    size="7x"
                    className="msg-owner-icons-tooltip"
                  >
                    {contacts.phone !== '' && (
                    <span className="tooltiptext">{contacts.phone}</span>
                  )}
                  </Icon>
                  <Icon
                    type="fa"
                    name="envelope-square"
                    size="7x"
                    className="msg-owner-icons-tooltip"
                  >
                    {contacts.email !== '' && (
                    <span className="tooltiptext">{contacts.email}</span>
                  )}
                  </Icon>
                  {images.length > 1 && images[0].includes('http') && (
                  <div className="more-btn">
                    <Button onClick={moreHandler}>more</Button>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

SearchMessage.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  post: PropTypes.object.isRequired,
  lfpostId: PropTypes.string.isRequired,
};

export default withRouter(SearchMessage);
