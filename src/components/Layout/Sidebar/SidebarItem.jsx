import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames/bind';

import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

export default function SidebarItem({ icon, text, active, to, onClick }) {
    return (
        <Link to={to}>
            <li
                className={`list-none border-l-2 border-transparent text-center text-2xl py-2 relative group ease-in duration-500
            hover:cursor-pointer
            ${active ? cx('active') : ''}`}
                onClick={onClick}
            >
                {icon}
                {text && (
                    <div
                        className={`absolute top-1/4 font-bold left-full rounded px-2 py-1 ml-1 bg-indigo-100
                    text-indigo-800 text-sm opacity-20 -translate-x-3 invisible group-hover:visible 
                    group-hover:opacity-100 group-hover:translate-x-0 z-40`}
                    >
                        {text}
                    </div>
                )}
            </li>
        </Link>
    );
}
