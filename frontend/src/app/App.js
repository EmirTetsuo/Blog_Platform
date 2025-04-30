import { Layout } from './layout/Layout.jsx'
import { Routes, Route } from 'react-router-dom'

import { MainPage } from '../pages/MainPage.jsx'
import { PostsPage } from '../pages/PostsPage.jsx'
import { PostPage } from '../pages/PostPage.jsx'
import { AddPostPage } from '../pages/AddPostPage.jsx'
import { RegisterPage } from '../pages/RegisterPage.jsx'
import { LoginPage } from '../pages/LoginPage.jsx'
import { EditPostPage } from '../pages/EditPostPage.jsx'
import { DashBoard } from '../pages/Dashboard.jsx'
import { UpdateUser } from '../pages/UpdateUser.jsx'
import { NotFound } from '../pages/404.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getMe } from '../shared/slices/auth/authSlice.js'

function App() {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getMe())
    }, [dispatch])

    return (
        <Layout>
            <Routes>
                <Route path='/' element={<MainPage />} />
                
                <Route path='/posts' element={<PostsPage />} />
                <Route path='/posts/new' element={<AddPostPage />} />
                <Route path='/post/:id' element={<PostPage />} />
                <Route path='/post/:id/edit' element={<EditPostPage />} />
                
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/dashboard' element={<DashBoard />} />
                <Route path='/update_user' element={<UpdateUser />} />
                
                <Route path='*' element={<NotFound />} />
                </Routes>
            <ToastContainer position='bottom-right' />
        </Layout>
    )
}

export default App
