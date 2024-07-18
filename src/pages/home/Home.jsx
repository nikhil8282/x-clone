import logo from "../../assets/logo.png"
import profile from "../../assets/profile.jpg"
import PhotoIcon from '@mui/icons-material/Photo';
import "./Home.scss"
import { Link } from "react-router-dom";
import Post from "../../components/post/Post";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { createPost, fetchAllPosts } from "../../redux/slices/postReducer";
import { toast, ToastContainer } from "react-toastify";
import { useCookies } from "react-cookie";
import { CircularProgress } from "@mui/material";
import SearchUser from "../../components/searchUser/SearchUser";
import SuggestUser from "../../components/suggestedUser/SuggestedUsers";

function Home() {
  const dispatch = useDispatch();
  const [cookies]=useCookies(['token']);
  const [image,setImage]=useState(null);
  const { user,loading:userLoading} = useSelector(state => state.user);
  const { posts, fetchPostsLoading,createPostLoading, error } = useSelector(state => state.posts);
  const [content, setContent] = useState("");


  useEffect(() => {
    console.log('called')
    if(user && !posts)dispatch(fetchAllPosts({id:user?.userId,token:cookies.token}));
  }, [user])


  // Create Post
  const handleCreatePost = (e) => {
    // e.preventDefault();
    try {
    if(!content.length && image==null){
      throw new Error("Something went wrong")
    }
    dispatch(createPost({payload:{
      postDes:content?content.trim():null,
      image,
      userId:user?.userId
    },token:cookies.token }));
  } catch (e) {
    toast.error(error)
    console.log(e);
  }
  setContent("");
  } 

  return (
    <div className="home">
{
  userLoading?<CircularProgress/>:
      <div className="home_dashboard">

        {/* navbar component*/}
        <div className="navbar">
          <img className="logo" src={logo} alt="" />

          <Link to="/profile/update">
            <img className="profile-logo" src={user.profileImage?user.profileImage:profile} alt="" />
          </Link>
        </div>

        {/* post creation component */}
        <div className="post-creation">
          <div className="p-c-left">
            <Link to={`/profile/${user?.userId}`}>
            <img src={user.profileImage?user.profileImage:profile} alt=""  />
            </Link>
          </div>
          <div className="p-c-right">
            <textarea type="text" placeholder="Type something here" value={content} onChange={e => setContent(e.target.value)} />
            <div className="p-c-bottom">
              <PhotoIcon className="img-icon" />
              <input type="file" accept="image/png, image/jpeg" onChange={e=>setImage(e.target.files[0])}/>
{
  createPostLoading?<CircularProgress/>:
              <button className="p-c-btn" onClick={e => { handleCreatePost(e) }}> + posts</button>
}
            </div>
          </div>
        </div>
        {/* post component */}
          <SearchUser/>     
          <div className="posts">
        {
            fetchPostsLoading ? <div >loading...</div> :
            
              posts?.map(post=>

            <Post userId={user?.userId} post={post} key={post?.postId}/>

              )
            
          }
          </div>
            
      </div>
}
<SuggestUser/>

      <ToastContainer />

    </div>
  )
}

export default Home