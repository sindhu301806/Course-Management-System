import React from "react";
import {Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
const Aline =() => {
    const auth=localStorage.getItem("user");
    const navigate=useNavigate();
    const Logout =() =>{
        localStorage.clear();
        navigate("/login");
    }
    const Home  =() =>{
        navigate("/");
    }
    return(
        <div >
            <ul className="nav-ul">
                <li> { auth ? <Link onClick={Home} to="/home"> Home</Link> :
                <Link to="/">Home</Link>}</li>
                <li><Link to="/course/running">Running Courses Departments</Link></li>
                <li><Link to="/course/">All Courses</Link></li>  
                <li><Link to="/instructor">About instructors</Link></li>
                <li> { auth ? <Link onClick to="/registration"> Registration</Link> :
                <Link to="/login"></Link>}</li>
                <li> { auth ? <Link onClick={Logout} to="/"> Logout</Link> :
                <Link to="/login">Login</Link>}</li>
            </ul>        
        </div >
    )
}

export default Aline;