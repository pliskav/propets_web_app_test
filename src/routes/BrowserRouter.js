import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import{rootPath, homePath, profilePath, searchPath} from '../utils/routes'

import Navbar from '../components/Navbar'
import UserProfile from '../components/UserProfile'
import Messages from '../components/Messages'


const PropetsBrowserRouter = () = {
  return (
    <BrowserRouter>
        <Navbar />
    <Switch>
     <Route path={[rootPath, homePath]} component={Messages} exact={true}/>
     <Route path={profilePath} component={UserProfile}/>
   </Switch>
  </BrowserRouter>
  )
}

export default PropetsBrowserRouter