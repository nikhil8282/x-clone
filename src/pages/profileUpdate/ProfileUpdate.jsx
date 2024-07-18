import "./ProfileUpdate.scss"
import profile from "../../assets/profile.jpg"
import EditSharpIcon from '@mui/icons-material/EditSharp';
import { Navbar } from "../../components/nav1/Navbar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../redux/slices/userAuthSlice";
import { useCookies } from "react-cookie";
import { toast, ToastContainer } from "react-toastify";

function ProfileUpdate() {
  const {user,loading,error}=useSelector(state=>state.user);
  const [fullName,setFullName]=useState(user.fullName);
  const [userName,setUserName]=useState(user.userName);
  const [profileImage,setProfileImage]=useState(null);
  const [coverImage,setCoverImage]=useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(['token']);

  const dispatch = useDispatch();

  const handleUpdate = ()=>{
    try{
      if(!profileImage && !coverImage && userName==user.userName && fullName == user.fullName)throw new Error("No changes perform!");
      if(!userName)throw new Error("UserName is not empty!");
      if(userName.length<4)throw new Error("User Name length should be greater than 5");
      if(!fullName)throw new Error("Full Name is not empty!");
      if(fullName.length<5)throw new Error("Full Name length should be greater than 5");
      const formData=new FormData();
      formData.append("userName",userName);
      formData.append("fullName",fullName);
      formData.append("cover",coverImage);
      formData.append("profileImage",profileImage);
      dispatch(updateUser({formData,token:cookie.token}));
    }
    catch(e){
      toast.warn(e.message);
    }
  }
  useEffect(()=>{
    toast.error(error);

  },[error])

  const handleLogout = ()=>{
    removeCookie('token')
  }

  return (
    <div className="profile_update_page">
      <div className="container">
        <Navbar/>        
        <div className="item">
          <div className="cover-edit">

            <img className="cover-image" src={user.coverImage?user.coverImage:coverImage?URL.createObjectURL(coverImage):profile} alt="" />
            <span onClick={()=>{document.getElementById("c-edit-pen").click()}}><EditSharpIcon className="cover-edit-btn" /></span>
            <input type="file" accept="image/jpeg,image/png" id="c-edit-pen" style={{display:"none"}} onChange={e=>setCoverImage(e.target.files[0])} />

          </div>
          <div className="profile-edit">

            <img className="profile-logo" src={user.profileImage?user.profileImage:profileImage?URL.createObjectURL(profileImage):profile} alt="" />
            <span  onClick={()=>{document.getElementById("p-edit-pen").click()}}><EditSharpIcon className="profile-edit-btn"/></span>
            <input type="file" accept="image/jpeg,image/png" id="p-edit-pen" style={{display:"none"}} onChange={e=>setProfileImage(e.target.files[0])}/>
          </div>

          <input type="text" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
          <input type="text" placeholder="Username" value={userName} onChange={e=>setUserName(e.target.value)}/>

          <button className="update_btn" onClick={handleUpdate}>Update</button>
          <button className="update_btn" onClick={handleLogout}>logout</button>

        </div>
      </div>
      <ToastContainer />  
    </div>
  )
}

export default ProfileUpdate