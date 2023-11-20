import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUserCircle,
    faCalendarDays,
    faSliders,
    faPaste,
    faGear,
    faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react/headless';

import styles from './Sidebar.module.scss';
import SidebarItem from './SidebarItem';
import routes from '../../../config/routes';
import UserImage from '../../../assets/user.png';
import { LoginAPI } from '../../../api/LoginApi';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const sidebarItem = [
    {
        icon: faSliders,
        text: 'Collection',
        to: routes.home,
    },
    {
        icon: faPaste,
        text: 'Project',
        to: routes.lesson,
    },
    {
        icon: faCalendarDays,
        text: 'Projec',
        to: routes.login,
    },
];

var user_info;

function Sidebar() {
    const [active, setActive] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        user_info = JSON.parse(localStorage.getItem('user_info'));
    }, []);

    const handleActive = (index) => {
        setActive(index);
    };

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_info');
        let response = LoginAPI.logout()
            .then(function (res) {
                navigate(routes.login);
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    return (
        <aside className="w-11 h-screen bg-slate-700 text-gray-400">
            <div className="h-full flex flex-col justify-items-center">
                <div className="flex justify-between flex-col h-full">
                    <ul className="">
                        {sidebarItem.map((item, index) => (
                            <SidebarItem
                                key={index}
                                icon={<FontAwesomeIcon icon={item.icon} />}
                                text={item.text}
                                active={index == active}
                                onClick={() => handleActive(index)}
                                to={item.to}
                            />
                        ))}
                    </ul>
                    <ul>
                        <Tippy
                            interactive
                            hideOnClick={false}
                            placement="right-start"
                            render={(attrs) => (
                                <div className="w-30 h-16 bg-slate-600 text-white rounded-sm px-1 py-2 text-sm">
                                    <div className={`flex ${cx('user-image')} hover:cursor-pointer`}>
                                        <img className="w-5 h-5 rounded-full mr-1" src={UserImage} alt="" />
                                        {user_info && user_info.fullname}
                                    </div>
                                    <div
                                        className={`flex justify-start items-center mt-2  ml-1
                                        ${cx('user-image')} hover:cursor-pointer`}
                                        onClick={handleLogout}
                                    >
                                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                                        Logout
                                    </div>
                                </div>
                            )}
                        >
                            <p>
                                <SidebarItem icon={<FontAwesomeIcon icon={faUserCircle} />} />
                            </p>
                        </Tippy>
                        <SidebarItem icon={<FontAwesomeIcon icon={faGear} />} />
                    </ul>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
