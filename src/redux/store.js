import { configureStore } from "@reduxjs/toolkit";
import useReducer  from "./slices/userAuthSlice";
import postReducer  from "./slices/postReducer";
import selectedUserReducer from "./slices/selectedUserSlice";
import selectedUserPostsReducer from "./slices/selectedUserPostsSlice";
export default configureStore({
    reducer:{
        user:useReducer,
        posts:postReducer,
        selectedUser:selectedUserReducer,
        selectedUserPosts:selectedUserPostsReducer,

    }
})