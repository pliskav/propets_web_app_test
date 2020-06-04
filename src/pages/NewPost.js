/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import { withRouter } from 'react-router-dom'
import axios from 'axios'
import {
Formik, Field, Form, ErrorMessage,
} from 'formik'
import * as Yup from 'yup'
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

import '../styles/newpost.css'


import { xUserHeader } from '../utils/requestConst'
import { ACCOUNT_SERVER_PATH, MESSAGE_SERVER_PATH } from '../utils/externalPath'
import Loader from '../components/ui/Loader/Loader'
import Modal from '../components/ui/Modal/Modal'
import Button from '../components/ui/Button/Button'
import Image from '../components/ui/Image/Image'
import PostDragDropZone from '../components/ui/DragDropZone/PostDragDropZone';


class NewPost extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar: '',
      name: '',
      text: '',
      images: [],
      previewFiles: [],
      loadedAwsFiles: [],
      filesForUpload: [],
      loadingImages: false,
      loading: true,
      isModalOpen: false,
      errorType: '',
      errorMessage: '',
    }
  }

  componentDidMount() {
    const url = `${ACCOUNT_SERVER_PATH}/${localStorage.getItem(xUserHeader)}`;

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
      localStorage.removeItem('X-Authorization')
        const newToken = response.headers['x-authorization']
        localStorage.setItem('X-Authorization', newToken)
        return response.data
    })
    .then((data) => {
      this.setState({
        avatar: data.avatar,
        name: data.name,
        loading: false,
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

  sendMessage = (values, setSubmitting) => {
    const { postText } = values
    this.setState({
      text: postText,
    })


    const url = `${MESSAGE_SERVER_PATH}`;
    const {
      text, images,
    } = this.state

    const request = axios({
      method: 'post',
      url,
      data: {
        ownerid: localStorage.getItem('X-User'),
      text,
      images,
      },
      headers: {
        'X-Authorization': localStorage.getItem('X-Authorization'),
      },
    });
    request
    .then((response) => {
      localStorage.removeItem('X-Authorization')
        const newToken = response.headers['x-authorization']
        localStorage.setItem('X-Authorization', newToken)
        return response.data
    })
    .then((data) => {
      const { history } = this.props;
      history.push('/')
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
      setSubmitting(false)
    }


    handleDrop = (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      this.handleFiles(files);
    };

    handleClick = (e) => {
      const targetFromClick = e.target;
      const files = targetFromClick.files;
      this.handleFiles(files);
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
        reader.onloadend = () => {
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
        fileReader.onloadend = () => {
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

    uploadImagesHandle = () => {
      this.setState({
        loadingImages: true,
      })
      const { filesForUpload } = this.state;
      console.log(filesForUpload)
      const albumBucketName = 'propets';
      const bucketRegion = 'us-east-2';
      const IdentityPoolId = 'us-east-2:70744c2d-d49f-4d02-abd9-4f4d51bce5ad';
      const albumName = 'msg_media';

      AWS.config.update({
        region: bucketRegion,
        credentials: new AWS.CognitoIdentityCredentials({
          IdentityPoolId,
        }),
      });
      const promisses = filesForUpload.map((file) => {
        const fileName = uuidv4();
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
        const promise = upload.promise();
        return promise
          .then((data) => {
            const { loadedAwsFiles } = this.state;
            const newFiles = [...loadedAwsFiles, data.Location];
            console.log(newFiles)
            this.setState({
              loadedAwsFiles: newFiles,
              images: newFiles,
            });
          })
          .catch((err) => {
            console.log('There was an error uploading your photo: ', err.message);
          });
      });

      Promise.all(promisses).then(() => {
        const { loadedAwsFiles } = this.state;
        if (loadedAwsFiles.length === filesForUpload.length) {
          this.setState({
            previewFiles: [],
            loadingImages: false,
          });
        }
      });
    }


     render() {
      const PostValidation = Yup.object().shape(
        {
          postText: Yup.string().required('Write your post').max(1500, 'You exeeded maximum size'),
        },
      )
      const {
 avatar,
 name,
 loading,
 isModalOpen,
 errorMessage,
 errorType,
 previewFiles,
 filesForUpload,
 loadingImages,
 loadedAwsFiles,
} = this.state
      return (
        <>
          {isModalOpen && (
          <Modal
            title={errorType}
            onCancel={this.modalCancelHandler}
            isOpen={isModalOpen}
            onSubmit={this.modalCancelHandler}
          >
            <div className="modalErrorText">{errorMessage}</div>
          </Modal>
              )}
          <div className="content-container">
            { loading ? (<Loader />) : (
              <>
                <div className="section-welcome">
                  Your new post! Simply text, add photos and publish.
                </div>
                <div className="editor-wrapper">
                  <Formik
                    initialValues={{ postText: '' }}
                    validationSchema={PostValidation}
                    onSubmit={(values, { setSubmitting }) => this.sendMessage(values, setSubmitting)}
                  >
                    <Form className="postform-container">
                      <div className="text-container">
                        <div className="text-helper">
                          <div className="desc">
                            Text:
                          </div>
                          <div className="instruction">
                            up to 1500 char
                          </div>
                        </div>
                        <div className="inputWrapper">
                          <Field className="inputText" name="postText" as="textarea" placeholder="Post a message.." rows={8} />
                          <ErrorMessage className="inputError" component="div" name="postText" />
                        </div>
                      </div>
                      <div className="editor-image-container">
                        <div className="text-helper">
                          <div className="desc">
                            Photos:
                          </div>
                          <div className="instruction">
                            up to 4 images
                          </div>
                        </div>
                        <div className="post-dndzone-wrapper">
                          <PostDragDropZone
                            multiple
                            previewFiles={previewFiles}
                            filesForUpload={filesForUpload}
                            uploadClick={this.uploadImagesHandle}
                            removeFileHandler={this.removeFileHandler}
                            handleDrop={this.handleDrop}
                            handleClick={this.handleClick}
                            loading={loadingImages}
                            loadedFiles={loadedAwsFiles}
                          />
                        </div>
                      </div>
                      <div className="editor-footer">
                        <div className="user-profile">
                          <div className="user-avatar">
                            <Image src={avatar} alt={name} />
                          </div>
                          <div className="user-name">
                            {name}
                          </div>
                        </div>
                        <div className="editor-control">
                          <Button type="submit">Publish</Button>
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
              </>
)}
          </div>
        </>
)
    }
}

export default withRouter(NewPost)