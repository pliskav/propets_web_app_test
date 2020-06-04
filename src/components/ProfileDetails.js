/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/prop-types */
/* eslint-disable no-alert */
import React from 'react';
import axios from 'axios'
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import AWS from 'aws-sdk';

import { ACCOUNT_SERVER_PATH } from '../utils/externalPath';
import Image from './ui/Image/Image';
import Button from './ui/Button/Button';
import Icon from './ui/Icon/Icon';
import DragDropZone from './ui/DragDropZone/DragDropZone';

export default class ProfileDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editView: false,
      openAvatarUpdateZone: false,
      loading: true,
      user: {},
      isOwner: false,
      previewFiles: [],
      loadedAwsFiles: [],
      filesForUpload: [],
      uploadPercentage: 0,
      loadedTotal: 0,
      uploaded: false,
      loadingAvatar: false,
    };
  }

  componentDidMount() {
    const { email } = this.props;
    if (email === localStorage.getItem('X-User')) {
      this.setState({
        isOwner: true,
      });
    }
    const url = `${ACCOUNT_SERVER_PATH}/${email}`;
    const request = axios({
      method: 'post',
      url,
      data: null,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
    });
    request
      .then((response) => {
        localStorage.removeItem('X-Authorization');
        const newToken = response.headers['x-authorization'];
        localStorage.setItem('X-Authorization', newToken);
        console.log(response);
        return response.data;
      })
      .then((data) => {
        console.log(data);
        this.setState({
          loading: false,
          user: data,
        })
      })
      .catch((error) => {
        const { status, message, error: err } = error.response.data;
        this.setState({
          isModalOpen: true,
          errorMessage: message,
          errorType: `${status}: ${err}`,
          loading: false,
        });
      });
  }

  modeViewHandler = () => {
    const { editView } = this.state;
    const toggle = !editView;
    this.setState(
      {
        editView: toggle,
        openAvatarUpdateZone: false,
        previewFiles: [],
        filesForUpload: [],
        uploadPercentage: 0,
        loadedTotal: 0,
        uploaded: false,
      },
    );
  };

  saveHandler = (values, setSubmitting, resetForm) => {
    const { updateUser } = this.props
    console.log(values)
    const { user } = this.state
    const { name, password, phone } = values
    const newUserData = {
      name,
      password: password === '' ? null : password,
      phone,
      avatar: user.avatar,
    }

    const url = `${ACCOUNT_SERVER_PATH}/${user.email}`;
    console.log('update user')
    const request = axios({
      method: 'put',
      url,
      data: newUserData,
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
    });
    request
      .then((response) => {
        localStorage.removeItem('X-Authorization');
        const newToken = response.headers['x-authorization'];
        localStorage.setItem('X-Authorization', newToken);
        console.log(response);
        setSubmitting(false)
        resetForm()
        return response.data;
      })
      .then((data) => {
        this.setState({
          loading: false,
          user: data,
          editView: false,
        })
        updateUser(name, user.avatar)
      })
      .catch((error) => {
        const { status, message, error: err } = error.response.data;
        this.setState({
          isModalOpen: true,
          errorMessage: message,
          errorType: `${status}: ${err}`,
          loading: false,
        });
      });
  };

  updateAvatarHandler = () => {
    this.setState({
      openAvatarUpdateZone: true,
    })
  }


  handleDrop = (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    this.handleFiles(files);
    this.setState({
      loadedAwsFiles: [],
      filesForUpload: [],
      previewFiles: [],
      uploaded: false,
      uploadPercentage: 0,
    });
  };

  handleClick = (e) => {
    const targetFromClick = e.target;
    const files = targetFromClick.files;
    this.handleFiles(files);
    this.setState({
      loadedAwsFiles: [],
      filesForUpload: [],
      previewFiles: [],
      uploaded: false,
      uploadPercentage: 0,
    });
  };

  handleFiles = (files) => {
    const objs = [...files];

    objs.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const updatePreviewFiles = (fileObj, data) => {
        const { previewFiles } = this.state;
        this.setState({
          previewFiles: [
            ...previewFiles,
            {
              name: fileObj.name,
              size: fileObj.size,
              type: fileObj.type,
              data,
            },
          ],
        });
      };
      reader.onloadend = function () {
        updatePreviewFiles(file, reader.result);
      };
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      const updateFilesForUpload = (fileObj, data) => {
        const { filesForUpload } = this.state;
        this.setState({
          filesForUpload: [
            ...filesForUpload,
            {
              name: fileObj.name,
              size: fileObj.size,
              type: fileObj.type,
              data,
            },
          ],
        });
      };
      fileReader.onloadend = function () {
        updateFilesForUpload(file, fileReader.result);
      };
    });
  };

  removeFileHandler = (file) => {
    const { previewFiles, filesForUpload } = this.state;
    const previewFilesFilter = previewFiles.filter(
      (image) => image.name !== file.name,
    );
    const filesForUploadFilter = filesForUpload.filter(
      (obj) => obj.name !== file.name,
    );
    this.setState({
      previewFiles: previewFilesFilter,
      filesForUpload: filesForUploadFilter,
    });
  };

  uploadAvatarHandle = () => {
    console.log('start upload avatar')
    this.setState({
      loadingAvatar: true,
    })
    const { filesForUpload } = this.state;
    console.log(filesForUpload)
    // const totalsize = filesForUpload.reduce((sum, value) => (sum += value.size), 0);
    const albumBucketName = 'propets';
    const bucketRegion = 'us-east-2';
    const IdentityPoolId = 'us-east-2:70744c2d-d49f-4d02-abd9-4f4d51bce5ad';
    const albumName = 'avatars';
    // let uploadingProgress = [];

    AWS.config.update({
      region: bucketRegion,
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId,
      }),
    });
    const promisses = filesForUpload.map((file) => {
      const fileName = file.name;
      const albumPhotosKey = `${encodeURIComponent(albumName)}/`;
      const photoKey = albumPhotosKey + fileName;

      const upload = new AWS.S3.ManagedUpload({
        params: {
          Bucket: albumBucketName,
          Key: photoKey,
          Body: file.data,
          ACL: 'public-read',
        },
      })
      // .on('httpUploadProgress', (event) => {
      //   const { loadedTotal } = this.state;
      //   const { loaded, key } = event;
      //   let workingFile = uploadingProgress.find((file) => file.name === key);
      //   if (workingFile !== undefined) {
      //     workingFile.loaded = loaded;
      //     const workedFiles = uploadingProgress
      //       .filter((file) => file.name !== key)
      //       .concat(workingFile);
      //     uploadingProgress = workedFiles;
      //   } else {
      //     workingFile = {
      //       name: key,
      //       loaded,
      //     };
      //     const workedFiles = uploadingProgress.concat(workingFile);
      //     uploadingProgress = workedFiles;
      //   }

      //   const uploadingSize = uploadingProgress.reduce((sum, value) => (sum += value.loaded), 0);
      //   const percent = Math.round((uploadingSize * 100) / totalsize);
      //   console.log(percent)
      //   if (percent < 100) {
      //     this.setState({
      //       uploadPercentage: percent,
      //       loadedTotal,
      //     });
      //   }
      // });
      const promise = upload.promise();
      return promise
        .then((data) => {
          const { loadedAwsFiles, user } = this.state;
          const newFiles = [...loadedAwsFiles, data.Location];
          console.log(newFiles)
          this.setState({
            loadedAwsFiles: newFiles,
            user: { ...user, avatar: data.Location },
          });
        })
        .catch((err) => {
          console.log('There was an error uploading your photo: ', err.message);
        });
    });

    Promise.all(promisses).then(() => {
      const { loadedAwsFiles, filesForUpload } = this.state;
      if (loadedAwsFiles.length === filesForUpload.length) {
        this.setState({
          uploadPercentage: 0,
          uploaded: true,
          previewFiles: [],
          loadingAvatar: false,
          openAvatarUpdateZone: false,
        });
      }
    });
  }

  normalMode = () => {
    const { user, isOwner } = this.state;
    return (
      <>
        <div className="profile-details-container">
          <div className="profile-details">
            <div className="profile-item-large">
              <div className="profile-avatar">
                <Image src={user.avatar !== '' ? user.avatar : 'https://www.gravatar.com/avatar/0?d=mp'} />
              </div>
              <div className="profile-name">{user.name}</div>
            </div>
            <div className="profile-item">
              <div className="profile-item-type">Email:</div>
              <div className="profile-item-content">{user.email}</div>
            </div>
            <div className="profile-item">
              <div className="profile-item-type">Phone:</div>
              <div className="profile-item-content">
                {user.phone ? user.phone : 'none'}
              </div>
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="profile-control-btn">
            <Button onClick={this.modeViewHandler}>Edit</Button>
          </div>
        )}
      </>
    );
  };

  editMode = () => {
    const {
 user,
        isOwner,
        openAvatarUpdateZone,
        previewFiles,
        filesForUpload,
        uploadPercentage,
        loadedTotal,
        uploaded,
        loadingAvatar,
      } = this.state;
    console.log(user)
    const ProfileEditSchema = Yup.object().shape({
      email: Yup.string()
        .email('Must be a valid email'),
      password: Yup.string()
        .min(8, 'Must be 8 characters at least'),
    });

    const MyTextInput = ({ label, helperText, ...props }) => {
      const [field, meta] = useField(props);
      return (
        <>
          <label htmlFor={props.id || props.name} className="profile-inputLabel">
            {label}
          </label>
          <input className="profile-input" {...field} {...props} />
          <div className="profile-input-helper">{helperText}</div>
          {meta.touched && meta.error ? (
            <div className="inputError">{meta.error}</div>
          ) : null}
        </>
      );
    };
    return (
      <>
        <div className="profile-details-container">
          <div className="profile-avatar-zone">
            <div className="profile-avatar">
              <Image src={user.avatar !== '' ? user.avatar : 'https://www.gravatar.com/avatar/0?d=mp'} />
              {!openAvatarUpdateZone && (
                <div
                  className="profile-avatar-btn"
                  onClick={this.updateAvatarHandler}
                  onKeyDown={this.updateAvatarHandler}
                  role="button"
                  tabIndex="0"
                >
                  <Icon
                    type="fas"
                    name="camera"
                  />
                </div>
              )}
            </div>
            {openAvatarUpdateZone && (
            <div className="profile-dndzone">
              <DragDropZone
                previewFiles={previewFiles}
                filesForUpload={filesForUpload}
                uploadPercentage={uploadPercentage}
                loadedTotal={loadedTotal}
                uploaded={uploaded}
                uploadClick={this.uploadAvatarHandle}
                removeFileHandler={this.removeFileHandler}
                handleDrop={this.handleDrop}
                handleClick={this.handleClick}
                loading={loadingAvatar}
              />
            </div>
)}
          </div>
          <div className="profile-details">
            <Formik
              initialValues={{
                name: `${user.name}`,
                email: `${user.email}`,
                password: '',
                passwordConfirmation: '',
                phone: `${user.phone}`,
              }}
              validationSchema={ProfileEditSchema}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                this.saveHandler(values, setSubmitting, resetForm);
              }}
            >
              {({
 dirty, handleReset, isValid, isSubmitting,
}) => (
  <Form>
    <div className="profile-item">
      <div className="input-row">
        <MyTextInput
          label="Name:"
          name="name"
          type="text"
          placeholder={`${user.name}`}
          autoComplete="off"
        />
      </div>
    </div>
    <div className="profile-item">
      <div className="input-row">
        <MyTextInput
          label="Email:"
          name="email"
          type="text"
          disabled
          helperText="You are not able to cnahge the registartion email"
          placeholder={`${user.email}`}
          autoComplete="off"
        />
      </div>
    </div>
    <div className="profile-item">
      <div className="input-row">
        <MyTextInput
          label="Password:"
          name="password"
          type="text"
          placeholder="********"
          autoComplete="off"
        />
      </div>
    </div>
    <div className="profile-item">
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
    <div className="profile-item">
      <div className="input-row">
        <MyTextInput
          label="Phone:"
          name="phone"
          type="text"
          placeholder={`${user.phone}`}
          autoComplete="off"
        />
      </div>
    </div>
    {isOwner && (
    <div className="profile-control-btn">
      <Button onClick={this.modeViewHandler} invert>
        Cancel
      </Button>
      <Button
        disabled={!isValid || isSubmitting}
        type="submit"
      >
        Save
      </Button>
    </div>
        )}
  </Form>
              )}
            </Formik>
          </div>
        </div>
      </>
    );
  };

  render() {
    const { editView } = this.state
    return editView ? this.editMode() : this.normalMode();
  }
}
