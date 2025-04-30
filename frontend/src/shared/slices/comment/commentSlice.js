import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialState = {
    comments: [],
    loading: false,
}

export const createComment = createAsyncThunk(
    'comment/createComment',
    async ({ postId, comment }) => {
        try {
            const { data } = await axios.post(`/comments/${postId}`, {
                postId,
                comment,
            })
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const getPostComments = createAsyncThunk(
    'comment/getPostComments',
    async (postId) => {
        try {
            const { data } = await axios.get(`/posts/comments/${postId}`)
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const getAllComments = createAsyncThunk(
    'comment/getAllComments',
    async () => {
        try {
            const { data } = await axios.get('/comments');  // Запрос на получение всех комментариев
            return data;
        } catch (error) {
            console.log("Error fetching comments:", error); 
        } 
    },
);

export const removeCommentFromAdmin = createAsyncThunk(
    'comment/removeCommentFromAdmin',
    async (commentId) => {
        try {
            const { data } = await axios.delete(`/comments/comments/${commentId}`);
            return data;
        } catch (error) {
            console.log("Error removing comment:", error);
        }
    }
);


export const commentSlice = createSlice({
    name: 'comment',
    initialState, 
    reducers: {},
    extraReducers: {
        // Создание поста 
        [createComment.pending]: (state) => {
            state.loading = true
        },
        [createComment.fulfilled]: (state, action) => {
            state.loading = false
            state.comments.push(action.payload)
        }, 
        [createComment.rejected]: (state) => {
            state.loading = false
        },
        // все комменты
        [getAllComments.pending]: (state) => {
            state.loading = true
        },
        [getAllComments.fulfilled]: (state, action) => {
            state.loading = false;
            // console.log("Comments received in slice:", action.payload); 
            state.comments = action.payload;  
        },
        [getAllComments.rejected]: (state) => {
            state.loading = false
        },
        // Получение комментов
        [getPostComments.pending]: (state) => {
            state.loading = true
        },
        [getPostComments.fulfilled]: (state, action) => {
            state.loading = false
            state.comments = action.payload
        },
        [getPostComments.rejected]: (state) => {
            state.loading = false
        },
        // Removing a comment
        [removeCommentFromAdmin.pending]: (state) => {
            state.loading = true
        },
        [removeCommentFromAdmin.fulfilled]: (state, action) => {
            state.loading = false
            state.comments = state.comments.filter(
                (comment) => comment.id !== action.payload
            )
        },
        [removeCommentFromAdmin.rejected]: (state) => {
            state.loading = false
        },
    },
})

export default commentSlice.reducer
