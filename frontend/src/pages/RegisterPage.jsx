import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, checkIsAuth } from '../shared/slices/auth/authSlice';
import { toast } from 'react-toastify';
import { pathKeys } from '../shared/router/config';

export const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({}); 
    const { status } = useSelector((state) => state.auth);
    const isAuth = useSelector(checkIsAuth);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (status) {
            toast(status);
        }
        if (isAuth) navigate('/');
    }, [status, isAuth, navigate]);

    const validateForm = () => {
        const newErrors = {};
        if (!username.trim()) newErrors.username = 'Username is required';
        if (!email.trim()) newErrors.email = 'Email is required';
        if (!password.trim()) newErrors.password = 'Password is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            try {
                dispatch(registerUser({ username, email, password }));
                setUsername('');
                setEmail('');
                setPassword('');
                setErrors({});
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen">
            <form
                onSubmit={(e) => e.preventDefault()}
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
            >
                <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">Регистрация</h1>

                <label className="block text-xs text-gray-600 mb-2" htmlFor="username">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className={`w-full p-3 rounded-md border ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-1 text-sm`}
                />
                {errors.username && <p className="text-red-500 text-xs mb-4">{errors.username}</p>}

                <label className="block text-xs text-gray-600 mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={`w-full p-3 rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-1 text-sm`}
                />
                {errors.email && <p className="text-red-500 text-xs mb-4">{errors.email}</p>}

                <label className="block text-xs text-gray-600 mb-2" htmlFor="password">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={`w-full p-3 rounded-md border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-1 text-sm`}
                />
                {errors.password && <p className="text-red-500 text-xs mb-4">{errors.password}</p>}

                <div className="flex justify-between items-center">
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                        Подтвердить
                    </button>
                    <Link
                        to={pathKeys.login()}
                        className="text-xs ml-1 text-indigo-600 hover:underline"
                    >
                        Уже зарегистрированы?
                    </Link>
                </div>
            </form>
        </div>
    );
};
