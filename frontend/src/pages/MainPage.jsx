import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PostItem } from '../widgets/PostItem';
import { getAllPosts, getPostsByTag } from '../shared/slices/post/postSlice';
import { CircularProgress, Typography } from "@mui/material";

import { MainPageSideBar } from '../widgets/MainPageSideBar';

export const MainPage = () => {
    const dispatch = useDispatch();
    const { posts, totalPostsCount } = useSelector((state) => state.post);
    const [activeTag, setActiveTag] = useState(null);
    const postsPerPage = 5;
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(() => {
        const savedPage = localStorage.getItem('mainPageCurrentPage');
        return savedPage ? Number(savedPage) : 1;
    });
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        localStorage.setItem('mainPageCurrentPage', page);
        setLoading(false);
    }, [page]);

    const renderLoading = <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setPage(1);
        if (activeTag) {
            dispatch(getPostsByTag({ tag: activeTag, searchQuery: query, page: 1 }));
        } else {
            dispatch(getAllPosts({ searchQuery: query, page: 1 }));
        }
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        if (activeTag) {
            dispatch(getPostsByTag({ tag: activeTag, searchQuery, page: newPage }));
        } else {
            dispatch(getAllPosts({ searchQuery, page: newPage }));
        }
    };

    const currentPosts = posts;

    const totalPages = Math.ceil(totalPostsCount / postsPerPage);

    useEffect(() => {
        if (activeTag) {
            dispatch(getPostsByTag({ tag: activeTag, searchQuery, page }));
        } else {
            dispatch(getAllPosts({ searchQuery, page }));
        }

    }, [dispatch, activeTag, searchQuery, page]);

    if (loading) return renderLoading;

    return (
        <div className='mx-auto max-md:p-4 p-12 bg-gray-900'>
            <div className='flex justify-between items-center mb-5'>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Поиск по названию..."
                    className="p-3 max-md:p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-xl"
                />
            </div>
            <div className='flex max-md:flex-col max-md:flex-col-reverse gap-10'>
                <div className='w-full flex flex-col gap-5'>

                    {currentPosts?.length ? (
                        currentPosts.map((post, index) => (
                            <PostItem key={`post-${index}`} post={post} />
                        ))
                    ) : (
                        <div className="text-xl text-center text-gray-400 py-20">
                            <p>Постов нет.</p>
                        </div>
                    )}

                    {totalPostsCount > postsPerPage && (
                        <div className='flex justify-center mt-6'>
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className='px-5 py-2 max-md:text-sm mx-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-500 transition duration-300'
                            >
                                Назад
                            </button>
                            {[...Array(totalPages).keys()].map((p) => (
                                <button
                                    key={p}
                                    onClick={() => handlePageChange(p + 1)}
                                    className={`px-5 py-2 max-md:text-sm mx-2 rounded-lg transition duration-300 ${
                                        page === p + 1
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
                                    }`}
                                >
                                    {p + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className='px-5 py-2 max-md:text-sm mx-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-500 transition duration-300'
                            >
                                Вперед
                            </button>
                        </div>
                    )}
                </div>
                <MainPageSideBar
                    activeTag={activeTag}
                    setActiveTag={setActiveTag}
                    page={page}
                    setPage={setPage}
                    searchQuery={searchQuery}
                />
            </div>
        </div>
    );
};
