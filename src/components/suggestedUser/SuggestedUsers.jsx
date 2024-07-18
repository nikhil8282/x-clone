import { useDispatch, useSelector } from "react-redux"
import profile from "../../assets/profile.jpg"
import "./SuggestedUsers.scss"
import { useEffect } from "react";
import { fetchSuggestedUsers, followSuggestedUser, unFollowSuggestedUser } from "../../redux/slices/userAuthSlice";
import { useCookies } from "react-cookie";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";
function SuggestedUsers() {
    const { user, suggestedUsers, suggestedUsersLoading } = useSelector(state => state.user);
    const [cookie] = useCookies(['token']);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!suggestedUsers) dispatch(fetchSuggestedUsers({ id: user.userId, token: cookie.token }))
    }, [user])


    const handleFollow = (id) => {
        dispatch(followSuggestedUser({ userId: user.userId, followedTo: id, token: cookie.token }));
    }

    const handleUnFollow = (id) => {
        dispatch(unFollowSuggestedUser({ userId: user.userId, followedTo: id, token: cookie.token }));
    }
  

    



    return (
        <div className='suggested-container'>
            <h5>Suggested User</h5>
            <div className="s-users">
                {
                    suggestedUsersLoading &&
                    <div style={{ margin: "10px 0px", textAlign: "center" }}>
                        <CircularProgress />
                    </div>
                }

                {suggestedUsers && suggestedUsers.map(u => (

                    <div className="s-user" key={u.userId}>
                        <div className="left">
                            <Link to={`profile/${u?.userId}`}>
                                <img src={u.profileImage ? u.profileImage : profile} alt="" />
                            </Link >
                        </div>
                        <div className="right">
                            <div className="name-info">
                                <div className="f-name">{u.fullName}</div>
                                <div className="u-name">@{u.userName}</div>
                            </div>
                            {
                                u.isFollowed?
                                <button onClick={()=>{handleUnFollow(u.userId)}}  style={{background:"#60e9fc"}}>following</button>:
                                <button onClick={()=>{handleFollow(u.userId)}} style={{background:"#aef5ff"}}>follow</button>
                            }
                        </div>
                    </div>
                ))
                }
            </div>
            {/* 38932594 */}

        </div>
    )
}

export default SuggestedUsers