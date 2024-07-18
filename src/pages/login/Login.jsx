import "./Login.scss"
import logo from "../../assets/logo.png"
import { Link, useNavigate} from "react-router-dom"
import {  useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/userAuthSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from "@mui/material";
import { useCookies } from "react-cookie";
  
function Login() {
    const [cookie,setCookie]=useCookies(['token']);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const {loading,error}=useSelector(state=>state.user);
    const handleLogin = ()=>{
        try{
            let emailRegex = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
            if(!email || !password)throw new Error("All values are required!");
            if (!emailRegex.test(email))throw new Error("please enter valid email");
            if(password.length<7)throw new Error("Password length should be greater than 7");
            dispatch(login({userData:{email,password},setCookie,navigate}));
        }
        catch(e){
            toast.error(e.message)
            console.log(e)
        }
    }
    
    useEffect(()=>{
        if(error)toast.error(error);
    },[error])
    
    
  return (
    <div className="login_page">
        <div className="box">
            <div className="item">
            <div className="logo">
                <img src={logo} alt="" />
            </div>
            <div>login</div>
                <input type="text" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)}/>
                <input type="password" placeholder="password" value={password} onChange={e=>setPassword(e.target.value)}/>
                <button className="login_btn" onClick={handleLogin}>
                    {loading?<CircularProgress/>:"login"}
                    </button>
            </div>
            <span>
                <Link className="signup-link" to="/signup">
                signup 
                </Link>
            </span>
            <ToastContainer/>
        </div>
    </div>
  )
}

export default Login