import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import routes from '../../../config/routes';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
    const naviagte = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        naviagte(routes.login);
    };
    return (
        <div className={[cx('header'), 'w-full h-8 fixed'].join(' ')}>
            <div className="text-white">
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Header;
