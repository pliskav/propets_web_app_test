/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'

import './dragdropzone.scss'
import Icon from '../Icon/Icon';
import Button from '../Button/Button';
import LoaderSmall from '../Loader/LoaderSmall';
import Image from '../Image/Image';


const PostDragDropZone = (props) => {
const {
  previewFiles,
  uploadClick,
  removeFileHandler,
  handleDrop,
  handleClick,
  multiple,
  loading,
  loadedFiles,
} = props

  return (
    <>
      <div className="drag-section-container">
        {loadedFiles.length === 0 ? (
          <>
            {loading ? <LoaderSmall /> : (
              <>
                <div
                  id="drop-area"
                  onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
                  onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
                  onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
                  onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDrop(e);
            }}
                >
                  <form className="post-form">
                    {previewFiles.length > 0 && (
                    <div id="post-gallery">
                      {loading ? <LoaderSmall /> : (
                        <>
                          <div className="main-image-container">
                            <img src={previewFiles[0].data} alt="" />
                            <div className="post-image-control">
                              <Icon
                                type="fa"
                                name="times"
                                className="remove-btn"
                                role="button"
                                tabIndex="0"
                                onClick={() => removeFileHandler(previewFiles[0])}
                                onKeyDown={() => removeFileHandler(previewFiles[0])}
                              />
                            </div>
                          </div>
                          {previewFiles.length > 1 && (
                          <div className="images-wrapper">
                            {previewFiles.filter((it, index) => index > 0).map((image, i) => (
                              <div className="small-image-container" key={i}>
                                <img src={image.data} alt="" />
                                <div className="post-image-control">
                                  <Icon
                                    type="fa"
                                    name="times"
                                    className="remove-btn"
                                    role="button"
                                    tabIndex="0"
                                    onClick={() => removeFileHandler(image)}
                                    onKeyDown={() => removeFileHandler(image)}
                                  />
                                </div>
                              </div>
                    ))}
                          </div>
                    )}
                        </>
                )}
                    </div>
            )}
                    <div className="post-form-input">
                      <p>
                        Drag and drop photos or
                      </p>
                      <input
                        type="file"
                        id="fileElem"
                        multiple={multiple}
                        accept="image/*"
                        onChange={handleClick}
                      />
                      <label className="btn invert" htmlFor="fileElem">
                        Browse
                      </label>
                      {previewFiles.length > 0 && (
                      <div className="post-dndzone-form-control">
                        <Button
                          onClick={uploadClick}
                        >
                          Upload
                        </Button>
                      </div>
      )}
                    </div>
                    {
              previewFiles.length > 0 && (
                <div className="filenames-container">
                  {previewFiles.map((it) => (
                    <>
                      <div className="filename">
                        {it.name}
                      </div>
                    </>
))}
                </div>
              )
            }

                  </form>

                </div>
              </>
            )}
          </>
) : (
  <>
    <div className="upload-success">
      Attached files
    </div>
    <div className="loaded-images">
      {loadedFiles.map((image, i) => (
        <img src={image} key={i} alt="" />
      ))}
    </div>
  </>
        )}
      </div>

    </>
  )
}

  export default PostDragDropZone