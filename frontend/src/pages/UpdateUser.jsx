import React, { useState } from 'react';
import axios from '../shared/api/axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const UpdateUser = () => {
    const [newAvatar, setNewAvatar] = useState(null);
    const [newUsername, setNewUsername] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

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

    return (
        <div className="w-full max-w-2xl mx-auto py-16">
            <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Редактировать Профиль</h3>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="mb-4 w-full py-2 px-4 bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {newAvatar && (
                    <div className="mb-6 flex justify-center">
                        <img
                            src={URL.createObjectURL(newAvatar)}
                            alt="Preview"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
                        />
                    </div>
                )}
                
                <div className="mb-6">
                    <label htmlFor="username" className="text-lg font-medium text-gray-700">Новое имя пользователя</label>
                    <input
                        id="username"
                        type="text"
                        value={newUsername}
                        onChange={handleUsernameChange}
                        className="mt-2 p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Выведите новое имя"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={() => navigate('/posts')}
                        className="text-gray-600 hover:underline text-lg"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-white text-lg px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    );
};
