import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom';

const DashboardNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <div className='border-b overflow-auto'>
            <ul className='flex text-[0.9em] pt-4 mb-2'>
                <li className={`py-1 px-4 border-b-[5px] border-${location.pathname === '/CSM052802' ? '[#415A77]' : 'transparent'}`}>
                    <button onClick={() => navigate('/CSM052802')}>DASHBOARD</button>
                </li>
                <li className={`py-1 px-4 border-b-[5px] border-${location.pathname === '/about-table' ? '[#415A77]' : 'transparent'}`}>
                    <button onClick={() => navigate('/about-table')}>About Table</button>
                </li>
            </ul>
        </div>
    );
}

export default DashboardNavigation