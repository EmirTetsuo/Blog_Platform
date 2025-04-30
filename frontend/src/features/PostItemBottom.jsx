import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiFillEye, AiOutlineMessage, AiFillHeart, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { FaTelegramPlane, FaWhatsapp, FaLink, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike } from '../shared/slices/post/postSlice';
import { toggleFavorite } from '../shared/slices/auth/authSlice';

import { pathKeys } from '../shared/router/config';

export const PostItemBottom = ({ post }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const userId = user?._id;
    const [isLiked, setIsLiked] = useState(userId && post.likes.includes(userId));
    const [isFavorited, setIsFavorited] = useState(userId && user.favorites.includes(post._id));
    const [isShareOpen, setIsShareOpen] = useState(false);
    const FRONT_URL = process.env.REACT_APP_FRONT_URL;

    const handleLike = () => {
        if (userId) {
            dispatch(toggleLike({ postId: post._id, userId }));
            setIsLiked((prev) => !prev);
        }
    };
    
    const handleFavorite = () => {
        if (userId) {
            dispatch(toggleFavorite({ postId: post._id, userId })).then(() => {
                setIsFavorited((prev) => !prev);
            });
        }
    };

    const toggleShareMenu = () => setIsShareOpen((prev) => !prev);

    const copyToClipboard = () => {
        const postUrl = `${FRONT_URL}/${post._id}`;
        navigator.clipboard.writeText(postUrl)
            .then(() => alert('Ссылка скопирована!'))
            .catch(() => alert('Ошибка при копировании ссылки.'));
    };

    useEffect(() => {
        if (isShareOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isShareOpen]);
    
    const postUrl = `${FRONT_URL}/${post._id}`;
    const shareMessage = encodeURIComponent(`Смотри, что я нашел: ${post.title} - ${postUrl}`);

    return (
        <div className='p-4'>
            {post.tags && post.tags.length > 0 && (
                <div className='mb-2 flex flex-wrap gap-2'>
                    {post.tags.map((tag, index) => (
                        <span key={index} className='px-2 py-1 bg-gray-200 rounded-full text-sm text-gray-800'>
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className='flex gap-4 items-center mt-4 text-base text-gray-500'>
                <button className='flex items-center gap-1' onClick={handleLike}>
                    {isLiked ? (
                        <AiFillHeart className='text-red-500' />
                    ) : (
                        <AiOutlineHeart />
                    )}
                    <span>{post.likes.length}</span>
                </button>
                <button className='flex items-center gap-1'>
                    <AiFillEye />
                    <span>{post.views}</span>
                </button>
                <Link to={pathKeys.posts.byId(post._id)} className='group flex items-center gap-1'>
                    <AiOutlineMessage />
                    <span>{post.comments?.length || 0}</span>
                </Link>
                <div className="ml-auto flex gap-4 items-center">
                    <button className='flex items-center gap-1' onClick={handleFavorite}>
                        {isFavorited ? (
                            <FaBookmark className='text-blue-500' />
                        ) : (
                            <FaRegBookmark className='text-gray-500' />
                        )}
                    </button>

                    <div>
                        <button
                            className='flex items-center gap-1'
                            onClick={toggleShareMenu}
                        >
                            <AiOutlineShareAlt />
                        </button>
                    </div>
                </div>
                {isShareOpen && (
                    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
                        <div className='bg-white border shadow-xl rounded-lg p-4 w-80'>
                            <div className='flex items-center justify-between mb-3'>
                                <div className='text-lg font-semibold text-gray-800'>Поделиться</div>
                                <button onClick={toggleShareMenu} className='text-gray-500'>
                                    X
                                </button>
                            </div>
                            <a
                                href= {`https://web.telegram.org/k/#@your_bot_or_channel?start=${encodeURIComponent(postUrl)}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-2 text-blue-500 hover:text-blue-700 mb-2'
                            >
                                <FaTelegramPlane />
                                Telegram
                            </a>
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-2 text-green-500 hover:text-green-700 mb-2'
                            >
                                <FaWhatsapp />
                                WhatsApp
                            </a>

                            <div className='flex items-center gap-2 text-gray-500'>
                                <FaLink />
                                <button onClick={copyToClipboard} className='text-sm hover:text-gray-700'>
                                    Копировать ссылку
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
