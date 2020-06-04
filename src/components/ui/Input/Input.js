/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Input = ({
  name, className, label, error, type, ...rest
}) => {
  const classes = classNames(
    'input',
    className,
    { error },
  )

  return (
    <div className="inputWrapper">
      {label
      && (
      <label className="inputLabel" htmlFor={name}>
        {label}
        <input
          name={name}
          type={type}
          className={classes}
          {...rest}
        />
      </label>
)}
      {error ? <div className="input-inputError">{error}</div> : null}
    </div>
  )
}

Input.propTypes = {
  name: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
}

Input.defaultProps = {
  name: '',
  className: '',
  label: '',
  error: '',
  type: '',
}

export default Input