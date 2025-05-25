import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiFillDelete } from 'react-icons/ai'
import { useDispatch, useSelector } from 'react-redux';
import { PostItem } from '../widgets/PostItem';
import { getAllPostsNoParams, removePostFromAdmin } from '../shared/slices/post/postSlice';
import { getAllComments, removeCommentFromAdmin } from '../shared/slices/comment/commentSlice';  
import { toast } from 'react-toastify';
import { checkIsAuth, getMe, getAllUsers, removeUserFromAdmin } from '../shared/slices/auth/authSlice';
import { DashBoardSideBar } from '../widgets/DashBoardSideBar';

export const DashBoard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);
  const { posts } = useSelector((state) => state.post);
  const { comments } = useSelector((state) => state.comment); 
  const { users, user} = useSelector((state) => state.auth); 
  
  const [activeSection, setActiveSection] = useState('overview'); // "overview" для основного контента
  
  const removeUserHandler = async (userId) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этого пользователя?');
    if (!confirmDelete) return;

    try {
      await dispatch(removeUserFromAdmin(userId)).unwrap(); // Убедимся, что действие выполнено успешно
      toast('Пользователь был удален');
      dispatch(getAllUsers()); // Обновляем список 
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      toast.error('Не удалось удалить пользователя');
    }
  };

  const removePostHandler = async (PostId) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот пост?');
    if (!confirmDelete) return;

    try {
      await dispatch(removePostFromAdmin(PostId)).unwrap(); // Убедимся, что действие выполнено успешно
      toast('Пост был удален');
      dispatch(getAllPostsNoParams()); // Обновляем список 
    } catch (error) {
      console.error('Ошибка при удалении Поста:', error);
      toast.error('Не удалось удалить Пост');
    }
  };

  const removeCommentHandler = async (CommentId) => {
    const confirmDelete = window.confirm('Вы уверены, что хотите удалить этот комментарий?');
    if (!confirmDelete) return;

    try {
        await dispatch(removeCommentFromAdmin(CommentId)).unwrap();
        toast('Комментарий был удален');
        dispatch(getAllComments()); 
    } catch (error) {
        console.error('Ошибка при удалении комментария:', error);
        toast.error('Не удалось удалить комментарий');
    }
  };
  
  const stats = {
    users: users?.length || 0,
    posts: posts?.length || 0,
    comments: comments?.length || 0,
  };
  
  useEffect(() => {
    if (user === null) {
      dispatch(getMe()); 
      return;
    }

    if (!isAuth || user?.username !== 'Admin') {
        navigate('/404'); 
        return;
    }

    dispatch(getAllPostsNoParams()); // Fetch posts
    dispatch(getAllComments()); // Fetch comments
    dispatch(getAllUsers()); // Fetch users
  
  }, [dispatch, navigate, user, isAuth]); 
  

  return (
    <div className="flex">
      <DashBoardSideBar setActiveSection={setActiveSection}/>

      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto min-h-screen">
        {activeSection === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-md shadow-lg">
              <div className="text-xl font-semibold mb-2">Пользователи</div>
              <div className="text-3xl font-bold text-gray-700">{stats.users}</div> 
            </div>
            <div className="bg-white p-6 rounded-md shadow-lg">
              <div className="text-xl font-semibold mb-2">Посты</div>
              <div className="text-3xl font-bold text-gray-700">{stats.posts}</div>
            </div>
            <div className="bg-white p-6 rounded-md shadow-lg">
              <div className="text-xl font-semibold mb-2">Комментарии</div>
              <div className="text-3xl font-bold text-gray-700">{stats.comments}</div>
            </div>
          </div>
        )}

        {activeSection === 'posts' && (
          <div className="max-md:gap-4 gap-6">
            {posts?.map((post, idx) => (
              <div 
                key={idx} 
                className=""
              >
                <PostItem post={post} />
                <button
                  onClick={() => removePostHandler(post._id)}
                  className="max-md:text-sm flex w-full items-center justify-center p-2 mt-2 bg-gray-700 rounded-full text-gray-200 
                  hover:bg-red-100 hover:text-red-600 transition-all shadow focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Delete Post
                  <AiFillDelete size={20} />
                </button>
              </div>
            ))}
        </div>
        )}

        {activeSection === 'users' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Пользователи</h2>
            {users?.filter(user => user.username !== 'Admin')?.length > 0 ? (
              users
                ?.filter(user => user.username !== 'Admin')
                ?.map(user => (
                  <div
                    key={user.id}
                    className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md mb-4 hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-xl font-semibold text-gray-800">{user.username}</div>
                    <button
                      onClick={() => removeUserHandler(user._id)}
                      className="mt-4 flex items-center text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 inline-block mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                ))
            ) : (
              <p className="text-gray-500">Нет пользователей.</p>
            )}
          </div>
        )}
   
        {activeSection === 'comments' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Комментарии</h2>
            {comments?.length > 0 ? (
              comments.map((cmt) => (
                <div key={cmt._id} className="flex justify-between bg-white p-6 rounded-md shadow-lg mb-4">
                  <div className="text-gray-700">{cmt.comment}</div>
                  <button
                    onClick={() => removeCommentHandler(cmt._id)}
                    className="mt-4 flex items-center text-red-600 hover:text-red-800 focus:outline-none"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 inline-block mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Нет комментариев.</p>
            )}
          </div>
        )}

        {activeSection === 'settings' && (
          <div className="bg-white p-6 rounded-md shadow-lg">
            <p>Настройки админ-панели.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
