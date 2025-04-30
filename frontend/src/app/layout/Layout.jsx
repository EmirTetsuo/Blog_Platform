import React from 'react'
import { Navbar } from '../../widgets/Navbar'
import { useLocation } from 'react-router-dom'

export const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <React.Fragment>
            <div className='container mx-auto'>
                {location.pathname !== '/dashboard' && <Navbar />}
                {children}
            </div>
        </React.Fragment>
    )
}
