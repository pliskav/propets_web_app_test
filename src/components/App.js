import React from 'react';
import {
 Route, Switch, Redirect, withRouter,
} from 'react-router-dom'
import {
  rootPath,
  homePath,
  authPath,
  landingPath,
} from '../utils/routes'

import Auth from '../pages/Auth';
import Landing from '../pages/Landing';
import Home from '../pages/Home';

const App = () => (
  <>
    <Switch>
      <Route path={authPath} component={Auth} />
      <Route path={landingPath} component={Landing} />
      <Route
        path={[rootPath, homePath]}
        render={() => (localStorage.getItem('X-Authorization') !== null ? (<Home />) : (<Redirect to={landingPath} />))}
      />
    </Switch>
  </>
)

export default withRouter(App)
