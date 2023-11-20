import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';
import Sidebar from '../Sidebar';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    return (
        <div className="">
            <div className="flex">
                <Sidebar />
                <div className="w-full h-screen overflow-y-scroll">{children}</div>
            </div>
        </div>
    );
}

export default DefaultLayout;
