import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    FaUser,
    FaBars,
    FaBlog,
    FaCog,
    FaTachometerAlt,
    FaComment,
    FaSignOutAlt,
    FaHome,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../shared/slices/auth/authSlice';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Box,
} from '@mui/material';

export const DashBoardSideBar = ({ setActiveSection }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const logoutHandler = () => {
        dispatch(logout());
        window.localStorage.removeItem('token');
        toast('Вы вышли из системы');
        navigate('/');
    };

    const menuItems = [
        { label: 'Главная', icon: <FaHome />, onClick: () => navigate('/') },
        { label: 'Overview', icon: <FaTachometerAlt />, onClick: () => setActiveSection('overview') },
        { label: 'Посты', icon: <FaBlog />, onClick: () => setActiveSection('posts') },
        { label: 'Пользователи', icon: <FaUser />, onClick: () => setActiveSection('users') },
        { label: 'Комментарии', icon: <FaComment />, onClick: () => setActiveSection('comments') },
        { label: 'Настройки', icon: <FaCog />, onClick: () => setActiveSection('settings') },
        { label: 'Выйти', icon: <FaSignOutAlt />, onClick: logoutHandler, isLogout: true },
    ];

    const renderMenuItems = () =>
        menuItems.map((item, index) => (
            <li key={index}>
                <button
                    onClick={() => {
                        item.onClick();
                        setIsDrawerOpen(false); // закрытие drawer на мобилке
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700 transition w-full ${
                        item.isLogout ? 'text-red-500' : ''
                    }`}
                >
                    <span className="w-5 h-5">{item.icon}</span>
                    <span>{item.label}</span>
                </button>
            </li>
        ));

    return (
        <div className="w-full sticky top-0 z-10 bg-gray-800 text-white shadow-lg transition-all">
            <div className="md:hidden flex justify-between items-center p-4">
                  <button className="text-2xl text-white" onClick={() => setIsDrawerOpen(true)}>
                    <FaBars />
                </button>
            </div>

            <nav className="hidden md:flex">
                <ul className="flex space-x-4 px-4 py-2 whitespace-nowrap">
                    {renderMenuItems()}
                </ul>
            </nav>

            <Drawer anchor="left" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
                <Box sx={{ width: 250 }} role="presentation">
                    <List>
                        {menuItems.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        item.onClick();
                                        setIsDrawerOpen(false);
                                    }}
                                >
                                    <span className="mr-3">{item.icon}</span>
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            color: item.isLogout ? 'error' : 'inherit',
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </Box>
            </Drawer>
        </div>
    );
};
