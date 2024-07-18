import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

export const signup = createAsyncThunk(
  "signup",
  async ({ userData, navigate }, reject) => {
    try {
      const response = await axios.post("/api/auth/signup", userData);
      if (response) {
        toast.success("signup successfully!");
        navigate("/login");
      }
    } catch (e) {
      return reject.rejectWithValue(e.response.data);
    }
  }
);
export const login = createAsyncThunk(
  "login",
  async ({ userData, setCookie, navigate }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post("/api/auth/login", userData);
      if (data) {
        setCookie("token", data.token, { path: "/" });
        navigate("/");
        return data.user;
      }
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);
export const fetchUser = createAsyncThunk(
  "fetchUser",
  async (token, reject) => {
    try {
      const response = await axios.get(`/api/user/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      console.log(e);
      return reject.rejectWithValue(e.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async ({ formData, token }, { rejectWithValue }) => {
    try {
      console.log(formData.get("cover"));
      const { data } = await axios.post("/api/user/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      if (data) {
        toast.success("Update Succesfully");
        return data;
      }
    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);

export const fetchSuggestedUsers = createAsyncThunk(
  "fetchSuggestedUser",
  async ({ id, token }, { rejectwithValue }) => {
    try {
      const { data } = await axios.get(`/api/user/${id}/suggested_users`, {
        headers: { Authorization: `Bearer ${token}`},
      });
      return data;
    }catch (error){
        return rejectwithValue(error.response.data);
    }
  }
);


export const followSuggestedUser = createAsyncThunk(
  "followSuggestedUser",
  async ({ userId, followedTo, token }, { rejectWithValue,dispatch }) => {
    try {
      await axios.post(`/api/follow/${userId}/${followedTo}`,{},{headers: {Authorization: `Bearer ${token}`}});
        dispatch(increaseFollowing());
        dispatch(updateSuggestedUserFollow(followedTo));
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);
export const unFollowSuggestedUser = createAsyncThunk(
  "unFollowSuggestedUser",
  async ({ userId, followedTo, token }, { rejectWithValue,dispatch }) => {
    try {
      console.log(userId,followedTo,token)
      await axios.delete(`/api/unfollow/${userId}/${followedTo}`,{headers: {Authorization: `Bearer ${token}`}});
        dispatch(decreaseFollowing());
        dispatch(updateSuggestedUserFollow(followedTo));
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);


const userAuthSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    suggestedUsers: null,
    loading: false,
    suggestedUsersLoading:false,
    error: null,
  },
  reducers: {
    addUserPost: (state, action) => {
      state.user?.posts.push(action.payload);
    },
    increaseFollowing: (state) => {
      return {
        ...state,
        user: { ...state.user, followingCount: state.user.followingCount + 1 },
      };
    },
    decreaseFollowing: (state) => {
      return {
        ...state,
        user: { ...state.user, followingCount: state.user.followingCount - 1 },
      };
    },
    updateSuggestedUserFollow:(state,{payload})=>{
      let obj = state.suggestedUsers.find(u=>u.userId==payload);
      obj['isFollowed']=!obj.isFollowed;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        (state.loading = false), (state.user = action.payload);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.suggestedUsersLoading = true;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        (state.suggestedUsersLoading = false), (state.suggestedUsers = action.payload);
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.suggestedUsersLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addUserPost, increaseFollowing, decreaseFollowing,updateSuggestedUserFollow } =
  userAuthSlice.actions;

export default userAuthSlice.reducer;
