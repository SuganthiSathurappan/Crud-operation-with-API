import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios'


const Home = () => {
    const navigate = useNavigate();
    const [logout, setLogout] = useState(false);
    const navigateEmpView = () => { navigate('/getEmpDetails'); };
    const navigateAdduser = () => { navigate('/customerApp'); };
    const navigateUploadImage = () => { navigate('/uploadImg'); };
    const navigateUploadVideo = () => { navigate('/videoUpload'); };

    React.useEffect(() => {
        // axios.get("http://localhost:8080/session")
        // .then((res) => {
        //     var check = res.data
        //     if (check === true) {
        //         alert("Session expired")
        //         navigate('/loginForm')
        //     }
        //     else
        //         alert(check)
        // });

        if (!localStorage.getItem('auth'))
            navigate('/loginForm')
    }, [logout])


    const navigateLogout = () => {
        localStorage.removeItem("auth")
        setLogout(true)
        // navigate('/loginForm')

    };
    return (
        <div>
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top ">
                <div class="container-fluid justify-content-center">
                    <button className="btn btn-outline-success text-white" onClick={navigateEmpView}>
                        View Employee Details</button>
                    <button className="btn btn-outline-success text-white" onClick={navigateAdduser}>
                        Add Employee Details</button>
                        <button className="btn btn-outline-success text-white" onClick={navigateUploadImage}>
                        Upload Image</button>
                    <button className="btn btn-outline-success text-white" onClick={navigateUploadVideo}>
                        Upload Video</button>
                    <button className="btn btn-outline-success text-white" onClick={navigateLogout}>
                        Logout</button>
                </div>
            </nav>
        </div>
    );
}

export default Home;


