import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PopularPosts } from '../widgets/PopularPosts';
import { getAllPosts, selectAvailableTags, getPostsByTag } from '../shared/slices/post/postSlice';

export const MainPageSideBar = ({ searchQuery, activeTag, setActiveTag, page, setPage }) => {
    const dispatch = useDispatch();
    const { popularPosts } = useSelector((state) => state.post);
    const tags = useSelector(selectAvailableTags);

    const [showAllTags, setShowAllTags] = useState(false);
    const TAGS_TO_SHOW = 5;

    const handleTagClick = (tag) => {
        setActiveTag((prevTag) => {
            const newTag = prevTag === tag ? null : tag;
            setPage(1);
            if (newTag) {
                dispatch(getPostsByTag({ tag: newTag, searchQuery, page: 1 }));
            } else {
                dispatch(getAllPosts({ searchQuery, page: 1 }));
            }
            return newTag;
        });
    };

    useEffect(() => {
        if (activeTag) {
            dispatch(getPostsByTag({ tag: activeTag, searchQuery, page }));
        } else {
            dispatch(getAllPosts({ searchQuery, page }));
        }
    }, [dispatch, activeTag, searchQuery, page]);

    return (
        <div className='w-[70%] max-md:w-full'>
            <div className='text-sm font-semibold text-gray-400 mb-6'>
                <span className='uppercase tracking-wider text-white'>Популярное:</span>
            </div>
            <div className='bg-gray-800 rounded-lg max-md:p-3 p-6 shadow-lg mb-10'>
                {popularPosts?.slice(0, 3).map((post, index) => (
                    <PopularPosts key={`popularPost-${index}`} post={post} />
                ))}
            </div>

            <div className=''>
                <h2 className='text-lg font-semibold text-white mb-4'>Теги</h2>
                <div className='flex flex-wrap max-md:gap-2 gap-3'>
                {tags?.length ? (
                    <>
                    {(showAllTags ? tags : tags.slice(0, TAGS_TO_SHOW)).map((tag, index) => (
                        <span
                        key={`tag-${index}`}
                        role="button"
                        aria-label={`Filter posts by tag: ${tag}`}
                        onClick={() => handleTagClick(tag)}
                        className={`px-5 py-2 max-md:text-sm rounded-full cursor-pointer transition duration-300 ease-in-out ${
                            activeTag === tag
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'
                        }`}
                        >
                        #{tag}
                        </span>
                    ))}

                    {tags.length > TAGS_TO_SHOW && (
                        <button
                        onClick={() => setShowAllTags(prev => !prev)}
                        className="px-5 py-2 max-md:text-sm rounded-full bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out"
                        >
                        {showAllTags ? 'Скрыть' : 'Показать все'}
                        </button>
                    )}
                    </>
                ) : (
                        <p className="text-gray-400">Тегов пока нет.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
