import React, { useEffect, useState } from 'react';
import axios from '../shared/api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { pathKeys } from '../shared/router/config';
import avatarImg from "../shared/assets/img/User-avatar.png";
import { CircularProgress, Typography } from "@mui/material";

const API_URL = process.env.REACT_APP_API_URL;

const renderLoading = <Typography className="flex justify-center items-center h-64"><CircularProgress /></Typography>;


const PostCard = ({ post }) => {
  const isVideo = (url) => {
    if (!url || typeof url !== 'string') return false;
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm', 'flv', 'ogg'];
    return videoExtensions.some(ext => url.endsWith(ext));
  };

  if (!post?.imgUrl) {
    return (
      <div className="flex items-center justify-center h-48 w-full rounded-lg border-2 border-gray-600 text-white">
        Нет изображения
      </div>
    );
  }

  const content = isVideo(post.imgUrl) ? (
    <video
      width="100%"
      height="100%"
      className="object-cover w-full h-full"
      muted
      loop
    >
      <source src={`${API_URL}/${post.imgUrl}`} type={`video/${post.imgUrl.split('.').pop()}`} />
      Ваш браузер не поддерживает видео.
    </video>
  ) : (
    <img
      src={`${API_URL}/${post.imgUrl}`}
      alt="Post content"
      className="object-cover w-full h-full"
    />
  );

  return (
    <Link to={pathKeys.posts.byId(post._id)} className="block relative max-sm:h-[120px] h-[250px] w-full rounded-lg overflow-hidden border-2 border-gray-600 shadow-lg hover:shadow-xl transition-shadow duration-300">
      {content}
    </Link>
  );
};

export const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const postsResponse = await axios.get('/posts/user/me');
        setPosts(postsResponse.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }

      try {
        const favoritesResponse = await axios.get('/auth/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favoritesResponse.data.favorites);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, token]);
  
  if (loading) return renderLoading;
  return (
    <div className="w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center mb-8 space-x-4">
        <Link to={pathKeys.updateUser()} className="relative group">
          <img
            src={user?.imgUrl ? `${API_URL}/${user.imgUrl}` : avatarImg}
            alt="User Avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-700 cursor-pointer transform transition duration-300 ease-in-out hover:scale-105 hover:opacity-90"
          />
          <FaPen className="absolute inset-0 m-auto text-white opacity-0 group-hover:opacity-100 transition-all duration-300" size={20} />
        </Link>
        <div>
          <h2 className="text-4xl font-semibold text-white">{user?.username || "User"}</h2>
          <p className="text-gray-300 text-sm">Welcome back!</p>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="max-md:text-xl text-2xl font-bold text-white mb-4">Мои Посты</h2>
        {posts.length === 0 ? (
          <p className="text-white text-center">У вас нет постов.</p>
        ) : (
          <div className="grid max-md:grid-cols-2 grid-cols-4 max-md:gap-3 gap-6">
            {posts.filter(post => post !== null && post.imgUrl).map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        )}
      </section>

      <section className="">
        <h2 className="max-md:text-xl text-2xl font-semibold text-white mb-6">Избранные Посты</h2>
        {favorites.length === 0 ? (
          <p className="text-white text-center">У вас нет избранных постов.</p>
        ) : (
          <div className="grid max-md:grid-cols-2 grid-cols-4 max-md:gap-3 gap-6">
            {favorites.map((post, idx) => (
              <PostCard key={idx} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
