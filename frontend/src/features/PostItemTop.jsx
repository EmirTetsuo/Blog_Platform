import React, { useState } from 'react';
import Moment from 'react-moment';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AiTwotoneEdit, AiFillDelete } from 'react-icons/ai'; 
import { toast } from 'react-toastify'
import { removePost, getAllPosts  } from '../shared/slices/post/postSlice'
import axios from '../shared/api/axios'
import { pathKeys } from '../shared/router/config';
import AvatarImg from "../shared/assets/img/User-avatar.png";

export const PostItemTop = ({ post }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userId = user?._id;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
    const API_URL = process.env.REACT_APP_API_URL;
    const getFullUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_URL}/${url}`;
    };
    const removePostHandler = async () => {
        try {
            // Отправляем запрос на сервер для удаления поста
            await axios.delete(`/posts/${post._id}`);  // Здесь удаляем пост с сервера
            setIsDropdownOpen(false);
            dispatch(removePost(post._id));  // Обновляем состояние Redux (если нужно)
            const searchQuery = ''
            const page = 1
            dispatch(getAllPosts({ searchQuery, page }))
            toast('Пост был удален');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Произошла ошибка при удалении поста');
        }
    };

    const toggleDropdown = () => setIsDropdownOpen((prev) => !prev); 
    
    if (!post) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Загрузка...
            </div>
        );
    }

    return (
        <div className='bg-white px-4 py-2'>
            <div className="flex justify-between items-center">
                <div className='flex items-center gap-2'>
                    <img
                        src={post?.authorAvatar ? getFullUrl(post.authorAvatar) : AvatarImg}
                        alt="Author avatar"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className='text-md font-semibold text-gray-800'>{post.username}</div>
                </div>
                <div className='relative flex items-center'>
                    <div className='text-sm text-gray-500'>
                        <Moment date={post.createdAt} format='DD.MM.YYYY' />
                    </div>
                    {userId === post.author && (
                        <button
                            onClick={toggleDropdown}
                            className='ml-2 text-gray-500 hover:text-gray-700'
                        >
                            &#x22EE;
                        </button>
                    )}
                    {isDropdownOpen && (
                        <div className="absolute z-10 right-0 top-6 bg-white border rounded-lg shadow-lg p-2">
                            <Link to={pathKeys.posts.editById(post._id)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-2">
                                <AiTwotoneEdit /> Редактировать
                            </Link>
                            <button
                                onClick={removePostHandler}
                                className="flex items-center gap-2 text-red-500 hover:text-red-700"
                            >
                                <AiFillDelete /> Удалить
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className='mt-2'>
                <div className='text-lg max-md:text-sm font-semibold text-gray-800'>{post.title}</div>
                <p className='text-md max-md:text-sm text-gray-600 mt-2 max-md:mt-1 line-clamp-4'>{post.text}</p>
            </div>
        </div>
    );
};
