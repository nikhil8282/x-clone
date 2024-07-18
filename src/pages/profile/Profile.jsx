import { Link, useParams } from "react-router-dom"
import profile from "../../assets/profile.jpg"
import { Navbar } from "../../components/nav1/Navbar"
import Post from "../../components/post/Post"
import "./Profile.scss"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { CircularProgress } from "@mui/material"
import { toast, ToastContainer } from "react-toastify"
import { useCookies } from "react-cookie"
import { addFollowers, followUser, getFollowers, getFollowing, removeFollowers, searchUserProfile, setSearchedUser, unFollowUser } from "../../redux/slices/selectedUserSlice"
import { fetchAllPostsOfUser } from "../../redux/slices/selectedUserPostsSlice"


function Profile() {
  const { searchId } = useParams();
  const { user } = useSelector(state => state.user);
  const { selectedUser, error, loading, followerList, followingList } = useSelector(state => state.selectedUser);
  const { selectedUserPosts, loading: postLoading, error: postError } = useSelector(state => state.selectedUserPosts);
  const [cookies] = useCookies(['token']);
  const [viewFollowers, setViewFollowers] = useState(false);
  const [viewFollowing, setViewFollowing] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    if (searchId == user.userId) {
      dispatch(setSearchedUser({ user }));
      dispatch(fetchAllPostsOfUser({ userId: searchId, token: cookies.token }));
    }
    else if (!selectedUser || searchId != selectedUser.userId) {
      dispatch(searchUserProfile({ payload: { userId: user.userId, searchedUserId: searchId }, token: cookies.token }));
      dispatch(fetchAllPostsOfUser({ userId: searchId, token: cookies.token }));

    }
  }, [])




  const handleViewFollowers = async () => {
    setViewFollowing(false);
    setViewFollowers(!viewFollowers);

    if (!followerList) {
      dispatch(getFollowers({ id: user.userId, token: cookies.token }))
    }


  }

  const handleViewFollowing = async () => {
    setViewFollowers(false);
    setViewFollowing(!viewFollowing);

    if (!followingList) {
      dispatch(getFollowing({ id: user.userId, token: cookies.token }))
    }


  }




console.log(selectedUserPosts)

  const handleFollow = () => {
    dispatch(followUser({ userId: user.userId, followedTo: selectedUser.userId, token: cookies.token }));
    dispatch(addFollowers({ userId: user.userId, profileImage: user.profileImage, fullName: user.fullName, userName: user.userName }));
  }

  const handleUnFollow = () => {
    dispatch(unFollowUser({ userId: user.userId, followedTo: selectedUser.userId, token: cookies.token }));
    dispatch(removeFollowers({ userId: user.userId }));
  }


  if (postError) {
    toast.error(error)
  }
  console.log(followingList)

  if (error) toast.error("error")
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="top">
          <Navbar />
          {
            loading ? <CircularProgress /> :
            <div className="user-info">
              <img className="cover-pic" src={user.coverImage?user.coverImage:profile} alt="" />
              <img className="profile-pic" src={user.profileImage?user.profileImage:profile} alt="" />
              <div className="details">
                <span>{selectedUser?.fullName}</span>
                <span>|</span>
                <span>@{selectedUser?.userName}</span>
              </div>
              {
                selectedUser?.userId == user?.userId ?
                  <Link to={"/profile/update"}>
                    <button className="follow-btn">Update</button>
                  </Link> :
                  <>
                    {
                      selectedUser?.isFollowed ?
                        <button onClick={handleUnFollow} className="f-btn" style={{ background: "#aef5ff" }}>Following</button> :
                        <button onClick={handleFollow} className="f-btn" style={{ background: "#60e9fc" }}>Follow</button>
                    }
                  </>
              }
              <div className="follow-info">
                <div className="followers">
                  <button onClick={handleViewFollowers}>Followers</button>
                  <span>{selectedUser?.followersCount}</span>
                </div>
                <div className="following">
                  <button onClick={handleViewFollowing}>Following</button>
                  <span>{selectedUser?.followingCount}</span>

                </div>
              </div>
            </div>
          }
        </div>
        <div className='mod' style={{display:`${(viewFollowers || viewFollowing)?'block':'none'}`}}>
          
            <div style={{ textAlign: "center" }}>
              {
                viewFollowers ? "Followers" : "Following"
              }

            </div>
          
          
          {
            (viewFollowers ? followerList : followingList)?.map(u => {
              return (
                <div className="followers-item">

                  {/* <Link to={`profile/${u?.userId}`}> */}
                  {/* <img src={u.profileImage ? u.profileImage : profile} alt="" /> */}
                  {/* </Link > */}
                  <img src={profile} alt="" />
                  <div className="name-info">
                    <div className="full-name">Shubam Agarwal</div>
                    <div className="user-name">@shub123</div>
                  </div>
                </div>
              )
            })

          }
        
        </div>
        {
          postLoading && <CircularProgress />
        }
        {
          selectedUserPosts?.length > 0 ?
          <div className="posts">
            {
              selectedUserPosts?.map(post =>
                <Post userId={user?.userId} post={post} key={post?.postId} />
              )
            }  
          </div> :
          <div className="no-posts">
            No posts!
          </div>
        }
      </div>
      <ToastContainer />
    </div>
  )
}

export default Profile