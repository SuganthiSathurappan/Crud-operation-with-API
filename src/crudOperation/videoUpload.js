import React, { useState } from 'react';
import axios from 'axios';

const UploadVideo = () => {

    const [title, setTitle] = useState('');
    const [pathName, setPathName] = useState('')
    const [fileName, setFileName] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');

    const saveFile = (e) => {

        const file = e.target.files[0]
        setFileName(file)
        const url = URL.createObjectURL(file)
        setPathName(url)
    };


    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("video", fileName);
        formData.append('title', title);

        axios.post('http://localhost:8080/vupload', formData)
            .then((response) => {
                const { fname, thumbnailPath, Status } = response.data;
                setVideoUrl(fname);

                const imgThumbSrc = 'http://localhost:8080/thumbnail/' + thumbnailPath
                setThumbnailUrl(imgThumbSrc);
                // setThumbnailUrl(thumbnailPath);
                console.log('Video uploaded successfully!', "thumbnailUrl = " + imgThumbSrc, ",", pathName)
                alert(Status + imgThumbSrc)
            })
            .catch((error) => {
                console.error('Error uploading video: ' + error);
            });
    };

    return (
        <div className="fullbody loginpadding">

            <form onSubmit={handleSubmit} className='addContent'>
                <div>
                    <h3 className='head'>Upload Video</h3>
                </div>

                <div className="col mt-4">
                    <label>Title</label>
                    <input type="text" value={title} onChange={handleTitleChange} className="form-control" />
                </div>
                <div className="col mt-4">
                    <label>Video</label>
                    <input type="file" name="file" onChange={(e) => saveFile(e)} accept='video/*' className="form-control" />
                </div>
                <div className='mt-4 head'>
                    <button type="submit" className='btn bg-primary ms-1'>Upload</button>
                </div>


                <div className='mt-4 head'>
                    {thumbnailUrl && (
                        <video controls poster={thumbnailUrl} className="video-player">
                            <source src={pathName} type="video/mp4" />
                        </video>
                    )}                   
                </div> </form>
        </div>
    );
};

export default UploadVideo;
