import "./Signup.scss"
import logo from "../../assets/logo.png"
import { Link, useNavigate } from "react-router-dom"
import {  useState } from "react";
import { signup } from "../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
function Signup() {
    const [userName,setUserName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [fullName,setFullName]=useState("");
    const navigate = useNavigate();
    const {loading}=useSelector(state=>state.user);
    const dispatch = useDispatch();
    const handleSignup = ()=>{
        try{
            let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
            if(!userName || !fullName || !email || !password)throw new Error("All values are required!");
            if(userName.length<4)throw new Error("User Name length should be greater than 3");
            if(fullName.length<5)throw new Error("Full Name length should be greater than 4");
            if(password.length<7)throw new Error("Password length should be greater than 7");
            if (!emailRegex.test(email))throw new Error("please enter valid email");
            dispatch(signup({userData:{userName,fullName,email,password},navigate}));
        }
        catch(e){
            toast.error(e.message)
            console.log(e)
        }
    }
    
   
    
  return (
    <div className="signup_page">
        <div className="box">
            <div className="item">
            <div className="logo">
                <img src={logo} alt="" />
            </div>
            <div>signup</div>
                <input type="text" placeholder="full name" value={fullName} onChange={e=>setFullName(e.target.value)} required/>
                <input type="text" placeholder="username" value={userName} onChange={e=>setUserName(e.target.value)} required/>
                <input type="email" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
                <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
                <button className="Signup_btn" onClick={handleSignup}>                {loading?<CircularProgress/>:"signup"}</button>
            </div>
            <span>
                <Link className="login-link" to="/login">
                login 
                </Link>
            </span>
        </div>
        <ToastContainer/>
    </div>
  )
}

export default Signup