/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import {
 Formik, Form, Field,
} from 'formik'
import * as Yup from 'yup'

import { Link } from 'react-router-dom'
import Button from './ui/Button/Button'

import { xAuthHeader } from '../utils/requestConst'


import { MESSAGE_SERVER_PATH } from '../utils/externalPath'
import { profilePath } from '../utils/routes'
import Image from './ui/Image/Image'
import convertTime from '../helpers/convertTime'
import Icon from './ui/Icon/Icon'


class MessageDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      post: {},
      editMode: false,
      previewMode: false,
    }
  }

  componentDidMount() {
    const { location } = this.props
    const { post } = location !== undefined ? location.state : this.props
    const { showEditView } = location !== undefined ? location : this.props
    this.setState({
      post,
      loading: false,
    })
  }

//   editHandler = () => {
//     const { editMode } = this.state
//     this.setState({
//       editMode: !editMode,
//     })
//   }

//   returnEditHandler = () => {
//     const { previewMode } = this.state
//     this.setState({
//       previewMode: !previewMode,
//     })
//   }

//   previewHandler = (values, setSubmitting) => {
//     const { previewMode } = this.state
//     let { post } = this.state
//     const text = values.postText
//     post = { ...post, text }
//     this.setState({
//       previewMode: !previewMode,
//       post,
//     })
//     setSubmitting(false)
//   }

//   saveHandler = () => {
//     const { post } = this.state
//     const { text, images, postId } = post
//     const xAuth = localStorage.getItem(xAuthHeader)
//     console.log(xAuth)
//     const payload = {
//       text,
//       images,
//     }
//     console.log(JSON.stringify(payload))

//     const myHeaders = new Headers()
//     myHeaders.append(
//       xAuthHeader,
//       xAuth,
//     )

//     myHeaders.append('Content-Type', 'application/json');

//     console.log(myHeaders)

//     const requestOptions = {
//       method: 'PUT',
//       headers: myHeaders,
//       body: JSON.stringify(payload),
//       redirect: 'follow',
//     }
//     fetch(`${MESSAGE_SERVER_PATH}/${postId}`, requestOptions)
//     .then((response) => response.json().then((data) => (
//       {
//         data,
//         token: response.headers.get('X-Authorization'),
//         user: response.headers.get('X-User'),
//       }
//       )))
//       .then(({ data, token, user }) => {
//         if (token !== null || user !== null) {
//         localStorage.setItem('X-Authorization', token)
//         localStorage.setItem('X-User', user)
//         } else {
//           console.log(token)
//           console.log(user)
//           console.log(data.message)
//         }
//       })
//     .catch((error) => console.log('error', error))
//   }

//   normalView = () => {
//     const { post, loading } = this.state
//     const {
//       owner, text, postId, images,
//     } = post
//     const time = convertTime(post.postDate)
//     console.log(post)
//     return (
//       <div>
//         <div className="message">
//           <div className="post-owner">
//             <Link to={{
//           pathname: `${profilePath}`,
//           userEmail: owner.email,
//         }}
//             >
//               <Image
//                 src={owner.avatar !== '' ? owner.avatar : 'https://www.gravatar.com/avatar/0?d=mp'}
//                 alt={owner.name}
//                 className="post-owner-avatar"
//               />
//             </Link>
//           </div>
//           <div className="post-content" onClick={this.handleClick} onKeyDown={this.handleClick} role="button" tabIndex="0">
//             <div className="post-owner-name">{owner.name}</div>
//             <div className="post-date">{time}</div>
//             <div className="post-images">
//               {(images.length !== 0 && images[0].includes('propets')) && (
//               <div className="feed-postimage-container">
//                 <img src={images[0]} alt="" className="postimage" />
//               </div>
//           )}
//             </div>
//             <div className="post-text">
//               {text.length >= 250 ? (text.substring(0, 250)) : text}
//               {text.length >= 250 && <span className="post-more-link"><Link to={`/messages/${postId}`}> ... more</Link></span>}
//             </div>
//           </div>
//           <div className="post-control">
//             <div className="post-visibility">
//               {!openControlMenu ? (
//                 <Icon
//                   type="fas"
//                   name="ellipsis-h"
//                   className="searchmsg-icon-control"
//                   onClick={() => this.setState({ openControlMenu: true })}
//                 />
//           ) : (
//             <div className="post-visibility-items">
//               <Icon
//                 type="fa"
//                 name="times"
//                 className="icon-control-invert-btn"
//                 onClick={() => this.setState({ openControlMenu: false })}
//               />
//               {activityView ? (
//                 <>
//                   <div className="post-visibility-item">
//                     <div className="icon-control-invert">
//                       <Icon
//                         type="fas"
//                         name="pencil-alt"
//                         className="icon-control-invert"
//                         onClick={this.editHandler}
//                       />
//                     </div>
//                     Edit
//                   </div>
//                   <div className="post-visibility-item">
//                     <div className="icon-control-invert">
//                       <Icon
//                         type="fas"
//                         name="trash-alt"
//                         className="icon-control-invert"
//                         onClick={() => deleteHandler(postId)}
//                       />
//                     </div>
//                     Delete
//                   </div>
//                 </>
//               ) : (
//                 <>
//                   <div className="post-visibility-item">
//                     <div className="icon-control-invert">
//                       <Icon
//                         type="far"
//                         name="eye-slash"
//                         className="icon-control-invert"
//                         onClick={() => hideMessage(postId)}
//                       />
//                     </div>
//                     Hide from feed
//                   </div>
//                   {/* <div className="post-visibility-item">
//                     <div className="icon-control-invert">
//                       <Icon
//                         type="fa"
//                         name="times"
//                         className="icon-control-invert"
//                         onClick={() => unfollowUser(postId)}
//                       />
//                     </div>
//                     Unfollow
//                   </div> */}
//                 </>
//                 )}
//             </div>
//           )}
//             </div>
//             {isFavorite
//           ? <Icon type="fa" name="star" className="icon-control " onClick={this.favoriteHandle} />
//           : (
//             <Icon
//               type="far"
//               name="star"
//               className="icon-control"
//               onClick={this.favoriteHandle}
//             />
// ) }
//           </div>
//         </div>
//         <Button onClick={this.editHandler}>Edit</Button>
//       </div>
// )
// }

// editView = () => {
//   const { post, previewMode } = this.state
//   return previewMode ? this.previeView() : (
//     <Formik
//       initialValues={{ postText: post.text }}
//       onSubmit={(values, { setSubmitting }) => this.previewHandler(values, setSubmitting)}
//       validationSchema={Yup.object().shape({
//         postText: Yup.string().required('Write something'),
//       })}
//     >
//       <Form>
//         <div><h3>Post date</h3></div>
//         <div>{post.postDate}</div>
//         <div>
//           <label htmlFor="postText">Your post</label>
//           <Field name="postText" />
//         </div>
//         <Button type="submit">Publish</Button>
//       </Form>
//     </Formik>
//   )
// }

// previeView = () => {
//   const { post, previewMode } = this.state
//   return previewMode ? (
//     <div>
//       <div>
//         <div><h3>Post text</h3></div>
//         <div>{post.text}</div>
//         <div><h3>Post date</h3></div>
//         <div>{post.postDate}</div>
//       </div>
//       <Button onClick={this.saveHandler}>Save</Button>
//       <Button onClick={this.returnEditHandler}>Edit</Button>
//     </div>
// ) : <h4>loading...</h4>
// }

  render() {
    const { editMode } = this.state
    // return editMode ? this.editView() : this.normalView()
    return editMode ? (<><h1>Edit mode</h1></>) : (<><h1>Normal mode</h1></>)
  }
}
  MessageDetails.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        postid: PropTypes.string,
      }).isRequired,
    }).isRequired,
  }

export default MessageDetails