import { Link } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';
import { pathKeys } from '../shared/router/config';

export const PostCard = ({ post }) => {
    const API_URL = process.env.REACT_APP_API_URL;
    const getFullUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_URL}/${url}`;
    };
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
      <source src={getFullUrl(post.imgUrl)} type={`video/${post.imgUrl.split('.').pop()}`} />
      Ваш браузер не поддерживает видео.
    </video>
  ) : (
    <img
      src={getFullUrl(post.imgUrl)}
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