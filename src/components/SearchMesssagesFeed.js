/* eslint-disable react/prop-types */
import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import SearchMessage from './SearchMessage'
import LoaderSmall from './ui/Loader/LoaderSmall'

class SearchMessagesFeed extends React.Component {
render() {
  const { posts } = this.props
  const {
 hasmore, next, loading, deleteClick, editHandler,
} = this.props
  console.log(posts)
  return (
    <InfiniteScroll
      hasMore={hasmore}
      next={next}
      loader={loading ? <LoaderSmall /> : null}
      dataLength={posts.length}
      endMessage={<h4>You have seen it all</h4>}
      className="scroll-container"
    >
      {posts.map((post) => (
        <div className="searchmsg-outer-container" key={post.lfpostId}>
          <div className="searchmsg-container">
            <SearchMessage
              post={post}
              lfpostId={post.lfpostId}
              deleteHandler={deleteClick}
              editHandler={editHandler}
            />
          </div>
        </div>
          ))}
    </InfiniteScroll>

  )
}
}

export default SearchMessagesFeed