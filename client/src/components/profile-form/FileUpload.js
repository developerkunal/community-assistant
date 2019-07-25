import React, { Fragment, useState } from "react";
import axios from "axios";
import Progress from "./Progress";
const FileUpload = () => {
  const [file, setFile] = useState();
  const onChange = e => {
    setFile(e.target.files[0]);
  };
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadedFile, setUploadedFile] = useState({});
  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/api/profile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total),
            ),
          );
          setTimeout(() => setUploadPercentage(0), 10000);
        },
        //clear percentage
      });
      const { filename, filePath } = res.data;
      setUploadedFile({ filename, filePath });
    } catch (err) {
      if (err.response.status === 500) {
        console.log("Problem With Server");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };
  return (
    <Fragment>
      <form onSubmit={onSubmit}>
        {uploadedFile ? (
          <div className='text-center'>
            {" "}
            <img
              className='round-img my-1'
              src={uploadedFile.filePath}
              alt={uploadedFile.name}
            />
          </div>
        ) : null}

        <div className='custom-file text-center'>
          <input
            type='file'
            className='custom-file-input'
            id='customfile'
            onChange={onChange}
          />
          <br />
        </div>

        <br />
        <Progress percentage={uploadPercentage} />
        <br />
        <div className='text-center'>
          <input
            type='submit'
            value='Upload'
            className='btn btn-primary btn-block mt-4'
          />
        </div>
      </form>
    </Fragment>
  );
};

export default FileUpload;
