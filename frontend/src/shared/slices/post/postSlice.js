import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../api/axios'

const initialState = {
    posts: [],
    popularPosts: [],
    loading: false,
    availableTags: ['Anime', 'Movie', 'Lifestyle', 'Gaming', 'Education', 'Food', 'Travel', 'School', 'Sport', 'Art', 'Comics'],
    totalPostsCount: 0, 
}

export const createPost = createAsyncThunk(
    'post/createPost',
    async (params) => {
        try {
            const { data } = await axios.post('/posts', params)
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

// Получение всех постов с поисковым запросом
export const getAllPosts = createAsyncThunk('post/getAllPosts', async ({ searchQuery, page }) => {
    try {
        const { data } = await axios.get(`/posts?searchQuery=${searchQuery}&page=${page}`);
        return data;
    } catch (error) {
        console.log(error);
    }
});


export const getAllPostsNoParams = createAsyncThunk(
    'posts/getAllPostsNoParams',
    async () => {
        try {
            const { data } = await axios.get('/posts/no-params'); 
            return data;
        } catch (error) {
            console.error(error);
        }
    }
);

export const removePost = createAsyncThunk('post/removePost', async (id) => {
    try {
        const { data } = await axios.delete(`/posts/${id}`, id)
        return data
    } catch (error) {
        console.log(error)
    }
}) 

export const removePostFromAdmin = createAsyncThunk(
    'post/removePostFromAdmin',
    async (postId) => {
        try {
            const { data } = await axios.delete(`/posts/posts/${postId}`);
            return data;
        } catch (error) {
            console.log("Error removing post:", error);
        }
    }
);

export const updatePost = createAsyncThunk(
    'post/updatePost',
    async (updatedPost) => {
        try {
            const { data } = await axios.put(
                `/posts/${updatedPost.id}`,
                updatedPost,
            )
            return data
        } catch (error) {
            console.log(error)
        }
    },
)

export const toggleLike = createAsyncThunk(
    'post/toggleLike',
    async ({ postId, userId }) => {
        try {
            const { data } = await axios.put(`/posts/like/${postId}`)
            return { postId, userId, likes: data.post.likes }
        } catch (error) {
            console.log(error)
        }
    },
)

export const selectAvailableTags = (state) => state.post.availableTags;

export const getPostsByTag = createAsyncThunk(
    'post/getPostsByTag',
    async ({ tag, searchQuery, page }) => {
        try {
            const { data } = await axios.get(`/posts/tag/${tag}?searchQuery=${searchQuery}&page=${page}`);
            return data;
        } catch (error) {
            console.log(error);
        }
    },
);

export const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {},
    extraReducers: {
        // Создание поста
        [createPost.pending]: (state) => {
            state.loading = true
        },
        [createPost.fulfilled]: (state, action) => {
            state.loading = false
            state.posts.push(action.payload)
        },
        [createPost.rejected]: (state) => {
            state.loading = false
        },
        // Получаение всех постов
        [getAllPosts.pending]: (state) => {
            state.loading = true
        },
        [ getAllPosts.fulfilled ]: (state, action) => {
            state.loading = false;
            state.posts = action.payload.posts;
            state.popularPosts = action.payload.popularPosts;
            state.totalPostsCount = action.payload.totalPostsCount;  // Обновите это поле
        },
        [getAllPosts.rejected]: (state) => {
            state.loading = false
        },
        // Получение всех постов без фильтрации
        [getAllPostsNoParams.pending]: (state) => {
            state.loading = true
        },
        [getAllPostsNoParams.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = action.payload.posts;
        },
        
        [getAllPostsNoParams.rejected]: (state) => {
            state.loading = false
        },
        // Удаление поста
        [removePost.pending]: (state) => {
            state.loading = true
        },
        [removePost.fulfilled]: (state, action) => {
            state.loading = false
            state.posts = state.posts.filter(
                (post) => post._id !== action.payload._id,
            )
        },
        [removePost.rejected]: (state) => {
            state.loading = false
        },
        // Removing a post from cooment
        [removePostFromAdmin.pending]: (state) => {
            state.loading = true
        },
        [removePostFromAdmin.fulfilled]: (state, action) => {
            state.loading = false;
            state.posts = state.posts.filter(
                (post) => post._id !== action.payload._id 
            );
        },

        [removePostFromAdmin.rejected]: (state) => {
            state.loading = false
        },
        // Обновление поста
        [updatePost.pending]: (state) => {
            state.loading = true
        },
        [updatePost.fulfilled]: (state, action) => {
            state.loading = false
            const index = state.posts.findIndex(
                (post) => post._id === action.payload._id,
            )
            state.posts[index] = action.payload
        },
        [updatePost.rejected]: (state) => {
            state.loading = false
        },
        [toggleLike.fulfilled]: (state, action) => {
            const post = state.posts.find((post) => post._id === action.payload.postId)
            if (post) {
                post.likes = action.payload.likes
            }
        },
        [getPostsByTag.pending]: (state) => {
            state.loading = true
        },
        [ getPostsByTag.fulfilled ]: (state, action) => {
            state.loading = false;
            state.posts = action.payload.posts;
            state.totalPostsCount = action.payload.totalPostsCount;  // Обновите это поле
        },
        [getPostsByTag.rejected]: (state) => {
            state.loading = false
        },
    },
}) 

export default postSlice.reducer
 