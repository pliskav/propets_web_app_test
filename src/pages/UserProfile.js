/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
import React from 'react'
import ProfileActivities from '../components/ProfileActivities'
import ProfileDetails from '../components/ProfileDetails'

import '../styles/profile.css'
import SearchMessageDetail from '../components/SearchMessageDetails'

class UserProfile extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activityMode: false,
      editPostMode: false,
      isAutor: false,
      postEdit: {},
    }
  }

  componentDidMount() {
    const { location } = this.props
    const { userEmail } = location
    if (localStorage.getItem('X-User') === userEmail) {
      this.setState({
        isAutor: true,
      })
    }
  }

  toggleViewHandler = () => {
    const { activityMode } = this.state
    const toggle = !activityMode
    this.setState({
      activityMode: toggle,
    })
  }

  openActivityView = () => {
    this.setState({
      activityMode: true,
      editPostMode: false,
    })
  }

  openDetailsView = () => {
    this.setState({
      activityMode: false,
      editPostMode: false,
    })
  }

  openEditMode = (post) => {
    this.setState({
      editPostMode: true,
      postEdit: post,
    })
  }

  render() {
    const {
 activityMode, isAutor, editPostMode, postEdit,
} = this.state
    const { location } = this.props
    const { userEmail, updateInfo } = location
  return (
    <div className="content-container">
      <div className="title-text">
        Your profile. Change, edit and manage your data.
      </div>
      <div className="profile-control">
        {isAutor ? (
          <>
            {editPostMode ? (
              <div
                className={activityMode ? 'profile-control-item' : 'profile-control-item-active'}
              >
                Edit
              </div>
) : (
  <div
    className={activityMode ? 'profile-control-item' : 'profile-control-item-active'}
    onClick={this.openDetailsView}
    onKeyDown={this.openDetailsView}
    role="button"
    tabIndex="0"
  >
    My profile
  </div>
)}
            <div
              className={activityMode ? 'profile-control-item-active' : 'profile-control-item'}
              onClick={this.openActivityView}
              onKeyDown={this.openActivityView}
              role="button"
              tabIndex="0"
            >
              My activities
            </div>
          </>
        ) : (
          <>
            <div
              className={activityMode ? 'profile-control-item' : 'profile-control-item-active'}
              onClick={this.openDetailsView}
              onKeyDown={this.openDetailsView}
              role="button"
              tabIndex="0"
            >
              Profile details
            </div>
            <div
              className={activityMode ? 'profile-control-item-active' : 'profile-control-item'}
              onClick={this.openActivityView}
              onKeyDown={this.openActivityView}
              role="button"
              tabIndex="0"
            >
              Profile activities
            </div>
          </>
)}
      </div>
      {activityMode ? (editPostMode
      ? <SearchMessageDetail post={postEdit} showEditView />
      : <ProfileActivities email={userEmail} editMode={this.openEditMode} />)
      : <ProfileDetails email={userEmail} updateUser={updateInfo !== null ? updateInfo : null} />}
    </div>
    )
  }
}

export default UserProfile
