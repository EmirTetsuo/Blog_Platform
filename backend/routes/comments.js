import { Router } from 'express'
const router = new Router()
import { checkAuth } from '../utils/checkAuth.js'
import { createComment, getAllComments, removeCommentFromAdmin } from '../controllers/comments.js'

// Create Comment
// http://localhost:3002/api/comments/:id
router.post('/:id', checkAuth, createComment)


// Get All Comments
// http://localhost:3002/api/comments/
router.get('/', getAllComments)


// Remove comment
// http://localhost:3002/api/auth/comments/:id
router.delete('/comments/:id', removeCommentFromAdmin);

export default router
 