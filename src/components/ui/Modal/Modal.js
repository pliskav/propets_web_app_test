import React from 'react'
import PropTypes from 'prop-types'

import Icon from '../Icon/Icon'
import Portal from '../Portal/Portal'
import Button from '../Button/Button'

import './modal.css'

const Modal = ({
  isOpen, title, onCancel, onSubmit, children,
}) => (
  <>
    {
      isOpen && (
        <Portal>
          <div className="modalOverlayError">
            <div className="modalWindow">
              <div className="modalHeader">
                <div className="modalTitle">
                  {title}
                </div>
                <Icon type="fa" name="times" onClick={onCancel} className="modalClose" />
              </div>
              <div className="modalBody">
                {children}
              </div>
              <div className="modalFooter">
                <Button onClick={onCancel}>Cancel</Button>
                <Button onClick={onSubmit}>OK</Button>
              </div>
            </div>
          </div>
        </Portal>
      )
    }
  </>
  )

Modal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node,

}

Modal.defaultProps = {
  isOpen: false,
  title: '',
  onSubmit: () => {},
  onCancel: () => {},
  children: null,
}

export default Modal