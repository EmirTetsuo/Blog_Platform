import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaUser, FaBlog, FaCog, FaTachometerAlt, FaComment, FaSignOutAlt, FaHome } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { logout } from '../shared/slices/auth/authSlice';

export const DashBoardSideBar = ({setActiveSection}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const handleNavClick = (section) => {
      setActiveSection(section);
    };
    
    const logoutHandler = () => {
        dispatch(logout());
        window.localStorage.removeItem('token');
        toast('Вы вышли из системы');
        navigate('/'); 
    };

    return (
        <div className="p-2 bg-gray-800 text-white shadow-lg transition-all">
            <nav>
                <ul>
                <li>
                    <NavLink 
                    to="#" 
                    onClick={() => handleNavClick('overview')} 
                    activeClassName="text-blue-400"
                    className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
                    >
                    <FaTachometerAlt  className="w-6 h-6" /> 
                    <span className="max-md:hidden">Overview</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                    to="/" 
                    activeClassName="text-blue-400"
                    className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
                    >
                    <FaHome className="w-6 h-6" /> 
                    <span className="max-md:hidden">Главная</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                    to="#" 
                    onClick={() => handleNavClick('posts')} 
                    activeClassName="text-blue-400"
                    className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
                    >
                    <FaBlog className="w-6 h-6" /> 
                    <span className="max-md:hidden">Посты</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                    to="#" 
                    onClick={() => handleNavClick('users')} 
                    activeClassName="text-blue-400"
                    className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
                    >
                    <FaUser className="w-6 h-6" /> 
                    <span className="max-md:hidden">Пользователи</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                    to="#" 
                    onClick={() => handleNavClick('comments')} 
                    activeClassName="text-blue-400"
                    className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
                    >
                    <FaComment className="w-6 h-6" /> 
                    <span className="max-md:hidden">Комментарии</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink 
                    to="#" 
                    onClick={() => handleNavClick('settings')} 
                    activeClassName="text-blue-400"
                    className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md"
                    >
                    <FaCog className="w-6 h-6" /> 
                    <span className="max-md:hidden">Настройки</span>
                    </NavLink>
                </li>
                <li>
                    <button 
                    onClick={logoutHandler} 
                    className="flex items-center space-x-3 py-2 hover:bg-gray-700 px-3 rounded-md w-full mt-4 text-red-500"
                    >
                    <FaSignOutAlt className="w-6 h-6" /> 
                    <span className="max-md:hidden">Выйти</span>
                    </button>
                </li>
                </ul>
            </nav>
        </div>
    );
};

