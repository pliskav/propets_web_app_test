import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'

import './styles/style.css'
import './assets/fonts/fontawesome-free-5.13.0-web/css/all.min.css'

import App from './components/App'

const application = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
ReactDOM.render(
  application,
  document.getElementById('react-app'),
);