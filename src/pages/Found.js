/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { DEFAULT_PAGE, DEFAULT_ITEMS_ON_PAGE } from '../utils/requestConst';
import { SEARCH_SERVER_PATH } from '../utils/externalPath';

import SearchMessage from '../components/SearchMessage';
import SearchFilters from '../components/SearchFilters'
import Loader from '../components/ui/Loader/Loader';
import Modal from '../components/ui/Modal/Modal';
import Button from '../components/ui/Button/Button';

class Found extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      hasMore: true,
      loading: true,
      isModalOpen: false,
      searchResult: '',
      errorMessage: '',
      errorType: '',
      searchParams: {
        typePost: 'found',
        current_page: DEFAULT_PAGE,
        items_on_page: DEFAULT_ITEMS_ON_PAGE,
      },
    };
  }

//   componentDidMount() {
//     const { searchParams } = this.state;
//     console.log(searchParams);
//     const url = `${SEARCH_SERVER_PATH}/`;
//     const request = axios({
//       method: 'get',
//       url,
//       data: null,
//       headers: {
//         'X-Authorization': localStorage.getItem('X-Authorization'),
//       },
//       params: searchParams,
//     });
//     request
//       .then((response) => {
//         localStorage.removeItem('X-Authorization')
//           const newToken = response.headers['x-authorization']
//           localStorage.setItem('X-Authorization', newToken)
//           return response.data
// })
//       .then((data) => {
//         const { posts } = this.state;
//         let { current_page } = searchParams;
//         const postsLoaded = [...data.content];
//         this.setState({
//           posts: [...posts, ...postsLoaded],
//           loading: false,
//           searchParams: { ...searchParams, current_page: (current_page += 1) },
//         });
//       })
//       .catch((error) => {
//         const { status, message, error: err } = error.response.data;
//         this.setState({
//           isModalOpen: true,
//           errorMessage: message,
//           errorType: `${status}: ${err}`,
//           loading: false,
//         });
//       });
//   }

  fetchMore = () => {
    const { searchParams } = this.state;
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
        const postsLoaded = [...data.content];
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

  modalCancelHandler = () => {
    this.setState({
      isModalOpen: false,
    });
  };

  getSearchParams = (params) => {
    if (params) {
      this.setState({
        searchResult: '',
      })
    }
    const { searchParams } = this.state;
    const { typePost, items_on_page } = searchParams
    const newParams = {
      typePost, items_on_page, current_page: 0, ...params,
     }
     let { current_page } = newParams

    this.setState({
      posts: [],
      searchParams: { ...newParams },
      hasMore: true,
    })
    const url = `${SEARCH_SERVER_PATH}/`;
    const request = axios({
      method: 'get',
      url,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
      params: newParams,
    });
    request
      .then((response) => {
        localStorage.removeItem('X-Authorization')
          const newToken = response.headers['x-authorization']
          localStorage.setItem('X-Authorization', newToken)
          return response.data
})
      .then((data) => {
        const postsLoaded = [...data.content];
        if (postsLoaded.length === 0) {
          this.setState({
            searchResult: `There are ${postsLoaded.length} messages on your request. Try another search`,
          })
        } else {
          this.setState({
            posts: [...postsLoaded],
            loading: false,
            searchParams: { ...newParams, current_page: (current_page += 1) },
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

  editHandler = () => {
    console.log('dscx edit action');
  };

  render() {
    const {
      hasMore,
      posts,
      loading,
      isModalOpen,
      errorMessage,
      errorType,
      searchResult,
    } = this.state;
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
        <SearchFilters getParams={this.getSearchParams} />
        <div className="content-container">
          { loading ? (<Loader />) : (
            <>
              {searchResult.length !== 0 ? (
                <div className="searchresult-msg">
                  {searchResult}
                  {/* <div>
                    <Button onClick={
                    () => {
                      this.setState({
                        searchResult: '',
                      })
                    }
                  }
                    >
                      Back to the feed
                    </Button>

                  </div> */}
                </div>
              ) : (
                <InfiniteScroll
                  hasMore={hasMore}
                  next={this.fetchMore}
                  loader={loading ? <Loader /> : null}
                  dataLength={posts.length}
                  endMessage={<h4>You have seen it all</h4>}
                  className="scroll-container"
                >
                  {posts.map((post) => (
                    <div className="searchmsg-container" key={post.lfpostId}>
                      <SearchMessage
                        post={post}
                        lfpostId={post.lfpostId}
                        deleteHandler={this.deleteHandler}
                        editHandler={this.editHandler}
                      />
                    </div>
          ))}
                </InfiniteScroll>
              )}

            </>
)}
        </div>
      </>
    )
  }
}

Found.propTypes = {};

export default Found;
