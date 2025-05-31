import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth, logout } from '../shared/slices/auth/authSlice';
import { toast } from 'react-toastify';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import { pathKeys } from '../shared/router/config';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Box
} from '@mui/material';
import avatarImg from "../shared/assets/img/User-avatar.png";

export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(checkIsAuth);
    const [isMobile, setIsMobile] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { user } = useSelector((state) => state.auth); 
    const API_URL = process.env.REACT_APP_API_URL;
    const getFullUrl = (url) => {
        if (!url) return '';
        return url.startsWith('http') ? url : `${API_URL}/${url}`;
    };
    const handleResize = () => {
        setIsMobile(window.innerWidth <= 720);
    };

    useEffect(() => {
        handleResize(); 
        window.addEventListener('resize', handleResize);

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const activeStyles = {
        color: isMenuOpen ? 'black' : 'white',
    };

    const logoutHandler = () => {
        dispatch(logout());
        window.localStorage.removeItem('token');
        toast('Вы вышли из системы');
        setIsMenuOpen(false);  
        navigate('/'); 
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className='header sticky top-0 z-10 flex p-4 justify-between items-center w-full'>
            <span className="flex justify-center items-center w-20 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-xs text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition duration-300">
                <NavLink to="/" className="flex items-center space-x-2">
                    <span>Blog Market</span>
                </NavLink>
            </span>

            {isAuth && !isMobile && (
                <ul className='flex gap-8'>
                    <li>
                        <NavLink
                            to={'/'}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) => (isActive ? activeStyles : undefined)}
                        >
                            Главная
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to={pathKeys.posts.new()}
                            className='text-xs text-gray-400 hover:text-white'
                            style={({ isActive }) => (isActive ? activeStyles : undefined)}
                        >
                            Добавить пост
                        </NavLink>
                    </li>
                    {user?.username == 'Admin' && (
                        <li>
                            <NavLink
                                to={pathKeys.dashboard()}
                                className='text-xs text-gray-400 hover:text-white'
                                style={({ isActive }) => (isActive ? activeStyles : undefined)}
                            >
                                Админка
                            </NavLink> 
                        </li>
                    )}
                </ul>
            )}

            <div>
                {isMobile ? (
                    <button
                        className="text-2xl text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <FaBars />
                    </button>
                ) : (
                    <div>
                        {isAuth ? (
                            <div className="flex gap-x-4 items-center">
                                <Link
                                    to={pathKeys.posts.root()}
                                    className='border border-solid border-white text-white rounded-full'
                                    onClick={handleLinkClick}
                                >
                                    <img 
                                        src={user?.imgUrl ? getFullUrl(user.imgUrl) : avatarImg} 
                                        alt=''
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                </Link>
                                <button
                                    onClick={logoutHandler}
                                    className="flex items-center justify-center w-32 py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-300 ease-in-out"
                                >
                                    <FaSignOutAlt className="mr-2" /> Выйти
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to={pathKeys.login()}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded transition duration-200 mx-2"
                                >
                                    Войти
                                </Link>
                                <Link
                                    to={pathKeys.register()}
                                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded transition duration-200 mx-2"
                                >
                                    Регистрация
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {isMobile && isMenuOpen && (
                    <Drawer anchor="right" open={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                        <Box sx={{ width: 280, py: 2 }}>
                            <List>
                            {isAuth ? (
                                <>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { setIsMenuOpen(false); navigate(pathKeys.posts.root()); }}>
                                    <ListItemText primary="Мой Профиль" />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { setIsMenuOpen(false); navigate('/'); }}>
                                    <ListItemText primary="Главная" />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { setIsMenuOpen(false); navigate(pathKeys.posts.new()); }}>
                                    <ListItemText primary="Добавить пост" />
                                    </ListItemButton>
                                </ListItem>

                                <Divider sx={{ my: 1 }} />

                                {user?.username == 'Admin' && (
                                    <ListItem disablePadding>
                                        <ListItemText>
                                            <NavLink
                                                to={pathKeys.dashboard()}
                                                className="pl-4"
                                            >
                                                Админка
                                            </NavLink> 
                                        </ListItemText>
                                    </ListItem>
                                )}
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { setIsMenuOpen(false); logoutHandler(); }}>
                                    <ListItemText primary="Выйти" />
                                    </ListItemButton>
                                </ListItem>
                                </>
                            ) : (
                                <>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { setIsMenuOpen(false); navigate(pathKeys.login()); }}>
                                    <ListItemText primary="Войти" />
                                    </ListItemButton>
                                </ListItem>

                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => { setIsMenuOpen(false); navigate(pathKeys.register()); }}>
                                    <ListItemText primary="Регистрация" />
                                    </ListItemButton>
                                </ListItem>
                                </>
                            )}
                            </List>
                        </Box>
                    </Drawer>
                )}
            </div>
        </div>
    );
};
