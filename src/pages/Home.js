/* eslint-disable react/prop-types */
import React from 'react'
import {
 Switch, Route, withRouter,
} from 'react-router-dom'

import Messages from './Messages'
import Navbar from '../components/Navbar'
import {
 profilePath,
 messageDetailPath,
 lostMessages,
 foundMessages,
 searchMessagePath,
 favoritesPath,
 searchPath,
 newPostPath,
 loadFilePath,
 rootPath,
 homePath,
} from '../utils/routes'
import UserProfile from './UserProfile'
import MessageDetails from '../components/MessageDetails'
import Lost from './Lost'
import Found from './Found'
import SearchMessageDetail from '../components/SearchMessageDetails'
import Favorites from './Favorites'
import NewPost from './NewPost'
import Header from '../components/Header'
import RightSideBar from '../components/RightSideBar'
import SearchMessages from '../components/SearchMessages'


const Home = () => (
  <div className="app">
    <Header />
    <Navbar />
    <div className="content-wrapper">
      <Switch>
        <Route path={[rootPath, homePath]} component={Messages} exact />
        <Route path={profilePath} component={UserProfile} />
        <Route path={messageDetailPath} component={MessageDetails} />
        <Route
          key="lost"
          path={lostMessages}
          render={() => <SearchMessages typePost="lost" />}
          exact
        />
        <Route
          key="found"
          path={foundMessages}
          render={() => <SearchMessages typePost="found" />}
          exact
        />
        <Route path={searchMessagePath} component={SearchMessageDetail} />
        <Route path={favoritesPath} component={Favorites} />
        <Route path={newPostPath} component={NewPost} />
      </Switch>
    </div>
    <RightSideBar />
  </div>
  )

export default Home