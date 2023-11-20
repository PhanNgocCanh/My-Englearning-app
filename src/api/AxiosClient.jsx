import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use(async (config) => {
    if (localStorage.getItem('access_token') != null) {
        config.headers.Authorization = 'Bearer ' + localStorage.getItem('access_token');
    }
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    (error) => {
        throw error;
    },
);

export default axiosClient;
