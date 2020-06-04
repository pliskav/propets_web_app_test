/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './button.css'

const Button = ({
  children, onClick, className, disabled, active, invert, ...rest
}) => {
  const classes = classNames(
    'btn',
    className,
    { disabled },
    { invert },
    { active },
  )
  console.log(rest.href)
  const onClickAction = (e) => {
    if (disabled) {
      return e.preventDefault()
    }
      return onClick(e)
  }

  const Tag = rest.href ? 'a' : 'button'
  return (
    <Tag
      {...rest}
      className={classes}
      disabled={disabled}
      onClick={onClickAction}
    >
      {children}
    </Tag>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  invert: PropTypes.bool,
}

Button.defaultProps = {
  children: 'Default button',
  onClick: () => {},
  className: '',
  disabled: false,
  active: false,
  invert: false,
}

export default Button