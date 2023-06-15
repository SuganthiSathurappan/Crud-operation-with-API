import React, { useState } from 'react'
import axios from 'axios'

export default function UploadImg() {

    const [file, setFile] = useState();
    const [fileName, setFileName] = useState("");

    const saveFile = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
    };

    const uploadFile = async (e) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", fileName);
        try {
            const res = await axios.post("http://localhost:8080/upload", formData);
            alert(res)
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <div className="fullbody loginpadding">
            <form className='addContent'>
                <input type="file" name="file" accept='image/*' onChange={saveFile} />
                <input type="submit" value="Upload" onClick={uploadFile} />
            </form>
        </div>
    )
}
