import axios from 'axios';
import profile from "../../assets/profile.jpg"
import { useCallback, useEffect, useState } from 'react';
import "./SearchUser.scss"
import { useCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
function SearchUser() {
    const [cookies] = useCookies(['token']);
    const [searchValue, setSearchValue] = useState("");
    const [searchResult, setSearchResult] = useState(null);

    const debounce = (fun) => {
        let time;
        return (val) => {
            clearTimeout(time);
            let context = this;
            time = setTimeout(() => {
                fun.apply(context, [val]);
            }, 600);
        }
    }

    const handleSearchApi = async (val) => {
        try {
            const response = await axios.get(`/api/user/search?user_name=${val}&full_name=${val}`, {
                headers: {
                    Authorization: `Bearer ${cookies.token}`
                }
            });
            if (response.data) setSearchResult(response.data);
        }
        catch (e) {
            console.log(e.response.data)
        }
    }

    const debounceCustom = useCallback(debounce(handleSearchApi), []);
    useEffect(() => {
        if (searchValue.length) {
            debounceCustom(searchValue);
        }
        else {
            setSearchResult(null)
        }
    }, [searchValue])

    return (
        <div className='search-box'>

            <div className="search-input">
                <input type="text" placeholder='Search users here' value={searchValue} onChange={(e) => { setSearchValue(e.target.value) }} />
                <button>search</button>
            </div>
            <div className="search-result-box">
                {
                    searchValue.length > 0 && searchResult?.map(u => (
                        <Link to={`profile/${u?.userId}`} key={u.userId} style={{
                            textDecoration: 'none',
                            color: 'black'
                        }}>
                            <div className="item" >
                                <img src={u.profileImage?u.profileImage:profile} alt="" />
                                <div className="info">
                                    <div className="full-name">{u.fullName}</div>
                                    <div className="user-name">@{u.userName}</div>
                                </div>
                            </div>
                        </Link>
                    ))
                }
            </div>

        </div>
    )
}

export default SearchUser