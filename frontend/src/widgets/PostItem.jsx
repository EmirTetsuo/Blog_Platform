import React from 'react';
import { PostItemBottom  } from '../features/PostItemBottom';
import { PostItemContent } from '../features/PostItemContent';
import { PostItemTop } from '../features/PostItemTop';

export const PostItem = ({ post }) => {
    if (!post) {
        return (
            <div className='text-xl text-center text-white py-10'>
                Загрузка...
            </div>
        );
    }

    return (
        <div className='group w-full'>
            <div className='bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col'>
                <PostItemTop post={post} />

                <div className="flex-1 overflow-hidden">
                    <PostItemContent post={post} />
                </div>

                <PostItemBottom post={post} />
            </div>
        </div>

    );
};
