import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { LoginAPI } from '../../api/LoginApi';
import routers from '../../config/routes';
import CoverImage from '../../assets/banner.jpeg';
import { ToastContainer, toast } from 'react-toastify';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameRegister, setUsernameRegister] = useState('');
    const [passwordRegister, setPasswordRegister] = useState('');
    const [email, setEmail] = useState('');
    const [isRegister, setIsRegister] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = LoginAPI.authenticate({
            username: username,
            password: password,
        })
            .then(function (response) {
                localStorage.setItem('access_token', response.id_token);
                navigate(routers.home);
            })
            .catch(function (error) {
                toast.error('Sai tên đăng nhập hoặc mật khẩu', {
                    position: toast.POSITION.TOP_RIGHT,
                });
            });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const response = LoginAPI.register({
            fullName: usernameRegister,
            password: passwordRegister,
            email: email,
        })
            .then(function (res) {
                setIsRegister(false);
            })
            .catch(function (error) {
                alert('Đăng ký không thành công, đã có lỗi sảy ra !');
            });
    };

    return (
        <div className="w-full h-screen flex items-start px-6">
            <div className="relative w-1/2 h-full flex flex-col">
                <img src={CoverImage} className="w-full h-full object-cover p-10" alt="" />
            </div>
            {isRegister ? (
                <form className="w-1/2 h-full flex flex-col p-14">
                    <h1 className="text-xl text-[#060606] font-semibold">DO EXERCISE EVERY DAY 😎 !</h1>
                    <div className="w-full h-full flex flex-col justify-between">
                        <div className="mt-10">
                            <div className="w-full flex flex-col">
                                <h3 className="text-2xl font-semibold mb-4">Register</h3>
                                <p className="mb-2">Welcome to exercise app.</p>
                            </div>
                            <div className="w-full flex flex-col mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter your fullname"
                                    value={usernameRegister}
                                    onChange={(e) => setUsernameRegister(e.target.value)}
                                    className="w-full py-4 text-black border-b border-black outline-none focus:outline-none"
                                />
                                <input
                                    type="current-password"
                                    placeholder="Enter your password"
                                    value={passwordRegister}
                                    onChange={(e) => setPasswordRegister(e.target.value)}
                                    className="w-full py-4 text-black border-b border-black outline-none focus:outline-none"
                                />
                                <input
                                    type="text"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full py-4 text-black border-b border-black outline-none focus:outline-none"
                                />
                                <button
                                    className="w-full text-white bg-[#060606] rounded-md p-4 text-center mt-4"
                                    onClick={handleRegister}
                                >
                                    Register
                                </button>
                                <button
                                    className="w-full text-white bg-blue-700 rounded-md p-4 text-center mt-4"
                                    onClick={() => setIsRegister(false)}
                                >
                                    Go Back
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <form className="w-1/2 h-full flex flex-col p-14">
                    <h1 className="text-xl text-[#060606] font-semibold">DO EXERCISE EVERY DAY 😎 !</h1>
                    <div className="w-full h-full flex flex-col justify-between">
                        <div className="mt-10">
                            <div className="w-full flex flex-col">
                                <h3 className="text-2xl font-semibold mb-4">Login</h3>
                                <p className="mb-2">Welcome back ! Please enter user name and password to login.</p>
                            </div>
                            <div className="w-full flex flex-col mb-4">
                                <input
                                    type="text"
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full py-4 text-black border-b border-black outline-none focus:outline-none"
                                />
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full py-4 text-black border-b border-black outline-none focus:outline-none"
                                />
                                <div className="flex align-middle mt-2">
                                    <input type="checkbox" className="mr-2" />
                                    <label htmlFor="">Remember me !</label>
                                </div>
                                <button
                                    onClick={handleLogin}
                                    className="w-full text-white bg-[#060606] rounded-md p-4 text-center mt-4"
                                >
                                    Sign in
                                </button>
                            </div>
                            <div className="w-full flex items-center justify-center relative py-2 my-8">
                                <div className="w-full h-[1px] bg-black"></div>
                                <p className="text-xl absolute text-black/80 bg-[#ffffff]">Or</p>
                            </div>
                            <button className="w-full text-white bg-[#dd6d6d] rounded-md p-4 text-center mt-4">
                                Login with Google
                            </button>
                            <button className="w-full text-white bg-[#3f70f6] rounded-md p-4 text-center mt-4">
                                Login with Facebook
                            </button>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <p className="text-sm font-normal">
                                Don't have account?
                                <a
                                    className="font-semibold underline underline-offset-2 cursor-pointer ml-2"
                                    onClick={() => setIsRegister(true)}
                                >
                                    Create account here !
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            )}
            <ToastContainer autoClose={8000} />
        </div>
    );
}

export default Login;
