/* eslint-disable react/jsx-props-no-spreading */
import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const Image = (
  props,
) => {
  const { src, alt, className } = props
  const classes = classNames(
    className,
  )

  return (
    <img
      src={src}
      alt={alt}
      className={classes}
    />
  )
}

Image.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  className: PropTypes.string,
}

Image.defaultProps = {
  src: '',
  alt: '',
  className: '',
}

export default Image