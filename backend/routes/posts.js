import { Router } from 'express'
import {
    createPost,
    getAll,
    getById,
    getMyPosts,
    removePost,
    updatePost,
    toggleLike,
    getPostComments,
    getPostsByTag,
    removePostFromAdmin,
    getAllPostsNoParams,
} from '../controllers/posts.js'
import { checkAuth } from '../utils/checkAuth.js'
const router = new Router()

// Create Post
// http://localhost:3002/api/posts
router.post('/', checkAuth, createPost)

// Get All Posts
// http://localhost:3002/api/posts
router.get('/', getAll)

// Get All PostsNoParams
// http://localhost:3002/api/posts/no-params
router.get('/no-params', getAllPostsNoParams)

// Get Post By Id
// http://localhost:3002/api/posts/:id
router.get('/:id', getById)

// Update Post
// http://localhost:3002/api/posts/:id
router.put('/:id', checkAuth, updatePost)

// Get My Posts
// http://localhost:3002/api/posts/user/me
router.get('/user/me', checkAuth, getMyPosts)

// Remove Post
// http://localhost:3002/api/posts/:id
router.delete('/:id', checkAuth, removePost)

// Remove post from admin
// http://localhost:3002/api/posts/posts/:id
router.delete('/posts/:id', removePostFromAdmin);

// Get Post Comments
// http://localhost:3002/api/posts/comments/:id
router.get('/comments/:id', getPostComments)

// Like/Unlike Post
// http://localhost:3002/api/posts/like/:id
router.put('/like/:id', checkAuth, toggleLike)

// Get Posts By Tag
// http://localhost:3002/api/posts/tag/:tag
router.get('/tag/:tag', getPostsByTag)




export default router
