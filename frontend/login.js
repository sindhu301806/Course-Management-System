import React,{useState} from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    console.log("entered login file");
    const [ID,setID]=React.useState('');
    const [password,setPassword]=React.useState('');
    const navigate=useNavigate();
    const handleLogin = async() => {
        console.warn(ID,password);
        let result = await fetch('http://localhost:5000/login',{
            method:'post',
            body: JSON.stringify({ID,password}),
            headers:{
                'Content-Type':'application/json'
            }
        }) ;
        result=await result.json();
        console.warn(result);
        if(result[0].id){
            localStorage.setItem("user",JSON.stringify(result));
            navigate("/home/")
        }else {
            console.log(result);
            alert("Please enter correct credentials");
        }
    }
    return(
        <div className="signin">
            <h1>Login Here!</h1>
            <input type="text" className="inputBox" placeholder="Enter ID" onChange={(e) => setID(e.target.value)} value={ID} />
            <input type="password" className="inputBox" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} value={password} />
            <button onClick={handleLogin} className="appbutton" type="" >Login</button>
        </div>
    )
}

export default Login;