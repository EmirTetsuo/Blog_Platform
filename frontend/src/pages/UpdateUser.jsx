import React, { useState, useCallback, useEffect } from 'react';
import axios from '../shared/api/axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, ArrowLeft } from 'lucide-react';
export const UpdateUser = () => {
    const [newAvatar, setNewAvatar] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const API_URL = process.env.REACT_APP_API_URL;
    const getFullUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_URL}/${url}`;
    };
    
    const fetchUser = useCallback(async () => {
        setNewAvatar(user?.imgUrl)
        setNewUsername(user?.username)
    }, [user?.imgUrl, user?.username]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatar(file);
        }
    };

    const handleUsernameChange = (e) => {
        setNewUsername(e.target.value);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        if (newAvatar) formData.append('avatar', newAvatar);
        if (newUsername) formData.append('username', newUsername);
        
        try {
            const { data } = await axios.put('/auth/user/update', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${window.localStorage.getItem('token')}`,
                },
            });

            if (data.message && data.message.includes('username уже занят')) {
                toast.error('This username is already taken.');
                return;
            }

            dispatch({ type: 'auth/updateUser', payload: data.user });
            navigate('/posts');
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Failed to update avatar or username');
        }
    };

    useEffect(() => {
        fetchUser()
    }, [fetchUser])

    return (
        <div className="w-full max-w-2xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">Редактировать профиль</h3>

                <label className="block text-lg font-medium text-gray-700 mb-2">
                    Загрузка аватара
                </label>
                <div className="relative flex items-center justify-between mb-4">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="block w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                    />
                    <Upload className="ml-3 text-blue-500" size={22} />
                </div>
                {newAvatar && (
                    <div className="mb-8 flex justify-center">
                        <img
                            src={
                                typeof newAvatar === 'string'
                                ? getFullUrl(newAvatar)
                                : URL.createObjectURL(newAvatar)
                            }
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-blue-300 shadow-md transition-transform duration-300 hover:scale-105"
                        />
                    </div>
                )}
                <div className="mb-8">
                    <label htmlFor="username" className="block text-lg font-medium text-gray-700 mb-2">
                        Новое имя пользователя
                    </label>
                    <input
                        id="username"
                        type="text"
                        value={newUsername}
                        onChange={handleUsernameChange}
                        className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Введите новое имя"
                    />
                </div>

                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => navigate('/posts')}
                        className="inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors text-base"
                    >
                        <ArrowLeft className="mr-2" size={20} />
                        Отмена
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};
