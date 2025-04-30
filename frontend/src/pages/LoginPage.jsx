import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth, loginUser } from '../shared/slices/auth/authSlice';
import { toast } from 'react-toastify';
import { pathKeys } from '../shared/router/config';

export const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');

    const { status } = useSelector((state) => state.auth);
    const isAuth = useSelector(checkIsAuth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (status) {
            toast(status);
        }
        if (isAuth) {
            navigate('/');
        }
    }, [status, isAuth, navigate]);

    const handleSubmit = async () => {
        try {
            await dispatch(loginUser({ identifier, password }));
        } catch (error) {
            console.log(error);
        }
    };
    

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Авторизация</h1>

                <label className="block text-xs text-gray-600 mb-2" htmlFor="identifier">
                    Email или Username
                </label>
                <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Email или Username"
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4 text-sm"
                />

                <label className="block text-xs text-gray-600 mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-6 text-sm"
                />

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                        Войти
                    </button>
                    <Link
                        to={pathKeys.register()} 
                        className="text-xs ml-1 text-indigo-600 hover:underline"
                    >
                        Нет аккаунта?
                    </Link>
                </div>
            </form>
        </div>
    );
};
