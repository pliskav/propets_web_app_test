/* eslint-disable react/prop-types */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'

import './dragdropzone.scss'
import Icon from '../Icon/Icon';
import ProgressBar from '../ProgressBar/ProgressBar';
import Button from '../Button/Button';
import LoaderSmall from '../Loader/LoaderSmall';


const DragDropZone = (props) => {
const {
  previewFiles,
  uploadPercentage,
  uploadClick,
  removeFileHandler,
  handleDrop,
  handleClick,
  multiple,
  loading,
} = props

  return (
    <>
      <div className="drag-section-container">
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
          <form className="my-form">
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
            <label className="btn" htmlFor="fileElem">
              Browse
            </label>
            <div id="gallery">
              {previewFiles !== null && (
              <>
                {loading ? <LoaderSmall /> : (
                  <>
                    {previewFiles.map((image, i) => (
                      <div className="image-container" key={i}>
                        <img src={image.data} alt="" />
                        <div className="image-control">
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
                  </>
                )}
              </>
            )}
            </div>

          </form>
          {previewFiles.length > 0 && (
            <div className="dndzone-form-control">
              <Button
                onClick={uploadClick}
              >
                Upload
              </Button>
            </div>
      )}
        </div>
      </div>

    </>
  )
}

  export default DragDropZone