import { Router } from 'express'
import { register, login, getMe, getAllUsers, removeUserFromAdmin, updateUser, toggleFavorite, getFavorites, } from '../controllers/auth.js'
import { checkAuth } from '../utils/checkAuth.js'
const router = new Router()

// Register
// http://localhost:3002/api/auth/register
router.post('/register', register)

// Login
// http://localhost:3002/api/auth/login
router.post('/login', login)

// Get Me
// http://localhost:3002/api/auth/me
router.get('/me', checkAuth, getMe)

// Get All users
// http://localhost:3002/api/auth/users
router.get('/', getAllUsers) 

// Remove User
// http://localhost:3002/api/auth/users/:id
router.delete('/users/:id', removeUserFromAdmin);

router.put('/user/update', checkAuth, updateUser);

router.put('/favorite/:id', checkAuth, toggleFavorite);

router.get('/favorites', checkAuth, getFavorites);

export default router
 