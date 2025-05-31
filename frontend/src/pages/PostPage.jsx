import React, { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import axios from '../shared/api/axios'
import { createComment, getPostComments } from '../shared/slices/comment/commentSlice'
import { CommentItem } from '../widgets/CommentItem'
import { PostItem } from '../widgets/PostItem'
import { CircularProgress, Typography } from "@mui/material";


export const PostPage = () => {
    const [post, setPost] = useState(null)
    const [comment, setComment] = useState('')

    const { user } = useSelector((state) => state.auth)
    const { comments } = useSelector((state) => state.comment)
    const params = useParams()
    const dispatch = useDispatch()

    const handleSubmit = () => {
        try {
            const postId = params.id
            dispatch(createComment({ postId, comment }))
            setComment('')
        } catch (error) {
            console.log(error)
        }
    }

    const fetchComments = useCallback(async () => {
        try {
            dispatch(getPostComments(params.id))
        } catch (error) {
            console.log(error)
        }
    }, [params.id, dispatch])

    const fetchPost = useCallback(async () => {
        const { data } = await axios.get(`/posts/${params.id}`)
        setPost(data)
    }, [params.id])

    useEffect(() => {
        fetchPost()
    }, [fetchPost])

    useEffect(() => {
        fetchComments()
    }, [fetchComments])
    
    if (!post) {
        return  <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;
    }

    return (
        <div className='p-4'>
            <button className='bg-gray-700 text-xs text-white rounded-sm py-2 px-4 mb-6 hover:bg-gray-600 transition'>
                <Link to='/' className='flex'>
                    Назад
                </Link>
            </button>

            <div className='flex max-md:flex-col gap-8'>
                <div className='w-full'>
                    <PostItem post={post} />
                </div>

                <div className='w-full max-md:p-3 bg-gray-800 rounded-lg p-6'>
                    <form
                        className='flex gap-4 mb-4'
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            type='text'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder='Напишите комментарий...'
                            className='w-full rounded-sm bg-gray-600 border p-3 text-xs text-white placeholder:text-gray-400 focus:outline-none'
                        />
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className='bg-blue-600 text-white rounded-sm py-2 px-4 text-xs hover:bg-blue-700 transition'
                            disabled={!user}
                        >
                            Отправить
                        </button>
                    </form>

                    <div className='space-y-4 max-h-[400px] overflow-y-auto pr-2'>
                        {comments?.map((cmt) => (
                            <CommentItem key={cmt._id} cmt={cmt} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
