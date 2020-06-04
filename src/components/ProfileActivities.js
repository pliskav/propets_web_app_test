/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DEFAULT_PAGE, DEFAULT_ITEMS_ON_PAGE } from '../utils/requestConst';
import { ACCOUNT_SERVER_PATH, MESSAGE_SERVER_PATH, SEARCH_SERVER_PATH } from '../utils/externalPath';

import SearchMessage from './SearchMessage';
import Message from './Message';
import Modal from './ui/Modal/Modal';
import Loader from './ui/Loader/Loader';
import LoaderSmall from './ui/Loader/LoaderSmall';


class ProfileActivities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasMore: true,
      loading: true,
      isModalOpen: false,
      errorMessage: '',
      errorType: '',
      posts: [],
      requestParams: {
        current_page: DEFAULT_PAGE,
        items_on_page: DEFAULT_ITEMS_ON_PAGE,
      },
    };
  }

  componentDidMount() {
    const { email } = this.props;
    const { requestParams } = this.state;
    console.log(requestParams)
    const url = `${ACCOUNT_SERVER_PATH}/${email}/activities`;
    const request = axios({
      method: 'get',
      url,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
      params: requestParams,
    });
    request
      .then((response) => {
        localStorage.removeItem('X-Authorization');
        const newToken = response.headers['x-authorization'];
        localStorage.setItem('X-Authorization', newToken);
        console.log(response);
        return response.data;
      })
      .then((data) => {
        console.log(data);
        this.setState({
          loading: false,
        });
        const { posts } = this.state;
        let { current_page } = requestParams;
        const postsLoaded = [];
        data.posts.map((post) => (post.post === null ? postsLoaded.push(post.lostFoundPost) : postsLoaded.push(post.post)))
        this.setState({
          posts: [...posts, ...postsLoaded],
          loading: false,
          requestParams: {
            ...requestParams,
            current_page: (current_page += 1),
          },
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
    console.log('fetching more')
    const { requestParams } = this.state;
    let { current_page } = requestParams;
    const { email } = this.props;
    const url = `${ACCOUNT_SERVER_PATH}/${email}/activities`;
    const request = axios({
      method: 'get',
      url,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
      params: requestParams,
    });
    request
      .then((response) => {
        localStorage.removeItem('X-Authorization');
        const newToken = response.headers['x-authorization'];
        localStorage.setItem('X-Authorization', newToken);
        return response.data;
      })
      .then((data) => {
        console.log(data)
        const { posts } = this.state;
        const postsLoaded = [];
        data.posts.map((post) => (post.post === null ? postsLoaded.push(post.lostFoundPost) : postsLoaded.push(post.post)))
        if (postsLoaded.length === 0) {
          this.setState({
            hasMore: false,
          });
        } else {
          this.setState({
            posts: [...posts, ...postsLoaded],
            requestParams: {
              ...requestParams,
              current_page: (current_page += 1),
            },
          });
        }
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

  modalCancelHandler = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  deleteMsgHandler = (postid) => {
    const { posts } = this.state
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
        console.log(response)
        if (response.status === 200) {
          localStorage.removeItem('X-Authorization')
          const newToken = response.headers['x-authorization']
          localStorage.setItem('X-Authorization', newToken)
          const newPosts = posts.filter((item) => !item.postId || item.postId !== postid)
          console.log(newPosts)
          this.setState({
            posts: [...newPosts],
          })
        }
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

  deleteSearchHandler = (postid) => {
    const { posts } = this.state
    const url = `${SEARCH_SERVER_PATH}/${postid}`;
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
          localStorage.setItem('X-Authorization', newToken)
          const newPosts = posts.filter((item) => !item.lfpostId || item.lfpostId !== postid)
          this.setState({
            posts: [...newPosts],
          })
        }
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
      posts,
      loading,
      isModalOpen,
      errorType,
      errorMessage,
      hasMore,
    } = this.state;
    const { editMode } = this.props
    console.log(posts)
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
        <>
          {loading ? (
            <Loader />
          ) : (
            <div className="activities-wrapper">
              <InfiniteScroll
                hasMore={hasMore}
                next={this.fetchMore}
                loader={loading ? <LoaderSmall /> : null}
                dataLength={posts.length}
                endMessage={<h4>You have seen it all</h4>}
                className="scroll-container"
              >
                {posts.map((p) => (p.lfpostId ? (
                  <div className="searchmsg-container" key={p.lfpostId}>
                    <SearchMessage
                      post={p}
                      lfpostId={p.lfpostId}
                      deleteHandler={this.deleteSearchHandler}
                      editHandler={editMode}
                      activityFeed
                    />
                  </div>
) : (
  <Message
    key={p.postId}
    post={p}
    activityFeed
    deleteHandler={this.deleteMsgHandler}
  />
                  )))}

              </InfiniteScroll>
            </div>
          )}
        </>
      </>
    );
  }
}
export default ProfileActivities
