/* eslint-disable react/prop-types */
import React, { Component } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { withRouter } from 'react-router-dom'
import axios from 'axios'

import { MESSAGE_SERVER_PATH, ACCOUNT_SERVER_PATH } from '../utils/externalPath'
import { DEFAULT_PAGE, DEFAULT_ITEMS_ON_PAGE } from '../utils/requestConst'

import Message from '../components/Message'
import Loader from '../components/ui/Loader/Loader'
import LoaderSmall from '../components/ui/Loader/LoaderSmall'
import Modal from '../components/ui/Modal/Modal'
import { authPath } from '../utils/routes'

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasMore: true,
      currentPage: DEFAULT_PAGE,
      count: DEFAULT_ITEMS_ON_PAGE,
      msg: [],
      postEdit: {},
      openEditMsg: false,
      loading: true,
      isModalOpen: false,
      errorMessage: '',
      errorType: '',
    }
  }

  componentDidMount() {
    const { count, msg } = this.state
    let { currentPage } = this.state
    const url = `${MESSAGE_SERVER_PATH}?current_page=${currentPage}&items_on_page=${count}`;
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
    const url = `${MESSAGE_SERVER_PATH}?current_page=${currentPage}&items_on_page=${count}`;
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
        console.log('fetching more request', response.status)
        console.log('existing msg array', msg)
        localStorage.removeItem('X-Authorization')
          const newToken = response.headers['x-authorization']
          localStorage.setItem('X-Authorization', newToken)
          return response.data
      })
      .then((data) => {
        console.log(msg)
        const msgLoaded = [...data.posts];
        console.log(msgLoaded)
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

modalCancelHandler = () => {
  console.log('cancel action')
  this.setState({
    isModalOpen: false,
  })
}

hideHandle = (postid) => {
  const { msg } = this.state
  const email = localStorage.getItem('X-User')
    const url = `${MESSAGE_SERVER_PATH}/${postid}/hide/${email}`;
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
        let newMsg = []
        console.log('hide request', response.status)
        if (response.status === 200) {
          localStorage.removeItem('X-Authorization')
          const newToken = response.headers['x-authorization']
          localStorage.setItem('X-Authorization', newToken)
          newMsg = msg.filter((item) => item.postId !== postid)
          console.log('filtered msg array after hide', newMsg)
          this.setState({
            msg: [...newMsg],
          })
        }
        return newMsg
})
.then((newMsg) => {
  console.log('exisiting msg array length before fetching one msg', msg.length)
  const urlFetchMsg = `${MESSAGE_SERVER_PATH}?current_page=${msg.length}&items_on_page=1`;
  const requestForFetcingMsg = axios({
    method: 'get',
    url: urlFetchMsg,
    data: null,
    headers: {
      'X-Authorization': localStorage.getItem('X-Authorization'),
    },
  });
  requestForFetcingMsg
    .then((response) => {
      console.log('fetch one msg', response.status)
      localStorage.removeItem('X-Authorization')
        const newToken = response.headers['x-authorization']
        localStorage.setItem('X-Authorization', newToken)
        return response.data
    })
    .then((data) => {
      const msgLoaded = [...data.posts];
      console.log('one message data', msgLoaded)
      if (msgLoaded.length === 0) {
        this.setState({
          hasMore: false,
        })
      }
      this.setState({
        msg: [...newMsg, ...msgLoaded],
        loading: false,
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

deleteHandler = (postid) => {
  const { msg } = this.state
  const url = `${MESSAGE_SERVER_PATH}/${postid}`;
  const request = axios({
    method: 'delete',
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
        console.log(response.headers['x-authorization'])
        localStorage.setItem('X-Authorization', newToken)
        const newPosts = msg.filter((item) => item.postId !== postid)
        this.setState({
          msg: [...newPosts],
        })
      }
})
.then(() => {
    const urlFetchMsg = `${MESSAGE_SERVER_PATH}?current_page=${msg.length}&items_on_page=${1}`;
    const requestForFetcingMsg = axios({
      method: 'get',
      url: urlFetchMsg,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
    });
    requestForFetcingMsg
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
};

favoriteHandler = (post) => {
  const { msg } = this.state

  let workingPost = msg.find((it) => it.postId === post.postId)
  const { isFavorite } = workingPost
  const workingPostIndex = msg.findIndex((it) => it.postId === post.postId)

  const user = localStorage.getItem('X-User')
  const requestUrl = `${MESSAGE_SERVER_PATH}/${post.postId}/favorite/${user}`
  const method = isFavorite ? 'delete' : 'put'
  const request = axios({
    method,
    url: requestUrl,
    data: null,
    headers: {
      'X-Authorization': localStorage.getItem('X-Authorization'),
      },
    })
    request.then((response) => {
        if (response.status === 200) {
          workingPost = { ...workingPost, isFavorite: !isFavorite }
          const newMsgArr = [...msg.slice(0, workingPostIndex), workingPost, ...msg.slice(workingPostIndex + 1)]
        this.setState({
          msg: [...newMsgArr],
        })
}
      })
      .catch((error) => {
        const { status, message, error: err } = (error.response.data)
        this.setState({
          isModalOpen: true,
          errorMessage: message,
          errorType: `${status}: ${err}`,
        })
    })
}

editHandler = (post) => {
  const { history } = this.props
    history.push({
      pathname: `/messages/${post.postId}`,
      state: { post },
      showEditView: true,
  });
}

detailHandler = (post) => {
  const { history } = this.props
  // eslint-disable-next-line react/prop-types
  history.push({
    pathname: `/messages/${post.postId}`,
    state: { post },
  });
}


modalSubmitHandler = () => {
  const { history } = this.props
  this.setState({
    isModalOpen: false,
    loading: false,
  })
    localStorage.removeItem('X-Authorization')
    localStorage.removeItem('X-User')

    history.push({
      pathname: authPath,
    });
}

  render() {
    const {
 msg, hasMore, loading, isModalOpen, errorMessage, errorType,
} = this.state
console.log('rerender, msg array length', msg.length)
console.log('rerender of msg array', msg)
    return (
      <>
        {isModalOpen && (
        <Modal
          title={errorType}
          onCancel={this.modalCancelHandler}
          isOpen={isModalOpen}
          onSubmit={this.modalSubmitHandler}
        >
          <div className="modalErrorText">{errorMessage}</div>
        </Modal>
            )}
        <div className="content-container">
          { loading ? (<Loader />) : (
            <InfiniteScroll
              dataLength={msg.length}
              next={this.fetchMore}
              hasMore={hasMore}
              loader={<LoaderSmall />}
              endMessage={<p>You have seen it all</p>}
              className="scroll-container"
            >
              {
          msg.map((message) => (
            <div className="msg-outer-container" key={message.postId}>
              <Message
                post={message}
                hideMessage={this.hideHandle}
                editHandler={this.editHandler}
                deleteHandler={this.deleteHandler}
                favoriteHandler={this.favoriteHandler}
                detailHandler={this.detailHandler}
              />
            </div>
            ))
        }
            </InfiniteScroll>
        )}
        </div>
      </>
    )
  }
}

export default withRouter(Messages)