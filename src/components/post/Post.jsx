// import { useState } from "react";
import profile from "../../assets/profile.jpg"
import { Link } from "react-router-dom";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import InsertCommentOutlinedIcon from '@mui/icons-material/InsertCommentOutlined';
import "./Post.scss"
import { useState } from "react";
import { timeAgo } from "../../config";
import { useDispatch} from "react-redux";
import { useCookies } from "react-cookie";
import { disLikePost, getComments, likePost, setComment } from "../../redux/slices/postReducer";
function Post({post,userId}) {
  const [showComment, setShowComment] = useState(false);
  const [commentText,setCommentText]=useState("");
  const [cookie]=useCookies(['token']);
  const dispatch = useDispatch();

    // handleLike 
    const handleLike =(postId)=>{
      dispatch(likePost({payload:{postId,userId},token:cookie.token}));
    }
    
    // handleDislike
    const handleDisLike =(postId)=>{
      dispatch(disLikePost({payload:{postId,userId},token:cookie.token}));
    }
  
    // handleComment
    const handleComment =(postId,commentText)=>{
      dispatch(setComment({payload:{userId,postId,comment:commentText},token:cookie.token}));
    }



  const handleOpen = ()=>{
    setShowComment(!showComment);
    if(!post.comments){
      dispatch(getComments({postId:post?.postId,token:cookie.token}))
    }
  }

  return (
    <>

          <div className="post" key={post?.postId}>
            <div className="post-box">

              <div className="p-left">
                <Link to={`profile/${post?.userId}`}>
                  <img className="profile-icon" src={post?.profileImage ? post?.profileImage:profile} alt="" />
                </Link>
              </div>
              <div className="p-right">
                <div className="p-r-top">
                  <div className="post-info">
                    <div>{post?.fullName}</div>
                    <div>@{post?.userName}</div>
                  </div>
                  <div className="post-time">{timeAgo.format(post.createdAt?new Date(post.createdAt):new Date.now())}</div>
                </div>
                <div className="p-r-mid">
                  <p>{post?.postDes}</p>
                  {post.postImage && <img src={post.postImage} alt="" />}
                </div>
                <div className="p-r-bottom">
                  <div className="like-btn" >
                    {
                      post.isLiked ?
                        <span onClick={() => handleDisLike(post?.postId)}>
                          <FavoriteOutlinedIcon style={{ color: 'red' }} />
                        </span>
                        :
                        <span onClick={() => handleLike(post?.postId)}>
                          <FavoriteBorderOutlinedIcon />
                        </span>
                    }
                    <span>{post?.likeCount}</span>
                  </div >
                  <div className="comment-btn"  onClick={handleOpen}> <InsertCommentOutlinedIcon /> </div>
                  <div className="share-btn">
                    <SendOutlinedIcon />
                  </div>
                </div>

              </div>
            </div>
            {
              showComment &&
            <div className="post-comment-box">
              <div className="comments">

                {
                  post.comments && post.comments.length>0 && post.comments.map(c=>(
                    <div className="comment" key={c.createdAt}>
                    <div className="c-left">
                      <Link to={`profile/${c?.userId}`}>
                        <img className="profile-icon" src={c.profileImage?c.profileImage:profile} alt="" />
                      </Link>
                    </div>
                    <div className="c-right">
                      <div className="c-r-top">
                        <div className="c-info">
                          <div>{c?.fullName}</div>
                          <div>@{c?.userName}</div>
                        </div>
                        <div className="c-time">{timeAgo.format(new Date(c?.createdAt))}</div>
                      </div>
                      <div className="c-r-mid">
                  {c.comment}
                </div>
                    </div>
                  </div>
                  ))
                }
               
              </div>
              <div className="comment-input">
                <input type="text"  placeholder="comment here!" value={commentText} onChange={e=>setCommentText(e.target.value)}/>
                <button onClick={()=>{setCommentText("");handleComment(post?.postId,commentText)}}>send</button>
              </div>
            </div>
            }

          </div>



    </>
  )
}

export default Post