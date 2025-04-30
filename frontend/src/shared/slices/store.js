import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth/authSlice'
import postSlice from './post/postSlice'
import commentSlice from './comment/commentSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice,
        post: postSlice,
        comment: commentSlice,
    },
})
