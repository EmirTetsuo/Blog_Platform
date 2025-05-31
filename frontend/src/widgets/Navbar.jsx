import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkIsAuth, logout } from '../shared/slices/auth/authSlice';
import { toast } from 'react-toastify';
import { FaBars, FaSignOutAlt } from 'react-icons/fa';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Box,
  ListItemIcon,
} from '@mui/material';
import {
  Home, User, PlusCircle, LogOut, LogIn,
  UserPlus, LayoutDashboard,
} from 'lucide-react';
import avatarImg from "../shared/assets/img/User-avatar.png";
import { pathKeys } from '../shared/router/config';

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(checkIsAuth);
  const { user } = useSelector((state) => state.auth);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 720);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const getFullUrl = (url) => url?.startsWith('http') ? url : `${API_URL}/${url}`;

  const handleResize = () => setIsMobile(window.innerWidth <= 720);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const logoutHandler = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem('token');
    toast('Вы вышли из системы');
    setIsMenuOpen(false);
    navigate('/');
  }, [dispatch, navigate]);

  const renderNavItem = (to, label) => (
    <li>
      <NavLink
        to={to}
        className='text-xs text-gray-400 hover:text-white'
        style={({ isActive }) => (isActive ? { color: isMenuOpen ? 'black' : 'white' } : undefined)}
        onClick={() => setIsMenuOpen(false)}
      >
        {label}
      </NavLink>
    </li>
  );

  const renderDrawerItem = (to, icon, label, onClick) => (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => {
          if (onClick) onClick();
          else navigate(to);
          setIsMenuOpen(false);
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  );

  return (
    <header className='header sticky top-0 z-10 flex p-4 justify-between items-center w-full'>
      <span className="flex items-center justify-center w-20 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-xs text-white font-semibold rounded-lg shadow-lg hover:scale-105 transition duration-300">
        <NavLink to="/">Blog Market</NavLink>
      </span>

      {isAuth && !isMobile && (
        <ul className='flex gap-8'>
          {renderNavItem('/', 'Главная')}
          {renderNavItem(pathKeys.posts.new(), 'Добавить пост')}
          {user?.username === 'Admin' && renderNavItem(pathKeys.dashboard(), 'Админка')}
        </ul>
      )}

      <div>
        {isMobile ? (
          <button className="text-2xl text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <FaBars />
          </button>
        ) : isAuth ? (
          <div className="flex gap-x-4 items-center">
            <Link to={pathKeys.posts.root()}>
              <img
                src={user?.imgUrl ? getFullUrl(user.imgUrl) : avatarImg}
                alt="Аватар"
                className="w-10 h-10 rounded-full object-cover border border-white"
              />
            </Link>
            <button
              onClick={logoutHandler}
              className="flex items-center justify-center w-32 py-1 px-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition"
            >
              <FaSignOutAlt className="mr-2" /> Выйти
            </button>
          </div>
        ) : (
          <>
            <Link to={pathKeys.login()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mx-2 transition">
              Войти
            </Link>
            <Link to={pathKeys.register()} className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded mx-2 transition">
              Регистрация
            </Link>
          </>
        )}

        <Drawer anchor="right" open={isMobile && isMenuOpen} onClose={() => setIsMenuOpen(false)}>
          <Box sx={{ width: 280, py: 2 }}>
            <List>
              {isAuth ? (
                <>
                  {renderDrawerItem(pathKeys.posts.root(), <User />, 'Мой профиль')}
                  {renderDrawerItem('/', <Home />, 'Главная')}
                  {renderDrawerItem(pathKeys.posts.new(), <PlusCircle />, 'Добавить пост')}
                  {user?.username === 'Admin' && (
                    <>
                      <Divider sx={{ my: 1 }} />
                      {renderDrawerItem(pathKeys.dashboard(), <LayoutDashboard />, 'Админка')}
                    </>
                  )}
                  {renderDrawerItem(null, <LogOut />, 'Выйти', logoutHandler)}
                </>
              ) : (
                <>
                  {renderDrawerItem(pathKeys.login(), <LogIn />, 'Войти')}
                  {renderDrawerItem(pathKeys.register(), <UserPlus />, 'Регистрация')}
                </>
              )}
            </List>
          </Box>
        </Drawer>
      </div>
    </header>
  );
};
