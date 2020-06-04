/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
import React from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
 DEFAULT_PAGE, DEFAULT_ITEMS_ON_PAGE,
} from '../utils/requestConst'
import { SEARCH_SERVER_PATH } from '../utils/externalPath'

import SearchMessagesFeed from './SearchMesssagesFeed'
import Modal from './ui/Modal/Modal'
import Loader from './ui/Loader/Loader'
import SearchMessageDetail from './SearchMessageDetails'

class SearchMessages extends React.Component {
  constructor(props) {
    super(props)
    const { typePost } = this.props
    this.state = {
      posts: [],
      postEdit: {},
      openEditMsg: false,
      hasMore: true,
      loading: true,
      isModalOpen: false,
      searchResult: '',
      errorMessage: '',
      errorType: '',
      searchParams: {
        typePost,
        current_page: DEFAULT_PAGE,
        items_on_page: DEFAULT_ITEMS_ON_PAGE,
      },
    }
  }

  componentDidMount() {
    const { searchParams } = this.state;
    console.log(searchParams);
    const url = `${SEARCH_SERVER_PATH}/`;
    const request = axios({
      method: 'get',
      url,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
      params: searchParams,
    });
    request
      .then((response) => {
        localStorage.removeItem('X-Authorization')
          const newToken = response.headers['x-authorization']
          localStorage.setItem('X-Authorization', newToken)
          console.log(response)
          return response.data
})
      .then((data) => {
        console.log(data)
        const { posts } = this.state;
        let { current_page } = searchParams;
        const postsLoaded = [...data.lfposts];
        this.setState({
          posts: [...posts, ...postsLoaded],
          loading: false,
          searchParams: { ...searchParams, current_page: (current_page += 1) },
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
    const { searchParams } = this.state;
    console.log(searchParams)
    let { current_page } = searchParams
    const url = `${SEARCH_SERVER_PATH}/`;
    const request = axios({
      method: 'get',
      url,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
      params: searchParams,
    });
    request
      .then((response) => {
        localStorage.removeItem('X-Authorization')
          const newToken = response.headers['x-authorization']
          localStorage.setItem('X-Authorization', newToken)
        return response.data
})
      .then((data) => {
        const { posts } = this.state;
        const postsLoaded = [...data.lfposts];
        if (postsLoaded.length === 0) {
          this.setState({
            hasMore: false,
          });
        } else {
          this.setState({
            posts: [...posts, ...postsLoaded],
            searchParams: {
              ...searchParams,
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

  deleteHandler = (postid) => {
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
          console.log(response.headers['x-authorization'])
          localStorage.setItem('X-Authorization', newToken)
          const newPosts = posts.filter((item) => item.lfpostId !== postid)
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
  };

  editHandler = (post) => {
    const { history } = this.props
      history.push({
      pathname: `/search/${post.lfpostId}`,
      state: { post },
      showEditView: true,
    });
  }


  modalCancelHandler = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  render() {
    const {
 isModalOpen, errorMessage, errorType, posts, loading, hasMore, postEdit, openEditMsg,
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
          {loading ? (
            <Loader />
        ) : (
          <SearchMessagesFeed
            posts={posts}
            hasmore={hasMore}
            next={this.fetchMore}
            loading={loading}
            deleteClick={this.deleteHandler}
            editHandler={this.editHandler}
          />
        )}
        </div>
      </>
    )
  }
}

export default withRouter(SearchMessages)