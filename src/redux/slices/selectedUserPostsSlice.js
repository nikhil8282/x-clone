import { createAsyncThunk, createSlice, current} from "@reduxjs/toolkit";
import axios from "axios";


export const fetchAllPostsOfUser = createAsyncThunk(
    "fetchAllPostsOfUser",
    async ({userId,token}, { rejectWithValue }) => {
      try {
        const { data } = await axios.get(`/api/post/user/${userId}`,{
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

export const selectedUserPostsSlice = createSlice({
    name: "selectedUserPosts",
    initialState: {
      error: null,
      loading: false,
      selectedUserPosts:null,
    },
    reducers:{
      fetchSelectedUserComments:(state,{payload})=>{
        let obj = state.selectedUserPosts?.find(p=>p.postId==payload.postId);
        if(obj){
          obj['comments']=payload.comments;
          console.log(current(obj))
        }
      },
      addSelectedUserComments:(state,{payload})=>{
        let obj = state.selectedUserPosts?.find(p=>p.postId==payload.postId);
        if(obj)obj.comments=[payload.comment,...obj.comments];
      },
    },
    extraReducers: (build) => {
      build
      
        
        .addCase(fetchAllPostsOfUser.pending, (state) => {
          state.loading = true;
        })
        .addCase(fetchAllPostsOfUser.fulfilled, (state, action) => {
          state.loading = false;
          state.selectedUserPosts = [...action.payload];
        })
        .addCase(fetchAllPostsOfUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    },
  });
  export const {fetchSelectedUserComments,addSelectedUserComments}=selectedUserPostsSlice.actions;
export default selectedUserPostsSlice.reducer;
  
