import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { decreaseFollowing, increaseFollowing } from "./userAuthSlice";

export const followUser = createAsyncThunk(
  "followUser",
  async ({ userId, followedTo, token }, { rejectWithValue,dispatch }) => {
    try {
      await axios.post(`/api/follow/${userId}/${followedTo}`,{},{headers: {Authorization: `Bearer ${token}`}});
        
        dispatch(increaseFollowing());
        dispatch(increaseFollower());

    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);
export const unFollowUser = createAsyncThunk(
  "unFollowUser",
  async ({ userId, followedTo, token }, { rejectWithValue,dispatch }) => {
    try {
      await axios.delete(`/api/unfollow/${userId}/${followedTo}`,{headers: {Authorization: `Bearer ${token}`}});
        dispatch(decreaseFollower());
        dispatch(decreaseFollowing());
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const searchUserProfile = createAsyncThunk(
  "searchUserProfile",
  async ({ payload: { userId, searchedUserId }, token }, reject) => {
    try {
      console.log(userId);
      const { data } = await axios.get(
        `/api/user/${userId}/search/${searchedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data;
    } catch (e) {
      console.log(e);
      return reject.rejectWithValue(e.response.data);
    }
  }
);


export const getFollowers = createAsyncThunk('getFollowers',async ({id,token})=>{
  const {data}=await axios.get(`/api/followers/${id}`,{headers:{"Authorization":`Bearer ${token}`}});
  return data;
})


export const getFollowing = createAsyncThunk('getFollowing',async ({id,token})=>{
  const {data}=await axios.get(`/api/followings/${id}`,{headers:{"Authorization":`Bearer ${token}`}});
  return data;
})

const searchUserProfileSlice = createSlice({
  name: "selectedUser",
  initialState: {
  
    selectedUser: null,
    loading: false,
    error: null,
    followerList:null,
    followingList:null
  },
  reducers: {
    setSearchedUser: (state, action) => {
      return { ...state, selectedUser: action.payload.user };
    },
    increaseFollower: (state) => {
      
      return {
        ...state,
        selectedUser: {
          ...state.selectedUser,
          followersCount: state.selectedUser.followersCount + 1, isFollowed: true 
        },
      };
    },
    decreaseFollower: (state) => {
      return {
        ...state,
        selectedUser: {
          ...state.selectedUser, isFollowed: false,
          followersCount: state.selectedUser.followersCount - 1,
        },
      };
    },
    addFollowers:(state,{payload})=>{
      if(state.selectedUser?.userId == payload.userId)state.followerList.push(payload);
    },
    removeFollowers:(state,{payload})=>{
      if(state.selectedUser?.userId == payload.userId){
        let id = state.followerList.findIndex(f=>f.userId==payload.userId);
        state.followers.splice(id,1);
    }
  }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(searchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFollowers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFollowers.fulfilled, (state,action) => {
        state.loading = false;
        state.followerList=action.payload;
      })
      .addCase(getFollowers.rejected, (state,action) => {
        state.loading = true;
        state.error=action.payload
      })
      .addCase(getFollowing.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFollowing.fulfilled, (state,action) => {
        state.loading = false;
        state.followingList=action.payload;
      })
      .addCase(getFollowing.rejected, (state,action) => {
        state.loading = true;
        state.error=action.payload
      })
  },
});
export const {
  setSearchedUser,
  follow,
  unFollow,
  increaseFollower,
  decreaseFollower,
  addFollowers,
  removeFollowers
} = searchUserProfileSlice.actions;
export default searchUserProfileSlice.reducer;
