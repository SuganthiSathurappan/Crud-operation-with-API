import React, { useEffect, useState } from 'react';


const ImageDisplay = () => {

  return <img src='http://localhost:8080/thumbnail/1686805536262.png' alt="Displayed Image" />;
};

export default ImageDisplay;





// import React, { useState } from 'react';
// import axios from 'axios';
// import Dropzone from 'react-dropzone';

// const UploadVideo = () => {
//   const [thumbnail, setThumbnail] = useState('');

//   const handleDrop = async acceptedFiles => {
//     const file = acceptedFiles[0];

//     // Create a FormData object to send the file
//     const formData = new FormData();
//     formData.append('video', file);

//     try {
//       // Upload the video to the backend
//       const response = await axios.post('/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       // Set the thumbnail URL received in the response
//       setThumbnail(URL.createObjectURL(new Blob([response.data])));
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <Dropzone onDrop={handleDrop}>
//         {({ getRootProps, getInputProps }) => (
//           <div {...getRootProps()}>
//             <input {...getInputProps()} />
//             <p>Drag and drop a video file here, or click to select a file</p>
//           </div>
//         )}
//       </Dropzone>
//       {thumbnail && <img src={thumbnail} alt="Thumbnail" />}
//     </div>
//   );
// };

// export default UploadVideo;
