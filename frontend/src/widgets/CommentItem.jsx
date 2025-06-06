import React from 'react'
import Moment from 'react-moment'
import avatarImg from "../shared/assets/img/User-avatar.png";

export const CommentItem = ({ cmt }) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const getFullUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_URL}/${url}`;
    };
    return (
        <div className="flex items-center gap-4 max-md:p-1 p-3 hover:bg-gray-800 rounded-lg transition-all duration-200">
            <div className="flex items-center w-12 h-12">
                <img
                    src={cmt?.authorAvatar ? getFullUrl(cmt.authorAvatar): avatarImg} 
                    alt=''
                    className="w-10 h-10 rounded-full object-cover"
                />
            </div>
            
            <div className="flex justify-between w-full">
                <div className="text-gray-200 max-sm:text-xs text-sm leading-relaxed">
                    <strong>{cmt.username}</strong> 
                    <p>{cmt.comment}</p>
                </div>
                <Moment date={cmt.createdAt} format="DD.MM.YYYY" className="text-gray-500 text-xs" />
            </div>
            
        </div>
    )
}

