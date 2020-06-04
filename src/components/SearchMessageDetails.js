/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react'
import {
 Formik, Form, useField, Field,
} from 'formik'

import * as Yup from 'yup'

import Icon from './ui/Icon/Icon'
import Image from './ui/Image/Image'
import Button from './ui/Button/Button'


import convertTime from '../helpers/convertTime'

import '../styles/searchMessage.css'

const SearchMessageDetail = (props) => {
  const { location } = props
  const { post } = location !== undefined ? location.state : props
  const { showEditView } = location !== undefined ? location : props
  const {
    type, sex, breed, color, height, distFeatures, description, images, contacts, owner, active, startTimePost,
    } = post
  const { phone, email } = contacts
  const [editView, setEditView] = useState(false)
  useEffect(() => {
    if (showEditView) {
      setEditView(true)
    }
  }, [editView])
  const time = convertTime(startTimePost)


  const backHandler = () => {
     const { history } = props
     history.goBack()
  }

  const EditSearchSchema = Yup.object().shape(
    {
      type: Yup.string().required('This field is required'),
      sex: Yup.string(),
      breed: Yup.string(),
      color: Yup.string(),
      height: Yup.string(),
      distFeatures: Yup.string(),
      description: Yup.string(),
      phone: Yup.string().required('This field is required'),
    },
  )

  const MyTextInput = ({ label, helperText, ...rest }) => {
    const [field, meta] = useField(rest);
    return (
      <>
        <div className="searchmsg-inputLabel">
          <label htmlFor={rest.id || rest.name}>
            {label}
            <div className="input-helper">{helperText}</div>

          </label>
        </div>
        <div className="searchmsg-input">
          <input {...field} {...rest} />
        </div>

        {meta.touched && meta.error ? (
          <div className="inputError">{meta.error}</div>
        ) : null}
      </>
    )
  }

  const editLayout = () => (
    <div className="searchmsg-container">
      <div className="searchmsgdetailed-wrapper">
        <Formik
          initialValues={{
            type,
            sex,
            breed,
            color,
            height,
            distFeatures,
            description,
            phone,
        }}
          validationSchema={EditSearchSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true)
          // openPreview(values, setSubmitting, resetForm)
        }}
        >
          {
          (
            {
              dirty, handleReset, isSubmitting, isValid, values,
            },
          ) => (
            <Form className="searchmsg-form-wrapper">
              <div className="searchmsg-input-container">
                <div className="searchmsg-input-wrapper">
                  <div className="searchmsg-input-row">
                    <Field>
                      <MyTextInput
                        label="Type:"
                        name="type"
                        type="text"
                        placeholder={type}
                        autoComplete="off"
                        helperText=""
                      />
                    </Field>
                  </div>
                  <div className="searchmsg-input-row">
                    <MyTextInput
                      label="Sex:"
                      name="sex"
                      type="text"
                      placeholder="sex"
                      autoComplete="off"
                      helperText=""
                    />
                  </div>
                  <div className="searchmsg-input-row">
                    <MyTextInput
                      label="Breed:"
                      name="breed"
                      type="text"
                      placeholder={breed}
                      autoComplete="off"
                    />
                  </div>
                  <div className="searchmsg-input-row">
                    <MyTextInput
                      label="Color:"
                      name="color"
                      type="text"
                      placeholder={color}
                      autoComplete="off"
                    />
                  </div>
                  <div className="searchmsg-input-row">
                    <MyTextInput
                      label="Height:"
                      name="height"
                      type="text"
                      placeholder={height}
                      autoComplete="off"
                    />
                  </div>
                  <div className="searchmsg-input-row">
                    <MyTextInput
                      label="Distinctive features:"
                      name="distFeatures"
                      type="text"
                      placeholder={distFeatures}
                      autoComplete="off"
                    />
                  </div>
                  <div className="searchmsg-input-row">
                    <MyTextInput
                      label="Desciption:"
                      name="description"
                      type="text"
                      placeholder={description}
                      autoComplete="off"
                    />
                  </div>
                  <div className="searchmsg-input-row">
                    <MyTextInput
                      label="Contacts:"
                      name="phone"
                      type="text"
                      placeholder={phone}
                      autoComplete="off"
                    />
                  </div>
                </div>
                <div className="searchmsg-dragndrop-wrapper">
                  drag and drop
                </div>
              </div>
              <div className="searchmsg-button_wrapper">
                <div className="searchmsg-owner-info">
                  <div className="seachmsg-avatar-container">
                    <div className="searchmsg-owner-avatar">
                      <Image src={owner.avatar.includes('http') ? owner.avatar : 'https://www.gravatar.com/avatar/0?d=mp'} alt={owner.name} className="post-owner-avatar" />
                    </div>
                  </div>
                  <div className="searchmsg-owner-data">
                    <div className="searchmsg-owner-name">{owner.name}</div>
                  </div>
                </div>
                <div className="searchmsg-button-container">
                  <div className="searchmsg-formcontrol-button">
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
                        <div className="button-innertext">Publish</div>
                      </Button>
                    </div>
                  </div>

                </div>
              </div>
              <pre>{JSON.stringify(values, null, 2)}</pre>
            </Form>
          )
        }
        </Formik>
      </div>
    </div>
    )

  const normalLayout = () => (
    <div className="content-container">
      <div className="searchmsg-outer-container">
        <div className="searchmsgdetailed-control">
          <Button onClick={backHandler}>Back</Button>
        </div>
        <div className="searchmsgdetailed-wrapper">

          <div className="searchmsgdetailed">
            <div className="searchmsg-title">
              {`${type}, ${(breed.toLowerCase() === '' || breed.toLowerCase() === 'unknown') ? 'unknown breed' : breed}`}
            </div>
            <div className="searchmsgdetailed-imagecontainer">
              {images.map((image) => {
            console.log(image)
            return (
              <div className="searchmsgdetailed-image">
                <img src={image} alt="" />
              </div>
)
          })}
            </div>
            <div className="searchmsgdetailed-content">

              <div className="searchmsg-features">
                <div className="searchmsg-data">
                  <div className="searchmsg-data-row">
                    <span className="searchmsg-datatype">Color: </span>
                    {color}
                  </div>
                  <div className="searchmsg-data-row">
                    <span className="searchmsg-datatype">Sex: </span>
                    {sex}
                  </div>
                  <div className="searchmsg-data-row">
                    <span className="searchmsg-datatype">Height: </span>
                    {height}
                  </div>
                </div>
                <div className="searchmsg-disfeatures">
                  <span className="searchmsg-datatype">Distinctive features: </span>
                  {distFeatures.length > 0 ? distFeatures : 'not mentioned'}
                </div>
              </div>
              <div className="searchmsg-desc">
                <span className="searchmsg-datatype">Desciption: </span>
                {description.length > 0 ? description : 'not mentioned'}
              </div>
              <div className="searchmsg-footer">
                <div className="searchmsg-geo">
                  <div className="geo-marker">
                    <Icon type="fa" name="map-marker" className="searchmsg-geo-icon" />
                  </div>
                  <div className="geo-address">
                    Florentin, 27, Tel Aviv
                  </div>
                </div>
                <div className="searchmsg-owner">
                  <div className="searchmsg-owner-info">
                    <div className="seachmsg-avatar-container">
                      <div className="searchmsg-owner-avatar">
                        <Image src={owner.avatar.includes('http') ? owner.avatar : 'https://www.gravatar.com/avatar/0?d=mp'} alt={owner.name} className="post-owner-avatar" />
                      </div>
                    </div>
                    <div className="searchmsg-owner-data">
                      <div className="searchmsg-owner-name">{owner.name}</div>
                      <div className="searchmsg-date">{time}</div>
                    </div>
                  </div>
                  <div className="searchmsg-owner-socials">
                    <Icon type="fa" name="phone-square-alt" className="msg-owner-icons-tooltip">
                      {contacts.phone !== '' && <span className="tooltiptext">{contacts.phone}</span>}
                    </Icon>
                    <Icon type="fa" name="envelope-square" className="msg-owner-icons-tooltip">
                      {contacts.email !== '' && <span className="tooltiptext">{contacts.email}</span>}
                    </Icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )

  return editView ? editLayout() : normalLayout()
}


export default SearchMessageDetail