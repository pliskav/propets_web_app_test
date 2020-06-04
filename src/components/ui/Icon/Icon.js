/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './icon.css'

const Icon = (props) => {
  const {
type, name, className, onClick, disabled, ...rest
} = props
  const classes = classNames(
    type,
    `fa-${name}`,
    { func: onClick },
    { disabled },
    className,
  );

  return (
    <span
      {...rest}
      className={classes}
      onClick={disabled ? null : onClick}
      onKeyDown={disabled ? null : onClick}
    />
  );
}

Icon.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

Icon.defaultProps = {
  name: '',
  className: '',
  onClick: null,
  disabled: false,
  type: '',
};

export default Icon