import React from 'react'

import './loader.css'
import Portal from '../Portal/Portal'

const Loader = () => (
  <Portal>
    <div className="modalOverlay">
      <div className="modal-loader-center">
        <div className="loader-center">
          <div className="lds-spinner">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    </div>
  </Portal>

)

export default Loader