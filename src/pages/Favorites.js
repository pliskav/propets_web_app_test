import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'


import {
 DEFAULT_PAGE, DEFAULT_ITEMS_ON_PAGE,
} from '../utils/requestConst'
import { MESSAGE_SERVER_PATH } from '../utils/externalPath'
import Message from '../components/Message'
import Loader from '../components/ui/Loader/Loader'
import Modal from '../components/ui/Modal/Modal'

export default class Favorites extends Component {
constructor(props) {
  super(props)

  this.state = {
    msg: [],
    hasMore: true,
    currentPage: DEFAULT_PAGE,
    count: DEFAULT_ITEMS_ON_PAGE,
    loading: true,
    isModalOpen: false,
    errorType: '',
    errorMessage: '',
  }
}

componentDidMount() {
    const { count, msg } = this.state
    let { currentPage } = this.state
    const xUser = localStorage.getItem('X-User')
    const url = `${MESSAGE_SERVER_PATH}/favorites/${xUser}?current_page=${currentPage}&items_on_page=${count}`
    const request = axios({
      method: 'get',
      url,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
    });
    request
      .then((response) => {
        localStorage.removeItem('X-Authorization')
          const newToken = response.headers['x-authorization']
          localStorage.setItem('X-Authorization', newToken)
          return response.data
      })
      .then((data) => {
        const msgLoaded = [...data.posts];
        this.setState({
          msg: [...msg, ...msgLoaded],
          loading: false,
          currentPage: currentPage += 1,
        });
      })
      .catch((error) => {
        const { status, message, error: err } = error.response.data;
        this.setState({
          isModalOpen: true,
          errorMessage: message,
          errorType: `${status}: ${err}`,
          loading: false,
        });
      });
}

fetchMore = () => {
  const { count, msg } = this.state
  let { currentPage } = this.state
  const xUser = localStorage.getItem('X-User')
  const url = `${MESSAGE_SERVER_PATH}/favorites/${xUser}?current_page=${currentPage}&items_on_page=${count}`
  const request = axios({
    method: 'get',
    url,
    data: null,
    headers: {
      'X-Authorization': localStorage.getItem('X-Authorization'),
    },
  });
  request
    .then((response) => {
      localStorage.removeItem('X-Authorization')
        const newToken = response.headers['x-authorization']
        localStorage.setItem('X-Authorization', newToken)
        return response.data
    })
    .then((data) => {
      const msgLoaded = [...data.posts];
      if (msgLoaded.length === 0) {
        this.setState({
          hasMore: false,
        })
      }
      this.setState({
        msg: [...msg, ...msgLoaded],
        loading: false,
        currentPage: currentPage += 1,
      });
    })
    .catch((error) => {
      const { status, message, error: err } = error.response.data;
      this.setState({
        isModalOpen: true,
        errorMessage: message,
        errorType: `${status}: ${err}`,
        loading: false,
      });
    });
}

  render() {
    const {
 hasMore, msg, loading, isModalOpen, errorMessage, errorType,
} = this.state
    return (
      <>
        {isModalOpen && (
        <Modal
          title={errorType}
          onCancel={this.modalCancelHandler}
          isOpen={isModalOpen}
          onSubmit={this.modalCancelHandler}
        >
          <div className="modalErrorText">{errorMessage}</div>
        </Modal>
            )}
        <div className="content-container">
          { loading ? (<Loader />)
            : (
              <>
                <div className="title-text">Your favorites. Find them here anytime.</div>
                {
                msg.length === 0
                  ? (<div>You don&apos;t have any favorites</div>)
                  : (
                    <InfiniteScroll
                      dataLength={msg.length}
                      next={this.fetchMore}
                      loader={<h4>Loading...</h4>}
                      hasMore={hasMore}
                      endMessage={<p>You have seen it all</p>}
                    >
                      {
          msg.map((message) => (
            <Message
              key={message.postId}
              owner={message.owner.email}
              avatar={message.owner.avatar}
              date={message.postDate}
              text={message.text}
              postid={message.postId}
              name={message.owner.name}
              favs={message.favorites}
              images={message.images}
            />
          ))
        }
                    </InfiniteScroll>
                  )
              }
              </>
            )}
        </div>
      </>
      )
  }
}
