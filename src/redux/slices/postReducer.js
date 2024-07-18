import { createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import { addSelectedUserComments, fetchSelectedUserComments } from "./selectedUserPostsSlice";

export const createPost = createAsyncThunk(
  "createPost",
  async ({payload,token}, { rejectWithValue, dispatch}) => {
    try {
      const formData = new FormData();
      formData.append("postDes",payload.postDes);
      formData.append("image",payload.image);
      formData.append("userId",payload.userId);
      console.log(formData.get('image'));
      const {data} = await axios.post("/api/post/", formData,{
        headers:{
          "Content-Type": 'multipart/form-data',
          "Authorization":`Bearer ${token}`
        }
      });
      if(data){
      dispatch(addPost(data));
      }
    } catch (e) {
      console.log(e.response.data);
      return rejectWithValue(e.response.data);
    }
  }
);

export const fetchAllPosts = createAsyncThunk(
  "fetchAllPosts",
  async ({id,token}, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/post/${id}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      return data;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const likePost = createAsyncThunk(
  "likePost",
  async ({payload:{userId,postId},token}, { rejectWithValue,dispatch }) => {
    try {
      await axios.post(`/api/like/${userId}/${postId}`,{},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      dispatch(like({postId}));

    } catch (e) {
      return rejectWithValue(e.response.data);
    }
  }
);
export const disLikePost = createAsyncThunk(
  "disLikePost",
  async ({payload:{userId,postId},token}, { rejectWithValue ,dispatch}) => {
    try {
      dispatch(disLike({postId}))
      await axios.delete(`/api/like/${userId}/${postId}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const setComment = createAsyncThunk(
  "setComment",
  async ({ payload, token }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(`/api/comment/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(data)
      {
        dispatch(addSelectedUserComments({comment:data,postId:payload.postId}))
        dispatch(addComment({comment:data,postId:payload.postId}));
      }
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);

export const getComments = createAsyncThunk(
  "commentPost",
  async ({ postId, token }, { rejectWithValue,dispatch }) => {
    try {
      const { data } = await axios.get(`/api/comments/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if(data){

        dispatch(fetchSelectedUserComments({comments:data,postId}))
        dispatch(fetchComments({comments:data,postId}))
      }
      // return data;
    } catch (e) {
      console.log(e);
      return rejectWithValue(e.response.data);
    }
  }
);


export const postSlice = createSlice({
  name: "posts",
  initialState: {
    error: null,
    createPostLoading: false,
    fetchPostsLoading:false,
    posts:null,
  
  },
  reducers:{
    addPost:(state,{payload})=>{
      state.posts=[payload,...state.posts]
    },
    like:(state,{payload})=>{
      let obj = state.posts.find(p =>p.postId == payload.postId);
      obj['isLiked']=true;
      obj['likeCount']=obj.likeCount+1;
    },
    disLike:(state,{payload})=>{
      let obj = state.posts.find(p =>p.postId == payload.postId);
      obj['isLiked']=false;
      obj['likeCount']=obj.likeCount-1;
    },
    fetchComments:(state,{payload})=>{
        let obj = state.posts.find(p=>p.postId==payload.postId);
      if(obj)obj['comments']=payload.comments;
    },
    addComment:(state,{payload})=>{
      let obj = state.posts.find(p=>p.postId==payload.postId);
      if(obj)obj['comments']=[payload.comment,...obj.comments];
    }
    

  },
  extraReducers: (build) => {
    build
      .addCase(createPost.pending, (state) => {
        state.createPostLoading = true;
      })
      .addCase(createPost.fulfilled, (state) => {
        state.createPostLoading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createPostLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllPosts.pending, (state) => {
        state.fetchPostsLoading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.fetchPostsLoading = false;
        state.posts = [...action.payload];
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.fetchPostsLoading = false;
        state.error = action.payload;
      })
      

  },
});
export const {like,disLike,addComment,fetchComments,addPost}=postSlice.actions;
export default postSlice.reducer;
