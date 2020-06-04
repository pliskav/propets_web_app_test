/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import { withRouter } from 'react-router-dom';
import {
 Formik, Form, useField,
} from 'formik';
import * as Yup from 'yup';
import { encode } from 'base-64';
import Button from './ui/Button/Button';

import { lostMessages, landingPath, homePath } from '../utils/routes';
import { ACCOUNT_SERVER_PATH } from '../utils/externalPath';

import '../styles/auth.css';
import Icon from './ui/Icon/Icon';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  sendLogin = (values, setSubmitting, resetForm) => {
    const { email, password } = values;
    const errorResponse = {};

    const myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `Basic ${encode(`${email}:${password}`)}`,
    );

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${ACCOUNT_SERVER_PATH}/${email}`, requestOptions)
      .then((res) => {
        console.log(res)
        console.log(res.headers)
        return res.json().then((data) => ({
          data,
          xAuth: res.headers.get('X-Authorization'),
          xUser: res.headers.get('X-User'),
        }))
})
      .then(({ data, xAuth, xUser }) => {
        console.log(`xauth on login: ${xAuth} `)
        console.log(data)
        if (xAuth !== null || xUser !== null) {
          localStorage.setItem('X-User', xUser);
          localStorage.setItem('X-Authorization', xAuth);
          setSubmitting(false);
          resetForm();
          if (localStorage.getItem('X-Authorization') !== null) {
            const { history } = this.props;
            history.push(homePath);
          }
        } else {
          errorResponse.status = data.status;
          errorResponse.message = data.message;
        }
      })
      .catch((error) => console.log('error', error));
  };

  handleCancel = () => {
    const { history } = this.props
    history.push(landingPath);
  }

  render() {
    const SignInSchema = Yup.object().shape({
      email: Yup.string()
        .required('This field is required')
        .email('Must be a valid email'),
      password: Yup.string()
        .required('This field is required')
        .min(8, 'Must be 8 characters at least'),
    });

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
      );
    };
    return (
      <>
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={SignInSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            this.sendLogin(values, setSubmitting, resetForm);
          }}
        >
          {({
 dirty, handleReset, isValid, isSubmitting,
}) => (
  <Form>
    <div className="input-wrapper">
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
          helperText=""
        />
      </div>
    </div>
    <div className="button_wrapper">
      <div className="form-footer-text">
        <p>By clicking “Submit”, you agree to us processing your information in accordance with these terms.</p>
      </div>
      <div className="button-container">
        <div className="return-button">
          <Button onClick={this.handleCancel} type="button" invert>
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
          )}
        </Formik>
      </>
    );
  }
}

export default withRouter(LoginForm);
