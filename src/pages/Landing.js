import React from 'react'
import { useHistory, Link } from 'react-router-dom'
import { authPath } from '../utils/routes';

import LandingHeader from '../components/LandingHeader'

import '../styles/landing.css'
import LandingFooter from '../components/LandingFooter';

const Landing = () => {
  const history = useHistory();

  const redirectAuthHandler = () => {
    history.push(authPath);
  }

  return (
    <>
      <LandingHeader />
      <div className="welcome-block">
        <div className="welcome-block--text">
          <div className="welcome-block--text--greeting">
            <p>Welcome to your</p>
            <p className="welcome-block--acent">pawfessional</p>
            <p>community</p>
          </div>
          <div className="welcome-block--text--btn">
            <div
              className="welcome-block--text--btnlost"
              onClick={redirectAuthHandler}
              onKeyDown={redirectAuthHandler}
              role="button"
              tabIndex="0"
            >
              <p>I lost my pet!</p>
              <img src="../src/assets/images/search.svg" alt="" />
            </div>
            <div
              className="welcome-block--text--btnfound"
              onClick={redirectAuthHandler}
              onKeyDown={redirectAuthHandler}
              role="button"
              tabIndex="0"
            >
              <p>I found a pet!</p>
            </div>
          </div>
          <div className="welcome-block--text--join">
            I’m okay, just want to
            {' '}
            <span className="welcome-block--acent"><Link to={authPath} className="landing-activelink">join</Link></span>
            {' '}
            the pawsome
            community!
          </div>
        </div>
        <div className="welcome-block--image">
          <img src="../src/assets/images/welcome_img.png" alt="" />
        </div>
      </div>
      <div className="goal-block">
        <p>
          Our fluffy space for lovers, admirers, dads and moms of our four-legged, winged, tailed
          guys.
        </p>
      </div>
      <div className="features-block">
        <div className="features-block--image-container">
          <div className="features-block--image">
            <img src="../src/assets/images/features.png" alt="" />
          </div>
        </div>
        <div className="features-block-text">
          <div className="features-block--title">
            Here is collected everything that your pet needs:
          </div>
          <div className="features-block--features">
            <ul>
              <li>
                <div className="li-marker">•</div>
                <div className="li-text">professional veterinarian tips;</div>
              </li>
              <li>
                <div className="li-marker">•</div>
                <div className="li-text">useful information about education and care;</div>
              </li>
              <li>
                <div className="li-marker">•</div>
                <div className="li-text">fostering home search;</div>
              </li>
              <li>
                <div className="li-marker">•</div>
                <div className="li-text">information about pet-sitting and walking service;</div>
              </li>
              <li>
                <div className="li-marker">•</div>
                <div className="li-text">
                  and of course, great communication with new
                  <br />
                  friends in your social network!
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="soon-block">
        <div className="soon-block--title">Coming soon</div>
        <div className="soon-block--text">
          We are planing to open a new service,
          <br />
          {' '}
          where your cats and dogs can find their love!
        </div>
        <div className="soon-block--img">love</div>
      </div>
      <LandingFooter />
    </>
  )
}

export default Landing
