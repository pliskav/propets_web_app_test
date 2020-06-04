/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from 'react'
import { Formik, Form, useField } from 'formik'
import { withRouter } from 'react-router-dom'
import * as Yup from 'yup'
import { encode } from 'base-64'

import Button from './ui/Button/Button'

import { lostMessages } from '../utils/routes'
import { ACCOUNT_SERVER_PATH } from '../utils/externalPath'
import Icon from './ui/Icon/Icon'

import '../styles/auth.css'

const pasRegex = '^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))'

const RedisterSchema = Yup.object().shape(
  {
    name: Yup.string().required('This field is required'),
    email: Yup.string().required('This field is required').email('Must be a valid email'),
    password: Yup.string()
    .required('This field is required')
    .min(8, 'Must be 8 characters at least')
    .matches(pasRegex, 'Must contain at least one uppercase, one lowercase, one number'),
    passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Password confirm is required'),
  },
)

const MyTextInput = ({ label, helperText, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label htmlFor={props.id || props.name} className="inputLabel">
        {label}
      </label>
      <input className="input" {...field} {...props} />
      <div className="input-helper">{helperText}</div>
      {meta.touched && meta.error ? (
        <div className="inputError">{meta.error}</div>
      ) : null}
    </>
  )
}


const registerUser = (values, setSubmitting, resetForm, history) => {
  const { name, email, password } = values
  const errorResponse = {}

  const myHeaders = new Headers()
  myHeaders.append(
    'Authorization',
    `Basic ${encode(`${email}:${password}`)}`,
  )
  myHeaders.append('Content-Type', 'application/json');

  const user = JSON.stringify({ name })
  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: user,
    redirect: 'follow',
  }

  fetch(`${ACCOUNT_SERVER_PATH}/`, requestOptions)
  .then((res) => res.json().then((data) => (
    {
      data,
      xAuth: res.headers.get('X-Authorization'),
      xUser: res.headers.get('X-User'),
    }
    )))
  .then(({ data, xAuth, xUser }) => {
    if (xAuth !== null || xUser !== null) {
    localStorage.setItem('X-Authorization', xAuth)
    localStorage.setItem('X-User', xUser)
    setSubmitting(false)
    resetForm()
    history.push(lostMessages)
    } else {
      errorResponse.status = data.status
      errorResponse.message = data.message
      console.log(xAuth)
      console.log(xUser)
      console.log(errorResponse)
    }
  })
  .catch((error) => console.log('error', error))
}

const RegisterForm = (props) => {
  const history = props

  const handleCancel = () => {
    history.push(lostMessages);
  }

  return (
    <>
      <Formik
        initialValues={{
          name: '', email: '', password: '', passwordConfirmation: '',
        }}
        validationSchema={RedisterSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true)
          registerUser(values, setSubmitting, resetForm, history)
        }}
      >
        {
          (
            {
              dirty, handleReset, isSubmitting, isValid,
            },
          ) => (
            <Form>
              <div className="input-wrapper">
                <div className="input-row">
                  <MyTextInput
                    label="Name:"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    autoComplete="off"
                    helperText=""
                  />
                </div>
                <div className="input-row">
                  <MyTextInput
                    label="Email:"
                    name="email"
                    type="text"
                    placeholder="youremail@mail.com"
                    autoComplete="off"
                    helperText=""
                  />
                </div>
                <div className="input-row">
                  <MyTextInput
                    label="Password:"
                    name="password"
                    type="text"
                    placeholder="********"
                    autoComplete="off"
                    helperText="Password must have at least 8 characters with at least one Capital letter,
                    at least one lower case letter and at least one number or special character."
                  />
                </div>
                <div className="input-row">
                  <MyTextInput
                    label="Password:"
                    name="passwordConfirmation"
                    type="text"
                    placeholder="********"
                    autoComplete="off"
                    helperText="Please re-enter your password"
                  />
                </div>
              </div>
              <div className="button_wrapper">
                <div className="form-footer-text">
                  <p>By clicking “Submit”, you agree to us processing your information in accordance with these terms.</p>
                </div>
                <div className="button-container">
                  <div className="return-button">
                    <Button onClick={handleCancel} type="button" invert>
                      Cancel
                    </Button>
                  </div>
                  <div className="formcontrol-button">
                    <div>
                      <Button onClick={handleReset} type="button" invert>
                        Reset
                      </Button>
                    </div>
                    <div>
                      <Button
                        disabled={!isValid || !dirty || isSubmitting}
                        type="submit"
                      >
                        <Icon type="fa" name="paw" />
                        <div className="button-innertext">Submit</div>
                      </Button>
                    </div>
                  </div>

                </div>
              </div>
            </Form>
          )
        }
      </Formik>
    </>
   )
}
export default withRouter(RegisterForm)